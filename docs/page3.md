# 3. 実践編

- OpenAPISpec の記載に役立つツール群を紹介します

## (SKIP)3-1. VSCode の Swagger プラグイン

- VSCode に Swagger プラグインを入れることで編集可能になります
- お時間ある方は以下から利用してみてださい
  [https://zenn.dev/s_t_pool/articles/954dfe51b950c18d08e9](https://zenn.dev/s_t_pool/articles/954dfe51b950c18d08e9)

## 3-2. Prism

- モックサーバを起動する際、YAML から OpenAPIGenerator でコードを生成してからローカルで起動する必要がありました
- Prism を 使うとコード生成の作業を経由せず、直接モックサーバを起動できます

## 3-2-1. Prism のインストール

```sh
# インストール
npm install -g @stoplight/prism-cli
# 動作確認(おそらく4.3.1)
prism mock --version
# モック起動
prism mock petstore_0830.yaml

--- 以下のようにモックのエンドポイントが表示されればOK ---
> [1:17:32] › [CLI] …  awaiting  Starting Prism…
> ~~(略)~~
> [1:17:32] › [CLI] ▶  start     Prism is listening on http://127.0.0.1:4010
--------------------------------------------------

# モックにアクセス(別ターミナルを起動)
curl http://127.0.0.1:4010/pets

--- 以下のようにサンプルデータが表示されればOK ---
> [{"id":1234,"name":"Pochi","tag":"dog","breed":"Poodle"},{"id":2345,"name":"Tama","tag":"cat","breed":"American Short Hair"}]
-------------------------------------------

# レスポンスを動的に変更する
prism mock -d petstore_0830.yaml
curl http://127.0.0.1:4010/pets

```

## 3-3. StoplightStudio

- GUI で API 仕様を書ける＋ Prism によるモックサーバ生成機能を持つ Web エディタ
- OpenAPISpec は YAML を記載する必要があるので、OpenAPISpec の記法と YAML の項目の対応付けを学ぶ必要がある。でも YAML をゴリゴリ書くことは避けたい…
- StoplightStudio を使うことで OpenAPISpec の記法を意識せずスラスラ API 仕様を記載できる

[https://stoplight.io/studio/](https://stoplight.io/studio/)

- 右上の`GetStarted for FREE`から登録
- 登録するとメールアドレス宛にワークスペースの URL が送られてきます<br>
  <img src="/images/stop1.png" width="80%">
- ワークスペースにログインしたら`Add Projects`でプロジェクト作成。名前は自由で OK
- 作成したら左の`APIs -> Import files`から配布した YAML を取り込む
- その後`petstore_0830.yaml`をクリックすると編集モードに入ります
- 左に OpenAPISpec の大項目、右に編集画面、という形で API 仕様を編集できるうようになります<br>
  <img src="/images/stop2.png" width="80%">
- 上部の　`Form <-> Code`で GUI で編集するか YAML を直接書くかを選択できます。GUI で変更した内容は YAML に即座に反映されます
- 上部の　`Preview`で SwaggerUI 風の仕様書を確認できます

### 3-3-1. StoplightStudio を活用した API 設計

- StoplightStudio を使って API 仕様を設計してみましょう
- 現在はペットの情報のみ取り扱う API でしたが、以下のようなペットショップの情報を取得する機能を考えてみます
  > - エンドポイント
  >   - `GET /stores` ：店舗の一覧を取得する
  > - 店舗情報で取り扱う項目と条件
  >   - `storeId` ：店舗 ID(必須、例：1)
  >   - `name` ：店舗名(必須、20 文字以内、例：Kojima)
- Model の生成
  - 左の`Models`を右クリック -> `New Model` -> `Store`と入力
  - 以下のように入力<br>
    - Store のデータモデルの定義(必須にチェック)
      <img src="/images/store1.png" width="50%"><br>
    - name の properties
      <img src="/images/store2.png" width="50%"><br>
    - Store のデータモデルの例(モック打鍵時にこの例が表示されます)
      <img src="/images/store3.png" width="50%"><br>
- 同じく`Models`を右クリック -> `New Model` -> `Stores`と入力
  - `object`をクリックし以下のように入力<br>
    <img src="/images/stores1.png" width="50%"><br>
    <img src="/images/stores2.png" width="50%"><br>
- エンドポイントの生成
  - 左の`Paths`を右クリック -> `New Path` -> `/stores`と入力
  - アクセス時のレスポンス内容を以下のように入力<br>
    <img src="/images/stores3.png" width="50%"><br>
    <img src="/images/stores4.png" width="50%">

### 3-3-2. StoplightStudio で API 起動

- API が設計できたら意図した設計になっているか確認しましょう
- StoplightStudio の編集画面左上の`Publish`をクリック
- `Project pushed to workspace`が出力されれば OK です
- そのまま`Back to workspace`をクリック
- MockServer の URL が表示されています！<br>
  <img src="/images/mock.png" width="50%">
- 先述の Prism のようなモック生成機能 が Stoplight に搭載されており、YAML の Publish をトリガーにモックサーバーを作成してくれます
- `https://MockServerのURL/stores`にアクセスしてみましょう。先ほどエンドポイントを設計した時に example に記載した出力例が表示されます

## まとめ

- Prism を使うことで YAML から直接モックサーバを作成できた
- StoplightStudio を使うことで YAML を意識せず API 仕様を記述、モックサーバを作成できた
