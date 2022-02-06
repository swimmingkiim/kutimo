import path from "path";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";

export default {
    input: "./index.ts",
    output: {
        file: "./build/main.js",
        sourcemap: true,
        format: "umd",
        name: "test",
        plugins: [terser()]
    },
    plugins: [
        peerDepsExternal(),
        postcss({
            extensions: [".css", ".less"],
            minimize: true,
            extract: path.resolve("build", "main.css"),
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
        image(),
        nodeResolve(),
        typescript({
            sourceMap: true
        }),
        commonjs(),
    ]
};
