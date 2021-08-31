# 2. 入門編

## 2-1. SwaggerEditor を使って API の仕様を書く

- 基礎編でも触れましたが、OpenAPISpec の方がバージョンが新しいのでこの後は OpenAPISpec に寄せて説明します
- [SwaggerEditor](https://editor.swagger.io/) にアクセス
- 左側は YAML のエディタ、右側は SwaggerUI によって生成されるドキュメント
- Slack で配布した`petstore_0830.yaml`の中身をコピーし、SwaggerEditor の貼り付けると、SwaggerUI が生成される<br>
  <img src="/images/se.png" width="80%">
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
- SwaggerCodegen であれば SwaggerEditor の上部 `Generate Server` からコード生成できますが Java の対応バージョンが`1.7`だったり最新の OpenAPISpec に対応していなかったりイマイチです
- 今回は後継の OpenAPIGenerator を使います。まずはダウンロードしましょう

```sh
#for Linux,Mac
wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.2.1/openapi-generator-cli-5.2.1.jar
```

::: tip

- wget コマンドが入ってない場合は以下にアクセスして直接 Jar をダウンロードする
  [https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.2.1/openapi-generator-cli-5.2.1.jar](https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.2.1/openapi-generator-cli-5.2.1.jar)
  :::

- 動作確認

```sh
cd `ダウンロードしたフォルダ`
java -jar openapi-generator-cli-5.2.1.jar list
```

- Generator が対応している言語の一覧です.この Generator は APIServer のコードはもちろん、仕様の API を呼び出すクライアントも生成することができます
- Generator を実行してコード生成しましょう！今回は APIServer を`spring(Java)`で生成、出力先フォルダを`swagger-handson`にします

```sh
java -jar openapi-generator-cli-5.2.1.jar generate -i petstore_0830.yaml -g spring -o swagger-handson
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
- `src`配下にソースコードがモリモリ生成されています<br>
  <img src="/images/code.png" width="70%">
- ではこの API を起動してみましょう
- `OpenAPI2SpringBoot.java`を右クリックし起動<br>
  <img src="/images/run.png" width="70%">
- 最後が以下になれば OK です

```
[main] org.openapitools.OpenAPI2SpringBoot      : Started OpenAPI2SpringBoot in xxxx seconds (JVM running for 6.08)
```

::: tip

- IDE がない人は以下実行して直接 Maven ビルド -> 起動します
- mvn コマンドがない場合は以下からインストール
  - (Windows)[https://qiita.com/Junichi*M*/items/20daee936cd0c03c3115](https://qiita.com/Junichi_M_/items/20daee936cd0c03c3115)
  - (Mac)[https://qiita.com/saitoryc/items/737ee9e711f1ebe0dcfa](https://qiita.com/saitoryc/items/737ee9e711f1ebe0dcfa)

```sh
cd swagger-handson
mvn install
cd target/
java -jar openapi-spring-1.0.0.jar
```

:::

- 以下にアクセスすると、SwagerUI のページにリダイレクトします
  [http://localhost:8080/](http://localhost:8080/)
- また API のエンドポイントにアクセスすると、実行した時のサンプルレスポンスを返します
  [http://localhost:8080/v1/pets/1](http://localhost:8080/v1/pets/1)
  - OpenAPIGenerator で生成したコードは一律 HTTP ステータスコードを 501 に返すようになっています

```java{16}
  - PetsApi.java
    /**
     * GET /pets : List all pets
     * Desctibe Pets
     * @param limit How many items to return at one time (max 100) (optional)
     * @return A paged array of pets (status code 200)
     *         or unexpected error (status code 200)
     */
    @ApiOperation(value = "List all pets", nickname = "listPets", notes = "Desctibe Pets", response = Pet.class, responseContainer = "List", tags={ "pets", })
    @RequestMapping(
        method = RequestMethod.GET,
        value = "/pets",
        produces = { "application/json" }
    )
 ~~~中略~~~
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }
```

::: warning

- OpenAPIGenerator によって生成されたコードは本番向けのソースには向かない
- API の基本的な振る舞い以外のコードが多く複雑な作りになっていたり、コードチェックなどを取り込んで生成することができない
- あくまでも動作確認用、モックとして使うようにお願いします
  :::

## まとめ

- SwaggerEditor を使って YAML を編集し、SwaggerUI から API 仕様書を作成できた
- OpenAPIGenerator を使って YAML からコードを生成し、モックサーバを構築できた
