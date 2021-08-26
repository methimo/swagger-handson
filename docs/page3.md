# 3. OpenAPISpec の記載に役立つツール群

## 3-1. VSCode の Swagger プラグイン

## 3-2. StoplightStudio

- OpenAPISpec は YAML を記載する必要があるので、YAML 力や OpenAPISpec の記法を学ぶ必要がある
- 記法を意識せず GUI で OpenAPISpec を記載することができる

[https://stoplight.io/studio/](https://stoplight.io/studio/)

- 右上の`GetStarted for FREE`から登録
- 登録するとメールアドレス宛にワークスペースの URL が送られてきます

- ワークスペースにログインしたら`Add Projects`でプロジェクト作成
- 名前は`swagger-handson`
- 作成したら左の`APIs -> Import files`から配布した YAML を取り込む

## まとめ

- コンテナ内のファイル変更はコンテナを削除するとリセットされてしまう
- ボリュームマウント機能を利用することでコンテナ内のファイルの永続化ができる
- DockerRegistry を構築してイメージのバージョン管理ができる
