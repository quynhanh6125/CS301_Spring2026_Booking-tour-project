---------------------------------------------------------
-- 1. DỌN DẸP TRƯỚC KHI TẠO (DROP)
---------------------------------------------------------
-- Xóa View
DROP VIEW IF EXISTS v_provider_dashboard CASCADE;

-- Xóa Trigger và Function liên quan
DROP TRIGGER IF EXISTS trg_after_booking_item_change ON booking_items CASCADE;
DROP FUNCTION IF EXISTS fn_update_booking_totals CASCADE;

-- Xóa Index
DROP INDEX IF EXISTS idx_service_search;

---------------------------------------------------------
-- 2. TÍNH NĂNG 1: TỰ ĐỘNG TÍNH TIỀN (TRIGGER)
-- Giúp Backend không cần lo việc cộng trừ mỗi khi thêm/bớt item
---------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_booking_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Cập nhật total_price tổng số Item còn sống bình thường
    UPDATE bookings
    SET total_price = (
        SELECT COALESCE(SUM(captured_price * quantity), 0)
        FROM booking_items
        WHERE booking_id = COALESCE(NEW.booking_id, OLD.booking_id)
		  AND status NOT IN ('REJECTED', 'CANCELLED')
    )
    WHERE id = COALESCE(NEW.booking_id, OLD.booking_id);
    
    -- 2. CẬP NHẬT QUAN TRỌNG: Chỉ set final_amount = total_price 
    -- NẾU giỏ hàng nằm ở PENDING (Chưa thanh toán) VÀ Chưa áp Voucher.
    -- (Tuyệt nhiên không đụng chạm vào tiền nếu Khách đã thanh toán hoặc đã giảm giá)
    UPDATE bookings
    SET final_amount = total_price
    WHERE id = COALESCE(NEW.booking_id, OLD.booking_id)
      AND status = 'PENDING' 
      AND (voucher_code IS NULL OR voucher_code = '');
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_after_booking_item_change
AFTER INSERT OR UPDATE OR DELETE ON booking_items
FOR EACH ROW EXECUTE FUNCTION fn_update_booking_totals();

---------------------------------------------------------
-- 3. TÍNH NĂNG 3: BẢNG THỐNG KÊ DOANH THU (VIEW)
-- Giúp Backend lấy dữ liệu Dashboard chỉ bằng 1 lệnh SELECT đơn giản
---------------------------------------------------------
CREATE OR REPLACE VIEW v_provider_dashboard AS
SELECT 
    u.id AS provider_id,
    u.business_name,
    COUNT(DISTINCT s.id) AS total_services,
    -- Chỉ đếm các Booking thực sự (không đếm lặp do join item)
    COUNT(DISTINCT b.id) AS total_bookings_received,
    -- Tính tổng tiền: Dùng subquery để tránh bị nhân đôi số liệu khi join đa tầng
    COALESCE((
        SELECT SUM(p.amount) 
        FROM payments p 
        JOIN bookings b2 ON p.booking_id = b2.id
        JOIN booking_items bi2 ON b2.id = bi2.booking_id
        JOIN services s2 ON bi2.service_id = s2.id
        WHERE s2.provider_id = u.id AND p.type = 'PAY'
    ), 0) AS total_revenue,
    -- Lấy điểm trung bình từ bảng feedbacks mới
    COALESCE((
        SELECT ROUND(AVG(f.rating)::numeric, 1)
        FROM feedbacks f
        JOIN services s3 ON f.service_id = s3.id
        WHERE s3.provider_id = u.id
    ), 0) AS average_rating
FROM users u
LEFT JOIN services s ON u.id = s.provider_id
LEFT JOIN booking_items bi ON s.id = bi.service_id
LEFT JOIN bookings b ON bi.booking_id = b.id
WHERE u.role = 'PROVIDER'
GROUP BY u.id, u.business_name;

---------------------------------------------------------
-- 5. TÍNH NĂNG 4: TÌM KIẾM TOUR THÔNG MINH (INDEX)
-- Giúp tìm kiếm tên Tour/Dịch vụ cực nhanh kể cả khi dữ liệu lớn
---------------------------------------------------------
CREATE INDEX idx_service_search ON services USING GIN (to_tsvector('simple', name || ' ' || description));