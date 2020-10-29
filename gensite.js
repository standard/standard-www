#!/usr/bin/env node
const fs = require('fs')
const GitHubSlugger = require('github-slugger')
const markybars = require('./lib/markybars.js')
const path = require('path')
const pullOrClone = require('./lib/pull-or-clone.js')
const join = path.join
const sh = require('shelljs')
const resolve = require('path').resolve
const { execSync } = require('child_process')
const hubdown = require('hubdown')

const awesomePath = join('tmp/awesome-standard')
const buildPath = 'build'
const mdPath = join('tmp/markdown')
const stdPath = join('tmp/standard')
const stdDocsPath = join('tmp/standard/docs')
const page = join('layout/page.html')
const demoPage = join('layout/demo.html')

const partials = {
  toc: join('layout/partials/toc.html'),
  scripts: join('layout/partials/scripts.html')
}

const slugger = new GitHubSlugger()

if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git')
  sh.exit(1)
}

run()

async function run () {
  pullOrClone('https://github.com/standard/standard', stdPath)
  pullOrClone('https://github.com/standard/awesome-standard', awesomePath)

  sh.rm('-rf', buildPath)
  sh.rm('-rf', mdPath)
  sh.rm('-rf', 'dist')

  sh.mkdir(buildPath)
  sh.mkdir(mdPath)

  sh.cp('-f', join('markdown/*.md'), mdPath)
  sh.cp('-f', join(stdPath, '*.md'), mdPath)
  sh.cp('-f', join(stdDocsPath, '*.md'), mdPath)
  sh.cp('-f', join(awesomePath, 'README.md'), join(mdPath, 'awesome.md'))
  const genPage = markybars.compile(page, partials)
  const genDemo = markybars.compile(demoPage, partials)

  const files = sh.ls(mdPath)

  for (const file of files) {
    const fileData = fs.readFileSync(join(mdPath, file), 'utf8')
    const data = (await hubdown(fileData, {
      highlight: {
        prefix: ''
      }
    })).content

    const name = path.parse(file).name
    const gen = name === 'demo' ? genDemo : genPage

    const htmlData = gen({ data, name: name.toLowerCase() })
    const fileName = slugger.slug(name) + '.html'

    fs.writeFileSync(join(buildPath, fileName), htmlData, 'utf8')
  }

  sh.find(buildPath)
    .filter(function (file) { return file.match(/\.html$/) })
    .forEach(function (f) {
      // replace all RULES.md instances in links with rules.html
      sh.sed('-i', /"(.*?)RULES(.*?)\.md/g, '"rules$2.html', f)

      sh.sed('-i', /"\.\.\/README.md/g, '"index.html', f)
      sh.sed('-i', /"(.*?)README(.*?)\.md/g, '"readme$2.html', f)

      sh.sed('-i', /"(docs\/|\.\.\/)?webstorm(.*?)\.md/g, '"webstorm$2.html', f)
    })

  // rename files to be internet friendly
  sh.mv('-f', join(buildPath, 'readme.html'), join(buildPath, 'index.html'))

  // once everything is built, copy it to dist
  sh.cp('-R', buildPath + '/', resolve(__dirname, 'dist'))

  // copy standard-demo bundle.js to dist
  execSync(`npx browserify -e ${require.resolve('standard-demo')} -o ${resolve(__dirname, 'dist', 'standard-demo.js')}`)

  // copy static to dist
  sh.cp('-R', 'static/*', resolve(__dirname, 'dist'))
  sh.cp('-R', 'static/.well-known', resolve(__dirname, 'dist'))

  // remove tmp dir
  sh.rm('-rf', 'tmp')
}
