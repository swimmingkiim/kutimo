var path = require("path");
var shell = require("shelljs");

const devDependencies = [
    "@rollup/plugin-commonjs@^21.0.1",
    "@rollup/plugin-html@^0.2.4",
    "@rollup/plugin-image@^2.1.1",
    "@rollup/plugin-node-resolve@^13.0.6",
    "@rollup/plugin-strip@^2.1.0",
    "@typescript-eslint/eslint-plugin@^5.10.2",
    "@typescript-eslint/parser@^5.10.2",
    "@web/dev-server@^0.1.28",
    "autoprefixer@^10.4.2",
    "concurrently@^6.4.0",
    "cssnano@^5.0.16",
    "eslint@^8.8.0",
    "eslint-config-prettier@^8.3.0",
    "eslint-plugin-wcs@file:../lib/eslint-plugin-wcs",
    "postcss@^8.4.5",
    "prettier@2.5.1",
    "rollup@^2.60.2",
    "rollup-plugin-peer-deps-external@^2.2.4",
    "rollup-plugin-postcss@^4.0.2",
    "rollup-plugin-terser@^7.0.2",
    "rollup-plugin-typescript2@^0.31.2",
    "tailwindcss@^3.0.18",
    "tslib@^2.3.1",
    "typescript@^4.5.5"
];
const dependencies = [
    "git@github.com:swimmingkiim/web-components-system.git",
]

module.exports = function createFromTemplate(projectName) {
    try {
        const templatePath = path.resolve(__dirname, "template");
        shell.mkdir(projectName);
        shell.cd(projectName);
        shell.exec(`cp -a ${templatePath}/. ${shell.pwd()}`);
        shell.ls("package.json").forEach((file) => {
            shell.sed("-i", "example", projectName, file);
        })
        shell.echo("installing dependencies...(this can take long time)");
        shell.exec("npm i");
        shell.exec(`npm i ${dependencies.join(" ")}`);
        shell.cd("..");
        shell.echo("done!");
    } catch (err) {
        shell.cd(process.cwd());
        shell.rm("-rf", projectName);
        console.log("install failed!");
        console.log(err);
    }
}
