const mariadb = require('mariadb');

(async () => {
  const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senai',
    database: 'bibliotec',
    connectionLimit: 5
  });

  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Conectado ao banco, executando migration...');

    // Modifica o tipo da coluna cpf para texto (aceitar zeros e tamanhos maiores)
    await conn.query("ALTER TABLE usuarios MODIFY cpf VARCHAR(30);");

    console.log('Migration concluída: coluna cpf alterada para VARCHAR(30)');
  } catch (err) {
    console.error('Erro na migration:', err);
    process.exit(1);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
})();
