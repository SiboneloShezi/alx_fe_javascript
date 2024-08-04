const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Use your API endpoint

// Load quotes from local storage or initialize with default quotes
const storedQuotes = localStorage.getItem('quotes');
let quotes = storedQuotes ? JSON.parse(storedQuotes) : [];

// Fetch initial quotes from the server
async function fetchInitialQuotes() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    quotes = serverQuotes.map(quote => ({ text: quote.body, category: 'Server' })); // Assuming the server quotes have a 'body' property
    saveQuotes();
    showRandomQuote();
    populateCategoryFilter();
  } catch (error) {
    console.error('Error fetching initial quotes:', error);
  }
}

// Periodically fetch new quotes from the server
async function fetchNewQuotes() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    const newQuotes = serverQuotes.map(quote => ({ text: quote.body, category: 'Server' }));

    const newQuotesText = newQuotes.map(q => q.text);
    const localQuotesText = quotes.map(q => q.text);

    // Conflict resolution: Server's data takes precedence
    newQuotes.forEach(quote => {
      if (!localQuotesText.includes(quote.text)) {
        quotes.push(quote);
      }
    });

    saveQuotes();
    alert('Quotes have been updated from the server.');
    showRandomQuote();
    populateCategoryFilter();
  } catch (error) {
    console.error('Error fetching new quotes:', error);
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteFormContainer');

  const newQuoteText = document.createElement('input');
  newQuoteText.id = 'newQuoteText';
  newQuoteText.type = 'text';
  newQuoteText.placeholder = 'Enter a new quote';
  formContainer.appendChild(newQuoteText);

  const newQuoteCategory = document.createElement('input');
  newQuoteCategory.id = 'newQuoteCategory';
  newQuoteCategory.type = 'text';
  newQuoteCategory.placeholder = 'Enter quote category';
  formContainer.appendChild(newQuoteCategory);

  const addQuoteButton = document.createElement('button');
  addQuoteButton.id = 'addQuoteButton';
  addQuoteButton.textContent = 'Add Quote';
  formContainer.appendChild(addQuoteButton);

  // Event listener for the "Add Quote" button
  addQuoteButton.addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('New quote added successfully!');
    populateCategoryFilter();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to export quotes to JSON
function exportToJson() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    showRandomQuote(); // Update the displayed quote
    populateCategoryFilter();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to get unique categories from quotes
function getUniqueCategories() {
  const categories = quotes.map(quote => quote.category);
  return [...new Set(categories)];
}

// Function to populate the category filter dropdown
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Populate new options
  const categories = getUniqueCategories();
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  } else if (selectedCategory) {
    categoryFilter.value = selectedCategory;
  }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// Function to get filtered quotes based on the selected category
function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === selectedCategory);
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuoteButton').addEventListener('click', showRandomQuote);

// Event listener for the "Export Quotes to JSON" button
document.getElementById('exportButton').addEventListener('click', exportToJson);

// Initialize the page
createAddQuoteForm();
populateCategoryFilter();
showRandomQuote();
fetchInitialQuotes();
setInterval(fetchNewQuotes, 60000); // Fetch new quotes every minute
