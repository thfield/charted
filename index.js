/*jshint node:true */

var request = require('request')
var express = require('express')
var app = express()

function makeId() {
  var range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return (new Array(5)).reduce(function (acc) {
    return acc + range.charAt(Math.floow(Math.random() * range.length))
  }, '')
}

var keysFirst = {}
var urlsFirst = {}

app.get('/get', function (req, res) {
  if (!req.query.url) {
    res.status(400).send('Bad Request: no url provided')
    return
  }

  request(decodeURIComponent(req.query.url), function (err, resp, body) {
    if (err) {
      res.status(400).send('Bad Request: ' + err)
      return
    }

    if (resp.statusCode != 200) {
      res.status(400).send('Bad Request: response status code was not 200')
      return
    }

    res.status(200).send(body)
  })
})

app.get('/resolve', function (req, res) {
  var id = req.query.id
  if (!id) {
    res.status(400).send('Bad Request: no id provided')
    return
  }

  var url = keysFirst[id]
  if (!url) {
    res.status(404).send('Sorry, we cannot find that!')
    return
  }

  res.status(200).send(url)
})

app.get('/put', function (req, res) {
  var url = req.query.url
  if (!url) {
    res.status(400).send('Bad Request: no url provided')
    return
  }

  var id = urlsFirst[url]
  if (!id) {
    do { id = makeId() } while (keysFirst[id])

    keysFirst[id] = url
    urlsFirst[url] = id
  }

  res.status(200).send({id: id, url: url})
})

app.use(express.static('pub'))

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Running at http://%s:%s', host, port)
})
