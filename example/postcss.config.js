var tailwindcss = require("tailwindcss");

module.exports = {
    from: ["./index.css", "./WCSRouter/**/*.css"],
    plugins: [
        tailwindcss("./tailwind.config.js"),
        require("autoprefixer"),
        require("cssnano"),
    ]
};
