// next.config.js
const { IgnorePlugin } = require("webpack");

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        esmExternals: "loose", // <-- add this
        serverComponentsExternalPackages: ["mongoose"], // <-- and this
    },
    webpack: (config) => {
        config.plugins.push(
            new IgnorePlugin({
                resourceRegExp: /^mongodb(\/?|$)/,
                contextRegExp: /^mongodb$/,
            })
        );

        return config;
    },
};

module.exports = nextConfig;
