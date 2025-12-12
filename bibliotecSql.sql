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

-- Copiando estrutura para tabela bibliotec.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.categorias: ~3 rows (aproximadamente)
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.favoritos: ~8 rows (aproximadamente)
INSERT INTO `favoritos` (`id`, `usuario_id`, `livro_id`) VALUES
	(36, 1, 1),
	(37, 1, 1),
	(38, 1, 3),
	(39, 1, 2),
	(40, 1, 2),
	(46, 3, 2),
	(48, 4, 2),
	(49, 4, 1),
	(50, 4, 50),
	(51, 4, 38);

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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.livros: ~45 rows (aproximadamente)
INSERT INTO `livros` (`livro_id`, `titulo`, `autor`, `descricao`, `capa_url`, `publicado_ano`, `criado_em`, `quant_paginas`, `idioma`, `categoria`) VALUES
	(1, 'Crepúsculo', 'Stephenie Meyer', 'Bella Swan se muda para a pequena e chuvosa cidade de Forks, onde sua vida toma um rumo inesperado ao conhecer Edward Cullen, um misterioso colega de escola. Conforme os dois se aproximam, Bella descobre que Edward pertence a uma família de vampiros e acaba envolvida em um romance proibido que coloca sua vida em risco.', 'https://m.media-amazon.com/images/I/618fXbK+OkL._SY425_.jpg', 2005, '2025-11-19 11:19:42', '288', 'Português', NULL),
	(2, 'Cinquenta Tons de Cinza', 'E. L. James', 'Quando a estudante Anastasia Steele entrevista o jovem empresário Christian Grey, ela é atraída por sua beleza, poder e mistério. Apesar de suas diferenças, os dois embarcam em um relacionamento intenso e complexo, marcado por regras rígidas, limites pessoais e a busca por confiança e vulnerabilidade.', 'https://m.media-amazon.com/images/I/51XHQHnyciL._SY445_SX342_ML2_.jpg', 2011, '2025-11-19 11:19:42', '480', 'Português', NULL),
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
	(71, 'Sussurro', 'Becca Fitzpatrick', 'Nora conhece Patch, um anjo caído misterioso que a envolve em um romance perigoso.', 'https://m.media-amazon.com/images/I/71vDiJcTPVL._UF1000,1000_QL80_.jpg', 2009, '2025-12-12 12:30:34', '391', 'Português', 'Romance / Fantasia');

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.reservas: ~2 rows (aproximadamente)
INSERT INTO `reservas` (`id_reservado`, `usuario_id`, `livro_id`, `data_retirada`, `data_devolucao`, `confirmado_email`, `criado_em`) VALUES
	(7, 3, 1, NULL, NULL, NULL, NULL),
	(10, 4, 1, NULL, NULL, NULL, NULL),
	(11, 4, 29, NULL, NULL, NULL, NULL),
	(12, 4, 25, NULL, NULL, NULL, NULL),
	(13, 4, 24, NULL, NULL, NULL, NULL),
	(14, 4, 27, NULL, NULL, NULL, NULL),
	(15, 4, 30, NULL, NULL, NULL, NULL),
	(16, 4, 38, NULL, NULL, NULL, NULL),
	(17, 4, 46, NULL, NULL, NULL, NULL),
	(18, 4, 58, NULL, NULL, NULL, NULL);

-- Copiando estrutura para tabela bibliotec.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `nome` varchar(250) NOT NULL,
  `CPF` varchar(11) NOT NULL,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `chk_senha` CHECK (char_length(`senha`) >= 8)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela bibliotec.usuarios: ~5 rows (aproximadamente)
INSERT INTO `usuarios` (`usuario_id`, `email`, `senha`, `nome`, `CPF`) VALUES
	(1, 'isabella@gmail.com', 'senha12345', 'isabella lopreti', '01234567890'),
	(2, 'teste@example.com', 'password123', 'Teste Usuario', '12345678901'),
	(3, 'lavinia@gmail.com', 'senha54321', 'lavínia chaves', '12345678900'),
	(4, 'lavi@gmail.com', '12345678', 'laví chaves', '98765432109'),
	(5, 'lopretis@gmail.com', '12345678', 'isabella lopreti', '78965412300');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
