# 1. 座学編

## 1-1. WebAPI ってなに

- 他のシステムの機能を切り出して、他から使えるようにする仕組み
- 呼び出し元をリクエスタ、呼び出される先をプロバイダを呼ぶ
- 通信には HTTP を利用するのが一般的<br>
  ![api](/images/api.png)
- 昨今ではいろいろな企業が API を提供し、Fintech 企業は API を活用した新しいサービスを創り出す、という流れになっている
  - 例えば MoneyForward などの家計簿アプリではバックエンドとして銀行の残高紹介 API を実行しています
- HTTP リクエスト、レスポンスの説明は割愛
  - HTTP ヘッダーって何?リクエストパラメータとパスパラメータの違いって何?という人は以下を参考にしてください
    - [https://itsakura.com/network-http-get-post](https://itsakura.com/network-http-get-post)
    - [https://qiita.com/Shokorep/items/b7697a146cbb1c3e9f0b](https://qiita.com/Shokorep/items/b7697a146cbb1c3e9f0b)
- 試しに API を実行してみましょう
  - ブラウザで以下にアクセスします
  - [http://geoapi.heartrails.com/api/xml?method=getStations&postal=1040053](http://geoapi.heartrails.com/api/xml?method=getStations&postal=1040053)

::: tip

- 通信の流れはブラウザ上で確認できます
- ブラウザ上で F12 か右クリック → 検証で開発者ウインドウを開き、Network を選択
- ブラウザ上に実行結果が帰ってきました
- また開発者ウインドウでは通信の内容が確認できます
  :::

## 1-2. OpenAPISpec(Swagger) ってなに

- API のインターフェース仕様を記述するための標準フォーマット
  - 昔は SwaggerSpec と呼ばれ SmartBear 社が開発していたが、色々喧嘩別れして別プロジェクトとして OpenAPISpec が誕生、その後 OpenAPI の標準化を推進する団体に移管
  - 昨今では OpenAPISpec:API の仕様の標準フォーマット、OpenAPISpec を元にした実装やツール達をまとめて一般的に Swagger と呼んでいる
  - 紛らわしいので、「Swagger ＝バージョンの古い記法だけど、ツールが揃っている」「OpenAPISpec ＝バージョンの新しい記法だけど、ツールは Swagger~~のものを使える」とざっくり覚えてください
  - SwaggerSpec を中心として、様々な開発補助ツールが展開されている
    |用語(Swagger)|用語(OpenAPISpec)|概要|
    |----|----|----|
    |Swagger Spec |OpenAPISpecification|API に対して Swagger の仕様に準じたドキュメント|
    |Swagger Editor ||Swagger Spec の設計書を記載するためのエディタ|
    |Swagger UI ||Swagger Spec で記載された設計からドキュメントを HTML 形式で自動生成するツール|
    |Swagger Codegen |OpenAPI Generator|Swagger Spec で記載された設計から API のモックを自動生成するツール|
    |Swagger Core ||Java で書かれたの API のソースコードから API の設計ドキュメントを作ってくれるツール|
  - API の開発プロセス
    - 業務要件が決まるとどんな機能を提供する API を作るか考える必要がある
    - 実現したい内容を元に OpenAPISpec の仕様に落とし込む(SwaggerEditor を使用して YAML を書く)
    - YAML を元に設計書やダミーサーバを作成(SwaggerUI,SwaggerCodegen)
    - 作成した YAML を関係者に送ったり、Public に公開する(SwaggerHub)<br>
      <img src="/images/swatool1.png" width="100%">

#### 1. SwaggerSpec

- API 仕様の標準フォーマット
- YAML,JSON 形式で表現される

#### 2. SwaggerEditor

- SwaggerSpec に準拠した yaml を編集することのできる Web エディタ
- SwaggerUI,Codegen との連携が可能
- Docker イメージでも提供されているので、Private な環境ではサーバ上に Docker 起動して Editor 起動も可能

#### 3. SwaggerUI

- SwaggerSpec から仕様書を生成するツール、仕様書自体を指すこともある
- Fintech 企業との API 仕様のやりとりはこいつで行われることが多い

#### 4. SwaggerCodegen(OpenAPIGenerator)

- SwaggerSpec から API のモックやスタブのソースコードを自動生成してくれるツール
- 様々な言語、フレームワークに対応している
- モック：送信メッセージが正しいかを確認するためのダミープロバイダ

#### 5. 各ツールの関連性

- 各ツールの関連性は以下のようなイメージ<br>
  <img src="/images/swatool.png" width="100%">
