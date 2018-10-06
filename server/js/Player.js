/**
 *
 */
class Player {
    /**
     * @param {Socket} socket
     */
    constructor(socket) {
        console.log('User connected.');

        this.socket = socket;

        this.bindEventHandlers();
    }

    /**
     *
     */
    bindEventHandlers() {
        this.socket.on('disconnect', this.onDisconnect.bind(this));
    }

    /**
     *
     */
    onDisconnect() {
        console.log('User disconnected.');
    }

    /**
     * @returns {Object}
     */
    data() {
        return {
            id: this.id,
        };
    }
}

module.exports = Player;
