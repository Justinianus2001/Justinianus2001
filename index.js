process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
const axios = require("axios");
const fs = require("fs");

const getQuote = async () => {
  try {
    const TOKEN = "tdxyrjClg0K49mbOjD5Yamij9L5F0L7EuOVSgLPb"
    const { data } = await axios.get("https://quotes.rest/qod?language=en", {
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
      }
    });
    const quote = data.contents.quotes[0].quote;
    const author = data.contents.quotes[0].author === null ? `Anonymous` : data.contents.quotes[0].author;

    console.log("New quote", `"${quote}"`);
	  console.log("Author", `"${author}"`);

    return {
      quote,
      author,
    };
  } catch (err) {
    console.error(err.message);
    return {};
  }
};

const generate = async () => {
  const { quote, author } = await getQuote();

  if (!quote) {
	  return;
  }

  const curDate = new Date();
  const dd = String(curDate.getDate()).padStart(2, `0`);
  const mm = String(curDate.getMonth() + 1).padStart(2, `0`);
  const yyyy = String(curDate.getFullYear()).padStart(4, `0`);

  const today = mm + `/` + dd + `/` + yyyy;
  const readme = `[![quote_generator](https://github.com/Justinianus2001/Justinianus2001/actions/workflows/main.yml/badge.svg)](https://github.com/Justinianus2001/Justinianus2001/actions/workflows/main.yml)\n` +
    `### Hi, I'm Hoang (Justinianus) Le Ngoc from Hue, Vietnam. Nice to meet you !!! ` +
    `<img align=center src="https://user-images.githubusercontent.com/26017543/213809353-c908d93c-3dff-4694-9d13-e0e5cbdb879c.png" alt="Waving Hand" width="36" height="36"/>\n\n` +
    `*Quote of the Day (${today}):*\n\n_**${quote}**_\n\n${author}\n\n` +
    `![Contribution Snake Light](https://raw.githubusercontent.com/Justinianus2001/Justinianus2001/output/github-snake-light.svg#gh-light-mode-only)` +
    `![Contribution Snake Dark](https://raw.githubusercontent.com/Justinianus2001/Justinianus2001/output/github-snake-dark.svg#gh-dark-mode-only)\n\n` +
    `Visitor Count: ![Visitor Count](https://profile-counter.glitch.me/Justinianus2001/count.svg)\n\n` +
    `[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U6PZIUJ)`

  fs.writeFileSync("README.md", readme);
};

generate();