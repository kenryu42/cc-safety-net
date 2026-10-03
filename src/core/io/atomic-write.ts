import { existsSync, renameSync, statSync, writeFileSync } from 'node:fs';

export function atomicWriteFile(dest: string, content: string | Buffer): void {
  const tmp = `${dest}.${process.pid}.tmp`;
  writeFileSync(tmp, content, existsSync(dest) ? { mode: statSync(dest).mode & 0o777 } : {});
  renameSync(tmp, dest);
}
