# रीडमी और टीओसी यूआरएल का अनुवाद करें - कार्रवाई

**सामग्री अनुवाद की परीक्षण तालिका**

-   [Configuration](#configuration)
    -   [Options](#options)

## रीडमे अनुवाद

-   [English](README.md)
-   [简体中文](README.zh-CN.md)
-   [繁体中文](README.zh-TW.md)
-   [हिंदी](README.hi.md)
-   [Française](README.fr.md)
-   [عربى](README.ar.md)

**रीडमी का किसी भी भाषा में अनुवाद करने के लिए गिटहब एक्शन**

यह एक गिटहब एक्शन है जो आपके रेपो में रीडमी को एक निर्दिष्ट भाषा में स्वचालित रूप से अनुवादित करता है।

_के लिए एक सबमिशन[DEV: GitHub Actions For Open Source!](https://dev.to/devteam/announcing-the-github-actions-hackathon-on-dev-3ljn)आयोजित हैकथॉन_

## स्थापित करना

1.  **कार्यप्रवाह फ़ाइल जोड़ें**आपकी परियोजना के लिए (उदा।`.github/workflows/readme.yml`):

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

## विन्यास

### विकल्प

आप निम्न विकल्पों के साथ कार्रवाई को और कॉन्फ़िगर कर सकते हैं:

-   `LANG`: वह भाषा जिसमें आप अपने रीडमी का अनुवाद करना चाहते हैं। डिफ़ॉल्ट सरलीकृत चीनी है। (मैं घाना का हूं) समर्थित भाषाएं नीचे पाई जा सकती हैं।
    (गलती करना:`zh-CH`) (आवश्यक:`false`)

## समर्थित भाषाएँ

समर्थित भाषाएँ यहाँ पाई जा सकती हैं<https://cloud.google.com/translate/docs/languages>

### समस्याएँ

जाँच करना[here](https://github.com/dephraiim/translate-readme/issues/1)इस कार्रवाई से संबंधित मुद्दों के लिए।

### विकास

सुझावों और योगदानों का हमेशा स्वागत है!

### लाइसेंस

[MIT](./LICENSE)
