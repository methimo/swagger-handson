# 2. 実践編

## 2-1. Swagger を編集して API を描いてみよう

- https://editor.swagger.io/ にアクセス
- 左側は YAML のエディタ、右側は生成される
- Slack で配布した`petsore.yaml`の中身をコピーし、SwaggerEditor の

```

```

- hello-world という名前のイメージを DockerHub から検索し、取得しました
- 現在自分のリポジトリに hello-world イメージがあります
- イメージからコンテナを起動しましょう

```
docker run --name hello-world-machida hello-world
```

- hello-world イメージから hello-world-machida という名前のコンテナを作成して起動しました
- `Hello from Docker! ~略~` が表示されれば OK です
- このコンテナはメッセージを表示するだけのものです
- 起動中のコンテナ一覧を取得します

```sh
docker ps
```

- 何も存在しません
- コンテナは処理を全て実行すると終了する特徴があります
- docker ps -a オプションをつけると終了したコンテナも含めて表示されます

```sh
docker ps -a

> CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS                NAMES
> 944a24018e5d        hello-world         "/hello"                 4 minutes ago       Exited (0) 4 minutes ago                           hello-world-machida
```

- 処理が終わったのでコンテナを削除します

```sh
docker rm hello-world-machida
docker ps -a
```

- 続いてイメージも削除します

```
docker rmi hello-world
docker images
```

- 削除できない場合はコンテナ ID(16 真数の文字列) を指定して削除してください

## 2-2. コンテナイメージ作成

- 2-1 では完成しているイメージを取得してコンテナを起動しました
- 今度はイメージを作成します
- まずはホスト OS 側で作業用ディレクトリを作成します

```
mkdir node-docker
```

- ディレクトリの配下に以下 4 ファイルを作成します
- 好きなエディタを開いて編集してください

1. `node-docker/server.js`
   - アプリケーションロジックファイル

```jsx
"use strict";
const express = require("express");
const dayjs = require("dayjs");

const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const message =
    time +
    ` Container Access!!!
`;
  console.log(message);
  res.send("Hello World");
});

app.listen(PORT, HOST);
```

2. `node-docker/package.json`
   - js のライブラリ依存関係を記載したファイル

```json
{
  "name": "docker_web_app",
  "version": "1.0.0",
  "description": "Node.js on Docker",
  "author": "First Last <first.last@example.com>",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.16.1",
    "dayjs": "^1.8.11"
  }
}
```

3. `node-docker/Dockerfile`
   - イメージの元となるファイル。ベースとなるイメージにディレクトリ作成や資源配置をして、アプリケーション実行環境を構築します

```dockerfile
#Node.js v12がインストールされたベースイメージ
FROM node:12

#アプリケーションディレクトリを作成
WORKDIR /usr/src/app

#アプリケーションの依存関係をインストール
COPY package*.json ./
RUN npm install

#アプリケーションのソースを配置
#ホストOSのカレントディレクトリ配下をコンテナ内の作業ディレクトリにコピー
COPY . .

#コンテナがアクセスを許可するポート指定
EXPOSE 8080

#コンテナ起動時に実行するコマンドを指定
CMD [ "node", "server.js" ]
```

4. `node-docker/.dockerignore`
   - build 時に資源のコピー対象から除外するリストファイル

```dockerfile
node_modules
npm-debug.log
```

- イメージをビルドします

```sh
cd node-docker

ls -la
#4ファイルがあることを確認

docker build -t hello-node-image .
# Successfully tagged hello-node-image:latest が表示されればOK

docker images
# hello-node-image イメージが作成されていればOK
```

- 作成したイメージからコンテナを起動します

```sh
docker run --name hello-node -p 9090:8080 -d hello-node-image
docker ps
# hello-node-docker コンテナが表示されればOK
```

- docker run を単に実行すると、アプリ起動後コンテナは終了してしまいます
- アプリ起動後もコンテナを動かすためにバックグラウンド(-d オプション)で起動します
- コンテナ上で稼働するアプリにブラウザからアクセスします
  [http://localhost:9090](http://localhost:9090)
- HelloWorld が表示されれば OK

:::tip

- DockerToolBox を利用している場合、VirtualBox が建てたマシンの IP になります(以降の演習も同様です)
  - [http://192.168.99.100:9090](http://192.168.99.100:9090)
- 出典：[https://qiita.com/amuyikam/items/ef3f8e8e25c557f68f6a](https://qiita.com/amuyikam/items/ef3f8e8e25c557f68f6a)
  :::

```sh
docker logs hello-node
# コンテナ内の標準出力ログを確認するコマンド
# Container Access!!! が表示されればOK
```

![docker1](/images/docker1.png)

- ホスト OS の 9090 ポートとコンテナの 8080 ポートをバインド
- アプリはコンテナ内で 8080 ポートで起動しているため、ユーザからはホスト OS の 9090 ポートでアクセスできる

- 起動したコンテナの中に入ってみましょう

```sh
node -v
docker exec -it hello-node /bin/bash

== コンテナの中 ==
ls -la
node -v
```

- ホスト OS とコンテナ内の Node のバージョンが異なるのがわかります
- Dockerfile で Node やライブラリをインストールするよう記載しました
- このようにアプリ実行環境の構築をコード化することで、環境構築がいつでも再現できます
- アプリ実行環境を構築済みのイメージがあれば、イメージを元にコンテナを即座に起動できます
- またコンテナ内の環境はホスト OS と独立しているため、ホスト OS の環境を気にせず起動ができます
- そのため、アプリ開発でしばしば起こる「テスト環境と本番環境でモジュールのバージョンが違うので起動に失敗する」がありません

:::tip
docker inspect <コンテナ名>コマンドでコンテナの詳細情報を確認できます
:::

## まとめ

- Dockerfile からイメージを作成、コンテナを起動できた
- アプリ実行環境構築のコード化、ホスト OS との独立により、再現性・可搬性が高い
