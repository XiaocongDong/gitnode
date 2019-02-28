const path = require('path')
const fs = require('fs')
const recursiveCp = require('./utils/recursive_copy')

exports.command = 'init'

exports.describe = 'Create an empty Git repository or reinitialize an existing one'

exports.handler = () => {
  const initTemplateFolder = path.resolve(
    __dirname,
    '..',
    'templates',
    'init'
  )
    
  const gitRepo = path.resolve(process.cwd(), '.git')
  
  if (fs.existsSync(gitRepo) && fs.lstatSync(gitRepo).isDirectory()) {
    throw new Error('This repo has already init')
  }
  
  fs.mkdirSync(gitRepo)

  recursiveCp(initTemplateFolder, gitRepo)
}
