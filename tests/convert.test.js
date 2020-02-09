const execa = require("execa");

describe("convert", () => {
  test("from base64 to txt", async () => {
    const { stdout } = await execa('echo dGVzdA== | ./index.js --ft="base64"');
    expect(stdout).toEqual("test");
  });
});
