const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Auth Service: ${config.authServiceUrl}`);
  console.log(`Product Service: ${config.productServiceUrl}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
