//var test     = require('tape')
var levelup  = require('levelup')
var sublevel = require('level-sublevel')
var index    = require('../')

var db = sublevel(levelup('/tmp/level-index-test', {encoding: 'json'}))

var postByDate = index(db, 
    'postByDate',  //name.
    function (key, value, emit) {
        var obj = value;
        console.log(obj.date);
        emit(obj.date, {
            id : key,
            subject : obj.subject,
            content : obj.content,
            date : obj.date
        });
    }
);

/// then later
function getPost(fromDate)  {
    postByDate.createReadStream({
        start : fromDate.toISOString(),
        end : (new Date()).toISOString()
    })
        .on('data', function(data){
            var value = data.value;
            console.log({
                id : data.key,
                date : new Date(parseInt(value.date)),
                subject : value.subject,
                content : value.content
            });
        })
}

 
require('./generate')(db, function () {
    getPost(new Date(2010,0,1));
})
 

