# progressive-web-app_react
Create lightning fast web apps with native power using React and Firebase

### Project Structure
- build
- public
  - assets
  - index.html
- scripts
  - copy_assets.js
- src
  - components
  - app.css
  - App.js
  - index.js
- package.json
- webpack.config.js
- webpack.config.prod.js

### Features
+ Webpack for bundling files
+ Webpack Dev Server for reloading the page when changes are made
+ Babel for transpiling ES6 to ES5
+ React Hot Loader for reloading JS while preserving the current state of the application without reloading the page itself
+ HtmlWebpackPlugin for minifying HTML
+ CSSLoader & StyleLoader for minifying CSS
+ UglifyJsPlugin for uglifying JS
+ FileLoader for copying assets required by JS code to build
+ Custom copy_assets.js script to copy all assets to build
+ ManifestPlugin for generating a list of assets and saving it to build
