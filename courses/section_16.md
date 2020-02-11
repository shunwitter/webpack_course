
# Section 16

このブランチの前に行ったこと
--------------------------------

- レイアウトの修正
- `publicPath`の修正
- Styled Componentの導入

　　
　　

このブランチで行ったこと
--------------------------------

### Netrifyでサイトを公開する

- https://www.netlify.com/

Netrifyは静的ウェブサイトを簡単に公開することができるサービスです。
Githubと連携させることができ、pushするだけで公開が完了します。

単純なウェブサイトホスティングだけであれば無料で使用できます。
Netrifyを使わなくても、その他いろいろなサービス（例えばAWSやレンタルサーバー）でホスティングできますので、都合の良いものを選択してください。

#### New site from Github
<img width="531" alt="netrify_1" src="https://user-images.githubusercontent.com/3123900/74247337-3f58bf00-4d29-11ea-9730-6808035c09e8.png">

#### Githubを選択
<img width="700" alt="netrify_2" src="https://user-images.githubusercontent.com/3123900/74247350-4253af80-4d29-11ea-9beb-10d745716872.png">

#### レポジトリを選択
<img width="600" alt="netrify_3" src="https://user-images.githubusercontent.com/3123900/74247353-42ec4600-4d29-11ea-93a4-412014be3dd6.png">

#### ビルドコマンドとフォルダを設定

- `npm run build`
- `dist`

<img width="600" alt="netrify_4" src="https://user-images.githubusercontent.com/3123900/74247356-441d7300-4d29-11ea-80f2-bcb81f964dcf.png">

### ドメイン

サブドメインをカスタマイズします。サブドメインはNetrifyでユニークになる必要があります。
カスタムドメインを設定することもできますので、興味ある方は調べてみてください（といっても非常に簡単です）。

<img width="600" alt="netrify_5" src="https://user-images.githubusercontent.com/3123900/74247827-09680a80-4d2a-11ea-92e0-2f0dbf1f3f40.png">

### キャッシュ対応

画像やCSSなどはブラウザにキャッシュされますが、タイミングによっては更新しても変更が反映されない場合があります。
ブラウザのキャッシュをクリアすれば良いのですが、エンドユーザーにはキャシュクリアを要求することはできません。

そこで、ファイル名を変更して無理やりキャッシュをクリアしてしまいます。
画像のセクションで使った`[name]`と、新たに`[hash]`を使います。

```js
// webpack.config.js

  // ...

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'javascripts/[name]-[hash].js', // 変更
  },

  // ...

          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: 'images/[name]-[hash].[ext]', // 変更
              publicPath: '/',
            },
          },

  // ...

  plugins: [
    new MiniCssExtractPlugin({
      filename: './stylesheets/[name]-[hash].css', // 変更
    }),
  ]

  // ...
```

ビルドしてファイルを確認してみてください。ハッシュ値がファイル名に付いていると思います。

```shell
% npm run build

                                                Asset       Size  Chunks                         Chunk Names
          ./stylesheets/main-4c8c9622edc2648b0bd2.css  860 bytes       0  [emitted] [immutable]  main
     images/icon-968be9d129410e2475848d3c6e948755.png    3.8 KiB          [emitted]              
images/thumbnail-045274200ab5e6c3400be67a8f03a729.jpg    125 KiB          [emitted]              
             javascripts/main-4c8c9622edc2648b0bd2.js    161 KiB       0  [emitted] [immutable]  main
```

### デプロイ

Githubにプッシュして、リリースしましょう。

```shell
% git add .
% git commit -m 'Add hash to filename'
% git push
```

こちらに公開されました。
[https://webpack-course.netlify.com/](https://webpack-course.netlify.com/)
