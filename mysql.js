// management software for lab publications
// store publication data into mysql database
// 	and tranform into bibtex format
// 	and provide some ui
// 
// reference:
// 	http://sakuratan.biz/archives/3101
//

// hostname and port of server
var HOSTNAME = 'localhost',
    PORT = 8000;

// MySQL Database: name, username and password
var DBNAME = 'publications',
    DBUSER = 'root',
    DBPASS = 'sql';

var sys = reuire('sys'),
    express = require('express'),
    app = express(),
    mysql = require('mysql');


