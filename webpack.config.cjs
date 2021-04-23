const config = require("@softwareventures/webpack-config");
const ResolveTypescriptPlugin = require("resolve-typescript-plugin").default;

module.exports = config({
    title: "Super Metronome Hero",
    entry: "./index.js",
    vendor: "dcgw",
    html: {
        template: "index.html"
    },
    customize: configuration => ({
        ...configuration,
        resolve: {
            ...configuration.resolve,
            fullySpecified: true,
            plugins: [
                ...(configuration.resolve.plugins ?? []),
                new ResolveTypescriptPlugin()
            ]
        }
    })
});
