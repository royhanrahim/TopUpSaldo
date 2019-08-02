import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput, Alert } from 'react-native'
import { Fab, Icon, Button, } from 'native-base'
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux'

import {
  addUser,
  updateUser,
} from '../actions/user';
import Utils from '../components/Utils';

var moment = require('moment');

let SCREEN_WIDTH = Dimensions.get('window').width
let SCREEN_HEIGHT = Dimensions.get('window').height
let DATE = new Date()

class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      balance: "",
      date: moment(DATE).format("DD MMMM YYYY"),
      transaction: [],
      errorName: '',
      errorBalance: '',
    }
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {
      let _data = this.props.navigation.state.params.data
      this.setState({
        name: _data.name,
        balance: _data.balance,
        date: _data.date,
        transaction: _data.transaction
      })
    }
  }

  saveUser = () => {
    let params = this.props.navigation.state.params
    const { name, balance, date } = this.state
    var UUID = [];

    if (params) {
      if (name == "" || balance == "") {
        Alert.alert("Warning", "Please complete the fields")
      } else {
        this.props.updateUser(params.data.id, name, params.data.balance, date, params.data.transaction)
        this.props.navigation.goBack()
      }
    } else {
      for (var i = 0; i < 10; i++) {
        UUID.push(Math.floor(Math.random() * 6) + 1)
      }

      if (name == "") {
        this.setState({
          errorName: "Name can't be empty"
        })
      } else if (balance == "") {
        this.setState({
          errorBalance: "Balance can't be empty"
        })
      } else {
        this.props.addUser(UUID.join(""), name, balance, date)
        this.props.navigation.goBack()
      }
    }
  }

  setDate = (_date) => {
    this.setState({ date: _date })
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    let { users } = this.props
    let params = this.props.navigation.state.params
    const { name, balance, date, errorName, errorBalance } = this.state

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#9896ff', flexDirection: 'row', justifyContent: 'space-between', height: 60 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
              <TouchableOpacity style={{ backgroundColor: '#6565db', marginLeft: 15, paddingHorizontal: 5, paddingVertical: 10, borderRadius: 5 }} onPress={() => this.goBack()}>
                <Text style={{ fontSize: 14, color: '#FFFFFF' }}>BACK</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center' }}>{params ? "EDIT" : "ADD"} USER</Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>

          <ScrollView style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, height: SCREEN_HEIGHT }}>
            <TextInput
              ref={(name) => { this.name = name }}
              style={{ borderBottomWidth: 0.5, fontSize: 14, color: '#222226', paddingLeft: 0, paddingBottom: 0 }}
              value={name}
              placeholder={"Name"}
              placeholderTextColor={"#c5c5d1"}
              onChangeText={(name) => this.setState({ name, errorName: "" })}
              onSubmitEditing={() => this.balance.focus()}
              returnKeyType={"next"}
            />
            {errorName !== "" ?
              <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                {errorName}
              </Text>
              : null
            }
            {params ?
              null :
              <TextInput
                ref={(balance) => { this.balance = balance }}
                style={{ borderBottomWidth: 0.5, fontSize: 14, color: '#222226', paddingLeft: 0, paddingBottom: 0 }}
                value={balance}
                placeholder={"Balance / Saldo"}
                placeholderTextColor={"#c5c5d1"}
                onChangeText={(balance) => this.setState({ balance, errorBalance: "" })}
                keyboardType={"number-pad"}
                returnKeyType={"done"}
                onSubmitEditing={() => this.saveUser()}
              />
            }
            {errorBalance !== "" ?
              <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                {errorBalance}
              </Text>
              : null
            }
            <View style={{ justifyContent: 'center', marginTop: 10 }}>
              <DatePicker
                style={{ width: 180, }}
                date={date}
                mode="date"
                placeholder="Select Date"
                format="DD MMMM YYYY"
                minDate="1900-01-01"
                // maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                // showIcon={false}
                customStyles={{
                  // dateIcon: {
                  //     position: 'absolute',
                  //     left: 0,
                  //     top: 4,
                  //     marginLeft: 0
                  // },
                  dateInput: {
                    // marginLeft: 36,
                    // backgroundColor: 'skyblue',
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    alignItems: 'flex-start'
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => { this.setState({ date: date }) }}
              />
            </View>
          </ScrollView>

          <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <TouchableOpacity style={{ width: 120, height: 50, backgroundColor: '#9896ff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 }} activeOpacity={0.5} onPress={() => this.saveUser()}>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{params ? "UPDATE" : "SAVE"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users
})

const mapDispatchToProps = dispatch => ({
  addUser: (id, name, balance, date) => dispatch(addUser(id, name, balance, date)),
  updateUser: (id, name, balance, date, transaction) => dispatch(updateUser(id, name, balance, date, transaction)),
})

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(AddUser)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
})
