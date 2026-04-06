const fs = require("fs");
const path = require("path");

const inputPath = path.join(
  process.env.USERPROFILE || process.env.HOME,
  ".cursor/projects/c-Users-bhara-Downloads-LearnEasy/terminals/856089.txt"
);
const outputPath = path.join(__dirname, "../lib/math-playlist-data.json");

const content = fs.readFileSync(inputPath, "utf-8");
const lines = content.split("\n").filter((l) => l.includes("|"));

const chapterNames = {
  1: "Applications of Matrices and Determinants",
  2: "Complex Numbers",
  3: "Theory of Equations",
  4: "Inverse Trigonometric Functions",
  5: "Two Dimensional Analytical Geometry",
  6: "Applications of Vector Algebra",
  7: "Applications of Differential Calculus",
  8: "Differentials and Partial Derivatives",
  9: "Applications of Integration",
  10: "Ordinary Differential Equations",
  11: "Probability Distributions",
  12: "Discrete Mathematics",
};

const chapters = {};
for (let i = 1; i <= 12; i++) chapters[i] = { name: chapterNames[i], exercises: [] };

for (const line of lines) {
  const idx = line.indexOf("|");
  if (idx === -1) continue;
  const videoId = line.slice(0, idx).trim();
  const title = line.slice(idx + 1).trim();
  if (!videoId || videoId.length < 10) continue;

  let ch = null;
  let label = title;

  const ex1 = title.match(/Example\s+(\d+)\.(\d+)/i);
  const ex2 = title.match(/Exercise\s+(\d+)\.(\d+)\s+Q\.No\.(\d+)/i);
  const ex2b = title.match(/Exercise\s+(\d+)\.(\d+)\s+Q\.no\.(\d+)/i);
  const ex3 = title.match(/Exercise\s+(\d+)\.(\d+)\s+Sum\s+(\d+)/i);
  const chMatch = title.match(/Chapter\s+(\d+)|CHAPTER\s+(\d+)/i);

  if (ex1) {
    ch = parseInt(ex1[1], 10);
    label = `Example ${ex1[1]}.${ex1[2]}`;
  } else if (ex2) {
    ch = parseInt(ex2[1], 10);
    label = `Exercise ${ex2[1]}.${ex2[2]} Q.No.${ex2[3]}`;
  } else if (ex2b) {
    ch = parseInt(ex2b[1], 10);
    label = `Exercise ${ex2b[1]}.${ex2b[2]} Q.No.${ex2b[3]}`;
  } else if (ex3) {
    ch = parseInt(ex3[1], 10);
    label = `Exercise ${ex3[1]}.${ex3[2]} Sum ${ex3[3]}`;
  } else if (chMatch) {
    ch = parseInt(chMatch[1] || chMatch[2], 10);
  } else {
    for (let c = 1; c <= 12; c++) {
      if (title.toLowerCase().includes(chapterNames[c].toLowerCase().slice(0, 15))) {
        ch = c;
        break;
      }
    }
  }

  if (ch && ch >= 1 && ch <= 12) {
    const shortLabel = label.length > 50 ? label.slice(0, 47) + "…" : label;
    chapters[ch].exercises.push({
      id: videoId,
      label: shortLabel,
      url: `https://www.youtube.com/watch?v=${videoId}&list=PL2qtWkm0Z4ceoeB0lzMfdKSKI85-l_Vv_`,
    });
  }
}

const result = Object.entries(chapters).map(([num, data]) => ({
  chapter: parseInt(num, 10),
  name: data.name,
  exercises: data.exercises,
}));

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
console.log("Wrote", outputPath, "with", result.length, "chapters");
