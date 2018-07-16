#!/usr/bin/env node
const http = require('http')
const fslib = require('./lib.js')

const port = 3000

const root = fslib.vDir({
    a: fslib.vDir({
        'b.txt': fslib.vFile(Buffer.from('Das ist...'))
    }),
    'c.txt': fslib.vFile(Buffer.from('... großartig!'))
})

http
    .createServer((req, res) => {
        let chunks = []
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => fslib.serve(root, Buffer.concat(chunks), result => {
            res.write(result)
            res.end()
        }));
    })
    .listen(port, err => {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`server is listening on ${port}`)
    })