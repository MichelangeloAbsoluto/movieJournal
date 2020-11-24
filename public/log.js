// INDEX.JS:

// TO DO: 

// Add ability to edit ... button hits Route for a PUT request /movielog/v1/entries/:id
// It should let you type new info into div. Saving should pull all the info and put it into the request.body

// Add ability to delete ... button hits Route for a DELETE request /movielog/v1/entries/:id
// It should delete entry and make the div disappear. 

// Add better error handling for bad responses. 

// Add ability to search by rating ... appends 'rating=gte${rating}' to fetch URL.

// Add Pagination
// It should default display a grid of 20 movies per page. 
// It should have a 'next' button that renders the next 20.

 
import { view } from './renderLog.js';

// SEARCH BY MOVIE
let getSearchResultsFromTitle = async function(){
    let title = document.getElementById('titleSearchField').value;
    title = title.toLowerCase().trim();
    let fetchURL = `/movielog/v1/entries?title=${title}`;

    let searchResult = await fetch(fetchURL);
    let searchResultJSON = await searchResult.json();
    view.displaySearchResults(searchResultJSON.data);
}

// SEARCH BY DIRECTOR 
let getSearchResultsFromDirector = async function(){
    let director = document.getElementById('directorSearchField').value;
    director = director.toLowerCase().trim();
    let fetchURL = `/movielog/v1/entries?director=${director}`

    let searchResult = await fetch(fetchURL);
    let searchResultJSON = await searchResult.json();
    view.displaySearchResults(searchResultJSON.data);
}

// GET ALL MOVIES 
let getAllEntries = async function(){
    let fetchURL = '/movielog/v1/entries';
    let allEntries = await fetch(fetchURL);
    let allEntriesJSON = await allEntries.json();
    return allEntriesJSON.data;
}

// Add event listeners
document.getElementById('titleSearchSubmit').addEventListener('click', getSearchResultsFromTitle);
document.getElementById('directorSearchSubmit').addEventListener('click', getSearchResultsFromDirector);

let loginUser = async function() {
    let loginCredentials = {
        email: 'bill@gmail.com',
        password: 'password'
    };
    
    let postRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials)
    }

    await fetch('/movielog/v1/auth/login', postRequestOptions);
}

loginUser();

// Auto-populate page with entries.
getAllEntries()
    .then(results => view.renderEntries(results));

