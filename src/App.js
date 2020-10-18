import React, {Component} from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import './scss/style.scss';
import {showNotification} from "./store/redux/notificationRedux";
import {connect} from "react-redux";
import {Type, Position} from "./constants/Notifications";
import {history} from "./store";
import {ConnectedRouter} from "connected-react-router";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const tag = 'App';

const Loading = () => {
  return (
    <div className="d-flex justify-content-center" style={{height: '100vh', flexDirection: 'row', alignItems: 'center'}}>
      <div className="spinner-border text-primary" role="status" style={{width: 100, height: 100}}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
};

class App extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.notification.created !== prevProps.notification.created) {
      const {message} = this.props.notification;
      console.log(tag, 'message', message);
      toast(message, {type: this.props.notification.type, position: this.props.notification.position, autoClose: 2000})
    }
  }

  // componentDidMount() {
  //   toast('test');
  // }

  render() {
    console.log(tag, 'auth', this.props.auth);

    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          {this.props.auth.isLoggingIn === true ?
            <Loading/> :
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>}/>
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>}/>
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>}/>
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>}/>
              {this.props.auth.isAuthenticated !== true && <Redirect to={"/login"}/>}
              <Route path="/" name="Home" render={props => <TheLayout {...props}/>}/>
            </Switch>
          }
        </React.Suspense>
        <ToastContainer autoClose={2000} hideProgressBar/>
      </HashRouter>
    );
  }
}

export default connect(
  (state) => ({notification: state.notification, auth: state.auth}),
  (dispatch) => ({toast: (type, message) => dispatch(showNotification(type, message))})
)(App);
