package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.entity.Booking;
import com.tourbooking.tour_management.entity.BookingItem;
import com.tourbooking.tour_management.entity.Service;
import com.tourbooking.tour_management.entity.User;
import com.tourbooking.tour_management.enums.BookingStatus;
import com.tourbooking.tour_management.enums.ItemStatus;
import com.tourbooking.tour_management.repository.BookingItemRepository;
import com.tourbooking.tour_management.repository.BookingRepository;
import com.tourbooking.tour_management.repository.UserRepository;
import com.tourbooking.tour_management.service.BookingService;
import com.tourbooking.tour_management.utils.IdGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@org.springframework.stereotype.Service
public class BookingServiceImpl implements BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private BookingItemRepository itemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private IdGeneratorService idGenerator;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public Booking getOrCreatePendingCart(String customerId) {
        return bookingRepository.findFirstByCustomer_IdAndStatus(customerId, BookingStatus.PENDING)
                .orElseGet(() -> {
                    Booking newBooking = new Booking();
                    newBooking.setId(idGenerator.generateId("BK", "booking_seq"));
                    User customer = userRepository.findById(customerId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
                    newBooking.setCustomer(customer);
                    newBooking.setStatus(BookingStatus.PENDING);
                    return bookingRepository.save(newBooking);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getCart(String customerId) {
        Booking booking = bookingRepository.findFirstByCustomer_IdAndStatus(customerId, BookingStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

        // Ép Hibernate load danh sách items
        if (booking.getItems() != null) {
            booking.getItems().size();
        }

        return booking;
    }

    @Override
    @Transactional
    public BookingItem addItemToCart(String bookingId, Service originalService, LocalDate date, LocalTime time, int quantity) {
        Booking booking = getBookingById(bookingId);
        // CHẶN TẠI ĐÂY: Nếu đơn hàng đã SUCCESS, không cho thêm món nữa
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Không thể thêm dịch vụ vào đơn hàng đã thanh toán!");
        }

        BookingItem item = new BookingItem();
        item.setId(idGenerator.generateId("BIT", "item_seq"));
        item.setBooking(booking);
        item.setService(originalService);
        item.setBookedDate(date);
        item.setStartTimeSnap(time);
        item.setQuantity(quantity);
        item.setCapturedName(originalService.getName());
        item.setCapturedPrice(originalService.getPrice());
        item.setStatus(ItemStatus.PENDING_PROVIDER);

        BookingItem savedItem = itemRepository.save(item);

        // ĐỒNG BỘ VỚI TRIGGER:
        entityManager.flush(); // Chạy Trigger tính lại tiền dưới DB
        entityManager.refresh(booking); // Cập nhật lại total_price cho Java

        return savedItem;

    }

    @Override
    @Transactional
    public void removeItemFromCart(String itemId) {
        itemRepository.deleteById(itemId);
    }

    @Override
    @Transactional
    public Booking updateStatus(String bookingId, BookingStatus status) {
        // 1. Load đơn hàng
        Booking booking = getBookingById(bookingId);

        // 2. Cập nhật trạng thái trong bộ nhớ Java
        booking.setStatus(status);

        // 3. Nếu là CANCELLED thì hủy toàn bộ item (giữ nguyên logic của bạn)
        if (status == BookingStatus.CANCELLED) {
            List<BookingItem> items = itemRepository.findByBookingId(bookingId);
            for (BookingItem item : items) {
                item.setStatus(ItemStatus.CANCELLED);
                itemRepository.save(item);
            }
        }

        // 4. [QUAN TRỌNG] Ép ghi xuống DB ngay lập tức (Flush)
        // Việc này giúp "khóa" trạng thái PAID/SUCCESS trước khi làm việc khác
        Booking savedBooking = bookingRepository.saveAndFlush(booking);

        // 5. [QUAN TRỌNG] Làm mới lại object từ DB
        // Để Java nhận được giá trị final_amount mới nhất mà Trigger vừa tính
        entityManager.refresh(savedBooking);

        return savedBooking;
    }

    @Override
    @Transactional
    public Booking applyDiscount(String bookingId, String voucherCode, BigDecimal discountAmount) {
        Booking booking = getBookingById(bookingId);

        // ĐỒNG BỘ TRƯỚC KHI TÍNH: Đảm bảo lấy đúng totalPrice mới nhất từ Trigger
        entityManager.refresh(booking);

        booking.setVoucherCode(voucherCode);
        
        BigDecimal currentTotal = booking.getTotalPrice() != null ? booking.getTotalPrice() : BigDecimal.ZERO;
        BigDecimal finalAmount = currentTotal.subtract(discountAmount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }
        booking.setFinalAmount(finalAmount);
        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));
    }

    @Override
    public BookingItem getBookingItemById(String itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món hàng này!"));
    }

    @Override
    @Transactional
    public BookingItem updateItemStatus(String itemId, ItemStatus status) {
        BookingItem item = getBookingItemById(itemId);
        item.setStatus(status);
        BookingItem updatedItem = itemRepository.save(item);

        // ĐỒNG BỘ VỚI TRIGGER: Quan trọng khi Provider REJECT khiến tiền giảm xuống
        entityManager.flush();
        entityManager.refresh(updatedItem.getBooking());

        return updatedItem;
    }

    @Override
    public List<Booking> getCustomerBookingHistory(String customerId) {
        List<Booking> history = bookingRepository.findByCustomer_IdOrderByCreatedAtDesc(customerId);
        // Ép Hibernate load items cho từng đơn hàng trong list
        history.forEach(b -> {
            if(b.getItems() != null) b.getItems().size();
        });
        return history;
    }

    @Override
    @Transactional
    public void syncBookingStatus(String bookingId) {
        Booking booking = getBookingById(bookingId);

        // CHỐT CHẶN: Chỉ xử lý đồng bộ cho những đơn đã thanh toán (PAID)
        // Nếu đơn vẫn là PENDING (giỏ hàng), tuyệt đối không được tự ý đổi trạng thái
        if (booking.getStatus() != BookingStatus.PAID) {
            return;
        }

        entityManager.flush();
        List<BookingItem> items = itemRepository.findByBookingId(bookingId);

        // Kiểm tra xem còn món nào chưa được Provider xử lý không
        boolean hasStillPendingItem = items.stream()
                .anyMatch(item -> item.getStatus() == ItemStatus.PENDING_PROVIDER);

        // Nếu vẫn còn món đang chờ -> Giữ nguyên trạng thái PAID để đợi
        if (hasStillPendingItem) {
            return;
        }

        // Nếu tất cả các món đã được Provider xác nhận hoặc từ chối
        boolean anyConfirmed = items.stream()
                .anyMatch(item -> item.getStatus() == ItemStatus.CONFIRMED);

        boolean allRejected = items.stream()
                .allMatch(item -> item.getStatus() == ItemStatus.REJECTED);

        if (allRejected) {
            booking.setStatus(BookingStatus.FAILED);
        } else if (anyConfirmed) {
            // CHUYỂN TỪ PAID SANG SUCCESS TẠI ĐÂY
            booking.setStatus(BookingStatus.SUCCESS);
        }

        bookingRepository.save(booking);
        entityManager.flush();
        entityManager.refresh(booking);
    }

}
