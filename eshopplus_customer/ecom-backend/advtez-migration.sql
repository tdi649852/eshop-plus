-- Advtez Platform MVP - Database Migration
-- This file extends the existing ecom-backend.sql schema with Advtez marketplace features

-- ========================================
-- MODIFY EXISTING TABLES
-- ========================================

-- Add multi-language support and additional fields to products table
ALTER TABLE `products`
  ADD COLUMN `name_hi` VARCHAR(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `name`,
  ADD COLUMN `name_ar` VARCHAR(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `name_hi`,
  ADD COLUMN `description_hi` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `description`,
  ADD COLUMN `description_ar` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `description_hi`,
  ADD COLUMN `article_number` VARCHAR(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `sku`,
  ADD COLUMN `brand_id` INT UNSIGNED DEFAULT NULL AFTER `category_id`,
  ADD COLUMN `mrp` DECIMAL(10,2) DEFAULT NULL AFTER `base_price`,
  MODIFY COLUMN `stock` INT DEFAULT '0',
  ADD COLUMN `status` ENUM('draft','published','out_of_stock','discontinued') COLLATE utf8mb4_unicode_ci DEFAULT 'draft' AFTER `is_published`;

-- Add Advtez retailer fields
ALTER TABLE `retailers`
  ADD COLUMN `unique_id` VARCHAR(30) COLLATE utf8mb4_unicode_ci UNIQUE DEFAULT NULL AFTER `id`,
  ADD COLUMN `business_type` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `store_name`,
  ADD COLUMN `pan_number` VARCHAR(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `gst_number`,
  ADD COLUMN `kyc_status` ENUM('pending','verified','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' AFTER `status`,
  ADD COLUMN `kyc_document_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `kyc_status`,
  ADD COLUMN `subscription_tier` ENUM('free','basic','premium') COLLATE utf8mb4_unicode_ci DEFAULT 'free' AFTER `kyc_document_url`,
  ADD COLUMN `brand_name` VARCHAR(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `store_name`,
  ADD COLUMN `brand_logo_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `logo_url`,
  ADD COLUMN `discount_enabled` TINYINT(1) DEFAULT '0' AFTER `delivery_radius_km`,
  ADD COLUMN `store_discount_percentage` DECIMAL(5,2) DEFAULT '0.00' AFTER `discount_enabled`,
  ADD COLUMN `is_featured` TINYINT(1) DEFAULT '0' AFTER `status`,
  ADD COLUMN `followers_count` INT UNSIGNED DEFAULT '0' AFTER `is_featured`;

-- Add order number and parcel tracking support
ALTER TABLE `orders`
  ADD COLUMN `order_number` VARCHAR(20) COLLATE utf8mb4_unicode_ci UNIQUE DEFAULT NULL AFTER `id`,
  ADD COLUMN `commission_percentage` DECIMAL(5,2) DEFAULT '5.00' AFTER `total`,
  ADD COLUMN `commission_amount` DECIMAL(10,2) DEFAULT '0.00' AFTER `commission_percentage`,
  ADD COLUMN `return_requested` TINYINT(1) DEFAULT '0' AFTER `status`,
  ADD COLUMN `return_reason` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `return_requested`,
  ADD COLUMN `return_status` ENUM('none','requested','approved','rejected','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'none' AFTER `return_reason`,
  MODIFY COLUMN `status` ENUM('pending','received','processed','packed','shipped','out_for_delivery','delivered','cancelled','returned') COLLATE utf8mb4_unicode_ci DEFAULT 'pending';

-- Add role for users
ALTER TABLE `users`
  ADD COLUMN `date_of_birth` DATE DEFAULT NULL AFTER `phone`,
  ADD COLUMN `gender` ENUM('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `date_of_birth`,
  ADD COLUMN `wallet_balance` DECIMAL(10,2) DEFAULT '0.00' AFTER `default_city_id`;

-- ========================================
-- CREATE NEW TABLES
-- ========================================

-- Retailer Branches
CREATE TABLE IF NOT EXISTS `branches` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` VARCHAR(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` VARCHAR(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line2` VARCHAR(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city_id` INT UNSIGNED NOT NULL,
  `pincode` VARCHAR(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `status` ENUM('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `is_main` TINYINT(1) DEFAULT '0',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `retailer_id` (`retailer_id`),
  KEY `city_id` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` VARCHAR(160) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `logo_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT '1',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `retailer_id` (`retailer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Unified Discounts Table (handles category, product, and store-wide discounts)
CREATE TABLE IF NOT EXISTS `discounts` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` ENUM('store_wide','category','product') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` ENUM('percentage','fixed_price') COLLATE utf8mb4_unicode_ci DEFAULT 'percentage',
  `value` DECIMAL(10,2) NOT NULL,
  `applicable_to` JSON DEFAULT NULL COMMENT 'Array of category_ids or product_ids',
  `validity_start` DATETIME DEFAULT NULL,
  `validity_end` DATETIME DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT '1',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `retailer_id` (`retailer_id`),
  KEY `type` (`type`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hot Deals
CREATE TABLE IF NOT EXISTS `hot_deals` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` VARCHAR(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external_link` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validity_start` DATETIME NOT NULL,
  `validity_end` DATETIME NOT NULL,
  `is_active` TINYINT(1) DEFAULT '1',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `retailer_id` (`retailer_id`),
  KEY `validity_end` (`validity_end`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bank Offers
CREATE TABLE IF NOT EXISTS `bank_offers` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `bank_name` VARCHAR(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `offer_details` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_percentage` DECIMAL(5,2) DEFAULT NULL,
  `validity_start` DATETIME NOT NULL,
  `validity_end` DATETIME NOT NULL,
  `terms_conditions` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT '1',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `retailer_id` (`retailer_id`),
  KEY `validity_end` (`validity_end`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` ENUM('credit','debit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` ENUM('commission','refund','order_payment','withdrawal','add_money','subscription','advertisement') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `balance_after` DECIMAL(10,2) NOT NULL,
  `reference_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Order ID, withdrawal ID, etc.',
  `message` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` ENUM('pending','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_gateway_response` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`),
  KEY `category` (`category`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Withdrawal Requests
CREATE TABLE IF NOT EXISTS `withdrawal_requests` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `bank_name` VARCHAR(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` VARCHAR(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ifsc_code` VARCHAR(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_holder_name` VARCHAR(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` ENUM('pending','approved','rejected','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_notes` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `processed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  KEY `transaction_id` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advertisements
CREATE TABLE IF NOT EXISTS `advertisements` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` ENUM('category_top','discount_top','deal','home_banner') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` INT UNSIGNED DEFAULT NULL,
  `city_id` INT UNSIGNED DEFAULT NULL,
  `duration_days` INT NOT NULL,
  `design_image_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `external_link` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount_paid` DECIMAL(10,2) NOT NULL,
  `impressions` INT UNSIGNED DEFAULT '0',
  `clicks` INT UNSIGNED DEFAULT '0',
  `status` ENUM('pending','active','expired','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `start_date` DATETIME DEFAULT NULL,
  `end_date` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `retailer_id` (`retailer_id`),
  KEY `type` (`type`),
  KEY `category_id` (`category_id`),
  KEY `city_id` (`city_id`),
  KEY `status` (`status`),
  KEY `end_date` (`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners (for homepage carousel)
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_type` ENUM('product','category','retailer','external') COLLATE utf8mb4_unicode_ci DEFAULT 'external',
  `link_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `city_id` INT UNSIGNED DEFAULT NULL COMMENT 'NULL means all cities',
  `display_order` INT DEFAULT '0',
  `is_active` TINYINT(1) DEFAULT '1',
  `start_date` DATETIME DEFAULT NULL,
  `end_date` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `city_id` (`city_id`),
  KEY `is_active` (`is_active`),
  KEY `display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Retailer Followers (many-to-many)
CREATE TABLE IF NOT EXISTS `retailer_followers` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `customer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_follower` (`customer_id`,`retailer_id`),
  KEY `customer_id` (`customer_id`),
  KEY `retailer_id` (`retailer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wishlist Retailers (many-to-many)
CREATE TABLE IF NOT EXISTS `wishlist_retailers` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `retailer_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wishlist_retailer` (`user_id`,`retailer_id`),
  KEY `user_id` (`user_id`),
  KEY `retailer_id` (`retailer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Parcels (for parcel tracking)
CREATE TABLE IF NOT EXISTS `order_parcels` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `order_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` VARCHAR(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tracking_number` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `courier_name` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` ENUM('preparing','shipped','in_transit','out_for_delivery','delivered') COLLATE utf8mb4_unicode_ci DEFAULT 'preparing',
  `shipped_at` DATETIME DEFAULT NULL,
  `delivered_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` ENUM('order','promotion','system','retailer_update','wallet') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` VARCHAR(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` JSON DEFAULT NULL COMMENT 'Additional data like order_id, etc.',
  `is_read` TINYINT(1) DEFAULT '0',
  `read_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_read` (`is_read`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Support Tickets
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticket_number` VARCHAR(20) COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
  `issue_type` ENUM('order','payment','product','account','technical','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` VARCHAR(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` JSON DEFAULT NULL,
  `status` ENUM('open','in_progress','resolved','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'open',
  `priority` ENUM('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `assigned_to` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `resolved_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_number` (`ticket_number`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  KEY `assigned_to` (`assigned_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Support Ticket Messages
CREATE TABLE IF NOT EXISTS `support_ticket_messages` (
  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticket_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `message` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` JSON DEFAULT NULL,
  `is_staff_reply` TINYINT(1) DEFAULT '0',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Service Categories (for services marketplace - optional for MVP but table structure ready)
CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `description` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` INT UNSIGNED DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT '1',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- FOREIGN KEY CONSTRAINTS
-- ========================================

ALTER TABLE `branches`
  ADD CONSTRAINT `fk_branches_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_branches_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

ALTER TABLE `discounts`
  ADD CONSTRAINT `fk_discounts_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE;

ALTER TABLE `hot_deals`
  ADD CONSTRAINT `fk_hot_deals_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE;

ALTER TABLE `bank_offers`
  ADD CONSTRAINT `fk_bank_offers_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE;

ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `fk_wallet_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `withdrawal_requests`
  ADD CONSTRAINT `fk_withdrawal_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `advertisements`
  ADD CONSTRAINT `fk_advertisements_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE;

ALTER TABLE `retailer_followers`
  ADD CONSTRAINT `fk_retailer_followers_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_retailer_followers_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE;

ALTER TABLE `wishlist_retailers`
  ADD CONSTRAINT `fk_wishlist_retailers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wishlist_retailers_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailers` (`id`) ON DELETE CASCADE;

ALTER TABLE `order_parcels`
  ADD CONSTRAINT `fk_order_parcels_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `support_tickets`
  ADD CONSTRAINT `fk_support_tickets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `support_ticket_messages`
  ADD CONSTRAINT `fk_support_ticket_messages_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_support_ticket_messages_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

-- ========================================
-- INDEXES FOR OPTIMIZATION
-- ========================================

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_retailers_unique_id ON retailers(unique_id);
CREATE INDEX idx_retailers_kyc_status ON retailers(kyc_status);
CREATE INDEX idx_retailers_featured ON retailers(is_featured);
CREATE INDEX idx_retailers_discount_enabled ON retailers(discount_enabled);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_return_status ON orders(return_status);

-- Migration completed successfully
