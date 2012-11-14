package uk.co.zutty.metronome
{
	import net.flashpunk.FP;
	import net.flashpunk.Sfx;
	import net.flashpunk.World;
	import net.flashpunk.graphics.Image;
	import net.flashpunk.tweens.misc.VarTween;
	import net.flashpunk.tweens.sound.SfxFader;
	import net.flashpunk.utils.Ease;
	import net.flashpunk.utils.Input;
	import net.flashpunk.utils.Key;
	
	public class MenuWorld extends World {
		
		[Embed(source = 'assets/sounds/blip.mp3')]
		private const BLIP_SOUND:Class;
		[Embed(source = 'assets/sounds/select.mp3')]
		private const SELECT_SOUND:Class;

		private var _items:Vector.<MenuItem>;
		private var _selectedIndex:int;
		private var _scrollTween:VarTween;
		private var _blipSfx:Sfx;
		private var _selectSfx:Sfx;
		private var _musicFader:SfxFader;
		
		public function MenuWorld() {
			_blipSfx = new Sfx(BLIP_SOUND);
			_selectSfx = new Sfx(SELECT_SOUND);
			
			_musicFader = new SfxFader((FP.engine as Main).music);
			addTween(_musicFader);
			
			_scrollTween = new VarTween();
			addTween(_scrollTween);
			
			var bg:Image = new Image(TitleWorld.BG_IMAGE);
			bg.scrollX = 0;
			bg.scrollY = 0;
			addGraphic(bg);
			
			_items = new Vector.<MenuItem>();
			addItem("Grave", 40);
			addItem("Adagio", 60);
			addItem("Moderato", 88);
			addItem("Allegro", 120);
			addItem("Presto", 168);
			addItem("Prestissimo", 208);
			addItem("Hyper-Prestississississimo\nExtreme to the Max!", 350, 32);
			_items[0].unlock();
			
			_selectedIndex = 0;
			selectedItem.selected = true;
		}

		override public function begin():void {
			_musicFader.fadeTo(1, 30);
		}
		
		public function get selectedIndex():int {
			return _selectedIndex;
		}
		
		public function set selectedIndex(idx:int):void {
			selectedItem.selected = false;
			_selectedIndex = FP.clamp(idx, 0, _items.length - 1);
			selectedItem.selected = true;
		}

		public function get selectedItem():MenuItem {
			return _items[_selectedIndex];
		}

		private function addItem(tempo:String, bpm:int, size:Number = 60):void {
			var item:MenuItem = new MenuItem();
			item.tempo = tempo;
			item.bpm = bpm;
			item.textSize = size;
			item.x = 70;
			item.y = 60 + _items.length * 120;
			add(item);
			_items[_items.length] = item;
		}
		
		override public function update():void {
			super.update();
			
			if(Input.pressed(Key.UP)) {
				_blipSfx.play();
				selectedIndex--;

				if(selectedItem.y < FP.camera.y) {
					_scrollTween.tween(FP.camera, "y", selectedItem.y - 60, 20, Ease.cubeOut);
				}
			} else if(Input.pressed(Key.DOWN)) {
				_blipSfx.play();
				selectedIndex++;
				
				if(selectedItem.y + 100 > FP.screen.height + FP.camera.y) {
					_scrollTween.tween(FP.camera, "y", selectedItem.y + 150 - FP.screen.height, 20, Ease.cubeOut);
				}
			} else if(Input.pressed(Key.ENTER)) {
				_selectSfx.play();
				(FP.engine as Main).playGame(selectedItem.tempo, selectedItem.bpm);
			}
		}
	}
}