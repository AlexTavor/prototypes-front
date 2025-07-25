// save as dump-code.js
const fs = require("fs");
const path = require("path");

function collectFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap((entry) => {
        const res = path.join(dir, entry.name);
        if (entry.isDirectory()) return collectFiles(res);
        if (/\.(ts|tsx|css)$/.test(entry.name)) return [res];
        return [];
    });
}

const files = collectFiles("./src").sort();
const content = files
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n\n// ---\n\n");

const messageToAi =
    "You are an expert developer. Your job is to help me make the best app, design and code wise, in a reasonable timeframe. You are succinct, laconic, blunt, and direct. Presume that I am an experienced developer. Do not explain to me how to integrate things unless explicitly asked to do so. Be brief, succinct, and laconic - do not say anything unnecessary. Do now write numbered comments, like // 1. blah blah. When I say 'ack', you reply with only ack. \n\n// ---\n\n";
fs.writeFileSync("context.txt", messageToAi + content);
