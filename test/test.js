var test     = require('tape')
var levelup  = require('level-test')()
var sublevel = require('level-sublevel')
var index    = require('../')

test('simple - retrive by times', function (t) {

var db = sublevel(levelup('/tmp/level-index-test', {encoding: 'json'}))

var postByDate = index(db, 'postByDate',
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
function getPost(fromDate, cb)  {
  var a = []
  postByDate.createReadStream({
      start : fromDate.toISOString(),
      end : (new Date()).toISOString()
  })
  .on('data', function(data){
    a.push(data)
  })
  .on('end', function () {
    cb(null, a)
  })
}

require('./generate')(db, function () {
    var start = new Date(2012,0,1)
    getPost(start, function (err, ary) {
      console.log(ary)
      ary.forEach(function (data) {
        t.ok(data.key > start.toISOString())
      })
      t.end()
    });
})


})
