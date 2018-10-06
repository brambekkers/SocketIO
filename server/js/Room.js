const Player = require('./Player');

/**
 *
 */
class Room {
    /**
     *
     */
    constructor(io) {
        this.io = io;
        this.players = [];

        this.bindEventHandlers();
    }

    /**
     *
     */
    bindEventHandlers() {
        this.io.on('connection', this.onConnect.bind(this));
    }

    /**
     *
     */
    onConnect(socket) {
        console.log('Player connected.');

        // Create a new player.
        const player = new Player(socket, this);

        // Add player to list.
        this.addPlayer(player);
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        // Tell the player to start the game.
        player.socket.emit('gameStarted', {
            self: player.toData(),
            others: this.players.map(function (player) {
                return player.toData();
            }),
        });

        // Add the player.
        this.players.push(player);

<<<<<<< HEAD
        player.socket.emit('playerJoined', player.toData());
=======
        // Tell everyone that the player has joined.
        player.socket.broadcast.emit('playerJoined', player.toData());
>>>>>>> 85ea1a0c377d8d04934b8e610fdb16a7446415bc
    }

    /**
     * @param {Player} player
     */
    removePlayer(player) {
        // Tell everyone that the player has left.
        player.socket.broadcast.emit('playerLeft', this.id);

        // Filter out the player.
        this.players = this.players.filter(function (other) {
            return other.id !== player.id;
        });
    }
}

module.exports = Room;
