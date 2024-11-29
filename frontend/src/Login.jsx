
import React from 'react'
import './Login.css'

function Login() {
  return (
    <div className="signin-container">
      <h2>LOGIN</h2>
    
    <form className="signin-form">
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
        />
      </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
          />
        </div>

      <button type="submit" className="signin-button"> Login</button>
    </form>
    <p style={{marginTop:'20px'}}><a href='#home'>Forgot your password. Click here</a></p>
    <p><a href='#home'>Click here to Register</a></p>
  </div>
  )
}

export default Login

