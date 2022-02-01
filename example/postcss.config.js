var tailwindcss = require("tailwindcss");

module.exports = {
    from: ["./index.css", "./src/**/*.css"],
    plugins: [
        tailwindcss("./tailwind.config.js"),
        require("autoprefixer"),
        require("cssnano"),
    ]
};
