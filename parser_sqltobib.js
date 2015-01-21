// sql-bib parser
// parse sql responce to bibtex format text and vice versa
// 
// target bibtex : JabRef
// target sql    : MySQL
//

// var sys = require('sys'),
var fs = require('fs'),
    bib_parser = require('bibtex-parser'),
    validator = require('validator');
    
module.exports = parse = {
    // parse responce Array from database into bibtex format text
    // this function requires callback function for processing parsed bibfile
    sqltobib: function(db_res, callback){
        var bibtext = '';
        
        db_res.forEach(function(v){
            var format;
            if(v.form==='journal'){
                format = '@article{';
            } else if(v.form==='oral'){
                format = '@inproceedings{';
            } else if(v.form==='poster'){
                format = '@inproceedings{';
            } else if(v.form==='book'){
                format = '@book';
            } else {
                format = '@misc{';
            }

            bibtext += format + v.bibkey;
            delete v.form;
            delete v.bibkey;

            for(key in v){
                bibtext += ',\n  ' + key + ' = {' + v[key] + '}';
            }
            
            bibtext += '\n}\n\n'
        });
        
        return callback(null, bibtext);
    },

    bibtosql: function(path_to_bibfile, last_id, callback){
        var db_req = [];

        var form = '',
            col = '',
            val = '';

        var entry = '',
            value = '';

        var bib = bib_parser(fs.readFileSync(path_to_bibfile).toString());
        var bibitem = {};
        var id = last_id;

        // keys in bib are bibkeys
        // bib.key.entryType reveals format (INPROCEEDINGS or ARTICLE or BOOK, etc) which is put after '@'
        for(var bibkey in bib){
            bibitem = bib[bibkey];
            // cannot insert entryType into database table
            form = bibitem.entryType;
            delete bibitem.entryType;

            col = '(id, bibkey';
            val = '(' + id + ', \'' + bibkey + '\'';
            for(var key in bibitem){
                col += ', ' + key;
                if(validator.isInt(bibitem[key])){
                    val += ', ' + bibitem[key];
                } else {
                    val += ', \'' + bibitem[key] + '\'';
                }
            }
            col += ')';
            val += ')';

            if(form==='ARTICLE'){
                entry = 'insert into list (language, form, id, year) values (\'english\', \'journal\', ' + id + ', ' + bibitem.YEAR + ')';
                value = 'insert into journal_papers ' + col + ' values ' + val;
                db_req.push(entry, value);
            } else {
                entry = 'insert into list (language, form, id, year) values (\'english\', \'poster\', ' + id + ', ' + bibitem.YEAR + ')';
                value = 'insert into conference_poster' + col + ' values ' + val;
                db_req.push(entry, value);
            }
            id++;
        }
        
        return callback(null, db_req);
    }
};

// main code
if(module.parent===null){
    var db = require('./mysql_handler');
    var db_publications = db.open('./config/mysql_connection.json');

    var db_res;
    db_publications.query('select form, bibkey, author, title, journal, volume, number, pages, doi, list.year from list inner join journal_papers on list.id=journal_papers.id',
                          function(err, res){
                              parse.sqltobib(res, function(err, bib){
                                  console.log(bib);
                              });
                          });
    // parse.sqltobib(db_res, function(err, bib){
    
    // });

    // var bibtext = './reference.bib';
    // parse.bibtosql(bibtext, function(err, sql){
    //     console.log(sql);
    // });


    // // 手入力！
    // var last_id = 10;

    // parse.bibtosql(bibtext, last_id, function(err, sql){
    //     console.log(sql);
    //     for(var i=0; i<sql.length; i++){
    //         db_publications.query(
    //             sql[i] + ';',
    //             function(err, res){
    //                 if(err){
    //                     console.log("err" + err);
    //                     return;
    //                 }
    //                 console.log(res.insertId);
    //             });
    //     }
    // });
                              
}
