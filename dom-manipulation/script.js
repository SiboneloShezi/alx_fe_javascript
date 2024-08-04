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

  const newQuoteText = document.createElement("input");
  newQuoteText.id = "newQuoteText";
  newQuoteText.type = "text";
  newQuoteText.placeholder = "Enter a new quote";
  formContainer.appendChild(newQuoteText);

  const newQuoteCategory = document.createElement("input");
  newQuoteCategory.id = "newQuoteCategory";
  newQuoteCategory.type = "text";
  newQuoteCategory.placeholder = "Enter quote category";
  formContainer.appendChild(newQuoteCategory);

  const addQuoteButton = document.createElement("button");
  addQuoteButton.id = "addQuoteButton";
  addQuoteButton.textContent = "Add Quote";
  formContainer.appendChild(addQuoteButton);

  // Event listener for the "Add Quote" button
  addQuoteButton.addEventListener("click", addQuote);
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
