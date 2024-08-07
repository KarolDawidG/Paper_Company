-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: erp
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.22.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `img_url` varchar(100) NOT NULL DEFAULT 'https://utfs.io/f/bca7e335-8a46-4ffa-9186-81d51e65c875-kmjf4x.jpg',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '0',
  `refresh_token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('2da73c4d-05ab-4bac-8ef0-a70a71a0683b','Ewa Strauss','$2b$10$nEyp/J9r7m6TiDgNHZ3clez4Lu9giehVd/o4RzunhVG2RU6BeSD92','iwia@gmail.cz','sales','https://utfs.io/f/299772c7-c3a5-4c5f-942d-ee2d9325d60d-8mqyui.jpg','2024-03-10 15:00:17',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiRXdhIFN0cmF1c3MiLCJyb2xlIjoic2FsZXMiLCJpYXQiOjE3MjI0Mzc0MDksImV4cCI6MTcyMzA0MjIwOX0.jYJaquNRNAYKS3-6aM9jyIekxSssOgZ21dOETsRqABo'),('47d8aef6-59e3-405f-bace-4a4fab13ac21','Ilona Iksonska','$2b$10$K5INd3xJOorQDF5K0h78ZuPbmjiNqDpFVkiNiXjeUq1GwgDkRf4gy','ilona@gmail.com','sales','https://utfs.io/f/5243fb95-def2-418f-ab46-2f1cdea82d1c-1usf4.png','2024-03-10 09:12:30',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSWxvbmEgSWtzb25za2EiLCJyb2xlIjoic2FsZXMiLCJpYXQiOjE3MjI2MTQ5NjgsImV4cCI6MTcyMzIxOTc2OH0.0x1Yz2ZIqFH2UgwmlqpN_WMUA1Wb-qSUD-syGekoCKY'),('4c992940-0024-11ef-a2c1-1002b54ccc69','root','$2b$10$8Lbg6tvI4e/mOyku3uvNNONfatfeTGHI/D531boVUqWIe3kTOKK/K','root@gmail.com','admin','https://utfs.io/f/0576a965-e83c-47aa-b5b1-31aeac3c55c0-kmjf4x.jpg','2024-04-21 21:15:37',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicm9vdCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMjU4NTE4NiwiZXhwIjoxNzIzMTg5OTg2fQ.NIdzjVpYe1QhyXlW-FBrn3NSuCUpbPQRjUsmTAF3fUU'),('517c6404-8929-45d9-9091-a149c469a9ce','Crystal Greenvelle','$2b$10$UgwccTtkF1W/YZsQnH7cm.pQCl/by7LzUY1S4AJ9MXfMLhWftGmaK','greenvelle@gmail.com','analize','https://utfs.io/f/010358db-fcca-4763-b4b8-9da9dafe304f-mg83kt.jpg','2024-03-21 15:20:46',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTEwNDE2NjEsImV4cCI6MTcxMTY0NjQ2MX0.DE0U4PpbPBwNYnxexgHWnQ15XHe1IMqTibSNzaMHEnk'),('99e3148d-5210-4bfd-a927-a82b63c0f077','Eva Elfie','$2b$10$1HvVcuomR4GthWo8lMlq0uV3JH3f3xQL.pXeQ1D.CXQR64k0ib2gi','elfie@gmail.com','warehouse','https://utfs.io/f/fc146d04-35bd-4a55-bfce-5af7ddcd3e48-5iq9xo.jpg','2024-03-21 15:12:17',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTEwNDExNTQsImV4cCI6MTcxMTY0NTk1NH0.aTia8mH2I4TWm5taa1AeDW05ouO72Red7CWdOUaZXZA'),('9d7b339d-97e0-4272-bfad-6e8fb356755a','Fibi Euro','$2b$10$YFCiLhamprVJN3W5GE7zIO6i9kY0Jk604w87bMUbeecm1y90BYRHy','fibi@gmail.com','warehouse','https://utfs.io/f/cf6792ee-cf81-4c38-9f8b-ccfda5906c0b-pczre8.jpg','2024-03-10 15:02:30',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiRmliaSBFdXJvIiwicm9sZSI6IndhcmVob3VzZSIsImlhdCI6MTcyMjQ1NDYwMSwiZXhwIjoxNzIzMDU5NDAxfQ.yBaOMJY1u8b8sHKq88z11aWYOk08-IILFYqSiuzc0Vg'),('c17ff8ca-168d-4d29-8699-fd102a77c1f2','Barbie','$2b$10$XrGnWAMsM1/1l4ofITM15ukWbUkGAxp6GhijRoCcdgzPVQE/FsrY2','super_barie@gmail.com','analize','https://utfs.io/f/85740529-a2bf-4e5d-8330-f573592a937f-oz1gxo.jpg','2024-03-21 15:19:52',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTEwNDE2MDgsImV4cCI6MTcxMTY0NjQwOH0.bpjESImvq4C6Gm-_Rm7PdBKt0ag16hAhGUwEkjGt-ew'),('c933ba30-55dd-4568-ada5-0fec21a66a70','Pamela','$2b$10$S7xZbHYYuLEsOo/K8JpC2Oz1BjqsObZP2FRUiIz7e.NKWYpRKQ5Si','morrison@gmail.com','accounting','https://utfs.io/f/d7476f93-d8d9-46ec-a8de-a0320dc801b8-94mkp9.jpg','2024-03-21 15:03:20',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTEwNDA2MTksImV4cCI6MTcxMTY0NTQxOX0.54ZCY1SwiCLeGjBMJXcEoUkORs7lFjnKmNrObUB_Bn8'),('dc180ca0-5477-45d5-8b74-af3660a3139a','Princess Alice','$2b$10$ue.X5Q7Mz8Ix2pGe.SXsAOg/RcH2AHSwU92fHuMZf1c2ErP0WQt52','smal@gmail.com','accounting','https://utfs.io/f/58e7bb54-8869-452c-b976-9a47ad1e339d-619l6d.png','2024-03-10 14:51:58',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQW5ldGthIEN6ZXJuaWtvd3NrYSIsInJvbGUiOiJhY2NvdW50aW5nIiwiaWF0IjoxNzEzOTY1NjI0LCJleHAiOjE3MTQ1NzA0MjR9.UtzcNyKJm_ZamfZiwy3s9afw80CMFVR9QzTanhN_TFg'),('f72ed688-be28-4a27-a272-3416ff66b055','Monika Jarzabska','$2b$10$BUmEVfdFRXQQkpKBBBVsPuCWY1fmLw94wqj0ra3fgtYZZTf80rjry','monia@gmail.com','hr','https://utfs.io/f/e875cf1c-98a6-4678-a8c7-39e4d6b83312-ibcluw.jpeg','2024-03-10 14:56:55',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTAwODk4MzEsImV4cCI6MTcxMDY5NDYzMX0.90oxXWeq2JIYvowLJovK9FeYqP80dvPTGpkxNi3fNtA'),('fa97c775-1613-4035-b93b-2fb852e37ec0','Alexis','$2b$10$blQ3lRflm9ZnV5m.eUN96urTQvxnQedaapzDj3moi5YuNKoTA21c2','brill-alexis@gmail.com','hr','https://utfs.io/f/0bdc1601-50e6-4862-8c05-bfb2e2a45f6f-hfzk01.jpg','2024-03-21 15:14:55',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTEwNDE1NTcsImV4cCI6MTcxMTY0NjM1N30.3A6ITkXjsyL0UUHDjjaLIm0IUeogEdqDhFovzcdvFwE');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_addresses`
--

DROP TABLE IF EXISTS `client_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_addresses` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `miasto` varchar(100) NOT NULL,
  `ulica` varchar(100) NOT NULL,
  `nr_budynku` varchar(20) NOT NULL,
  `nr_mieszkania` varchar(20) DEFAULT NULL,
  `kod` varchar(20) NOT NULL,
  `nazwa_firmy` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `client_addresses_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_addresses`
--

LOCK TABLES `client_addresses` WRITE;
/*!40000 ALTER TABLE `client_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` varchar(36) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `second_name` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('6d32d2ff-50ea-11ef-97bd-1002b54ccc69','John','Doe','john.doe@example.com','2024-08-02 16:15:25'),('6d32d685-50ea-11ef-97bd-1002b54ccc69','Jane','Smith','jane.smith@example.com','2024-08-02 16:15:25'),('6d32d7e7-50ea-11ef-97bd-1002b54ccc69','Michael','Johnson','michael.johnson@example.com','2024-08-02 16:15:25'),('6d32d954-50ea-11ef-97bd-1002b54ccc69','Emily','Davis','emily.davis@example.com','2024-08-02 16:15:25'),('6d32da49-50ea-11ef-97bd-1002b54ccc69','William','Brown','william.brown@example.com','2024-08-02 16:15:25');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` varchar(36) NOT NULL,
  `order_id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `client_address_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `client_address_id` (`client_address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`client_address_id`) REFERENCES `client_addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('1','Papier ksero A4, 80g/m²','Papier ksero','Format A4, 80g/m², paczka 500 arkuszy',19.99,100,'2024-03-21 15:45:29'),('10','Papier ksero A4, 70g/m²','Papier ksero','Format A4, 70g/m², paczka 500 arkuszy',17.99,150,'2024-03-21 15:48:17'),('11','Papier ksero A3, 70g/m²','Papier ksero','Format A3, 70g/m², paczka 250 arkuszy',37.99,100,'2024-03-21 15:48:17'),('12','Papier ksero A4, 90g/m²','Papier ksero','Format A4, 90g/m², paczka 500 arkuszy',24.99,100,'2024-03-21 15:48:17'),('13','Papier ksero A3, 90g/m²','Papier ksero','Format A3, 90g/m², paczka 250 arkuszy',44.99,75,'2024-03-21 15:48:17'),('14','Papier ksero A4, 100g/m²','Papier ksero','Format A4, 100g/m², paczka 500 arkuszy',29.99,125,'2024-03-21 15:48:17'),('15','Papier ksero A3, 100g/m²','Papier ksero','Format A3, 100g/m², paczka 250 arkuszy',49.99,50,'2024-03-21 15:48:17'),('2','Papier ksero A3, 80g/m²','Papier ksero','Format A3, 80g/m², paczka 250 arkuszy',39.99,50,'2024-03-21 15:45:29'),('3','Papier ekologiczny, bezdrzewny','Papier ksero','Papier ekologiczny, bezdrzewny, format A4, paczka 500 arkuszy',24.99,75,'2024-03-21 15:45:29'),('4','Papier kolorowy A4','Papier ksero','Papier kolorowy, format A4, paczka 250 arkuszy',29.99,50,'2024-03-21 15:45:29'),('5','Papier o zwiększonej gramaturze, 100g/m²','Papier ksero','Papier o zwiększonej gramaturze, 100g/m², paczka 250 arkuszy',34.99,100,'2024-03-21 15:45:29'),('6','Papier do drukarek Letter (8.5 x 11 cali), 75g/m²','Papier do drukarek','Format Letter (8.5 x 11 cali), 75g/m², paczka 500 arkuszy',24.99,75,'2024-03-21 15:45:29'),('7','Papier do drukarek Legal (8.5 x 14 cali), 80g/m²','Papier do drukarek','Format Legal (8.5 x 14 cali), 80g/m², paczka 250 arkuszy',29.99,50,'2024-03-21 15:45:29'),('8','Papier fotograficzny, błyszczący, format 4x6 cali','Papier do drukarek','Błyszczący papier fotograficzny, format 4x6 cali, paczka 50 arkuszy',19.99,100,'2024-03-21 15:45:29'),('9','Papier samoprzylepny A4','Papier do drukarek','Samoprzylepny papier, format A4, paczka 100 arkuszy',29.99,50,'2024-03-21 15:45:29');

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-02 18:28:08
