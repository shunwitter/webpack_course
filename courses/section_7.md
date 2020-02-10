# Section 7

このブランチの前に行ったこと
--------------------------------

- Pugの導入
- includeを使った共通化
- extendsを使った効率化
- 変数をテンプレートで使用する方法

　　

このブランチで行ったこと
--------------------------------

### ローカルサーバー

現状だとHTMLファイルを直接ブラウザが読み込んでいます。
ブラウザのアドレスバーを確認すると、`file:///....`のようなパスが指定されており、通常のサイトのURLのような形ではありません。

問題ないように見えますが、ウェブサイトは最終的にウェブサーバーが`http`プロトコルを使用して配信されます。ローカル環境でも同じように`http`を使用するにはローカル環境でもサーバーを立ち上げる必要があります。

ローカルサーバーのメリット:

- リリース後の問題が少ない
- ライブリロードが便利
- ルートパス`/`が使える

### ローカルサーバーを起動する

Webpackでは、ローカルサーバーをとても簡単に立ち上げることができます。

```shell
% npm view webpack-dev-server
# latest: 3.10.3

% npm install --savve-dev webpack-dev-server@3.10.3
```

```shell
% npx webpack-dev-server

ℹ ｢wds｣: Project is running at http://localhost:8080/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from /Users/ss/Dev/webpack_course
```

たったこれだけです。
`http://localhost:8080/`にブラウザでアクセスすると、先程まで同じコンテンツが表示されました。
本番と同じhttpプロトコルを使用しますので、この部分で問題が発生する可能性が低くなりました。
リリース間近は何かと慌ただしいと思いますので、余計な心配事は取り除いておきましょう。

### 編集が反映される

```shell
% code src/templates/index.pug
```

```pug
// src/templates/index.pug

extends _layout.pug
block locals
  - var title = 'Hello Pug!'
block content
  // 追加
  h2 Test
  img(src="../images/icon.png")
  img(src="../images/thumbnail.jpg")
```

`src/templates/index.pug`を編集して保存すると、自動的にビルドが実行され、ブラウザもリロードされます。
2番目のメリット`ライブリロード`を利用することができました。

### ルートパスが利用できる

これを説明するまえに、HTMLをサブディレクトリにも作成してみましょう。
ページ構成に階層構造を作ります。

#### 現在の構造

```
- /
- /index.html
- /access.html
```

#### 変更後の構造

```
- /
- index.html
- access.html
- members/
  - taro.html
```

このように、`members`フォルダの中にさらにHTMLを配置します。

```shell
% code src/templates/members/taro.pug
```

```pug
extends ../_layout.pug
block locals
  - var title = 'Taro'
block content
  p メンバー紹介ページです
```

```js
// webpack.config.js
  // ...
  plugins: [

    // 追加
    new HtmlWebpackPlugin({
      template: './src/templates/members/taro.pug',
      filename: 'members/taro.html',
    }),

  ],
  // ...
```

### HTMLの階層化

複数のHTMLを作成できるようになりましたが、サブディレクトリに格納する場合はどうすれば良いでしょうか。
下記のような構成にしてみたいと思います。

```
src/
    + -- javascripts/
    + -- stylesheets/
    + -- templates/
      + -- access.pug
      + -- index.pug
      + -- members/
          + -- taro.pug
```

```pug
// src/templates/members/taro.pug

extends ../_layout.pug
block locals
  - var title = 'Taro'
block content
  p メンバー紹介ページです
```

```js
// webpack.config.js
  // ...
  plugins: [
    // 追加
    new HtmlWebpackPlugin({
      template: './src/templates/members/taro.pug',
      filename: 'members/taro.html',
    }),
  ]
  // ...
```

```shell
# control + c で webpack-dev-server を終了させる

# 再度起動
% npx webpack-dev-server

                 Asset       Size  Chunks             Chunk Names
./stylesheets/main.css   30 bytes    main  [emitted]  main
           access.html  449 bytes          [emitted]  
       images/icon.png   9.75 KiB          [emitted]  
  images/thumbnail.jpg    264 KiB          [emitted]  
       images/user.png     24 KiB          [emitted]  
            index.html  504 bytes          [emitted]  
   javascripts/main.js    362 KiB    main  [emitted]  main
     members/taro.html  489 bytes          [emitted] 
```

`dist`フォルダに注目してください。正しく設定したはずなのに`members/taro.html`は作成されていません。

#### 保存されないファイル

実は`webpack-dev-server`のビルドはファイルとして出力されず、すべてメモリ上に保存されますので、ファイルとして見ることができません。ファイルを確認するためには、今まで通り`npx webpack --mode=development`を実行すればOKです。

#### HTMLの確認

ファイルとしては存在しないのですが、メモリ上に保存されローカルサーバーによって配信されている状態です。ブラウザでアクセスすると確認することができます。

```shell
% open http://localhost:8080/members/taro.html
```

#### リンクの不具合(ローカルサーバー)

階層を作ってHTMLを配置することはできましたが、問題があります。
`index.html / access.html`というリンクをクリックすると下記のようなエラーになります。

```
Cannot GET /members/index.html
```

`src/tempates/_menu.pug`を確認してみましょう。

```pug
// src/tempates/_menu.pug

div
  a(href="./index.html") index.html
  a(href="./access.html") access.html
```

`href`属性を見ると`./index.html`となっていますね。「現在のディレクトリの`index.html`」という意味です。
結果として、`/members/index.html`が指定され、そんなファイルは存在しないのでエラーとなっています。

#### リンクの不具合(ファイルシステム)

同じように、ローカルサーバーを立ち上げなくてもエラーになります。

```shell
% npx webpack --mode=development

% open -a "Google Chrome" dist/members/taro.html
```

`index.html`のリンクをクリックすると下記のエラーになります。
理由は同じで、`/members`フォルダには`index.html`が存在しないからです。

```
Your file was not found
```


#### リンクを修正する

修正するにはルートから見たパスを指定しましょう。ついでにメンバーページへのリンクも追加します。

```pug
// src/tempates/_menu.pug

div
  a(href="/index.html") index.html
  a(href="/access.html") access.html
  a(href="/members/taro.html") members/taro.html
```

ローカルサーバーを起動して、3つのリンクが正常に動作していることを確認してください。

```shell
% npx webpack-dev-server    
```

ルートから見たパスを指定してた上で、ファイルシステムを使ってテストしてもうまくいきません。
`file:///index.html`というファイルは存在しないので当然ですね。

ルートパスから指定することで、階層が1つ下のHTMLページからもリンクを貼ることができました。
この`taro.html`がさらに下の階層に移動したとしても問題ありません。リンクは常にルート`/`から指定されているからです。
これがローカルサーバーを使う3番目のメリット「ルートパス」になります。
