
var dotenv = require('dotenv').config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var keys = require('./keys.js');

var command = process.argv[2];
var input = process.argv[3];

