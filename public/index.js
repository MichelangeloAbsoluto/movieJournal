// TO DO NEXT VERSION:
// 1. Find way to handle errors or empty results. Currently, it checks if the status was a 500.
// 2. Find a better way to store the movie JSON object.

// How add things to req.body instead of as search params?


import { view } from './renderIndex.js';

// -- Variables for HTML elements -- // 
let searchedMovie;

let searchMovie = async function(){
    // Grab search parameters
    let titleToSearch = document.getElementById('movieSearchField').value;
    let yearToSearch = document.getElementById('yearSearchField').value;

    // Make API request
    let requestURL = yearToSearch ? `/movielog/v1/movies/:${titleToSearch}/:${yearToSearch}` : `/movielog/v1/movies/:${titleToSearch}`;
    console.log(requestURL);
    let movieResponse = await fetch(requestURL);
    
    // Handle errors
    if (movieResponse.status === 500 || movieResponse.status === 404) {
        view.handleEmptySearch();
        return; 
    }

    // ELSE Display search results
    let movie = await movieResponse.json();
    view.displaySearchResult(movie.data);
    view.clearJournalDisplay();
    searchedMovie = movie.data;
}

let submitJournalEntry = function(){
    let movieToSubmit = {
        title: searchedMovie.title,
        year: searchedMovie.year,
        director: searchedMovie.director,
        plot: searchedMovie.plot,
        cast: searchedMovie.cast,
        genre: searchedMovie.genre,
        metascore: searchedMovie.metascore,
        userRating: view.getCheckedRatingRadioButton(),
        review: view.getUserReview()
    }

    let postRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieToSubmit)
    };

    fetch('/movielog/v1/entries', postRequestOptions)
        .then( response => console.log(response));
    view.clearJournalDisplay();
    view.clearSearchResultDisplay();
    view.displaySuccessMessage();
}

document.getElementById('movieSearchButton').addEventListener("click", searchMovie);
document.getElementById('journalSubmitButton').addEventListener("click", submitJournalEntry);
view.renderGreeting();

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



