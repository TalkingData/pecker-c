import uglify from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    file: "pecker/index.js",
    format: "cjs"
  },
  plugins: [
    typescript({ module: "CommonJS" }),
    commonjs({ extensions: [".js", ".ts"] }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    babel({
      exclude: "node_modules/**"
    }),
    uglify.uglify()
  ]
};
