/**
 * Client Player
 */
class Player {
    /**
     *
     */
    constructor(scene, data) {
        this.scene = scene;

        this.id = data.id;
        this.characterNum = data.characterNum
        this.character = data.character;
        this.health = data.health;

        this.hud = {
            background: null,
            char: null,
            heartHealth: null
        }

        this.sprite = this.scene.physics.add.sprite(data.x, data.y, data.character);
        this.sprite.flipX = data.flipX;
        this.sprite.anims.play(data.animation, data.looping);

        this.projectileCooldown = 0;

    }

    /**
     *
     */
    update() {
        this.move();

        // max Velocity (zodat we te snel gaan en door de grond)
        var standing = this.sprite.body.blocked.down || this.sprite.body.touching.down;
        if (!standing && this.sprite.body.velocity.y > 800) {
            this.sprite.setVelocityY(600)
        }

        // Shooting
        this.projectileCooldown--;

        if (cursors.space.isDown) {
            this.shoot();
        }

        // // pas health aan als je geraakt wordt
        // if(this.health != this.hud.healthText && this.hud.healthText ){
        //     this.hud.healthText.setText(this.health);
        //     this.hud.heartHealth.play(`heartHealth${this.health}`, true);
        // }
    }

    /**
     *
     */
    move() {
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-300);
            this.sprite.anims.play(`${this.character}_walk`, true);
            this.sprite.flipX = true;
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(300);
            this.sprite.anims.play(`${this.character}_walk`, true);
            this.sprite.flipX = false;
        } else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play(`${this.character}_turn`);
        }

        if (
            cursors.up.isDown &&
            this.sprite.body.blocked.down
        ) {
            this.sprite.setVelocityY(-1000);
        } else if (
            cursors.down.isDown &&
            this.sprite.body.blocked.down &&
            cursors.right.isUp &&
            cursors.left.isUp
        ) {
            this.sprite.anims.play(`${this.character}_duck`);
        }

        if (!this.sprite.body.blocked.down) {
            this.sprite.anims.play(`${this.character}_jump`);
        }

        socket.emit('move', {
            x: this.sprite.x,
            y: this.sprite.y,
            animation: this.sprite.anims.currentAnim.key,
            looping: this.sprite.anims.currentAnim.repeat,
            flipX: this.sprite.flipX,
        });
    }

    /**
     *
     */
    shoot() {
        if (this.projectileCooldown > 0) {
            return;
        }

        this.projectileCooldown = 30;

        const direction = this.sprite.flipX ? -1 : 1;

        const projectile = projectileGroup
            .create(
                this.sprite.x + 20 * direction,
                this.sprite.y,
                'fireball'
            )
            .setBounce(1);

        projectile.id = new Date().getTime(); // TODO: User a better ID.
        projectile.damage = 1;
        projectile.flipX = this.sprite.flipX;
        projectile.body.velocity.x = 500 * direction;
        projectile.body.width = 20;
        projectile.body.height = 20;
        projectile.body.setOffset(25, 25);

        this.scene.physics.add.collider(projectile, [level.laag_platform, level.laag_objecten]);

        projectiles[projectile.id] = projectile;

        socket.emit('shoot', {
            id: projectile.id,
            damage: projectile.damage,
            flipX: projectile.flipX,
            x: projectile.x,
            y: projectile.y,
            body: {
                velocity: {
                    x: projectile.body.velocity.x,
                    y: projectile.body.velocity.y,
                },
            },
        });
    }

    /**
     * @todo Sould the server determine whether the player died instead?
     */
    hitBy(projectile) {
        projectile.disableBody(true, true);
        delete projectiles[projectile.id];

        socket.emit('projectileDestroyed', projectile.id);

        this.health -= projectile.damage;

        if (this.health > 0) {
            socket.emit('hit', projectile.damage);
            this.hud.heartHealth.play(`heartHealth${this.health}`, true);
        } else {
            this.die();

        }
    }

    createHud() {
        console.log(this.scene)
        // HUD Achtergrond
        this.hud.background = this.scene.add.image(this.sprite.x, this.sprite.y, 'hudAchtergrond');
        this.hud.background.setScrollFactor(0);
        // HUD CHAR
        this.hud.char = this.scene.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 100, `hudPlayer${this.characterNum}`);
        player.hud.char.setScale(1.6)
        // HUD HEALTH HEART
        this.hud.heartHealth = this.scene.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'heartHealth');
        this.hud.heartHealth.anims.play(`heartHealth10`);
        player.hud.heartHealth.setScale(0.8)
    }

    /**
     *
     */
    die() {
        this.sprite.disableBody(true, true);
        player = undefined;

        socket.emit('died');
    }
}
