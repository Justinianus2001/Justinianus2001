const fs = require("fs");

const FALLBACK_QUOTES = [
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra"
  },
  {
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck"
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    quote: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    quote: "Code is like humor. When you have to explain it, it’s bad.",
    author: "Cory House"
  },
  {
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    quote: "Life is 10% what happens to us and 90% how we react to it.",
    author: "Dennis P. Kimbro"
  },
  {
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  }
];

const getRandomFallback = () => {
  const index = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  return FALLBACK_QUOTES[index];
};

const getQuote = async () => {
  // Primary attempt: quotes.rest
  try {
    const TOKEN = process.env.API_TOKEN;
    const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

    const response = await fetch("https://quotes.rest/qod?language=en", {
      headers,
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      const quote = data?.contents?.quotes?.[0]?.quote;
      const author = data?.contents?.quotes?.[0]?.author || "Anonymous";

      if (quote) {
        console.log(`Fetched primary QOD: "${quote}" - ${author}`);
        return { quote, author };
      }
    } else {
      console.warn(`Primary quote API status: ${response.status}`);
    }
  } catch (err) {
    console.warn("Primary quote API failed:", err.message);
  }

  // Secondary attempt: DummyJSON Quotes API
  try {
    const response = await fetch("https://dummyjson.com/quotes/random", {
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.quote) {
        console.log(`Fetched secondary quote: "${data.quote}" - ${data.author}`);
        return {
          quote: data.quote,
          author: data.author || "Anonymous"
        };
      }
    }
  } catch (err) {
    console.warn("Secondary quote API failed:", err.message);
  }

  // Ultimate fallback: Local curated quotes
  console.log("Using curated fallback quote.");
  return getRandomFallback();
};

const generate = async () => {
  const { quote, author } = await getQuote();

  if (!quote) {
    console.error("No quote could be retrieved. Exiting.");
    return;
  }

  const curDate = new Date();
  const dd = String(curDate.getDate()).padStart(2, "0");
  const mm = String(curDate.getMonth() + 1).padStart(2, "0");
  const yyyy = String(curDate.getFullYear()).padStart(4, "0");
  const today = `${mm}/${dd}/${yyyy}`;

  const quoteContent = `> *"_${quote}_*"\n>\n> — **${author}** *(Updated: ${today})*`;

  const START_TAG = "<!-- QUOTE:START -->";
  const END_TAG = "<!-- QUOTE:END -->";

  if (!fs.existsSync("README.md")) {
    console.error("README.md does not exist!");
    return;
  }

  let readme = fs.readFileSync("README.md", "utf8");

  if (readme.includes(START_TAG) && readme.includes(END_TAG)) {
    const pattern = new RegExp(`${START_TAG}[\\s\\S]*?${END_TAG}`, "m");
    const replacement = `${START_TAG}\n${quoteContent}\n${END_TAG}`;
    readme = readme.replace(pattern, replacement);
    fs.writeFileSync("README.md", readme, "utf8");
    console.log("✅ Successfully updated quote in README.md via placeholder injection!");
  } else {
    console.warn("⚠️ Placeholder tags <!-- QUOTE:START --> and <!-- QUOTE:END --> not found in README.md. No changes written.");
  }
};

generate();
