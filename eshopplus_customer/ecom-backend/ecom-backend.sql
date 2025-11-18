-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 18, 2025 at 09:57 PM
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
-- Database: `eshopplus_hyperlocal`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int UNSIGNED NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `city_id` int UNSIGNED NOT NULL,
  `area_id` int UNSIGNED DEFAULT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `line1` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `line2` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `landmark` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE `areas` (
  `id` int UNSIGNED NOT NULL,
  `city_id` int UNSIGNED NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `city_id` int UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cart_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_variant_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `price_snapshot` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_url`, `parent_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Groceries', 'groceries', 'Groceries products', NULL, NULL, 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
(2, 'Fashion', 'fashion', 'Fashion products', NULL, NULL, 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
(3, 'Electronics', 'electronics', 'Electronics products', NULL, NULL, 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'India',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `state`, `country`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Delhi', 'Delhi', 'India', 1, '2025-11-14 23:34:40', '2025-11-14 23:34:40'),
(2, 'Noida', 'Uttar Pradesh', 'India', 1, '2025-11-14 23:34:40', '2025-11-14 23:34:40'),
(3, 'Gurugram', 'Haryana', 'India', 1, '2025-11-14 23:34:40', '2025-11-14 23:34:40'),
(4, 'Varanasi', 'Uttar Pradesh', 'India', 1, '2025-11-14 23:34:40', '2025-11-14 23:34:40'),
(5, 'Patna', 'Bihar', 'India', 1, '2025-11-14 23:34:40', '2025-11-14 23:34:40'),
(6, 'Mumbai', 'Maharashtra', 'India', 1, '2025-11-14 23:34:40', '2025-11-14 23:34:40');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `address_id` int UNSIGNED NOT NULL,
  `city_id` int UNSIGNED NOT NULL,
  `status` enum('pending','accepted','packed','out_for_delivery','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` enum('cod','prepaid','wallet') COLLATE utf8mb4_unicode_ci DEFAULT 'cod',
  `subtotal` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `delivery_fee` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) DEFAULT '0.00',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `order_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_variant_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `retailer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `status` enum('pending','accepted','packed','out_for_delivery','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` int UNSIGNED NOT NULL,
  `order_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `changed_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` enum('pending','accepted','packed','out_for_delivery','delivered','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `city_id` int UNSIGNED NOT NULL,
  `name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `is_published` tinyint(1) DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `max_order_quantity` int DEFAULT NULL,
  `discount_type` enum('percentage','flat') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_value` decimal(10,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `retailer_id`, `category_id`, `city_id`, `name`, `slug`, `sku`, `description`, `unit`, `base_price`, `sale_price`, `stock`, `is_published`, `is_featured`, `max_order_quantity`, `discount_type`, `discount_value`, `created_at`, `updated_at`) VALUES
('00784feb-1e83-4a3c-9f09-882cd3cfe090', 'd90dd81f-a219-477f-8293-ba38545f2955', 3, 4, 'Varanasi Electronics Product', 'varanasi-electronics-1763216889899', '431763216889899', 'Quality electronics sourced locally in Varanasi.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('05bc4bda-97f1-490b-bc91-7e5c10179950', 'fe7e2849-f3ff-45cf-9f2b-442efe3d5eea', 1, 1, 'Delhi Groceries Product', 'delhi-groceries-1763216889642', '111763216889642', 'Quality groceries sourced locally in Delhi.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('0946545d-2f91-4752-9cf8-766468d8e344', '5fa2a04c-c3b6-4b1b-9631-a1fc8911b97e', 1, 6, 'Mumbai Groceries Product', 'mumbai-groceries-1763216890054', '611763216890054', 'Quality groceries sourced locally in Mumbai.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('0afd0aaa-0bbc-4c0e-9668-1a5f894b13ee', '5fa2a04c-c3b6-4b1b-9631-a1fc8911b97e', 2, 6, 'Mumbai Fashion Product', 'mumbai-fashion-1763216890058', '621763216890058', 'Quality fashion sourced locally in Mumbai.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('10889ad9-4a4d-4457-a1a0-129095b38508', 'fe7e2849-f3ff-45cf-9f2b-442efe3d5eea', 3, 1, 'Delhi Electronics Product', 'delhi-electronics-1763216889655', '131763216889655', 'Quality electronics sourced locally in Delhi.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('1ac6464f-60df-4d77-923d-f44e03738f39', '63492463-875c-4300-b859-0cb61373f171', 1, 2, 'Noida Groceries Product', 'noida-groceries-1763216889729', '211763216889729', 'Quality groceries sourced locally in Noida.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('308f8095-f68b-4e80-a90e-728e63fa78f4', '33b7efeb-7f62-40ae-aeeb-ca772e830693', 2, 5, 'Patna Fashion Product', 'patna-fashion-1763216889976', '521763216889976', 'Quality fashion sourced locally in Patna.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('7811846e-4128-4550-b76a-5e7961a6213f', '63492463-875c-4300-b859-0cb61373f171', 2, 2, 'Noida Fashion Product', 'noida-fashion-1763216889734', '221763216889734', 'Quality fashion sourced locally in Noida.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('8509ed1b-8f49-44b8-9722-7ec7e4546eb6', '5fa2a04c-c3b6-4b1b-9631-a1fc8911b97e', 3, 6, 'Mumbai Electronics Product', 'mumbai-electronics-1763216890062', '631763216890062', 'Quality electronics sourced locally in Mumbai.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('88d9f16b-fa09-45c6-8e83-55da7ca6fe88', 'dab2d14c-a622-4132-a502-49fa79489564', 1, 3, 'Gurugram Groceries Product', 'gurugram-groceries-1763216889809', '311763216889809', 'Quality groceries sourced locally in Gurugram.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('97cd62f6-7128-4198-8a76-0b461d394123', 'dab2d14c-a622-4132-a502-49fa79489564', 3, 3, 'Gurugram Electronics Product', 'gurugram-electronics-1763216889819', '331763216889819', 'Quality electronics sourced locally in Gurugram.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('99ce186f-0752-4d24-907a-3d1587b0e8b7', 'd90dd81f-a219-477f-8293-ba38545f2955', 2, 4, 'Varanasi Fashion Product', 'varanasi-fashion-1763216889895', '421763216889895', 'Quality fashion sourced locally in Varanasi.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('a60f9978-fe82-48a2-aceb-afad333cdc1d', 'fe7e2849-f3ff-45cf-9f2b-442efe3d5eea', 2, 1, 'Delhi Fashion Product', 'delhi-fashion-1763216889651', '121763216889651', 'Quality fashion sourced locally in Delhi.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('afb21261-a327-45bf-890f-61d41296eebb', 'dab2d14c-a622-4132-a502-49fa79489564', 2, 3, 'Gurugram Fashion Product', 'gurugram-fashion-1763216889814', '321763216889814', 'Quality fashion sourced locally in Gurugram.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('c9431f35-2880-46b7-8d3d-bdb746ac5fd6', 'd90dd81f-a219-477f-8293-ba38545f2955', 1, 4, 'Varanasi Groceries Product', 'varanasi-groceries-1763216889890', '411763216889890', 'Quality groceries sourced locally in Varanasi.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('d92df3f9-43b4-4f0d-bf18-c6bdccd30bc2', '33b7efeb-7f62-40ae-aeeb-ca772e830693', 1, 5, 'Patna Groceries Product', 'patna-groceries-1763216889972', '511763216889972', 'Quality groceries sourced locally in Patna.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('e792e0fc-dec3-44b8-bcd3-0a90f5fb7400', '33b7efeb-7f62-40ae-aeeb-ca772e830693', 3, 5, 'Patna Electronics Product', 'patna-electronics-1763216889981', '531763216889981', 'Quality electronics sourced locally in Patna.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('f1153e51-01f7-4253-8907-02f77ff972e6', '63492463-875c-4300-b859-0cb61373f171', 3, 2, 'Noida Electronics Product', 'noida-electronics-1763216889738', '231763216889738', 'Quality electronics sourced locally in Noida.', 'pcs', 199.00, 149.00, 50, 1, 1, NULL, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `created_at`, `updated_at`) VALUES
('0a332f08-0b05-47d2-aa8f-728d0ebe740d', 'd92df3f9-43b4-4f0d-bf18-c6bdccd30bc2', 'https://placehold.co/600x600?text=Patna', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('1e36b433-cdbb-4180-9d9b-3b888d7c7793', 'c9431f35-2880-46b7-8d3d-bdb746ac5fd6', 'https://placehold.co/600x600?text=Varanasi', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('45516871-08f8-468b-9c68-699e6ad5061d', '97cd62f6-7128-4198-8a76-0b461d394123', 'https://placehold.co/600x600?text=Gurugram', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('4c1bf3e8-c00a-40fd-bedc-71d2d0141a82', '88d9f16b-fa09-45c6-8e83-55da7ca6fe88', 'https://placehold.co/600x600?text=Gurugram', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('584a4f2a-1cab-42c7-9c3c-d1c3896bb16f', 'f1153e51-01f7-4253-8907-02f77ff972e6', 'https://placehold.co/600x600?text=Noida', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('60118b4f-bb0c-4545-b72e-eab7089fd476', 'e792e0fc-dec3-44b8-bcd3-0a90f5fb7400', 'https://placehold.co/600x600?text=Patna', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('62979fec-6ed8-490e-8ff7-bcb2da450f9c', '99ce186f-0752-4d24-907a-3d1587b0e8b7', 'https://placehold.co/600x600?text=Varanasi', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('77192ce3-4317-48f9-9144-d07b39f7376c', 'afb21261-a327-45bf-890f-61d41296eebb', 'https://placehold.co/600x600?text=Gurugram', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('8fe6102d-3852-4967-bba3-94f4bde47e3d', '10889ad9-4a4d-4457-a1a0-129095b38508', 'https://placehold.co/600x600?text=Delhi', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('908d0820-0445-4f4a-b3cc-3392036d3cf5', '00784feb-1e83-4a3c-9f09-882cd3cfe090', 'https://placehold.co/600x600?text=Varanasi', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('a32f79c4-86c0-4655-b161-81243ad2aa6f', '1ac6464f-60df-4d77-923d-f44e03738f39', 'https://placehold.co/600x600?text=Noida', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('afa59fb9-89ce-4442-a1dc-4adf8c5b24c7', '05bc4bda-97f1-490b-bc91-7e5c10179950', 'https://placehold.co/600x600?text=Delhi', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('d538daa1-6474-4d5c-8c25-0903d392151e', '0afd0aaa-0bbc-4c0e-9668-1a5f894b13ee', 'https://placehold.co/600x600?text=Mumbai', 1, '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('d56ee24f-47cc-4a6d-bb68-36a2a0acaa38', '8509ed1b-8f49-44b8-9722-7ec7e4546eb6', 'https://placehold.co/600x600?text=Mumbai', 1, '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('d870dd6f-5804-437f-bef0-b8a0e5749bba', '0946545d-2f91-4752-9cf8-766468d8e344', 'https://placehold.co/600x600?text=Mumbai', 1, '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('d8dad76d-07c0-4311-a0a7-0ec1572cbc95', 'a60f9978-fe82-48a2-aceb-afad333cdc1d', 'https://placehold.co/600x600?text=Delhi', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('dbdbe643-3ff0-47e6-a108-c3ce90f494e5', '7811846e-4128-4550-b76a-5e7961a6213f', 'https://placehold.co/600x600?text=Noida', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('efa4604b-f5e1-4aff-a97e-e89f34bd81de', '308f8095-f68b-4e80-a90e-728e63fa78f4', 'https://placehold.co/600x600?text=Patna', 1, '2025-11-15 14:28:09', '2025-11-15 14:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `label` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `label`, `sku`, `price`, `sale_price`, `stock`, `unit`, `created_at`, `updated_at`) VALUES
('0fc3fecc-81f5-4281-87b7-ea1c0f6b64cc', 'f1153e51-01f7-4253-8907-02f77ff972e6', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('110034e0-3497-4046-8e62-3f6afe2c6061', '00784feb-1e83-4a3c-9f09-882cd3cfe090', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('2ab878fe-e676-4cfc-b665-2a6aa943a3e3', 'c9431f35-2880-46b7-8d3d-bdb746ac5fd6', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('392a9d4a-009e-4037-b311-a599905f66c8', '97cd62f6-7128-4198-8a76-0b461d394123', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('3ae291b1-14e7-442a-b664-aae93e3d34a1', '8509ed1b-8f49-44b8-9722-7ec7e4546eb6', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('40ebe2fc-9075-4359-8f8c-4a273019692f', '88d9f16b-fa09-45c6-8e83-55da7ca6fe88', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('442548c8-a7a2-4a8b-8c76-008a1b6d1ac1', 'afb21261-a327-45bf-890f-61d41296eebb', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('53fad668-64ba-4d3c-b496-98eb33170c9a', 'e792e0fc-dec3-44b8-bcd3-0a90f5fb7400', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('5a8c17a5-8779-422e-876d-7e50963d6a32', '10889ad9-4a4d-4457-a1a0-129095b38508', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('68543435-27af-4a17-9efe-ee162a43fd93', '7811846e-4128-4550-b76a-5e7961a6213f', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('83602e41-c308-4b06-bb72-25986796a39a', '0afd0aaa-0bbc-4c0e-9668-1a5f894b13ee', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('8e5c06a8-27e8-4929-88fc-ba30b569149c', 'a60f9978-fe82-48a2-aceb-afad333cdc1d', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('91f99074-3eaa-4e88-9cf5-ab4c06c597c3', '99ce186f-0752-4d24-907a-3d1587b0e8b7', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('9c47ff4a-f416-4295-99af-58113c701f27', '1ac6464f-60df-4d77-923d-f44e03738f39', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('a28ce3f6-d661-49f8-b054-799c013b0813', '308f8095-f68b-4e80-a90e-728e63fa78f4', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('b6d71dcf-91a5-43a2-906f-746752de3458', '0946545d-2f91-4752-9cf8-766468d8e344', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('e4507f1a-8b92-43da-88cd-d1d76be696ad', '05bc4bda-97f1-490b-bc91-7e5c10179950', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('fdc4164d-7ccd-4789-b7bc-76163ad63bdd', 'd92df3f9-43b4-4f0d-bf18-c6bdccd30bc2', 'Standard Pack', NULL, 199.00, 149.00, 50, 'pcs', '2025-11-15 14:28:09', '2025-11-15 14:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `retailers`
--

CREATE TABLE `retailers` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `city_id` int UNSIGNED NOT NULL,
  `area_id` int UNSIGNED DEFAULT NULL,
  `store_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line1` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line2` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `verification_notes` text COLLATE utf8mb4_unicode_ci,
  `delivery_radius_km` int DEFAULT '10',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `retailers`
--

INSERT INTO `retailers` (`id`, `user_id`, `city_id`, `area_id`, `store_name`, `slug`, `phone`, `gst_number`, `logo_url`, `banner_url`, `address_line1`, `address_line2`, `pincode`, `latitude`, `longitude`, `status`, `verification_notes`, `delivery_radius_km`, `description`, `created_at`, `updated_at`) VALUES
('33b7efeb-7f62-40ae-aeeb-ca772e830693', '7d37c10b-1b3d-41a7-a432-dc019456a31d', 5, NULL, 'Patna Tech Hub Electronics', 'patna-tech-hub-electronics-1763216889970', '9999999999', '29ABCDE1234F2Z5', NULL, NULL, 'Patna Central Market', NULL, '400001', NULL, NULL, 'approved', NULL, 15, 'Gadgets, accessories, and devices from verified local sellers.', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('5fa2a04c-c3b6-4b1b-9631-a1fc8911b97e', '528f116a-9b3b-40c8-90b4-eedbab40ad1f', 6, NULL, 'Mumbai Metro Fresh Mart', 'mumbai-metro-fresh-mart-1763216890052', '9999999999', '29ABCDE1234F2Z5', NULL, NULL, 'Mumbai Central Market', NULL, '110001', NULL, NULL, 'approved', NULL, 15, 'Daily essentials, groceries, and more from your neighbourhood marketplace.', '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('63492463-875c-4300-b859-0cb61373f171', '5d24ef4f-b3aa-481d-bedf-d1fdb97626bb', 2, NULL, 'Noida Tech Hub Electronics', 'noida-tech-hub-electronics-1763216889727', '9999999999', '29ABCDE1234F2Z5', NULL, NULL, 'Noida Central Market', NULL, '400001', NULL, NULL, 'approved', NULL, 15, 'Gadgets, accessories, and devices from verified local sellers.', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('d90dd81f-a219-477f-8293-ba38545f2955', '60423f8a-99fb-4384-aaf4-a41a38e82992', 4, NULL, 'Varanasi Urban Fashion House', 'varanasi-urban-fashion-house-1763216889888', '9999999999', '29ABCDE1234F2Z5', NULL, NULL, 'Varanasi Central Market', NULL, '201301', NULL, NULL, 'approved', NULL, 15, 'Trendy apparel and accessories curated for modern shoppers.', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('dab2d14c-a622-4132-a502-49fa79489564', '0970768e-6783-4349-9a7e-8f376b82e9d2', 3, NULL, 'Gurugram Metro Fresh Mart', 'gurugram-metro-fresh-mart-1763216889808', '9999999999', '29ABCDE1234F2Z5', NULL, NULL, 'Gurugram Central Market', NULL, '110001', NULL, NULL, 'approved', NULL, 15, 'Daily essentials, groceries, and more from your neighbourhood marketplace.', '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('fe7e2849-f3ff-45cf-9f2b-442efe3d5eea', '401a39b9-499a-4b34-a2e8-b1902831999c', 1, NULL, 'Delhi Urban Fashion House', 'delhi-urban-fashion-house-1763216889640', '9999999999', '29ABCDE1234F2Z5', NULL, NULL, 'Delhi Central Market', NULL, '201301', NULL, NULL, 'approved', NULL, 15, 'Trendy apparel and accessories curated for modern shoppers.', '2025-11-15 14:28:09', '2025-11-15 14:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `first_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','retailer','customer') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `status` enum('active','inactive','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `default_city_id` int UNSIGNED DEFAULT NULL,
  `is_email_verified` tinyint(1) DEFAULT '0',
  `last_login_at` datetime DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password`, `role`, `status`, `default_city_id`, `is_email_verified`, `last_login_at`, `reset_token`, `created_at`, `updated_at`) VALUES
('08de9b97-89fb-42ed-a74c-ece96ebd16f8', 'Super', 'Admin', 'admin@eshopplus.local', '9999999999', '$2a$10$q6r6Z58LU0ygN6vrmpBB5O.1Vo43ea8A38fR5pKLUz4MHxS9gnvTi', 'admin', 'active', 1, 1, NULL, NULL, '2025-11-14 23:34:40', '2025-11-14 23:34:40'),
('0970768e-6783-4349-9a7e-8f376b82e9d2', 'Gurugram', 'Seller', 'retailer-3@eshopplus.local', '983000000', '$2a$10$.zDCtGZnY13bJ51yHatXuO1F0Wb7/LAE9ApoEo6jghhEJF.vYU/IW', 'retailer', 'active', 3, 1, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('401a39b9-499a-4b34-a2e8-b1902831999c', 'Delhi', 'Seller', 'retailer-1@eshopplus.local', '981000000', '$2a$10$Ok4HoT9gvJaFWmoYZCYtV./SdW4eDVm66fT/cX7oD7pmglRrpxvG2', 'retailer', 'active', 1, 1, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('528f116a-9b3b-40c8-90b4-eedbab40ad1f', 'Mumbai', 'Seller', 'retailer-6@eshopplus.local', '986000000', '$2a$10$oiRifySjiJd9LrYyX2b6a.GbO4HTY5FnVTtC2PUrmvUxJAxIbtk6G', 'retailer', 'active', 6, 1, NULL, NULL, '2025-11-15 14:28:10', '2025-11-15 14:28:10'),
('5d24ef4f-b3aa-481d-bedf-d1fdb97626bb', 'Noida', 'Seller', 'retailer-2@eshopplus.local', '982000000', '$2a$10$Ay/ngPrJFqv68b5E0nZPxuhT4nES17iHR5p5iVAkF4YLIxQAQe5WK', 'retailer', 'active', 2, 1, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('5da963ca-556b-498e-8d04-a72535fbc843', 'Demo', 'Customer', 'customer@eshopplus.local', '9898765432', '$2a$10$D3/xXOdq4G9iPvOjduu6D.6BuHccdzeDSQF0Om2NJmRSGxpooYtTG', 'customer', 'active', NULL, 1, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('60423f8a-99fb-4384-aaf4-a41a38e82992', 'Varanasi', 'Seller', 'retailer-4@eshopplus.local', '984000000', '$2a$10$6C1zrzZgxMkcWgGNfOLiuO3zmGlU9QGG2rJ/WHVOxD8npRA9pkBnu', 'retailer', 'active', 4, 1, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09'),
('7d37c10b-1b3d-41a7-a432-dc019456a31d', 'Patna', 'Seller', 'retailer-5@eshopplus.local', '985000000', '$2a$10$6juQ2T08jdl3EVaiB9TtmuvQ8DCCwvQNro1SwK88GjkjJzj9Aw40W', 'retailer', 'active', 5, 1, NULL, NULL, '2025-11-15 14:28:09', '2025-11-15 14:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `city_id` int UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `area_id` (`area_id`);

--
-- Indexes for table `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `product_variant_id` (`product_variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `product_variant_id` (`product_variant_id`),
  ADD KEY `retailer_id` (`retailer_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `retailer_id` (`retailer_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `retailers`
--
ALTER TABLE `retailers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `area_id` (`area_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `default_city_id` (`default_city_id`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `addresses_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `addresses_ibfk_3` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `areas`
--
ALTER TABLE `areas`
  ADD CONSTRAINT `areas_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_4` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `retailers`
--
ALTER TABLE `retailers`
  ADD CONSTRAINT `retailers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `retailers_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `retailers_ibfk_3` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`default_city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
