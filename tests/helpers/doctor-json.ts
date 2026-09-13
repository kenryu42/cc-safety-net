export const foldWindowsPosture = (document: string): string =>
  process.platform === 'win32'
    ? document.replaceAll(
        /"status": "unknown",(\s*)"issues": \[\]/g,
        '"status": "safe",$1"issues": []',
      )
    : document;

export function normalizeDoctorJson(document: string): string {
  return document
    .replace(/"(timestamp|relativeTime|oldestEntry|newestEntry)": "[^"]*"/g, '"$1": "<time>"')
    .replace(/"(version|currentVersion)": "[^"]*"/g, '"$1": "<version>"')
    .replace(/"platform": "[^"]* [^"]*"/g, '"platform": "<platform>"');
}
