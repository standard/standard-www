# standard-www [![travis][travis-image]][travis-url] [![javascript style guide][standard-image]][standard-url]

[travis-image]: https://img.shields.io/travis/standard/standard-www/master.svg
[travis-url]: https://travis-ci.org/standard/standard-www
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

https://standardjs.com

## Usage

This repository is used to generate a website with convenience for [standard](https://github.com/standard/standard)

### How to Generate a site and deploy it to `gh-pages`
```bash
git clone https://github.com/flet/standard-www
./trigger.sh
```

### Building without deploy
```bash
cd generate-site
npm install
npm start
```

### Notes
- The navigation menu is stored in [layout/partials/toc.html](layout/partials/toc.html)
- A custom layout is being used. The layout is based on [witex](https://github.com/AndrewBelt/WiTeX) (came from `--export` on `generate-md`)
- `gensite.js` is where things get kicked off
  - First it will clone `standard` and `awesome-standard` and nab the *.md files.
  - Next, it will use [generate-md](https://github.com/mixu/markdown-styles) to create a site.
  - Finally there is some file renaming and link re-writing that happens.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[ISC](LICENSE.md)
