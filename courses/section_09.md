# Section 9

このブランチの前に行ったこと
--------------------------------

- node-sass と sass-loader のインストール
- Sassの基本

　　
　　

このブランチで行ったこと
--------------------------------

### Javascriptの効率化

`my.js`ではアローファンクションを使用しています。

```js
// my.js
export default () => {
  console.log('this is module');
};
```

ビルド後のJSを見ると`(() => {\n  console.log('this is module');`この辺りが該当のコードであると推測できます。

```js
// dist/javascripts/main.js

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n  console.log('this is module');\n});\n\n\n//# sourceURL=webpack:///./src/javascripts/my.js?");
```

`() => {}`という記法ですが、ECMAScript 6 (ES6)から導入された関数定義の方法です。
比較的新しい記法（といっても数年前ですが）なので、IE11は対応していません。

参考：https://caniuse.com/#search=arrow%20function

IE11に対応するには、ES5で書く必要があります。

```js
// my.js
export default function() {
  console.log('this is module');
};
```

ビルドすると下のようになります。

```js
// dist/javascripts/main.js

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function() {\n  console.log('this is module');\n});;\n\n\n//# sourceURL=webpack:///./src/javascripts/my.js?");
```

`(function() {\n  console.log('this is module');` このように変更されました。
これでIE11でも動作するようになりましたが、ES6の便利な記法が使えないのは残念です。

Webpackを利用してES6を使いつつ、ES5に自動的に変換するよう設定していきましょう。

### Babel

- [babel-loader](https://github.com/babel/babel-loader)
- 依存ライブラリ
  - `@babel/core`
  - `@babel/preset-env`

```shell
% npm view babel-loader
# latest: 8.0.6

% npm view @babel/core
# latest: 7.8.4

% npm view @babel/preset-env
# latest: 7.8.4

% npm install --save-dev babel-loader@8.0.6
% npm install --save-dev @babel/core@7.8.4
% npm install --save-dev @babel/preset-env@7.8.4
```

```js
// webpack.config.js

    // ...

    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ]

    // ...
```

`rules`に追加します。
`my.js`はアローファンクションに戻しておきましょう。

```js
// src/javascripts/my.js

export default () => {
  console.log('this is module');
};
```

ビルドすると、アローファンクションがES5の関数定義に変換されると思います。

```shell
% npx webpack --mode=development
```

```js
// dist/javascripts/main.js

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function () {\n  console.log('this is module');\n});\n\n//# sourceURL=webpack:///./src/javascripts/my.js?");
```

### プリセット

```js
options: {
  presets: ['@babel/preset-env'],
},
```

Babelはプラグインを追加して必要な機能を加えていくのですが、一つずつ追加していくのは面倒です。
そこで、あらかじめ用意されたプラグインのセットが使用する方法が`presets`オプションです。

プリセットには複数の種類がありますが、ここでは[@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env.html)を使用しています。
その他は[こちら](https://babeljs.io/docs/en/presets)を参照してください。

### preset-env

今回使用した`preset-env`ですが、オプションを設定してターゲットのブラウザを指定することができます。

例えば、`0.25%以上のシェア`があり、`公式サポートが終了していない`ブラウザで動作するようにJavascriptをトランスパイルする設定は下記のようになります。

```js
options: {
  presets: [
    ['@babel/preset-env', { "targets": "> 0.25%, not dead" }],
  ],
},
```

試しに、シェアが30%あるブラウザだけを対象にしてみましょう。
2020年2月の段階だと、Chromeだけが対象になるはずです。

```js
options: {
  presets: [
    ['@babel/preset-env', { "targets": "> 30%, not dead" }],
  ],
},
```

```shell
% npx webpack --mode=development
```

結果を確認するとアローファンクションが復活しています。
最新ブラウザだけを対象にすれば良いので、Babelでの変換が不要になった結果です。

```js
// dist/javascripts/main.js

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n  console.log('this is module', newObj);\n});\n\n//# sourceURL=webpack:///./src/javascripts/my.js?");

```

設定を戻しておきましょう。

```js
options: {
  presets: [
    ['@babel/preset-env', { "targets": "> 0.25%, not dead" }],
  ],
},
```

対象ブラウザの設定方法については、[こちら](https://github.com/browserslist/browserslist)を参考にしてください。

### ES6

他にもモダンなJavascriptでは便利が機能が使えますので、ご自身で調べてみてください。

#### Spread syntax

```js
// src/javascripts/my.js

export default () => {
  const obj = { a: 1, b: 2 };
  const newObj = { ...obj, c: 3 };
  console.log('this is module', newObj);
};
```

```js
// dist/javascripts/mainn.js

(function () {\n  var obj = {\n    a: 1,\n    b: 2\n  };\n\n  var newObj = _objectSpread({}, obj, {\n    c: 3\n  });\n\n  console.log('this is module', newObj);\n});
```

参考サイト：
https://www.taniarascia.com/es6-syntax-and-feature-overview/
