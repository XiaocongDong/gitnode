const traverse = require('./path_traversal')
const fs = require('fs')
const path = require('path')
const util = require('util')

/**
 * This function is used to do something like cp -r source target
 * @param {String} source source path
 * @param {String} target target path
 * @returns {Promise}
 */
const recursiveCp = async (source, target) => {
  if (!fs.lstatSync(source).isDirectory() || !fs.lstatSync(target).isDirectory()) {
    throw new Error('source and target must be directory')
  }

  await traverse(source, async (dirent, pathName) => {
    const targetCurr = path.resolve(target, path.relative(source, pathName))
    
    if (dirent.isDirectory()) {
      await util.promisify(fs.mkdir)(targetCurr)
    } else {
      await asyncStreamCp(pathName, targetCurr)
    }

    return true
  })
}

const asyncStreamCp = async (source, target) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(source)
      .pipe(fs.createWriteStream(target))

    stream.on('end', resolve)
    stream.on('error', reject)
  })
}

module.exports = recursiveCp
