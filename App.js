import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Root } from 'native-base'

import { store, persistor } from './src/store/configureStore';
import { AppNavigator } from './src/config/Router';

const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component {
  render() {
    return (
      // <AppContainer />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <AppContainer />
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}