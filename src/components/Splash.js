import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'

class Splash extends Component {

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.dispatch({
        type: 'Navigation/RESET',
        index: 0,
        actions: [
          { type: 'Navigation/NAVIGATE', routeName: 'Home'/*, params: { back: true, alert: true }*/ }
        ]
      })
    }, 500);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textContainer}>Top Up Saldo</Text>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9896ff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  textContainer: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFFFFF',
    fontFamily: 'Bellota-Bold',
  }
})

export default Splash
