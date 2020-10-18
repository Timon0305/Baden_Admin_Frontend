import {createAction, createActions, handleActions} from 'redux-actions'
import Actions from '../action/'

const login = createAction(
  Actions.LOGIN,
  (email, password) => ({email, password})
)

const {logout, loginSuccess, loginFailed} = createActions(
  {},
  Actions.LOGOUT, Actions.LOGIN_SUCCESS, Actions.LOGIN_FAILED
)

const reducer = handleActions(
  {
    [Actions.LOGIN]: (state, action) => ({isLoggingIn: true, isAuthenticated: false}),
    [Actions.LOGIN_SUCCESS]: (state, {payload}) => ({isLoggingIn: false, ...payload.toState()}),
    [Actions.LOGIN_FAILED]: (state, action) => ({isLoggingIn: false, isAuthenticated: false}),
    [Actions.LOGOUT]: (state, action) => ({isLoggingIn: false, isAuthenticated: false})
  },
  {
    isLoggingIn: false,
    isAuthenticated: false,
    sessionToken: null,
    userDetails: null
  }
);

const selector = (state) => (state.auth);

export {
  login,
  logout,
  loginSuccess,
  loginFailed,
  reducer,
  selector
}
