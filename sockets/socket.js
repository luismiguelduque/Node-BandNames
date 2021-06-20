const Bands = require("../models/bands");
const Band = require("../models/band");
const { io } = require('../index');

const bands = new Bands();

bands.addBand(new Band("Queen"));
bands.addBand(new Band("Marron Five"));
bands.addBand(new Band("Coldplay"));
bands.addBand(new Band("Guns and Roses"));

//Sockets messages
io.on('connection', client => {
    client.emit("active-bands", bands.getBands());

    console.log("Cliente conectado");
    client.on('disconnect', () => {
        console.log("Cliente desconectado");
    });
    client.on('message', (payload) => {
        console.log("Mensaje!!");
        console.log(payload);
        io.emit('message', { name: "john doe" });
    });
    client.on('emit-message', (payload) => {
        console.log("emit-message")
       io.emit('new-message', "Hey!!!!");
    });
    client.on("message-flutter", (payload) => {
        console.log(payload)
        client.broadcast.emit("message-flutter", payload);
    });
    client.on("vote-band", (payload) => {
        bands.voteBand(payload.id);
        io.emit("active-bands", bands.getBands());
    });
    client.on("add-band", (payload) => {
        const band = new Band(payload.name)
        bands.addBand(band);
        io.emit("active-bands", bands.getBands());
    });
    client.on("delete-band", (payload) => {
        bands.deleteBand(payload.id);
        io.emit("active-bands", bands.getBands());
    });
});