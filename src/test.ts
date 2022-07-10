import { fs, os, path, strictEqual as equal } from '../deps.ts';

import { Writer } from './index.ts';

async function testSdeno(): Promise<void> {
    const max = 1000;
    const dir = await fs.mkdtemp(path.join(os.tmpdir()!, 'sdeno-test-'));
    const file = path.join(dir, 'tmp.txt');

    const writer = new Writer(file);
    const promises = [];

    // Test race condition
    for (let i = 1; i <= max; ++i) {
        promises.push(writer.write(String(i)));
    }

    // All promises should resolve
    await Promise.all(promises);
    const decoder = new TextDecoder('utf-8');
    const result = parseInt(decoder.decode(Deno.readFileSync(file)));
    // clean up
    Deno.removeSync(file, { recursive: true });
    // check result
    equal(result, max);
}

Deno.test('Test Lib', testSdeno);
