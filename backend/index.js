const chalk = require('chalk');
const { networkInterfaces } = require('os');
const app = require('express')();
const http = require('http').createServer(app);
var io = require('socket.io')(http);

// Quickly log with a timestamp
const log = (msg) => { console.log(chalk.blue(`${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`) + " " + msg); }

// first client to connect waits for the second 
let clientCount = 0;

// Peer waiting for the next peer to connect {id, offer}
let waitingPeer;

// Peer pairs (peers.from = to)
let peers = {};

// Sockets
io.on('connect', (socket) => {
    log(`A client ${chalk.green("connected")} [${++clientCount}] ` + chalk.gray(socket.id));

    socket.on('disconnect', () => {
        log(`A client ${chalk.red("disconnected")} [${--clientCount}] ` + chalk.gray(socket.id));
        if (waitingPeer && socket.id == waitingPeer.id) waitingPeer = null;
        peers = {};
    })

    socket.on('ice-candidate', (candidate) => {
        log("Received ICE candidate...");
        socket.to(peers[socket.id]).emit('ice-candidate', candidate);
    })

    // Connect two peers
    if (!waitingPeer) {
        // There is no waiting peer
        log("No waiting peer, requesting offer...");
        // Ask connected client to create an offer
        socket.emit('request-offer', {}, (data) => {
            log("Received offer! Waiting for peer...");
            // Put the offer in waitingPeer
            waitingPeer = {
                id: socket.id,
                description: data
            };
        })
    } else {
        // There is a waiting peer 
        log("Waiting peer, requesting answer...");
        // Request answer from new client (Send the connected client offer) 
        socket.emit('request-answer', waitingPeer, (data) => {
            log("Received answer!");

            // Send answer to waitingPeer
            socket.to(waitingPeer.id).emit('receive-answer', data);

            // Update peer pairs
            peers[`${socket.id}`] = waitingPeer.id; 
            peers[waitingPeer.id] = socket.id;
        })
    }
});

// Start server
http.listen(3000, () => {
    const ip = (networkInterfaces()['Ethernet'].filter(ni => ni.family == 'IPv4')[0]['address']);
    log(chalk.bold("Server started on " + chalk.magentaBright(`${ip}:3000`)));
})