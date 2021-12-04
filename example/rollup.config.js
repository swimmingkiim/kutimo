import {terser} from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "./index.ts",
    output: {
        file: "./build/main.js",
        sourcemap: true,
        format: "cjs",
        name: "test",
        plugins: [terser()]
    },
    plugins: [
        typescript({
            sourceMap: true
        }),
        nodeResolve(),
        commonjs()
    ]
}