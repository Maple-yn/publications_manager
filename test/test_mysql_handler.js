// test code for mysql_handler.js module
// 
// reference:
// 	http://yume-build.com/blog/archives/307
//

var db = require('../mysql_handler');

describe('DB', function(){
    var db_publications;
    var dt = (new Date()).toFormat('YYYY-MM-DD HH24:MI:SS');
    var idx = {
        id      : dt,
        lang    : 'japanese',
        review  : 'unreviewed',
        form    : 'journal',
        mm      : 'default',
        yy      : 2015
    };
    var jnl = {
        id      : dt,
        authors :'Kazuya Yanagisawa,Ryo Sakai',
        title   :'testing publication managers',
        jnl     :'Jounal of Hosoda lab',
        vol     :1,
        no      :1,
        pp      :23,
        pp_e    :25,
        doi     :'default',
        abst    :'default'
    };

    before(function(done){
        db_publications = db.open('./config/mysql_connection.json');
        var insert_idx = "insert into publications_list values(" +
                "\'" + idx.id + "\'" + "," +
                "\'" + idx.lang + "\'" + "," +
                "\'" + idx.review +"\'" +  "," +
                "\'" + idx.form + "\'" + "," +
                idx.mm + "," +
                idx.yy + ")";
        db_publications.query(insert_idx, function(err, res){
            if(err) console.log(err);
        });
        var insert_jnl = "insert into journal_papers values (" +
                "\'" + jnl.id + "\'" + "," +
                "\'" + jnl.authors + "\'," +
                "\'" + jnl.title + "\'" + "," +
                "\'" + jnl.jnl + "\'" + "," +
                jnl.vol + "," +
                jnl.no + "," +
                jnl.pp + "," +
                jnl.pp_e + "," +
                jnl.doi + "," +
                "\'" + jnl.abst + "\'" + ")";
        db_publications.query(insert_jnl, function(err, res){
            if(err) console.log(err);
        });
        done();
    });

    describe('connection', function(){
        it('should get user data.', function(done){
            db_publications.query(
                "select * from publications_list inner join journal_papers on publications_list.id = journal_papers.id where journal_papers.vol = 19",
                function(err, res){
                    if(err){
                        console.log("err" + err);
                        done(err);
                        return;
                        }
                    res.length.should.equal(1);
                    res[0].no.should.equal(10);
                    done(res);
                    return;
                });
            done();
        });
    });

    
});
