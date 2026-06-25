const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./routes/clienteRoutes');
const viajeRoutes = require('./routes/viajeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de prueba de salud (Útil para el monitoreo de Render)
app.get('/health', (req, res) => res.status(200).send('OK'));

// Rutas de la API
app.use('/api/clientes', clienteRoutes);
app.use('/api/viajes', viajeRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware Global de Errores (Siempre al final)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
