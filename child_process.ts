import { exec, spawn } from 'child_process';

// spawn('npm', ['install'], { cwd: 'c:\\Users\\zhihuan\\project\\zhijieapp1\\tabs' });
// spawn('npm', ['run', 'build'], { cwd: 'c:\\Users\\zhihuan\\project\\zhijieapp1\\tabs' });

async function execute(
    command: string, workingDir?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: workingDir }, (error, standardOutput) => {
            console.log(`${standardOutput}`);
            if (error) {
                console.log(error.message);
                reject(error);
                return;
            }
            resolve(standardOutput);
        });
    });
}

async function executeSpawn(
    command: string, args: string[], workingDir?: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
        const ls = spawn(command, args, { cwd: workingDir, shell: true });
        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', data => {
            console.log(`stderr: ${data}`);
        });

        ls.on('close', code => {
            console.log(`child process exited with code ${code}`);
            resolve(code);
        });
    });
}

const start = +new Date();
const path = 'c:\\Users\\zhihuan\\project\\zhijieapp1\\tabs';
/*
execute('npm install', path).then(() => {
    const middle = +new Date();
    console.info(`npm install time: ${middle - start}ms`);
    execute('npm run build', path).then(() => {
        const end = +new Date();
        console.info(`npm run build time: ${end - middle}ms`);
    });
}).catch(() => {
    console.log('error');
})*/

executeSpawn('npm', ['install'], path).then(() => {
    const middle = +new Date();
    console.info(`npm install time: ${middle - start}ms`);
    executeSpawn('npm', ['run', 'build'], path).then(() => {
        const end = +new Date();
        console.info(`npm run build time: ${end - middle}ms`);
    });
}).catch(() => {
    console.log('error');
})