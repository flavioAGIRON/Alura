import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import Timeline from './componentes/Timeline';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

function verifyAuth(props, component) {
  if (localStorage.getItem('auth-token') === null) {
    return <Redirect to='/' />
  } else {
    return <Route path={props.match.path} component={component}/>;
  }
}

ReactDOM.render(
  (
    <Router>
      <App>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/timeline" render={(props) => { return verifyAuth(props, Timeline) }} />
          <Route path="/timeline/:login" component={Timeline} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </App>
    </Router>
  ),
  document.getElementById('root')
);
