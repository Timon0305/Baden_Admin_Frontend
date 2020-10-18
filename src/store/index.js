import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as authRedux from './redux/authRedux'
import apiRedux from './redux/apiRedux'
import * as notificationRedux from './redux/notificationRedux'
import * as LoadingIndicatorRedux from './redux/LoadingIndicatorRedux'
import rootSaga from './saga/'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {createBrowserHistory} from 'history'
import Credentials from './service/Credentials'


export const reducers = (history) => combineReducers({
  router: connectRouter(history),
  api: apiRedux.reducer,
  loadingIndicator: LoadingIndicatorRedux.reducer,
  notification: notificationRedux.reducer,
  auth: authRedux.reducer,
});

export const history = createBrowserHistory();

const _configureStore = (_rootReducer, _rootSaga) => {
  const middlewares = [];
  const enhancers = [];

  // Push router middleware
  middlewares.push(routerMiddleware(history));

  // Saga middleware
  const sagaMiddleware = createSagaMiddleware();

  // Push saga middleware
  middlewares.push(sagaMiddleware);

  // Assemble middleware
  enhancers.push(applyMiddleware(...middlewares));

  // Create Store
  const store = createStore(
    _rootReducer(history),
    {
      auth: Credentials.fromStorage().toState()
    },
    compose(...enhancers)
  )

  // Kickoff root saga
  const sagasManager = sagaMiddleware.run(_rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleware,
  }
}

export default () => {
  let {store, sagasManager, sagaMiddleware} = _configureStore(reducers, rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers(require('./').history);
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('./saga/').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      })
    })
  }
  return store;
}
