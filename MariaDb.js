const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
            JOIN livros l ON f.livro_id = l.livro_id
            WHERE f.usuario_id = ?;
        `;

        const rows = await conn.query(sql, [usuario_id]);

        res.json(rows);
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
    const { login, senha } = req.body;
    let conn;

    if (!login || !senha) {
        return res.status(400).json({ 
            success: false, 
            message: 'Login e senha são obrigatórios' 
        });
    }

    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            'SELECT usuario_id, login FROM usuarios WHERE login = ? AND senha = ?',
            [login, senha]
        );

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Login ou senha incorretos' 
            });
        }

        const usuario = rows[0];
        res.json({
            success: true,
            usuario_id: usuario.usuario_id,
            login: usuario.login,
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

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});