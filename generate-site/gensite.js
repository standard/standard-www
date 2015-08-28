#!/usr/bin/env node

var join = require('path').join
var resolve = require('path').resolve
var sh = require('shelljs')
var stdPath = join('tmp', 'standard')
var awesomePath = join('tmp', 'awesome-standard')
var demoPath = join('tmp', 'standard-demo')
var mdPath = join('tmp', 'markdown')
var buildPath = 'build'

if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git')
  sh.exit(1)
}

cloneOrPull('https://github.com/feross/standard', stdPath)
cloneOrPull('https://github.com/feross/awesome-standard', awesomePath)
cloneOrPull('https://github.com/flet/standard-demo', demoPath)

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

sh.cp('-f', join('markdown', '*.md'), mdPath)
sh.cp('-f', join(stdPath, '*.md'), mdPath)
sh.cp('-f', join(awesomePath, 'README.md'), join(mdPath, 'awesome.md'))

// runs generate-md
sh.exec('npm run md')

// replace all RULES.md instances in links with rules.html
sh.sed('-i', /RULES\.md/g, 'rules.html', join(buildPath, 'README.html'))

// rename files to be internet friendly
sh.mv('-f', join(buildPath, 'README.html'), join(buildPath, 'index.html'))
sh.mv('-f', join(buildPath, 'RULES.html'), join(buildPath, 'rules.html'))

// once everything is built, copy it to root
sh.rm('../*.html')
sh.rm('-rf', '../assets')
sh.cp('-Rf', resolve(buildPath, '*'), resolve(__dirname, '..'))

// copy standard-demo bundle.js to root
sh.cp('-f', join(demoPath, 'bundle.js'), resolve(__dirname, '..'))
