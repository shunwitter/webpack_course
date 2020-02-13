# Section 1

このブランチの前に行ったこと
--------------------------------

### gitのインストール
https://git-scm.com/


### githubの登録
https://github.com/

- 登録方法
- レポジトリの作成の作成方法


### sshでgithubと接続する

参考：
- https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh
- https://laboradian.com/how-to-use-ssh-agent/
- https://qiita.com/shizuma/items/2b2f873a0034839e47ce
- https://qiita.com/naoki_mochizuki/items/93ee2643a4c6ab0a20f5

#### パスフレーズなしの方法

```shell
% cd ~/.ssh

# id_rsa を確認して上書きしないようにする
% ls -la

% ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

Generating public/private rsa key pair.
Enter file in which to save the key (/Users/(username)/.ssh/id_rsa): id_rsa_github
Enter passphrase (empty for no passphrase):
Enter same passphrase again:

% ssh -T git@github.com -i ~/.ssh/id_rsa_github
```

#### パスフレーズありの方法

```shell
% cd ~/.ssh

# id_rsa を確認して上書きしないようにする
% ls -la

% ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

Generating public/private rsa key pair.
Enter file in which to save the key (/Users/(username)/.ssh/id_rsa): id_rsa_github
Enter passphrase (empty for no passphrase): test
Enter same passphrase again: test

% ssh -T git@github.com -i ~/.ssh/id_rsa_github
Enter passphrase for key '/Users/ss/.ssh/id_rsa_github': test
# => Hi shunwitter! You've successfully authenticated, but GitHub does not provide shell access.
```

#### コマンドを省略する方法

```shell
% vim ~/.ssh/config

Host github
  HostName github.com
  IdentityFile ~/.ssh/id_rsa_github
  User git

# これだけで接続できる
% ssh -T github
Enter passphrase for key '/Users/ss/.ssh/id_rsa_github': test
# => Hi shunwitter! You've successfully authenticated, but GitHub does not provide shell access.
```

#### パスフレーズの入力を省略する方法
https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

```shell
%vim ~/.ssh/config

Host github
  HostName github.com
  IdentityFile ~/.ssh/id_rsa_github
  User git
  AddKeysToAgent yes # add
  UseKeychain yes # add

# ssh-agentを起動
% eval "$(ssh-agent -s)"
Agent pid 26771

# ssh-agentにSSHキーを追加して、キーチェーンにパスフレーズを保存(Mac限定)
% ssh-add -K ~/.ssh/id_rsa_github
Enter passphrase for /Users/ss/.ssh/id_rsa_github: test
Identity added: /Users/ss/.ssh/id_rsa_github (your_email@example.com)

% ssh -T github
# => Hi shunwitter! You've successfully authenticated, but GitHub does not provide shell access.
# パスフレーズの入力が不要になった。

# ssh-agentを終了させる
# キーチェーンにパスフレーズが登録してあるので、次回からも入力不要。
% ssh-agent -k
```

### VSCodeのインストール
https://code.visualstudio.com/

#### codeコマンド
https://code.visualstudio.com/docs/setup/mac

- `command + shift + p`
- `shell`を検索
- `Shell Command: Install 'code' command in PATH`を選択

```shell
code index.html
```

### 基本的なウェブサイトの構成

- index.html
- javascripts/
  - main.js
- stylesheets/
  - main.css
- images/
  - thumbnail.jpg


### gitの初期化

```
% git init
% git add .
% git commit -m 'Initial commit'
```


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
　　
　　

このブランチで行ったこと
--------------------------------


#### Webpackのインストール

```shell
% npm init

% npm view webpack
# latest: 4.41.5

% npm view webpack-cli
# latest: 3.3.10

% npm install --save-dev webpack@4.41.5 webpack-cli@3.3.10
```


### 初めてのビルド

```shell
% mkdir src // Webpackのデフォルト設定（後で変更することもできます）

# VScodeが立ち上がります
% code index.js

% npx webpack
% npx webpack --mode=development
```


### 確認

```shell
% code dist/main.js
```
