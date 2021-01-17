
# Section 17

このブランチの前に行ったこと
--------------------------------

- TypeScriptの導入
- TypeScriptでReactコンポーネントの作成

　　
　　

このブランチで行ったこと
--------------------------------

ここまで、Webpackの基本から、TypeScript等の応用まで、多くのことを学習してきました。
ツールは一通り揃いましたので、少し整理していきたいと思います。

### Vueを削除

#### ファイルの削除

通常、VueとReactを共存させることはありませんので、Vueを削除したいと思います。
`VueApp.vue`を削除して、下記のようにファイルを編集してください。

```js
// src/javascripts/main.js

// 削除
// import Vue from 'vue';
// import VueApp from'./VueApp.vue';

import my from './my';
import './reactApp.jsx';
import '../stylesheets/main.scss';

import add from './add.ts';

console.log(add(3, 9));
console.log('This is index.js');
my();

// 削除
// new Vue({
//   el: '#vue-root',
//   render: (h) => h(VueApp),
// });
```

#### 設定の削除

```js
// webpack.config.js

// 削除
// const VueLoaderPlugin = require('vue-loader/lib/plugin');

      // 削除
      // {
      //   test: /\.vue/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: 'vue-loader',
      //     }
      //   ],
      // },

  plugins: [
    // ...
    // 削除
    // new VueLoaderPlugin(),
  ],
```

#### loaderの削除

```shell
% npm uninstall vue vue-loader vue-template-compiler
```

#### 確認

サイトが正しく動作することを確認してください。

```shell
% npm start

Version: webpack 4.41.5
Time: 6074ms
Built at: 02/11/2020 8:59:35 PM
```

少しビルド時間が長いようです。
`devtool`オプションを変更しようと思います。

```js
// webpack.config.js

// 削除
// devtool: 'source-map',
// 追加
devtool: 'eval-source-map',
```

再ビルドが少しスピードアップしました。
これでも遅い場合は、一度`devtool`オプションをコメントアウトしてください。

### テストファイルの削除

`src/javascripts/add.ts` `src/javascripts/my.js` を削除しましょう。

```js
// src/javascripts/main.js

// 削除
// import my from './my';
import './reactApp.jsx';
import '../stylesheets/main.scss';

// 削除
// import add from './add.ts';
// console.log(add(3, 9));
// console.log('This is index.js');
// my();
```

### 見た目の調整

- `footer.scss`を`_footer.scss`に
- `_menu.scss`を作成

```scss
// src/stylesheets/main.scss

// _ アンダースコアはなくても読み込んでくれる
@import 'menu.scss';
@import 'footer.scss';

html, body, div, p, img, h1, h2, h3, h4, h5 {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: sans-serif;
}

h1 {
  font-size: 2em;
}

.container {
  width: 980px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0.5em;
}

.main-image {
  background-image: url('../images/thumbnail.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 2em;
  margin: 1em 0;
}

.icon {
  background-color: #fff;
  width: 64px;
  height: 64px;
  border-radius: 32px;
  padding: 4px;
  position: absolute;
  top: 1em;
  left: 1em;
}
```

```scss
// src/stylesheets/_footer.scss

.footer {
  background-color: #ddd;
  text-align: center;
  padding: 3em;
  font-size: 0.8em;
  letter-spacing: 1px;
  border-radius: 0.5em;
}
```

```scss
// src/stylesheets/_menu.scss

.menu {
  display: flex;
  margin-bottom: 4em;
  &__item {
    margin-right: 0.5em;
    a {
      padding: 0.5em;
      border-bottom: 4px solid #ddd;
      text-decoration: none;
      &:hover {
        color: green;
      }
    }
  }
}
```


```pug
// src/templates/_layout.pug

body
  // 追加
  .container
    // ネスト
    include _menu.pug
    h1 #{title}
    block content
    // 追加
    .footer
      | Webpack Course
```

```pug
// src/templates/index.pug

extends _layout.pug
block locals
  - var title = 'Hello Pug!'
block content
  #vue-root
  #react-root
  .main-image
    img.icon(src="../images/icon.png")
```

```pug
// src/tempates/_menu.pug

.menu
  .menu__item
    a(href="/index.html") index.html
  .menu__item
    a(href="/access.html") access.html
  .menu__item
    a(href="/members/taro.html") members/taro.html
```

#### 背景画像

スタイルシートからのパスがずれているので修正します。
`publicPath`を追加しました。

```js
// webpack.config.js

{
  // ...

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'javascripts/main.js',
    // 追加
    // 4.x では file-loader のオプションとして追加しましたが、
    // 5.x では Asset Modules を使うので output の中に入れます。
    publicPath: '/',
  },

  // ...
}

```

### styled-component

Reactのスタイルシートを効率的に書ける方法を紹介します。

- [Styled Component](https://styled-components.com/)

```shell
% npm view styled-components
# latest: 5.2.1

% npm install --save-dev styled-components@5.2.1
```

```jsx
// src/javascripts/Alert.jsx

import * as React from 'react';
import styled from 'styled-components';

// 追加
const AlertContainer = styled.div`
  background-color: green;
  color: #fff;
  padding: 1em;
`;

const Alert: React.FC<{ message: string }> = ({ message }) => {
  {/* divを置き換え */}
  return (
    <AlertContainer>
      {message}
    </AlertContainer>
  );
};

// ...
```

Styled component を使うと通常のCSSと同じようにスタイルを記述でき、なおかつ、コンポーネントの中だけにスタイルを閉じ込めることができるメリットがあります。
無理して使う必要はありませんが、Reactで実装する時は検討してみてください。
