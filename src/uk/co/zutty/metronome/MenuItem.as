package uk.co.zutty.metronome
{
	import flash.filters.GlowFilter;
	import flash.text.TextFormat;
	
	import net.flashpunk.Entity;
	import net.flashpunk.Graphic;
	import net.flashpunk.Mask;
	import net.flashpunk.graphics.Spritemap;
	import net.flashpunk.graphics.Text;
	
	public class MenuItem extends Entity {

		[Embed(source = 'assets/menu_item.png')]
		private static const ITEM_IMAGE:Class;
		[Embed(source = 'assets/item_ratings.png')]
		private static const RATING_IMAGE:Class;
		
		private var _tempo:String;
		private var _bpm:int;
		private var _body:Spritemap;
		private var _rating:Spritemap;
		private var _text:Text;
		private var _subText:Text;
		private var _selected:Boolean;
		private var _locked:Boolean;
		private var _textSize:Number;

		public function MenuItem() {
			super();
			
			_selected = false;
			_locked = true;
			
			_body = new Spritemap(ITEM_IMAGE, 500, 100);
			_body.add("locked", [0]);
			_body.add("unlocked", [1]);
			_body.add("locked_glow", [2]);
			_body.add("unlocked_glow", [3]);
			addGraphic(_body);

			_rating = new Spritemap(RATING_IMAGE, 70, 70);
			_rating.x = 15;
			_rating.y = 15;
			_rating.add("locked", [0]);
			_rating.add("0", [1]);
			_rating.add("1", [2]);
			_rating.add("2", [3]);
			_rating.add("3", [4]);
			addGraphic(_rating);
			
			Text.defaultLeading = -10;
			_text = new Text("");
			_text.color = 0x999999;
			_text.size = 60;
			_text.x = 100;
			_text.y = 15;
			_text.width = 400;
			_text.height = 100;
			_text.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
			_text.text = "Locked";
			addGraphic(_text);

			Text.defaultLeading = 0;
			_subText = new Text("");
			_subText.size = 22;
			_subText.x = 100;
			_subText.y = 60;
			_subText.field.filters = [new GlowFilter(0x000000, 1, 3, 3)];
			addGraphic(_subText);
		}
		
		public function get tempo():String {
			return _tempo;
		}
		
		public function set tempo(t:String):void {
			_tempo = t;
		}
		
		public function get bpm():int {
			return _bpm;
		}
		
		public function set bpm(b:int):void {
			_bpm = b;
		}
		
		public function set textSize(s:Number):void {
			_textSize = s;
		}

		public function get selected():Boolean {
			return _selected;
		}

		public function set selected(sel:Boolean):void {
			_selected = sel;
			_body.play((_locked ? "locked" : "unlocked") + (sel ? "_glow" : ""));
		}
		
		public function unlock():void {
			_rating.play("0");
			_text.color = 0xffffff;
			_text.size = _textSize;
			_text.y = 5;
			_locked = false;
			_text.text = _tempo;
			_subText.text = String(_bpm) + "bpm";
		}
	}
}