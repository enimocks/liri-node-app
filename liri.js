// required npm packages
var dotenv = require('dotenv').config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

// get twitter and spotify API key info
var keys = require('./keys.js');

// set liri's variables for commands/inputs using process.argv
var command = process.argv[2];
var input = process.argv[3];

// switch statement for liri's 4 possible commands, calling the functions pertaining to them
switch (command) {
  case 'my-tweets':
    twitter();
    break;

  case 'spotify-this-song':
    spotify(input);
    break;

  case 'movie-this':
    movie(input);
    break;

  case 'do-what-it-says':
    doIt();
    break;
}

// TWITTER FUNCTION
// ===============================================================================
function twitter() {
  // load twitter's API keys
  var client = new Twitter(keys.twitter);

  // Change the value of 'screen_name' to any Twitter username you want (w/o the @ in front!)
  var params = { screen_name: 'liri_ned', count: 20 }; // up to 20 Tweets (if I had that many in my account)

  // Access Twitter API
  client.get('statuses/user_timeline', params, function (error, tweets, response) {

    // Get i Tweets from the screen_name variable
    for (var i = 0; i < 9; i++) {
      if (!error) {
        console.log(
`
Tweet: ${tweets[i].text}
---------------------------------------------------
Created: ${tweets[i].created_at}\n` );
      } else {
        console.log(error);
      }
    }
    appendToLog(tweets);
  });

}

// SPOTIFY FUNCTION
// ===============================================================================
function spotify(input) {
  // load spotify's API keys
  var spotify = new Spotify(keys.spotify);

  // if no "input" arguement specified, default to The Sign by Ace of Base
  if (!input) {
    input = 'The Sign, Ace of Base';
  }

  // Query Spotify API - 1 time
  spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
    }
    // create songInfo variable to shorten path to information through data object
    var songInfo = data.tracks.items[0];
    // ES6 templating for logging 4 desired song details to console
    console.log(
`
=================================================
Song Name:     ${songInfo.name}
Artist(s):     ${songInfo.album.artists[0].name}
Album:         ${songInfo.album.name}
Song Preview:  ${songInfo.preview_url}
=================================================
`
    );
  appendToLog(songInfo);
  });

}

// OMDB FUNCTION
// ===============================================================================
function movie(input) {

  var nodeArgs = process.argv;

  // Create an empty variable for holding the movie name
  var input = "";

  // Loop through all the words in the node argument
  // And do a little for-loop magic to handle the inclusion of "+"s
  for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
      input = input + '+' + nodeArgs[i];
    }
    else {
      input += nodeArgs[i];
    }
  }

  if (input === '') {
    input = 'Mr. Nobody';
  }

  var queryURL = `http://www.omdbapi.com/?t=${input}&y=&plot=short&apikey=trilogy`

  request(queryURL, function (error, response, body) {
    console.log(queryURL)
    console.log(body)
    // If the request is successful
    if (!error && response.statusCode === 200) {

      var json = JSON.parse(body);

      console.log(
`
============================================================================
Release Year:          ${json.Year}
Title:                 ${json.Title}
IMDB Rating:           ${json.imdbRating}
RT Rating:             ${json.Ratings[1].Value}
Production Country:    ${json.Country}
Language:              ${json.Language}
Plot:                  ${json.Plot}
Actors:                ${json.Actors}
============================================================================
`
      );
      
    }
  appendToLog(body);
  });

}

// DO-WHAT-IT-SAYS function - read contents of random.txt and pass them into the command line as commands/input pairs
// ===============================================================================
function doIt() {
  fs.readFile('random.txt', 'utf8', function(error, data) {

    if (error) {
      console.log(error);
    }
// TODO: parse format of text in random.txt so it will be accepted as a command/input pair and allow for using other commands as well
    console.log(data)
    
    dataArr = data.split(',');

    console.log(dataArr[0]);

    input = dataArr[1];

    switch(dataArr[0]) { // get command in random.txt and compare with commands in switch cases
      case 'my-tweets':
      twitter();
      break;

      case 'spotify-this-song':
      spotify(input);
      break;

      case 'movie-this':
      movie(input);
      break;
    }
  appendToLog(data);
  });

}

function appendToLog(data) {
// We then store the textfile filename given to us from the command line
var textFile = "log.txt"

// We then append the contents "Hello Kitty" into the file
// If the file didn't exist then it gets created on the fly.
fs.appendFile(textFile, JSON.stringify(data, null, 2), function (err) {

  // If an error was experienced we say it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else {
    console.log("Content Added!");
  }

});

}
