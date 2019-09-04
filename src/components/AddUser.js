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
      if (name == "") {
        this.setState({
          errorName: "Nama tidak boleh kosong"
        })
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
            style={styles.containerHeader}
          >
            <View style={styles.containerLeftHeader}>
              <TouchableOpacity style={styles.buttonLeftHeader} onPress={() => this.goBack()}>
                <Icon
                  name='chevron-left'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
            <View style={styles.containerCenterHeader}>
              <Text style={styles.textCenterHeader}>{params ? "UBAH" : "TAMBAH"} PENGGUNA</Text>
            </View>
            <View style={{ flex: 0.5 }} />
          </View>

          <ScrollView style={styles.containerBody}>
            <TextInput
              ref={(name) => { this.name = name }}
              style={styles.containerInputForm}
              value={name}
              placeholder={"Nama"}
              placeholderTextColor={"#c5c5d1"}
              onChangeText={(name) => this.setState({ name, errorName: "" })}
              onSubmitEditing={() => this.balance.focus()}
              returnKeyType={"next"}
              autoFocus={true}
            />
            {errorName !== "" ?
              <Text style={styles.textErrorName}>
                {errorName}
              </Text>
              : null
            }
            {params ?
              null :
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                }}
              >
                <TextInput
                  ref={(balance) => { this.balance = balance }}
                  style={styles.containerInputFormBalance}
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
                <View style={styles.containerDate}>
                  <DatePicker
                    style={{ borderBottomWidth: 0.5, borderBottomColor: '#808080', width: SCREEN_WIDTH / 2.5, paddingBottom: 5 }}
                    date={date}
                    mode="date"
                    placeholder="Select Date"
                    format="DD MMMM YYYY"
                    minDate="1900-01-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateInput: {
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        alignItems: 'flex-start',
                        color: '#222226',
                      },
                      dateText: {
                        fontFamily: 'Bellota-Regular',
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => { this.setState({ date: date }) }}
                  />
                </View>
              </View>
            }
          </ScrollView>

          <View style={styles.containerButtonSave}>
            <TouchableOpacity style={styles.buttonSave} activeOpacity={0.5} onPress={() => this.saveUser()}>
              <Text style={{ fontSize: 18, color: '#FFFFFF', fontFamily: 'Bellota-Bold' }}>{params ? "PERBARUI" : "SIMPAN"}</Text>
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
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  containerHeader: {
    backgroundColor: '#9896ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5,
  },
  containerLeftHeader: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 5,
  },
  buttonLeftHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  containerCenterHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCenterHeader: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Bellota-Bold'
  },
  containerBody: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  containerInputForm: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#808080',
    fontSize: 14,
    color: '#222226',
    paddingLeft: 0,
    paddingBottom: 5,
    fontFamily: 'Bellota-Regular',
  },
  textErrorName: {
    color: '#cf2749',
    paddingVertical: 5,
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerInputFormBalance: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#808080',
    fontSize: 14,
    color: '#222226',
    paddingLeft: 0,
    paddingBottom: 5,
    flex: 1,
    fontFamily: 'Bellota-Regular',
  },
  containerDate: {
    flex: 1,
    alignItems: 'flex-end',
  },
  containerButtonSave: {
    backgroundColor: '#FFFFFF',
    paddingRight: 20,
    paddingVertical: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 0.1,
  },
  buttonSave: {
    backgroundColor: '#9896ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5
  }
})
