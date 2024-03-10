-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: erp
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

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
  `img_url` varchar(100) NOT NULL DEFAULT 'https://utfs.io/f/8c5ed6b4-9c43-49a9-b7be-e1096fc07f0f-kmjf4x.jpg',
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
INSERT INTO `accounts` VALUES ('0de11413-29cd-42e3-9f51-b3e15f05b040','Jan Nowak','$2b$10$a9LsT7wgGzxXahG5yzqId.HqieD6eemoQSwOJ90CvhxbCbqtb11/u','nowak@gmail.com','analize','https://utfs.io/f/83397898-e120-4f48-86f4-9ebb13c54520-n8isyu.jpeg','2024-03-10 16:50:29',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTAwODk0NTQsImV4cCI6MTcxMDY5NDI1NH0.2P22xPviMxvpQlKpc72f3p0hYgI7oZcLQ6tN8cMTjfw'),('20d3d53a-db18-11ee-aeed-1002b54ccc69','root','$2b$10$8Lbg6tvI4e/mOyku3uvNNONfatfeTGHI/D531boVUqWIe3kTOKK/K','root@gmail.com','admin','https://utfs.io/f/01619f7b-7762-4102-be46-f38c2a1c3550-nm33wo.jpeg','2024-03-05 17:45:17',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicm9vdCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMDA5MTIwMywiZXhwIjoxNzEwNjk2MDAzfQ._E-seQoGtO95mjbc4o0AqnsvfdUNif6UqNT91TfeCfE'),('2da73c4d-05ab-4bac-8ef0-a70a71a0683b','Ewa Strauss','$2b$10$nEyp/J9r7m6TiDgNHZ3clez4Lu9giehVd/o4RzunhVG2RU6BeSD92','iwia@gmail.cz','warehouse','https://utfs.io/f/90228ff2-c24f-4ea4-b097-2326cc1ad491-oj66a0.jpg','2024-03-10 17:00:17',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTAwOTAwMzUsImV4cCI6MTcxMDY5NDgzNX0.5iFSfKMeKtRaHkfRvNQ5h4rq1lgs6VYHM1ClfQyDaug'),('47d8aef6-59e3-405f-bace-4a4fab13ac21','Ilona Iksonska','$2b$10$K5INd3xJOorQDF5K0h78ZuPbmjiNqDpFVkiNiXjeUq1GwgDkRf4gy','ilona@gmail.com','hr','https://utfs.io/f/5243fb95-def2-418f-ab46-2f1cdea82d1c-1usf4.png','2024-03-10 11:12:30',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSWxvbmEgSWtzb25za2EiLCJyb2xlIjoiaHIiLCJpYXQiOjE3MTAwOTMzNzUsImV4cCI6MTcxMDY5ODE3NX0.l6_bHOnvMdxg-Po_69XonvrlpwB_-kWKPRoHYRi8TQ0'),('9d7b339d-97e0-4272-bfad-6e8fb356755a','123456','$2b$10$YFCiLhamprVJN3W5GE7zIO6i9kY0Jk604w87bMUbeecm1y90BYRHy','karoldawidg@gmail.com','sales','https://utfs.io/f/bca7e335-8a46-4ffa-9186-81d51e65c875-kmjf4x.jpg','2024-03-10 17:02:30',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InNhbGVzIiwiaWF0IjoxNzEwMDkzNTQ1LCJleHAiOjE3MTA2OTgzNDV9.5i5b8-3pr16ebGkPMjgGo9HaUxIGeNR5vSfCW8q3wIU'),('dc180ca0-5477-45d5-8b74-af3660a3139a','Anetka Czernikowska','$2b$10$ue.X5Q7Mz8Ix2pGe.SXsAOg/RcH2AHSwU92fHuMZf1c2ErP0WQt52','Anetka@gmail.com','analize','https://utfs.io/f/49fd6a1c-5e1b-4035-a7fc-eee55b5b8e02-ibclvr.jpeg','2024-03-10 16:51:58',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTAwODk2MjAsImV4cCI6MTcxMDY5NDQyMH0.M7O6m9Vap0zPCWIpoIMG1MmzkxWZJKUOcQrQ3sXSAg0'),('f72ed688-be28-4a27-a272-3416ff66b055','Monika Jarzabska','$2b$10$BUmEVfdFRXQQkpKBBBVsPuCWY1fmLw94wqj0ra3fgtYZZTf80rjry','monia@gmail.com','accounting','https://utfs.io/f/e875cf1c-98a6-4678-a8c7-39e4d6b83312-ibcluw.jpeg','2024-03-10 16:56:55',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTAwODk4MzEsImV4cCI6MTcxMDY5NDYzMX0.90oxXWeq2JIYvowLJovK9FeYqP80dvPTGpkxNi3fNtA');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-10 19:47:30
