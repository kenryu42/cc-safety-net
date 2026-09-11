import { renameSync, writeFileSync } from 'node:fs';

export function atomicWriteFile(dest: string, content: string | Buffer): void {
  const tmp = `${dest}.${process.pid}.tmp`;
  writeFileSync(tmp, content);
  renameSync(tmp, dest);
}
