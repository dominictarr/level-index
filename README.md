# level-index

Create an index on some data.
For more complex use-cases, use [map-reduce](https://github.com/dominictarr/map-reduce)

## Example

point the dates of posts back to the the post.

``` js
var levelup  = require('levelup')
var sublevel = require('level-sublevel')
var index    = require('level-index')

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
```

And then query it with a normal read-stream.

``` js
var through = require('through')

postByDate.createReadStream({
    start : fromDate.toISOString(),
    end : (new Date()).toISOString()
})
.pipe(through(console.log))
```

A strong benefit of this module is that the indexes are generated
atomically (in a batch) with the triggering insert, so you can
request the index back immediately after it has been inserted.


## Gotchas

Use this module for things where the index doesn't change.
for example - the date a blog was posted on can never change.
how tall some one is can change, but their birthday can't change.

For indexes on changing data, use/write another module.

## License

MIT

