#!/usr/bin/env node
const minimist = require("minimist");
const fs = require("fs");
const Path = require("path");
var _data = "";

const transformation = [
  {
    from: "base64",
    to: "txt",
    fn: data => new Buffer.from(data, "base64").toString("ascii")
  },
  {
    from: "txt",
    to: "base64",
    fn: data => new Buffer.from(data).toString("base64")
  }
];

const transform = (from, to) =>
  transformation.find(t => t.from == from && t.to == to);

function convert(from, to, data) {
  const transformer = transform(from, to);
  if (!transformer) throw new Error("transformation function not found.");

  return transformer.fn(data);
}

function normalizePath(path) {
  return Path.join(process.cwd(), path);
}

function main(argv, data) {
  try {
    const debug = argv.verbose || argv.v || false;
    const fromType = argv.fromType || argv.ft;
    const toType = argv.toType || argv.tt || "txt";
    let outputPath = argv.output || argv.o;
    const create = argv.create || argv.c;

    if (debug)
      console.log({
        argv,
        data
      });

    if (outputPath && outputPath.startsWith(".")) {
      outputPath = normalizePath(outputPath);
    }

    if (!fromType) throw new Error("fromType (--ft) is required.");

    let outputData = convert(fromType, toType, data);
    if (create && outputPath) fs.writeFileSync(outputPath, outputData);
    else if (create && !outputPath)
      throw new Error("outputPath (--o) is required for create option.");
    else {
      console.error(outputData);
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

function withPipe(data) {
  const argv = minimist(process.argv.slice(2));
  main(argv, data.trim());
  process.exit(0);
}

function withoutPipe() {
  console.log("no content was piped");
}

var self = process.stdin;
self.on("readable", function() {
  var chunk = this.read();
  if (chunk === null) {
    if (!_data) withoutPipe();
  } else {
    _data += chunk;
  }
});
self.on("end", function() {
  withPipe(_data);
});
