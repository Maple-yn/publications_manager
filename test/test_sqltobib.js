// test code for sqltobib.js module
// parse sql result to bibtex format
//
// reference:
// 	http://yume-build.com/blog/archives/307
//

var db = require('../mysql_handler'),
    bib_parse = require('../parser_sqltobib.js');

describe('sql to bib', function(){
    var db_publications;

    before(function(done){
        db_publications = db.open('./config/mysql_connection.json');
        done();
    });

    describe('parse bib to sql', function(){
        it('should complete insertions.', function(done){
            bib_parse.bibtosql('./reference.bib', function(err, sql){
                for(var i=0; i<sql.length; i++){
                    db_publications.query(
                        sql[i] + ';',
                        function(err, res){
                            if(err){
                                console.log("err" + err);
                                done(err);
                                return;
                            }
                            console.log(res.insertId);
                        });
                }
            });
            done();
        });
    });

    
});
