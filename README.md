# Section 13

このブランチの前に行ったこと
--------------------------------

- ソースマップの出力と確認方法
- `mode`オプション
- npmコマンドの設定

　　
　　

このブランチで行ったこと
--------------------------------

### 画像の最適化

ウェブサイトの中で、画像はビジュアル的にも中心的な要素ですが、データ容量が最も大きなファイルになります。
コードを最適化するのはもちろん有効ですが、時には画像1枚を最適化した方が、最終的な転送量を節約できるということは少なくありません。

現状はビルドすると2ファイルが`dist`フォルダに書き出されますが、それぞれのサイズは下記の通りです。
このままでは少し重いので、[https://www.iloveimg.com/](https://www.iloveimg.com/)等で軽量化して使用した方がベターです。

```shell
% npm run build

         images/icon.png  9.75 KiB          [emitted]
    images/thumbnail.jpg   264 KiB          [emitted]  [big]
```

### 自動化

これらの画像を手作業で画像圧縮するのではなく、自動化したいと思います。

- [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)

```shell
% npm view image-webpack-loader
# latest: 6.0.0

% npm install --save-dev image-webpack-loader@6.0.0
```

```js
// webpack.config.js

{
  test: /\.(png|jpg|jpeg)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        esModule: false,
        name: 'images/[name].[ext]',
      },
    },
    // 追加
    {
      loader: 'image-webpack-loader',
    },
  ],
},
},
```

ビルドしてサイズを確認してみましょう。

```shell
% npm run build

         images/icon.png  3.8 KiB          [emitted]
    images/thumbnail.jpg  189 KiB          [emitted]
```

先程よりサイズが減少しました。
オプションを追加して、さらに軽量化してみたいと思います。

```js
// webpack.config.js

{
  test: /\.(png|jpg|jpeg)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        esModule: false,
        name: 'images/[name].[ext]',
      },
    },
    {
      loader: 'image-webpack-loader',
      // 追加
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65,
        },
      },
    },
  ],
},
```

```shell
% npm run build
         images/icon.png  3.8 KiB          [emitted]
    images/thumbnail.jpg  125 KiB          [emitted]
```

写真の色調が少し失われましたが、悪くはないと思います。
何より、サイズが最初の半分になりました。140KB近く節約できています。

コードを最適化して140KBを減らすには中々大変ですが、画像1枚を最適化するだけで大きな効果が得られました。
しかも自動化していますので、圧縮を忘れるということもありません。
画像数が多ければ多いほど、自動化の恩恵が受けられます。

`image-webpack-loader`は`.gif`や`.svg`にも対応しています。
詳しくは[公式ページ](https://github.com/tcoopman/image-webpack-loader#usage)を確認してください。
