# 3. 実践編

- OpenAPISpec の記載に役立つツール群を紹介します

## 3-1. VSCode の Swagger プラグイン

## 3-2. StoplightStudio

- OpenAPISpec は YAML を記載する必要があるので、YAML 力や OpenAPISpec の記法を学ぶ必要がある
- 記法を意識せず GUI で OpenAPISpec を記載することができる

[https://stoplight.io/studio/](https://stoplight.io/studio/)

- 右上の`GetStarted for FREE`から登録
- 登録するとメールアドレス宛にワークスペースの URL が送られてきます
- ワークスペースにログインしたら`Add Projects`でプロジェクト作成
- 名前はなんでも大丈夫です
- 作成したら左の`APIs -> Import files`から配布した YAML を取り込む
- その後`petstore_0821.yaml`をクリックすると編集モードに入ります
- 左に OpenAPISpec の大項目、右に編集画面、という形で仕様を編集できるうようになりました
- ちなみにですが上部の　`Form <-> Code`で GUI で編集するか YAML を直接書くかを選択できます。もちろん GUI で変更した内容は YAML に即座に反映されます

### 3-2-1. StoplightStudio を活用した API 設計

- StoplightStudio を使って API 仕様を設計してみましょう
- 現在はペットの情報のみ取り扱う API でしたが、ペットショップの情報を取得する機能を考えてみます
- 機能要件
  - エンドポイント
    - `GET /stores`:店舗の一覧を取得する
  - 店舗情報で取り扱う項目と条件
    - `storeId`:店舗 ID(必須、例：1)
    - `name`:店舗名(必須、20 文字以内、例：Kojima)
- Model の生成
  - 左の`Models`を右クリック -> `New Model` -> `Store`と入力
  - 以下のように入力<br>
    <img src="/images/store1.png" width="50%"><br>
    <img src="/images/store2.png" width="50%"><br>
    <img src="/images/store3.png" width="50%"><br>
- 同じく`Models`を右クリック -> `New Model` -> `Stores`と入力
  - 以下のように入力<br>
    <img src="/images/stores1.png" width="50%"><br>
    <img src="/images/stores2.png" width="50%"><br>
- エンドポイントの生成
  - 左の`Paths`を右クリック -> `New Path` -> `/stores`と入力
  - 以下のように入力<br>
    <img src="/images/stores3.png" width="50%"><br>
    <img src="/images/stores4.png" width="50%">

### 3-2-2. StoplightStudio で API 起動

- API が設計できたら意図した設計になっているか確認しましょう
- StoplightStudio の編集画面左上の`Publish`をクリック
- `Project pushed to workspace`が出力されれば OK です
- そのまま`Back to workspace`をクリック
- 以下のように MockServer の URL が表示されていますね？YAML を Publish することで MockServer を起動してくれます。先述の Prism が YAML の Publish をトリガーに動いてくれるイメージです<br>
  <img src="/images/mock.png" width="50%">
- `https://MockServerのURL/stores`にアクセスしてみましょう。先ほどエンドポイントを設計した時に example に記載した出力例が表示されます

## 3-3. Prism

- モックサーバを起動する際、YAML から OpenAPIGenerator でコードを生成し、ローカルで起動する必要がありました
- Prism 使うとコード清正を経由せず、直接モックサーバを起動できます
-

## まとめ

- xxx
