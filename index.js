const connectToMongo = require('./db');
const express = require('express');
const authRouter = require('./routes/auth');

connectToMongo();
const app = express();
const port = 3000;

app.use(express.json())

// available routes
app.use('/api/auth',authRouter);
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
