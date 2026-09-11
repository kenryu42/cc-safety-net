import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';

export async function startLoopbackServer(
  handler: (request: IncomingMessage, response: ServerResponse) => void,
): Promise<{ origin: string; close(): Promise<void> }> {
  const server = createServer(handler);
  await new Promise<void>((ready) => server.listen(0, '127.0.0.1', ready));
  return {
    origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    close() {
      const closed = new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      server.closeAllConnections();
      return closed;
    },
  };
}
