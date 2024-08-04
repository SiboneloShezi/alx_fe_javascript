// Initial array of quote objects
const quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "Do not wait to strike till the iron is hot; but make it hot by striking.",
    category: "Action",
  },
  {
    text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.",
    category: "Wisdom",
  },
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");
  formContainer.innerHTML = `
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteButton">Add Quote</button>
    </div>
  `;

  // Event listener for the "Add Quote" button
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listener for the "Show New Quote" button
document
  .getElementById("newQuoteButton")
  .addEventListener("click", showRandomQuote);

// Initialize the page
createAddQuoteForm();
showRandomQuote();
