rm -rf tmp
mkdir -p tmp/markdown

git clone --depth 1 https://github.com/standard/standard tmp/standard
git clone --depth 1 https://github.com/standard/awesome-standard tmp/awesome-standard
git clone --depth 1 https://github.com/standard/standard-demo tmp/standard-demo

cp -a favicons dist

cp -f markdown/*.md tmp/markdown
cp -f tmp/standard/*.md tmp/markdown
cp -af tmp/standard/docs tmp/markdown/docs
cp -f tmp/awesome-standard/README.md tmp/markdown/awesome.md

sitedown tmp/markdown --pretty false --build dist --layout layout/layout.html --github-headings
