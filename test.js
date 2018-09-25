#!/usr/bin/env node
const fs = require('fs')
const http = require('http')
const fslib = require('./lib.js')

const demoDir = '/tmp/httpfsdemo'
try {
    fs.mkdirSync(demoDir)
} catch (ex) {}

const port = 3000
const root = fslib.real(demoDir)

http
    .createServer((req, res) => {
        let chunks = []
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => fslib.serve(root, Buffer.concat(chunks), result => {
            res.write(result)
            res.end()
        }, process.env.HTTPFS_DEBUG))
    })
    .listen(port, err => {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`server is listening on ${port}`)
    })