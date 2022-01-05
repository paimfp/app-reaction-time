import { lstatSync, unlinkSync, rmdirSync, readdirSync, existsSync } from "fs";

function deleteFolder(folder) {
  if (!existsSync(folder)) return;
  try {
    let contents = readdirSync(folder);
    contents.forEach((content) => {
      if (lstatSync(folder + "/" + content).isDirectory()) {
        deleteFolder(folder + "/" + content);
      } else {
        unlinkSync(folder + "/" + content);
      }
    });
    rmdirSync(folder);
  } catch (err) {
    console.error(err);
  }
}

const args = process.argv.slice(2).reduce((acc, cur, index, arr) => {
  if (cur.startsWith("--path")) {
    if (index + 1 == arr.length || arr[index + 1].startsWith("--")) {
      acc[cur.replace("--", "")] = true;
    } else {
      acc[cur.replace("--", "")] = arr[index + 1];
    }
  }
  return acc;
}, {});

args.path && args.path.split(" ").forEach((path) => deleteFolder(path));
