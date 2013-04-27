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
