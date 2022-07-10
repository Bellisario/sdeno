const { readFileSync, writeFile } = Deno;
import { Buffer, mkdtemp, os, path } from '../deps.ts';
import { Writer } from './index.ts';

async function benchmark(data: string, msg: string): Promise<void> {
    const dir = await mkdtemp(path.join(os.tmpdir()!, 'sdeno-'));
    const fsLabel = '  fs     ';
    const sdenoLabel = '  sdeno  ';
    const fsFile = path.join(dir, 'fs.txt');
    const sdenoFile = path.join(dir, 'sdeno.txt');
    const sdeno = new Writer(sdenoFile);
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // console.log(`temp dir: ${dir}`)
    console.log(msg);
    console.log();

    console.time(fsLabel);
    // To avoid race condition issues, we need to wait
    // between write when using fs only
    for (let i = 0; i < 1000; i++) {
        await writeFile(fsFile, encoder.encode(`${data}${i}`));
    }
    console.timeEnd(fsLabel);

    console.time(sdenoLabel);
    // Sdeno can be run in parallel
    await Promise.all(
        [...Array(1000).keys()].map((_, i) => sdeno.write(`${data}${i}`)),
    );
    console.timeEnd(sdenoLabel);

    // Testing that the end result is the same
    console.log();
    console.log(
        '  fs.txt = sdeno.txt',
        decoder.decode(readFileSync(fsFile)) ===
                decoder.decode(readFileSync(sdenoFile))
            ? 'Yes'
            : 'No',
    );
    console.log();
    console.log();

    // clean up
    Deno.removeSync(dir, { recursive: true });
}

async function run(): Promise<void> {
    const KB = 1024;
    const MB = 1048576;
    await benchmark(
        Buffer.alloc(KB, 'x').toString(),
        'Write 1KB data to the same file x 1000',
    );
    await benchmark(
        Buffer.alloc(MB, 'x').toString(),
        'Write 1MB data to the same file x 1000',
    );
}

void run();
