/**
 *
 */
class LevelTwo extends Level {
    /**
     *
     */
    preload() {
        super.preload();

        this.load.image('background', 'assets/img/background.png');

        this.load.tilemapCSV('platforms', 'assets/maps/lvl2/KillingFields_Platform.csv');
        this.load.tilemapCSV('objects', 'assets/maps/lvl2/KillingFields_Objecten.csv');
        this.load.tilemapCSV('decoration', 'assets/maps/lvl2/KillingFields_Decoratie.csv');
    }
}
