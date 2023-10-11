-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 11, 2023 at 01:55 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `createAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `rate` varchar(255) NOT NULL DEFAULT '0',
  `brandId` int DEFAULT NULL,
  `productionDate` date NOT NULL,
  `expirationDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `createAt`, `updateAt`, `rate`, `brandId`, `productionDate`, `expirationDate`) VALUES
(2, 'Labrada Muscle Mass Gainer', 'Muscle Mass Gainer 12Lbs là dòng sữa tăng cân cho người gầy thiếu cân, khó hấp thụ, bởi chỉ với một lượng phù hợp được hấp thụ Mass Gainer làm cơ thể dễ thích nghi, tăng cân lành mạnh.', '2023-10-01 09:19:29.897276', '2023-10-01 09:19:29.897276', '0', 1, '2023-09-30', '2024-09-30'),
(3, 'Rule1 R1 LBS Gainer', 'Rule 1 Mass Gainer là sản phẩm sữa tăng cân tăng cơ nhanh của hãng Rule 1. Với thành phần chất lượng, đặc biệt tỷ lệ tinh bột và protein là 5:1, giúp tăng cân nhanh nhưng tăng cơ nạc, hạn chế tích mỡ.', '2023-10-01 10:21:13.489334', '2023-10-01 10:39:10.615960', '0', 2, '2023-09-30', '2024-09-30'),
(4, 'Applied ISO XP Whey Protein Isolate', 'Nếu như bạn đang tìm kiếm một dòng Whey Protein dưới 100 Calo đồng thời không có tạp chất và chứa nguồn Protein từ bò ăn cỏ đạt chuẩn chất lượng hàng đầu đến từ Anh thì Applied Nutrition Iso XP là sản phẩm xứng đáng được bạn cân nhắc sử dụng. ', '2023-10-01 10:28:59.019351', '2023-10-01 10:39:15.251134', '0', 3, '2023-09-30', '2024-09-30'),
(5, 'PVL EAA+BCAA Complete', 'Nếu như bạn đang tìm kiếm một dòng Whey Protein dưới 100 Calo đồng thời không có tạp chất và chứa nguồn Protein từ bò ăn cỏ đạt chuẩn chất lượng hàng đầu đến từ Anh thì Applied Nutrition Iso XP là sản phẩm xứng đáng được bạn cân nhắc sử dụng. ', '2023-10-01 10:34:18.044075', '2023-10-01 10:39:19.549395', '0', 4, '2023-09-30', '2024-09-30'),
(6, 'Mutant Iso Surge', 'Mutant ISO Surge là sản phẩm 100% Whey Isolate & Hydrolysate phát triển cơ bắp nhanh nhất, với hơn 15 hương vị lựa chọn, chính hãng uy tín và giá rẻ', '2023-10-01 10:58:29.112787', '2023-10-01 11:01:34.917239', '0', 5, '2023-09-30', '2024-09-30'),
(7, 'Rule 1 Proteins', 'Whey Rule 1 Protein là sản phẩm phát triển cơ bắp cung cấp 100% Whey Isolate và Hydrolyzed hấp thu nhanh. Whey Rule 1 protein nhập khẩu chính hãng, cam kết chất lượng, giá rẻ', '2023-10-01 11:05:55.679339', '2023-10-01 11:05:55.679339', '0', 2, '2023-09-30', '2024-09-30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_4c9fb58de893725258746385e1` (`name`),
  ADD KEY `FK_ea86d0c514c4ecbb5694cbf57df` (`brandId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK_ea86d0c514c4ecbb5694cbf57df` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
