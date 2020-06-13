# Page1

# 0.事前準備

## Dockerのインストール
    
- Docker実行環境はPCのOSによって大きく異なります

### MacOSの場合
  - Docker Desktop for Macをインストールします
  - [https://qiita.com/ama_keshi/items/b4c47a4aca5d48f2661c](https://qiita.com/ama_keshi/items/b4c47a4aca5d48f2661c)

### Windows10 Proの場合
  - Docker Desktop for Windowsをインストールします
  - [https://qiita.com/fkooo/items/d2fddef9091b906675ca](https://qiita.com/fkooo/items/d2fddef9091b906675ca)

### Windows10 Home, Windows7の場合
  - Docker ToolBoxをインストールします
  - [https://qiita.com/zeffy1014/items/dda78f4ab0449989dfe1](https://qiita.com/zeffy1014/items/dda78f4ab0449989dfe1)
  - Docker Toolboxのインストール後、コマンドプロンプトやPowerShellでコマンドの実行が必要です

```sh
C:¥Users¥user > docker-machine --debug create -d virtualbox default
```

![vscode](/images/0-1.png)

