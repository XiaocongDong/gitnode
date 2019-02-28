const findParentDir = require('find-parent-dir')
const path = require('path')

const ROOT = findParentDir.sync(process.cwd(), '.git')
const GIT_ROOT = ROOT && path.resolve(ROOT, '.git')

module.exports.ROOT = ROOT
module.exports.GIT_ROOT = GIT_ROOT
