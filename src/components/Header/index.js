import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <nav className="nav-container">
        <Link to="/">
          <img
              className="header-logo"
              alt="website logo"
              src="https://sdmntpreastus.oaiusercontent.com/files/00000000-680c-61f9-a2c7-fe598dd7665f/raw?se=2025-06-22T22%3A46%3A40Z&sp=r&sv=2024-08-04&sr=b&scid=17f7c52d-6f03-586a-a08b-aee81c708ccd&skoid=02b7f7b5-29f8-416a-aeb6-99464748559d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-21T23%3A04%3A30Z&ske=2025-06-22T23%3A04%3A30Z&sks=b&skv=2024-08-04&sig=XQVh3JRR18UK9CQEs3h/zUFckWJrnJDQ6HjfOswZIIE%3D"
              style={{ width: '70px', height: 'auto',borderRadius:"0px 20px 0px 20px" }}
            />
        </Link>

        <ul className="mobile-nav-container">
          <li className="nav-item">
            <Link to="/">
              <button className="mobile-buttons" type="button">
                <AiFillHome className="mobile-icons" />
              </button>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jobs">
              <button className="mobile-buttons" type="button">
                <BsFillBriefcaseFill className="mobile-icons" />
              </button>
            </Link>
          </li>
          <li className="nav-item">
            <button
              onClick={onClickLogout}
              className="mobile-buttons"
              type="button"
            >
              <FiLogOut className="mobile-icons" />
            </button>
          </li>
        </ul>

        <ul className="large-nav-container">
          <li className="nav-item">
            <Link className="large-link" to="/">
              <p className="large-buttons">Home</p>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="large-link" to="/jobs">
              <p className="large-buttons">Jobs</p>
            </Link>
          </li>
          <li className="nav-item">
            <button
              onClick={onClickLogout}
              className="large-logout-button"
              type="button"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default withRouter(Header)
