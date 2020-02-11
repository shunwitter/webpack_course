# Section 12

このブランチの前に行ったこと
--------------------------------

- Reactのインストール
- Reactのレンダリング

　　
　　

このブランチで行ったこと
--------------------------------

### Vue

- [https://vuejs.org/](https://vuejs.org/)
- https://vue-loader.vuejs.org/guide/#manual-setup

Vueも人気のJSフレームワークですので、導入方法を簡単に説明します。
実際にはReactとVueを同じウェブサイトに採用することはないと思いますので、必要な方を選択してください。

Babelの設定は完了していますので、Vueの設定のみ説明していきます。

```shell
% npm view vue
# latest: 2.6.11

% npm view vue-loader
# latest: 15.8.3

% npm view vue-template-compiler
# latest: 2.6.11

% npm install --save-dev vue-loader@15.8.3
% npm install --save-dev vue@2.6.11
% npm install --save-dev vue-template-compiler@2.6.11 # vueのバージョンと合わせる
```

```js
// webpack.js.config

// 追加
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// ...

  module: {
    rules: [
      // 追加
      {
        test: /\.vue/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-loader',
          }
        ],
      },
    ],
  },
  // ...
  plugins: [
    // 追加
    new VueLoaderPlugin(),
  ],

// ...
```

ビルドエラーがないことを確認しましょう。

```shell
% npm run build
```

### Vueコンポーネント

`src/javascripts/vueApp.vue`を作成します。
シンタックスハイライトがインストールされていない場合は、VScodeが自動でお勧めを表示してくれると思いますので、インストールしてください。

```vue
<!-- src/javascript/VueApp.vue -->

<template>
  <p>{{ message }}</p>
</template>

<script>
export default {
  data: () => {
    console.log('Vuejs is installed');
    return {
      message: 'Hey, this is Vue!',
    }
  },
};
</script>

<style scoped>
p {
  color: green;
}
</style>
```

```js
// src/javascripts/main.js

// 追加
import Vue from 'vue';
import VueApp from'./VueApp.vue';

import my from './my';
import './reactApp.jsx';
import '../stylesheets/main.scss';

console.log('This is index.js');
my();

// 追加
new Vue({
  el: '#vue-root',
  render: (h) => h(VueApp),
});
```

ブラウザで確認して`Vuejs is installed`がコンソールに表示されれば成功です。

```shell
npm start
```

#### レンダリング

最後に、作成したVueコンポーネントをマウントしましょう。
指定したIDを持つ`div`を`index.pug`に配置します。

```pug
// src/templates/index.pug

extends _layout.pug
block locals
  - var title = 'Hello Pug!'
block content
  // 追加
  div#vue-root
  div#react-root
  img(src="../images/icon.png")
  img(src="../images/thumbnail.jpg")
```

ブラウザを確認して、DOMに`Hey, this is Vue!`と描画されればOKです。

これでVueアプリも導入することができました。
SPA(Single Page Application)として実装しても良いですし、一部の複雑なUIに使用することもできます。




