// create a single mysql database connection
// 	for management software for lab publications
// 
// reference:
// 	http://yume-build.com/blog/archives/307
//

// import module
var mysql = require('mysql'),
    fs = require('fs');
// variables
var dir = __dirname,
    env = process.env.NODE_ENV || 'development';


module.exports = connection = {
    open: function(config_filename){
	if(this.connection){
	    console.log('One MySQL connection already exists.');
	    return this.connection;
	}

	try{
	    raw_config = fs.readFileSync(config_filename);
	} catch(e) {
	    console.log('Cannot open file:' + config_filename);
	    process.exit(1);
	}

	config = JSON.parse(raw_config)[env];
	return this.connection = mysql.createConnection(config);
    },

    close: function(){
	this.connection.end();
	this.connection = null;
	return;
    }
};

// main code
if(module.parent===null){
    var config_filename = dir + '/config/mysql_connection.json';
    connection.open(config_filename);
}
