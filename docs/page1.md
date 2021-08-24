# 1.座学編

## 1-1. API ってなに

- ここでは WebAPI のことをさしていいます
- 他のシステムの機能を切り出して、他から使えるようにする仕組み
- 呼び出し元をリクエスタ、呼び出される先をプロバイダを呼ぶ
- 通信には HTTP を利用するのが一般的
  ![api](/images/api.png)
- 昨今ではいろいろな企業が API を提供し、Fintech 企業は API を活用した新しいサービスを創り出す、という流れになっている

  - 例えば MoneyForward などの家計簿アプリではバックエンドとして銀行の残高紹介 API を実行しています

- HTTP リクエスト、レスポンスの説明は割愛
  - HTTP ヘッダーって何?リクエストパラメータとパスパラメータの違いって何?という人は以下を参考にしてください
    - [https://itsakura.com/network-http-get-post](https://itsakura.com/network-http-get-post)
    - [https://qiita.com/Shokorep/items/b7697a146cbb1c3e9f0b](https://qiita.com/Shokorep/items/b7697a146cbb1c3e9f0b)

* 試しに API を実行してみましょう
  - ブラウザで以下にアクセスします
  - [http://geoapi.heartrails.com/api/xml?method=getStations&postal=1040053](http://geoapi.heartrails.com/api/xml?method=getStations&postal=1040053)
* 通信の流れはブラウザ上で確認できます
  - ブラウザ上で F12 か右クリック → 検証で開発者ウインドウを開き、Network を選択
  - ブラウザ上に実行結果が帰ってきました
  - また開発者ウインドウでは通信の内容が確認できます

## 1-2. OpenAPISpec(Swagger) ってなに

- API のインターフェース仕様を記述するための標準フォーマット
  - 昔は SwaggerSpecification と呼ばれていたが、2015 年に OpenAPI の規格を定める団体に移管されてから OpenAPISpecification に改名
  - 昨今では OpenAPISpec を元にした実装やツール達をまとめて一般的に Swagger と呼んでいる
  - SwaggerSpec を中心として、様々な開発補助ツールが展開されている
    |用語(Swagger)|用語(OpenAPISpec)|概要|
    |----|----|----|
    |Swagger Spec |OpenAPISpecification|API に対して Swagger の仕様に準じたドキュメント|
    |Swagger Editor ||Swagger Spec の設計書を記載するためのエディタ|
    |Swagger UI ||Swagger Spec で記載された設計からドキュメントを HTML 形式で自動生成するツール|
    |Swagger Codegen |OpenAPI Generator|Swagger Spec で記載された設計から API のモックを自動生成するツール|
    |Swagger Core ||Java で書かれたの API のソースコードから API の設計ドキュメントを作ってくれるツール|
  - 開発プロセスとしては以下のようなイメージ
    - OpenAPISpec を元に、YAML を書く(YAML を書く際に SwaggerEditor を使用)
    - YAML を元に設計書やダミーサーバを作成(SwaggerUI,SwaggerCodegen)
    - 作成した YAML を公開(SwaggerHub)
      <img src="/images/swatool1.png" width="30%">
      <img src="/images/swatool2.png" width="30%">

1. SwaggerSpec

- API 仕様の標準フォーマット
- YAML,JSON 形式で表現される

2. SwaggerEditor

- SwaggerSpec に準拠した yaml を編集することのできる Web エディタ
- SwaggerUI,Codegen との連携が可能

3. SwaggerUI

- SwaggerSpec から設計ドキュメントを生成するツール
- Fintech 企業との API 仕様のやりとりはこいつで行われることが多い

4. SwaggerCodegen

- SwaggerSpec から API のモックやスタブのソースコードを自動生成してくれるツール
- 様々な言語、フレームワークに対応している
- モック：送信メッセージが正しいかを確認するためのダミープロバイダ
- テスト工程において色々なダミーを作ると思いますが、それぞれの用語の違いは以下で調べてください
- [https://craftsman-software.com/posts/38](https://craftsman-software.com/posts/38)
- 各ツールの関連性は以下のようなイメージ
  <img src="/images/swatool.png" width="80%">
