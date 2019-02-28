const { readdir } = require("fs")
const { promisify } = require("util")
const { resolve } = require('path')

/**
 * Traverse the directory
 */
module.exports = traverse = async (dir, handler) => {
  const dirents = await promisify(readdir)(dir, { withFileTypes: true })

  return Promise.all(dirents.map(async dirent => {
    let shouldContinue = await handler(dirent, resolve(dir, dirent.name))

    if (shouldContinue && dirent.isDirectory()) {
      await traverse(resolve(dir, dirent.name), handler)
    }
  }))
}
