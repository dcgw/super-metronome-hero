const config = require("@softwareventures/webpack-config");

module.exports = config({
    title: "Super Metronome Hero",
    vendor: "dcgw",
    html: {
        template: "index.html.template"
    }
});