# Section 5

このブランチの前に行ったこと
--------------------------------

- `clean-webpack-plugin`で`dist`フォルダを空にする
- ファイル構成を改善してメンテナンス性を向上させる

　　
　　

このブランチで行ったこと
--------------------------------

これまで、HTML / CSS / Javascript を扱ってきましたが、今回は画像を扱う方法を解説します。

### 画像の追加

アイコン画像とサムネイル画像を追加したいと思います。

```
src/
    + -- images/
        + -- icon.png
        + -- thumbnail.jpg
    + -- javascripts/
    + -- stylesheets/
    + -- templates/
```

### 画像の配置

コンテンツを追加するには`templates/`を編集することを思い出してください。

```html
<body>
  <h1>Hello World!</h1>
  <!-- 追加 -->
  <img src="../images/icon.png" />
</body>
```

```shell
% npx webpack --mode=development
```

```
./stylesheets/main.css   30 bytes    main  [emitted]  main
            index.html  434 bytes          [emitted]  
   javascripts/main.js   5.28 KiB    main  [emitted]  main
```

ビルドは成功しましたが、画像が見当たりません。
`dist`を確認しても`icon.png`はありませんので、ブラウザで開いてみても読み込みエラーになります。

```
GET file:///Users/ss/Dev/webpack_course/images/icon.png net::ERR_FILE_NOT_FOUND
```

### url-loader

- [url-loader](https://github.com/webpack-contrib/url-loader) を使って画像を読み込んでみます。

```shell
% npm view url-loader
# latest: 3.0.0 

% npm install --save-dev url-loader@3.0.0
```

moduleの設定にruleを追加しましょう。

```js
// webpack.config.js

  // ...

  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          }
        ],
      },
      // 追加
      {
        test: /\.png/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },

// ...

```


```shell
% npx webpack --mode=development
```

ビルドしても変化がありません。
テンプレートも編集する必要があります。

```html
<!-- src/template/index.html -->

<!-- 削除 -->
<!-- img src="../images/icon.png" / -->

<!-- 追加 -->
<img src="<%= require('../images/icon.png') %>" />
```

画像を読み込む方法を変更しました。
これは`webpack-html-plugin`が[lodash](https://lodash.com/docs/4.17.15#template)というライブラリに依存しているためで、少し面倒な指定方法になりますが、後で改善していきます。


```shell
% npx webpack --mode=development

    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./src/templates/index.html] 577 bytes {0} [built]
    [./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
    [./src/images/icon.png] 13 KiB {0} [built] # icon.pngのログが出力されている


# ブラウザで確認してみてください
% open -a "Google Chrome" dist/index.html
```

```html
<!-- dist/index.html -->

<body>
  <h1>Hello World!</h1>
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAFCgAwAEAAAAAQAAAFAAAAAAwtoCpA//gpXEiDLWPBhEP8+wEKUUiAlzdnpubTi..........">
</body>
```

出力されたHTMLを確認すると、`img`タグが挿入されています。
そして`src`属性には何やらものすごく長い文字列が設定されています。

ブラウザを見ると想像できる通り、実はこの長い文字列が画像です。
`url-loader`が画像を文字列に変換し、`webpack-html-plugin`によってその文字列が`img`タグに反映されました。
なかなか見慣れないかもしれませんが、画像はこのように指定することもできるのです。

### file-loader

画像を文字列に変換して読み込みましたが、あまり標準的な設定方法とは言えません。
[file-loader](https://github.com/webpack-contrib/file-loader)を使ってファイルを配置する”普通”の設定をしていきます。

```shell
% npm view file-loader
# latest: 5.0.2  

% npm install --save-dev file-loader@5.0.2
```

```js
// webpack.config.js

  // ...

  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          }
        ],
      },
      {
        test: /\.png/,
        use: [
          {
            loader: 'file-loader', // 変更
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },

// ...

```

```shell
% npx webpack --mode=development

              ./stylesheets/main.css   30 bytes    main  [emitted]  main
5de78d047f515312fd12d11f42bf86e9.png   9.75 KiB          [emitted]  
                          index.html  452 bytes          [emitted]  
                 javascripts/main.js   5.28 KiB    main  [emitted]  main
```

`5de78d047f515312fd12d11f42bf86e9.png`という見慣れないファイル名がログに出力されています。
ブラウザで見た目を確認しましょう。

```shell
% open -a "Google Chrome" dist/index.html
```

ちゃんと画像が表示されています。
HTMLを確認します。

```shell
% code dist/index.html
```

画像のファイル名がこのように変更されています。
そして`dist/5de78d047f515312fd12d11f42bf86e9.png`というファイルも存在していることが分かります。

```html
<!-- dist/index.html -->

<h1>Hello World!</h1>
<img src="5de78d047f515312fd12d11f42bf86e9.png" />
```

`icon.png`というファイルがWebpackによってモジュールとして読み込まれ、`5de78d047f515312fd12d11f42bf86e9.png`という新しいファイルとして出力されました。これでは`dist`フォルダが散らかってしまいますので、出力する場所と名前をコントロールしたいと思います。

```js
// webpack.config.js

  // ...

      {
        test: /\.png/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              // 追加
              name: 'images/icon.png',
            },
          },
        ],
      },

// ...
```

再度ビルドしてみると、下のようなファイル構成になったかと思います。

```
dist/
    + -- images/
        + -- icon.png  <- 同じ名前で保存された
    + -- javascripts/
        + -- main.js
    + -- stylesheets/
        + -- main.css
    + -- index.html
```

単にコピーされたように見えますが、一度Webpackにモジュールとして扱われ、新しく書き出された画像ファイルです。
次は複数の画像を配置したいと思います。

```html
<!-- src/templates/index.html -->

<img src="<%= require('../images/icon.png') %>" />
<!-- 追加 -->
<img src="<%= require('../images/thumbnail.jpg') %>" />
```


```shell
% npx webpack --mode=development

ERROR in ./src/images/thumbnail.jpg 1:0
    Module parse failed: Unexpected character '�' (1:0)
    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. 
```

ビルドコマンドを実行するとエラーになりました。
`./src/images/thumbnail.jpg`というファイルをどう取り扱ったら良いのか分からないというエラーです。
Webpackに`.jpg`を扱えるよう下記のように設定を変更します。`filename`ではなく`name`なのに注意してください。

```js
// webpack.config.js

  // ...

      {
        test: /\.png|.jpg/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              // 追加
              name: 'images/icon.png',
            },
          },
        ],
      },

// ...
```

```shell
% npx webpack --mode=development

WARNING in Conflict: Multiple assets emit different content to the same filename images/icon.png 
```

ビルドは成功したように見えますが、このような警告が出ました。
複数のファイルが`images/icon.png`という名前で書き出しを行っているというエラーです。
`dist/images`を見てみると分かりますが、`icon.png`の1ファイルしか存在しません。2つの画像を読み込んだはずなのに、どちらも`icon.png`という名前で保存されてしまい、どちらかが上書きされている状態です。

設定ファイルを次のように修正します。


```js
// webpack.config.js

  // ...

      {
        test: /\.png|.jpg/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              // 変更
              name: 'images/[name].[ext]',
            },
          },
        ],
      },

// ...
```

`[name].[ext]`という特殊な書き方が出てきました。
`[name]`はオリジナルファイルのファイル名、`[ext]`はオリジナルファイルの拡張子という意味になります。
再度ビルドしてみると、`dist/images`フォルダには`src`フォルダの画像と同名の画像ファイルが出力されるかと思います。


```shell
% open -a "Google Chrome" dist/index.html
```

ブラウザでも2つの画像が表示されていることを確認してください。
