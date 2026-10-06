# Japanese Conjugation Practice
A web app for practicing Japanese verb and adjective conjugations with basic spaced repition. 

Original app - URL: http://baileysnyder.com/jconj/
New app - https://jpconj.catbro.net

## Build Setup
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:1234
$ npm run dev

# build for production
# minifies and outputs into /dist
$ npm run build
```

## To-do

- main.js refactor
    - break main.js into separate modules in order to facilitate adding future features
    - clean up any remaining extension work before merging to master
    - this refactor would make major changes to the original state from the baileysnyder repo

- adding additional features
    - the current state of the ast-epk repository includes plugin functionality, without integrating too deeply with main.js
        - this allows for backwards compatibility with the baileysnyder codebase
    - expanding a library of plugins that can be added or removed without code changes
        - currently requires changes to the plugins/index.js to activate or disable plugins