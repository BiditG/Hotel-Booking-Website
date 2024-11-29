import React from 'react'
import './Register.css'
import './Login'

function Register() {
  return (
    <div className="register-container">
      <h2>REGISTER</h2>
    
      <form className="register-form">
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

        <button type="submit" className="register-button">Register</button>
      </form>
      
      <p style={{marginTop:'20px'}}><a href='./Login'>Already have an account? Login here</a></p>
    </div>
  )
}

export default Register
