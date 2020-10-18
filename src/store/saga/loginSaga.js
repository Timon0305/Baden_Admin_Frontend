import {put, delay, call} from 'redux-saga/effects'
import API from '../service/RestApi'
import Credentials from '../service/Credentials'
import {loginSuccess, loginFailed} from "../redux/authRedux"
import {showNotification} from "../redux/notificationRedux";
import {NotificationType} from "../../constants/Notifications";

const tag = 'LoginSaga';
export default function* login(action) {
  const {email, password} = action.payload;
  const api = API.instance();

  yield delay(200);

  const response = yield call(API.login, api, email, password);

  const {ok, data, status} = response;

  if (ok && data) {
    yield put(showNotification(NotificationType.INFO, "Login Success"));

    // Delay 500ms.
    yield delay(500);

    // Dispatch login success message
    const cred = Credentials.fromResponse(data);

    yield put(loginSuccess(cred))
  } else {
    const message = (data && data.error) || (!ok && (((status && status + " : ") || "") + data.error));

    // Dispatch login fail
    yield put(showNotification(NotificationType.ERROR, message));

    // Dispatch login failed action
    yield put(loginFailed())
  }
}
