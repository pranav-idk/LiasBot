const express = require('express');
const app = express();
const port = 6000;

exports.init = () => {
    app.get('/', (_, res) => res.send('Hello World!'));
    app.listen(port, () => console.log(`Bot WebServer is listening at http://localhost:${port}!`));
};