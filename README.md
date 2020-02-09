# transform-cli

cli to transform data from one type to another.

## Installation

```
npm i -g transform-cli
```

## Usage

- --verbose (debug mode, add extra logs, default:false)
- --fromType (type to convert from)
- --toType (type to convert to)
- --outputPath (path to save output file.)
- --create (create file with the converted data)

## Example

```
echo test | ./index.js --ft="txt" --tt="base64"
echo dGVzdA== | ./index.js --ft="base64" --tt="txt"
```

## Converters

- from base64 to txt
- from txt to base64
