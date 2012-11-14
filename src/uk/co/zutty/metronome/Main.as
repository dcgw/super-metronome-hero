package uk.co.zutty.metronome
{
    import net.flashpunk.Engine;
    import net.flashpunk.FP;
    import net.flashpunk.graphics.Text;
    
    public class Main extends Engine {

        [Embed(source = 'assets/Strait-Regular.ttf', embedAsCFF="false", fontFamily = 'strait')]
        private static const STRAIT_FONT:Class;
		
		private var _menuWorld:MenuWorld;
		private var _gameWorld:GameWorld;

        public function Main() {
            super(640, 480, 60, true);
            
            Text.font = "strait";
            //FP.console.enable();
            //FP.console.debug = true;
			
			_menuWorld = new MenuWorld();
			_gameWorld = new GameWorld();

			FP.world = new TitleWorld();
		}
		
		public function returnResult(stars:int):void {
			
		} 
		
		public function showMenu():void {
			FP.world = _menuWorld;
		}
		
		public function playGame(tempo:String, bpm:Number):void {
			_gameWorld.tempo = tempo;
			_gameWorld.bpm = bpm;
			
			FP.world = _gameWorld;
		}
    }
}