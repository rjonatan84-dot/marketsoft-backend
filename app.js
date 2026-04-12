const express = require('express');
const DatabaseSync = require('./src/config/sync');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running successfully');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

async function startServer() {
  try {
    await DatabaseSync.sync();
  } catch (error) {
    console.error('Error start the server:', error);
  }
}

startServer();