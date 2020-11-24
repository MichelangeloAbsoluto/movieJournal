// Handles all requests from route "/movielog/v1/movies..."

// -- IMPORTS -- // 
const fetch = require('node-fetch');
const ErrorResponse = require('../utils/errorResponse');


// @Desc        Get a movie by title
// @Route       GET /movielog/v1/movies/:title
// @Route2      GET /movielog/v1/movies/:title/:year
// @Access      Public
exports.getMovie = async (req, res, next) => {
    try {
        let api_url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${req.params.title}`;

        if (req.params.year) {
            api_url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${req.params.title}&y=${req.params.year}`;
        }

        let apiResponse = await fetch(api_url);
        let apiData = await apiResponse.json();

        // Check if title exists
        if (apiData.Response === "False") {
            return res.status(404).json({ 
                success: false,
                message : "No results found for that title",
                data: {}
            });
        }

        // Deconstruct data into only desired data. 
        let movieData = {
            title: apiData.Title,
            year: apiData.Year,
            genre: apiData.Genre,
            director: apiData.Director,
            writer: apiData.Writer,
            cast: apiData.Actors,
            plot: apiData.Plot,
            metascore:  apiData.Metascore
        }

        // Create options for cookie. Data expires in 30 minutes. 
        let cookieOptions = {
            expires: new Date(Date.now() + 10 * 60 * 1000),
            httpOnly: true
        };
        
        // Return JSON
        res
            .status(200)
            .cookie('movie', movieData, cookieOptions)
            .json({
            success: true, 
            data: movieData
        });
    } catch (error) {
        next(error);
    }
}


