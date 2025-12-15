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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.categorias: ~16 rows (aproximadamente)
INSERT INTO `categorias` (`id`, `nome`) VALUES
	(1, 'Ficção'),
	(2, 'Romance'),
	(3, 'Fantasia'),
	(4, 'Infantil'),
	(5, 'Suspense'),
	(6, 'Drama'),
	(7, 'Distopia'),
	(8, 'Terror'),
	(9, 'Biografia'),
	(10, 'Estratégia'),
	(11, 'Clássico'),
	(12, 'Ficção Científica'),
	(13, 'Thriller'),
	(14, 'Suspense Psicológico'),
	(15, 'Ficção Histórica'),
	(16, 'Romance / Fantasia');

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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.favoritos: ~7 rows (aproximadamente)
INSERT INTO `favoritos` (`id`, `usuario_id`, `livro_id`) VALUES
	(46, 3, 2),
	(48, 4, 2),
	(49, 4, 1),
	(50, 4, 50),
	(51, 4, 38),
	(52, 3, 3),
	(53, 3, 24);

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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.livros: ~46 rows (aproximadamente)
INSERT INTO `livros` (`livro_id`, `titulo`, `autor`, `descricao`, `capa_url`, `publicado_ano`, `criado_em`, `quant_paginas`, `idioma`, `categoria`) VALUES
	(1, 'Crepúsculo', 'Stephenie Meyer', 'Bella Swan se muda para a pequena e chuvosa cidade de Forks, onde sua vida toma um rumo inesperado ao conhecer Edward Cullen, um misterioso colega de escola. Conforme os dois se aproximam, Bella descobre que Edward pertence a uma família de vampiros e acaba envolvida em um romance proibido que coloca sua vida em risco.', 'https://m.media-amazon.com/images/I/618fXbK+OkL._SY425_.jpg', 2005, '2025-11-19 11:19:42', '288', 'Português', NULL),
	(2, 'Cinquenta Tons de Cinza', 'E. L. James', 'Quando a estudante Anastasia Steele entrevista o jovem empresário Christian Grey, ela é atraída por sua beleza, poder e mistério. Apesar de suas diferenças, os dois embarcam em um relacionamento intenso e complexo, marcado por regras rígidas, limites pessoais e a busca por confiança e vulnerabilidade.', 'https://m.media-amazon.com/images/I/51XHQHnyciL._SY445_SX342_ML2_.jpg', 2011, '2025-11-19 11:19:42', '480', 'Português', '\r\n'),
	(3, 'O fabricante de lágrimas', 'Erin Doom', 'Após crescer em um orfanato, Nica finalmente consegue uma chance de recomeçar ao ser adotada. Porém, sua nova vida se complica com a presença de Rigel, um garoto enigmático e distante que também vive na casa. Enquanto Nica tenta entender seus sentimentos e os segredos que cercam Rigel, ela se vê envolvida em uma história de dor, superação e descobertas emocionais.', 'https://m.media-amazon.com/images/I/81Vw5NiVLyL._SY425_.jpg', 2023, '2025-11-19 11:19:42', '560', 'Português', NULL),
	(24, 'A Culpa é das Estrelas', 'John Green', 'A história de Hazel e Gus, dois adolescentes que se conhecem em um grupo de apoio ao câncer e vivem um romance intenso e emocionante.', 'https://m.media-amazon.com/images/I/41MRMmeNz0L._SY445_SX342_QL70_ML2_.jpg', 2012, '2025-12-12 11:42:38', '288', 'Português', 'Romance'),
	(25, 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Um piloto cai no deserto e encontra um pequeno príncipe vindo de outro planeta, explorando temas como amizade, amor e perda.', 'https://m.magazineluiza.com.br/a-static/420x420/livro-o-pequeno-principe-antoine-de-saint-exupery/magazineluiza/230998500/64ef6a6aeefdbb47bd715d78ef21ca8e.png', 1943, '2025-12-12 11:42:38', '96', 'Português', 'Infantil'),
	(26, 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Primeiro livro da saga Harry Potter, apresentando o jovem bruxo que descobre seu passado e seu destino.', 'https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg', 1997, '2025-12-12 11:42:38', '264', 'Português', 'Fantasia'),
	(27, 'O Hobbit', 'J.R.R. Tolkien', 'Bilbo Bolseiro embarca em uma jornada inesperada com anões para recuperar um tesouro guardado por um dragão.', 'https://m.media-amazon.com/images/I/91zdxRRvabL._UF1000,1000_QL80_.jpg', 1937, '2025-12-12 11:42:38', '320', 'Português', 'Fantasia'),
	(28, 'O Código Da Vinci', 'Dan Brown', 'Um thriller envolvendo simbologia, sociedades secretas e mistérios religiosos, protagonizado por Robert Langdon.', 'https://m.media-amazon.com/images/I/51DaS6hNpPL._SY445_SX342_ML2_.jpg', 2003, '2025-12-12 11:42:38', '432', 'Português', 'Suspense'),
	(29, 'A Menina que Roubava Livros', 'Markus Zusak', 'Narrada pela Morte, a obra acompanha Liesel durante a Segunda Guerra Mundial e seu amor pelos livros.', 'https://m.media-amazon.com/images/I/41pVlY-bbaL._SY445_SX342_ML2_.jpg', 2005, '2025-12-12 11:42:38', '480', 'Português', 'Drama'),
	(30, 'Orgulho e Preconceito', 'Jane Austen', 'Clássico romance entre Elizabeth Bennet e Mr. Darcy, abordando sociedade e relacionamentos.', 'https://m.media-amazon.com/images/I/719esIW3D7L.jpg', 1813, '2025-12-12 11:42:38', '416', 'Português', 'Romance'),
	(31, '1984', 'George Orwell', 'Romance distópico sobre um regime totalitário que controla informações, sentimentos e até pensamentos.', 'https://m.media-amazon.com/images/I/61t0bwt1s3L._AC_UF1000,1000_QL80_.jpg', 1949, '2025-12-12 11:42:38', '328', 'Português', 'Distopia'),
	(32, 'Percy Jackson e o Ladrão de Raios', 'Rick Riordan', 'Percy descobre que é um semideus e embarca em uma aventura para impedir uma guerra entre deuses.', 'https://m.media-amazon.com/images/I/61JenSx3wKL._SY466_.jpg', 2005, '2025-12-12 11:42:38', '400', 'Português', 'Fantasia'),
	(33, 'O Morro dos Ventos Uivantes', 'Emily Brontë', 'Um romance intenso e sombrio sobre amor, obsessão e vingança entre Heathcliff e Catherine.', 'https://m.media-amazon.com/images/I/71lqmkoeosL._SY466_.jpg', 1847, '2025-12-12 11:42:38', '360', 'Português', 'Romance'),
	(34, 'A Seleção', 'Kiera Cass', 'America Singer vive em uma sociedade dividida por castas e é selecionada para competir pelo coração do príncipe Maxon.', 'https://m.media-amazon.com/images/I/81ql6xkkliL.jpg', 2012, '2025-12-12 11:58:53', '368', 'Português', 'Romance'),
	(35, 'It: A Coisa', 'Stephen King', 'Um grupo de amigos enfrenta uma entidade maligna que se manifesta em suas piores formas e retorna a cada 27 anos.', 'https://m.media-amazon.com/images/I/91g9Dvtf+jL._UF350,350_QL50_.jpg', 1986, '2025-12-12 11:58:53', '1104', 'Português', 'Terror'),
	(36, 'O Alquimista', 'Paulo Coelho', 'Santiago, um jovem pastor, parte em uma jornada em busca de um tesouro e acaba descobrindo o significado da vida.', 'https://m.media-amazon.com/images/I/81slUinjTlS.jpg', 1988, '2025-12-12 11:58:53', '208', 'Português', 'Ficção'),
	(37, 'O Diário de Anne Frank', 'Anne Frank', 'Relato real de uma garota judia escondida durante a Segunda Guerra Mundial.', 'https://m.media-amazon.com/images/I/81yKgdRQqHL._AC_UF1000,1000_QL80_.jpg', 1947, '2025-12-12 11:58:53', '352', 'Português', 'Biografia'),
	(38, 'O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', 'Frodo Bolseiro embarca em uma jornada épica para destruir o Um Anel.', 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg', 1954, '2025-12-12 11:58:53', '576', 'Português', 'Fantasia'),
	(39, 'A Arte da Guerra', 'Sun Tzu', 'Clássico tratado militar com lições aplicadas à estratégia e tomadas de decisão.', 'https://m.media-amazon.com/images/I/51Fe45NGwkL.jpg', -500, '2025-12-12 11:58:53', '160', 'Português', 'Estratégia'),
	(40, 'Coraline', 'Neil Gaiman', 'Coraline descobre uma porta secreta que leva a um mundo paralelo assustador.', 'https://m.media-amazon.com/images/I/91DZobBc1BL.jpg', 2002, '2025-12-12 11:58:53', '192', 'Português', 'Suspense'),
	(41, 'O Lar da Srta. Peregrine para Crianças Peculiares', 'Ransom Riggs', 'Jacob descobre uma ilha misteriosa cheia de crianças com habilidades especiais.', 'https://m.media-amazon.com/images/I/91RUVXInOiL._UF1000,1000_QL80_.jpg', 2011, '2025-12-12 11:58:53', '336', 'Português', 'Fantasia'),
	(42, 'O Nome do Vento', 'Patrick Rothfuss', 'Kvothe narra sua própria história — de menino prodígio a uma das figuras mais lendárias do mundo.', 'https://m.media-amazon.com/images/I/81tbaCrD--L._UF1000,1000_QL80_.jpg', 2007, '2025-12-12 11:58:53', '656', 'Português', 'Fantasia'),
	(44, 'Jogos Vorazes', 'Suzanne Collins', 'Em um futuro distópico, Katniss Everdeen se voluntaria para participar de uma competição mortal televisionada.', 'https://m.media-amazon.com/images/I/71WOkspHbOL._UF1000,1000_QL80_.jpg', 2008, '2025-12-12 12:01:33', '374', 'Português', 'Distopia'),
	(46, 'O Grande Gatsby', 'F. Scott Fitzgerald', 'Um clássico que retrata a alta sociedade americana, obsessões, riqueza e ilusões durante os anos 1920.', 'https://m.media-amazon.com/images/I/81xjr9TiTtL._AC_UF1000,1000_QL80_.jpg', 1925, '2025-12-12 12:01:33', '180', 'Português', 'Clássico'),
	(47, 'O Sol é Para Todos', 'Harper Lee', 'A jovem Scout testemunha seu pai defender um homem inocente em um ambiente profundamente racista.', 'https://m.media-amazon.com/images/I/91WKPd60P4L.jpg', 1960, '2025-12-12 12:01:33', '336', 'Português', 'Ficção'),
	(48, 'O Apanhador no Campo de Centeio', 'J.D. Salinger', 'Holden Caulfield narra sua jornada solitária por Nova York após ser expulso do colégio.', 'https://m.media-amazon.com/images/I/71b3GDZMzSL.jpg', 1951, '2025-12-12 12:01:33', '277', 'Português', 'Ficção'),
	(49, 'Duna', 'Frank Herbert', 'A jornada épica de Paul Atreides em um planeta desértico onde política, religião e poder se misturam.', 'https://m.media-amazon.com/images/I/81zN7udGRUL.jpg', 1965, '2025-12-12 12:01:33', '688', 'Português', 'Ficção Científica'),
	(50, 'O Menino do Pijama Listrado', 'John Boyne', 'A história comovente de um garoto que faz amizade com um menino preso em um campo de concentração.', 'https://m.media-amazon.com/images/I/91YD+gCjjyL.jpg', 2006, '2025-12-12 12:01:33', '224', 'Português', 'Drama'),
	(52, 'A Revolução dos Bichos', 'George Orwell', 'Uma sátira política em que animais assumem uma fazenda e recriam uma sociedade autoritária.', 'https://m.media-amazon.com/images/I/91BsZhxCRjL.jpg', 1945, '2025-12-12 12:01:33', '152', 'Português', 'Distopia'),
	(54, 'A Garota do Trem', 'Paula Hawkins', 'Rachel presencia algo chocante durante sua viagem diária de trem e acaba envolvida em um mistério.', 'https://m.media-amazon.com/images/I/91h-D3B+7yL._UF1000,1000_QL80_.jpg', 2015, '2025-12-12 12:24:55', '336', 'Português', 'Suspense'),
	(55, 'O Homem de Giz', 'C. J. Tudor', 'Um grupo de amigos encontra um corpo após seguir desenhos de giz deixados misteriosamente pela cidade.', 'https://m.media-amazon.com/images/I/91o6FMAy8UL._AC_UF1000,1000_QL80_.jpg', 2018, '2025-12-12 12:24:55', '352', 'Português', 'Thriller'),
	(56, 'Eleanor & Park', 'Rainbow Rowell', 'Dois adolescentes improváveis se apaixonam enquanto lidam com problemas familiares e inseguranças.', 'https://m.media-amazon.com/images/I/714nqDeIwOL.jpg', 2013, '2025-12-12 12:24:55', '336', 'Português', 'Romance'),
	(57, 'A Cidade da Meia-Noite', 'Charlie Jane Anders', 'Uma jovem crescida numa sociedade dividida precisa lutar contra seu destino e proteger quem ama.', 'https://m.media-amazon.com/images/I/81Hg9RzPQ5L._AC_UF1000,1000_QL80_.jpg', 2016, '2025-12-12 12:24:55', '432', 'Português', 'Ficção Científica'),
	(58, 'A Paciente Silenciosa', 'Alex Michaelides', 'Alicia Berenson atira no marido e nunca mais fala uma palavra — um psicoterapeuta quer descobrir por quê.', 'https://m.media-amazon.com/images/I/91R8S52UP6L._AC_UF1000,1000_QL80_.jpg', 2019, '2025-12-12 12:24:55', '336', 'Português', 'Suspense Psicológico'),
	(59, 'A Canção de Aquiles', 'Madeline Miller', 'A história de Pátroclo e Aquiles reimaginada em uma poderosa narrativa épica e romântica.', 'https://m.media-amazon.com/images/I/81yp6F62ltS._UF1000,1000_QL80_.jpg', 2011, '2025-12-12 12:24:55', '384', 'Português', 'Romance'),
	(60, 'O Conto da Aia', 'Margaret Atwood', 'Em um regime totalitário, mulheres férteis são escravizadas para reprodução.', 'https://m.media-amazon.com/images/I/91nJArLKIJL._UF1000,1000_QL80_.jpg', 1985, '2025-12-12 12:24:55', '311', 'Português', 'Distopia'),
	(61, 'A Biblioteca da Meia-Noite', 'Matt Haig', 'Nora Seed descobre uma biblioteca que permite ver vidas alternativas que poderia ter vivido.', 'https://m.media-amazon.com/images/I/81flXGbA6-L._UF1000,1000_QL80_.jpg', 2020, '2025-12-12 12:24:55', '304', 'Português', 'Ficção'),
	(62, 'Neuromancer', 'William Gibson', 'Um hacker decadente recebe a chance de realizar um último trabalho em um mundo cyberpunk dominado por corporações.', 'https://m.media-amazon.com/images/I/91Bx5ilP+EL.jpg', 1984, '2025-12-12 12:30:34', '288', 'Português', 'Ficção Científica'),
	(63, 'O Contato', 'Carl Sagan', 'Uma cientista descobre uma mensagem enviada por uma civilização extraterrestre e embarca em uma missão inédita.', 'https://m.media-amazon.com/images/I/818Lf1Dy3zL._AC_UF1000,1000_QL80_.jpg', 1985, '2025-12-12 12:30:34', '432', 'Português', 'Ficção Científica'),
	(65, 'O Circo da Noite', 'Erin Morgenstern', 'Dois jovens mágicos competem em um desafio mortal dentro de um circo que aparece sem aviso pelo mundo.', 'https://m.media-amazon.com/images/I/81mQNpDPIuL.jpg', 2011, '2025-12-12 12:30:34', '512', 'Português', 'Fantasia'),
	(66, 'O Pintassilgo', 'Donna Tartt', 'Após sobreviver a um ataque terrorista, Theo se vê envolvido em mistérios, arte e escolhas perigosas.', 'https://m.media-amazon.com/images/I/81IRoYVQiNL.jpg', 2013, '2025-12-12 12:30:34', '784', 'Português', 'Drama'),
	(67, 'Garota Exemplar', 'Gillian Flynn', 'No dia do aniversário de casamento, Amy desaparece — e todas as suspeitas recaem sobre seu marido.', 'https://m.media-amazon.com/images/I/510k5EkYuWL._AC_UF1000,1000_QL80_.jpg', 2012, '2025-12-12 12:30:34', '432', 'Português', 'Suspense'),
	(68, 'As Benevolentes', 'Jonathan Littell', 'Um ex-oficial nazista narra seus próprios crimes e sua visão perturbadora da guerra.', 'https://m.media-amazon.com/images/I/71tmVD7IoCL._UF1000,1000_QL80_.jpg', 2006, '2025-12-12 12:30:34', '992', 'Português', 'Ficção Histórica'),
	(70, 'A Rainha Vermelha', 'Victoria Aveyard', 'Mare descobre ter poderes extraordinários em um reino dividido entre sangue vermelho e prateado.', 'https://m.media-amazon.com/images/I/81DQMKmWvCL._UF1000,1000_QL80_.jpg', 2015, '2025-12-12 12:30:34', '416', 'Português', 'Fantasia'),
	(71, 'Sussurro', 'Becca Fitzpatrick', 'Nora conhece Patch, um anjo caído misterioso que a envolve em um romance perigoso.', 'https://m.media-amazon.com/images/I/71vDiJcTPVL._UF1000,1000_QL80_.jpg', 2009, '2025-12-12 12:30:34', '391', 'Português', 'Romance / Fantasia'),
	(72, 'Sombra e Ossos', 'Leigh Bardugo', 'Alina Starkov descobre possuir um poder raro capaz de mudar o destino de seu mundo, mergulhando em intrigas, magia e conflitos sombrios.', 'https://m.media-amazon.com/images/I/81WKPIFKThL.jpg', 2012, '2025-12-13 22:22:10', '358', 'Português', 'Romance');

-- Copiando estrutura para tabela bibliotec.livros_categorias
CREATE TABLE IF NOT EXISTS `livros_categorias` (
  `livro_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  PRIMARY KEY (`livro_id`,`categoria_id`),
  UNIQUE KEY `uk_livro_categoria` (`livro_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `livros_categorias_ibfk_1` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`livro_id`) ON DELETE CASCADE,
  CONSTRAINT `livros_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.livros_categorias: ~46 rows (aproximadamente)
INSERT INTO `livros_categorias` (`livro_id`, `categoria_id`) VALUES
	(1, 1),
	(1, 2),
	(2, 2),
	(3, 2),
	(24, 2),
	(25, 4),
	(26, 3),
	(27, 3),
	(28, 5),
	(29, 6),
	(30, 2),
	(31, 7),
	(32, 3),
	(33, 2),
	(34, 2),
	(35, 8),
	(36, 1),
	(37, 9),
	(38, 3),
	(39, 10),
	(40, 5),
	(41, 3),
	(42, 3),
	(44, 7),
	(46, 11),
	(47, 1),
	(48, 1),
	(49, 12),
	(50, 6),
	(52, 7),
	(54, 5),
	(55, 13),
	(56, 2),
	(57, 12),
	(58, 14),
	(59, 2),
	(60, 7),
	(61, 1),
	(62, 12),
	(63, 12),
	(65, 3),
	(66, 6),
	(67, 5),
	(68, 15),
	(70, 3),
	(71, 16);

-- Copiando estrutura para tabela bibliotec.reservas
CREATE TABLE IF NOT EXISTS `reservas` (
  `id_reservado` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_retirada` int(11) DEFAULT NULL,
  `data_devolucao` int(11) DEFAULT NULL,
  `confirmado_email` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'reservado',
  PRIMARY KEY (`id_reservado`),
  KEY `FK_reservas_usuario` (`usuario_id`),
  KEY `FK_reservas_livro` (`livro_id`),
  CONSTRAINT `FK_reservas_livro` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`livro_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_reservas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.reservas: ~10 rows (aproximadamente)
INSERT INTO `reservas` (`id_reservado`, `usuario_id`, `livro_id`, `data_retirada`, `data_devolucao`, `confirmado_email`, `status`) VALUES
	(7, 3, 1, NULL, NULL, NULL, 'reservado'),
	(10, 4, 1, NULL, NULL, NULL, 'reservado'),
	(11, 4, 29, NULL, NULL, NULL, 'reservado'),
	(12, 4, 25, NULL, NULL, NULL, 'reservado'),
	(14, 4, 27, NULL, NULL, NULL, 'reservado'),
	(15, 4, 30, NULL, NULL, NULL, 'reservado'),
	(16, 4, 38, NULL, NULL, NULL, 'reservado'),
	(17, 4, 46, NULL, NULL, NULL, 'reservado'),
	(18, 4, 58, NULL, NULL, NULL, 'reservado'),
	(20, 4, 24, NULL, NULL, NULL, 'reservado');

-- Copiando estrutura para tabela bibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome` varchar(250) NOT NULL,
  `CPF` varchar(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `telefone` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `chk_senha` CHECK (char_length(`senha`) >= 8)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.usuarios: ~6 rows (aproximadamente)
INSERT INTO `usuarios` (`usuario_id`, `email`, `senha`, `nome`, `CPF`, `is_admin`, `telefone`) VALUES
	(1, 'isabella@gmail.com', '82bc79eb224ea98d47f241bfa30d67c2346232c4c6a6e7be8d3dc69110f904cf', 'isabella lopreti', '01234567890', 0, NULL),
	(3, 'lavinia@gmail.com', 'f583836223551ee2255d185addae4a54beb4e76818ec1ceaad1122b8b086b540', 'lavínia chaves', '12345678900', 0, '11919895100'),
	(4, 'lavi@gmail.com', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'laví chaves', '98765432109', 0, NULL),
	(5, 'lopretis@gmail.com', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'isabella lopreti', '78965412300', 0, NULL),
	(6, 'admin@bibliotec.com', '201bce2458f00a54130c695ca8d1658319b32206d495adf175847b57bd4a4151', 'Admin Master', '999999999', 1, NULL),
	(7, 'kelvin@gmal.com', 'kelvinho123', 'kelvin silva', '12345678912', 0, NULL);

-- Copiando estrutura para trigger bibliotec.trg_livro_categoria_ai
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_livro_categoria_ai
AFTER INSERT ON livros
FOR EACH ROW
BEGIN
    DECLARE v_categoria_id INT;

    SELECT id
    INTO v_categoria_id
    FROM categorias
    WHERE nome = NEW.categoria
    LIMIT 1;

    IF v_categoria_id IS NOT NULL THEN
        INSERT INTO livros_categorias (livro_id, categoria_id)
        VALUES (NEW.livro_id, v_categoria_id);
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
