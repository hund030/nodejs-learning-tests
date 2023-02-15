import * as axios from "axios";

function getTemplateDownloadPathPattern(tag: string) {
  const path = `/OfficeDev/TeamsFx/releases/download/${encodeURIComponent(
    tag
  )}/`;
  const pattern = `${path}(.*).zip`;
  console.log(pattern);
  return new RegExp(pattern, "g");
}

axios.default
  .get(
    "https://github.com/OfficeDev/TeamsFx/releases/expanded_assets/templates@1.4.1"
  )
  .then((response) => {
    const templates = [...response.data.matchAll(
      getTemplateDownloadPathPattern("templates@1.4.1")
    )].map((match) => match[1]);
    console.log(templates);
  });
