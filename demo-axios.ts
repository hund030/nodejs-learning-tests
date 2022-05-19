import axios from "axios";

const source = axios.CancelToken.source();
const timeout = setTimeout(() => {
  source.cancel("timeout of 10000ms exceeded");
}, 10000);

const get = (url: string) => {
  return axios
    .get(url, {
      cancelToken: source.token,
      responseType: "arraybuffer",
      timeout: 5000,
    })
    .then((result) => {
      clearTimeout(timeout);
      console.log("done");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

get("https://httpstat.us/200?sleep=7000");
get("https://speed.hetzner.de/1GB.bin");
