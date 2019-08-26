import React, { Component } from 'react';
import { ActivityIndicator, Modal, View, Text } from 'react-native';

class ModalLoading extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => null}
      >
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color="#9896ff"
          />
        </View>
      </Modal>
    )
  }
}

export default ModalLoading