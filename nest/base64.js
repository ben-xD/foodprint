// testing base64

const fs = require('fs')

const file = fs.readFileSync('/Users/Ben/Desktop/Logo.png')
fs.writeFileSync('/Users/Ben/Desktop/base64.txt', Buffer.from(file).toString('base64'))

const base64File = Buffer.from(file).toString('base64')


fs.writeFileSync('/Users/Ben/Desktop/Logo2.png', base64File, {
  encoding: 'base64'
})
