package uk.co.zutty.metronome
{
    import net.flashpunk.Engine;
    import net.flashpunk.FP;
    import net.flashpunk.graphics.Text;
    
    public class Main extends Engine {

        [Embed(source = 'assets/Strait-Regular.ttf', embedAsCFF="false", fontFamily = 'strait')]
        private static const STRAIT_FONT:Class;

        public function Main() {
            super(640, 480, 60, true);
            
            Text.font = "strait";
            
            FP.world = new TitleWorld();
            
            FP.console.enable();
            FP.console.debug = true;
        }
		
		public function playGame():void {
			FP.world = new GameWorld();
		}
    }
}