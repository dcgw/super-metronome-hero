package uk.co.zutty.metronome
{
    import net.flashpunk.FP;
    import net.flashpunk.World;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Text;
    import net.flashpunk.utils.Input;
    import net.flashpunk.utils.Key;
    
    public class GameWorld extends World {
        
        [Embed(source = 'assets/metronome_background.png')]
        private static const BG_IMAGE:Class;
        [Embed(source = 'assets/overlay.png')]
        private static const OVERLAY_IMAGE:Class;
        [Embed(source = 'assets/vignette.png')]
        private static const VIGNETTE_IMAGE:Class;
        
        private var _arm:Arm;
        private var _msg:Text;
        private var _scoreText:Text;

        private var _score:Number;
        private var _frame:uint;
        private var _period:uint;
        
        override public function begin():void {
            _score = 0;
            _frame = 0;
            bpm = 120;
            
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
            
            _scoreText = new Text("0000000");
            _scoreText.size = 48;
            _scoreText.align = "right";
            _scoreText.width = 300;
            _scoreText.x = 320;
            _scoreText.y = 10;
            addGraphic(_scoreText);

            addGraphic(new Image(OVERLAY_IMAGE));
            addGraphic(new Image(VIGNETTE_IMAGE));
        }
        
        public function set bpm(b:Number):void {
            _period = 3600/b;
        }
        
        public function score(points:Number):void {
            _score += points;
            _scoreText.text = zeroPad(_score, 7);
        }
        
        public static function zeroPad(n:Number, len:int):String {
            var str:String = String(n);
            
            for(var i:int = str.length; i < len; i++) {
                str = "0" + str;
            }
            
            return str;
        }
        
        public function set msg(str:String):void {
            _msg.text = str;
        }

        override public function update():void {
            super.update();
            
            _frame++;
            
            _arm.time = _frame / _period;
            
            var diff:Number = Math.abs(_period/2 - ((_frame + _period/2) % _period));
            msg = ""+diff;
            
            if(Input.pressed(Key.ANY)) {
                var missed:Boolean = diff > 3;
                if(missed) {
                    _arm.miss();
                } else {
                    _arm.ticktock();
                }
                
                var factor:Number = Math.max(0, 4 - diff);
                score(factor * 100);
            }
        }
    }
}