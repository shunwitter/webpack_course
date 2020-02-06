このブランチの前に行ったこと
--------------------------------


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


### gitのインストール
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git


### VSCodeのインストール
https://code.visualstudio.com/






このブランチで行ったこと
--------------------------------


#### Webpackのインストール

```shell
% npm init
% npm install --save-dev webpack webpack-cli
```


### 初めてのビルド

```shell
% mkdir src // Webpackのデフォルト設定（後で変更することもできます）
% vim index.js

% npx webpack
% npx webpack --mode=development
```


### 確認

```shell
% code dist/main.js
```


### gitの初期化

```
% git init
% git add .
% git commit -m 'Initial commit'
```
