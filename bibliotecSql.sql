-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.0.2-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para bibliotec
CREATE DATABASE IF NOT EXISTS `bibliotec` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `bibliotec`;

-- Copiando estrutura para tabela bibliotec.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.categorias: ~2 rows (aproximadamente)
INSERT INTO `categorias` (`id`, `nome`) VALUES
	(1, 'Ficção'),
	(2, 'Romance'),
	(3, 'Fantasia');

-- Copiando estrutura para tabela bibliotec.favoritos
CREATE TABLE IF NOT EXISTS `favoritos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_favoritos_usuario` (`usuario_id`),
  KEY `FK_favoritos_livro` (`livro_id`),
  CONSTRAINT `FK_favoritos_livro` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`livro_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_favoritos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.favoritos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bibliotec.livros
CREATE TABLE IF NOT EXISTS `livros` (
  `livro_id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `autor` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `capa_url` varchar(255) DEFAULT NULL,
  `publicado_ano` int(11) DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `quant_paginas` text DEFAULT NULL,
  `idioma` varchar(50) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`livro_id`),
  CONSTRAINT `chk_quantidade_pagina` CHECK (`quant_paginas` regexp '^[0-9]+$')
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.livros: ~3 rows (aproximadamente)
INSERT INTO `livros` (`livro_id`, `titulo`, `autor`, `descricao`, `capa_url`, `publicado_ano`, `criado_em`, `quant_paginas`, `idioma`, `categoria`) VALUES
	(1, 'Crepúsculo', 'Stephenie Meyer', 'Crepúsculo é uma obra de romance e fantasia de vampiros da autora Stephenie Meyer, publicada em 2005. É o primeiro livro da série Twilight e apresenta Isabella "Bella" Swan, de dezessete anos, que se muda de Phoenix, Arizona, para Forks, Washington.', 'https://m.media-amazon.com/images/I/618fXbK+OkL._SY425_.jpg', 2005, '2025-11-19 11:19:42', '288', 'Português', NULL),
	(2, 'Cinquenta Tons de Cinza', 'E. L. James', 'Fifty Shades of Grey é um romance erótico bestseller da autora inglesa Erika Leonard James publicado em 2011. O primeiro livro de uma trilogia que está sendo tratado como o "pornô das mamães" vendeu mais de dez milhões de livros nas seis primeiras semanas.', 'https://m.media-amazon.com/images/I/51XHQHnyciL._SY445_SX342_ML2_.jpg', 2011, '2025-11-19 11:19:42', '480', 'Português', NULL),
	(3, 'O fabricante de lágrimas', 'Erin Doom', 'O fenômeno internacional que inspirou o filme da Netflix – um romance proibido entre dois adolescentes que, ao serem adotados pela mesma família, são obrigados a lidar com um amor que pode arruiná-los.', 'https://m.media-amazon.com/images/I/81Vw5NiVLyL._SY425_.jpg', 2023, '2025-11-19 11:19:42', '560', 'Português', NULL);

-- Copiando estrutura para tabela bibliotec.livros_categorias
CREATE TABLE IF NOT EXISTS `livros_categorias` (
  `livro_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  PRIMARY KEY (`livro_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `livros_categorias_ibfk_1` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`livro_id`) ON DELETE CASCADE,
  CONSTRAINT `livros_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.livros_categorias: ~4 rows (aproximadamente)
INSERT INTO `livros_categorias` (`livro_id`, `categoria_id`) VALUES
	(1, 1),
	(1, 2),
	(2, 2),
	(3, 2);

-- Copiando estrutura para tabela bibliotec.reservas
CREATE TABLE IF NOT EXISTS `reservas` (
  `id_reservado` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_retirada` int(11) DEFAULT NULL,
  `data_devolucao` int(11) DEFAULT NULL,
  `confirmado_email` int(11) DEFAULT NULL,
  `criado_em` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_reservado`),
  KEY `FK_reservas_usuario` (`usuario_id`),
  KEY `FK_reservas_livro` (`livro_id`),
  CONSTRAINT `FK_reservas_livro` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`livro_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_reservas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.reservas: ~1 rows (aproximadamente)
INSERT INTO `reservas` (`id_reservado`, `usuario_id`, `livro_id`, `data_retirada`, `data_devolucao`, `confirmado_email`, `criado_em`) VALUES
	(4, 4, 2, NULL, NULL, NULL, NULL);

-- Copiando estrutura para tabela bibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `nome` varchar(250) NOT NULL,
  `CPF` int(11) NOT NULL,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `chk_senha` CHECK (char_length(`senha`) >= 8)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`usuario_id`, `email`, `senha`, `nome`, `CPF`) VALUES
	(2, 'isabella@gmail.com', 'senha12345', 'isabella lopreti', 1234567890),
	(3, 'teste@example.com', 'password123', 'Teste Usuario', 2147483647),
	(4, 'lavinia@gmail.com', 'senha54321', 'lavínia chaves', 2147483647);
=======
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.usuarios: ~1 rows (aproximadamente)
INSERT INTO `usuarios` (`usuario_id`, `email`, `senha`, `nome`, `CPF`) VALUES
	(1, 'isabella', 'senha12345', '', 0);
>>>>>>> origin/lopreti

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;