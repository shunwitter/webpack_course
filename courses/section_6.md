# Section 5

このブランチの前に行ったこと
--------------------------------

- 画像をテンプレートに設置しました
- `url-loader`を使って画像を文字列として読み込みました
- `file-loader`を使って画像を任意の場所に出力しました

　　
　　

このブランチで行ったこと
--------------------------------

これまで、HTMLの書き出し、CSS/JS/画像の読み込み等を解説してきましたが、`src`の中身が`dist`に出力されるだけであり、メリットが明確ではありませんでした。今回は [pug](https://pugjs.org/api/getting-started.html) というパッケージを利用して、HTMLのマークアップを一気に効率化したいと思います。

```shell
% npm view pug-html-loader
# latest: 1.1.5

% npm view html-loader
# latest: 0.5.5

% npm install --save-dev pug-html-loader@1.1.5
% npm install --save-dev html-loader@0.5.5
```

```js
// webpack.config.js

  // ...
  module: {
    rules: [
      // 追加
      {
        test: /\.pug/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
          },
        ],
      },
    ],
  },
  // ...
```

`.pug`ファイルを読み込んで`html-webpack-plugin`で利用するには2つのローダーを使用します。
まず`pug-html-loader`で`.pug`のファイルをHTMLに変換、そのHTMLを`html-loader`に受け渡しています。
`pug-html-loader`が2番目に設定されていますが、ローダーは下から順に適応されていくのがWebpackのルールです。

### `.pug`ファイルを作成

```shell
% code src/templates/index.pug
```

Pugはインデントを利用してDOMの階層構造を表現していきます。
HTMLの閉じるタグを書かなくて良いので、タイプする文字数と記述ミスが減り、効率化が可能です。

`img`の`src`属性は`html-loader`によってピックアップされ、その画像は`file-loader`によって処理されますので、`require()`の記述も削除することができます。

```pug
doctype html

html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Template Pug
  body
    h1 Hello Pug!
    img(src="../images/icon.png")
    img(src="../images/thumbnail.jpg")
```

### ビルドして確認

```shell
% npx webpack --mode=development

    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./src/templates/index.pug] 337 bytes {0} [built]
    # index.pugが使用されているログが確認できます。
```

ビルドすると`dist/index.html`が作成されていますので、ブラウザでも今までと同じ表示が確認できます。
しかしコードは今までとは少し異なっています。

```shell
% code dist/index.html
```

```html
<!-- dist/index.html -->

<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template Pug</title><link href="./stylesheets/main.css" rel="stylesheet"></head><body><h1>Hello Pug!</h1><img src="images/icon.png"><img src="images/thumbnail.jpg"><script type="text/javascript" src="javascripts/main.js"></script></body></html>
```

改行がすべて無くなってしまっています。
改行がなくなることによって、ファイルサイズが若干軽くなっていると思います。バンドルサイズをできるだけ軽量化するよう、Webpackが自動で最適化している結果ですが、今まで通りに出力する方法も紹介したいと思います。


```js
// webpack.config.js

  // ...
  module: {
    rules: [
      {
        test: /\.pug/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            // 追加
            options: {
              pretty: true,
            },
          },
        ],
      },
    ],
  },
  // ...
```

まったく同じではありませんが、人間が読みやすい形にはなりました。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Pug</title>
  <link href="./stylesheets/main.css" rel="stylesheet"></head>
  <body>
    <h1>Hello Pug!</h1><img src="images/icon.png"><img src="images/thumbnail.jpg">
  <script type="text/javascript" src="javascripts/main.js"></script></body>
</html>
```

- Pugの`pretty`オプション
  - https://pugjs.org/api/reference.html#options
  - 非推奨となっていますので将来削除された場合、prettier等の代替方法を選択することができると思います。

### 複数のページを作成する

1ページだけで完結するウェブサイトもあるかもしれませんが、多くの場合、複数のページが必要かと思います。Pugファイルを追加して複数ページを出力するように設定していきます。

```
% code src/templates/access.pug
```

```pug
// src/templates/access.pug

doctype html

html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Access
  body
    h1 Access Page!
```

```js
// webpack.config.js

  // ...

  plugins: [
    new MiniCssExtractPlugin({
      filename: './stylesheets/main.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/index.pug',
      filename: 'index.html',
    }),
    // 追加
    new HtmlWebpackPlugin({
      template: './src/templates/access.pug',
      filename: 'access.html',
    }),
    new CleanWebpackPlugin(),
  ],

  // ...
```

`HtmlWebpackPlugin`を1つ追加するのですが、同じファイル名で上書きしてしまわないように、`filename`を指定します。

```shell
% npx webpack --mode=development
```

ビルドすると`dist/access.html`が生成されたかと思います。

### 共通のテンプレートを作成する

効率化の大きなポイントです。
複数のHTMLファイルで利用される小さなテンプレートを作成し、読み込んでみたいと思います。
ページ数が多くなれば多くなるほどメリットが大きくなります。


```
% code src/templates/_menu.pug
```

```pug
// src/templates/_menu.pug

div
  a(href="./index.html") index.html
  a(href="./access.html") access.html
```

`_`をプリフィックスとして付けることによって、これは他の手プレートから読み込まれるファイルであることを分かりやすくしています。必須ではないですが、ファイル構成がより明確になるかと思いますのでお勧めです。他にも`partials`のようのフォルダを作成してその中に保存するのも良いかと思います。

#### 部分テンプレートを読み込む

```pug
doctype html

html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Template Pug
  body
    // 追加
    include _menu.pug
    h1 Hello Pug!
    img(src="../images/icon.png")
    img(src="../images/thumbnail.jpg")
```

`access.html`をクリックすると、ページに遷移します。`access.html`にもメニューを配置しましょう。

```pug
// src/templates/access.pug

doctype html

html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Access
  body
    // 追加
    include _menu.pug
    h1 Access Page!
```

ビルドすると`access.html`にもメニューが表示され、ページを行き来できるようになりました。
今後、メニューに新しい要素を追加するには`_menu.pug`を更新するだけでOKです。その上でビルドすると、`_menu.pug`を読み込んでいる全てのテンプレートでHTMLがアップデートされるので、メンテナンスが非常に楽になります。

### Pugテンプレートの拡張

部分テンプレートを作成する方法は非常に強力ですが、ページの1部分を読み込む機能しか持ち合わせていません。すべてのページでメニューを表示したい場合は、それぞれのPugファイルで`include _menu.pug`と記述する必要があります。
部分テンプレートが増えれば増えるほど`include`するファイルが増えてしまいますので、ミスの原因にもなりかねません。

これを更に効率化するために、Pugには拡張という機能があります。
拡張を利用すると、ページの大枠を共有することができるので、`include`する手間を省くことができます。

```
% code src/templates/_layout.pug
```

```pug
// src/templates/_layout.pug

doctype html

html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Template Pug
  body
    // メニューをここで読み込んでいます
    include _menu.pug
    // ここを各ページのコンテンツで置き換えます
    block content
```

この`_layout.pug`というファイルを`index.pug`と`access.pug`で拡張します。

```pug
// src/templates/index.pug
extends _layout.pug
block content
  h1 Hello Pug!
  img(src="../images/icon.png")
  img(src="../images/thumbnail.jpg")
```

```pug
// src/templates/access.pug
extends _layout.pug
block content
  h1 Access Page!
```

ファイルが、随分コンパクトになりました。
ポイントは`extends`と`block`です。

- `extends`：ベースとなるテンプレートを指定します。
- `block content`：この中身が`_layout.pug`の`block content`と入れ替わります。

ビルドして問題なくHTMLが表示されることを確認してください。

#### 複数のブロック

`block content`と記述して、拡張したテンプレートで内容を置き換えましたが、`block`は複数設定することもできます。
次の例は、複数のブロック、そして変数を使う方法です。

変数は`var`で定義することができ、テンプレート内で使用できます。通常のHTMLにはない機能です。
ブロックの中で変数を定義することもできるので、各ページにて、下記のようにブロック内の変数を置き換えることができます。

```pug
// src/templates/_layout.pug

doctype html

block locals
  - var title = 'My Website'

html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title #{title}
  body
    include _menu.pug
    h1 #{title}
    block content
```

```pug
// src/templates/index.pug

extends _layout.pug
block locals
  - var title = 'Hello Pug!'
block content
  img(src="../images/icon.png")
  img(src="../images/thumbnail.jpg")
```

```pug
// src/templates/access.pug

extends _layout.pug
block locals
  - var title = 'Access Page!';
block content
```

変数を置き換えることによって、HTMLを個別に書くことなくタイトルタグを出力しました。
また、`head`タグ内の`title`も同じ文字列を使用しようしています。
このように、内容が全く同じ文字列等は変数を利用することで、タイプミスを防ぐことができます。

　　
このセクションではPugを利用することで、HTMLを効率的に作成する方法を説明しました。
数十ページあるHTMLの共通要素を同期させるのは、こういったツールがないとなかなか大変ですし、間違いがないかチェックする工数もかかってしまいます。
共通テンプレート化できるものはできるだけ共通化すると、作業効率が劇的に改善されるかと思います。

Pugには他にも色々な機能があります。ぜひ[公式ドキュメント](https://pugjs.org/api/getting-started.html)も読んでみてください。
