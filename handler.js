const fs = require("fs");

module.exports = async (event) => {
  const filePath = `${__dirname}/dist/${event.pathParameters.proxy}`;
  try {
    const content = fs.readFileSync(filePath, "binary");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/octet-stream",
      },
      isBase64Encoded: true,
      body: Buffer.from(content, "binary").toString("base64"),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "File not found" }),
    };
  }
};
