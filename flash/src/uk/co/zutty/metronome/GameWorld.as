package uk.co.zutty.metronome
{
    import flash.filters.GlowFilter;
    
    import net.flashpunk.FP;
    import net.flashpunk.Sfx;
    import net.flashpunk.World;
    import net.flashpunk.graphics.Emitter;
    import net.flashpunk.graphics.Image;
    import net.flashpunk.graphics.Text;
    import net.flashpunk.tweens.misc.ColorTween;
    import net.flashpunk.tweens.misc.MultiVarTween;
    import net.flashpunk.tweens.misc.VarTween;
    import net.flashpunk.tweens.sound.SfxFader;
    import net.flashpunk.utils.Input;
    import net.flashpunk.utils.Key;
    
    public class GameWorld extends World {
        
		[Embed(source = 'assets/sounds/ready.mp3')]
		private const READY_SOUND:Class;
		[Embed(source = 'assets/sounds/chime.mp3')]
		private const CHIME_SOUND:Class;
		[Embed(source = 'assets/sounds/boo.mp3')]
		private const BOO_SOUND:Class;
		[Embed(source = 'assets/sounds/cheer.mp3')]
		private const CHEER_SOUND:Class;
		[Embed(source = 'assets/sounds/star1.mp3')]
		private const STAR1_SOUND:Class;
		[Embed(source = 'assets/sounds/star2.mp3')]
		private const STAR2_SOUND:Class;
		[Embed(source = 'assets/sounds/star3.mp3')]
		private const STAR3_SOUND:Class;
		[Embed(source = 'assets/sounds/one.mp3')]
		private const INTRO1_SOUND:Class;
		[Embed(source = 'assets/sounds/two.mp3')]
		private const INTRO2_SOUND:Class;
		[Embed(source = 'assets/sounds/three.mp3')]
		private const INTRO3_SOUND:Class;
		[Embed(source = 'assets/sounds/four.mp3')]
		private const INTRO4_SOUND:Class;

		[Embed(source = 'assets/metronome_background.png')]
        private static const BG_IMAGE:Class;
        [Embed(source = 'assets/overlay.png')]
        private static const OVERLAY_IMAGE:Class;
        [Embed(source = 'assets/vignette.png')]
        private static const VIGNETTE_IMAGE:Class;
		[Embed(source = 'assets/big_star.png')]
		private static const STAR_IMAGE:Class;
		[Embed(source = 'assets/big_star_blank.png')]
		private static const STAR_BLANK_IMAGE:Class;
		
		private static const INTRO_TIME:int = 30;
		private static const OUTRO_TIME:int = 50;
		private static const SCORE_THRESHOLD_3STAR:Number = 6000;
		private static const SCORE_THRESHOLD_2STAR:Number = 2000;
		private static const SCORE_THRESHOLD_1STAR:Number = 1;
		private static const BASE_SCORE:Number = 7;
		private static const MAX_MISSED_BEATS:int = 4;
		
		private static const STATE_INTRO:int = 1;
		private static const STATE_COUNTIN:int = 2;
		private static const STATE_PLAY:int = 3;
		private static const STATE_OUTRO:int = 4;
		private static const STATE_RESULT:int = 5;
		private static const STATE_DONE:int = 6;
		private static const STATE_RETURN:int = 7;
        
        private var _arm:Arm;
        private var _scoreText:Text;
        private var _multiplierText:Text;
        private var _multiplierFade:ColorTween;
        private var _tempoText:Text;
        private var _bpmText:Text;
		private var _messageText:Text;
		private var _messageFade:VarTween;
		private var _star1Blank:Image;
		private var _star2Blank:Image;
		private var _star3Blank:Image;
		private var _star1:Image;
		private var _star2:Image;
		private var _star3:Image;
		private var _starTween:MultiVarTween;
		private var _instructionText:Text;
		private var _instructionFade:VarTween;
		private var _showInstructions:Boolean;

		private var _readySfx:Sfx;
		private var _chimeSfx:Sfx;
		private var _booSfx:Sfx;
		private var _cheerSfx:Sfx;
		private var _star1Sfx:Sfx;
		private var _star2Sfx:Sfx;
		private var _star3Sfx:Sfx;
		private var _introSfx:Vector.<Sfx>;
		private var _introBeat:int;
		private var _musicFader:SfxFader;

        private var _tempo:String;
		private var _bpm:int;
        private var _score:Number;
        private var _multiplier:Number;
        private var _timer:Timer;
        private var _missedBeats:int;
		private var _beats:int;
		private var _state:int;
		private var _frame:int;
		private var _finalStars:int;

		public function GameWorld() {
			_timer = new Timer();
			_readySfx = new Sfx(READY_SOUND);
			_chimeSfx = new Sfx(CHIME_SOUND);
			_booSfx = new Sfx(BOO_SOUND);
			_cheerSfx = new Sfx(CHEER_SOUND);
			_star1Sfx = new Sfx(STAR1_SOUND);
			_star2Sfx = new Sfx(STAR2_SOUND);
			_star3Sfx = new Sfx(STAR3_SOUND);
			_introSfx = new Vector.<Sfx>();
			_introSfx[0] = new Sfx(INTRO1_SOUND);
			_introSfx[1] = new Sfx(INTRO2_SOUND);
			_introSfx[2] = new Sfx(INTRO3_SOUND);
			_introSfx[3] = new Sfx(INTRO4_SOUND);
			
			_musicFader = new SfxFader((FP.engine as Main).music);
			addTween(_musicFader);

			addGraphic(new Image(BG_IMAGE));
            
            _arm = new Arm();
            _arm.x = 320;
            _arm.y = 420;
            add(_arm);
            
            addGraphic(new Image(OVERLAY_IMAGE));
            addGraphic(new Image(VIGNETTE_IMAGE));

            _tempoText = new Text("");
			_tempoText.color = 0xeeeeee;
            _tempoText.size = 36;
            _tempoText.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
            _tempoText.x = 20;
            _tempoText.y = 20;
            addGraphic(_tempoText);

            _bpmText = new Text("");
			_bpmText.color = 0xeeeeee;
            _bpmText.size = 24;
            _bpmText.field.filters = [new GlowFilter(0x000000, 1, 3, 3)];
            _bpmText.x = 20;
            _bpmText.y = 55;
            addGraphic(_bpmText);

            _scoreText = new Text("");
			_scoreText.color = 0xeeeeee;
            _scoreText.size = 48;
            _scoreText.align = "right";
            _scoreText.width = 300;
            _scoreText.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
			_scoreText.text = "000000";
            _scoreText.x = 320;
            _scoreText.y = 10;
            addGraphic(_scoreText);
            
            _multiplierText = new Text("");
			_multiplierText.color = 0xeeeeee;
            _multiplierText.size = 28;
            _multiplierText.align = "right";
            _multiplierText.width = 100;
            _multiplierText.field.filters = [new GlowFilter(0x000000, 1, 3, 3)];
			_multiplierText.text = "000";
            _multiplierText.x = 520;
            _multiplierText.y = 55;
            addGraphic(_multiplierText);
            
            _multiplierFade = new ColorTween();
			_multiplierFade.color = 0xffffff;
            addTween(_multiplierFade);

			_messageText = new Text("");
			_messageText.color = 0xeeeeee;
			_messageText.size = 72;
			_messageText.align = "center";
			_messageText.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
			_messageText.text = "Ready?";
			_messageText.x = 0;
			_messageText.width = 640;
			_messageText.y = 160;
			_messageText.alpha = 0;
			addGraphic(_messageText);
			
			_messageFade = new VarTween();
			addTween(_messageFade);

			// Initialise stars
			_star1Blank = makeStar(STAR_BLANK_IMAGE, 180);
			_star2Blank = makeStar(STAR_BLANK_IMAGE, 320);
			_star3Blank = makeStar(STAR_BLANK_IMAGE, 460);
			_star1 = makeStar(STAR_IMAGE, 180);
			_star2 = makeStar(STAR_IMAGE, 320);
			_star3 = makeStar(STAR_IMAGE, 460);
			_starTween = new MultiVarTween();
			addTween(_starTween);
			
			// Init instructions
			_instructionText = new Text("");
			_instructionText.color = 0xeeeeee;
			_instructionText.size = 32;
			_instructionText.align = "center";
			_instructionText.field.filters = [new GlowFilter(0x000000, 1, 4, 4)];
			_instructionText.text = "Press ANY key in time with the pendulum";
			_instructionText.x = 0;
			_instructionText.width = 640;
			_instructionText.y = 370;
			_instructionText.scrollX = 0;
			_instructionText.scrollY = 0;
			_instructionText.alpha = 0;
			addGraphic(_instructionText);

			_instructionFade = new VarTween();
			addTween(_instructionFade);
			
			_showInstructions = true;
		}
		
		private function makeStar(img:Class, x:Number):Image {
			var star:Image = new Image(img);
			star.x = x;
			star.y = 300;
			star.centerOrigin();
			addGraphic(star);
			return star;
		}

		override public function begin():void {
			score = 0;
			multiplier = 0;
			_finalStars = 0;
			_missedBeats = 0;
			_introBeat = 0;
			_timer.reset();
			_arm.time = 0;
			_tempoText.text = _tempo;
			_bpmText.text = _bpm + "bpm";
			_beats = 16;
			_state = STATE_INTRO;
			_frame = INTRO_TIME;
			
			_star1Blank.alpha = 0;
			_star2Blank.alpha = 0;
			_star3Blank.alpha = 0;
			_star1.alpha = 0;
			_star2.alpha = 0;
			_star3.alpha = 0;
			_star1.scale = 0.6;
			_star2.scale = 0.6;
			_star3.scale = 0.6;
		
			_messageText.alpha = 0;
			_messageText.text = "Ready?";
			
			_messageFade.tween(_messageText, "alpha", 1, 20);
			_readySfx.play();
			_musicFader.fadeTo(0, 30);
		}

		public function set tempo(t:String):void {
			_tempo = t;
		}
		
		public function set bpm(b:int):void {
			_bpm = b;
			_timer.bpm = b;
		}

		public function get score():Number {
            return _score;
        }

        public function set score(s:Number):void {
            _score = s;
            _scoreText.text = zeroPad(Math.floor(_score), 6);
        }
        
        public function get multiplier():Number {
            return _multiplier;
        }
        
        public function set multiplier(m:Number):void {
            _multiplier = m;
            _multiplierText.text = zeroPad(Math.floor(_multiplier), 3);
        }

        public static function zeroPad(n:Number, len:int):String {
            var str:String = String(n);
            
            for(var i:int = str.length; i < len; i++) {
                str = "0" + str;
            }
            
            return str;
        }
        
        public function float(txt:String, colour:uint):void {
            var floater:Floater = create(Floater) as Floater;
            floater.text = txt;
            floater.x = 320;
            floater.y = 240;
            floater.colour = colour;
        }
		
		private function transition(s:int):void {
			_state = s;
			
			if(_state == STATE_COUNTIN) {
				_timer.start();
				
				if(_showInstructions) {
					_instructionFade.tween(_instructionText, "alpha", 1, 30);
				}
			} else if(_state == STATE_PLAY) {
				_messageFade.tween(_messageText, "alpha", 0, 20);
			} else if(_state == STATE_OUTRO) {
				_messageText.text = (_missedBeats <= MAX_MISSED_BEATS) ? "Great!" : "You Suck";
				_messageFade.tween(_messageText, "alpha", 1, 20);

				_starTween.tween(_star1Blank, {alpha: 1}, 30);
				_star3Blank.alpha = _star2Blank.alpha = _star1Blank.alpha;

				_frame = OUTRO_TIME;
				((_missedBeats <= MAX_MISSED_BEATS) ? _cheerSfx : _booSfx).play();
			} else if(_state == STATE_RESULT) {
				_finalStars = calcFinalStars();
				
				// Chain star tweens together
				((_finalStars > 0) ? starTween_1 : starTween_done)();
			} else if(_state == STATE_RETURN) {
				_cheerSfx.stop();
				_booSfx.stop();
				(FP.engine as Main).returnResult(_finalStars);
				(FP.engine as Main).showMenu();
			}
		}
		
		// Star tween callback functions
		private function starTween_1():void {
			_star1Sfx.play();
			_starTween.tween(_star1, {alpha: 1, scale: 1}, 10);
			_starTween.complete = (_finalStars > 1) ? starTween_2 : starTween_done;
		}
		private function starTween_2():void {
			_star2Sfx.play();
			_starTween.tween(_star2, {alpha: 1, scale: 1}, 10);
			_starTween.complete = (_finalStars > 2) ? starTween_3 : starTween_done;
		}
		private function starTween_3():void {
			_star3Sfx.play();
			_starTween.tween(_star3, {alpha: 1, scale: 1}, 10);
			_starTween.complete = starTween_done;
		}
		private function starTween_done():void {
			_starTween.complete = null;
			transition(STATE_DONE);
		}
		
		private function calcFinalStars():int {
			if(_missedBeats > MAX_MISSED_BEATS) {
				return 0;
			} else if(_score > SCORE_THRESHOLD_3STAR) {
				return 3;
			} else if(_score > SCORE_THRESHOLD_2STAR) {
				return 2;
			} else if(_score > SCORE_THRESHOLD_1STAR) {
				return 1;
			} else {
				return 0;
			}
		}

        override public function update():void {
            super.update();
			_timer.nextFrame();
			_multiplierText.color = _multiplierFade.color;

			if(_state == STATE_INTRO) {
				// Pause a bit before starting
				_frame--;
				if(_frame <= 0) {
					transition(STATE_COUNTIN);
				}
			} else if(_state == STATE_COUNTIN) {
				if(_timer.isBeat) {
					_introSfx[_introBeat].play();
					_introBeat++
						
					if(_introBeat >= 4) {
						transition(STATE_PLAY);
					}
				}
			} else if(_state == STATE_PLAY) {
	            _arm.time = _timer.beats;
	            var diff:Number = _timer.diffFrames;
	            
	            // Register the beat
	            if(diff == 0) {
	                _missedBeats++;
					_beats--;
	            }
	            
	            if(Input.pressed(Key.ANY)) {
					if(_showInstructions && _instructionText.alpha == 1) {
						_instructionFade.tween(_instructionText, "alpha", 0, 30);
						_showInstructions = false;
					}
					
	                var missed:Boolean = diff > 3;
	                if(missed) {
	                    _arm.miss();
	                    multiplier = 0;
	                    _multiplierFade.tween(10, 0xc41b18, 0xffffff);
	                } else {
	                    _arm.ticktock();
	                    multiplier++;
	                    _missedBeats = 0;
	                }
	                
					// What kind of hit did we register?
	                if(diff == 0) {
	                    float("Perfect!", 0xd3cd08);
	                    multiplier += 4;
	                    _multiplierFade.tween(10, 0xd3cd08, 0xffffff);
						_chimeSfx.play();
	                } else if(diff <= 2) {
	                    float("Good", 0x0bd308);
	                } else if(diff >= 4 && diff <= 6) {
	                    float("Miss", 0x5368b2);
	                } else if(diff > 10) {
	                    float("Awful!", 0xc41b18);
	                } else if(diff > 8) {
	                    float("Poor", 0xc41b18);
	                } 
	                
					// Score some ponts if we hit
	                if(!missed) {
	                    var factor:Number = Math.max(0, 4 - diff);
	                    score += factor * multiplier * BASE_SCORE;
	                }
				}

				// Check to see if we should transition out of the play state
				if(_beats < 0 || _missedBeats > MAX_MISSED_BEATS) {
					transition(STATE_OUTRO);
				}
			} else if(_state == STATE_OUTRO) {
				_arm.time = _timer.beats;

				// Fade in all stars at the same time
				_star3Blank.alpha = _star2Blank.alpha = _star1Blank.alpha;

				// Pause a bit before showing result
				_frame--;
				if(_frame <= 0) {
					transition(STATE_RESULT);
				}
			} else if(_state == STATE_DONE) {
				if(Input.pressed(Key.ANY)) {
					transition(STATE_RETURN);
				}
            }
        }
    }
}