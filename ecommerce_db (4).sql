-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 07, 2023 lúc 08:14 AM
-- Phiên bản máy phục vụ: 10.3.16-MariaDB
-- Phiên bản PHP: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `address`
--

INSERT INTO `address` (`id`, `address`, `user_id`) VALUES
(3, 'duong 30/2, phuong Xuan Khanh, quan Ninh Kieu, Can Tho', 2),
(4, 'quan 1, Tp. HCM', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brand`
--

CREATE TABLE `brand` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `brand`
--

INSERT INTO `brand` (`id`, `name`, `description`) VALUES
(1, 'Iphone', 'điện thoại iphone'),
(2, 'xiaomi', 'điện thoại xiaomi'),
(3, 'oppo', 'điện thoại oppo'),
(4, 'samsung', 'điện thoại samsung'),
(6, 'realme', 'điện thoại realme');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL,
  `value` int(11) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `number` int(11) NOT NULL,
  `start_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `end_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `active`, `number`, `start_date`, `end_date`) VALUES
(10, 'IQ3JL76F', '1', 10, 1, 1, '3/24/2023', '3/28/2023'),
(11, 'HCVVX5JB', '1', 10, 1, 2, '3/25/2023', '3/28/2023'),
(12, 'N9VSW8T1', '1', 10, 1, 2, '3/25/2023', '3/25/2023'),
(13, 'X4JXTZDM', '1', 10, 1, 2, '3/22/2023', '3/24/2023'),
(14, '9NCA2654', '1', 10, 1, 2, '3/26/2023', '3/28/2023'),
(15, 'WV9QZ1LR', '1', 50, 1, 5, '3/26/2023', '3/28/2023'),
(16, '0BZ3GPYI', '2', 6997, 1, 2, '3/26/2023', '3/28/2023'),
(17, 'J6LWLXKP', '1', 20, 1, 1, '4/1/2023', '4/28/2023'),
(18, 'VYJS16L2', '1', 10, 1, 1, '4/1/2023', '4/28/2023');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `coupon_condition`
--

CREATE TABLE `coupon_condition` (
  `id` int(11) NOT NULL,
  `type` enum('0','1','2','3') COLLATE utf8_unicode_ci NOT NULL,
  `condition` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `coupon_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `rate` int(11) NOT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `images`
--

CREATE TABLE `images` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('avatar','thumbnail','options','desc') COLLATE utf8_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `images`
--

INSERT INTO `images` (`id`, `type`, `image_url`, `user_id`, `product_id`) VALUES
('05fc0e23-aace-43e8-8d65-79af715b2b5c', 'options', 'uploads\\images\\2023\\3\\31_13_21-redmi-note-11-den_1679052711.jpg', NULL, 7),
('0ef32115-2d84-4f94-96c6-1bd6ed2e9b14', 'options', 'uploads\\images\\2023\\3\\31_11_30-thumbnail-600x600px_1642730215.jpg', NULL, 2),
('0f9270fc-8518-4537-bb6c-9ea16ef997f7', 'options', 'uploads\\images\\2023\\3\\31_13_40-thumbnailgtneo3_1650506895.jpg', NULL, 11),
('1eb27915-23b0-456d-8414-a34b54e3c9db', 'options', 'uploads\\images\\2023\\3\\31_11_30-trang_1614318534.jpg', NULL, 1),
('21ceb806-8e95-4aca-9859-d846b8ef0459', 'thumbnail', 'uploads\\images\\2023\\3\\31_11_23-den_1614318544.jpg', NULL, 1),
('2b0ce500-7d93-4906-b6f1-c3a81555864d', 'thumbnail', 'uploads\\images\\2023\\3\\31_11_38-trang_1607225962.jpg', NULL, 3),
('31e77a13-a4d9-48fa-8846-c3d0d21abf5f', 'options', 'uploads\\images\\2023\\3\\31_13_36-q3s-thumb_1634692953.jpg', NULL, 10),
('410b6c8e-3fbd-477d-ad0a-435b5861aabc', 'options', 'uploads\\images\\2023\\3\\31_11_38-trang_1607225962.jpg', NULL, 3),
('442d13eb-f43f-42f0-8241-35e9bd827f37', 'options', 'uploads\\images\\2023\\3\\31_11_23-trang_1614318534.jpg.jpg', NULL, 1),
('46176a79-ed11-4623-84f3-c3e3de34ab9a', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_21-redmi-note-11-den_1679052711.jpg', NULL, 7),
('47c8ca44-5f43-4e18-83c9-1c6f6689fb12', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_21-den_1614318544.jpg', NULL, 8),
('47f1607f-84cb-4a40-886d-686975b8d169', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_21-k50den_1655533614.jpg', NULL, 6),
('4a45ab1c-5fbf-45d1-a01b-da64152fdb22', 'options', 'uploads\\images\\2023\\3\\31_13_21-iphone-12-xanh_1614830057jpg_1647858237.jpg', NULL, 5),
('4c4e22c1-f1f4-43d7-a376-68d215bab512', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_21-iphone-12-xanh_1614830057jpg_1647858237.jpg', NULL, 5),
('4d321342-9a57-4af6-8ede-a048cc343035', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_40-thumbnailgtneo3_1650506895.jpg', NULL, 11),
('4e667b23-772e-4c0f-af9a-9c6c8c499b80', 'options', 'uploads\\images\\2023\\3\\31_13_40-oppo-find-x6-pro_1675134622.jpg', NULL, 12),
('626080c6-9833-4717-9999-e27f08aec1b4', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_40-oppo-reno-8t_1673336158.jpg', NULL, 13),
('6f254a45-dddb-47bd-bad1-be67f4a94f40', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_36-den_1614318544.jpg', NULL, 9),
('7630f54c-8f5b-42b6-bc7c-7254f03150ef', 'options', 'uploads\\images\\2023\\3\\31_13_21-den_1614318544.jpg', NULL, 8),
('83700ac0-0b30-4337-a851-7763120cee23', 'options', 'uploads\\images\\2023\\3\\31_13_21-k50den_1655533614.jpg', NULL, 6),
('9a056bda-4825-4861-8995-5341a3d02bf0', 'options', 'uploads\\images\\2023\\3\\31_11_23-den_1614318544.jpg', NULL, 1),
('9ed87b3d-d982-4f29-b277-8b84c6345ea6', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_36-q3s-thumb_1634692953.jpg', NULL, 10),
('a8e5f283-6ceb-4148-90ab-3665b03a6499', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_21-13-pro-max_1632877766.jpg', NULL, 4),
('b71cd4a7-d805-4d75-8e21-26b4c111df1a', 'options', 'uploads\\images\\2023\\3\\31_13_36-den_1614318544.jpg', NULL, 9),
('c84c4019-0720-49e3-8063-bb4e4dd53004', 'options', 'uploads\\images\\2023\\3\\31_13_21-13-pro-max_1632877766.jpg', NULL, 4),
('d0403e42-c893-4185-a4ee-6c48f0ff167c', 'thumbnail', 'uploads\\images\\2023\\3\\31_13_40-oppo-find-x6-pro_1675134622.jpg', NULL, 12),
('d3900efb-d074-4620-a2a0-618b6ed42dfd', 'options', 'uploads\\images\\2023\\3\\31_13_40-oppo-reno-8t_1673336158.jpg', NULL, 13),
('d7eee042-94e4-4908-a300-c492f55f69cd', 'options', 'uploads\\images\\2023\\3\\31_13_21-xanh_1637555141.jpg', NULL, 4),
('d80087bd-3950-4791-a083-a121742853a6', 'thumbnail', 'uploads\\images\\2023\\3\\31_11_30-thumbnail-600x600px_1642730215.jpg', NULL, 2),
('f34fef66-a0ce-40f4-be4f-f5028fd396e3', 'options', 'uploads\\images\\2023\\3\\31_13_21-k50xam_1655533629.jpg', NULL, 6),
('fc8398b1-620a-43fa-8bfc-ccc2a9f29480', 'options', 'uploads\\images\\2023\\3\\31_13_21-vang_1637555141.jpg', NULL, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory_inbound_notes`
--

CREATE TABLE `inventory_inbound_notes` (
  `id` int(11) NOT NULL,
  `status` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `create_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `id` int(11) NOT NULL,
  `date` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `type` enum('0','1') COLLATE utf8_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `amount` bigint(20) NOT NULL,
  `product_option_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('0','1','2','3','4','5','6','7') COLLATE utf8_unicode_ci NOT NULL,
  `is_read` tinyint(4) NOT NULL DEFAULT 0,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `status` enum('0','1','2','3','4','5','6') COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `createAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updateAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `address` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_history`
--

CREATE TABLE `order_history` (
  `id` int(11) NOT NULL,
  `done_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `amount` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `product_option_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `inventory_inbound_note_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `method` enum('0','1','2','3') COLLATE utf8_unicode_ci NOT NULL DEFAULT '2',
  `amount` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_paid` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `prices`
--

CREATE TABLE `prices` (
  `id` int(11) NOT NULL,
  `price` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `prices`
--

INSERT INTO `prices` (`id`, `price`) VALUES
(1, 6990000),
(2, 7000000),
(3, 7000000),
(4, 5990000),
(5, 8990000),
(6, 26390000),
(7, 25300000),
(8, 25300000),
(9, 15990000),
(10, 6990000),
(11, 5300000),
(12, 3599000),
(13, 6899000),
(14, 7990000),
(15, 7990000),
(16, 7990000),
(17, 9990000),
(18, 12000000),
(19, 0),
(20, 99999999);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `price_history`
--

CREATE TABLE `price_history` (
  `id` int(11) NOT NULL,
  `old_price` bigint(20) NOT NULL,
  `new_price` bigint(20) NOT NULL,
  `update_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `price_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `createAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updateAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `brand_id` int(11) DEFAULT NULL,
  `rate` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `createAt`, `updateAt`, `brand_id`, `rate`) VALUES
(1, 'Xiaomi Redmi K40 Pro', 'Xiaomi Redmi K40 Pro Máy mới nguyên seal 100% chưa qua sử dụng. Bộ phụ kiện chuẩn bao gồm thân máy, sạc, cáp, ốp lưng, que chọc sim và sách hướng dẫn sử dụng. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP toàn diện cả nguồn, màn hình, vân tay.', '2023-03-31 11:28:09.914964', '2023-04-06 11:05:28.000000', 2, '4'),
(2, 'Samsung Galaxy S21 FE 5G', 'Samsung Galaxy S21 FE chính hãng Samsung Việt Nam. Tình trạng đã kích hoạt, FULLBOX đủ phụ kiện chuẩn đi kèm bao gồm củ sạc, dây sạc, sách HDSD. Sản phẩm còn bảo hành chính hãng tại các trung tâm bảo hành Samsung trên toàn quốc', '2023-03-31 11:33:07.302929', '2023-03-31 11:33:07.302929', 4, '0'),
(3, 'Iphone 11', 'Điểm khác biệt lớn nhất từ các dòng iPhone 11 trở đi đến từ cụm camera được đặt trong khung vuông cùng đèn Flash, đây cũng chính là điểm nhận diện thương hiệu mà iPhone 11 hấp dẫn người dùng. Máy có màn hình 6.1 inches tỷ lệ 19.5:9 cùng với trọng lượng 194g nên cảm giác cầm nắm trên iPhone 11 khá đầm tay, không bị quá nặng. Khung viền kim loại kết hợp với mặt lưng kính trên iPhone 11 cho cảm giác sang trọng, tuy nhiên phần mặt lưng này để lại kha khá mồ hôi và dấu vân tay khi sử dụng. Tất nhiên điều này cũng rất dễ khắc phục khi gần như ai cũng sắm cho mình một ốp lưng để bảo vệ toàn diện cho khung máy.', '2023-03-31 12:30:24.528202', '2023-03-31 12:30:24.528202', 1, '0'),
(4, 'iPhone 13 Pro Max', 'Điểm khác biệt lớn nhất từ các dòng iPhone 11 trở đi đến từ cụm camera được đặt trong khung vuông cùng đèn Flash, đây cũng chính là điểm nhận diện thương hiệu mà iPhone 11 hấp dẫn người dùng. Máy có màn hình 6.1 inches tỷ lệ 19.5:9 cùng với trọng lượng 194g nên cảm giác cầm nắm trên iPhone 11 khá đầm tay, không bị quá nặng. Khung viền kim loại kết hợp với mặt lưng kính trên iPhone 11 cho cảm giác sang trọng, tuy nhiên phần mặt lưng này để lại kha khá mồ hôi và dấu vân tay khi sử dụng. Tất nhiên điều này cũng rất dễ khắc phục khi gần như ai cũng sắm cho mình một ốp lưng để bảo vệ toàn diện cho khung máy.', '2023-03-31 13:23:24.902499', '2023-04-06 11:01:55.000000', 1, '3'),
(5, 'iPhone 12 Pro', 'Sức nóng của bộ ba iPhone 11 còn chưa giảm thì mới đây sự ra mắt của bộ bốn iPhone 12 lại mang đến cho người dùng thêm rất nhiều sự lựa chọn ở phân khúc điện thoại cao cấp. Thời điểm hiện tại khi mà giá iPhone 12 chỉ từ hơn 15 triệu cho phiên bản hàng chính hãng Đã kích hoạt tại Dienthoaihay.vn thì mức giá này có thể tiếp cận với rất nhiều người dùng mong muốn có được một sản phẩm mới nhất đến  từ nhà Táo khuyết.', '2023-03-31 13:26:18.689507', '2023-03-31 13:26:18.689507', 1, '0'),
(6, 'Xiaomi Redmi K50', 'Sức nóng của bộ ba iPhone 11 còn chưa giảm thì mới đây sự ra mắt của bộ bốn iPhone 12 lại mang đến cho người dùng thêm rất nhiều sự lựa chọn ở phân khúc điện thoại cao cấp. Thời điểm hiện tại khi mà giá iPhone 12 chỉ từ hơn 15 triệu cho phiên bản hàng chính hãng Đã kích hoạt tại Dienthoaihay.vn thì mức giá này có thể tiếp cận với rất nhiều người dùng mong muốn có được một sản phẩm mới nhất đến  từ nhà Táo khuyết.', '2023-03-31 13:29:05.446284', '2023-03-31 13:29:05.446284', 2, '0'),
(7, 'Xiaomi Redmi Note 11', 'Các dòng Redmi Note của nhà Xiaomi luôn nhận được rất nhiều sự quan tâm từ phía người dùng bởi một cấu hình tốt mà mức giá lại vô cùng phải chăng. Mới đây thì nhà sản xuất này tiếp tục cho ra mắt bộ ba Redmi Note 11 Series với hàng loạt những cải tiến cũng như thay đổi so với dòng Redmi Note 10 tiền nhiệm. Với 500.000 smartphone Redmi Note 11 series bán ra trong một giờ tính riêng trong thị trường nội địa, điều này chứng tỏ bộ ba này sẽ rất hot trong cuối năm 2021 này. Bài viết dưới đây mình chỉ đề cập đến Redmi Note 11, sản phẩm có mức giá “bình dân” nhất trong bộ ba Redmi Note 11 Series.', '2023-03-31 13:32:17.174730', '2023-03-31 13:32:17.174730', 2, '0'),
(8, 'realme Q5 Pro', 'realme Q5 Pro (realme GT Neo 3T) - Máy mới 100% nguyên seal hộp, chưa qua sử dụng. Bộ sản phẩm chuẩn của máy bao gồm vỏ hộp ngoài, thân máy, củ sạc, dây sạc, que chọc sim, sách HDSD và ốp lưng tặng kèm. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP toàn diện cả nguồn, màn hình, vân tay.', '2023-03-31 13:35:18.035101', '2023-03-31 13:35:18.035101', 6, '0'),
(9, 'realme GT Neo 2 5G', 'realme GT Neo 2 - Máy mới 100% nguyên seal hộp, chưa qua sử dụng. Bộ sản phẩm chuẩn của máy bao gồm vỏ hộp ngoài, thân máy, củ sạc, dây sạc, que chọc sim, sách HDSD và ốp lưng tặng kèm. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP toàn diện cả nguồn, màn hình, vân tay.', '2023-03-31 13:37:12.094053', '2023-03-31 13:37:12.094053', 6, '0'),
(10, 'realme Q3s 5G', 'realme GT Neo 2 - Máy mới 100% nguyên seal hộp, chưa qua sử dụng. Bộ sản phẩm chuẩn của máy bao gồm vỏ hộp ngoài, thân máy, củ sạc, dây sạc, que chọc sim, sách HDSD và ốp lưng tặng kèm. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP toàn diện cả nguồn, màn hình, vân tay.', '2023-03-31 13:38:11.430557', '2023-03-31 13:38:11.430557', 6, '0'),
(11, 'realme GT Neo 3', 'realme GT Neo 3 - Máy mới 100% nguyên seal hộp, chưa qua sử dụng. Bộ sản phẩm chuẩn của máy bao gồm vỏ hộp ngoài, thân máy, củ sạc, dây sạc, que chọc sim, sách HDSD và ốp lưng tặng kèm. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP toàn diện cả nguồn, màn hình, vân tay.', '2023-03-31 13:41:19.211663', '2023-03-31 13:41:19.211663', 6, '0'),
(12, 'Oppo Find X6', 'Máy mới 100% nguyên seal hộp, chưa qua sử dụng. Bộ sản phẩm chuẩn của máy bao gồm vỏ hộp ngoài, thân máy, củ sạc, dây sạc, que chọc sim, sách HDSD và ốp lưng tặng kèm. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP toàn diện cả nguồn, màn hình, vân tay.', '2023-03-31 13:42:41.796253', '2023-03-31 13:42:41.796253', 3, '0'),
(13, 'Oppo Reno 8T', 'Máy mới 100% nguyên seal hộp, chưa qua sử dụng. Bộ sản phẩm chuẩn của máy bao gồm vỏ hộp ngoài, thân máy, củ sạc, dây sạc, que chọc sim, sách HDSD và ốp lưng tặng kèm. Duy nhất tại Dienthoaihay.vn sản phẩm được bảo hành VIP toàn diện cả nguồn, màn hình, vân tay.', '2023-03-31 13:43:47.977074', '2023-03-31 13:43:47.977074', 3, '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productOptions`
--

CREATE TABLE `productOptions` (
  `id` int(11) NOT NULL,
  `color` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ram` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rom` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `price_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `image` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `productOptions`
--

INSERT INTO `productOptions` (`id`, `color`, `ram`, `rom`, `product_id`, `price_id`, `warehouse_id`, `image`) VALUES
(1, 'black', '8GB', '128GB', 1, 1, 34, '9a056bda-4825-4861-8995-5341a3d02bf0'),
(3, 'white', '6GB', '128GB', 1, 3, 36, '1eb27915-23b0-456d-8414-a34b54e3c9db'),
(4, 'black', '8GB', '128GB', 2, 4, 37, '0ef32115-2d84-4f94-96c6-1bd6ed2e9b14'),
(5, 'black', '8GB', '128GB', 3, 5, 38, '410b6c8e-3fbd-477d-ad0a-435b5861aabc'),
(6, 'black', '8GB', '128GB', 4, 6, 39, 'c84c4019-0720-49e3-8063-bb4e4dd53004'),
(7, 'yello', '6GB', '128GB', 4, 7, 40, 'fc8398b1-620a-43fa-8bfc-ccc2a9f29480'),
(8, 'blue', '6GB', '128GB', 4, 8, 41, 'd7eee042-94e4-4908-a300-c492f55f69cd'),
(9, 'black', '8GB', '128GB', 5, 9, 42, '4a45ab1c-5fbf-45d1-a01b-da64152fdb22'),
(10, 'black', '8GB', '128GB', 6, 10, 43, '83700ac0-0b30-4337-a851-7763120cee23'),
(11, 'grey', '8GB', '128GB', 6, 11, 44, 'f34fef66-a0ce-40f4-be4f-f5028fd396e3'),
(12, 'black', '8GB', '128GB', 7, 12, 45, '05fc0e23-aace-43e8-8d65-79af715b2b5c'),
(13, 'black', '8GB', '128GB', 8, 13, 46, '7630f54c-8f5b-42b6-bc7c-7254f03150ef'),
(14, 'black', '8GB', '128GB', 9, 14, 47, 'b71cd4a7-d805-4d75-8e21-26b4c111df1a'),
(15, 'white', '8GB', '256GB', 10, 15, 48, '31e77a13-a4d9-48fa-8846-c3d0d21abf5f'),
(16, 'blue', '8GB', '256GB', 11, 16, 49, '0f9270fc-8518-4537-bb6c-9ea16ef997f7'),
(17, 'white', '8GB', '256GB', 12, 17, 50, '4e667b23-772e-4c0f-af9a-9c6c8c499b80'),
(18, 'white', '16GB', '512GB', 13, 18, 51, 'd3900efb-d074-4620-a2a0-618b6ed42dfd');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `specifications`
--

CREATE TABLE `specifications` (
  `id` int(11) NOT NULL,
  `key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `specifications`
--

INSERT INTO `specifications` (`id`, `key`, `value`, `product_id`) VALUES
(1, 'Pin, Sạc', '5000 mAh 120 W', 1),
(2, 'Camera sau', '128MP', 1),
(3, 'Camera trước', '50MP', 1),
(4, 'Màn hình', 'Super AMOLED', 1),
(5, 'Độ phân giải', '120HZ', 1),
(6, 'Pin, Sạc', '5000 mAh 120 W', 2),
(7, 'Camera sau', '128MP', 2),
(8, 'Camera trước', '50MP', 2),
(9, 'Màn hình', 'Super AMOLED', 2),
(10, 'Độ phân giải', '120HZ', 2),
(11, 'Loa', 'Có/ Loa kép', 2),
(12, 'Pin, Sạc', '5000 mAh 120 W', 3),
(13, 'Camera sau', '128MP', 3),
(14, 'Camera trước', '50MP', 3),
(15, 'Màn hình', 'Super AMOLED', 3),
(16, 'Loa', 'Có/ Loa kép', 3),
(17, 'Độ phân giải', '120HZ', 3),
(18, 'Pin, Sạc', '5000 mAh 120 W', 4),
(19, 'Camera sau', '128MP', 4),
(20, 'Camera trước', '50MP', 4),
(21, 'Màn hình', 'Super AMOLED', 4),
(22, 'Loa', 'Có/ Loa kép', 4),
(23, 'Độ phân giải', '120HZ', 4),
(24, 'Pin, Sạc', '5000 mAh 120 W', 5),
(25, 'Camera sau', '128MP', 5),
(26, 'Camera trước', '50MP', 5),
(27, 'Màn hình', 'Super AMOLED', 5),
(28, 'Độ phân giải', '120HZ', 5),
(29, 'Loa', 'Có/ Loa kép', 5),
(30, 'Pin, Sạc', '5000 mAh 120 W', 6),
(31, 'Camera sau', '128MP', 6),
(32, 'Camera trước', '50MP', 6),
(33, 'Màn hình', 'Super AMOLED', 6),
(34, 'Độ phân giải', '120HZ', 6),
(35, 'Loa', 'Có/ Loa kép', 6),
(36, 'Pin, Sạc', '5000 mAh 120 W', 7),
(37, 'Camera sau', '128MP', 7),
(38, 'Camera trước', '50MP', 7),
(39, 'Màn hình', 'Super AMOLED', 7),
(40, 'Độ phân giải', '120HZ', 7),
(41, 'Loa', 'Có/ Loa kép', 7),
(42, 'Pin, Sạc', '5000 mAh 120 W', 8),
(43, 'Camera sau', '128MP', 8),
(44, 'Camera trước', '50MP', 8),
(45, 'Màn hình', 'Super AMOLED', 8),
(46, 'Độ phân giải', '120HZ', 8),
(47, 'Loa', 'Có/ Loa kép', 8),
(48, 'Pin, Sạc', '5000 mAh 120 W', 9),
(49, 'Camera sau', '128MP', 9),
(50, 'Camera trước', '50MP', 9),
(51, 'Màn hình', 'Super AMOLED', 9),
(52, 'Độ phân giải', '120HZ', 9),
(53, 'Loa', 'Có/ Loa kép', 9),
(54, 'Pin, Sạc', '5000 mAh 120 W', 10),
(55, 'Camera sau', '128MP', 10),
(56, 'Camera trước', '50MP', 10),
(57, 'Màn hình', 'Super AMOLED', 10),
(58, 'Độ phân giải', '120HZ', 10),
(59, 'Loa', 'Có/ Loa kép', 10),
(60, 'Pin, Sạc', '5000 mAh 120 W', 11),
(61, 'Camera sau', '128MP', 11),
(62, 'Camera trước', '50MP', 11),
(63, 'Màn hình', 'Super AMOLED', 11),
(64, 'Độ phân giải', '120HZ', 11),
(65, 'Loa', 'Có/ Loa kép', 11),
(66, 'Pin, Sạc', '5000 mAh 120 W', 12),
(67, 'Camera sau', '128MP', 12),
(68, 'Camera trước', '50MP', 12),
(69, 'Màn hình', 'Super AMOLED', 12),
(70, 'Độ phân giải', '120HZ', 12),
(71, 'Loa', 'Có/ Loa kép', 12),
(72, 'Pin, Sạc', '5000 mAh 120 W', 13),
(73, 'Camera sau', '128MP', 13),
(74, 'Camera trước', '50MP', 13),
(75, 'Màn hình', 'Super AMOLED', 13),
(76, 'Độ phân giải', '120HZ', 13),
(77, 'Loa', 'Có/ Loa kép', 13);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `timelines`
--

CREATE TABLE `timelines` (
  `id` int(11) NOT NULL,
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `order_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lastName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `role` enum('admin','member') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'member',
  `createAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `default_address` int(11) DEFAULT NULL,
  `unread_message` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstName`, `lastName`, `phone`, `role`, `createAt`, `isActive`, `default_address`, `unread_message`) VALUES
(2, 'nhans@gmail.com', '$2a$08$T74EqTliJBNgIicaWwmKO.RGemkzUEcCMMacAaaOt8s1b.ffDlDle', 'Nguyen Trung', 'Nhan', '0912312313', 'admin', '2023-03-12 11:12:39.563418', 1, 3, 0),
(3, 'nhanss@gmail.com', '$2a$08$RxdxV4TKW.klyosqJaSIAusmYppyRbn.FfmnQFqWRAkpVA4/sQhEa', 'Nguyen Trung', 'Nhan2', NULL, 'member', '2023-03-23 19:52:00.945178', 1, NULL, 0),
(4, 'admin@gmail.com', '$2a$08$A8BnX91mplW0R8n13.7ru.xRy7y73CS6YGMtRffPqtkCatBKrDapu', 'Nguyen', 'Nhan', NULL, 'admin', '2023-04-02 21:55:26.446886', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warehouse`
--

CREATE TABLE `warehouse` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `warehouse`
--

INSERT INTO `warehouse` (`id`, `quantity`) VALUES
(1, 39),
(2, 59),
(3, 0),
(4, 0),
(5, 0),
(6, 0),
(7, 0),
(8, 0),
(9, 0),
(10, 0),
(11, 0),
(12, 0),
(13, 0),
(14, 0),
(15, 0),
(16, 5),
(17, 0),
(18, 10),
(19, 0),
(20, 0),
(21, 0),
(22, 0),
(23, 0),
(24, 0),
(25, 0),
(26, 0),
(27, 0),
(28, 2),
(29, 0),
(30, 24),
(31, 12),
(32, 3),
(33, 0),
(34, 18),
(35, 0),
(36, 9),
(37, 10),
(38, 9),
(39, 4),
(40, 10),
(41, 9),
(42, 10),
(43, 10),
(44, 10),
(45, 10),
(46, 0),
(47, 10),
(48, 8),
(49, 10),
(50, 10),
(51, 10),
(52, 0),
(53, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `work_queue`
--

CREATE TABLE `work_queue` (
  `id` int(11) NOT NULL,
  `type` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL,
  `is_done` tinyint(4) NOT NULL DEFAULT 0,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_35cd6c3fafec0bb5d072e24ea20` (`user_id`);

--
-- Chỉ mục cho bảng `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `coupon_condition`
--
ALTER TABLE `coupon_condition`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_33d4d4388c31429cc4fc6883351` (`coupon_id`);

--
-- Chỉ mục cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2477562980219ad72afcbe73530` (`product_id`),
  ADD KEY `FK_121c67d42dd543cca0809f59901` (`user_id`);

--
-- Chỉ mục cho bảng `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_decdf86f650fb765dac7bd091a` (`user_id`),
  ADD KEY `FK_96fabbb1202770b8e6a58bf6f1d` (`product_id`);

--
-- Chỉ mục cho bảng `inventory_inbound_notes`
--
ALTER TABLE `inventory_inbound_notes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9ac4f4f0347d4d1e717bbb20300` (`product_option_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9a8a82462cab47c73d25f49261f` (`user_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_5b3e94bd2aedc184f9ad8c1043` (`payment_id`),
  ADD KEY `FK_a922b820eeef29ac1c6800e826a` (`user_id`),
  ADD KEY `FK_6284f0f60e4cb96c12ff96f0f15` (`coupon_id`);

--
-- Chỉ mục cho bảng `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5dd538d6ee529025a2d8fac5146` (`product_option_id`),
  ADD KEY `FK_145532db85752b29c57d2b7b1f1` (`order_id`),
  ADD KEY `FK_7f4a469f9a72cbb311626e3c444` (`inventory_inbound_note_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `prices`
--
ALTER TABLE `prices`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `price_history`
--
ALTER TABLE `price_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8f851de1b863afc6cf797e92b6f` (`price_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_4c9fb58de893725258746385e1` (`name`),
  ADD KEY `FK_1530a6f15d3c79d1b70be98f2be` (`brand_id`);

--
-- Chỉ mục cho bảng `productOptions`
--
ALTER TABLE `productOptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_c41c82a6f891d5503f874db763` (`price_id`),
  ADD UNIQUE KEY `REL_50151a045e720c18bd8fdd122b` (`warehouse_id`),
  ADD UNIQUE KEY `REL_c8d3383c857cba8ffd7230af76` (`image`),
  ADD KEY `FK_49677f87ad61a8b2a31f33c8a2c` (`product_id`);

--
-- Chỉ mục cho bảng `specifications`
--
ALTER TABLE `specifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f6b3dd512fc0bc9374d7e468ffc` (`product_id`);

--
-- Chỉ mục cho bảng `timelines`
--
ALTER TABLE `timelines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3c63e8656a950bb9442b6cfbc31` (`order_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD UNIQUE KEY `IDX_a000cca60bcf04454e72769949` (`phone`);

--
-- Chỉ mục cho bảng `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `work_queue`
--
ALTER TABLE `work_queue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_3dc93222633ee5cfa9540963d9` (`product_id`),
  ADD KEY `FK_b36ed7686a4650461dd6a71d58e` (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `coupon_condition`
--
ALTER TABLE `coupon_condition`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `inventory_inbound_notes`
--
ALTER TABLE `inventory_inbound_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order_history`
--
ALTER TABLE `order_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `prices`
--
ALTER TABLE `prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `price_history`
--
ALTER TABLE `price_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `productOptions`
--
ALTER TABLE `productOptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `specifications`
--
ALTER TABLE `specifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT cho bảng `timelines`
--
ALTER TABLE `timelines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT cho bảng `work_queue`
--
ALTER TABLE `work_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `FK_35cd6c3fafec0bb5d072e24ea20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `coupon_condition`
--
ALTER TABLE `coupon_condition`
  ADD CONSTRAINT `FK_33d4d4388c31429cc4fc6883351` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `FK_121c67d42dd543cca0809f59901` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2477562980219ad72afcbe73530` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `FK_96fabbb1202770b8e6a58bf6f1d` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_decdf86f650fb765dac7bd091a6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD CONSTRAINT `FK_9ac4f4f0347d4d1e717bbb20300` FOREIGN KEY (`product_option_id`) REFERENCES `productOptions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_9a8a82462cab47c73d25f49261f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_5b3e94bd2aedc184f9ad8c10439` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_6284f0f60e4cb96c12ff96f0f15` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a922b820eeef29ac1c6800e826a` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FK_145532db85752b29c57d2b7b1f1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_5dd538d6ee529025a2d8fac5146` FOREIGN KEY (`product_option_id`) REFERENCES `productOptions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_7f4a469f9a72cbb311626e3c444` FOREIGN KEY (`inventory_inbound_note_id`) REFERENCES `inventory_inbound_notes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `price_history`
--
ALTER TABLE `price_history`
  ADD CONSTRAINT `FK_8f851de1b863afc6cf797e92b6f` FOREIGN KEY (`price_id`) REFERENCES `prices` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK_1530a6f15d3c79d1b70be98f2be` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `productOptions`
--
ALTER TABLE `productOptions`
  ADD CONSTRAINT `FK_49677f87ad61a8b2a31f33c8a2c` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_50151a045e720c18bd8fdd122bd` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_c41c82a6f891d5503f874db7636` FOREIGN KEY (`price_id`) REFERENCES `prices` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_c8d3383c857cba8ffd7230af76a` FOREIGN KEY (`image`) REFERENCES `images` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `specifications`
--
ALTER TABLE `specifications`
  ADD CONSTRAINT `FK_f6b3dd512fc0bc9374d7e468ffc` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `timelines`
--
ALTER TABLE `timelines`
  ADD CONSTRAINT `FK_3c63e8656a950bb9442b6cfbc31` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `work_queue`
--
ALTER TABLE `work_queue`
  ADD CONSTRAINT `FK_3dc93222633ee5cfa9540963d95` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b36ed7686a4650461dd6a71d58e` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
