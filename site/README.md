### Types as Comments Microsite

This proposal has a language-user focused minisite to describe the proposal. The content of the page is all in [`site.jsx`](./site.jsx).

This package is a small static site generator, the full description of each component [is here](https://orta.io/notes/js/a-little-static-site) but there are no hidden abstractions, all of the build tools code lives in [`./src/server.js`](./src/server.js) in around 70 lines of well-commented code.

The package generates a single `index.html` file which requires no JavaScript on the users side.

### Working in this package

```sh
git clone [repo]
cd repo/site

npm install
npm start
```

This will open up a server on `http://localhost:8080` which will reload when you make changes inside the `src` directory.

### Building for Production

```s
npm run build
```

This does not include the `assets` directory, so a deploy process will want to copy those in. In this repo that happens in the GitHub action workflow.