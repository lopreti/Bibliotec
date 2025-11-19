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


-- Copiando estrutura do banco de dados para bibliotec
CREATE DATABASE IF NOT EXISTS `bibliotec` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `bibliotec`;

-- Copiando estrutura para tabela bibliotec.livros
CREATE TABLE IF NOT EXISTS `livros` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `autor` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `capa_url` varchar(255) DEFAULT NULL,
  `publicado_ano` int(11) DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `paginas` int(11) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `idioma` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.livros: ~3 rows (aproximadamente)
INSERT INTO `livros` (`ID`, `titulo`, `autor`, `descricao`, `capa_url`, `publicado_ano`, `criado_em`, `paginas`, `categoria`, `idioma`) VALUES
	(1, 'Crepúsculo\r\n\r\n', ' Stephenie Meyer', 'Crepúsculo poderia ser uma história comum, não fosse um elemento irresistível: o objeto da paixão da protagonista é um vampiro. Assim, soma-se à paixão um perigo sobrenatural temperado com muito suspense, e o resultado é uma leitura de tirar o fôlego. Um romance repleto das angústias e incertezas da juventude - o arrebatamento, a atração, a ansiedade que antecede cada palavra, cada gesto, e todos os medos.', 'https://m.media-amazon.com/images/I/618fXbK+OkL._SY425_.jpg', 2005, '2025-10-29 16:53:30', 480, 'Romance / Ficção', 'Português'),
	(2, 'Cinquenta Tons de Cinza', 'E. L. James', 'Fifty Shades of Grey é um romance erótico bestseller da autora inglesa Erika Leonard James publicado em 2011. O primeiro livro de uma trilogia que está sendo tratado como o "pornô das mamães" vendeu mais de dez milhões de livros nas seis primeiras semanas.', 'https://m.media-amazon.com/images/I/51XHQHnyciL._SY445_SX342_ML2_.jpg', 2011, '2025-10-29 16:55:18', 560, 'Romance Adulto', 'Português'),
	(3, 'O Fabricante de Lágrimas', ' Erin Doom', 'O fenômeno internacional que inspirou o filme da Netflix – um romance proibido entre dois adolescentes que, ao serem adotados pela mesma família, são obrigados a lidar com um amor que pode arruiná-los.', 'https://m.media-amazon.com/images/I/81Vw5NiVLyL._SY425_.jpg', 2023, '2025-10-29 16:57:24', 426, 'Romance / Ficção', 'Português');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
