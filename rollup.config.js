import {terser} from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "./index.ts",
    output: {
        file: "./build/main.min.js",
        format: "iife",
        name: "test",
        plugins: [terser()]
    },
    plugins: [typescript(), nodeResolve(), commonjs()]
}