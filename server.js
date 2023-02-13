require('dotenv').config();

const mongoose = require('mongoose');
const {Server} = require('socket.io');
const {createServer} = require('http'); 

const port = parseInt(process.env.PORT, 10) || 8082;
const isDev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/lakar';

const corsOrigin = isDev ? 'http://localhost:8081' : 'https://lakar-video.vercel.app';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

const handleConnection = require('./lib/handleConnection');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin
  }
});

io.on('connection', handleConnection);

async function init() {
  await mongoose.connect(MONGO_URL, mongooseOptions);

  httpServer
    .listen(port, () => console.log(`> Ready on http://localhost:${port}`));
}

init();
