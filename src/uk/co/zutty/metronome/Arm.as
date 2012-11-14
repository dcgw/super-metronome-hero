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
            
            _shake = false;
        }
        
        public function miss():void {
            _shake = true;
            _missSfx.play();
        }
        
        public function ticktock():void {
            _tick = !_tick;
            ((_tick) ? _tickSfx : _tockSfx).play();
        }
        
        public function set time(t:Number):void {
            _gfx.angle = Math.sin(t * Math.PI) * 30;
        }

        override public function update():void {
            super.update();
            
            _gfx.scaleX = _shake ? 0.9 : 1.0;
            _gfx.scaleY = _shake ? 1.02 : 1.0;
            
            if(_shake) {
                _shake = false;
            }
        }
    }
}