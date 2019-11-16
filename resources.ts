import {forEach} from "@softwareventures/dictionary";
import {Resource, Texture} from "excalibur";
import titleBackground from "./title/background.png";
import titleBigArm from "./title/big-arm.png";
import titleBody from "./title/body.png";
import titleLogo from "./title/logo.png";
import titleSmallArm from "./title/small-arm.png";

const resources = {
    titleBackground: new Texture(titleBackground),
    titleBigArm: new Texture(titleBigArm),
    titleBody: new Texture(titleBody),
    titleLogo: new Texture(titleLogo),
    titleSmallArm: new Texture(titleSmallArm)
};

forEach(resources as Record<string, Resource<unknown>>, (resource) => {
    resource.bustCache = false;
});

export default resources;