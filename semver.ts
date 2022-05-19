import semver from "semver";

const tag = "^0.1.0";
const v1 = semver.inc(tag.replace(/\^/g, ""), "patch") as string;
const v2 = semver.inc(v1, "patch") as string;
const vrc = semver.inc(v2, "prerelease") as string;
const versionList = [vrc, "0.1.0", "0.2.0", "0.0.8", v1, v2];
const version =  semver.maxSatisfying(versionList, tag);
console.log(version); // 0.1.3