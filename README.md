# Section 3

### nodejsのインストール

- nvm
  - https://github.com/nvm-sh/nvm
- node
  - https://nodejs.org/en/


#### nvm

```shell
# Mac
% curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

# 確認
% vim ~/.zshrc

# ターミナルを再起動
% nvm --version
=> 0.35.2
```


#### node

```shell
# インストール可能なnodeバージョンを確認
% nvm ls-remote

       v12.13.0   (LTS: Erbium)
->     v12.13.1   (LTS: Erbium)
       v12.14.0   (LTS: Erbium)
       v12.14.1   (LTS: Erbium)
       v12.15.0   (Latest LTS: Erbium)

# 特定のnodeバージョンをインストール
% nvm install 12.15.0

# インストールされているnodeバージョンを確認
% nvm ls
->     v12.13.1

# 現在のnodeバージョンを確認
% node --version
v12.13.1
```
　　
#### Webpackのインストール

```shell
% npm init

% npm view webpack
# latest: 4.41.5

% npm view webpack-cli
# latest: 3.3.10

% npm install --save-dev webpack@4.41.5 webpack-cli@3.3.10
```

#### --save / --save-dev / オプションなしの違い

- `--save dependencies` を付けると `dependencies` に入る
- `--save-dev` を付けると `devDependencies` に入る

コードをパッケージ化して公開する時に影響する。
dependenciesは `npm install` の際に一緒にインストールされる。
devDependenciesは `npm install` してもインストールされない。

今回は自分用のプロジェクトであり、パッケージ化しないので、すべて `devDependencies` で良い。
もしモジュールとして他の人が使えるパッケージにしたい、という場合は `dependencies` を使っていく。


### 初めてのビルド

```shell
% mkdir src // Webpackのデフォルト設定（後で変更することもできます）

### VScodeが立ち上がります
% code index.js

% npx webpack
% npx webpack --mode=development
```

### 確認

```shell
% code dist/main.js
```

### モジュールを読み込む

```shell
% mkdir ./src/modules
% code ./src/modules/my.js
```

```js
// modules/my.js

export default () => {
  console.log('this is module');
};


// src/index.js

import my from './modules/my';

console.log('This is index.js');
my();
```


### gitignore

ここまで来たらGitにコミットしてGithubにプッシュしましょう。
その前に `.gitignore` を作成します。

```shell
% code .gitignore
```

```
# .gitignore

node_modules/
```

これで `node_module` をGitの追跡から外すことができます。
