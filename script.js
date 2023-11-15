"use strict";

let previousQuote = ""; // Variable to store the previously displayed quote
const entInput = document.getElementById("keyword");

entInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault;

    document.getElementById("genButton").click();
  }
});

async function fetchQuotes() {
  const response = await fetch("quotes.json");
  const data = await response.json();
  return data;
}

async function generateQuote() {
  const quotes = await fetchQuotes();
  const keyword = document.getElementById("keyword").value.toLowerCase();
  let filteredQuotes = [];

  if (keyword) {
    filteredQuotes = quotes.filter((authorData) => {
      const authorQuotes = authorData.Quotes;
      return authorQuotes.some((quote) =>
        quote.toLowerCase().includes(keyword)
      );
    });
  } else {
    filteredQuotes = quotes;
  }

  let availableQuotes = filteredQuotes.filter((authorData) => {
    const authorQuotes = authorData.Quotes;
    return !authorQuotes.includes(previousQuote); // Check if the previous quote is in the list
  });

  if (availableQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const authorData = availableQuotes[randomIndex];
    const author = authorData.Author;
    const authorQuotes = authorData.Quotes;
    let randomIndexQuote;
    do {
      randomIndexQuote = Math.trunc(Math.random() * authorQuotes.length);
    } while (authorQuotes[randomIndexQuote] === previousQuote);
    const randomQuote = authorQuotes[randomIndexQuote];
    const authorImage = `${author.toLowerCase().replace(/\s/g, "-")}.png`;
    const authorImageElement = document.getElementById("authorImage");
    let imagePath = authorImage
      ? `images/${authorImage}`
      : "/images/no-profile-image.png";
    authorImageElement.src = imagePath;
    authorImageElement.onerror = function () {
      authorImageElement.src = "/images/no-profile-image.png";
    };
    document.getElementById("quote").textContent = randomQuote;
    document.getElementById("author").textContent = `- ${author}`;
    document.getElementById("authorImage").src = imagePath;
    previousQuote = randomQuote; // Update the previous quote
  } else {
    document.getElementById("quote").textContent =
      "No matching quotes found or all quotes have been displayed.";
    document.getElementById("author").textContent = "";
    document.getElementById("authorImage").src = ""; // Clear the image if no matching quotes found
  }
}

function downloadQuote() {
  const container = document.querySelector(".quote-container");
  html2canvas(container).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "quote.png";
    link.click();
  });
}

let currentBackground = 1;

function toggleBackground() {
  const quoteContainer = document.querySelector(".quote-container");

  // Remove existing background class
  quoteContainer.classList.remove(`background${currentBackground}`);

  // Increment the background index
  currentBackground = (currentBackground % 5) + 1;

  // Add the new background class
  quoteContainer.classList.add(`background${currentBackground}`);
}
