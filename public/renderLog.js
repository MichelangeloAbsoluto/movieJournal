
let view = {
    
    displaySearchResults : function(data){
        let displayDiv = document.getElementById('searchResultsArea');
        displayDiv.innerHTML = "";
    
        if (data === null) {
            displayDiv.textContent = "Sorry no movie found matching that title";
            return; 
        } else if (data instanceof Array === false) {
            data = [data];
        }
    
        for (let movie of data) {
            let entries = Object.entries(movie);
            let movieDiv = document.createElement('div');
            movieDiv.classList = "movieDiv";
            for (let [key, value] of entries) {
                let info = document.createElement('div');
                info.textContent = `${key} : ${value}`;
                movieDiv.appendChild(info)
            }
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'delete';
            deleteButton.addEventListener('click', this.deleteEntry(movie._id));
            movieDiv.appendChild(deleteButton);
            displayDiv.appendChild(movieDiv);
        }
    },
    
    // DISPLAY MOVIE INFO
    displayMovieInfo : function(movie){
        let displayDiv = document.getElementById('allEntries');
        let movieDiv = document.createElement('div');
        movieDiv.classList = "movieDiv";

        let props = Object.entries(movie);
        for (let [key, value] of props) {
            let infoBox = document.createElement('div');
            infoBox.textContent = `${key} : ${value}`
            movieDiv.appendChild(infoBox);
        }
        displayDiv.appendChild(movieDiv);
    },

    // RENDER Header for all entries.
    renderHeader : function(totalNumberOfEntries) {
        let displayCountHeader = document.createElement('div');
        displayCountHeader.textContent = `Showing ${totalNumberOfEntries} of ${totalNumberOfEntries} total.`;
        let displayDiv = document.getElementById('allEntries');
        displayDiv.appendChild(displayCountHeader);

        // Will have buttons to see more of the entries. 
    },

    // GET AND RENDER ALL ENTRIES
    renderEntries : async function(allMoviesEntries){
        this.renderHeader(allMoviesEntries.length);
        
        for (var i = 0; i < allMoviesEntries.length && i < 20; i++) {
            this.displayMovieInfo(allMoviesEntries[i]);
        }
    },

    deleteEntry : async function(movieId){
        let requestURL = `movielog/v1/entries/${movieId}`;
        let requestOptions = {
            method: 'DELETE'
        }
        console.log(`Deleting entry ${movieId}`);
        await fetch(requestURL, requestOptions);
    }


}

export { view }