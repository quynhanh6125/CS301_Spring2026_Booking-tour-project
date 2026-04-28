---------------------------------------------------------
-- DỌN DẸP TOÀN BỘ DỮ LIỆU CŨ & RESET SEQUENCE
---------------------------------------------------------
TRUNCATE feedbacks, payments, booking_items, bookings, service_slots, services, users CASCADE;

ALTER SEQUENCE user_seq RESTART WITH 1;
ALTER SEQUENCE service_seq RESTART WITH 1;
ALTER SEQUENCE slot_seq RESTART WITH 1;
ALTER SEQUENCE booking_seq RESTART WITH 1;
ALTER SEQUENCE item_seq RESTART WITH 1;
ALTER SEQUENCE payment_seq RESTART WITH 1;
ALTER SEQUENCE feedback_seq RESTART WITH 1;

---------------------------------------------------------
-- 1. TẠO 10 NGƯỜI DÙNG (5 Provider & 5 Customer)
-- Password hash của "123": a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
---------------------------------------------------------
-- Providers (ID: PROV00001 -> PROV00005)
INSERT INTO users (id, username, password_hashed, role, business_name, email) VALUES 
('PROV00001', 'sunlight_cruise', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'PROVIDER', 'Sunlight Cruise Group', 'contact@sunlight.vn'),
('PROV00002', 'muong_thanh', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'PROVIDER', 'Muong Thanh Luxury', 'info@muongthanh.vn'),
('PROV00003', 'viet_travel', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'PROVIDER', 'Viet Travel Agency', 'booking@viettravel.com'),
('PROV00004', 'seaside_dining', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'PROVIDER', 'Seaside Seafood Restaurant', 'manager@seasidedining.vn'),
('PROV00005', 'halong_transport', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'PROVIDER', 'Ha Long Transport Co.', 'transport@halong.vn');

-- Customers (ID: CUST00006 -> CUST00010)
INSERT INTO users (id, username, password_hashed, role, email) VALUES 
('CUST00006', 'quocanh_dev', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'CUSTOMER', 'quocanh@dev.com'),
('CUST00007', 'lan_anh', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'CUSTOMER', 'lananh@gmail.com'),
('CUST00008', 'hoang_minh', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'CUSTOMER', 'minhhoang@yahoo.com'),
('CUST00009', 'thu_ha', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'CUSTOMER', 'ha.thu@outlook.com'),
('CUST00010', 'trong_nghia', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'CUSTOMER', 'nghia.trong@gmail.com');

-- Cập nhật sequence cho user sau khi chèn cứng ID
SELECT setval('user_seq', 10);

---------------------------------------------------------
-- 2. TẠO 50 DỊCH VỤ (Mỗi Provider 10 cái: 7 Single, 1 Combo, 2 Con)
---------------------------------------------------------

-- [PROV00001: Sunlight Cruise]
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00001', 'PROV00001', NULL, 'Tour Du Thuyền 6 Tiếng', 'Tham quan Vịnh Hạ Long, Hang Sửng Sốt', 850000, '6 hours', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776595149/pexels-quang-nguyen-vinh-222549-6877628_s6poma.jpg'),
('SERV00002', 'PROV00001', NULL, 'Buffet Hải Sản Tối', 'Tiệc tối trên boong tàu lãng mạn', 700000, '3 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776595584/pexels-quang-nguyen-vinh-222549-29000037_dewayb.jpg'),
('SERV00003', 'PROV00001', NULL, 'Chèo Kayak Hang Luồn', 'Khám phá vẻ đẹp yên bình của Vịnh', 250000, '2 hours', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776595979/pexels-robert-yang-169328337-10964091_tg1oin.jpg'),
('SERV00004', 'PROV00001', NULL, 'Lớp Học Nấu Ăn Việt', 'Học làm món ăn truyền thống trên tàu', 300000, '1.5 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776596167/pexels-westernhotel-4873348_bxj6in.jpg'),
('SERV00005', 'PROV00001', NULL, 'Dịch Vụ Flycam', 'Lưu giữ khoảnh khắc từ trên cao', 1500000, '4 hours', 'PHOTOGRAPHY', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776596240/pexels-jo-theophile-741300-2438928_ygbni2.jpg'),
('SERV00006', 'PROV00001', NULL, 'Massage Chân Thảo Dược', 'Thư giãn sau chuyến tham quan', 400000, '60 mins', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776596372/pexels-halosa-sapa-701665231-18120174_wg4msx.jpg'),
('SERV00007', 'PROV00001', NULL, 'Đưa Đón Sân Bay Vân Đồn', 'Xe Limousine 7 chỗ đời mới', 550000, '1.5 hours', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776596562/pexels-introspectivedsgn-5880098_xsnyfy.jpg'),
('SERV00008', 'PROV00001', NULL, 'Combo Sunlight Luxury', 'Gói Tour 6 tiếng & Buffet hải sản tối', 1400000, '9 hours', 'TOUR', 'COMBO', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776596737/pexels-quang-nguyen-vinh-222549-6348801_o5moo8.jpg'),
('SERV00009', 'PROV00001', 'SERV00008', 'Tour 6h (Phần Combo)', 'Lịch trình tour trong gói combo', 0, '6 hours', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776596726/pexels-quang-nguyen-vinh-222549-6877629_y0dqd3.jpg'),
('SERV00010', 'PROV00001', 'SERV00008', 'Buffet Tối (Phần Combo)', 'Tiệc tối trong gói combo', 0, '3 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776595584/pexels-quang-nguyen-vinh-222549-29000021_byibtf.jpg');

-- [PROV00002: Muong Thanh Luxury]
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00011', 'PROV00002', NULL, 'Phòng Deluxe Hướng Biển', 'Tiêu chuẩn 5 sao, view trọn Vịnh', 1800000, '1 night', 'HOTEL', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776597485/pexels-quang-nguyen-vinh-222549-14917464_pcq4p5.jpg'),
('SERV00012', 'PROV00002', NULL, 'Phòng Suite Tổng Thống', 'Không gian sang trọng bậc nhất', 5500000, '1 night', 'HOTEL', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776597599/pexels-hoang-nguy-n-669214752-27543246_on5jny.jpg'),
('SERV00013', 'PROV00002', NULL, 'Ăn Sáng Buffet 60 Món', 'Ẩm thực Á - Âu đa dạng', 450000, '4 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776597656/pexels-quang-nguyen-vinh-222549-28999496_u0dlx4.jpg'),
('SERV00014', 'PROV00002', NULL, 'Trà Chiều Hoàng Hôn', 'Thưởng thức trà tại Sky Bar tầng 34', 350000, '2 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776598133/pexels-nguyendesigner-5985229_ydgnak.jpg'),
('SERV00015', 'PROV00002', NULL, 'Vé Bơi Vô Cực & Gym', 'Sử dụng các tiện ích cao cấp', 200000, '1 day', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776598348/pexels-quang-nguyen-vinh-222549-11669558_jxss1q.jpg'),
('SERV00016', 'PROV00002', NULL, 'Gói Spa Đá Nóng', 'Thư giãn 90 phút chuyên sâu', 950000, '90 mins', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776598440/pexels-rita-bepita-2160038015-36593691_osl0cn.jpg'),
('SERV00017', 'PROV00002', NULL, 'Chụp Ảnh Sảnh Lớn', 'Địa điểm lý tưởng cho ảnh cưới', 2500000, '5 hours', 'PHOTOGRAPHY', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776598565/pexels-bertellifotografia-17056964_zokt0k.jpg'),
('SERV00018', 'PROV00002', NULL, 'Combo Stay & Dine', '1 đêm Deluxe & Buffet sáng', 2100000, '1 night', 'HOTEL', 'COMBO', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776598709/pexels-quang-nguyen-vinh-222549-14022438_hxtfzs.jpg'),
('SERV00019', 'PROV00002', 'SERV00018', 'Phòng Deluxe (Combo)', 'Lưu trú cao cấp', 0, '1 night', 'HOTEL', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776597485/pexels-quang-nguyen-vinh-222549-14013262_p85fgs.jpg'),
('SERV00020', 'PROV00002', 'SERV00018', 'Buffet Sáng (Combo)', 'Bữa sáng khởi đầu ngày mới', 0, '4 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776598053/pexels-andy-lee-222330306-34281002_qht3xc.jpg');

---------------------------------------------------------
-- [PROV00003: VIET TRAVEL AGENCY]
---------------------------------------------------------
-- 1. Tạo 7 Dịch vụ lẻ (SINGLE)
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00021', 'PROV00003', NULL, 'Xe Limousine Hà Nội - Hạ Long', 'Xe VIP ghế massage, đưa đón tận nơi phố cổ', 280000, '3 hours', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776598906/pexels-brennan-tolman-250017-9151813_lsspfk.jpg'),
('SERV00022', 'PROV00003', NULL, 'Tour Đi Bộ Phố Cổ Hạ Long', 'Khám phá văn hóa bản địa cùng hướng dẫn viên', 200000, '3 hours', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776599267/pho-co-bai-chay-4-1559_ss9590.webp'),
('SERV00023', 'PROV00003', NULL, 'Food Tour Chợ Đêm', 'Thưởng thức 5 món đặc sản Hạ Long', 450000, '4 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776599383/cho-dem-ha-long-1_rmxynl.jpg'),
('SERV00024', 'PROV00003', NULL, 'Thuê Xe Máy Tự Lái', 'Xe tay ga đời mới, bao gồm bảo hiểm', 150000, '1 day', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776599501/pexels-jepret-pret-295695-28655133_qumuas.jpg'),
('SERV00025', 'PROV00003', NULL, 'Vé Bảo Tàng Quảng Ninh', 'Tham quan kiến trúc đạt giải thế giới', 400000, '2 hours', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776599681/bao-tang-quang-ninh-1_de5php.webp'),
('SERV00026', 'PROV00003', NULL, 'Hướng Dẫn Viên Tiếng Anh/Việt', 'HDV chuyên nghiệp hỗ trợ suốt hành trình', 600000, '8 hours', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776600169/pexels-felicity-tai-7964479_kjgabd.jpg'),
('SERV00027', 'PROV00003', NULL, 'Vé Cáp Treo Sunworld', 'Ngắm toàn cảnh Vịnh từ cabin kỷ lục', 350000, '2 hours', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776600219/pexels-quang-nguyen-vinh-222549-26742974_wkytet.jpg');

-- 2. Tạo 1 Dịch vụ Combo (Mẹ) - ID: SERV00028
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) 
VALUES 
('SERV00028', 'PROV00003', NULL, 'Combo Khám Phá Tiện Lợi', 'Gồm Xe Limousine + Vé Bảo Tàng + Food Tour', 950000, '1 day', 'TOUR', 'COMBO', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776600344/pexels-skydesign-1346715-19788030_plw3v1.jpg');

-- 3. Tạo 2 Dịch vụ Con (Clones) thuộc Combo trên
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00029', 'PROV00003', 'SERV00028', 'Xe Limousine (Gói Combo)', 'Dịch vụ vận chuyển trong combo', 0, '3 hours', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776600539/pexels-autotrade-design-424968731-17246680_nnrjwz.jpg'),
('SERV00030', 'PROV00003', 'SERV00028', 'Vé Bảo Tàng (Gói Combo)', 'Vé vào cổng trong gói combo', 0, '2 hours', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776600466/pexels-cripsdog-29608796_kizqcg.jpg');

---------------------------------------------------------
-- [PROV00004: SEASIDE SEAFOOD RESTAURANT]
---------------------------------------------------------
-- 1. Tạo 7 Dịch vụ lẻ (SINGLE)
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00031', 'PROV00004', NULL, 'Set Menu Hải Sản Cao Cấp', 'Bao gồm cua hoàng đế, tôm hùm và bào ngư', 1200000, '2 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601212/pexels-dbaler-33474027_trh3gn.jpg'),
('SERV00032', 'PROV00004', NULL, 'Lẩu Hải Sản Khổng Lồ', 'Phù hợp cho nhóm bạn hoặc gia đình 4-6 người', 2000000, '2.5 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601284/pexels-jennifer-lim-216807286-13704629_muuiss.jpg'),
('SERV00033', 'PROV00004', NULL, 'Hải Sản Tươi Sống Theo Kg', 'Khách hàng tự chọn tại biển, miễn phí chế biến', 500000, '2 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601378/pexels-nareshmandal46-11119097_wdvem6.jpg'),
('SERV00034', 'PROV00004', NULL, 'Tổ Chức Sinh Nhật Bãi Biển', 'Trang trí tiệc ngoài trời trọn gói lãng mạn', 1000000, '4 hours', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601551/pexels-thirdman-8021098_yqgf98.jpg'),
('SERV00035', 'PROV00004', NULL, 'Phòng VIP Karaoke', 'Không gian riêng tư với hệ thống âm thanh hiện đại', 500000, '4 hours', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601746/pexels-pavel-danilyuk-7803689_sao5nb.jpg'),
('SERV00036', 'PROV00004', NULL, 'Tiệc BBQ Nướng Tận Bàn', 'Nhân viên phục vụ nướng hải sản trực tiếp', 800000, '3 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601846/pexels-saarteaga-18299595_xfqwv1.jpg'),
('SERV00037', 'PROV00004', NULL, 'Thợ Chụp Ảnh Tại Nhà Hàng', 'Ghi lại khoảnh khắc sum họp của gia đình', 400000, '1 hour', 'PHOTOGRAPHY', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601980/pexels-sanketgraphy-15891673_uviqk9.jpg');

-- 2. Tạo 1 Dịch vụ Combo (Mẹ) - ID: SERV00038
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) 
VALUES 
('SERV00038', 'PROV00004', NULL, 'Combo Tiệc Tối Trọn Vẹn', 'Gồm Set hải sản cao cấp + Phòng VIP riêng tư', 1500000, '4 hours', 'FOOD', 'COMBO', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776601064/pexels-quang-nguyen-vinh-222549-29000038_t1au2a.jpg');

-- 3. Tạo 2 Dịch vụ Con (Clones) gắn vào Combo mẹ
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00039', 'PROV00004', 'SERV00038', 'Set Hải Sản (Phần Combo)', 'Thực đơn chính trong gói combo', 0, '2 hours', 'FOOD', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602162/pexels-thien-binh-451964862-28439717_gwakxg.jpg'),
('SERV00040', 'PROV00004', 'SERV00038', 'Phòng VIP (Phần Combo)', 'Không gian riêng trong gói combo', 0, '4 hours', 'ENTERTAINMENT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602170/pexels-nektarios-moutakis-266968888-12756684_fc25w3.jpg');

---------------------------------------------------------
-- [PROV00005: HA LONG TRANSPORT CO.]
---------------------------------------------------------
-- 1. Tạo 7 Dịch vụ lẻ (SINGLE)
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00041', 'PROV00005', NULL, 'Thuê Ô Tô Tự Lái 4 Chỗ', 'Xe Mazda 3 hoặc City đời 2023, thủ tục nhanh gọn', 800000, '1 day', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602410/pexels-nguy-n-ti-n-th-nh-2150376175-32911908_cp1p6k.jpg'),
('SERV00042', 'PROV00005', NULL, 'Xe Điện Tham Quan Bãi Cháy', 'Xe 8 chỗ cho gia đình ngắm phố phường ven biển', 300000, '1 hour', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602495/pexels-vantik93-23355060_luvr5w.jpg'),
('SERV00043', 'PROV00005', NULL, 'Đón Tiễn Sân Bay Cát Bi', 'Xe Camry sang trọng, tài xế lịch sự chuyên nghiệp', 900000, '2 hours', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602546/pexels-chipi1189-37113870_t7pp3h.jpg'),
('SERV00044', 'PROV00005', NULL, 'Tour Trực Thăng 15 Phút', 'Trải nghiệm bay ngắm toàn cảnh Vịnh từ trên cao', 3500000, '15 mins', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602606/pexels-enes-celik-3908473-7748113_prnne6.jpg'),
('SERV00045', 'PROV00005', NULL, 'Thuê Thủy Phi Cơ', 'Khám phá Hạ Long từ góc nhìn độc đáo nhất', 4500000, '25 mins', 'TOUR', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602677/pexels-geek-wandering-420882909-29289146_bni7ko.jpg'),
('SERV00046', 'PROV00005', NULL, 'Dịch Vụ Tài Xế Riêng', 'Lái xe hộ theo yêu cầu trong vòng 8 tiếng', 500000, '8 hours', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602776/pexels-shvets-production-6974933_kjn3bb.jpg'),
('SERV00047', 'PROV00005', NULL, 'Quay Phim Hành Trình Xe', 'Lưu giữ những khoảnh khắc vui vẻ suốt chuyến đi', 600000, '4 hours', 'PHOTOGRAPHY', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776602864/pexels-kampus-8631597_ang56z.jpg');

-- 2. Tạo 1 Dịch vụ Combo (Mẹ) - ID: SERV00048
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) 
VALUES 
('SERV00048', 'PROV00005', NULL, 'Combo Vận Tải Toàn Diện', 'Gói Xe điện tham quan + Tài xế phục vụ tận tâm', 700000, 'Full day', 'TRANSPORT', 'COMBO', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776603193/pexels-n-voitkevich-7235534_irzrho.jpg');

-- 3. Tạo 2 Dịch vụ Con (Clones) gắn vào Combo mẹ
INSERT INTO services (id, provider_id, parent_id, name, description, price, duration, category, type, image_url) VALUES 
('SERV00049', 'PROV00005', 'SERV00048', 'Xe Điện (Phần Combo)', 'Sử dụng xe điện trong hành trình combo', 0, '1 hour', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776603110/pexels-quang-kh-i-557034186-36179520_mbilon.jpg'),
('SERV00050', 'PROV00005', 'SERV00048', 'Tài Xế (Phần Combo)', 'Tài xế đi kèm phục vụ suốt gói combo', 0, '8 hours', 'TRANSPORT', 'SINGLE', 'https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776603073/pexels-ketut-subiyanto-4908557_ylamsq.jpg');

-- Thiết lập Sequence để các dịch vụ tạo từ Web sẽ bắt đầu từ 51
SELECT setval('service_seq', 50);

---------------------------------------------------------
-- 3. TẠO KHUNG GIỜ VỚI GIỜ BẮT ĐẦU & SỨC CHỨA ĐA DẠNG
---------------------------------------------------------
WITH category_times (cat, st) AS (
    VALUES 
    -- TOUR: Sáng sớm, Giữa trưa, Đầu chiều
    ('TOUR'::service_category, '07:30:00'::TIME), ('TOUR'::service_category, '10:30:00'::TIME), ('TOUR'::service_category, '14:30:00'::TIME),
    -- HOTEL: Các khung giờ check-inBatch (thường từ 14h)
    ('HOTEL'::service_category, '14:00:00'::TIME), ('HOTEL'::service_category, '15:00:00'::TIME), ('HOTEL'::service_category, '16:00:00'::TIME),
    -- FOOD: Bữa sáng, Bữa trưa, Bữa tối
    ('FOOD'::service_category, '08:00:00'::TIME), ('FOOD'::service_category, '12:00:00'::TIME), ('FOOD'::service_category, '19:00:00'::TIME),
    -- TRANSPORT: Chuyến sáng, Chuyến trưa, Chuyến chiều
    ('TRANSPORT'::service_category, '07:00:00'::TIME), ('TRANSPORT'::service_category, '13:00:00'::TIME), ('TRANSPORT'::service_category, '17:00:00'::TIME),
    -- PHOTOGRAPHY: Bình minh, Nắng đẹp, Hoàng hôn
    ('PHOTOGRAPHY'::service_category, '06:30:00'::TIME), ('PHOTOGRAPHY'::service_category, '10:00:00'::TIME), ('PHOTOGRAPHY'::service_category, '16:30:00'::TIME),
    -- ENTERTAINMENT: Ca sáng, Ca chiều, Ca tối muộn
    ('ENTERTAINMENT'::service_category, '09:00:00'::TIME), ('ENTERTAINMENT'::service_category, '15:00:00'::TIME), ('ENTERTAINMENT'::service_category, '20:30:00'::TIME)
)
INSERT INTO service_slots (id, service_id, start_time, max_capacity)
SELECT 
    'SLOT' || LPAD(nextval('slot_seq')::text, 5, '0'),
    s.id,
    ct.st,
    CASE 
        WHEN s.category = 'FOOD' THEN 100       -- Nhà hàng sức chứa lớn
        WHEN s.category = 'HOTEL' THEN 50       -- Số lượng phòng lớn
        WHEN s.category = 'TOUR' THEN 45        -- Sức chứa đoàn khách
        WHEN s.category = 'TRANSPORT' THEN 15    -- Xe Limousine/Bus
        WHEN s.category = 'PHOTOGRAPHY' THEN 10  -- Số thợ ảnh tối đa trực ca
        WHEN s.category = 'ENTERTAINMENT' THEN 20 -- Sức chứa khu vui chơi
        ELSE 10 
    END AS capacity
FROM services s
JOIN category_times ct ON s.category = ct.cat
WHERE s.parent_id IS NULL; -- Chỉ tạo slot cho dịch vụ gốc

---------------------------------------------------------
-- 2. SCRIPT TỰ ĐỘNG BƠM 250 GIAO DỊCH THÀNH CÔNG
---------------------------------------------------------
DO $$
DECLARE
    service_rec RECORD;
    cust_id TEXT;
    bk_id TEXT;
    bit_id TEXT;
    pay_id TEXT;
    fb_id TEXT;
    i INTEGER; 
    counter INTEGER := 0;
    random_rating INTEGER;
    random_days_ago INTEGER;
    -- Mảng phương thức thanh toán để chọn ngẫu nhiên
    payment_methods TEXT[] := ARRAY['VNPAY', 'MOMO', 'BANK_TRANSFER'];
BEGIN
    -- Lặp qua 50 dịch vụ chính (parent_id IS NULL)
    FOR service_rec IN SELECT * FROM services WHERE parent_id IS NULL LOOP
        
        -- Tạo 5 đơn hàng cho mỗi dịch vụ
        FOR i IN 1..5 LOOP
            counter := counter + 1;
            
            -- Xoay vòng khách hàng từ CUST00006 đến CUST00010
            cust_id := 'CUST' || LPAD(((6 + (counter % 5)))::text, 5, '0');
            
            -- Sinh ID theo đúng định dạng VARCHAR(20) của bạn
            bk_id := 'BK' || LPAD(nextval('booking_seq')::text, 5, '0');
            bit_id := 'BIT' || LPAD(nextval('item_seq')::text, 5, '0');
            pay_id := 'PAY' || LPAD(nextval('payment_seq')::text, 5, '0');
            fb_id := 'FBK' || LPAD(nextval('feedback_seq')::text, 5, '0');
            
            -- Ngẫu nhiên hóa ngày tháng và đánh giá
            random_rating := (FLOOR(RANDOM() * 3) + 3)::INT; -- 3 đến 5 sao
            random_days_ago := (FLOOR(RANDOM() * 20) + 1)::INT; 

            -- Chèn Booking (Ép kiểu booking_status)
            INSERT INTO bookings (id, customer_id, total_price, final_amount, status, created_at)
            VALUES (bk_id, cust_id, service_rec.price, service_rec.price, 'SUCCESS'::booking_status, NOW() - (random_days_ago || ' days')::INTERVAL);

            -- Chèn BookingItem (Ép kiểu item_status)
            INSERT INTO booking_items (id, booking_id, service_id, booked_date, captured_name, start_time_snap, quantity, captured_price, status)
            VALUES (bit_id, bk_id, service_rec.id, CURRENT_DATE - random_days_ago, service_rec.name, '08:00:00', 1, service_rec.price, 'CONFIRMED'::item_status);

            -- Chèn Payment (Ép kiểu payment_type và payment_method)
            INSERT INTO payments (id, booking_id, amount, type, method, created_at)
            VALUES (pay_id, bk_id, service_rec.price, 'PAY'::payment_type, 
                    (payment_methods[FLOOR(RANDOM() * 3 + 1)])::payment_method, 
                    NOW() - (random_days_ago || ' days')::INTERVAL);

            -- Chèn Feedback
            INSERT INTO feedbacks (id, booking_item_id, service_id, customer_id, rating, comment, created_at)
            VALUES (fb_id, bit_id, service_rec.id, cust_id, random_rating, 
                    CASE 
                        WHEN random_rating = 5 THEN 'Dịch vụ tuyệt vời, gia đình mình rất hài lòng!'
                        WHEN random_rating = 4 THEN 'Chất lượng tốt, phục vụ chu đáo.'
                        ELSE 'Dịch vụ ổn, sẽ ủng hộ lại.'
                    END, 
                    NOW() - (random_days_ago || ' days')::INTERVAL);
        END LOOP;
    END LOOP;
END $$;