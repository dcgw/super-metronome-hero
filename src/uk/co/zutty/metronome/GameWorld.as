package uk.co.zutty.metronome
{
    import net.flashpunk.World;
    import net.flashpunk.graphics.Image;
    
    public class GameWorld extends World {
        
        [Embed(source = 'assets/metronome_background.png')]
        private static const BG_IMAGE:Class;
        [Embed(source = 'assets/metronome_overlay.png')]
        private static const OVERLAY_IMAGE:Class;
        
        private var _arm:Arm;
        
        public function GameWorld() {
            addGraphic(new Image(BG_IMAGE));
            
            _arm = new Arm();
            _arm.x = 320;
            _arm.y = 420;
            add(_arm);

            addGraphic(new Image(OVERLAY_IMAGE));
        }
    }
}