# Section 3

このブランチの前に行ったこと
--------------------------------

- Webpackの設定ファイルを使ったビルド
  - `./webpack.config.js`
- ローダーのインストール
  - `npm install`コマンド
- CSSを読み込んでスタイルを適応させる
  - css-loader / style-loader

このブランチで行ったこと
--------------------------------

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


### プラグインのインストール

CSSを別ファイルに出力するには `MiniCssExtractPlugin` というプラグインを使用します。

```shell
% npm view mini-css-extract-plugin
# latest: 0.9.0

% npm install --save-dev mini-css-extract-plugin@0.9.0
```

### プラグインを使用する

Webpackの設定ファイルを編集します。

```shell
code ./webpack.config.js
```

```js
// webpack.config.js

// 追加
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {

  // ...

  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            // loader: 'style-loader', 削除
            loader: MiniCssExtractPlugin.loader, // 追加
          },
          {
            loader: 'css-loader',
          }
        ],
      },
    ],
  },
  // 追加
  plugins: [
    new MiniCssExtractPlugin(),
  ],
};
```

```shell
% npx webpack --mode=development
```

ビルドすると `/dist/main.css` が新規に出力される。
ファイルとして出力されるので、HTMLにインジェクトする役割の`style-loader`は不要になります。

中身を確認。

```shell
code ./dist/main.css
```

```css
body {
  color: lightblue;
}
```

先程までHTML内にインジェクトされていたスタイルシートがファイルとして抽出された。

### HTMLページに適応する

```shell
% open -a "Google Chrome" ./dist/index.html
```

このままだと、先程HTML内に記述されたスタイルシートが無くなっているだけなので、
文字の色はデフォルトに戻ってしまっている。

```shell
% code ./dist/index.html
```

```html
<!-- /dist/index.html -->
...

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Test Page</title>
  <link rel="stylesheet" href="./main.css"> <!-- 追加 -->
</head>

...
```

上のように出力されたCSSをHTMLに読み込んで、
ブラウザをリロードするとスタイルが適応されて文字の色が変更される。

`/dist/my.css` の内容がそのままコピーされている状態に見えますが、CSSが一旦モジュールとしてJavascriptに読み込まれ、Webpackのプラグインによって再度ファイルとして切り出されているので、完全に別のファイルです。

今の段階だと単に回りくどいだけのように思えますが、効率化のための準備ですので、このまま進めてください。

### HTMLファイルも自動で出力する

今のままだと `/dist/index.html` を編集して、JavascriptやCSSを読み込んでいます。
事情を知っている人は理解できますが、初めてこのファイルを見る人には親切ではない状態です。

編集は`/src`の中で全て行い、ビルドコマンドを実行して作成された`/dist`の中身は変更しないのがベスト。
混乱を避けるため、あるファイルは`/src`を編集し、別のファイルは`/dist`を編集するという状況を改善したいと思います。

#### html-webpack-plugin をインストール

- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

このプラグインを使うと、HTMLが自動で出力されます。
出力されるHTMLにはWebpackでビルドされるJavascriptとCSSが配置されています。

```shell
% npm view html-webpack-plugin
#  latest: 3.2.0

% npm install --save-dev html-webpack-plugin@3.2.0
```

#### プラグインを使用する設定を追加

```shell
% code webpack.config.js
```

```js
// webpack.config.js

// 追加
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new MiniCssExtractPlugin(),
    // 追加
    new HtmlWebpackPlugin(),
  ],
}
```

#### ビルドして確認

```shell
% npx webpack --mode=development

     Asset       Size  Chunks             Chunk Names
index.html  219 bytes          [emitted]
  main.css   30 bytes    main  [emitted]  main
   main.js   5.17 KiB    main  [emitted]  main
```

今までなかった`index.html`が出力されているログが確認できます。
中身を確認しましょう。

```shell
% code ./dist/index.html
```

```html
<!-- /dist/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  <link href="main.css" rel="stylesheet"></head>
  <body>
  <script type="text/javascript" src="main.js"></script></body>
</html>
```

自分で作成したファイルがなくなり、上の内容に置き換わっています。
ブラウザで確認します。

```shell
% open -a "Google Chrome" dist/index.html
```

今まであったテキストは無くなり、完全なブランクページが表示されます。
しかし、開発者ツールのConsoleを見ると、見覚えのあるログが出力されています。

```
This is index.js
this is module
```

#### なにが起こっているのか

- `html-webpack-plugin`によって自動でHTMLが出力されました。
- それによって自分で作成した`index.html`は削除されました（上書きされた）
- 新しい`index.html`にはエントリーポイントとして指定したJavascriptが自動で配置されています。
- エントリーポイントではCSSファイルも読み込んでいますので、先の`mini-css-extract-plugin`によって個別ファイルとして出力されています。
- CSSの読み込みは`html-webpack-plugin`によって検知されており、出力されたCSSも`index.html`に自動で配置されています。


`html-webpack-plugin`はビルドしたファイルを含んだ`.html`を自動で作成してくれるプラグインです。
ただし、これではコンテンツが空のままです。

#### テンプレートを利用する

`html-webpack-plugin`では、出力されるHTMLの雛形を指定することができます。
まずは雛形となるHTMLファイルを作成しましょう。

```shell
% code ./src/index.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Template HTML</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>
```

`.css`や`.js`ファイルは配置されていません。
Webpackの設定ファイルを少し編集して、このHTMLをテンプレートとして使用します。

```js
// webpack.config.js

module.exports = {
  // ...
  plugins: [
    // ...
    // 編集
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}
```

この状態でビルドしてみましょう。

```shell
% npx webpack --mode=development

Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./src/index.html] 486 bytes {0} [built]
    [./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
```

`./src/index.html` が使用されているログが確認できます。
ブラウザで確認してみてください。

```shell
% open -a "Google Chrome" dist/index.html
```

今度は`Hello World!`という文字が表示されたかと思います。
Javascriptも読み込まれていますので、ブラウザのConsoleでも今まで通りのログが流れています。

ファイルも確認してみてください。

```shell
% code ./dist/index.html
```

この2行が自動で挿入されているのが確認できます。

```html
<!-- /dist/index.html -->
<link href="main.css" rel="stylesheet"></head>
<script type="text/javascript" src="main.js"></script>
```

テンプレートを使用することで`html-webpack-plugin`を使用しつつ、自分のコンテンツを表示することができました。

これによって`/dist`フォルダのすべてのファイルは、ビルドの結果になりました。
`/dist`をフォルダごと削除して、再度ビルドコマンドを実行してみても、常に同じファイルが生成されます。

制作者が変更ファイルは`/scr`フォルダの中に集まり、メンテナンス性が格段に向上した状態です。
