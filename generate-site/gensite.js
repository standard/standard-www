#!/usr/bin/env node

var path = require('path')
var sh = require('shelljs')
var stdPath = path.join('tmp', 'standard')
var awesomePath = path.join('tmp', 'awesome-standard')
var mdPath = path.join('tmp', 'markdown')
var buildPath = 'build'

if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git')
  sh.exit(1)
}

cloneOrPull('https://github.com/feross/standard', stdPath)
cloneOrPull('https://github.com/feross/awesome-standard', awesomePath)

function cloneOrPull (repo, dir) {
  if (sh.test('-d', dir)) {
    sh.pushd(dir)
    sh.exec('git pull')
    sh.popd()
  } else {
    sh.exec('git clone ' + repo + ' ' + dir)
  }
}

sh.rm('-rf', buildPath)
sh.rm('-rf', mdPath)

sh.mkdir(buildPath)
sh.mkdir(mdPath)
sh.cp('-f', path.join(stdPath, '*.md'), mdPath)
sh.cp('-f', path.join(awesomePath, 'README.md'), path.join(mdPath, 'awesome.md'))

// runs generate-md
sh.exec('npm run md')

// replace all RULES.md instances in links with rules.html
sh.sed('-i', /RULES\.md/g, 'rules.html', path.join(buildPath, 'README.html'))

// rename files to be internet friendly
sh.mv('-f', path.join(buildPath, 'README.html'), path.join(buildPath, 'index.html'))
sh.mv('-f', path.join(buildPath, 'RULES.html'), path.join(buildPath, 'rules.html'))

// once everything is built, copy it to root
sh.rm('../*.html')
sh.rm('-rf', '../assets')
sh.cp('-Rf', path.resolve(buildPath, '*'), path.resolve(__dirname, '..'))
