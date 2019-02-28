const path = require('path')
const fs = require('fs')
const objects = require('./utils/objects')

exports.command = 'add <file> [files...]'

exports.describe = 'Add file contents to the index'

exports.handler = async (argv) => {
  const cwd = process.cwd()
  const files = argv.files.concat(argv.file).map(file => path.resolve(cwd, file))

  files.forEach(async file => {
    let object = await objects.newBlobObject(file)
    // console.log(object)
    await objects.saveBlob(object)
  })
}
