process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
const axios = require("axios");
const fs = require("fs");

const getQuote = async () => {
  try {
    const { data } = await axios.get("https://quotes.rest/qod?language=en");
    const quote = data.contents.quotes[0].quote;
    const author = data.contents.quotes[0].author === null ? `Anonymous` : data.contents.quotes[0].author;

    console.log("new quote", `"${quote}"`);
	  console.log("author", `"${author}"`);

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

  if (!quote)
	return;

  const curDate = new Date();
  const dd = String(curDate.getDate()).padStart(2, `0`);
  const mm = String(curDate.getMonth() + 1).padStart(2, `0`);
  const yyyy = String(curDate.getFullYear()).padStart(4, `0`);

  const today = mm + `/` + dd + `/` + yyyy;
  fs.writeFileSync("README.md", `*Quote of the Day (${today}):*\n\n_**${quote}**_\n\n${author}`);
};

generate();