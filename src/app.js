// deps
const express = require('express');

// application instance
const app = express();
const PORT = 29000;
const HOST = '0.0.0.0';

// routes
// app.use('/', (req, res) => {
//     res.send('Hello World!');
// });
app.use('/hc', (req, res) => {
    res.send('Healthy ✅');
});
app.use('/app', (req, res) => {
    res.send('Ignite Express Application 🚀');
});

app.listen(PORT, HOST, () => {
    console.log(`ooOOoo 🟢 Server is listening on PORT ${PORT} ooOOoo`);
});
