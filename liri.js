// require npm packages
var dotenv = require('dotenv').config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var keys = require('./keys.js');

var command = process.argv[2];
var input = process.argv[3];

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

function twitter() {

  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: 'liri_ned',
    count: 20
  };

  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    for (var i = 0; i < 2; i++) {
      if (!error) {
        console.log(`Tweet: ${tweets[i].text} -- Created at: ${tweets[i].created_at}`);
      } else {
        console.log(error);
      }
    }
  });
}

// SPOTIFY
// =============================================================
function spotify(input) {
  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var songInfo = data.tracks.items[0];
    console.log(`Artist(s): ${songInfo.album.artists[0].name}`);
    console.log(`Album: ${songInfo.album.name}`);
  });
}

// function movie(input) {

// }