-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           11.8.2-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando dados para a tabela bibliotec.categorias: ~3 rows (aproximadamente)
INSERT INTO `categorias` (`id`, `nome`) VALUES
	(1, 'Ficção'),
	(2, 'Romance'),
	(3, 'Fantasia');

-- Copiando dados para a tabela bibliotec.favoritos: ~6 rows (aproximadamente)
INSERT INTO `favoritos` (`id`, `usuario_id`, `livro_id`) VALUES
	(36, 1, 1),
	(37, 1, 1),
	(38, 1, 3),
	(39, 1, 2),
	(40, 1, 2),
	(46, 3, 2);

-- Copiando dados para a tabela bibliotec.livros: ~3 rows (aproximadamente)
INSERT INTO `livros` (`livro_id`, `titulo`, `autor`, `descricao`, `capa_url`, `publicado_ano`, `criado_em`, `quant_paginas`, `idioma`, `categoria`) VALUES
	(1, 'Crepúsculo', 'Stephenie Meyer', 'Crepúsculo é uma obra de romance e fantasia de vampiros da autora Stephenie Meyer, publicada em 2005. É o primeiro livro da série Twilight e apresenta Isabella "Bella" Swan, de dezessete anos, que se muda de Phoenix, Arizona, para Forks, Washington.', 'https://m.media-amazon.com/images/I/618fXbK+OkL._SY425_.jpg', 2005, '2025-11-19 11:19:42', '288', 'Português', NULL),
	(2, 'Cinquenta Tons de Cinza', 'E. L. James', 'Fifty Shades of Grey é um romance erótico bestseller da autora inglesa Erika Leonard James publicado em 2011. O primeiro livro de uma trilogia que está sendo tratado como o "pornô das mamães" vendeu mais de dez milhões de livros nas seis primeiras semanas.', 'https://m.media-amazon.com/images/I/51XHQHnyciL._SY445_SX342_ML2_.jpg', 2011, '2025-11-19 11:19:42', '480', 'Português', NULL),
	(3, 'O fabricante de lágrimas', 'Erin Doom', 'O fenômeno internacional que inspirou o filme da Netflix – um romance proibido entre dois adolescentes que, ao serem adotados pela mesma família, são obrigados a lidar com um amor que pode arruiná-los.', 'https://m.media-amazon.com/images/I/81Vw5NiVLyL._SY425_.jpg', 2023, '2025-11-19 11:19:42', '560', 'Português', NULL);

-- Copiando dados para a tabela bibliotec.livros_categorias: ~4 rows (aproximadamente)
INSERT INTO `livros_categorias` (`livro_id`, `categoria_id`) VALUES
	(1, 1),
	(1, 2),
	(2, 2),
	(3, 2);

-- Copiando dados para a tabela bibliotec.reservas: ~1 rows (aproximadamente)
INSERT INTO `reservas` (`id_reservado`, `usuario_id`, `livro_id`, `data_retirada`, `data_devolucao`, `confirmado_email`, `criado_em`) VALUES
	(7, 3, 1, NULL, NULL, NULL, NULL);

-- Copiando dados para a tabela bibliotec.usuarios: ~4 rows (aproximadamente)
INSERT INTO `usuarios` (`usuario_id`, `email`, `senha`, `nome`, `CPF`) VALUES
	(1, 'isabella@gmail.com', 'senha12345', 'isabella lopreti', '01234567890'),
	(2, 'teste@example.com', 'password123', 'Teste Usuario', '12345678901'),
	(3, 'lavinia@gmail.com', 'senha54321', 'lavínia chaves', '12345678900'),
	(4, 'lavi@gmail.com', '12345678', 'laví chaves', '98765432109');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
