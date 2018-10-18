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

        socket.on('start', function () {
            this.onStart(socket);
        }.bind(this));
    }

    /**
     *
     */
    onStart(socket) {
        console.log('Player started.');

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
            player: player.toData(),
            enemies: this.players.map(function (player) {
                return player.toData();
            }),
        });

        // Add the player.
        this.players.push(player);

        // Tell everyone that the player has joined.
        player.socket.broadcast.emit('enemyJoined', player.toData());
    }

    /**
     * @param {Player} player
     */
    removePlayer(player) {
        // Tell everyone that the player has left.
        player.socket.broadcast.emit('enemyLeft', player.socket.id);

        // Filter out the player.
        this.players = this.players.filter(function (other) {
            return other.socket.id !== player.socket.id;
        });
    }
}

module.exports = Room;