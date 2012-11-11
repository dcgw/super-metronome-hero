package uk.co.zutty.metronome
{
    import net.flashpunk.Engine;
    import net.flashpunk.FP;
    
    public class Main extends Engine {
        public function Main() {
            super(640, 480, 60, true);
            
            FP.world = new GameWorld();
        }
    }
}