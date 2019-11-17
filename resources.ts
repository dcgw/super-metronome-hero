import {forEach} from "@softwareventures/dictionary";
import {Resource, Sound, Texture} from "excalibur";
import titleBackground from "./title/background.png";
import titleBigArm from "./title/big-arm.png";
import titleBody from "./title/body.png";
import titleLogo from "./title/logo.png";
import titleMusicMp3 from "./title/music.mp3";
import titleMusicOgg from "./title/music.ogg";
import titleSmallArm from "./title/small-arm.png";

const resources = {
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