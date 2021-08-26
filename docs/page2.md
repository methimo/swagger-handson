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
  |info |○|API のバージョンや作成者などメタ情報を記載|
  |servers |-|接続先を記載|
  |paths |○|API のエンドポイントと、具体的にどのような操作ができるかを記載|
  |components |-|YAML 内の子要素を定義|
  |security |-|API の認証方法を定義|
  |tags |-|SwaggerUI 用のタグ情報を定義|

- SwaggerUI の画面を確認してみましょう
- GET /pets のタブを開く
- Parameters で何をパラメータに指定すべきか、Responses でどんなコマンドでリクエストを送れるか、どんなレスポンスが帰ってくるかが記載されています
- `Try it out!`を押してパラメータを入力し Execute してみましょう
- 実行した結果が帰ってきます
- このように SwaggerUI だけでどのような挙動の API か仕様を確認することができます

## 2-2. OpenAPIGenerator でコードを生成する

- OpenAPISpec で仕様を示した YAML がかけました
- この YAML を元にコードを生成してみましょう
- SwaggerCodegen であれば SwaggerEditor の上部`Generate Server`からコード生成できますが、Java の対応バージョンが`1.7`だったり最新の OpenAPISpec に対応していなかったりイマイチです
- なので後継である OpenAPIGenerator を使います.まずはダウンロードします

```sh
#for Linux,Mac
wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.2.1/openapi-generator-cli-5.2.1.jar
```

- wget コマンドが入ってない場合は以下にアクセスしましょう
  [https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.2.1/openapi-generator-cli-5.2.1.jar](https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.2.1/openapi-generator-cli-5.2.1.jar)

* 動作確認

```sh
java -jar openapi-generator-cli-5.2.1.jar list
```

- Generator が対応している言語の一覧です.この Gemnerator は APIServer のコードはもちろん、仕様の API を呼び出すクライアントも生成することができます
- Generator を実行してコード生成しましょう！今回は APIServer を`spring(Java)`で生成、出力先フォルダを`swagger-handson`にします

```sh
java -jar openapi-generator-cli-5.2.1.jar generate -i petstore_0821.yaml -g spring -o swagger-handson
```

色々出力されて以下が出れば OK です

```
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
```

- 好きな IDE で生成したコードを開いてみましょう
- `src`配下にソースコードがモリモリ生成されています
  <img src="/images/code.png" width="50%">
- ではこの API を起動してみましょう
- `OpenAPI2SpringBoot.java`を右クリックし起動
  <img src="/images/run.png" width="50%">
- 最後が以下になれば OK です

```
[main] org.openapitools.OpenAPI2SpringBoot      : Started OpenAPI2SpringBoot in xxxx seconds (JVM running for 6.08)
```

- 以下にアクセスすると、SwagerUI のページにリダイレクトします
  [http://localhost:8080/](http://localhost:8080/)
- 以下にアクセスすると、API のエンドポイントを実行した結果を返します
  [http://localhost:8080/v1/pets/1](http://localhost:8080/v1/pets/1)

## まとめ

- Dockerfile からイメージを作成、コンテナを起動できた
- アプリ実行環境構築のコード化、ホスト OS との独立により、再現性・可搬性が高い
