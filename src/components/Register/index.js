import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    errorMsge: '',
    showError: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsge => {
    this.setState({showError: true, errorMsge})
  }

  onSubmitRegister = async event => {
    event.preventDefault()
    const {name, email, password, confirmPassword, gender} = this.state

    if (password.trim() !== confirmPassword.trim()) {
      this.onSubmitFailure('Passwords do not match')
      return
    }

    const apiUrl = 'http://localhost:5000/api/auth/register'
    const userDetails = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      gender,
    }

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token || '')
    } else {
      this.onSubmitFailure(data.error || 'Registration failed')
    }
  }

  onChangeInput = field => event => {
    this.setState({[field]: event.target.value})
  }

  renderInputField = (label, type, id, value, onChange) => (
    <div className="input-container">
      <label className="label-text" htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        className="input-element"
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </div>
  )

  renderGenderField = () => {
    const {gender} = this.state
    return (
      <div className="input-container">
        <label className="label-text">Gender</label>
        <div className="gender-container">
          <div className="gender-option">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={this.onChangeInput('gender')}
            />
            <label htmlFor="male" className="gender-label">Male</label>
          </div>
          <div className="gender-option">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={this.onChangeInput('gender')}
            />
            <label htmlFor="female" className="gender-label">Female</label>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      name,
      email,
      password,
      confirmPassword,
      showError,
      errorMsge,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="register-container">
        <div className="form-container">
          <form onSubmit={this.onSubmitRegister} className="form-div">
            <img
              className="website-logo"
              alt="website logo"
              src="https://sdmntpreastus.oaiusercontent.com/files/00000000-680c-61f9-a2c7-fe598dd7665f/raw?se=2025-06-22T22%3A46%3A40Z&sp=r&sv=2024-08-04&sr=b&scid=17f7c52d-6f03-586a-a08b-aee81c708ccd&skoid=02b7f7b5-29f8-416a-aeb6-99464748559d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-21T23%3A04%3A30Z&ske=2025-06-22T23%3A04%3A30Z&sks=b&skv=2024-08-04&sig=XQVh3JRR18UK9CQEs3h/zUFckWJrnJDQ6HjfOswZIIE%3D"
              style={{ width: '70px', height: '80',borderRadius:"0px 20px 0px 20px" }}
            />
            {this.renderInputField('Name', 'text', 'name', name, this.onChangeInput('name'))}
            {this.renderInputField('Email', 'email', 'email', email, this.onChangeInput('email'))}
            {this.renderInputField('Password', 'text', 'password', password, this.onChangeInput('password'))}
            {this.renderInputField('Confirm Password', 'text', 'confirmPassword', confirmPassword, this.onChangeInput('confirmPassword'))}

            {this.renderGenderField()}
            <div className="button-container">
              <button className="register-button" type="submit">Register</button>
            </div>
            {showError && <p className="error-message">*{errorMsge}</p>}
            <p className="register-text">
              Already have an account?{' '}
              <Link to="/login" className="register-login-link">Login</Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default Register
