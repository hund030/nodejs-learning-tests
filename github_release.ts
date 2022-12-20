import * as axios from "axios";

function getTemplateDownloadPathPattern(tag: string) {
  const path = `/OfficeDev/TeamsFx/releases/download/${encodeURIComponent(tag)}/`;
  const pattern = `${path}(.*).zip`;
  return new RegExp(pattern, "g");
}

axios.default
  .get(
    "https://github.com/OfficeDev/TeamsFx/releases/expanded_assets/templates@1.4.1"
  )
  .then((response) => {
    // const parser = new DOMParser();
    // const document = parser.parseFromString(response.data, 'text/html');
    // const a = document.getElementsByTagName("a");
    const templates = response.data.match(
      getTemplateDownloadPathPattern("templates@1.4.1")
    );
    console.log(templates);
  });
