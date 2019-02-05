SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `db_merchant` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `db_merchant`;

CREATE TABLE `price` (
  `id` int(10) UNSIGNED NOT NULL,
  `price` decimal(15,2) UNSIGNED NOT NULL,
  `inserted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fk_product` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `price` (`id`, `price`, `inserted_at`, `fk_product`) VALUES
(2, '3.00', '2017-07-06 04:00:00', 63),
(3, '5.00', '2018-06-19 04:00:00', 63),
(4, '6.00', '2019-01-30 04:00:00', 63),
(5, '0.01', '2018-09-02 20:07:03', 68),
(6, '0.20', '2019-01-23 04:00:00', 68),
(7, '8.00', '2018-04-11 04:00:00', 65),
(8, '5.00', '2018-06-12 04:00:00', 65),
(9, '4.00', '2018-11-07 04:00:00', 65),
(10, '5.00', '2019-01-31 04:00:00', 65),
(11, '1.00', '2018-12-30 04:00:00', 69),
(12, '2.00', '2019-01-30 04:00:00', 69),
(13, '1.00', '2019-02-01 04:00:00', 66);

CREATE TABLE `product` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `quantity` float UNSIGNED NOT NULL DEFAULT '0',
  `type` enum('protein','carbohydrate','grease','vitamin') CHARACTER SET latin1 DEFAULT NULL,
  `inserted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `product` (`id`, `name`, `quantity`, `type`, `inserted_at`, `deleted_at`) VALUES
(63, 'Carne (kg)', 0, 'protein', '2019-02-05 19:51:51', NULL),
(64, 'Cerveza (botella)', 12, NULL, '2019-02-05 19:52:57', NULL),
(65, 'Cebolla (Kg)', 0.25, 'vitamin', '2019-02-05 19:56:08', NULL),
(66, 'Juego de mango (L)', 0.75, 'vitamin', '2019-02-05 19:58:58', NULL),
(68, 'Cafe (g)', 300, NULL, '2019-02-05 20:00:52', NULL),
(69, 'Mantequilla (mediana)', 1.5, 'grease', '2019-02-05 20:03:34', NULL);


ALTER TABLE `price`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product` (`fk_product`);

ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);


ALTER TABLE `price`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `product`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;


ALTER TABLE `price`
  ADD CONSTRAINT `price_ibfk_1` FOREIGN KEY (`fk_product`) REFERENCES `product` (`id`);
COMMIT;
