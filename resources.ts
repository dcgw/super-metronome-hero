import {forEach} from "@softwareventures/dictionary";
import {Sound, Texture} from "excalibur";
import menuBlipMp3 = require("./menu/blip.mp3");
import menuBlipOgg = require("./menu/blip.ogg");
import menuItemRatings = require("./menu/item-ratings.png");
import menuItem = require("./menu/menu-item.png");
import menuSelectMp3 = require("./menu/select.mp3");
import menuSelectOgg = require("./menu/select.ogg");
import musicMp3 = require("./music/music.mp3");
import musicOgg = require("./music/music.ogg");
import performanceArm = require("./performance/arm.png");
import performanceBackground = require("./performance/background.png");
import performanceBigStarBlank = require("./performance/big-star-blank.png");
import performanceBigStar = require("./performance/big-star.png");
import performanceBooMp3 = require("./performance/boo.mp3");
import performanceBooOgg = require("./performance/boo.ogg");
import performanceCheerMp3 = require("./performance/cheer.mp3");
import performanceCheerOgg = require("./performance/cheer.ogg");
import performanceChimeMp3 = require("./performance/chime.mp3");
import performanceChimeOgg = require("./performance/chime.ogg");
import performanceFourMp3 = require("./performance/four.mp3");
import performanceFourOgg = require("./performance/four.ogg");
import performanceMissMp3 = require("./performance/miss.mp3");
import performanceMissOgg = require("./performance/miss.ogg");
import performanceOneMp3 = require("./performance/one.mp3");
import performanceOneOgg = require("./performance/one.ogg");
import performanceOverlay = require("./performance/overlay.png");
import performanceReadyMp3 = require("./performance/ready.mp3");
import performanceReadyOgg = require("./performance/ready.ogg");
import performanceStar1Mp3 = require("./performance/star1.mp3");
import performanceStar1Ogg = require("./performance/star1.ogg");
import performanceStar2Mp3 = require("./performance/star2.mp3");
import performanceStar2Ogg = require("./performance/star2.ogg");
import performanceStar3Mp3 = require("./performance/star3.mp3");
import performanceStar3Ogg = require("./performance/star3.ogg");
import performanceThreeMp3 = require("./performance/three.mp3");
import performanceThreeOgg = require("./performance/three.ogg");
import performanceTickMp3 = require("./performance/tick.mp3");
import performanceTickOgg = require("./performance/tick.ogg");
import performanceTockMp3 = require("./performance/tock.mp3");
import performanceTockOgg = require("./performance/tock.ogg");
import performanceTwoMp3 = require("./performance/two.mp3");
import performanceTwoOgg = require("./performance/two.ogg");
import performanceVignette = require("./performance/vignette.png");
import titleBackground = require("./title/background.png");
import titleBigArm = require("./title/big-arm.png");
import titleBody = require("./title/body.png");
import titleLogo = require("./title/logo.png");
import titleSmallArm = require("./title/small-arm.png");

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
