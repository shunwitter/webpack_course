# Section 2

このブランチの前に行ったこと
--------------------------------

### 設定ファイルなしでのバンドル

```shell
% npx webpack --mode=development
```

- デフォルトのエントリーポイントは `index.js`
- デフォルトのアウトプットは `dist/main.js`

### 中身の確認

```shell
% code dist/.main.js
```

　　
　　

このブランチで行ったこと
--------------------------------

### モードを変更して実行

```shell
% npx webpack --mode=production
```

### ビルドされたJSを使ってみる

#### HTMLファイル作成

```shell
% vim ./dist/index.html
```

```html
<!-- index.js -->
<script src="./main.js"></script>
```

#### ブラウザで確認

```shell
% open -a "Google Chrome" dist/index.html
```

```
// Chrome Console
This is index.js
main.js:1 this is module
```

### 設定ファイルを使用してビルドする

```shell
% vim webpack.config.js
```

```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist/main.js',
  },
};
```

### この状態でビルドするとエラー

```shell
% npx webpack --mode=development

Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.
 - configuration.output.path: The provided value "./dist/main.js" is not an absolute path!
   -> The output directory as **absolute path** (required).
```

#### output.path は絶対パスを指定する

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
  },
};
```

#### 出力されるファイル名を変更してみる

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js', // テストした後は main.js 戻す
  },
};
```

### スタイルシートを読み込んで見る

```shell
% vim ./src/modules/my.css
```

```css
/* ./src/modules/my.css */
body {
  color: lightblue;
}
```

```js
// ./src/index.js
import my from './modules/my';
import './modules/my.css'; // add

console.log('This is index.js');
my();
```

#### この状態でビルドするとエラー

```shell
% npx webpack --mode=development

ERROR in ./src/modules/my.css 1:5
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body {
|   color: lightblue;
| }
```

#### ローダーをインストールする

Webpackはjavascript。
Javascript以外のファイルを読み込もうとするとエラーになる。
読み込めるようにするにはローダーと呼ばれるライブラリが必要。

- [css-loader](https://github.com/webpack-contrib/css-loader)
- [style-loader](https://github.com/webpack-contrib/style-loader)

```shell
% npm view css-loader
# latest: 3.4.2

% npm view style-loader
# latest: 1.1.3

% npm install --save-dev css-loader@3.4.2 style-loader@1.1.3
```

#### 確認

```shell
% vim package.json
```

```json
{
  "devDependencies": {
    "css-loader": "^3.4.2",
    "style-loader": "^1.1.3",
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10"
  }
}
```

#### --save / --save-dev / オプションなしの違い

- `--save dependencies` を付けると `dependencies` に入る
- `--save-dev` を付けると `devDependencies` に入る

コードをパッケージ化して公開する時に影響する。
dependenciesは `npm install` の際に一緒にインストールされる。
devDependenciesは `npm install` してもインストールされない。

今回は自分用のプロジェクトであり、パッケージ化しないので、すべて `devDependencies` で良い。
もしモジュールとして他の人が使えるパッケージにしたい、という場合は `dependencies` を使っていく。

### ローダーを使う

```shell
vim webpack.config.js
```

```js
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    ...
  },
  // moduleを追加
  module: {
    rules: [
      {
        test: /\.css/,
        use: [{
          loader: 'css-loader',
        }],
      },
    ],
  },
};
```

- moduleを追加してruleを設定する。
- ruleは複数設定できるので配列で指定する。=> `rules`
- `test:`はどのファイルが対象になるのかを、正規表現で記述。
- `user:`はどのローダーを使用するかを設定します。

```shell
% npx webpack --mode=development
```

#### 動作確認

index.html をブラウザで確認。正常に動作しているはず。

#### main.js を確認してみる

```shell
% vim ./dist/main.js

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \"body {\\n  color: lightblue;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/modules/my.css?");

# ↑
# CSSらしき記述は見つかった
#
```

```js
// evalの次に下のコマンドを入れてみる
console.log(exports[0][1]);
```

index.html を確認するとコンソールログが出力されている。

```shell
% open -a "Google Chrome" dist/index.html
```

```
# スタイルが出力された
body {
  color: lightblue;
}

index.js:8 This is index.js
my.js:3 this is module
```

しかしスタイルが反映されていない。
CSSは読み込まれているが、使用されていない状態。

### style-loader を使う

```js
// webpack.config.js
        use: [
          {
            loader: 'style-loader',
          },
          // 追記
          {
            loader: 'css-loader',
          }
        ],
```

再度ビルドする。

```shell
% npx webpack --mode=development
```

#### main.js を確認してみる

```shell
% vim ./dist/main.js

# !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!

# ↑
# Styleタグを注入しているような記述
#
```

#### HTMLを確認する

```shell
% open -a "Google Chrome" dist/index.html
```

index.htmlをブラウザで開くと、文字の色が変わっているはず。
開発者ツールでElementsを確認。

```html
<style>body {
  color: lightblue;
}
</style>
```

スタイルシートがHTMLにインジェクトされている。

### すべてJavascriptにバンドルする方法の問題点

#### CSSが適応される流れ
- css-loaderでCSSをJavascriptに読み込む。
- Webpackでビルドされた `.js` ファイルを `index.html` に配置。
- 読み込まれたJavascriptがstyle-loaderによりHTMLにインジェクトされる。

#### 問題 1
技術的な観点：
たしかにスタイルは適応されているので、見た目は問題ない。
ただし、CSSが肥大化してくるとHTMLサイズが大きくなってしまうし、すべてのHTMLでスタイル定義が注入されるのは無駄。

- `.css` を別ファイルに切り出し、そのファイルを毎回参照すれば良い。すべてのHTMLファイルが軽量化する。
- しかもブラウザがCSSをキャッシュしてくれるので、初回アクセス以降はどのページを閲覧してもCSSファイル分の通信が節約できる。

#### 問題 2
ビジネス観点：
従来の静的ウェブサイトのファイル構造と異なるため、受託案件の納品の際に困ることがある。
クライアントサイドでサイト更新を行う場合に、Webpackの使用を強制することになる。

- `.html / .css / .js` という従来通りの構成にしておけば、納品トラブルが避けられる。
- その上で、ビルドツールも提供してあげると喜ばれる。
