#!/usr/bin/env node
const http = require('http')
const fslib = require('./lib.js')

const port = 3000

const root = fslib.real('.')

http
    .createServer((req, res) => {
        res.write(root.resolve(req.body))
    })
    .listen(port, err => {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`server is listening on ${port}`)
    })