
# Section 16

このブランチの前に行ったこと
--------------------------------

- レイアウトの修正
- `publicPath`の修正
- Styled Componentの導入

　　
　　

このブランチで行ったこと
--------------------------------

### Github Page として公開する

- https://pages.github.com/

Githubでは、`/docs`フォルダをウェブサイトとして公開することができます。

現在のWebpackの設定では、ビルド後のファイルは`dist`フォルダに保存されています。
Webpackのデフォルトの挙動ですが、これを修正します。

```js
// webpack.config.js

module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  entry: {
    main: './src/javascripts/main.js',
  },
  output: {
    path: path.resolve(__dirname, './docs'), // 変更
    filename: 'javascripts/main.js',
  },
  // ...
}
```

#### ビルド

```shell
% npm run build
```

ビルドすると`dist`ではなくて`docs`フォルダに保存されました。
`dist`フォルダは不要なので削除してしまいましょう。

この状態でmasterブランチをGithubuにpushします。

```shell
% git add .
% git commit -m 'Emit files to docs'
% git push
```



### Netlify
