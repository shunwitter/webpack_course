# Section 14

このブランチの前に行ったこと
--------------------------------

- 画像の最適化

　　
　　

このブランチで行ったこと
--------------------------------

### React

- https://reactjs.org/

Reactは[create-react-app](https://github.com/facebook/create-react-app)コマンドで簡単にセットアップが完了しますが、SPA(Single Page Application)を前提としたファイル構成になっています。ファイル構成を自分で決めたい場合や、既存のウェブサイトにReactを導入したい場合などには、Webpackを自分で設定すると柔軟に対応することができます。

今まで説明してきたことの応用ですので、スムーズに導入できるかと思います。

#### @babel/preset-react

Babelのセクションで解説しましたが、presetとはBabelのプラグインリストです。
`@babel/preset-env`はES6/7の便利な機能を含んでいますが、Reactに必要なプラグインが不足しています。
Reactに対応するには`@babel/preset-react`をインストールします。

```shell
% npm view @babel/preset-react
# latest: 7.8.3

% npm install --save-dev @babel/preset-react@7.8.3
```

```js
// webpack.config.js

{
  test: /\.(js|jsx)/, // 変更
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { "targets": "> 0.25%, not dead" }],
          // 追加
          '@babel/preset-react',
        ],
      },
    },
  ],
},
```

ビルドしてエラーがないか確認します。

#### react/react-dom

Reactの本体をインストールします。

```shell
% npm view react
# latest: 16.12.0

% npm view react-dom
# latest: 16.12.0

% npm install --save-dev react@16.12.0
% npm install --save-dev react-dom@16.12.0
```

#### Reactコンポーネント

Reactのコンポーネントを作成します。

```jsx
// reactApp.jsx

import ReactDom from 'react-dom';
import * as React from 'react';

const App = (props) => {
  return (
    <div>
      Hello, React App!
    </div>
  );
};

const reactRoot = document.getElementById('react-root');
if (reactRoot) {
  ReactDom.render(<App />, reactRoot);
} else {
  console.log('No root element found');
}
```

```shell
% npm start
```

ブラウザのコンソールに`No root element found`と出ていれば成功です。

#### コンポーネントをマウント

```pug
// src/templates/index.pug

extends _layout.pug
block locals
  - var title = 'Hello Pug!'
block content
  // 追加
  div#react-root
  img(src="../images/icon.png")
  img(src="../images/thumbnail.jpg")
```

これでReactのコンポーネントがマウントできました。
