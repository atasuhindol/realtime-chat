const token = localStorage.getItem('token');

const socket = io('http://localhost:3000', {
  auth: {
    token
  }
});
