package uk.co.zutty.metronome
{
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.Sfx;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.utils.Input;
    import net.flashpunk.utils.Key;
    
    public class Arm extends Entity {
        
        [Embed(source = 'assets/metronome_arm.png')]
        private static const ARM_IMAGE:Class;
        
        [Embed(source = 'assets/tick.mp3')]
        private const TICK_SOUND:Class;
        [Embed(source = 'assets/tock.mp3')]
        private const TOCK_SOUND:Class;

        private var _gfx:Image;
        private var _time:Number;
        private var _period:Number;
        private var _tick:Boolean = true;
        private var _tickSfx:Sfx;
        private var _tockSfx:Sfx;
        private var _wasNegative:Boolean = false;

        public function Arm() {
            super();
            
            _gfx = new Image(ARM_IMAGE);
            _gfx.originX = 33;
            _gfx.originY = 340;
            _gfx.smooth = true;
            graphic = _gfx;
            
            _tickSfx = new Sfx(TICK_SOUND);
            _tockSfx = new Sfx(TOCK_SOUND);
            
            _time = 0;
            bpm = 120;
            
            _gfx.angle = 15;
        }
        
        public function set bpm(b:Number):void {
            _period = 60/b;
        }
        
        override public function update():void {
            super.update();
            
            _time += FP.elapsed;
            
            _gfx.angle = Math.sin((_time / _period) * Math.PI) * 30;

            var isNegative:Boolean = _gfx.angle < 0;
            
            if(isNegative != _wasNegative) {
                _tick = !_tick;
                ((_tick) ? _tickSfx : _tockSfx).play();
                _wasNegative = isNegative;
            }
        }
    }
}