const express = require("express");

const mariadb = require("mariadb");

const cors = require("cors");



const app = express();

app.use(cors());

app.use(express.json());

const bcrypt = require('bcrypt');

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



// ======================================================

// CADASTRAR NOVO LIVRO

// ======================================================

app.post('/livros', async (req, res) => {
    const {
        titulo,
        autor,
        descricao,
        publicado_ano,
        quant_paginas,
        idioma,
        capa_url
    } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        const result = await conn.query(
            `INSERT INTO livros 
            (titulo, autor, descricao, publicado_ano, quant_paginas, idioma, capa_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [titulo, autor, descricao, publicado_ano, quant_paginas, idioma, capa_url]
        );

        res.status(201).json({
            success: true,
            livro_id: Number(result.insertId), // 🔥 CORREÇÃO AQUI
            message: 'Livro cadastrado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar livro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor'
        });
    } finally {
        if (conn) conn.release();
    }
});





// ======================================================

// ATUALIZAR LIVRO

// ======================================================

app.put('/livros/:id', async (req, res) => {

    const { id } = req.params;

    const { titulo, autor, descricao, publicado_ano, quant_paginas, idioma } = req.body;

    let conn;



    try {

        conn = await pool.getConnection();



        await conn.query(

            'UPDATE livros SET titulo = ?, autor = ?, descricao = ?, publicado_ano = ?, quant_paginas = ?, idioma = ? WHERE livro_id = ?',

            [titulo, autor, descricao, publicado_ano, quant_paginas, idioma, id]

        );



        res.json({

            success: true,

            message: 'Livro atualizado com sucesso!'

        });

    } catch (error) {

        console.error('Erro ao atualizar livro:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});



// ======================================================

// DELETAR LIVRO

// ======================================================

app.delete('/livros/:id', async (req, res) => {
    const { id } = req.params;

    // validação básica
    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID inválido'
        });
    }

    let conn;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Limpeza de tabelas relacionadas
        await conn.query('DELETE FROM livros_categorias WHERE livro_id = ?', [id]);
        await conn.query('DELETE FROM favoritos WHERE livro_id = ?', [id]);
        await conn.query('DELETE FROM reservas WHERE livro_id = ?', [id]);

        const result = await conn.query(
            'DELETE FROM livros WHERE livro_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: 'Livro não encontrado'
            });
        }

        await conn.commit();

        res.json({
            success: true,
            message: 'Livro deletado com sucesso!'
        });

    } catch (error) {
        if (conn) await conn.rollback();
        console.error('Erro ao deletar livro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor'
        });
    } finally {
        if (conn) conn.release();
    }
});



// ======================================================

// FAVORITOS

// ======================================================



// Listar favoritos de um usuário

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



// Adicionar favorito

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

        // Ignora erro de duplicidade (ex: DUPLICATE ENTRY)

        if (err.code && err.code.includes('ER_DUP_ENTRY')) {

            return res.status(200).json({ message: "Livro já está nos favoritos." });

        }

        res.status(500).json({ erro: err.message });

    } finally {

        if (conn) conn.release();

    }

});



// Remover favorito

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

// AUTENTICAÇÃO E CADASTRO

// ======================================================



// LOGIN

app.post('/login', async (req, res) => {
    const { identifier, email, senha } = req.body;

    let conn;

    // identifier pode ser email ou CPF
    const idValue = identifier || email;

    if (!idValue || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Identificador (e-mail ou CPF) e senha são obrigatórios'
        });
    }

    try {
        conn = await pool.getConnection();

        // 🔹 Buscar usuário SEM validar senha no SQL
        const rows = await conn.query(
            `SELECT 
                usuario_id,
                nome,
                email,
                CPF,
                telefone,
                senha,
                is_admin
             FROM usuarios
             WHERE email = ? OR CPF = ?`,
            [idValue, idValue]
        );

        // Usuário não encontrado
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Identificador ou senha incorretos'
            });
        }

        const usuario = rows[0];

        // 🔹 Comparar senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: 'Identificador ou senha incorretos'
            });
        }

        // 🔹 Login OK
        res.json({
            success: true,
            usuario_id: usuario.usuario_id,
            nome: usuario.nome,
            email: usuario.email,
            CPF: usuario.CPF,
            telefone: usuario.telefone,
            is_admin: usuario.is_admin,
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




// CADASTRO

app.post('/cadastro', async (req, res) => {
    const { nome, email, cpf, telefone, senha } = req.body;
    let conn;

    // 🔹 Validações
    if (!nome || !email || !cpf || !telefone || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Nome, e-mail, CPF, telefone e senha são obrigatórios'
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

        // 🔹 Verifica se email ou CPF já existem
        const usuarioExistente = await conn.query(
            'SELECT usuario_id FROM usuarios WHERE email = ? OR CPF = ?',
            [email, cpf]
        );

        if (usuarioExistente.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'E-mail ou CPF já cadastrado'
            });
        }

        // 🔹 Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // 🔹 Inserir usuário (não admin)
        await conn.query(
            `INSERT INTO usuarios 
             (nome, email, CPF, telefone, senha, is_admin) 
             VALUES (?, ?, ?, ?, ?, FALSE)`,
            [nome, email, cpf, telefone, senhaHash]
        );

        res.status(201).json({
            success: true,
            message: 'Cadastro realizado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor ao realizar o cadastro'
        });
    } finally {
        if (conn) conn.release();
    }
});




// ======================================================

// RESERVAS (Baseado na tabela `reservas`)

// ======================================================



// Listar reservas de um usuário
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
            WHERE r.usuario_id = ?
              AND r.status = 'reservado'
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




// Adicionar uma reserva

app.post('/reservados', async (req, res) => {
    const { usuario_id, livro_id } = req.body;
    let conn;

    if (!usuario_id || !livro_id) {
        return res.status(400).json({
            message: 'usuario_id e livro_id são obrigatórios'
        });
    }

    try {
        conn = await pool.getConnection();

        await conn.query(
            `INSERT INTO reservas 
             (usuario_id, livro_id, data_retirada, data_devolucao, confirmado_email, status)
             VALUES (?, ?, NOW(), NULL, FALSE, 'reservado')`,
            [usuario_id, livro_id]
        );

        res.json({ message: 'Reserva adicionada!' });

    } catch (error) {

        // 🔁 Duplicidade (mesmo usuário tentando reservar o mesmo livro)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(200).json({
                message: 'Livro já está reservado por você.'
            });
        }

        console.error('Erro ao adicionar reserva:', error);
        res.status(500).json({ message: 'Erro ao adicionar reserva' });

    } finally {
        if (conn) conn.release();
    }
});




// Remover uma reserva

app.delete('/reservados/:userId/:livroId', async (req, res) => {
    const { userId, livroId } = req.params;
    let conn;

    try {
        conn = await pool.getConnection();

        const result = await conn.query(
            `DELETE FROM reservas 
             WHERE usuario_id = ? 
               AND livro_id = ? 
               AND status = 'reservado'`,
            [userId, livroId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Reserva não encontrada.'
            });
        }

        res.json({ message: 'Reserva removida!' });

    } catch (error) {
        console.error('Erro ao remover reserva:', error);
        res.status(500).json({ message: 'Erro ao remover reserva' });
    } finally {
        if (conn) conn.release();
    }
});



// Listar todas as reservas (Admin)

app.get('/reservas/todas', async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const sql = `
            SELECT
                r.id_reservado AS reserva_id,
                r.usuario_id,
                r.livro_id,
                r.data_retirada,
                r.data_devolucao,
                r.confirmado_email,
                r.status,
                u.nome AS usuario_nome,
                l.titulo
            FROM reservas r
            JOIN usuarios u ON r.usuario_id = u.usuario_id
            JOIN livros l ON r.livro_id = l.livro_id
            ORDER BY r.data_retirada DESC;
        `;
        const rows = await conn.query(sql);

        res.json(rows);

    } catch (error) {
        console.error('Erro ao buscar todas as reservas:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conn) conn.release();
    }
});

app.get('/reservas/pendentes', async (req, res) => {

    let conn;



    try {

        conn = await pool.getConnection();



        const sql = `

            SELECT

                r.reserva_id,

                r.usuario_id,

                r.livro_id,

                r.data_reserva,

                u.nome as usuario_nome,

                l.titulo as livro_titulo

            FROM reservas r

            JOIN usuarios u ON r.usuario_id = u.usuario_id

            JOIN livros l ON r.livro_id = l.livro_id

            WHERE r.status = 'pendente' OR r.status IS NULL

            ORDER BY r.data_reserva DESC;

        `;



        const rows = await conn.query(sql);

        res.json(rows);

    } catch (error) {

        console.error('Erro ao buscar reservas pendentes:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});



// ======================================================

// RETIRADAS (Empréstimos)

// ======================================================



// REGISTRAR RETIRADA

app.post('/retiradas', async (req, res) => {

    const { reserva_id, data_retirada, data_devolucao_prevista } = req.body;

    let conn;



    try {

        conn = await pool.getConnection();

        await conn.beginTransaction();



        // 1. Buscar dados da reserva

        const reserva = await conn.query(

            'SELECT usuario_id, livro_id, status FROM reservas WHERE reserva_id = ?',

            [reserva_id]

        );



        if (reserva.length === 0) {

            await conn.rollback();

            return res.status(404).json({ message: 'Reserva não encontrada' });

        }



        if (reserva[0].status === 'retirado' || reserva[0].status === 'concluido') {

            await conn.rollback();

            return res.status(400).json({ message: `Reserva já foi ${reserva[0].status}` });

        }



        // 2. Criar tabela retiradas se não existir (MELHOR MOVER ESTE SQL PARA MIGRAÇÃO)

        await conn.query(`

            CREATE TABLE IF NOT EXISTS retiradas (

                retirada_id INT PRIMARY KEY AUTO_INCREMENT,

                reserva_id INT,

                usuario_id INT,

                livro_id INT,

                data_retirada DATE,

                data_devolucao_prevista DATE,

                data_devolucao_real DATE,

                status VARCHAR(20) DEFAULT 'ativo',

                FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id),

                FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),

                FOREIGN KEY (livro_id) REFERENCES livros(livro_id)

            )

        `);



        // 3. Inserir retirada

        await conn.query(

            'INSERT INTO retiradas (reserva_id, usuario_id, livro_id, data_retirada, data_devolucao_prevista) VALUES (?, ?, ?, ?, ?)',

            [reserva_id, reserva[0].usuario_id, reserva[0].livro_id, data_retirada, data_devolucao_prevista]

        );



        // 4. Atualizar status da reserva

        await conn.query(

            "UPDATE reservas SET status = 'retirado' WHERE reserva_id = ?",

            [reserva_id]

        );



        await conn.commit();



        res.json({

            success: true,

            message: 'Retirada registrada com sucesso!'

        });

    } catch (error) {

        if (conn) await conn.rollback();

        console.error('Erro ao registrar retirada:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});



// LISTAR EMPRÉSTIMOS ATIVOS (Para dar baixa/devolução)

app.get('/retiradas/ativas', async (req, res) => {

    let conn;

    try {

        conn = await pool.getConnection();

        const sql = `

            SELECT

                r.retirada_id,

                u.nome as usuario_nome,

                b.titulo as livro_titulo,

                r.data_retirada,

                r.data_devolucao_prevista

            FROM retiradas r

            JOIN usuarios u ON r.usuario_id = u.usuario_id

            JOIN livros b ON r.livro_id = b.livro_id

            WHERE r.data_devolucao_real IS NULL

            ORDER BY r.data_devolucao_prevista ASC

        `;

        const rows = await conn.query(sql);

        res.json(rows);

    } catch (error) {

        console.error('Erro ao buscar retiradas ativas:', error);

        // Não retornar 500 se a tabela `retiradas` não existir ainda (apenas se for erro de conexão/lógica)

        if (error.code !== 'ER_NO_SUCH_TABLE') {

            res.status(500).json({ message: 'Erro no servidor' });

        } else {

            res.json([]);

        }



    } finally {

        if (conn) conn.release();

    }

});



// REGISTRAR DEVOLUÇÃO DO LIVRO

app.put('/retiradas/:id/devolucao', async (req, res) => {

    const { id } = req.params;

    let conn;

    try {

        conn = await pool.getConnection();

        await conn.beginTransaction();



        // 1. Atualiza a tabela retiradas com a data de hoje

        const hoje = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD



        const resultRetirada = await conn.query(

            "UPDATE retiradas SET data_devolucao_real = ?, status = 'concluido' WHERE retirada_id = ? AND data_devolucao_real IS NULL",

            [hoje, id]

        );



        if (resultRetirada.affectedRows === 0) {

            await conn.rollback();

            return res.status(404).json({ success: false, message: 'Retirada não encontrada ou já concluída.' });

        }



        // 2. Busca o ID da reserva associada

        const retirada = await conn.query("SELECT reserva_id FROM retiradas WHERE retirada_id = ?", [id]);



        // 3. Atualiza o status da reserva para "concluido"

        if (retirada.length > 0) {

            await conn.query(

                "UPDATE reservas SET status = 'concluido' WHERE reserva_id = ?",

                [retirada[0].reserva_id]

            );

        }



        await conn.commit();



        res.json({ success: true, message: 'Livro devolvido com sucesso!' });



    } catch (error) {

        if (conn) await conn.rollback();

        console.error('Erro ao registrar devolução:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});





// ======================================================

// GESTÃO DE USUÁRIOS (Admin/Perfil)

// ======================================================

app.get('/usuarios', async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            'SELECT usuario_id, nome, email, is_admin FROM usuarios'
        );

        res.json(rows);

    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conn) conn.release();
    }
});


// BUSCAR INFORMAÇÕES DO USUÁRIO

app.get('/usuarios/:usuario_id', async (req, res) => {

    const { usuario_id } = req.params;

    let conn;



    try {

        conn = await pool.getConnection();



        const rows = await conn.query(
            'SELECT usuario_id, nome, email, CPF as cpf, telefone, is_admin FROM usuarios WHERE usuario_id = ?',
            
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





// LISTAR TODOS OS USUÁRIOS (para o admin)

// ALTERAR SENHA

app.put('/usuarios/alterar-senha', async (req, res) => {

    const { usuario_id, senha_atual, senha_nova } = req.body;

    let conn;



    try {

        conn = await pool.getConnection();



        // Verificar senha atual (SEM HASH, ATUALIZAR COM SEGURANÇA)

        const usuario = await conn.query(

            'SELECT usuario_id FROM usuarios WHERE usuario_id = ? AND senha = ?',

            [usuario_id, senha_atual]

        );



        if (usuario.length === 0) {

            return res.status(401).json({

                success: false,

                message: 'Senha atual incorreta'

            });

        }



        // Atualizar senha (SEM HASH, ATUALIZAR COM SEGURANÇA)

        await conn.query(

            'UPDATE usuarios SET senha = ? WHERE usuario_id = ?',

            [senha_nova, usuario_id]

        );



        res.json({

            success: true,

            message: 'Senha alterada com sucesso'

        });

    } catch (error) {

        console.error('Erro ao alterar senha:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});


// ATUALIZAR PERFIL DO USUÁRIO

app.put('/usuarios/:usuario_id', async (req, res) => {

    const { usuario_id } = req.params;

    const { nome, email } = req.body;

    let conn;



    try {

        conn = await pool.getConnection();



        await conn.query(

            'UPDATE usuarios SET nome = ?, email = ? WHERE usuario_id = ?',

            [nome, email, usuario_id]

        );



        res.json({

            success: true,

            message: 'Perfil atualizado com sucesso'

        });

    } catch (error) {

        console.error('Erro ao atualizar perfil:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});


// TORNAR USUÁRIO ADMIN OU REMOVER ADMIN

app.put('/usuarios/:usuario_id/admin', async (req, res) => {

    const { usuario_id } = req.params;

    const { is_admin } = req.body;

    let conn;



    try {

        conn = await pool.getConnection();



        await conn.query(

            'UPDATE usuarios SET is_admin = ? WHERE usuario_id = ?',

            [is_admin, usuario_id]

        );



        res.json({

            success: true,

            message: is_admin ? 'Usuário promovido a admin' : 'Admin removido'

        });

    } catch (error) {

        console.error('Erro ao atualizar usuário:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});



// ======================================================

// DELETAR USUÁRIO (COM LIMPEZA DE DADOS E TRANSAÇÃO)

// ======================================================

// Esta é a versão completa e correta que substitui a versão simples.

app.delete('/usuarios/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    let conn;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // 1️⃣ Verifica se usuário existe e se é admin
        const [usuario] = await conn.query(
            'SELECT is_admin FROM usuarios WHERE usuario_id = ?',
            [usuario_id]
        );

        if (!usuario) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        // ❌ Impede exclusão de administrador
        if (usuario.is_admin === 1) {
            await conn.rollback();
            return res.status(403).json({
                success: false,
                message: 'Não é permitido excluir um administrador'
            });
        }

        // 2️⃣ Apaga dependências
        await conn.query(
            'DELETE FROM favoritos WHERE usuario_id = ?',
            [usuario_id]
        );

        await conn.query(
            'DELETE FROM reservas WHERE usuario_id = ?',
            [usuario_id]
        );

        // Se existir tabela retiradas
        try {
            await conn.query(
                'DELETE FROM retiradas WHERE usuario_id = ?',
                [usuario_id]
            );
        } catch (e) {
            // ignora se não existir
        }

        // 3️⃣ Apaga o usuário
        const result = await conn.query(
            'DELETE FROM usuarios WHERE usuario_id = ?',
            [usuario_id]
        );

        if (result.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        await conn.commit();

        res.json({
            success: true,
            message: 'Conta excluída com sucesso'
        });

    } catch (error) {
        if (conn) await conn.rollback();
        console.error('Erro ao deletar usuário:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao excluir conta'
        });

    } finally {
        if (conn) conn.release();
    }
});



// ======================================================

// DASHBOARD - ESTATÍSTICAS GERAIS

// ======================================================

app.get('/admin/dashboard', async (req, res) => {

    let conn;

    try {

        conn = await pool.getConnection();



        // Fazemos várias queries em paralelo para ser rápido

        const [totalLivros] = await conn.query("SELECT COUNT(*) as total FROM livros");

        const [totalUsuarios] = await conn.query("SELECT COUNT(*) as total FROM usuarios");



        // Empréstimos ativos (data_devolucao_real IS NULL)

        let totalEmprestimos = [{ total: 0 }];

        try {

            const rows = await conn.query("SELECT COUNT(*) as total FROM retiradas WHERE data_devolucao_real IS NULL");

            if (rows.length > 0) totalEmprestimos = rows;

        } catch (e) {

            // Tabela ainda não existe, ignora

        }



        // Reservas pendentes

        const [totalReservas] = await conn.query("SELECT COUNT(*) as total FROM reservas WHERE status = 'pendente' OR status IS NULL");



        res.json({

            livros: totalLivros.total,

            usuarios: totalUsuarios.total,

            emprestimos_ativos: totalEmprestimos[0].total,

            reservas_pendentes: totalReservas.total

        });



    } catch (error) {

        console.error('Erro no dashboard:', error);

        res.status(500).json({ message: 'Erro no servidor' });

    } finally {

        if (conn) conn.release();

    }

});

// Adicione esta rota no seu server.js

// Rota para buscar dados de um admin específico
app.get('/admin/:id', async (req, res) => {
    const adminId = req.params.id;
    let conn;

    try {
        conn = await pool.getConnection();

        // mariadb retorna rows diretamente
        const rows = await conn.query(
            `
            SELECT 
                usuario_id,
                nome,
                email,
                CPF,
                telefone,
                is_admin
            FROM usuarios
            WHERE usuario_id = ? AND is_admin = 1
            `,
            [adminId]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Administrador não encontrado'
            });
        }

        res.json({
            success: true,
            ...rows[0]
        });

    } catch (error) {
        console.error('Erro ao buscar admin:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor'
        });
    } finally {
        if (conn) conn.release();
    }
});


app.put('/admin/:id/senha', async (req, res) => {
    const adminId = req.params.id;
    const { senhaAtual, novaSenha } = req.body;
    let conn;

    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
            success: false,
            message: 'Senha atual e nova senha são obrigatórias'
        });
    }

    try {
        conn = await pool.getConnection();

        // Busca a senha atual do admin
        const rows = await conn.query(
            `
            SELECT senha
            FROM usuarios
            WHERE usuario_id = ? AND is_admin = 1
            `,
            [adminId]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Administrador não encontrado'
            });
        }

        const senhaHashBanco = rows[0].senha;

        // Confere senha atual
        const senhaConfere = await bcrypt.compare(senhaAtual, senhaHashBanco);

        if (!senhaConfere) {
            return res.status(401).json({
                success: false,
                message: 'Senha atual incorreta'
            });
        }

        // Gera novo hash
        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualiza senha
        await conn.query(
            `
            UPDATE usuarios
            SET senha = ?
            WHERE usuario_id = ? AND is_admin = 1
            `,
            [novaSenhaHash, adminId]
        );

        res.json({
            success: true,
            message: 'Senha alterada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao alterar senha do admin:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor'
        });
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