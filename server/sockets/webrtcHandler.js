export default function(io, socket) {
  socket.on('webrtc-offer', ({ targetSocketId, sdp }) => {
    io.to(targetSocketId).emit('webrtc-offer', {
      from: socket.id,
      sdp,
      userId: socket.user._id,
      userName: socket.user.name,
      role: socket.user.role
    });
  });

  socket.on('webrtc-answer', ({ targetSocketId, sdp }) => {
    io.to(targetSocketId).emit('webrtc-answer', {
      from: socket.id,
      sdp,
      userId: socket.user._id,
      userName: socket.user.name,
      role: socket.user.role
    });
  });

  socket.on('webrtc-ice-candidate', ({ targetSocketId, candidate }) => {
    io.to(targetSocketId).emit('webrtc-ice-candidate', {
      from: socket.id,
      candidate,
      userId: socket.user._id,
      userName: socket.user.name
    });
  });

  socket.on('media-state-change', ({ roomId, audio, video }) => {
    socket.to(roomId).emit('media-state-change', {
      socketId: socket.id,
      userId: socket.user._id,
      userName: socket.user.name,
      audio,
      video
    });
  });
}
