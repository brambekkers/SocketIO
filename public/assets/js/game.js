var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
};

let game = new Phaser.Game(config);
let players = []


function preload (){
    this.load.image('player', 'assets/img/Player/p1_front.png');
}

function create (){

    ////////////////////////////////////////////
    //////////// Server handeling //////////////
    ////////////////////////////////////////////
    const socket = io();

    // Game start
    socket.on('gameStarted', (allPlayers)=>{
        console.log("Alle Players toegevoegd");
        console.log(allPlayers);

        // Push zelf
        players.push( new Player(this, allPlayers.self) )

        // Push alle anderen
        for (const player of allPlayers.others) {
            players.push( new Player(this, player) )
        }
    });

    // Er komst een player bij
    socket.on('playerJoined', (player)=>{
        console.log("Player joined the game")
        // Maak nieuwe player
        let nieuwePlayer = new Player(this, player)
        players.push( nieuwePlayer )
    });

    // Player verlaat het spel
    socket.on('playerLeft', (id)=>{
        console.log("Player verlaat het spel")
        players = players.filter((player)=>{

            if(player.id === id){
                this.destroy(player.scenecircle);
            }

            return player.id != id;
        })
    });


}

function update (){

}
