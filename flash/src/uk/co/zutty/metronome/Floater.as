package uk.co.zutty.metronome
{
    import flash.filters.GlowFilter;
    
    import net.flashpunk.Entity;
    import net.flashpunk.FP;
    import net.flashpunk.Graphic;
    import net.flashpunk.Mask;
    import net.flashpunk.graphics.Text;
    
    public class Floater extends Entity {
        
        private var _txt:Text;
        private var _floatAngle:Number;
        
        public function Floater() {
            super();
            
            _txt = new Text("");
            _txt.size = 72;
            _txt.field.filters = [new GlowFilter(0x000000, 1, 6, 6)];
            _txt.centerOrigin();
            graphic = _txt;
        }
        
        override public function added():void {
            _txt.alpha = 1;
            _floatAngle = FP.rand(Math.PI * 2);
        }
        
        public function set text(txt:String):void {
            _txt.text = txt;
            _txt.centerOrigin();
        }
        
        public function set colour(col:uint):void {
            _txt.color = col;
        }
        
        override public function update():void {
            super.update();
            
            _txt.alpha -= 0.05;
            x += Math.sin(_floatAngle) * 3;
            y += Math.cos(_floatAngle) * 3;
            
            if(_txt.alpha <= 0) {
                world.recycle(this);
            }
        }
    }
}