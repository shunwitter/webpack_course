# Section 6

このブランチの前に行ったこと
--------------------------------

- CSSファイルを別ファイルに出力する
  - `mini-css-extract-plugin`
- HTMLファイルを自動で生成する
  - `html-webpack-plugin`
- 全てのファイルを`/src`に集約させる

　　　
　　

このブランチで行ったこと
--------------------------------

### Webpackの設定をカスタマイズ

HTML / CSS / JS の構成でファイルが書き出せるようになりました。
`/dist`フォルダには下記のファイルが生成されています。

- index.html
- main.css
- main.js

ウェブサイトを構成する基本的なファイルです。
`/dist`フォルダは一切編集することなく、サイト制作の準備が整ったと言えます。

このセクションでは`webpack.config.js`をカスタマイズして、ファイル構成を改善していきます。

### clean-webpack-plugin

このセクションでは、ファイルの名前や構成を頻繁に変更することになります。
構成を変える前と後では出力されるファイル名が違うため、`dist`フォルダに使用していない不要なファイルが残ってしまいます。

`dist`フォルダを毎回削除しても良いのですが、自動化してしまいましょう。

- [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin) を使用します。

```shell
% npm view clean-webpack-plugin
# latest: 3.0.0

% npm install --save-dev clean-webpack-plugin@3.0.0
```

```js
// webpack.config.js

// 追加
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    // ...
    // 追加
    new CleanWebpackPlugin(),
  ],
};
```

`clean-webpack-plugin`が動作しているか確認するために`dist/test.html`というファイルを作成します。

```shell
% npx webpack --mode=development
```

ビルドコマンドを実行すると、`dist`の中に作成した`test.html`ファイルが削除されたかと思います。
`clean-webpack-plugin`が一度`dist`フォルダの中身を全て削除しているのが確認できました。

### .cssファイルの名前を変える

生成されるHTMLにはCSSを読み込む記述が自動で書き込まれるので、意識することは少ないですが、CSSファイルの名前を変更することもできます。

```js
// webpack.config.js

module.exports = {
 // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'my.css', // 追加
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}
```

```shell
% npx webpack --mode=development
```

`filename`を指定したことによって、ファイルが`my.css`として保存されました。
それに伴い`index.html`に記述されているCSS読み込みの記述も変更されています。

```
# ファイル構成

dist/
    + -- my.css
    + -- index.html
    + -- main.js
```

自動的にフォルダをつくって、その配下に置くこともできます。

```js
// webpack.config.js

module.exports = {
 // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: './stylesheets/my.css', // 変更
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}
```

再度ビルドしてみると`/dist`フォルダの中はこのような構成に変更されます。

```
# ファイル構成

dist/
    + -- stylesheets/
        + -- my.css
    + -- index.html
    + -- main.js
```

### .jsファイルの名前を変える

同じようにJavascriptファイルの名前も変更していみます。
こちらも`filename`を指定することで変更可能です。

```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'javascripts/my.js', // 変更
  },
  // ...
}
```

ビルドすると、下記のようなファイル構成になるはずです。
出力されたHTMLの記述も合わせて変更されます。

```
dist/
    + -- javascripts/
        + -- my.js
    + -- stylesheets/
        + -- my.css
    + -- index.html
```

ウェブサイトの標準的なファイル構成が実現できました。

### ファイル構成の改善

`dist`フォルダの中身は理想的な形になりましたが、`/src`の構成を改善できそうです。
現状では以下のようになっており、`dist`と`src`に一貫性がありません。

```
dist/
    + -- javascripts/
        + -- my.js
    + -- stylesheets/
        + -- my.css
    + -- index.html

src/
    + -- modules/
        + -- my.css
        + -- my.js
    + -- index.html
    + -- index.js
```

今までは`src/modules`にファイルを入れてきました。
WebpackではすべてJavascriptのモジュールとして扱われるということを強調するためです。

これまでのセクションでモジュールの概念を理解できたかと思います。
ここでは、最終的な出力結果`dist`フォルダの構成に近づけることによって、より直感的なファイル構成にしたいと思います。

```
dist/
    + -- javascripts/
        + -- my.js
    + -- stylesheets/
        + -- my.css
    + -- index.html

src/
    + -- javascripts/
        + -- index.js
        + -- my.js
    + -- stylesheets/
        + -- my.css
    + -- templates/
      + -- index.html
```

ビルドするともちろんエラーになります。

```shell
# ERROR in Entry module not found: Error: Can't resolve...
```

ファイルを移動しましたので、コードも修正しましょう。

```js
// webpack.config.js

module.exports = {
  entry: {
    main: './src/javascripts/index.js', // パスを変更
  },
  // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: './stylesheets/main.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/index.html', // パスを変更
    }),
  ],
};
```

```js
// src/javascripts/index.js

import my from './my';            // 変更
import '../stylesheets/my.css';   // 変更

console.log('This is index.js');
my();
```

これでビルドが通るはずです。

練習として `my.css` `index.js`を使用してきましたが、
ビルド後のファイルと合わせておいた方がより直感的ですので`main`というワードを使用したいと思います。


```
src/
    + -- javascripts/
        + -- main.js    # 変更
        + -- my.js
    + -- stylesheets/
        + -- main.css   # 変更
    + -- templates/
      + -- index.html
```

```js
// webpack.config.js

module.exports = {
  entry: {
    main: './src/javascripts/main.js',    // 変更
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'javascripts/main.js', 　   // 変更
  },
  // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: './stylesheets/main.css', // 変更
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
    }),
  ],
}
```

ビルドすると`dist`は下記ようになり、`src`フォルダの構成と関連性が強まりました。

```
dist/
    + -- javascripts/
        + -- main.js
    + -- stylesheets/
        + -- main.css
    + -- index.html
src/
    + -- javascripts/
        + -- main.js
        + -- my.js
    + -- stylesheets/
        + -- main.css
    + -- templates/
      + -- index.html
```

このセクションで行ったようなファイル構成の変更は必須ではありませんが、プロジェクトが小さい段階から整理整頓に気を使っておくと、メンテナンス性が向上して後の作業が効率化します。特に、チームで作業したりクライアントに納品したりする場合は、他人が理解する時間を節約することができますので、関係者全員のメリットになります。
