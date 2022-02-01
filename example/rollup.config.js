import path from "path";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import htmlTemplate from "rollup-plugin-generate-html-template";
import postcss from "rollup-plugin-postcss";

export default {
    input: "./index.ts",
    output: {
        file: "./build/main.js",
        sourcemap: true,
        format: "es",
        name: "test",
        plugins: [terser()]
    },
    plugins: [
        peerDepsExternal(),
        postcss({
            extensions: [".css", ".less"],
            minimize: true,
            extract: true,
            modules: false,
            use: {
                sass: null,
                stylus: null,
                less: { javascriptEnabled: true }
            },
            config: {
                path: "./postcss.config.js",
            }
        }),
        typescript({
            sourceMap: true
        }),
        nodeResolve(),
        commonjs(),
        htmlTemplate({
            template: "./public/index.html",
            target: "./build/index.html"
        }),
    ]
}
