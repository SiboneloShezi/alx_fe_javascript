const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Use your API endpoint

// Load quotes from local storage or initialize with default quotes
const storedQuotes = localStorage.getItem('quotes');
let quotes = storedQuotes ? JSON.parse(storedQuotes) : [];

// Fetch initial quotes from the server
async function fetchInitialQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    quotes = serverQuotes.map(quote => ({ text: quote.body, category: 'Server' })); // Assuming the server quotes have a 'body' property
    saveQuotes();
    showRandomQuote();
    populateCategories();
  } catch (error) {
    console.error('Error fetching initial quotes:', error);
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quote)
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

// Function to sync quotes with the server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
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
    populateCategories();
  } catch (error) {
    console.error('Error syncing quotes:', error);
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
async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    
    try {
      const serverResponse = await postQuoteToServer(newQuote);
      newQuote.id = serverResponse.id; // Assuming the server response includes an ID
      quotes.push(newQuote);
      saveQuotes();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added successfully!');
      populateCategories();
    } catch (error) {
      console.error('Error adding new quote:', error);
      alert('Failed to add new quote. Please try again.');
    }
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
    populateCategories();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to get unique categories from quotes
function getUniqueCategories() {
  const categories = quotes.map(quote => quote.category);
  return [...new Set(categories)];
}

// Function to populate the category filter dropdown
function populateCategories() {
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

// Event listener for the "Import Quotes from JSON" input
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize the page
createAddQuoteForm();
populateCategories();
showRandomQuote();
fetchInitialQuotes();
setInterval(syncQuotes, 60000); // Sync quotes every minute
