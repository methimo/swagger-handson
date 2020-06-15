# 3. Docker あれこれ

## 3-1. 揮発性とファイル永続化

- コンテナで稼働するアプリがログを出力する時を考えます
- `node-docker/server.js` を修正します

```jsx{4,19-23}
"use strict";
const express = require("express");
const dayjs = require("dayjs");
const fs = require("fs");

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

  //ファイル出力
  fs.appendFileSync("log/output.txt", message, (err) => {
    if (err) throw err;
    console.log("ファイルが正常に出力されました。");
  });

  res.send("Hello World");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
```

- 新しく output-node-docker というコンテナイメージを作成してコンテナを起動します

```sh
docker build -t output-node-docker .
docker images
docker run --name output-node-docker -p 9091:8080 -d output-node-docker
docker ps
docker exec -it output-node-docker /bin/bash

== コンテナの中 ==
ls -la
tail -f output.txt
```

::: tip

- Ctl+C でプログラムから抜けられます
  :::
- 今度はホスト OS の 9091 ポートとコンテナ内 8080 ポートをバインドしました
- ブラウザから以下にアクセスすると、output.txt にログが追記されます
  [http://localhost:9091](http://localhost:9091)
- ここで現在起動しているコンテナを削除し、再度同名のコンテナを立ち上げます

```sh
docker stop output-node-docker
docker rm output-node-docker
docker run --name output-node-docker -p 9091:8080 -d output-node-docker
docker ps
docker exec -it output-node-docker /bin/bash

== コンテナの中 ==
ls -la
```

- output.txt がなくなりました
- Docker は、コンテナ自体は起動されても更新は保存されず、明示的にコミットしなければコンテナ破棄時に変更分が消えてしまう性質(揮発性)があります
- そのためログやデータなど、永続化したいファイルがある時はボリュームマウント機能を利用します
- もう一度先ほどのコンテナを削除します

```sh
docker stop output-node-docker
docker rm output-node-docker
```

- ホスト OS 側で適当な場所にファイル永続化用ディレクトリを作成します

```sh
mkdir /Users/machida/Documents/docker-mnt
```

- 以下のようにファイル群を修正します
- `node-docker/Dockerfile`

```dockerfile {5}
#変更部分のみ記載

#アプリケーションディレクトリを作成
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/log
```

- `node-docker/server.js`

```jsx {4}
//変更部分のみ記載

//ファイル出力
fs.appendFileSync("log/output.txt", message, (err) => {
  if (err) throw err;
  console.log("ファイルが正常に出力されました。");
});
```

- 資源を修正したのでイメージをビルドしなおします

```sh
cd <資源が格納されているディレクトリ>
docker build -t output-node-docker .
docker run --name output-node-docker -v <ファイル永続化用ディレクトリのフルパス>:/usr/src/app/log -p 9091:8080 -d output-node-docker
docker ps
```

- アプリにアクセスして output.txt にログを出力させます
  [http://localhost:9091](http://localhost:9091)

- ホスト OS 側から確認します

```sh
cd /Users/machida/Documents/docker-mnt
ls -la
```

- ログファイルが存在します
- ホスト OS の`/Users/machida/Documents/docker-mnt`をコンテナ内の`usr/src/app/log`にマウントしたため、log 配下のファイルはホスト OS 側から確認ができます
- コンテナを削除、再度起動します

```sh
docker stop output-node-docker
docker rm output-node-docker
docker run --name output-node-docker -v mkdir /Users/machida/Documents/docker-mnt:/usr/src/app/log -p 9091:8080 -d output-node-docker
docker exec -it output-node-docker /bin/bash

~コンテナの中~
ls -la log
```

- ログファイルが残っています
- ブラウザからアプリにアクセスすると、先ほどのファイルの続きとして追記できます

## 3-2. DockerRegistry

- イメージを Pull する時に DockerHub からイメージ検索、取得していました
- システム内でイメージを管理したい時に DockerRegistry を用います
- DockerRegistry を構築してみましょう

```sh
mkdir /Users/machida/Documents/registry

docker run -d -p 5000:5000 -v /Users/machida/Documents/registry:/var/lib/registry --name registry registry:2.3.0
```

- オプションの説明

  - -d: バックグラウンドで起動
  - -p: ホスト OS 5000 番ポートとコンテナ内 5000 番ポートをバインド
  - -v: ホスト OS `/User ~`とコンテナ内 `/var/lib/registry`をマウント
  - --name: コンテナ名を指定

- [http://localhost:5000/v2/\_catalog](http://localhost:5000/v2/_catalog)にアクセス
- DockerRegistry のリポジトリ一覧を表示。`{"repositories":[]}`が表示されれば OK

- 続いて DockerRegistry にイメージを Push します

```sh
docker tag output-node-docker:latest localhost:5000/output-node-docker/output-node-docker:2.0
docker images
docker push localhost:5000/output-node-docker/output-node-docker:2.0
```

- 再度リポジトリ一覧にアクセス
- `{"repositories":["output-node-docker/output-node-docker"]}`が表示されれば OK
- イメージのタグ一覧も取得できる
- [http://localhost:5000/v2/<イメージ名>/tags/list](http://localhost:5000/v2/output-node-docker/output-node-docker/tags/list)

## まとめ
