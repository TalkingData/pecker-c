'use strict';

window.socketClient = (function(){
  // or http://127.0.0.1:7001/chat
  const socket = io('/io');

  socket.on('connect', () => {
    console.log('connect!');
  });

  function filter(filterObject){
    socket.emit('filter', filterObject);
  }

  function onChange(callback){
    socket.on('change', callback);
  }

  return {
    filter:filter,
    onChange:onChange
  }
})(); 
