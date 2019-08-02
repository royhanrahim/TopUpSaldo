import { AsyncStorage } from 'react-native'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistReducer, persistStore } from 'redux-persist'
import { createLogger } from 'redux-logger'

import rootReducer from '../reducers'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // whitelist: [],
}

const middleWare = [];
const persistedReducer = persistReducer(persistConfig, rootReducer)
middleWare.push(thunk)

const loggerMiddleware = createLogger({
  predicate: () => process.env.NODE_ENV === 'development',
});
middleWare.push(loggerMiddleware)

// let store = createStore(persistedReducer, logger)
let store = createStore(
  persistedReducer,
  {},
  compose(
    applyMiddleware(...middleWare)
  )
)
let persistor = persistStore(store)
// const middleware = []
// middleware.push(thunk)

// persistStore(store, persistConfig)

export { store, persistor }