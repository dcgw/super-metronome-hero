import {ImageSource, Sound} from "excalibur";
import {FontLoader} from "./font-loader.js";
import menuBlipMp3 from "./menu/blip.mp3";
import menuBlipOgg from "./menu/blip.ogg";
import menuItemRatings from "./menu/item-ratings.png";
import menuItem from "./menu/menu-item.png";
import menuSelectMp3 from "./menu/select.mp3";
import menuSelectOgg from "./menu/select.ogg";
import musicMp3 from "./music/music.mp3";
import musicOgg from "./music/music.ogg";
import performanceArm from "./performance/arm.png";
import performanceBackground from "./performance/background.png";
import performanceBigStarBlank from "./performance/big-star-blank.png";
import performanceBigStar from "./performance/big-star.png";
import performanceBooMp3 from "./performance/boo.mp3";
import performanceBooOgg from "./performance/boo.ogg";
import performanceCheerMp3 from "./performance/cheer.mp3";
import performanceCheerOgg from "./performance/cheer.ogg";
import performanceChimeMp3 from "./performance/chime.mp3";
import performanceChimeOgg from "./performance/chime.ogg";
import performanceFourMp3 from "./performance/four.mp3";
import performanceFourOgg from "./performance/four.ogg";
import performanceMissMp3 from "./performance/miss.mp3";
import performanceMissOgg from "./performance/miss.ogg";
import performanceOneMp3 from "./performance/one.mp3";
import performanceOneOgg from "./performance/one.ogg";
import performanceOverlay from "./performance/overlay.png";
import performanceReadyMp3 from "./performance/ready.mp3";
import performanceReadyOgg from "./performance/ready.ogg";
import performanceStar1Mp3 from "./performance/star1.mp3";
import performanceStar1Ogg from "./performance/star1.ogg";
import performanceStar2Mp3 from "./performance/star2.mp3";
import performanceStar2Ogg from "./performance/star2.ogg";
import performanceStar3Mp3 from "./performance/star3.mp3";
import performanceStar3Ogg from "./performance/star3.ogg";
import performanceThreeMp3 from "./performance/three.mp3";
import performanceThreeOgg from "./performance/three.ogg";
import performanceTickMp3 from "./performance/tick.mp3";
import performanceTickOgg from "./performance/tick.ogg";
import performanceTockMp3 from "./performance/tock.mp3";
import performanceTockOgg from "./performance/tock.ogg";
import performanceTwoMp3 from "./performance/two.mp3";
import performanceTwoOgg from "./performance/two.ogg";
import performanceVignette from "./performance/vignette.png";
import titleBackground from "./title/background.png";
import titleBigArm from "./title/big-arm.png";
import titleBody from "./title/body.png";
import titleLogo from "./title/logo.png";
import titleSmallArm from "./title/small-arm.png";

const resources = {
    font22px: new FontLoader("Strait", 22),
    font24px: new FontLoader("Strait", 24),
    font28px: new FontLoader("Strait", 28),
    font32px: new FontLoader("Strait", 32),
    font36px: new FontLoader("Strait", 36),
    font48px: new FontLoader("Strait", 48),
    font60px: new FontLoader("Strait", 60),
    font72px: new FontLoader("Strait", 72),
    menuBlip: new Sound(menuBlipOgg, menuBlipMp3),
    menuItemRatings: new ImageSource(menuItemRatings),
    menuItem: new ImageSource(menuItem),
    menuSelect: new Sound(menuSelectOgg, menuSelectMp3),
    music: new Sound(musicOgg, musicMp3),
    performanceArm: new ImageSource(performanceArm),
    performanceBackground: new ImageSource(performanceBackground),
    performanceBoo: new Sound(performanceBooOgg, performanceBooMp3),
    performanceBigStarBlank: new ImageSource(performanceBigStarBlank),
    performanceBigStar: new ImageSource(performanceBigStar),
    performanceCheer: new Sound(performanceCheerOgg, performanceCheerMp3),
    performanceChime: new Sound(performanceChimeOgg, performanceChimeMp3),
    performanceFour: new Sound(performanceFourOgg, performanceFourMp3),
    performanceMiss: new Sound(performanceMissOgg, performanceMissMp3),
    performanceOne: new Sound(performanceOneOgg, performanceOneMp3),
    performanceOverlay: new ImageSource(performanceOverlay),
    performanceReady: new Sound(performanceReadyOgg, performanceReadyMp3),
    performanceStar1: new Sound(performanceStar1Ogg, performanceStar1Mp3),
    performanceStar2: new Sound(performanceStar2Ogg, performanceStar2Mp3),
    performanceStar3: new Sound(performanceStar3Ogg, performanceStar3Mp3),
    performanceThree: new Sound(performanceThreeOgg, performanceThreeMp3),
    performanceTick: new Sound(performanceTickOgg, performanceTickMp3),
    performanceTock: new Sound(performanceTockOgg, performanceTockMp3),
    performanceTwo: new Sound(performanceTwoOgg, performanceTwoMp3),
    performanceVignette: new ImageSource(performanceVignette),
    titleBackground: new ImageSource(titleBackground),
    titleBigArm: new ImageSource(titleBigArm),
    titleBody: new ImageSource(titleBody),
    titleLogo: new ImageSource(titleLogo),
    titleSmallArm: new ImageSource(titleSmallArm)
};

export default resources;
