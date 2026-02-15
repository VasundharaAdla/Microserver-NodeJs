const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

connectDB();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
