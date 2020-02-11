# Section 8

このブランチの前に行ったこと
--------------------------------

- ローカルサーバーの起動
- HTMLページの階層化
- ルートパスの使用

　　
　　

このブランチで行ったこと
--------------------------------

### CSSの効率化

HTMLについてはPugを利用して効率化できました。
（少なくとも効率化する準備はできました）

つくるページが多ければ多い程、メリットが大きくなりますので、
10ページ以上あるようなウェブサイトの場合はぜひ最初から採用を検討してください。

今回は、[Sass](https://sass-lang.com/)をつかって、CSSを効率的にビルドしていきたいと思います。
`sass-loader`を使用しますが、`node-sass`に依存していますので、どちらもインストールしていきます。

- [sass-loader](https://github.com/webpack-contrib/sass-loader)
- [node-sass](https://github.com/sass/node-sass)

```shell
% npm view node-sass
# latest: 4.13.1

% npm view sass-loader
# latest: 8.0.2

% npm install --save-dev node-sass@4.13.1
% npm install --save-dev sass-loader@8.0.2
```

```js
// webpack.config.js

      // ...

      {
        test: /\.(css|scss|sass)$/, // 変更
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader', // 追加
          },
        ],
      },

      // ...
```

#### ファイル名を変更します

```shell
% mv src/stylesheets/main.css src/stylesheets/main.scss
```

```js
// src/javascripts/main.js

import my from './my';
import '../stylesheets/main.scss'; // 変更

console.log('This is index.js');
my();
```

#### ビルド

```shell
% npx webpack --mode=development
```

`dist/stylesheets/main.css`が生成されます。
`.scss`が`.css`として出力された結果です。

### Sassの拡張子

Sassは2つの拡張子を使用することができます。
先程のWebpackの変更でも対応しています。

```js
test: /\.(css|scss|sass)$/,
```

この正規表現は `.css` `.scss` `.sass`のどれかにマッチします。

### Sassの記述方法

`.scss`と`.sass`では、それぞれCSS記述方法が違います。

#### .scss

```scss
body {
  .purple {
    color: purple;
  }
}
```

#### .sass

```sass
body
  .purple
    color: purple
```

`.scss`は通常の`.css`ファイルに近く、`.sass`はインデントを利用して階層構造を表現するPugに近い書き方です。
どちらも最終的なアウトプットは同じですが、`.scss`をお勧めします。

[公式ページ](http://thesassway.com/editorial/sass-vs-scss-which-syntax-is-better)も`.scss`を推薦しています。

理由は色々ありますが、純粋なCSSとほとんど書き方が同じという点が大きいかと思います。
このコースでは`.scss`を採用していきます。

### Sassのメリット

- ネスト
- 変数
- @import
- @extend
- @mixin
- etc...

簡単ですがSassのメリットを紹介します。

#### ネスト

階層構造がより明確になります。

```scss
.content {
  .title {
    font-size: 24px;
  }
}
```

```css
.content .title {
  font-size: 24px; }
```

#### 変数

```scss
$text-color: orange;
.content {
  .title {
    font-size: 24px;
    color: $text-color;
  }
}
```

```css
.content .title {
  font-size: 24px;
  color: orange; }
```

#### @import

```scss
@import './footer';
$text-color: orange;
.content {
  .title {
    font-size: 24px;
    color: $text-color;
  }
}
```

```scss
// footer.scss
.footer {
  background-color: #ddd;
}
```

```css
.footer {
  background-color: #ddd; }

.content .title {
  font-size: 24px;
  color: orange; }
```

#### @extend

```scss
@import './footer';
$text-color: orange;
.content {
  .title {
    font-size: 24px;
    color: $text-color;
  }
  .title-lg {
    @extend .title;
    font-size: 32px;
  }
}
```

```css
.footer {
  background-color: #ddd; }

.content .title, .content .title-lg {
  font-size: 24px;
  color: orange; }

.content .title-lg {
  font-size: 32px; }
```

#### @mixin

```scss
@import './footer';

@mixin set-margin($direction, $value) {
  margin-#{$direction}: $value;
}

$text-color: orange;
.content {
  .title {
    font-size: 24px;
    color: $text-color;
  }
  .title-lg {
    @extend .title;
    font-size: 32px;
  }
  @include set-margin(right, 16px);
}
```

```css
.footer {
  background-color: #ddd; }

.content {
  margin-right: 16px; }
  .content .title, .content .title-lg {
    font-size: 24px;
    color: orange; }
  .content .title-lg {
    font-size: 32px; }
```

その他、いろいろ便利な機能がSassにはあります。
ぜひ[公式ドキュメント](https://sass-lang.com/)を読んでみてください。

### ベンダープリフィクス

古いブラウザをサポートする場合にはCSSにベンダープリフィクスを使用する必要があるかと思います。
ベンダープリフィクスを手動で書いていくのは面倒な作業ですが、`Autoprefixer`を使用すれば自動化することができます。

`Autoprefixer`は便利ですが、最近ではベンダープリフィクスなしで多くのプロパティが利用可能になっており、対象ブラウザによっては不要なことも多いです。

例えば`flexbox`は、このようなカバレッジになっています。
https://caniuse.com/#feat=flexbox

今後もベンダープリフィクスは不要になっていくと思いますので、このコースでは`Autoprefixer`を導入していきませんが、古いブラウザ対応が必要な場合は、`postcss-loader`と`autoprefixer`を利用することで自動化することができます。必要に応じて調べてみてください。

- [postcss-loader](https://github.com/postcss/postcss-loader)
- [autoprefixer](https://github.com/postcss/autoprefixer)
