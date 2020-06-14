# 2. Docker の基本コマンド

- まずは適当なコンテナを起動させてみます

## コンテナイメージ取得〜起動

```
docker search hello-world
docker pull hello-world
docker images | grep hello-world
```

- hello-world という名前のコンテナイメージを公式の DockerHub から取得しました
- 現在自分のリポジトリに hello-world というコンテナイメージがあります
- hello-world コンテナイメージからコンテナを起動しましょう

```
docker run --name hello-world-machida hello-world
```

- hello-world コンテナイメージから hello-world-machida という名前のコンテナを作成して起動しました
- `Hello from Docker! ~略~` が表示されれば OK です
- このコンテナはメッセージを表示するだけのものです
- 起動中のコンテナを調べてみます

```console
docker ps
```

- 何も存在しません
- コンテナは処理を全て実行すると終了する特徴があります
- -a オプションをつけると終了したコンテナも含めて表示されます

```console
docker ps -a

> CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS                NAMES
> 944a24018e5d        hello-world         "/hello"                 4 minutes ago       Exited (0) 4 minutes ago                           hello-world-machida
```

- hello-world-machida コンテナが Exited(0)で存在します
- 処理が終わったので削除しましょう

```sh
docker rm hello-world-machida
docker ps -a
```

- 削除できない場合はコンテナ ID を指定して削除してください

## コンテナイメージ作成

- 今までは完成しているコンテナイメージを取得していました
- コンテナイメージを作成してみます

```
mkdir node-docker
```

- 適当なエディタで以下ファイル群を作成します
- `node-docker/server.js`

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
console.log(`Running on http://${HOST}:${PORT}`);
```

- `node-docker/package.json`

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

- `node-docker/Dockerfile`

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

- `node-docker/.dockerignore`

```dockerfile
node_modules
npm-debug.log
```

- ファイル群を作成したらコンテナイメージをビルドします

```sh
cd node-docker

ls -la
#4ファイルがあることを確認

docker build -t hello-node-docker .
# Successfully tagged machida/hello-node:latest が表示されればOK

docker images
# hello-node-docker イメージが作成されていればOK
```

- コンテナイメージを作成したのでコンテナを起動します

```sh
docker run --name hello-node-docker -p 9090:8080 -d hello-node-docker
docker ps
# hello-node-docker コンテナが表示されればOK
```

- 起動したコンテナ上で稼働するアプリケーションにブラウザからアクセスします
  [http://localhost:9090](http://localhost:9090)
- HelloWorld が表示されれば OK

```sh
docker logs hello-node-docker
# コンテナ内の標準出力ログを確認するコマンド
# Container Access!!! が表示されればOK
```

- ホスト OS の 9090 ポートとコンテナ OS の 8080 ポートにポートフォワーディングしている
- コンテナ内で 8080 ポートでアプリを起動しているため、ユーザからはホスト OS の 9090 ポートでアクセスできる

![docker1](/images/docker1.png)

- 起動したコンテナの中に入ってみましょう

```sh
node -v
docker exec -it hello-node-docker /bin/bash

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

## まとめ

-
