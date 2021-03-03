import * as fs from 'fs-extra';

const t1 = fs.mkdirSync('dir1', { recursive: true });
const t2 = fs.mkdirSync('dir1', { recursive: true });

console.log(t1, t2);
