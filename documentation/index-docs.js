import { globby } from "globby";
import fs from "fs";
import matter from "gray-matter";

const pages = await globby(["src/pages"]);

let objects = pages.map((page) => {
  const fileContents = fs.readFileSync(page, "utf8");
  const { data, content } = matter(fileContents);
  const path = page.replace(".md", "");
  let slug =
    path === "src/pages"
      ? "pages"
      : path.replace("src/", "").replace("pages", "");
  slug = slug + "/";
  return {
    slug,
    content,
    frontmatter: {
      title: data.title,
    },
  };
});

objects = objects.filter((item) => !!item.content);
objects = objects.filter((item) => !item.slug.includes(".astro"));

fs.writeFile("index-docs.json", JSON.stringify(objects), function (error) {
  if (error) throw error;
  console.log("Index docs saved!");
});
