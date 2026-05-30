-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: avaliadocente
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_perfil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `curso` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_academico` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` enum('aluno','professor','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'aluno',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=990011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (220428,'Ana Juliana Avelino da Costa Sobrinho','julianacostaana120702@gmail.com','941175105','/frontend/assets/uploads/profiles/user-220428-1f72cf40cb0b0659.jpg','Engenharia de Inf. e Sist. de Informação','4º Ano','$2y$10$7kKV2DiJqhRpv5VhMP7uYe9AGAHPVoBgCP2h4gnmnirzIZ1o20Fbm','aluno','2026-05-29 16:29:46'),(990001,'Professor Rouget','rouget@avaliadocente.local','000000000',NULL,'EISI','2020','12345','professor','2026-05-29 18:04:06'),(990002,'Professor Tawana','tawana@avaliadocente.local',NULL,NULL,NULL,NULL,'12345','professor','2026-05-30 11:13:41'),(990003,'Wilson Paiva','wilsonpaiva@avaliadocente.local',NULL,NULL,NULL,NULL,'12345','professor','2026-05-30 11:13:41'),(990004,'Professor Doutor Yoelkis Victor','doutoryoelkisvictor@avaliadocente.local','000000000','../assets/images/professores/yoelkis-victor.svg','EISI','2020','12345','professor','2026-05-30 12:31:09'),(990005,'Prof. Edilson Cruz','edilsoncruz@avaliadocente.local','000000000','../assets/images/professores/edilson-cruz.svg','EISI','2020','12345','professor','2026-05-30 12:31:09'),(990006,'Professor Maximo','maximo@avaliadocente.local','000000000','../assets/images/professores/prof_13.svg','EISI','2020','12345','professor','2026-05-30 12:31:09'),(990007,'Professor Paulo Vieira','paulovieira@avaliadocente.local','000000000','../assets/images/professores/prof_14.svg','EISI','2020','12345','professor','2026-05-30 12:31:09'),(990008,'Professor Sanchez','sanchez@avaliadocente.local','000000000','../assets/images/professores/prof_15.svg','EISI','2020','12345','professor','2026-05-30 12:31:09'),(990009,'Professor Afonso','afonso@avaliadocente.local','000000000','../assets/images/professores/prof_16.svg','EISI','2020','12345','professor','2026-05-30 12:31:09'),(990010,'Professor Conde','conde@avaliadocente.local','000000000','../assets/images/professores/prof_conde.svg','EISI','2020','12345','professor','2026-05-30 12:31:09');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professores`
--

DROP TABLE IF EXISTS `professores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_perfil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disciplina_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professores`
--

LOCK TABLES `professores` WRITE;
/*!40000 ALTER TABLE `professores` DISABLE KEYS */;
INSERT INTO `professores` VALUES (2,'Professor Doutor Yoelkis Victor','Engenharia Informática e Sistemas de Informação','../assets/images/professores/yoelkis-victor.svg',12,'2026-05-29 17:16:24'),(3,'Prof. Edilson Cruz','Engenharia Informática e Sistemas de Informação','../assets/images/professores/edilson-cruz.svg',34,'2026-05-29 17:16:24'),(13,'Professor Maximo','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_13.svg',28,'2026-05-30 10:53:50'),(14,'Professor Paulo Vieira','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_14.svg',33,'2026-05-30 10:53:50'),(15,'Professor Sanchez','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_15.svg',36,'2026-05-30 10:53:50'),(16,'Professor Afonso','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_16.svg',30,'2026-05-30 10:53:50'),(18,'Professor Tawana','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_18.svg',22,'2026-05-30 11:13:41'),(19,'Professor Tawana','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_19.svg',23,'2026-05-30 11:13:41'),(21,'Wilson Paiva','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_21.svg',3,'2026-05-30 11:13:41'),(22,'Wilson Paiva','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_22.svg',35,'2026-05-30 11:13:41'),(23,'Wilson Paiva','Engenharia de Informática e Sistemas de Informação','../assets/images/professores/prof_23.svg',45,'2026-05-30 11:13:41'),(24,'Professor Maximo',NULL,'../assets/images/professores/prof_13.svg',19,'2026-05-30 12:14:38'),(25,'Professor Maximo',NULL,'../assets/images/professores/prof_13.svg',27,'2026-05-30 12:14:38'),(27,'Professor Doutor Yoelkis Victor','Engenharia de InformÃ¡tica e Sistemas de InformaÃ§Ã£o','../assets/images/professores/yoelkis-victor.svg',48,'2026-05-30 12:16:36'),(28,'Professor Conde','Engenharia de InformÃ¡tica e Sistemas de InformaÃ§Ã£o','../assets/images/professores/prof_conde.svg',40,'2026-05-30 12:24:45');
/*!40000 ALTER TABLE `professores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacoes`
--

DROP TABLE IF EXISTS `avaliacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int DEFAULT NULL,
  `professor_id` int DEFAULT NULL,
  `metodologia` int DEFAULT NULL,
  `didatica` int DEFAULT NULL,
  `assiduidade` int DEFAULT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `aluno_id` (`aluno_id`),
  KEY `professor_id` (`professor_id`),
  CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacoes`
--

LOCK TABLES `avaliacoes` WRITE;
/*!40000 ALTER TABLE `avaliacoes` DISABLE KEYS */;
INSERT INTO `avaliacoes` VALUES (1,220428,2,2,3,5,'bom professor','2026-05-29 17:32:11');
/*!40000 ALTER TABLE `avaliacoes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-30 12:37:56
