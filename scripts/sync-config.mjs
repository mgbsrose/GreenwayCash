// Copy all src/config/*.json into the static public assets on each dev/build.
// A new tenant requires only a JSON file and a rebuild, not a code change.
import { mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const source = join(process.cwd(), 'src', 'config');
const target = join(process.cwd(), 'public', 'config');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
const names = (await readdir(source)).filter((name) => /^[a-z0-9_-]+\.json$/.test(name) && name !== 'register.json');
if (!names.includes('default.json')) throw new Error('src/config/default.json fehlt');
for (const name of names) {
  const body = await readFile(join(source, name), 'utf8');
  const value = JSON.parse(body);
  if (!value.customer || !Array.isArray(value.buttons)) {
    throw new Error(`Ungültige Konfiguration: ${name}`);
  }
  await writeFile(join(target, name), body);
}
console.log(`Konfigurationen veröffentlicht: ${names.join(', ')}`);
