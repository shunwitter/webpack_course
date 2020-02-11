# Section 10

このブランチの前に行ったこと
--------------------------------

- `babel`のインストール
- `@babel/preset-env`のインストール
- ECMAScript 6
- Autoprefixerの説明

　　
　　

このブランチで行ったこと
--------------------------------

### ソースマップ

ソースマップはデバッグに便利なツールです。
ビルドされたコードは人間の目では解読が難しいですが、ソースマップを配置することでブラウザでのデバッグが格段に効率化します。

ソースマップの種類はいろいろあるのですが、[詳しくは公式](https://webpack.js.org/configuration/devtool/)を確認してください。

今回は下記のソースマップオプションを使用します。

|devtool|build|build|production|quality|
|---|---|---|---|---|
|source-map|slowest|slowest|yes|original source|

Webpackの設定を修正しましょう。

```js
// webpack.config.js

module.exports = {
  devtool: 'source-map',
  // ...
}
```

これだけで、Javascriptのソースマップが表示できます。

`my.js`で`console.log`していますから、Chromeの開発者ツールを開いて`Console`を開くと、ログが表示されています。
右端にあるファイル名をクリックすることで、ソースマップによってビルド前のコードを確認することができます。

#### ブレイクポイント

これだけでも便利ですが、ブレイクポイントもこのビルド前コードに設定できますので、活用してみてください。

#### CSSのソースマップ

Sassを使用していますので、CSSのビルド前コードをChromeで確認するには、もうひとつオプションを追加します。

```js
// webpack.js.config

{
  test: /\.(css|scss|sass)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: { sourceMap: true }, // 追加
    },
    {
      loader: 'sass-loader',
    },
  ],
},
```

```shell
% npx webpack-dev-server
```

今度はCherome開発者ツールの`Elements`を開き、
同じく右端のファイル名をクリックすると、元の`.scss`ファイルを見ることができます。

### 本番環境要のコード

現在のビルドはこちらのコマンドです。

```shell
% npx webpack --mode=developemnt
```

本番用のコードをビルドするためには、モードを変更します。

```shell
% npx webpack --mode=production
```

ビルドすると、Javascriptがブラウザが解釈しやすいような形に変換されました。
このモードはコマンドで`--mode`を指定することもできますが、Webpackの設定ファイルで指定することができます。

```js
// webpack.config.js

module.exports = {
  mode: 'production', // 追加
  devtool: 'source-map',
  entry: {
    main: './src/javascripts/main.js',
  },
  // ...
```

```shell
% npx webpack
```

`--mode`オプションを指定しなくても本番用のコードが出力できました。

### コマンドの一元管理

```shell
% npx webpack
% npx webpack --mode=development # webpack.config.js を上書きできる
% npx webpack-dev-server
```

コマンドが増えてきたので`package.json`にまとめたいと思います。

```
{
  "name": "webpack_test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    // 削除
    // "test": "echo \"Error: no test specified\" && exit 1"
    // 追加
    "start": "webpack-dev-server",
    "build": "webpack",
    "build:dev": "webpack --mode=development"
  },
  // ...
}
```

実行するには、下記のようになります。

```shell
% npm start
% npm run build
% npm run build:dev
```

`mode`オプションのデフォルトは`production`なので、設定ファイルから削除しておきます。

```js
// webpack.config.js

module.exports = {
  // 削除
  // mode: 'production',
  devtool: 'source-map',
  entry: {
    main: './src/javascripts/main.js',
  },
  // ...
```
