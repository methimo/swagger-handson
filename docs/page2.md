# 2. 実践編

## 2-1. SwaggerEditor を使って API の仕様を書く

- 基礎編でも触れましたが、OpenAPISpec の方がバージョンが新しいのでこの後は OpenAPISpec に寄せて説明します
- [SwaggerEditor](https://editor.swagger.io/) にアクセス
- 左側は YAML のエディタ、右側は SwaggerUI によって生成されるドキュメント
- Slack で配布した`petsore.yaml`の中身をコピーし、SwaggerEditor の貼り付けると、SwaggerUI が生成される
  <img src="/images/se.png" width="50%">

- 適当なところを編集してみましょう。11 行目を編集します

```yaml
servers:
  - url: "http://localhost:8080/v2"
```

- 右側の SwaggerUI の Servers も v2 に変更されました
- このように YAML を編集することでリアルタイムに設計書を反映させることができます

- OpenAPISpec は以下要素で構成されます
  |要素|必須|概要|
  |----|----|----|
  |openapi|○|OpenAPISpec のバージョンを記載。openapi の場合 3.0.0 を指定。Swagger を指定する場合は`swagger:"2.0"`|
  |info |○|API のバージョンや作成者などメタ情報|
  |servers |-|接続先を記載|
  |paths |○|API のエンドポイントと、具体的にどのような操作ができるかを表現|
  |components |-|YAML 内の子要素を定義|
  |security |-|API の認証方法を定義|
  |tags |-|SwaggerUI 用のタグ情報を定義|

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
