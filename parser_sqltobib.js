// sql-bib parser
// parse sql responce to bibtex format text and vice versa
// 
// target bibtex : JabRef
// target sql    : MySQL
//

// var sys = require('sys'),
var fs = require('fs');
    
module.exports = parse = {
    // parse responce Array from database into bibtex format text
    // this function requires callback function for processing parsed bibfile
    sqltobib: function(db_res, callback){
        var bibtext = '';
        
        db_res.forEach(function(v){
            var form;
            if(v.format==='journal'){
                form = '@article{';
            } else if(v.format==='oral'){
                form = '@inproceedings{';
            } else if(v.format==='poster'){
                form = '@inproceedings{';
            } else if(v.format==='book'){
                form = '@book';
            } else {
                form = '@misc{';
            }

            bibtext += form + v.bibkey;
            delete v.format;
            delete v.bibkey;

            for(key in v){
                bibtext += ',\n  ' + key + ' = {' + v[key] + '}';
            }
            
            bibtext += '\n}\n\n'
        });
        
        return callback(null, bibtext);
    },

    bibtosql: function(path_to_bibfile, callback){
        var db_req;

        // fs.readFileSync(path_to_bibfile).toString().split('@').forEach(function(err, bib){
        //     bib.split('\n').forEach()
        // });

        // // values (1, 'Ikemoto, Shuhei and DallaLibera, Fabio and Hosoda, Koh and Ishiguro, Hiroshi', 'Spurious Correlation as an Approximation of the Mutual Information between Redundant Outputs and an Unknown Input', 'Communications in Nonlinear Science and Numerical Simulation', 19, 10, '3611-3616', 'ikemoto2014spurious', NULL, NULL);
        // return callback(null, db_req);
    }
};

// main code
if(module.parent===null){
    var db_res = fs.readFileSync();
    var bibtext = fs.readFileSync();
    parse.sqltobib(db_res);
    parse.bibtosql(bibtext);
}
