import axios from "axios";

axios
  .get("https://speed.hetzner.de/1GB.bin", {
    responseType: "arraybuffer",
    timeout: 10000,
  })
  .catch((err) => {
    console.log(err.message);
  });
