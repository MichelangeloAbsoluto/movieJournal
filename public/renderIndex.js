let movieSearchButton = document.getElementById('movieSearchButton');
let movieSearchField = document.getElementById('movieSearchField');
let yearSearchField = document.getElementById('yearSearchField');
let searchResultDisplayBox = document.getElementById('searchResult');

let view = {
    renderGreeting : function(){
        let greetingBox = document.getElementById('greeting');
        greetingBox.textContent = 'bitch';
    },

    clearSearchResultDisplay : function(){
        searchResultDisplayBox.innerHTML = "";
        searchResultDisplayBox.classList.remove('selected');
    },
    
    displaySuccessMessage : function(){
        searchResultDisplayBox.textContent = "Movie submitted!";
        movieSearchField.value = "";
        yearSearchField.value = "";
        setTimeout(this.clearSearchResultDisplay, 1500);
    },

    clearJournalDisplay : function(){
        document.getElementById('journalEntryForm').style.display = "none";
        document.getElementById('journalEntry').value = "";
    },

    // Next edit, this should change the class from "Hidden" to "Visible".
    renderJournalDisplay : function(movie){
        document.getElementById('journalEntryTitle').textContent = movie.title;
        let journalBox = document.getElementById('journalEntryForm');
        journalBox.style.display = "block";
    },

    handleEmptySearch : function(){
        this.clearSearchResultDisplay();
        document.getElementById('searchResultMessageBox').textContent = "Could not find a movie matching that title";
    },

    toggleSelectedMovie : function(data){
        if (searchResultDisplayBox.classList.contains('selected')){
            searchResultDisplayBox.classList.remove('selected');
            this.clearJournalDisplay();
        } else {
            searchResultDisplayBox.classList.add('selected');
            this.renderJournalDisplay(data);
        }
    },

    createSelectMovieButton : function(data){
        let selectMovieButton = document.createElement('button');
        selectMovieButton.textContent = "Select";
        searchResultDisplayBox.appendChild(selectMovieButton);
        selectMovieButton.addEventListener("click", () => {
            this.toggleSelectedMovie(data);
        });
    },

    displaySearchResult : function(data){
        this.clearSearchResultDisplay();
        document.getElementById('searchResultMessageBox').textContent = "Not the movie you wanted? Narrow your search by adding the year."
    
        // Display all info from movie object
        let movieProperties = Object.entries(data);
        let movieInfoBox = document.createElement('div');
        for (let [key, value] of movieProperties) {
            let info = document.createElement('div');
            info.textContent = `${key}: ${value}`;
            movieInfoBox.appendChild(info);
        }
        searchResultDisplayBox.appendChild(movieInfoBox);        
        this.createSelectMovieButton(data);
    },

    getCheckedRatingRadioButton : function(){
        let checkedRadio = document.querySelector('input[name="userRating"]:checked');
        checkedRadio.checked = false;
        return checkedRadio.value;
    },

    getUserReview : function(){
        let userReviewText = document.getElementById('journalEntry').value;
        return userReviewText;
    }
    
}

export { view }