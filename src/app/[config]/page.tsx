import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import Home from '../page';

// Generate a real HTML page for every existing tenant at build time.
// There is no hard-coded tenant list: adding a JSON file is sufficient.
// Unknown URLs are handled by the Apache .htaccess SPA fallback.
export function generateStaticParams() {
  return readdirSync(join(process.cwd(), 'src', 'config'))
    .filter((name) => /^[a-z0-9_-]+\.json$/.test(name))
    .filter((name) => name !== 'default.json' && name !== 'register.json')
    .map((name) => ({ config: name.slice(0, -5) }));
}

export const dynamicParams = false;

export default function TenantPage() {
  // Home reads the URL and fetches its configuration client-side.
  return <Home />;
}
