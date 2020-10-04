/* eslint-disable no-duplicate-imports */

declare module "*.css" {
    import {Dictionary} from "dictionary-types";
    const mappings: Dictionary<string>;
    export = mappings;
}

declare module "*.less" {
    import {Dictionary} from "dictionary-types";
    const mappings: Dictionary<string>;
    export = mappings;
}

declare module "*.jpeg" {
    const url: string;
    export default url;
}

declare module "*.jpg" {
    const url: string;
    export default url;
}

declare module "*.gif" {
    const url: string;
    export default url;
}

declare module "*.mp3" {
    const url: string;
    export default url;
}

declare module "*.mp4" {
    const url: string;
    export default url;
}

declare module "*.oga" {
    const url: string;
    export default url;
}

declare module "*.ogg" {
    const url: string;
    export default url;
}

declare module "*.ogv" {
    const url: string;
    export default url;
}

declare module "*.png" {
    const url: string;
    export default url;
}

declare module "*.svg" {
    const url: string;
    export default url;
}

declare module "*.webm" {
    const url: string;
    export default url;
}

declare module "*.webp" {
    const url: string;
    export default url;
}
