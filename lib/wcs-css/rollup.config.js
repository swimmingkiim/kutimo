import {terser} from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import strip from "@rollup/plugin-strip";

export default {
    input: "./index.ts",
    output: [
        {
            file: "./build/main.min.js",
            sourcemap: true,
            format: "iife",
            name: "WCS",
            plugins: [terser()]
        },
        {
            file: "./build/main.js",
            sourcemap: true,
            format: "umd",
            name: "WCS",
            plugins: [terser()]
        }
    ],
    plugins: [
        typescript({
            sourceMap: true
        }),
        nodeResolve(),
        commonjs(),
        strip()
    ]
}