package uk.co.zutty.metronome
{
    import flash.filters.GlowFilter;
    
    import net.flashpunk.FP;
    import net.flashpunk.World;
    import net.flashpunk.graphics.Emitter;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Text;
    import net.flashpunk.tweens.misc.ColorTween;
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
        //private var _msg:Text;
        private var _scoreText:Text;
        private var _multiplierText:Text;
        private var _multiplierFade:ColorTween;
        private var _tempoText:Text;
        private var _bpmText:Text;

        private var _tempo:String;
        private var _score:Number;
        private var _multiplier:Number;
        private var _timer:Timer;
        private var _firstFrame:Boolean = true;
        private var _missedBeats:int;
        
        override public function begin():void {
            _score = 0;
            _multiplier = 0;
            _missedBeats = 0;
            _timer = new Timer();
            _timer.bpm = 120;
            _tempo = "Allegro";
            
            addGraphic(new Image(BG_IMAGE));
            
            _arm = new Arm();
            _arm.x = 320;
            _arm.y = 420;
            add(_arm);
            
            addGraphic(new Image(OVERLAY_IMAGE));
            addGraphic(new Image(VIGNETTE_IMAGE));

            _tempoText = new Text("");
            _tempoText.size = 36;
            _tempoText.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
            _tempoText.x = 20;
            _tempoText.y = 20;
            addGraphic(_tempoText);

            _bpmText = new Text("");
            _bpmText.size = 24;
            _bpmText.field.filters = [new GlowFilter(0x000000, 1, 3, 3)];
            _bpmText.x = 20;
            _bpmText.y = 55;
            addGraphic(_bpmText);

            _scoreText = new Text(" 000000");
            _scoreText.size = 48;
            _scoreText.align = "right";
            _scoreText.width = 300;
            _scoreText.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
            _scoreText.x = 320;
            _scoreText.y = 10;
            addGraphic(_scoreText);
            
            _multiplierText = new Text(" 000");
            _multiplierText.size = 28;
            _multiplierText.align = "right";
            _multiplierText.width = 100;
            _multiplierText.field.filters = [new GlowFilter(0x000000, 1, 3, 3)];
            _multiplierText.x = 520;
            _multiplierText.y = 55;
            addGraphic(_multiplierText);
            
            _multiplierFade = new ColorTween();
            addTween(_multiplierFade);
        }
        
        public function get score():Number {
            return _score;
        }

        public function set score(s:Number):void {
            _score = s;
            _scoreText.text = zeroPad(Math.floor(_score), 6);
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
        
        public function float(txt:String, colour:uint):void {
            var floater:Floater = create(Floater) as Floater;
            floater.text = txt;
            floater.x = 320;
            floater.y = 240;
            floater.colour = colour;
        }

        override public function update():void {
            super.update();
            _timer.nextFrame();
            
            // Dodgy hack for the glow filter
            if(_firstFrame) {
                _firstFrame = false;
                score = score;
                multiplier = multiplier;
                _tempoText.text = _tempo;
                _bpmText.text = _timer.bpm + "bpm";
            }
            
            _arm.time = _timer.beats;
            
            var diff:Number = _timer.diffFrames;
            
            _multiplierText.color = _multiplierFade.active ? _multiplierFade.color : 0xffffff;
            
            if(diff == 0) {
                _missedBeats++;
            }
            
            if(Input.pressed(Key.ANY)) {
                var missed:Boolean = diff > 3;
                if(missed) {
                    _arm.miss();
                    multiplier = 0;
                    _multiplierFade.tween(10, 0xc41b18, 0xffffff);
                } else {
                    _arm.ticktock();
                    multiplier++;
                    _missedBeats--;
                }
                
                if(diff == 0) {
                    float("Perfect!", 0xd3cd08);
                    multiplier += 4;
                    _multiplierFade.tween(10, 0xd3cd08, 0xffffff);
                } else if(diff <= 2) {
                    float("Good", 0x0bd308);
                } else if(diff >= 4 && diff <= 6) {
                    float("Miss", 0x5368b2);
                } else if(diff > 10) {
                    float("Awful!", 0xc41b18);
                } else if(diff > 8) {
                    float("Poor", 0xc41b18);
                } 
                
                if(!missed) {
                    var factor:Number = Math.max(0, 4 - diff);
                    score += factor * multiplier * 5;
                }
            }
        }
    }
}