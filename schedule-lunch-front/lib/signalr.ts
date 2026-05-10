import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export function getActivityConnection(token: string): signalR.HubConnection {
  if (connection?.state === signalR.HubConnectionState.Connected) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/activity?access_token=${token}`)
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
