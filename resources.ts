import {forEach} from "@softwareventures/dictionary";
import {Sound, Texture} from "excalibur";
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
    menuBlip: new Sound(menuBlipOgg, menuBlipMp3),
    menuItemRatings: new Texture(menuItemRatings),
    menuItem: new Texture(menuItem),
    menuSelect: new Sound(menuSelectOgg, menuSelectMp3),
    music: new Sound(musicOgg, musicMp3),
    performanceArm: new Texture(performanceArm),
    performanceBackground: new Texture(performanceBackground),
    performanceBoo: new Sound(performanceBooOgg, performanceBooMp3),
    performanceBigStarBlank: new Texture(performanceBigStarBlank),
    performanceBigStar: new Texture(performanceBigStar),
    performanceCheer: new Sound(performanceCheerOgg, performanceCheerMp3),
    performanceChime: new Sound(performanceChimeOgg, performanceChimeMp3),
    performanceFour: new Sound(performanceFourOgg, performanceFourMp3),
    performanceMiss: new Sound(performanceMissOgg, performanceMissMp3),
    performanceOne: new Sound(performanceOneOgg, performanceOneMp3),
    performanceOverlay: new Texture(performanceOverlay),
    performanceReady: new Sound(performanceReadyOgg, performanceReadyMp3),
    performanceStar1: new Sound(performanceStar1Ogg, performanceStar1Mp3),
    performanceStar2: new Sound(performanceStar2Ogg, performanceStar2Mp3),
    performanceStar3: new Sound(performanceStar3Ogg, performanceStar3Mp3),
    performanceThree: new Sound(performanceThreeOgg, performanceThreeMp3),
    performanceTick: new Sound(performanceTickOgg, performanceTickMp3),
    performanceTock: new Sound(performanceTockOgg, performanceTockMp3),
    performanceTwo: new Sound(performanceTwoOgg, performanceTwoMp3),
    performanceVignette: new Texture(performanceVignette),
    titleBackground: new Texture(titleBackground),
    titleBigArm: new Texture(titleBigArm),
    titleBody: new Texture(titleBody),
    titleLogo: new Texture(titleLogo),
    titleSmallArm: new Texture(titleSmallArm)
};

forEach(resources, resource => {
    resource.bustCache = false;
});

export default resources;
