# 翻译自述文件和目录 URL - 操作

**测试目录翻译**

-   [Configuration](#configuration)
    -   [Options](#options)

## 自述文件翻译

-   [English](README.md)
-   [简体中文](README.zh-CN.md)
-   [繁体中文](README.zh-TW.md)
-   [हिंदी](README.hi.md)
-   [Française](README.fr.md)
-   [عربى](README.ar.md)

**GitHub Action 将自述文件翻译成任何语言**

这是一个 GitHub Action，可以自动将你的 repo 中的自述文件翻译成指定的语言。

_提交的[DEV: GitHub Actions For Open Source!](https://dev.to/devteam/announcing-the-github-actions-hackathon-on-dev-3ljn)黑客马拉松_

## 设置

1.  **添加工作流文件**到您的项目（例如`.github/workflows/readme.yml`):

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

### 选项

您可以使用以下选项进一步配置操作：

-   `LANG`：您要将自述文件翻译成的语言。默认为简体中文。 （我是加纳人）可在下方找到支持的语言。
    （默认：`zh-CH`） （必需的：`false`)

## 支持的语言

可在此处找到支持的语言<https://cloud.google.com/translate/docs/languages>

### 问题

查看[here](https://github.com/dephraiim/translate-readme/issues/1)与此操作相关的问题。

### 发展

随时欢迎提出建议和贡献！

### 执照

[MIT](./LICENSE)
