import Alert from '../models/Alert.js';

export default function(io, socket) {
  socket.on('send-alert', async ({ alertId }) => {
    const alert = await Alert.findById(alertId);
    if (!alert) return;
    
    // Simplistic broadcast to all, in a real app would map recipients to their sockets
    io.emit('receive-alert', alert);
  });
}
