const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const app = express();

// Middleware para permitir requisições de outras origens
app.use(cors());

// Middleware essencial para que o Express consiga ler JSON enviado no corpo das requisições (POST, PUT, PATCH)
app.use(express.json());

// ⚙️ Configurações do Pool de Conexões com o MariaDB
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'senai',   // sua senha atual ✅
  database: 'bibliotec',
  port: 3306,
  connectionLimit: 5 // Limita o número de conexões ativas para melhor performance
});

// 📚 Rota GET para listar todos os livros
app.get("/livros", async (req, res) => {
  let conn;
  try {
    // 1. Obtém uma conexão do pool
    conn = await pool.getConnection(); 
    
    // 2. Executa a query para selecionar todos os livros
    const rows = await conn.query("SELECT * FROM livros");
    
    // 3. Retorna os resultados como JSON
    res.json(rows);
    
  } catch (err) {
    // Em caso de erro, loga o erro e retorna um status 500
    console.error("Erro ao consultar o banco de dados:", err);
    res.status(500).send("Erro interno do servidor: " + err.message);
    
  } finally {
    // 4. Garante que a conexão seja liberada de volta para o pool
    if (conn) conn.release();
  }
});
// 📖 Rota POST para inserir um novo livro
app.post("/livros", async (req, res) => {
  // O corpo da requisição deve ter: { "titulo": "...", "autor": "..." }
  const { titulo, autor } = req.body; 

  if (!titulo || !autor) {
    return res.status(400).send("Título e autor são obrigatórios.");
  }

  let conn;
  try {
    conn = await pool.getConnection();
    
    // Query de INSERT. O '?' protege contra SQL Injection
    const result = await conn.query(
      "INSERT INTO livros (titulo, autor) VALUES (?, ?)", 
      [titulo, autor]
    );

    // Retorna a resposta com o ID do livro inserido
    res.status(201).json({
      message: "Livro inserido com sucesso!",
      id_inserido: result.insertId,
    });
    
  } catch (err) {
    console.error("Erro ao inserir livro:", err);
    res.status(500).send("Erro interno do servidor ao inserir livro: " + err.message);
    
  } finally {
    if (conn) conn.release();
  }
});

// ✏️ Rota PUT para atualizar um livro por ID
app.put("/livros/:id", async (req, res) => {
  // 1. Captura o ID do livro (parâmetro da URL) e os novos dados (corpo da requisição)
  const id = req.params.id;
  const { titulo, autor, descricao, capa_url, publicado_em } = req.body; 

  // Validação: Checa se pelo menos um campo de atualização foi fornecido
  if (!titulo && !autor && !descricao && !capa_url && !publicado_em) {
    return res.status(400).send("Nenhum dado de atualização fornecido.");
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Cria a query dinamicamente apenas com os campos que foram passados no body
    const fields = [];
    const values = [];

    // Adiciona o campo e o valor apenas se estiverem presentes no body da requisição
    if (titulo) { fields.push("titulo = ?"); values.push(titulo); }
    if (autor) { fields.push("autor = ?"); values.push(autor); }
    if (descricao) { fields.push("descricao = ?"); values.push(descricao); }
    if (capa_url) { fields.push("capa_url = ?"); values.push(capa_url); }
    if (publicado_em) { fields.push("publicado_em = ?"); values.push(publicado_em); }

    // Verifica novamente se há campos válidos para evitar uma query incompleta
    if (fields.length === 0) {
      return res.status(400).send("Nenhum campo válido para atualização encontrado.");
    }

    // Adiciona o ID ao final da lista de valores, pois ele será usado na cláusula WHERE
    values.push(id); 

    // Monta a query final
    const query = `UPDATE livros SET ${fields.join(", ")} WHERE ID = ?`;
    
    // Executa a query
    const result = await conn.query(query, values);

    // 3. Verifica o resultado da operação
    if (result.affectedRows === 0) {
      // Se 0 linhas afetadas, o ID não existe OU o dado enviado já era o mesmo
      res.status(404).json({ message: `Livro com ID ${id} não encontrado ou nenhum dado alterado.` });
    } else {
      // Sucesso na atualização
      res.status(200).json({ 
        message: `Livro com ID ${id} atualizado com sucesso.`,
        campos_atualizados: result.affectedRows 
      });
    }
    
  } catch (err) {
    console.error("Erro ao atualizar livro:", err);
    res.status(500).send("Erro interno do servidor ao atualizar livro: " + err.message);
    
  } finally {
    // Garante que a conexão com o banco de dados seja liberada
    if (conn) conn.release();
  }
});
// 🚀 Inicia o Servidor na porta 3000
app.listen(3000, () => {
    console.log("🚀 API rodando em: http://localhost:3000/livros");
    console.log("Servidor Express iniciado na porta 3000.");
});