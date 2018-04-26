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

  var params = { screen_name: 'liri_ned', count: 20 };

  client.get('statuses/user_timeline', params, function (error, tweets, response) {

    for (var i = 0; i < 9; i++) {
      if (!error) {
        console.log( `Tweet: ${tweets[i].text}\n  Created: ${tweets[i].created_at}\n` );
      } else {
        console.log(error);
      }
    }

  });
}

// SPOTIFY FUNCTION
// ===============================================================================
function spotify(input) {
  // load spotify's API keys
  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var songInfo = data.tracks.items[0];

    console.log( `Song Name: ${songInfo.name}` );
    console.log( `Artist(s): ${songInfo.album.artists[0].name}` );
    console.log( `Album: ${songInfo.album.name}` );
    console.log( `Song Preview: ${songInfo.preview_url}` );
  });
}

// function movie(input) {

// }