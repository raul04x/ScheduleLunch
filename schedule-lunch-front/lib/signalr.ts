import * as signalR from '@microsoft/signalr';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5133';

let connection: signalR.HubConnection | null = null;

export function getActivityConnection(token: string): signalR.HubConnection {
  if (connection?.state === signalR.HubConnectionState.Connected) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE}/sch-lunch-api/hubs/activity`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  return connection;
}

export async function startConnection(token: string): Promise<signalR.HubConnection> {
  const conn = getActivityConnection(token);
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start();
  }
  return conn;
}
