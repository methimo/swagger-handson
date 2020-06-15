# 0. 環境構築

## Docker のインストール

- Docker 実行環境は PC の OS によって異なります
- また Windows10 Home の場合,DockerToolBox のセットアップに失敗する可能性があり、ここが山場かもしれません

### MacOS の場合

- Docker Desktop for Mac をインストールします
- [https://qiita.com/ama_keshi/items/b4c47a4aca5d48f2661c](https://qiita.com/ama_keshi/items/b4c47a4aca5d48f2661c)

### Windows10 Pro の場合

- Docker Desktop for Windows をインストールします
- [https://qiita.com/fkooo/items/d2fddef9091b906675ca](https://qiita.com/fkooo/items/d2fddef9091b906675ca)

### Windows10 Home, Windows7 の場合

- Docker ToolBox をインストールします
- [https://qiita.com/zeffy1014/items/dda78f4ab0449989dfe1](https://qiita.com/zeffy1014/items/dda78f4ab0449989dfe1)
- Docker Toolbox のインストール後、PowerShell でコマンドの実行が必要です

```sh
docker-machine --debug create -d virtualbox default
```

#### 動作確認

```sh
docker -v
```

Docker version ~~~ が表示されれば OK
