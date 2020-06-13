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

```
docker rm hello-world-machida
docker ps -a
```

- 削除できない場合はコンテナ ID を指定して削除してください

## コンテナイメージ

## Topic3
