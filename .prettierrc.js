/* jshint ignore:start */
const { tinkoffConfig } = require("@tinkoff/prettier-config");

module.exports = {
    ...tinkoffConfig,
    tabWidth: 4,
    useTabs: true,
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
    bracketSameLine: false,
    htmlWhitespaceSensitivity: "css",
    singleAttributePerLine: true,
    endOfLine: "crlf"
};
/* jshint ignore:end */