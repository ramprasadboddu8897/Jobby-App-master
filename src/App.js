import {Switch, Redirect, Route} from 'react-router-dom'
import ProtectRoute from './components/ProtectedRoute'
import './App.css'

import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobDetailsSection from './components/JobDetailsSection'
import NotFound from './components/NotFound'
import Register from './components/Register'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
    <ProtectRoute exact path="/" component={Home} />
    <ProtectRoute exact path="/jobs" component={Jobs} />
    <ProtectRoute exact path="/jobs/:id" component={JobDetailsSection} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App