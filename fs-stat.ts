import fs from 'fs-extra';
import klaw from 'klaw';
import ignore from 'ignore';
import path from 'path';

const sourcePath = 'C:\\Users\\zhihuan\\project\\zhijieapp\\tabs';

async function forEachFileAndDir(root: string,
    callback: ((itemPath: string, stats: fs.Stats) => boolean | void),
    filter?: (itemPath: string) => boolean): Promise<void> {

    await new Promise((resolve, reject) => {
        const stream: klaw.Walker = klaw(root, { filter: filter });
        stream.on('data', item => {
            if (callback(item.path, item.stats)) {
                stream.emit('close');
            }
        })
            .on('end', () => resolve({}))
            .on('error', err => reject(err))
            .on('close', () => resolve({}));
    });
}

const ig = ignore().add('.npmrc');
let changed = false;
const lastDeploymentTime = new Date('2021-03-24T12:42:00');
forEachFileAndDir(sourcePath, (itemPath, stats) => {
    const relativePath = path.relative(sourcePath, itemPath);
    changed = false;
    if (relativePath && ig.filter([relativePath]).length > 0 && lastDeploymentTime < stats.mtime) {
        changed = true;
    }
    console.log(`${relativePath} have been changed since last deployment: ${changed}`);
}, (itemPath) => path.basename(itemPath) !== 'node_modules');
