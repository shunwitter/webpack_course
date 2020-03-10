# Section 14

このブランチの前に行ったこと
--------------------------------

- Vueのインストール
- Vueのレンダリング

　　
　　

このブランチで行ったこと
--------------------------------

- [TypeScript](https://www.typescriptlang.org/)
- [ts-loader](https://github.com/TypeStrong/ts-loader)
- https://webpack.js.org/guides/typescript/

TypeScriptを使うと、Javascriptの世界にいながら型を利用できます。
型を使うと可読性が高まるだけでなく、事前にエラーを防止してくれますのでお勧めです。

```shell
% npm view typescript
# latest: 3.7.5

% npm view ts-loader
# latest: 6.2.1

% npm install --save-dev typescript@3.7.5
% npm install --save-dev ts-loader@6.2.1
```

```js
// webpack.config.js

    // 追加
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
```

#### tsconfig.json

`tsconfig.json`という[設定ファイル](https://webpack.js.org/guides/typescript/#basic-setup)をルートに作成します。

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "noImplicitAny": false
  },
}
```

初めてのTypeScriptを作成します。
拡張子は`.ts`になります。

```ts
// src/javascripts/add.ts

export default (a: number, b: number): string => {
  return `Result is ${a + b}!`;
}
```

```js
// src/javascripts/main.js

import Vue from 'vue';
import VueApp from'./VueApp.vue';

import my from './my';
import './reactApp.jsx';
import '../stylesheets/main.scss';

// 追加(.tsを付けてくだだい)
import add from './add.ts';
// 追加
console.log(add(3, 9));
console.log('This is index.js');
my();

new Vue({
  el: '#vue-root',
  render: (h) => h(VueApp),
});

```

`:number`や`:string`が型定義です。
型を使って、数字を入力すると、文字列が出力される、ということが明確になりました。

ブラウザのコンソールを確認してください。下のように出力されます。

```
Result is 12!
```


### ReactコンポーネントをTypeScriptで作成する

ReactもTypeScriptで書くことによって可読性が高まります。
`.tsx`という拡張子を使ってReactコンポーネントを作成しましょう。
`.tsx`はすでにWebpackの設定ファイルに追加済です。

```tsx
// src/javascripts/Alert.tsx

import * as React from 'react';

const Alert: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div style={{ backgroundColor: 'green', color: '#fff', padding: '1em' }}>
      {message}
    </div>
  )
};

export default Alert;
```

#### `main.js`に読み込み

作成した`Alert`を以前作成したReact(`src/javascripts/reactApp.jsx`)に読み込んでみたいと思います。
拡張子`.tsx`を忘れないでください。

```js
// src/javascripts/reactApp.js

import ReactDom from 'react-dom';
import * as React from 'react';
// 追加
import Alert from './Alert.tsx';

const App = (props) => {
  return (
    <div>
      Hello, React App!
      {/* 追加 */}
      <Alert message="Success!" />
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

ブラウザにグリーンのアラートが表示されていれば成功です。

```shell
% npm start
```

### @typesのインストール

`Alert.tsx`が無事レンダリングできましたが、1行目にVScodeのアラートが出ているかもしれません。

```
Could not find a declaration file for module 'react'. '/Users/ss/Dev/webpack_course/node_modules/react/index.js' implicitly has an 'any' type.
```

`react`の型定義が見つからないというアラートなので、インストールします。

```shell
% npm view @types/react
# latest: 16.9.19

% npm install --save-dev @types/react@16.9.19
```

完了したらアラートも消えるかと思います。

このようにTypeScriptは、`.js.` `.jsx` 等と混在して使用することができるので、少しずつ型定義を利用できる柔軟性があります。もちろんJavascriptのみでウェブサイトを制作しても全く問題ありません。慣れてきたら少しずつTypeScriptを導入すると良いと思います。
