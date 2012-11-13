package uk.co.zutty.metronome
{
    public class Timer {
        
        private var _frame:uint;
        private var _period:uint;

        public function Timer() {
            _frame = 0;
            _period = 0;
        }
        
        public function get bpm():Number {
            return 3600/_period;
        }

        public function set bpm(b:Number):void {
            _period = 3600/b;
        }
        
        public function get beats():Number {
            return _frame / _period;
        }
        
        public function get diffFrames():int {
            return Math.abs(_period/2 - ((_frame + _period/2) % _period));
        }
        
        public function nextFrame():void {
            _frame++;
        }
    }
}