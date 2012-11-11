package uk.co.zutty.metronome
{
    import net.flashpunk.World;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Text;
    
    public class GameWorld extends World {
        
        [Embed(source = 'assets/metronome_background.png')]
        private static const BG_IMAGE:Class;
        [Embed(source = 'assets/overlay.png')]
        private static const OVERLAY_IMAGE:Class;
        [Embed(source = 'assets/vignette.png')]
        private static const VIGNETTE_IMAGE:Class;
        
        private var _arm:Arm;
        private var _msg:Text;
        
        public function GameWorld() {
            addGraphic(new Image(BG_IMAGE));
            
            _arm = new Arm();
            _arm.x = 320;
            _arm.y = 420;
            add(_arm);
            
            _msg = new Text("099");
            _msg.size = 72;
            _msg.x = 100;
            _msg.y = 50;
            addGraphic(_msg);

            addGraphic(new Image(OVERLAY_IMAGE));
            addGraphic(new Image(VIGNETTE_IMAGE));
        }
        
        public function set msg(str:String):void {
            _msg.text = str;
        }
    }
}