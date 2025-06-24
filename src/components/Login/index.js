import {Component} from 'react'
import {Link,Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMsge: '',
    showError: false,
    showPassword: false,
  }
  toggleShowPassword = () => {
  this.setState(prevState => ({ showPassword: !prevState.showPassword }))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsge => this.setState({showError: true, errorMsge})

  onSubmitLogin = async event => {
    event.preventDefault()
    const {email, password} = this.state
    //const apiUrl = 'https://apis.ccbp.in/login'
    const apiUrl = 'http://localhost:5000/api/auth/login'
    const userDetails = {email, password}
    console.log(userDetails);
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  // On Changing Functions
  onChangeUsername = event => this.setState({email: event.target.value})

  onChangePassword = event => this.setState({password: event.target.value})

  // Username Input
  renderUsername = () => {
    const {email} = this.state

    return (
      <div className="input-container">
        <label className="label-text" htmlFor="email">
          Email
        </label>
        <input
          type="text"
          value={email}
          onChange={this.onChangeUsername}
          placeholder="Username"
          className="input-element"
          id="username"
        />
      </div>
    )
  }

  // Password Input
  renderPassword = () => {
  const {password, showPassword} = this.state

  return (
    <div className="input-container">
      <label className="label-text" htmlFor="password">Password</label>
      <div className="password-toggle-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
          className="input-element with-toggle"
          id="password"
        />
        <button
          type="button"
          className="toggle-password-btn"
          onClick={this.toggleShowPassword}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
    )
  }

  render() {
    const {showError, errorMsge} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="form-container">
          <form onSubmit={this.onSubmitLogin} className="form-div">
            <img
              className="website-logo"
              alt="website logo"
              src="\assets\logo.png"
              style={{ width: '100px', height: 'auto',borderRadius:"0px 20px 0px 20px" }}
            />
            {this.renderUsername()}
            {this.renderPassword()}
            <div className="button-container">
              <button className="login-button" type="submit">
                Login
              </button>
            </div>
            {showError && <p className="error-message">*{errorMsge}</p>}
          </form>
          <p className="register-text">
            New user? <Link to="/register" className="register-link">Register here</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default Login
