# 5. 解答

### 問題

- DockerRegistry のイメージ一覧を GUI で確認できる Web アプリが`docker-registry-frontend`という名前のコンテナイメージとして DockerHub に公開されています
- そのコンテナイメージを利用してコンテナを起動し、[http://localhost:8086](http://localhost:8086)にアクセスすると画面が表示されるようにしてください

### 解答手順

1. コンテナイメージを DockerHub から検索

```sh
docker search docker-registry-frontend
```

2. 検索したコンテナイメージから最も STAR が多いコンテナイメージを取得

```sh
docker pull konradkleine/docker-registry-frontend
```

3. コンテナを起動

- Regisrtry コンテナの IP アドレスを調べます

```sh
docker ps
docker inspect registy | grep IPAddress

> "IPAddress": "172.17.0.2",
-> 172.17.0.2であることがわかります
```

- コンテナを起動させてみます

```sh
docker run -d -p 8086:80 -e ENV_DOCKER_REGISTRY_HOST=172.17.0.2 -e ENV_DOCKER_REGISTRY_PORT=5000 --name docker-registry-frontend konradkleine/docker-registry-frontend
```

- オプション解説
  - コンテナをバックグラウンド起動する -> -d
  - ホスト OS の`8086`ポートをコンテナ内ポートの`80`にバインドする -> -p 8086:80
  - コンテナ名を `docker-registry-frontend` とする -> --name docker-registry-frontend
  - コンテナ内に以下の環境変数を渡す
    - ENV_DOCKER_REGISTRY_HOST=`172.17.0.2` -> -e ~~~
    - ENV_DOCKER_REGISTRY_PORT=`5000` -> -e ~~~

* ブラウザからアクセス
  [http://localhost:8086](http://localhost:8086)

![GUI](/images/registry1.png)

![GUI](/images/registry2.png)
