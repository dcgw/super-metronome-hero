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
        private var _multiplierText:Text;

        private var _score:Number;
        private var _multiplier:Number;
        private var _timer:Timer;
        
        override public function begin():void {
            _score = 0;
            _multiplier = 0;
            _timer = new Timer();
            _timer.bpm = 120;
            
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
            
            _multiplierText = new Text("000");
            _multiplierText.size = 28;
            _multiplierText.align = "right";
            _multiplierText.width = 100;
            _multiplierText.x = 520;
            _multiplierText.y = 55;
            addGraphic(_multiplierText);

            addGraphic(new Image(OVERLAY_IMAGE));
            addGraphic(new Image(VIGNETTE_IMAGE));
        }
        
        public function get score():Number {
            return _score;
        }

        public function set score(s:Number):void {
            _score = s;
            _scoreText.text = zeroPad(Math.floor(_score), 7);
        }
        
        public function get multiplier():Number {
            return _multiplier;
        }
        
        public function set multiplier(m:Number):void {
            _multiplier = m;
            _multiplierText.text = zeroPad(Math.floor(_multiplier), 3);
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
            _timer.nextFrame();
            
            _arm.time = _timer.beats;
            
            var diff:Number = _timer.diffFrames;
            msg = ""+diff;
            
            if(Input.pressed(Key.ANY)) {
                var missed:Boolean = diff > 3;
                if(missed) {
                    _arm.miss();
                    multiplier = 0;
                } else {
                    _arm.ticktock();
                    multiplier++;
                }
                
                var factor:Number = Math.max(0, 4 - diff);
                score += factor * multiplier * 100;
            }
        }
    }
}