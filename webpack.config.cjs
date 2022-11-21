"use strict";

const config = require("@softwareventures/webpack-config");

module.exports = config({
    title: "Super Metronome Hero",
    entry: "./index.js",
    vendor: "dcgw",
    html: {
        template: "index.html"
    }
});
