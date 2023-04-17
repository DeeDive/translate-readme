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

async function translateNodes(node, parent, headingTranslations) {
  if (node.type === "text" && parent && parent.type !== "link") {
    node.value = (await $(node.value, { to: lang })).text;
  }

  if (node.type === "heading" && node.children && node.children.length > 0) {
    const originalText = node.children[0].value;
    node.children[0].value = (await $(originalText, { to: lang })).text;
    headingTranslations.push({
      original: originalText,
      translated: node.children[0].value,
    });
  }

  if (node.children) {
    for (const child of node.children) {
      await translateNodes(child, node, headingTranslations);
    }
  }
}

function updateLinks(node, headingTranslations) {
  if (node.type === "link") {
    const matchingHeading = headingTranslations.find((headingTranslation) =>
      new RegExp("#" + encodeURIComponent(headingTranslation.original), "g").test(node.url)
    );
    if (matchingHeading) {
      node.url = node.url.replace(
        new RegExp("#" + encodeURIComponent(matchingHeading.original), "g"),
        "#" + encodeURIComponent(matchingHeading.translated)
      );
      node.children[0].value = matchingHeading.translated;
    }
  }

  if (node.children) {
    for (const child of node.children) {
      updateLinks(child, headingTranslations);
    }
  }
}

async function writeToFile() {
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
    `docs: Added README."${lang}".md translation via https://github.com/dephraiim/translate-readme`
  );
  console.log("finished commit");
  await git.push();
  console.log("pushed");
}


async function translateReadme() {
  try {
    const headingTranslations = [];
    await translateNodes(readmeAST, null, headingTranslations);
    updateLinks(readmeAST, headingTranslations);
    await writeToFile();
    await commitChanges(lang);
    console.log("Done");
  } catch (error) {
    throw new Error(error);
  }
}


translateReadme();
