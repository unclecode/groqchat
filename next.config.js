// next.config.js
const { IgnorePlugin } = require("webpack");

const nextConfig = {
    reactStrictMode: true,
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
