module.exports = pullOrClone

var sh = require('shelljs')

function pullOrClone (repo, dir) {
  if (sh.test('-d', dir)) {
    sh.pushd(dir)
    sh.exec('git pull')
    sh.popd()
  } else {
    sh.exec('git clone ' + repo + ' ' + dir)
  }
}
