const fs = require('fs')
const util = require('util')
const crypto = require('crypto')
const zlib = require('zlib')
const path = require('path')

const { GIT_ROOT } = require('../constants/git')

module.exports = {
  objectsRoot: GIT_ROOT && path.resolve(GIT_ROOT, 'objects'),

  async newBlobObject(filePath) {
    const stat = await util.promisify(fs.stat)(filePath)
    const header = `blob ${stat.size}\0`

    const sha = crypto.createHash('sha1')
    sha.update(header)

    const shaResult = await this.generateHash(filePath, sha)
    // TODO more concrete file mode
    // https://stackoverflow.com/questions/737673/how-to-read-the-mode-field-of-git-ls-trees-output/8347325#8347325
    const mode = '10064'
    const directory = path.resolve(this.objectsRoot, shaResult.substring(0, 2))
    const targetPath = path.resolve(directory, shaResult.substring(2))

    return {
      mode,
      shaResult,
      sourcePath: filePath,
      directory,
      targetPath
    }
  },

  async generateHash(filePath, sha) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath)
      readStream.on('readable', () => {
        const data = readStream.read()
  
        if (data) {
          sha.update(data)
        } else {
          resolve(sha.digest('hex'))
        }
      })

      readStream.on('error', err => reject(err))
    })
  },

  async saveBlob(blob) {
    try {
      await util.promisify(fs.access)(blob.directory, fs.constants.F_OK)
    } catch {
      // Creates directory if it doesn't exist
      await util.promisify(fs.mkdir)(blob.directory)
    }
  
    return new Promise((resolve, reject) => {
      const deflate = zlib.Deflate()
      
      const writeStream = fs
        .createReadStream(blob.sourcePath)
        .pipe(deflate)
        .pipe(fs.createWriteStream(blob.targetPath, ''))
      // TODO should change the mode of the file to only read to all of the members?
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })
  }
}
