const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en Render/Supabase
  }
});

// Validar conexión al iniciar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.stack);
  } else {
    console.log('🚀 Conexión a PostgreSQL establecida con éxito.');
  }
});

module.exports = pool;
