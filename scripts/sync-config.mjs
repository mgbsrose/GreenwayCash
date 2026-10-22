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
// Manifest for the modal. No route list needs to be maintained in application code.
const entries = [];
for (const name of names) {
  const config = JSON.parse(await readFile(join(source, name), 'utf8'));
  entries.push({ id: name.slice(0, -5), customer: config.customer });
}
entries.sort((a, b) => a.id === 'default' ? -1 : b.id === 'default' ? 1 : a.customer.localeCompare(b.customer, 'de'));
await writeFile(join(target, 'index.json'), JSON.stringify(entries, null, 2) + '\\n');
console.log(`Konfigurationen veröffentlicht: ${names.join(', ')}`);
