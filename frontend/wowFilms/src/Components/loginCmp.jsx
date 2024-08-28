import React from 'react';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Custom CSS for styling

const Login = () => {
  const Navigator = useNavigate();

  
  const handleLogin = (e) => {
    e.preventDefault();

    const username = document.getElementById('usernameField').value;
    const password = document.getElementById('passwordField').value;
  
    const formData = {
      username: username,
      password: password,
    };
  
    fetch('http://109.199.99.84:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Login successful') {
          swal({
            title: 'Congrats!',
            text: 'Login Success',
            icon: 'success',
            button: 'Aww yiss!',
          }).then(() => {
             Navigator("/home");
          });
        } else {
          swal({
            title: 'Please Try Again',
            text: 'Some of Your Data are Incorrect',
            icon: 'error',
            button: 'Try again!',
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        swal({
          title: 'Error',
          text: 'Something went wrong!',
          icon: 'error',
          button: 'Try again!',
        });
      });
  };
  
  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="usernameField" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="usernameField"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordField" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="passwordField"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
