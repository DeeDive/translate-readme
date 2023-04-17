# 翻譯自述文件和目錄 URL - 操作

**測試目錄**

-   [Configuration](#configuration)
    -   [Options](#options)

## 自述文件翻譯

-   [English](README.md)
-   [简体中文](README.zh-CN.md)
-   [繁体中文](README.zh-TW.md)
-   [हिंदी](README.hi.md)
-   [Française](README.fr.md)
-   [عربى](README.ar.md)

**GitHub Action 將自述文件翻譯成任何語言**

這是一個 GitHub Action，可以自動將你的 repo 中的自述文件翻譯成指定的語言。

_提交的[DEV: GitHub Actions For Open Source!](https://dev.to/devteam/announcing-the-github-actions-hackathon-on-dev-3ljn)黑客馬拉松_

## 設置

1.  **添加工作流文件**到您的項目（例如`.github/workflows/readme.yml`):

```yaml
name: Translate README

on:
  push:
    branches:
      - main
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      # ISO Langusge Codes: https://cloud.google.com/translate/docs/languages  
      - name: Adding README - Chinese Simplified
        uses: dephraiim/translate-readme@main
        with:
          LANG: zh-CN
      - name: Adding README - Chinese Traditional
        uses: dephraiim/translate-readme@main
        with:
          LANG: zh-TW
      - name: Adding README - Hindi
        uses: dephraiim/translate-readme@main
        with:
          LANG: hi
      - name: Adding README - Arabic
        uses: dephraiim/translate-readme@main
        with:
          LANG: ar
      - name: Adding README - French
        uses: dephraiim/translate-readme@main
        with:
          LANG: fr
```

## 配置

### 選項

您可以使用以下選項進一步配置操作：

-   `LANG`：您要將自述文件翻譯成的語言。默認為簡體中文。 （我是加納人）可在下方找到支持的語言。
    （默認：`zh-CH`） （必需的：`false`)

## 支持的語言

可在此處找到支持的語言<https://cloud.google.com/translate/docs/languages>

### 問題

查看[here](https://github.com/dephraiim/translate-readme/issues/1)與此操作相關的問題。

### 發展

隨時歡迎提出建議和貢獻！

### 執照

[MIT](./LICENSE)
