import {all, call, take, takeLatest, takeEvery, put} from 'redux-saga/effects'
import API from '../service/RestApi'
import Actions from '../action/'
import {resetLoading} from '../redux/LoadingIndicatorRedux'
import authHook from './authHookSaga'
import callApi from './apiSaga'
import login from './loginSaga'
import {LOCATION_CHANGE} from "connected-react-router";
const api = API.instance();

let previousRoute = undefined;

function* resetLoaderSaga(action) {
  const {payload: {location: {pathname}}} = action;
  if (previousRoute !== pathname) {
    yield put(resetLoading());
  }
  previousRoute = pathname;
}


// Root Saga
export default function * root() {
  yield all([
    // Authorization Hook
    call(authHook),

    // Login
    takeLatest(Actions.LOGIN, login),

    // use callApi saga for api call redux
    takeEvery(Actions.CALL_API, callApi, api),

    // Whenever location changes, trigger reset loader action.
    takeLatest(LOCATION_CHANGE, resetLoaderSaga),
  ])
}
