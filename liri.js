require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var searchFor = process.argv.splice(3).join(" ");

switchCommand(command, searchFor)

function switchCommand(command, searchFor) {
    switch (command) {
        case "movie-this":
            return findMovie(searchFor)
        case "spotify-this-song":
            return spotifySong(searchFor)
        case "concert-this":
            return goConcert(searchFor)
        case "do-what-it-says":
            return justDoIt()
    }
}

function returnIndex(array, song) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name.toLowerCase() === song.toLowerCase()) {
            return i
        }
    }
    return 0
}
function printSong(array, index) {
    console.log("-----------------------------------");
    // an artist
    console.log("Artist - '" + array[index].artists[0].name + "'")
    console.log("-----------------------------------");
    // album
    console.log("Album '" + array[index].album.name + "'")
    console.log("-----------------------------------");
    // song full name
    console.log("Song - '" + array[index].name + "'")
    console.log("-----------------------------------");
    // a link on Spotify
    console.log("Link on Spotify(song) '" + array[index].external_urls.spotify + "'")
    console.log("-----------------------------------");
}

function spotifySong(song) {
    if (song.length === 0) {
        song = "The Sign"
    }
    writeLog("spotify-this-song", song)

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var index = returnIndex(data.tracks.items, song)
        console.log("index: ", index)
        printSong(data.tracks.items, index)

    });
}
function findMovie(movieName) {
    if (movieName.length === 0) {
        movieName = 'Mr. Nobody.'
    }
    writeLog('movie-this', movieName)

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            console.log("-----------------------------------");
            //    * Title of the movie.
            console.log("Title: " + response.data.Title)
            console.log("-----------------------------------");
            //    * Year the movie came out.
            console.log("Release Year: " + response.data.Year);
            console.log("-----------------------------------");
            //    * IMDB Rating of the movie.
            console.log("IMDB Rating: " + response.data.Ratings[0].Value)
            console.log("-----------------------------------");
            //    * Rotten Tomatoes Rating of the movie.
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
            console.log("-----------------------------------");
            //    * Country where the movie was produced.
            console.log("Country: " + response.data.Country);
            console.log("-----------------------------------");
            //    * Language of the movie.
            console.log("Language: " + response.data.Language);
            console.log("-----------------------------------");
            //    * Plot of the movie.
            console.log("Plot: " + response.data.Plot);
            console.log("-----------------------------------");
            //    * Actors in the movie.
            console.log("Actors: " + response.data.Actors)
            console.log("-----------------------------------");

        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });


}

function goConcert(artist) {
    if (!artist) {
        artist = 'Lady Gaga'
    }
    writeLog('concert-this', artist)

    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(
        function (response) {
            console.log("-----------------------------------");

            for (var i = 0; i < response.data.length; i++) {

                console.log((i + 1) + ":" + response.data[i].venue.country)
                console.log(response.data[i].venue.city)
                console.log(response.data[i].venue.name)
                var data = response.data[i].datetime;

                console.log(moment(data).format('L'))
                console.log("-----------------------------------");
            }


        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });


}

function justDoIt() {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Break the string down by comma separation and store the contents into the output array.

        var output = data.split(",");

        for (var i = 0; i < output.length; i++) {
            if (i % 2 === 0) {
                var myCommand = output[i];
                var mySearch = output[i + 1];
                switchCommand(myCommand, mySearch);
            }
        }
    });
}

function writeLog(command, search) {
    const text = command + "," + search + ","
    fs.appendFile("log.txt", text, function (err) {

        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }

        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Content Added!");
        }

    });
}