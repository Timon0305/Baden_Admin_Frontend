import {put, select, take} from 'redux-saga/effects'
import Actions from '../action/'
import {resetLoading} from '../redux/LoadingIndicatorRedux'
import {selector as authStateSelector} from '../redux/authRedux'
import Credentials from "../service/Credentials";

export default function* authHook() {
  while (true) {
    const {type, payload} = yield take([Actions.LOGIN_SUCCESS, Actions.LOGOUT]);
    try {
      if (type === Actions.LOGIN_SUCCESS) {
        // Payload is credential object in login_success action
        payload.save2Storage();
      }
      else if (type === Actions.LOGOUT) {
        // Clear credentials storage
        Credentials.clearStorage();

        // Reset loading flag
        yield put(resetLoading());

        // Redirect to login url.
        // No need to push, because AuthRoute component will automatically redirect.
        // yield put(push('/login'));
      }
    }
    catch (e) {

    }
  }
}
