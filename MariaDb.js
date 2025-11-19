const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const app = express();

// Middleware para permitir requisições de outras origens
app.use(cors());

// Middleware essencial para que o Express consiga ler JSON enviado no corpo das requisições
app.use(express.json());

// Configurações do Pool de Conexões com o MariaDB
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'senai',   
  database: 'bibliotec',
  port: 3306,
  connectionLimit: 5 
});

// =======================================================
// Rota GET para listar TODOS os livros (READ ALL)
// =======================================================
app.get("/livros", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection(); 
    const rows = await conn.query("SELECT * FROM livros");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao consultar o banco:", err);
    res.status(500).send("Erro interno do servidor: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// =======================================================
// Rota GET para buscar UM livro por ID (READ ONE)
// =======================================================
app.get("/livros/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) return res.status(400).send("ID inválido.");

  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM livros WHERE livro_id = ? LIMIT 1", [id]);
    
    if (rows.length === 0) {
      res.status(404).json({ message: `Livro com ID ${id} não encontrado.` });
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error("Erro ao buscar livro:", err);
    res.status(500).send("Erro interno do servidor: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// =======================================================
// Rota POST para inserir um livro (CREATE)
// =======================================================
app.post("/livros", async (req, res) => {
  const { titulo, autor, descricao, capa_url, publicado_ano, quant_paginas, idioma } = req.body;

  if (!titulo || !autor) {
    return res.status(400).send("Título e autor são obrigatórios.");
  }

  let conn;
  try {
    conn = await pool.getConnection();
    
    const result = await conn.query(
      "INSERT INTO livros (titulo, autor, descricao, capa_url, publicado_ano, quant_paginas, idioma) VALUES (?, ?, ?, ?, ?, ?, ?)", 
      [titulo, autor, descricao, capa_url, publicado_ano, quant_paginas, idioma]
    );

    res.status(201).json({
      message: "Livro inserido com sucesso!",
      id_inserido: result.insertId,
    });

  } catch (err) {
    console.error("Erro ao inserir livro:", err);
    res.status(500).send("Erro ao inserir livro: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// =======================================================
// Rota PUT para atualizar um livro (UPDATE)
// =======================================================
app.put("/livros/:id", async (req, res) => {
  const id = req.params.id;
  const { titulo, autor, descricao, capa_url, publicado_ano, quant_paginas, idioma } = req.body;

  if (isNaN(id)) return res.status(400).send("ID inválido.");

  let conn;
  try {
    conn = await pool.getConnection();

    const fields = [];
    const values = [];

    if (titulo) { fields.push("titulo = ?"); values.push(titulo); }
    if (autor) { fields.push("autor = ?"); values.push(autor); }
    if (descricao) { fields.push("descricao = ?"); values.push(descricao); }
    if (capa_url) { fields.push("capa_url = ?"); values.push(capa_url); }
    if (publicado_ano) { fields.push("publicado_ano = ?"); values.push(publicado_ano); }
    if (quant_paginas) { fields.push("quant_paginas = ?"); values.push(quant_paginas); }
    if (idioma) { fields.push("idioma = ?"); values.push(idioma); }

    if (fields.length === 0) return res.status(400).send("Nenhum campo para atualizar.");

    values.push(id);

    const query = `UPDATE livros SET ${fields.join(", ")} WHERE livro_id = ?`;
    const result = await conn.query(query, values);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: `Livro com ID ${id} não encontrado.` });
    } else {
      res.status(200).json({ message: `Livro atualizado com sucesso.` });
    }

  } catch (err) {
    console.error("Erro ao atualizar livro:", err);
    res.status(500).send("Erro ao atualizar livro: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// =======================================================
// Rota DELETE
// =======================================================
app.delete("/livros/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) return res.status(400).send("ID inválido.");

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM livros WHERE livro_id = ?", [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: `Livro com ID ${id} não encontrado.` });
    } else {
      res.status(200).json({ message: `Livro excluído com sucesso.` });
    }
  } catch (err) {
    console.error("Erro ao excluir livro:", err);
    res.status(500).send("Erro ao excluir: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// =======================================================
// Iniciar servidor
// =======================================================
app.listen(3000, () => {
  console.log("API rodando em: http://localhost:3000/livros");
  console.log("Servidor Express iniciado na porta 3000.");
});