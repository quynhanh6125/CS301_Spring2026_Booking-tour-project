package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.dto.ProviderDashboardDTO;
import com.tourbooking.tour_management.dto.ServiceResponseDTO;
import com.tourbooking.tour_management.entity.Service;
import com.tourbooking.tour_management.enums.ServiceType;
import com.tourbooking.tour_management.repository.ServiceRepository;
import com.tourbooking.tour_management.service.PermissionService;
import com.tourbooking.tour_management.service.ServiceService;
import com.tourbooking.tour_management.utils.IdGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private IdGeneratorService idGenerator;

    @Override
    public Service createService(Service service) {
        permissionService.isProvider(service.getProvider().getId());

        // 2.  Nếu có cha (đang tạo món cho combo)
        if (service.getParent() != null && service.getParent().getId() != null) {
            String parentId = service.getParent().getId();
            // Kiểm tra xem Provider có quyền quản lý Combo mẹ này không
            permissionService.canManageService(service.getProvider().getId(), parentId);

            // Đảm bảo cha phải là loại COMBO
            Service parent = getServiceById(parentId);
            if (parent.getType() != ServiceType.COMBO) {
                throw new RuntimeException("Chỉ có thể thêm dịch vụ con vào một COMBO");
            }
        }

        service.setId(idGenerator.generateId("SERV", "service_seq"));
        service.setIsActive(true);
        return serviceRepository.save(service);
    }

    @Override
    public Service updateService(String providerId, String serviceId, Service details) {
        permissionService.canManageService(providerId, serviceId);
        Service existing = getServiceById(serviceId);

        // Chỉ cập nhật nếu trường đó không null
        if (details.getName() != null) existing.setName(details.getName());
        if (details.getImageUrl() != null) existing.setImageUrl(details.getImageUrl());
        if (details.getDescription() != null) existing.setDescription(details.getDescription());
        if (details.getPrice() != null) existing.setPrice(details.getPrice());
        if (details.getDuration() != null) existing.setDuration(details.getDuration());
        if (details.getCategory() != null) existing.setCategory(details.getCategory());
        if (details.getType() != null) existing.setType(details.getType());

        return serviceRepository.save(existing);
    }

    @Override
    public void deleteService(String providerId, String serviceId) {
        permissionService.canManageService(providerId, serviceId);
        Service service = getServiceById(serviceId);
        service.setIsActive(false);
        serviceRepository.save(service);
    }

    @Override
    public void restoreService(String providerId, String serviceId) {
        permissionService.canManageService(providerId, serviceId);
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại!"));
        service.setIsActive(true);
        serviceRepository.save(service);
    }

    @Override
    public Service addExistingToCombo(String providerId, String serviceId, String parentId) {
        permissionService.canManageService(providerId, serviceId);
        permissionService.canManageService(providerId, parentId);

        Service original = getServiceById(serviceId);
        Service parent = getServiceById(parentId);

        // KIỂM TRA:
        if (original.getType() == ServiceType.COMBO) {
            throw new RuntimeException("Không thể clone một Combo vào trong một Combo khác");
        }

        // Logic Clone: Tạo bản ghi mới dựa trên bản cũ nhưng gắn Parent mới
        Service clone = new Service();
        clone.setId(idGenerator.generateId("SERV", "service_seq"));
        clone.setName(original.getName());
        clone.setImageUrl(original.getImageUrl());
        clone.setDescription(original.getDescription());
        clone.setPrice(original.getPrice());
        clone.setDuration(original.getDuration());
        clone.setCategory(original.getCategory());
        clone.setType(original.getType());
        clone.setProvider(original.getProvider());
        clone.setParent(parent); // Gắn vào Combo cha
        clone.setIsActive(true);

        return serviceRepository.save(clone);
    }

    @Override
    public List<Service> getAllServices() {
        return serviceRepository.findByIsActiveTrue();
    }

    @Override
    public Service getServiceById(String id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ " + id + " không tồn tại!"));
    }

    @Override
    public List<Service> getServicesByProvider(String providerId) {
        return serviceRepository.findByProviderId(providerId);
    }

    @Override
    public List<Service> getSubServices(String parentId) {
        return serviceRepository.findByParentId(parentId);
    }

    @Override
    public List<ServiceResponseDTO> getAllServicesWithRatings() {
        List<Object[]> results = serviceRepository.findAllServicesWithRatings();

        return results.stream().map(row -> {
            // Lấy theo index tương ứng trong câu lệnh SELECT ở Repo
            String id = (String) row[0];
            String name = (String) row[1];
            String imageUrl = (String) row[2];
            String description = (String) row[3];
            java.math.BigDecimal price = (java.math.BigDecimal) row[4];
            String duration = (String) row[5];
            String category = (String) row[6]; // Native query trả về String cho Enum

            // Lưu ý: Postgres trả về BigDecimal cho ROUND/AVG, cần convert sang Double
            Object avgObj = row[7];
            Double avgRating = (avgObj != null) ? Double.valueOf(avgObj.toString()) : 0.0;

            // Count thường trả về Long hoặc BigInteger
            Object countObj = row[8];
            Long reviewCount = (countObj != null) ? Long.valueOf(countObj.toString()) : 0L;

            return new ServiceResponseDTO(
                    id, name, imageUrl,description,
                    price, duration, category,
                    avgRating,
                    reviewCount
            );
        }).collect(Collectors.toList());
    }
    @Override
    public List<Service> searchServices(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllServices();
        }

        // Biến "Hạ Lo" thành "Hạ:* & Lo:*"
        String formattedQuery = java.util.Arrays.stream(query.trim().split("\\s+"))
                .map(word -> word + ":*")
                .collect(java.util.stream.Collectors.joining(" & "));

        return serviceRepository.searchServices(formattedQuery);
    }

    @Override
    public ProviderDashboardDTO getProviderDashboard(String providerId) {
        // 1. Kiểm tra quyền
        permissionService.isProvider(providerId);

        // 2. Lấy danh sách kết quả
        List<Object[]> results = serviceRepository.getProviderDashboardStats(providerId);

        // 3. Kiểm tra xem có dữ liệu không
        if (results.isEmpty()) {
            throw new RuntimeException("Chưa có dữ liệu thống kê cho Provider: " + providerId);
        }

        // 4. Lấy dòng đầu tiên (ĐÂY CHÍNH LÀ MẢNG CÁC CỘT)
        Object[] row = results.get(0);

        // 5. Trích xuất dữ liệu (Index dựa trên VIEW của bạn)
        // Cột 0: provider_id, 1: business_name, 2: total_services,
        // 3: total_bookings_received, 4: total_revenue, 5: average_rating

        String pId = (String) row[0];
        String bName = (String) row[1];

        // Sử dụng toString() rồi parse để tránh lỗi kiểu dữ liệu số của Postgres
        Long tServices = (row[2] != null) ? Long.valueOf(row[2].toString()) : 0L;
        Long tBookings = (row[3] != null) ? Long.valueOf(row[3].toString()) : 0L;

        java.math.BigDecimal tRevenue = (java.math.BigDecimal) row[4];
        if (tRevenue == null) tRevenue = java.math.BigDecimal.ZERO;

        Double avgRating = (row[5] != null) ? Double.valueOf(row[5].toString()) : 0.0;

        return new ProviderDashboardDTO(pId, bName, tServices, tBookings, tRevenue, avgRating);
    }
}