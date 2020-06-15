## 4. おさらい課題

- DockerRegistry のイメージ一覧を GUI で確認できる Web アプリが`docker-registry-frontend`という名前のコンテナイメージとして世の中に公開されています
- そのコンテナイメージを利用してコンテナを起動し、[http://localhost:8086](http://localhost:8086)にアクセスすると画面が表示されるようにしてください

- 完成イメージ

![GUI](/images/registry1.png)

![GUI](/images/registry2.png)

- 手順

1. コンテナイメージを DockerHub から検索
2. 検索したコンテナイメージから最も STAR が多いコンテナイメージを取得
3. コンテナを起動

- 起動時に指定するオプション
  - コンテナをバックグラウンド起動する
  - ホスト OS の`xxxx`ポートをコンテナ内ポートの 80 番にバインドする
  - コンテナ名を docker-registry-frontend とする
  - コンテナ内に以下の環境変数を渡す
    - ENV_DOCKER_REGISTRY_HOST=`xxxx`
    - ENV_DOCKER_REGISTRY_PORT=`xxxx`
      - ENV_DOCKER_REGISTRY_HOST は DockerRegistry が稼働する IP アドレスを指定してください
      - 稼働している IP アドレスはコンテナの詳細情報から確認できます
