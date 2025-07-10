const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite peticiones desde tu app móvil

// Configura tus credenciales de NeonDB/PostgreSQL aquí:
const pool = new Pool({
  user: 'neondb_owner',         // <-- tu usuario de la base de datos
  host: 'ep-fancy-block-afyjjj0n-pooler.c-2.us-west-2.aws.neon.tech',         // <-- host de NeonDB, por ejemplo: ep-xxxx.us-east-2.aws.neon.tech
  database: 'neondb',       // <-- nombre de tu base de datos
  password: 'npg_BoRaH8bQc1pd', // <-- tu contraseña
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Endpoint seguro para obtener el primer usuario
app.get('/api/first-user', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, date_of_birth, gender FROM users ORDER BY created_at ASC LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Puerto configurable
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`)); 