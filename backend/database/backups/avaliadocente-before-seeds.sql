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
-- Table structure for table `anos_letivos`
--

DROP TABLE IF EXISTS `anos_letivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anos_letivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ano_inicio` int NOT NULL,
  `ano_fim` int NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ano_letivo` (`ano_inicio`,`ano_fim`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anos_letivos`
--

LOCK TABLES `anos_letivos` WRITE;
/*!40000 ALTER TABLE `anos_letivos` DISABLE KEYS */;
INSERT INTO `anos_letivos` VALUES (1,2025,2026,'Ano Letivo 2025/2026',0),(2,2026,2027,'Ano Letivo 2026/2027',1);
/*!40000 ALTER TABLE `anos_letivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacoes`
--

DROP TABLE IF EXISTS `avaliacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `professor_id` int NOT NULL,
  `disciplina_id` int NOT NULL,
  `calendario_id` int NOT NULL,
  `clareza` tinyint NOT NULL,
  `dinamismo` tinyint NOT NULL,
  `recursos` tinyint NOT NULL,
  `criterios_avaliacao` tinyint NOT NULL,
  `retorno` tinyint NOT NULL,
  `disponibilidade` tinyint NOT NULL,
  `respeito` tinyint NOT NULL,
  `pontualidade` tinyint NOT NULL,
  `metodologia` tinyint NOT NULL,
  `didatica` tinyint NOT NULL,
  `assiduidade` tinyint NOT NULL,
  `comentario` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_avaliacao` (`aluno_id`,`professor_id`,`disciplina_id`,`calendario_id`),
  KEY `professor_id` (`professor_id`),
  KEY `disciplina_id` (`disciplina_id`),
  KEY `calendario_id` (`calendario_id`),
  CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professores` (`id`),
  CONSTRAINT `avaliacoes_ibfk_3` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplinas` (`id`),
  CONSTRAINT `avaliacoes_ibfk_4` FOREIGN KEY (`calendario_id`) REFERENCES `calendario_semestres` (`id`),
  CONSTRAINT `avaliacoes_chk_1` CHECK ((`clareza` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_10` CHECK ((`didatica` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_11` CHECK ((`assiduidade` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_2` CHECK ((`dinamismo` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_3` CHECK ((`recursos` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_4` CHECK ((`criterios_avaliacao` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_5` CHECK ((`retorno` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_6` CHECK ((`disponibilidade` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_7` CHECK ((`respeito` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_8` CHECK ((`pontualidade` between 1 and 5)),
  CONSTRAINT `avaliacoes_chk_9` CHECK ((`metodologia` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacoes`
--

LOCK TABLES `avaliacoes` WRITE;
/*!40000 ALTER TABLE `avaliacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendario_semestres`
--

DROP TABLE IF EXISTS `calendario_semestres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendario_semestres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ano_letivo_id` int NOT NULL,
  `semestre` tinyint NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `ativo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_calendario` (`ano_letivo_id`,`semestre`),
  CONSTRAINT `calendario_semestres_ibfk_1` FOREIGN KEY (`ano_letivo_id`) REFERENCES `anos_letivos` (`id`),
  CONSTRAINT `calendario_semestres_chk_1` CHECK ((`semestre` in (1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendario_semestres`
--

LOCK TABLES `calendario_semestres` WRITE;
/*!40000 ALTER TABLE `calendario_semestres` DISABLE KEYS */;
INSERT INTO `calendario_semestres` VALUES (1,1,1,'2025-08-25','2026-02-21',0),(2,2,2,'2026-02-23','2026-07-26',1);
/*!40000 ALTER TABLE `calendario_semestres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(180) NOT NULL,
  `sigla` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sigla` (`sigla`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'Engenharia de Informática e Sistemas de Informação','EISI'),(2,'Direito','DIR'),(3,'Ciências Criminais','CC'),(4,'Hotelaria & Turismo','HT'),(5,'Logística e Gestão Comercial','LGC'),(6,'Gestão de Recursos Humanos','GRH'),(7,'Contabilidade & Finanças','CF'),(8,'Redes e Telecomunicações','RT');
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disciplinas`
--

DROP TABLE IF EXISTS `disciplinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disciplinas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(180) NOT NULL,
  `sigla` varchar(30) DEFAULT NULL,
  `curso_id` int NOT NULL,
  `ano_academico` tinyint NOT NULL,
  `semestre` tinyint NOT NULL,
  `status` enum('Regulamentar','Opcional','Concluída') DEFAULT 'Regulamentar',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_disciplina` (`nome`,`curso_id`,`ano_academico`,`semestre`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `disciplinas_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`),
  CONSTRAINT `disciplinas_chk_1` CHECK ((`semestre` in (1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disciplinas`
--

LOCK TABLES `disciplinas` WRITE;
/*!40000 ALTER TABLE `disciplinas` DISABLE KEYS */;
INSERT INTO `disciplinas` VALUES (33,'Análise de Sistemas II','ASI II',1,4,2,'Regulamentar'),(34,'Computação Gráfica','CG',1,4,2,'Regulamentar'),(35,'Programação IV - Linguagens e Tecnologias WEB','PROG IV',1,4,2,'Regulamentar'),(36,'Redes de Computadores','RC',1,4,2,'Regulamentar'),(37,'Sistemas Operativos II','SO II',1,4,2,'Regulamentar');
/*!40000 ALTER TABLE `disciplinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matriculas`
--

DROP TABLE IF EXISTS `matriculas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matriculas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `disciplina_id` int NOT NULL,
  `calendario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_matricula` (`usuario_id`,`disciplina_id`,`calendario_id`),
  KEY `disciplina_id` (`disciplina_id`),
  KEY `calendario_id` (`calendario_id`),
  CONSTRAINT `matriculas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `matriculas_ibfk_2` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplinas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `matriculas_ibfk_3` FOREIGN KEY (`calendario_id`) REFERENCES `calendario_semestres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matriculas`
--

LOCK TABLES `matriculas` WRITE;
/*!40000 ALTER TABLE `matriculas` DISABLE KEYS */;
INSERT INTO `matriculas` VALUES (1,220429,33,2),(2,220429,34,2),(3,220429,35,2),(4,220429,36,2),(5,220429,37,2),(6,220430,33,2),(7,220430,34,2),(8,220430,35,2),(9,220430,36,2),(10,220430,37,2);
/*!40000 ALTER TABLE `matriculas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor_disciplinas`
--

DROP TABLE IF EXISTS `professor_disciplinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor_disciplinas` (
  `professor_id` int NOT NULL,
  `disciplina_id` int NOT NULL,
  PRIMARY KEY (`professor_id`,`disciplina_id`),
  KEY `disciplina_id` (`disciplina_id`),
  CONSTRAINT `professor_disciplinas_ibfk_1` FOREIGN KEY (`professor_id`) REFERENCES `professores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `professor_disciplinas_ibfk_2` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplinas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor_disciplinas`
--

LOCK TABLES `professor_disciplinas` WRITE;
/*!40000 ALTER TABLE `professor_disciplinas` DISABLE KEYS */;
INSERT INTO `professor_disciplinas` VALUES (4,33),(3,34),(4,35),(18,36),(5,37);
/*!40000 ALTER TABLE `professor_disciplinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professores`
--

DROP TABLE IF EXISTS `professores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `departamento` varchar(120) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professores`
--

LOCK TABLES `professores` WRITE;
/*!40000 ALTER TABLE `professores` DISABLE KEYS */;
INSERT INTO `professores` VALUES (3,'Wilson Paiva','EISI','../assets/images/professores/placeholder.svg','2026-07-13 12:42:16'),(4,'Professor Doutor Yoelkis Victor','EISI','../assets/images/professores/yoelkis-victor.svg','2026-07-13 12:42:16'),(5,'Prof. Edilson Cruz','Engenharia de Computação','../assets/images/professores/edilson-cruz.svg','2026-07-13 12:42:16'),(18,'Prof. Miguel Telecom','EISI','../assets/images/professores/prof_18.svg','2026-07-13 12:42:16');
/*!40000 ALTER TABLE `professores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `curso_id` int NOT NULL,
  `ano_academico` tinyint NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('aluno','professor','admin') NOT NULL DEFAULT 'aluno',
  `professor_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `curso_id` (`curso_id`),
  KEY `professor_id` (`professor_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_chk_1` CHECK ((`ano_academico` between 0 and 7))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (220429,'Joaquim Herculano Joao','joaquim.herculano.joao@avaliadocente.local',NULL,NULL,1,4,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220430,'Liliana Guilherme','liliana.guilherme@avaliadocente.local',NULL,NULL,1,4,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220431,'Estudante Direito','direito@avaliadocente.local',NULL,NULL,2,1,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220432,'Estudante Ciências Criminais','cc@avaliadocente.local',NULL,NULL,3,1,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220433,'Estudante Hotelaria','hotelaria@avaliadocente.local',NULL,NULL,4,1,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220434,'Estudante Logística','logistica@avaliadocente.local',NULL,NULL,5,1,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220435,'Estudante Recursos Humanos','rh@avaliadocente.local',NULL,NULL,6,1,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220436,'Estudante Finanças','financas@avaliadocente.local',NULL,NULL,7,1,'12345','aluno',NULL,'2026-07-13 12:42:16'),(220437,'Estudante Telecom','telecom@avaliadocente.local',NULL,NULL,8,1,'12345','aluno',NULL,'2026-07-13 12:42:16'),(900000,'Coordenador Local','coordenador@avaliadocente.local',NULL,NULL,1,0,'coord123','admin',NULL,'2026-07-13 12:42:16'),(990003,'Wilson Paiva','wilsonpaiva@avaliadocente.local',NULL,NULL,1,0,'12345','professor',3,'2026-07-13 12:42:16'),(990004,'Professor Doutor Yoelkis Victor','doutoryoelkisvictor@avaliadocente.local',NULL,NULL,1,0,'12345','professor',4,'2026-07-13 12:42:16'),(990005,'Prof. Edilson Cruz','edilsoncruz@avaliadocente.local',NULL,NULL,1,0,'12345','professor',5,'2026-07-13 12:42:16'),(990018,'Prof. Miguel Telecom','miguel.telecom@avaliadocente.local',NULL,NULL,1,0,'12345','professor',18,'2026-07-13 12:42:16');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-13 12:43:51
