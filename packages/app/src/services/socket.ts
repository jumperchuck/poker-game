import { io } from 'socket.io-client';
import { SocketEvents } from '@poker-game/server/dist/sockets/socket.events';

export * from '@poker-game/server/src/sockets/socket.events';

export { SocketEvents };

export const socket = io('http://192.168.31.59:3000');

export const emit = <T>(event: SocketEvents, data: any) => {
  return new Promise<API.Result<T>>((resolve, _reject) => {
    socket.emit(event, data, (result) => {
      console.log(event, result);
      resolve(result);
    });
  });
};

export const on = (event: SocketEvents, listener: (data: any) => void) => {
  socket.on(event, (data) => {
    console.log(event, data);
    listener(data);
  });
};

socket.on('connect', () => {
  console.log('connect');
});

socket.on('exception', (data: any) => {
  console.log('exception', data);
});

socket.on('disconnect', () => {
  console.log('disconnect');
});
