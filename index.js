const { readFileSync, writeFileSync, readdirSync } = require("fs");
const { join } = require("path");
const core = require("@actions/core");
const $ = require("@k3rn31p4nic/google-translate-api");
const unified = require("unified");
const parse = require("remark-parse");
const stringify = require("remark-stringify");
const visitParents = require("unist-util-visit-parents");
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

async function processNodes() {
  return new Promise((resolve) => {
    visitParents(readmeAST, 'text', async (node, ancestors) => {
      const parent = ancestors[ancestors.length - 1];
      
      if (parent.type !== "link") {
        node.value = (await $(node.value, { to: lang })).text;
      }
    }, resolve);
  });
}

async function writeToFile() {
  await processNodes();
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
