module.exports = function (db, indexDb, map) {
  
  if('string' === typeof indexDb)
    indexDb = db.sublevel(indexDb)

  if('function' !== typeof map)
    throw new Error('must provide map function')

  db.pre(function (op, add) {
    var async = false
    var key = map(op.key, op.value, function (key, value) {
      if(async)
        return console.error('level-index#map *must* be sync!')
      if(key && value)
        add({key: key, value: value, type: 'put', prefix: indexDb})
      else
        add({key: key, value: op.value, type: 'put', prefix: indexDb})
    })
    async = true
  })
  return indexDb
}

//hmm, if the original object is deleted, probably want to delete the index.
//but we'd need to map the indexes back to the original for that...
//
//also, it might be good to map the index to the original key,
//and then retrive it with a lookup. this might make cleanup simpler...
//
//Actually, then you could check that a response is still valid on read,
//instead of clearing it on write...
//and also clean it up in a periodic batch job...
