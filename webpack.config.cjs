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
                // {
                //     apply: resolver => {
                //         const target = resolver.ensureHook("file");
                //         for (const extension of [".ts", ".tsx"]) {
                //             resolver.getHook("raw-file").tapAsync("TestPlugin", (request, resolveContext, callback) => {
                //                 if (!request.path || request.path.match(/(^|[\\/])node_modules($|[\\/])/)) {
                //                     return callback();
                //                 }
                //
                //                 const path = request.path.replace(/\.js$/, extension);
                //                 if (path === request.path) {
                //                     callback();
                //                 } else {
                //                     resolver.doResolve(
                //                         target,
                //                         {
                //                             ...request,
                //                             path,
                //                             relativePath:
                //                                 request.relativePath && request.relativePath.replace(/\.js$/, extension)
                //                         },
                //                         `using path: ${path}`,
                //                         resolveContext,
                //                         callback
                //                     );
                //                 }
                //             });
                //         }
                //     }
                // }
            ]
        }
    })
});
