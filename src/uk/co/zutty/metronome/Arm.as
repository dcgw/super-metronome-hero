package uk.co.zutty.metronome
{
    import net.flashpunk.Entity;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.graphics.Image;
    
    public class Arm extends Entity {
        
        [Embed(source = 'assets/metronome_arm.png')]
        private static const ARM_IMAGE:Class;
        
        private var _gfx:Image;
        private var _frame:uint;
        private var _period:Number;

        public function Arm() {
            super();
            
            _gfx = new Image(ARM_IMAGE);
            _gfx.originX = 33;
            _gfx.originY = 340;
            _gfx.smooth = true;
            graphic = _gfx;
            
            _period = 20;
            
            //setHitbox(69, 355, 33, 330);
            
            _gfx.angle = 15;
        }
        
        override public function update():void {
            super.update();
            
            _frame++;
            
            _gfx.angle = Math.sin(_frame / _period) * 30;
        }
    }
}