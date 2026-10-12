import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './sockets/index.js';

const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);
  initializeSocket(server);
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
