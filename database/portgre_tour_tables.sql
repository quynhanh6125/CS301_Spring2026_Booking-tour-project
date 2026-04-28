DROP TABLE IF EXISTS feedbacks, payments, booking_items, bookings, service_slots, services, users CASCADE;
DROP TYPE IF EXISTS user_role, service_category, service_type, booking_status, item_status, payment_type, payment_method CASCADE;
DROP SEQUENCE IF EXISTS user_seq, service_seq, booking_seq, item_seq, payment_seq, feedback_seq, slot_seq CASCADE;

CREATE TYPE user_role AS ENUM ('CUSTOMER', 'PROVIDER');
CREATE TYPE service_category AS ENUM ('HOTEL', 'TRANSPORT', 'TOUR', 'PHOTOGRAPHY', 'FOOD', 'ENTERTAINMENT');
CREATE TYPE service_type AS ENUM ('SINGLE', 'COMBO');
CREATE TYPE booking_status AS ENUM ('PENDING', 'PAID', 'SUCCESS', 'FAILED', 'CANCELLED');
CREATE TYPE item_status AS ENUM ('PENDING_PROVIDER', 'CONFIRMED', 'REJECTED','CANCELLED');
CREATE TYPE payment_type AS ENUM ('PAY', 'REFUND');
CREATE TYPE payment_method AS ENUM ('VNPAY', 'MOMO', 'BANK_TRANSFER');

CREATE SEQUENCE user_seq;
CREATE SEQUENCE service_seq;
CREATE SEQUENCE booking_seq;
CREATE SEQUENCE item_seq;
CREATE SEQUENCE payment_seq;
CREATE SEQUENCE feedback_seq;
CREATE SEQUENCE slot_seq;

CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hashed VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    business_name VARCHAR(200), -- Chỉ Provider mới điền
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id VARCHAR(20) PRIMARY KEY,
    provider_id VARCHAR(20) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    parent_id VARCHAR(20) REFERENCES services(id) ON DELETE CASCADE, -- Xóa Combo xóa luôn bản sao con
    name VARCHAR(200) NOT NULL,
	image_url VARCHAR(500),
    description TEXT,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    duration VARCHAR(100), 
    category service_category NOT NULL,
    type service_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Dùng để Soft Delete
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_slots (
    id VARCHAR(20) PRIMARY KEY,
    service_id VARCHAR(20) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    max_capacity INT NOT NULL CHECK (max_capacity > 0),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings (
    id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    voucher_code VARCHAR(50),
    total_price DECIMAL(12, 2) DEFAULT 0 CHECK (total_price >= 0),
    final_amount DECIMAL(12, 2) DEFAULT 0 CHECK (final_amount >= 0),
    status booking_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_items (
    id VARCHAR(20) PRIMARY KEY,
    booking_id VARCHAR(20) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE, -- Xóa giỏ hàng xóa sạch item
    service_id VARCHAR(20) NOT NULL REFERENCES services(id) ON DELETE RESTRICT, -- Chặn xóa Service gốc
    booked_date DATE NOT NULL,
	captured_name VARCHAR(200) NOT NULL,
    start_time_snap TIME NOT NULL, -- Lưu giờ lúc đặt để đối soát
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    captured_price DECIMAL(12, 2) NOT NULL,
    status item_status DEFAULT 'PENDING_PROVIDER'
);

CREATE TABLE payments (
    id VARCHAR(20) PRIMARY KEY,
    booking_id VARCHAR(20) NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT, -- Chặn xóa Booking đã trả tiền
    amount DECIMAL(12, 2) NOT NULL, -- Số âm nếu là Refund
    type payment_type NOT NULL,
    method payment_method NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedbacks (
    id VARCHAR(20) PRIMARY KEY,
    booking_item_id VARCHAR(20) UNIQUE NOT NULL REFERENCES booking_items(id) ON DELETE CASCADE,
    service_id VARCHAR(20) NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    customer_id VARCHAR(20) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

