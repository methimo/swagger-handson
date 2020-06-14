# 3. コンテナのあれこれ

## 3-1. 揮発性とファイル永続化

- コンテナで稼働するアプリがログを出力した時を考えます

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
  fs.appendFileSync("output.txt", message, (err) => {
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

- ブラウザから以下にアクセスすると、output.txt にログが追記されます

  [http://localhost:9091](http://localhost:9091)

- コンテナを削除します

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
- Docker は、コンテナ自体は起動されても更新は保存されず、明示的にコミットしなければコンテナ破棄時に変更分が消えてしまう性質があります(揮発性と呼びます)
- そのためログやデータなど、永続化したいファイルがある時はボリュームマウント機能を利用します
