# Section 1

このブランチの前に行ったこと
--------------------------------

### Gitのメリット

- 変更履歴のトラッキング
- ロールバック
- ブランチごとの開発

### Githubのメリット

- デファクトスタンダード
- チーム開発

### githubの登録
https://github.com/

- 登録方法

### Gitのインストール
https://git-scm.com/

- homebrewとMacOSインストーラーのバージョンは異なる

### Git user.name を設定

- 任意の文字列でOK
- 各コミットに記録される
- 後でも変更できる

```shell
# 確認
% git config user.name
=> shunwitter

# 設定
# --globalが無いと単独のレポジトリのみ適応
% git config --global user.name "shun"

# 確認
% git config user.name
=> shun
```

### Git user.email を設定

GithubはGithubアカウントとコミットを紐付けるために`user.email`を使用しています。
すべての変更履歴はこのメールアドレスとともに記録され、誰が加えた変更なのかがひと目で分かります。

```shell
# 確認
% git config user.email

# 設定
# --globalが無いと単独のレポジトリのみ適応
% git config --global user.email "xxx.xxx@gmail.com"

# 確認
% git config user.email
=> xxx.xxx@gmail.com
```

設定はこれで完了なのですが、プライベートなメールアドレスを公にしたくない人もいると思います。
普段使っているメールアドレスを登録しても、迷惑メールが増えるといったことは無いと思いますが、心配な人は下記の手順に従ってください。

#### プライベートなメールアドレスを隠す方法

Settings > Emails > Keep my email addresses private

チェックボックスするとメールアドレスが生成されます。

> Keep my email addresses private
> We’ll remove your public profile email and use `3123900+shunwitter@users.noreply.github.com` when performing web-based Git operations (e.g. edits and merges) and sending email on your behalf. If you want command line Git operations to use your private email you must set your email in Git.

こちらもチェックしておきます。

> Block command line pushes that expose my email
> If you push commits that use a private email as your author email we will block the push and warn you about exposing your private email.

`3123900+shunwitter@users.noreply.github.com` をuser.emailに使用しましょう。

```shell
# 設定
# --globalが無いと単独のレポジトリのみ適応
% git config --global user.email "3123900+shunwitter@users.noreply.github.com"

# 確認
% git config user.email
=> 3123900+shunwitter@users.noreply.github.com
```


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

Host github.com
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

Host github.com
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

### Githubへのプッシュ

Githubとの連携ができましたので、手元のGitの変更履歴をGithubに送ってみたいと思います。

- レポジトリを作成

```shell
% git init
% git remote add origin xxxxxx
% vim test.md
% git add .
% git commit -m 'Initial commit'
% git push
```

コミット履歴を確認し、URLの最後に`.patch`と付け加えてリターンを押します。

- 例：
  - https://github.com/user_name/repo_name/commit/xxxxxxxxx78c1303931ce67.patch

変更履歴が表示されますが、下記を確認してください。

- 自分の`user.name`が設定されている
- 自分の`user.email`が設定されている
- メールアドレスを隠した人は、メールアドレスが`noreply`である



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

#### 入れておいた方が良い設定

- 行末のホワイトスペースを削除
  - files.trimTrailingWhitespace
- 最後に空行を入れる
  - files.insertFinalNewline

### Tips

- ファイル検索
  - ⌘ + P
- 元の場所に戻る
  - ^ + _

### 基本的なウェブサイトの構成

- index.html
- javascripts/
  - main.js
- stylesheets/
  - main.css
- images/
  - thumbnail.jpg

　　

このブランチで行ったこと
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
