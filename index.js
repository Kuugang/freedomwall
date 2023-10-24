const express = require('express')
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const helmet = require('helmet')
const port = process.env.PORT || 5000
const app = express();

var corsOptions = {
  origin: 'https://freedomwall-frontend.vercel.app',
  optionsSuccessStatus: 200 
}
connectDB()

app.use(helmet())

app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '3mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/messageRoutes'));


const server = app.listen(port, function() {
  console.log(`Server started on port ${port}`)
})

// io = require("socket.io")(server, {
//   pingTimeout: 600000,
//   cors: {
//     origin: ["http://localhost:3000", "https://screentime-frontend.vercel.app"],
//     // credentials: true,
//   },
// });
// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });
