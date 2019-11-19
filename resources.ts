import {forEach} from "@softwareventures/dictionary";
import {Resource, Sound, Texture} from "excalibur";
import menuBlipMp3 from "./menu/blip.mp3";
import menuBlipOgg from "./menu/blip.ogg";
import menuItemRatings from "./menu/item-ratings.png";
import menuItem from "./menu/menu-item.png";
import menuSelectMp3 from "./menu/select.mp3";
import menuSelectOgg from "./menu/select.ogg";
import performanceBackground from "./performance/background.png";
import performanceBooMp3 from "./performance/boo.mp3";
import performanceBooOgg from "./performance/boo.ogg";
import performanceCheerMp3 from "./performance/cheer.mp3";
import performanceCheerOgg from "./performance/cheer.ogg";
import performanceOverlay from "./performance/overlay.png";
import performanceReadyMp3 from "./performance/ready.mp3";
import performanceReadyOgg from "./performance/ready.ogg";
import performanceVignette from "./performance/vignette.png";
import titleBackground from "./title/background.png";
import titleBigArm from "./title/big-arm.png";
import titleBody from "./title/body.png";
import titleLogo from "./title/logo.png";
import titleMusicMp3 from "./title/music.mp3";
import titleMusicOgg from "./title/music.ogg";
import titleSmallArm from "./title/small-arm.png";

const resources = {
    menuBlip: new Sound(menuBlipOgg, menuBlipMp3),
    menuItemRatings: new Texture(menuItemRatings),
    menuItem: new Texture(menuItem),
    menuSelect: new Sound(menuSelectOgg, menuSelectMp3),
    performanceBackground: new Texture(performanceBackground),
    performanceBoo: new Sound(performanceBooOgg, performanceBooMp3),
    performanceCheer: new Sound(performanceCheerOgg, performanceCheerMp3),
    performanceOverlay: new Texture(performanceOverlay),
    performanceReady: new Sound(performanceReadyOgg, performanceReadyMp3),
    performanceVignette: new Texture(performanceVignette),
    titleBackground: new Texture(titleBackground),
    titleBigArm: new Texture(titleBigArm),
    titleBody: new Texture(titleBody),
    titleLogo: new Texture(titleLogo),
    titleMusic: new Sound(titleMusicOgg, titleMusicMp3),
    titleSmallArm: new Texture(titleSmallArm)
};

forEach(resources as Record<string, Resource<unknown>>, (resource) => {
    resource.bustCache = false;
});

export default resources;