const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const getHostname = require('./routes/getHostname');
//LAB-FAAS: descomentar para habilitar metodo en el API
//const faas = require('./routes/faas');

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);
app.get('/hostname', getHostname);
//LAB-FAAS: descomentar para habilitar metodo en el API
//app.get('/faas/:number', faas);

const PORT = process.env.APP_PORT?process.env.APP_PORT:3000


db.init().then(() => {
    app.listen(PORT, () => console.log('Listening on port '+PORT));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
