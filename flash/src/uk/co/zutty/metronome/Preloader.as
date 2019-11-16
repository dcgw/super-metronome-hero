package uk.co.zutty.metronome
{
	import flash.display.*;
	import flash.text.*;
	import flash.events.*;
	import flash.utils.getDefinitionByName;
	
	[SWF(width = "640", height = "480")]
	public class Preloader extends Sprite {

		private static const MAIN_CLASS_NAME:String = "uk.co.zutty.metronome.Main";
		private static const BG_COLOR:uint = 0x000000;
		private static const FG_COLOR:uint = 0xFFFFFF;
		
		private var progressBar: Shape;
		private var px:int;
		private var py:int;
		private var w:int;
		private var h:int;
		private var sw:int;
		private var sh:int;
		
		public function Preloader() {
			sw = stage.stageWidth;
			sh = stage.stageHeight;
			
			w = stage.stageWidth * 0.8;
			h = 20;
			
			px = (sw - w) * 0.5;
			py = (sh - h) * 0.5;
			
			graphics.beginFill(BG_COLOR);
			graphics.drawRect(0, 0, sw, sh);
			graphics.endFill();
			
			graphics.beginFill(FG_COLOR);
			graphics.drawRect(px - 2, py - 2, w + 4, h + 4);
			graphics.endFill();
			
			progressBar = new Shape();
			addChild(progressBar);
			
			stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
		}
		
		public function onEnterFrame(e:Event):void {
			if (hasLoaded()) {
				graphics.clear();
				graphics.beginFill(BG_COLOR);
				graphics.drawRect(0, 0, sw, sh);
				graphics.endFill();
				
				startup();
			} else {
				var p:Number = (loaderInfo.bytesLoaded / loaderInfo.bytesTotal);
				
				progressBar.graphics.clear();
				progressBar.graphics.beginFill(BG_COLOR);
				progressBar.graphics.drawRect(px, py, p * w, h);
				progressBar.graphics.endFill();
			}
		}
		
		private function onMouseDown(e:MouseEvent):void {
			if (hasLoaded()) {
				stage.removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
				startup();
			}
		}
		
		private function hasLoaded():Boolean {
			return (loaderInfo.bytesLoaded >= loaderInfo.bytesTotal);
		}
		
		private function startup():void {
			stage.removeEventListener(Event.ENTER_FRAME, onEnterFrame);
			
			var mainClass:Class = getDefinitionByName(MAIN_CLASS_NAME) as Class;
			parent.addChild(new mainClass as DisplayObject);
			
			parent.removeChild(this);
		}
	}
}