var uuid = require('node-uuid'),
    os    = require('os');

module.exports = function (db, cb) {

    var length = 100 ;//ipsum.length;

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getIpsum(min,max) {
        return 'lorem ipsum\nlorem ipsum\nlorem ipsum\nlorem ipsum\n'
          + 'lorem ipsum\nlorem ipsum\n'
    /*    var l = getRandomInt(min,Math.min(max,length-1));
        var result = []
        for(var i = 0; i < l;i++) {
            result.push(ipsum[getRandomInt(min,length-1)])
        }
        return result.join(" ");*/
    }



    function randomDate(start, end) {
        return new Date(start + Math.ceil(Math.random() * (end - start))).toISOString();
    }

    console.log('creating data');
    var posts = [];
    var startDate = new Date(2010, 0, 1).getTime(), endDate = new Date().getTime();
    for(var i = 0; i< 2000; i++) {
        posts[i] = {
            type : 'put',
            key : uuid.v4(),
            value : {
                date : randomDate(startDate,endDate),
                subject : getIpsum(10,100),
                content : getIpsum(100,2000)
            }
        }
    }

    console.log("inserting data");
    var t = (new Date().getTime());

    db.batch(posts, function (err) {
        if (err) return console.log('Ooops!', err)
        console.log('Great success dear leader!')
        cb()
    })

    console.log('Data inserted in :' + ((new Date().getTime()) - t))

}
