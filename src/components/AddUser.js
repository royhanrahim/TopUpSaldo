import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput, Alert } from 'react-native'
import { Fab, Button, } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux'

import {
  addUser,
  updateUser,
} from '../actions/user';
import Utils from '../components/Utils';

var moment = require('moment');

const formatter = new Intl.NumberFormat('id', { useGrouping: true })

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
        Alert.alert("Warning", "Silakan lengkapi kolomnya")
      } else {
        this.props.updateUser(params.data.id, name, params.data.balance, date, params.data.transaction, params.data.order)
        this.props.navigation.goBack()
      }
    } else {
      for (var i = 0; i < 10; i++) {
        UUID.push(Math.floor(Math.random() * 6) + 1)
      }

      if (name == "") {
        this.setState({
          errorName: "Nama tidak boleh kosong"
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

  changeBalance = (value) => {
    let amount = value.split(".").join('')

    this.setState({
      balance: amount
    })
  }

  render() {
    let { users } = this.props
    let params = this.props.navigation.state.params
    const { name, balance, date, errorName } = this.state

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: '#9896ff',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 60,
              elevation: 5,
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 0.5 * 5 },
              shadowOpacity: 0.3,
              shadowRadius: 0.8 * 5
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
              <TouchableOpacity style={{ marginLeft: 15, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 }} onPress={() => this.goBack()}>
                <Icon
                  name='chevron-left'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center' }}>{params ? "UBAH" : "TAMBAH"} PENGGUNA</Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>

          <ScrollView style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, height: SCREEN_HEIGHT }}>
            <TextInput
              ref={(name) => { this.name = name }}
              style={{ borderBottomWidth: 0.5, fontSize: 14, color: '#222226', paddingLeft: 0, paddingBottom: 0 }}
              value={name}
              placeholder={"Nama"}
              placeholderTextColor={"#c5c5d1"}
              onChangeText={(name) => this.setState({ name, errorName: "" })}
              onSubmitEditing={() => this.balance.focus()}
              returnKeyType={"next"}
              autoFocus={true}
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
                value={Utils.formatterCurrencyBillion(balance)}
                defaultValue={balance}
                placeholder={"Saldo"}
                placeholderTextColor={"#c5c5d1"}
                onChangeText={(balance) => this.changeBalance(balance)}
                keyboardType={"number-pad"}
                returnKeyType={"done"}
                maxLength={13}
                onSubmitEditing={() => this.saveUser()}
              />
            }
            <View style={{ justifyContent: 'center', marginTop: 10 }}>
              <DatePicker
                style={{ width: 180, }}
                date={date}
                mode="date"
                placeholder="Select Date"
                format="DD MMMM YYYY"
                minDate="1900-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {
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
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{params ? "PERBARUI" : "SIMPAN"}</Text>
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
  updateUser: (id, name, balance, date, transaction, order) => dispatch(updateUser(id, name, balance, date, transaction, order)),
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
