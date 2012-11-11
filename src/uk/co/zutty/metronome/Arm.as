package uk.co.zutty.metronome
{
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.Sfx;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Text;
    import net.flashpunk.utils.Input;
    import net.flashpunk.utils.Key;
    
    public class Arm extends Entity {
        
        [Embed(source = 'assets/metronome_arm.png')]
        private static const ARM_IMAGE:Class;
        
        [Embed(source = 'assets/tick.mp3')]
        private const TICK_SOUND:Class;
        [Embed(source = 'assets/tock.mp3')]
        private const TOCK_SOUND:Class;
        [Embed(source = 'assets/miss.mp3')]
        private const MISS_SOUND:Class;

        private var _gfx:Image;
        private var _frame:uint;
        private var _period:uint;
        private var _tick:Boolean = true;
        private var _tickSfx:Sfx;
        private var _tockSfx:Sfx;
        private var _missSfx:Sfx;
        private var _shake:Boolean;
        
        public function Arm() {
            super();
            
            _gfx = new Image(ARM_IMAGE);
            _gfx.originX = 33;
            _gfx.originY = 340;
            _gfx.smooth = true;
            graphic = _gfx;
            
            _tickSfx = new Sfx(TICK_SOUND);
            _tockSfx = new Sfx(TOCK_SOUND);
            _missSfx = new Sfx(MISS_SOUND);
            
            _frame = 0;
            _shake = false;
            bpm = 120;
            
            _gfx.angle = 15;
        }
        
        public function set bpm(b:Number):void {
            _period = 3600/b;
        }
        
        public function ticktock(missed:Boolean):void {
            _tick = !_tick;
            (missed ? _missSfx : ((_tick) ? _tickSfx : _tockSfx)).play();
        }

        override public function update():void {
            super.update();
            
            _frame++;
            
            _gfx.angle = Math.sin((_frame / _period) * Math.PI) * 30;

            var diff:Number = Math.abs(_period/2 - ((_frame + _period/2) % _period));
            (world as GameWorld).msg = ""+diff;

            _shake = false;
            
            if(Input.pressed(Key.ANY)) {
                var missed:Boolean = diff > 3;
                if(missed) {
                    _shake = true;
                }
                
                ticktock(missed);
            }
            
            _gfx.scaleX = _shake ? 0.9 : 1.0;
            _gfx.scaleY = _shake ? 1.02 : 1.0;
        }
    }
}