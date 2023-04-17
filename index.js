const { readFileSync, writeFileSync, readdirSync } = require("fs");
const { join } = require("path");
const core = require("@actions/core");
const $ = require("@k3rn31p4nic/google-translate-api");
const unified = require("unified");
const parse = require("remark-parse");
const stringify = require("remark-stringify");
const visit = require("unist-util-visit");
const simpleGit = require("simple-git");
const git = simpleGit();

const toAst = (markdown) => {
  return unified().use(parse).parse(markdown);
};

const toMarkdown = (ast) => {
  return unified().use(stringify).stringify(ast);
};

const mainDir = ".";
let README = readdirSync(mainDir).includes("readme.md")
  ? "readme.md"
  : "README.md";
const lang = core.getInput("LANG") || "zh-CN";
const readme = readFileSync(join(mainDir, README), { encoding: "utf8" });
const readmeAST = toAst(readme);
console.log("AST CREATED AND READ");

const urlRegex = /https?:\/\/[^\s]+/g;

async function translateNodes(node, parent, headingTranslations) {
  if (node.type === "text" && parent.type !== "heading") {
    const segments = node.value.split(urlRegex);
    const urls = Array.from(node.value.matchAll(urlRegex));

    let translatedText = "";
    let urlIndex = 0;
    for (const segment of segments) {
      const translatedSegment = (await $(segment, { to: lang })).text;
      translatedText += translatedSegment;

      if (urlIndex < urls.length) {
        translatedText += urls[urlIndex][0];
        urlIndex++;
      }
    }

    node.value = translatedText;
  } else if (node.type === "text" && parent.type === "heading") {
    const translatedTitle = (await $(node.value, { to: lang })).text;
    node.value = translatedTitle;
    headingTranslations[parent.children.indexOf(node)] = {
      original: node.value,
      translated: translatedTitle,
    };
  } else if (node.type === "link" && parent.type === "listItem") {
    const linkIndex = parent.children.indexOf(node);
    if (headingTranslations[linkIndex]) {
      node.url = node.url.replace(
        new RegExp(headingTranslations[linkIndex].original, "g"),
        headingTranslations[linkIndex].translated
      );
    }
  }

  if (node.children) {
    for (const child of node.children) {
      await translateNodes(child, node, headingTranslations);
    }
  }
}



async function writeToFile() {
  await translateNodes(readmeAST);
  writeFileSync(
    join(mainDir, `README.${lang}.md`),
    toMarkdown(readmeAST),
    "utf8"
  );
  console.log(`README.${lang}.md written`);
}

async function commitChanges(lang) {
  console.log("commit started");
  await git.add("./*");
  await git.addConfig("user.name", "github-actions[bot]");
  await git.addConfig(
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com"
  );
  await git.commit(
    `docs: Added README."${lang}".md translation via (mod) https://github.com/dephraiim/translate-readme`
  );
  console.log("finished commit");
  await git.push();
  console.log("pushed");
}

async function translateReadme() {
  try {
    await writeToFile();
    await commitChanges(lang);
    console.log("Done");
  } catch (error) {
    throw new Error(error);
  }
}

translateReadme();
