package uk.co.zutty.metronome
{
	import flash.filters.GlowFilter;
	
	import net.flashpunk.FP;
	import net.flashpunk.World;
	import net.flashpunk.graphics.Image;
	import net.flashpunk.graphics.Text;
	import net.flashpunk.utils.Input;
	import net.flashpunk.utils.Key;
	
	public class TitleWorld extends World {

		[Embed(source = 'assets/title_background.png')]
		public static const BG_IMAGE:Class;
		[Embed(source = 'assets/title_body.png')]
		private static const BODY_IMAGE:Class;
		[Embed(source = 'assets/title_smallarm.png')]
		private static const SMALLARM_IMAGE:Class;
		[Embed(source = 'assets/title_bigarm.png')]
		private static const BIGARM_IMAGE:Class;
		[Embed(source = 'assets/title_logo.png')]
		private static const LOGO_IMAGE:Class;
		
		private var _smallArm:Image;
		private var _bigArm:Image;
		private var _smallTimer:Timer;
		private var _bigTimer:Timer;
		private var _startText:Text

		override public function begin():void {
			_smallTimer = new Timer();
			_smallTimer.bpm = 60;
			_bigTimer = new Timer();
			_bigTimer.bpm = 30;
			
			addGraphic(new Image(BG_IMAGE));

			_bigArm = new Image(BIGARM_IMAGE);
			_bigArm.x = 680;
			_bigArm.y = 1100;
			_bigArm.originX = 129;
			_bigArm.originY = 1300;
			_bigArm.smooth = true;
			addGraphic(_bigArm);

			addGraphic(new Image(BODY_IMAGE));
			
			_smallArm = new Image(SMALLARM_IMAGE);
			_smallArm.x = 480;
			_smallArm.y = 268;
			_smallArm.originX = 11;
			_smallArm.originY = 150;
			_smallArm.smooth = true;
			addGraphic(_smallArm);

			addGraphic(new Image(LOGO_IMAGE));
			
			_startText = new Text("Press ANY key to start");
			_startText.color = 0xeeeeee;
			_startText.align = "center";
			_startText.size = 48;
			_startText.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
			_startText.width = 640;
			_startText.x = 0;
			_startText.y = 380;
			addGraphic(_startText);
		}
		
		override public function update():void {
			super.update();
			_smallTimer.nextFrame();
			_bigTimer.nextFrame();
			
			_smallArm.angle = Math.sin(_smallTimer.beats * Math.PI) * 40;
			_bigArm.angle = Math.sin(_bigTimer.beats * Math.PI) * 50;
			
			if(Input.pressed(Key.ANY)) {
				(FP.engine as Main).showMenu();
			}
		}
	}
}