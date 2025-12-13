const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
// Servir arquivos estáticos do projeto para facilitar desenvolvimento
app.use(express.static(path.join(__dirname)));

// Log simples de todas as requisições para facilitar depuração
app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.url);
    next();
});

// Conexão com o banco
const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "senai",
    database: "bibliotec",
    connectionLimit: 5
});

// ======================================================
// LISTAR TODOS OS LIVROS COM CATEGORIAS
// ======================================================
app.get("/livros", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        
        // Query que lista todos os livros e agrega suas categorias
        const query = `
            SELECT
                l.livro_id,
                l.titulo,
                l.autor,
                l.capa_url,
                l.descricao,
                l.publicado_ano,
                l.quant_paginas,
                l.idioma,
                GROUP_CONCAT(c.nome SEPARATOR ', ') AS categorias
            FROM
                livros l
            LEFT JOIN
                livros_categorias lc ON l.livro_id = lc.livro_id
            LEFT JOIN
                categorias c ON lc.categoria_id = c.id
            GROUP BY
                l.livro_id, l.titulo, l.autor, l.capa_url, l.descricao, l.publicado_ano, l.quant_paginas, l.idioma
            ORDER BY
                l.livro_id;
        `.trim();
        
        const rows = await conn.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// ======================================================
// BUSCAR UM LIVRO PELO ID COM CATEGORIAS
// ======================================================
app.get("/livros/:id", async (req, res) => {
    const id = req.params.id;

    let conn;
    try {
        conn = await pool.getConnection();

        // Query que busca um livro pelo ID e agrega suas categorias
        const query = `
            SELECT
                l.livro_id,
                l.titulo,
                l.autor,
                l.capa_url,
                l.descricao,
                l.publicado_ano,
                l.quant_paginas,
                l.idioma,
                GROUP_CONCAT(c.nome SEPARATOR ', ') AS categorias
            FROM
                livros l
            LEFT JOIN
                livros_categorias lc ON l.livro_id = lc.livro_id
            LEFT JOIN
                categorias c ON lc.categoria_id = c.id
            WHERE
                l.livro_id = ?
            GROUP BY
                l.livro_id, l.titulo, l.autor, l.capa_url, l.descricao, l.publicado_ano, l.quant_paginas, l.idioma;
        `;

        const rows = await conn.query(query, [id]);

        if (rows.length === 0) {
            return res.json({ message: "Livro não encontrado" });
        }

        // Retorna o primeiro (e único) resultado
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    } finally {
        if (conn) conn.release();
    }
});

app.get('/favoritos/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    let conn;

    try {
        conn = await pool.getConnection();

        const sql = `
            SELECT 
                f.livro_id,
                l.titulo,
                l.autor,
                l.capa_url
            FROM favoritos f
            LEFT JOIN livros l ON f.livro_id = l.livro_id
            WHERE f.usuario_id = ?;
        `;

        const rows = await conn.query(sql, [usuario_id]);

        res.json(rows || []);
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conn) conn.release();
    }
});
// ======================================================
// ADICIONAR FAVORITO
// ======================================================
app.post("/favoritos", async (req, res) => {
    const { usuario_id, livro_id } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();

        await conn.query(
            "INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)",
            [usuario_id, livro_id]
        );

        res.json({ message: "Favorito adicionado!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// ======================================================
// REMOVER FAVORITO
// ======================================================
app.delete("/favoritos/:userId/:livroId", async (req, res) => {
    const userId = req.params.userId;
    const livroId = req.params.livroId;

    let conn;
    try {
        conn = await pool.getConnection();

        await conn.query(
            "DELETE FROM favoritos WHERE usuario_id = ? AND livro_id = ?",
            [userId, livroId]
        );

        res.json({ message: "Favorito removido!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// ======================================================
// LOGIN
// ======================================================
app.post('/login', async (req, res) => {
    const { identifier, email, senha } = req.body;
    let conn;

    // identifier: pode ser email ou CPF. Mantemos compatibilidade com o campo `email`.
    const idValue = identifier || email;

    if (!idValue || !senha) {
        return res.status(400).json({ 
            success: false, 
            message: 'Identificador (e-mail ou CPF) e senha são obrigatórios' 
        });
    }

    try {
        conn = await pool.getConnection();

        // Busca por email OU cpf igual ao identificador informado
        const rows = await conn.query(
            'SELECT usuario_id, nome, email, cpf FROM usuarios WHERE (email = ? OR cpf = ?) AND senha = ?',
            [idValue, idValue, senha]
        );

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Identificador ou senha incorretos' 
            });
        }

        const usuario = rows[0];
        res.json({
            success: true,
            usuario_id: usuario.usuario_id,
            nome: usuario.nome,
            email: usuario.email,
            message: 'Login realizado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro no servidor' 
        });
    } finally {
        if (conn) conn.release();
    }
});

// ======================================================
// CADASTRO
// ======================================================
app.post('/cadastro', async (req, res) => {
    const { nome, email, cpf, senha } = req.body;
    let conn;

    // Validações
    if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({ 
            success: false, 
            message: 'Nome, e-mail, CPF e senha são obrigatórios' 
        });
    }

    if (senha.length < 8) {
        return res.status(400).json({ 
            success: false, 
            message: 'A senha deve ter no mínimo 8 caracteres' 
        });
    }

    try {
        conn = await pool.getConnection();

        // Verifica se o email ou CPF já existe
        const usuarioExistente = await conn.query(
            'SELECT usuario_id FROM usuarios WHERE email = ? OR cpf = ?',
            [email, cpf]
        );

        if (usuarioExistente.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'E-mail ou CPF já cadastrado' 
            });
        }

        // Insere o novo usuário (colunas: nome, email, cpf, senha)
        await conn.query(
            'INSERT INTO usuarios (nome, email, cpf, senha) VALUES (?, ?, ?, ?)',
            [nome, email, cpf, senha]
        );

        res.status(201).json({
            success: true,
            message: 'Cadastro realizado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro no servidor ao realizar o cadastro',
            error: error.message
        });
    } finally {
        if (conn) conn.release();
    }
});

// ======================================================
// RESERVADOS (baseado na tabela `reservas`)
// ======================================================

// Listar reservados de um usuário
app.get('/reservados/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    let conn;

    try {
        conn = await pool.getConnection();

        const sql = `
            SELECT
                r.livro_id,
                l.titulo,
                l.autor,
                l.capa_url
            FROM reservas r
            JOIN livros l ON r.livro_id = l.livro_id
            WHERE r.usuario_id = ?;
        `;

        const rows = await conn.query(sql, [usuario_id]);

        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar reservados:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conn) conn.release();
    }
});

// Adicionar um reservado
app.post('/reservados', async (req, res) => {
    const { usuario_id, livro_id } = req.body;
    let conn;

    try {
        conn = await pool.getConnection();

        await conn.query(
            'INSERT INTO reservas (usuario_id, livro_id) VALUES (?, ?)',
            [usuario_id, livro_id]
        );

        res.json({ message: 'Reserva adicionada!' });
    } catch (error) {
        console.error('Erro ao adicionar reserva:', error);
        res.status(500).json({ message: 'Erro ao adicionar reserva' });
    } finally {
        if (conn) conn.release();
    }
});

// Remover um reservado
app.delete('/reservados/:userId/:livroId', async (req, res) => {
    const userId = req.params.userId;
    const livroId = req.params.livroId;
    let conn;

    try {
        conn = await pool.getConnection();

        await conn.query(
            'DELETE FROM reservas WHERE usuario_id = ? AND livro_id = ?',
            [userId, livroId]
        );

        res.json({ message: 'Reserva removida!' });
    } catch (error) {
        console.error('Erro ao remover reserva:', error);
        res.status(500).json({ message: 'Erro ao remover reserva' });
    } finally {
        if (conn) conn.release();
    }
});

// ======================================================
// BUSCAR INFORMAÇÕES DO USUÁRIO
// ======================================================
app.get('/usuarios/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    let conn;

    console.log('Rota chamada: GET /usuarios/', usuario_id);
    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            'SELECT usuario_id, nome, email, cpf FROM usuarios WHERE usuario_id = ?',
            [usuario_id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conn) conn.release();
    }
});

// Capturar erros globais para não fechar o processo sem log
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});