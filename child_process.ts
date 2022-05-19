import { exec, spawn, execSync } from 'child_process';
import fs from "fs";

async function execute(
    command: string, workingDir: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: workingDir, env: {"TEAMS_FX_ENV": "dev"} }, (error, standardOutput, stderr) => {
            console.log(`${standardOutput}`);
            if (error) {
                console.log(error.message);
                reject(error);
                return;
            }
            console.log(stderr);
            resolve(standardOutput);
        });
    });
}

async function executeSpawn(
    command: string, args: string[], workingDir?: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
        const ls = spawn(command, args, { cwd: workingDir, shell: true, env: {"TEAMS_FX_ENV": "dev"} });
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

// console.log(execSync('npm run build:teamsfx', { env:{'TEAMS_FX_ENV': 'dev'}}))

const p = '.';
execute('npm run build:teamsfx', p).then(() => {
    console.log(fs.realpathSync(process.cwd()));
}).catch((err) => {
    console.log('error');
})

/*
execute('timeout 10', p).then(() => {
    console.log(fs.realpathSync(process.cwd()));
}).catch((err) => {
    console.log('error');
})
executeSpawn('npm', ['run', 'build:teamsfx'], p).then(() => {
    console.log(fs.realpathSync(process.cwd()));
}).catch(() => {
    console.log('error');
})
*/