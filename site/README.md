### Types as Comments Microsite

This proposal has a language-user focused mini-site to describe the proposal. The content of the page is all in [`site.jsx`](./site.jsx). 

This package is a small static site generator, the full description of all of the components [is here](https://orta.io/notes/js/a-little-static-site) but there are no hidden abstractions, all of the build tools code is in this repo. 

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