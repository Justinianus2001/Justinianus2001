const axios = require("axios");
const fs = require("fs");

const getQuote = async () => {
  try {
    const { data } = await axios.get("https://quotes.rest/qod?language=en");
    const quote = data.contents.quotes[0].quote;
    const author = data.contents.quotes[0].author;

    console.log("new quote", `"${quote}"`);

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
  if (!author)
	  author = `Anonymous`

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, `0`);
  var mm = String(today.getMonth() + 1).padStart(2, `0`);
  var yyyy = today.getFullYear();

  today = mm + `/` + dd + `/` + yyyy;
  fs.writeFileSync("README.md", `*Quote of the Day (${today}):*\n\n_**${quote}**_\n\n${author}`);
};

generate();