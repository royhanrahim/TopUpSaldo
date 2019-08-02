import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, Alert, Modal, TextInput } from 'react-native'
import { Fab, Icon, Button } from 'native-base'
import { connect } from 'react-redux'

import {
  addTransaction,
  deleteTransaction,
  deleteAllTransaction,
  updateTransaction,
  refreshList,
  transferBalance,
} from '../actions/user';
import Utils from './Utils';

var moment = require('moment');

let SCREEN_WIDTH = Dimensions.get('window').width
let SCREEN_HEIGHT = Dimensions.get('window').height
let DATE = new Date()

class DetailBalance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moreButton: '',
      modalVisible: false,
      modalTransfer: false,
      errorValidation: false,
      errorTotalTransfer: false,
      errorAccountTransfer: false,
      editTransaction: false,
      typeEdit: false,
      id_transaction: "",
      total: "",
      ex_total: "",
      total_transfer: "",
      id_transfer: "",
      name_transfer: "",
      note: "",
      date: moment(DATE).format("DD MMMM YYYY"),
      type: "",
    }
  }

  componentDidMount() {
    console.log('==== THIS PROPS DETAIL ==== ', this.props.navigation.state.params);
  }

  componentWillReceiveProps() {

  }

  modalTransaction = (value) => {
    this.setState({ modalVisible: true, type: value })
  }

  modalTransfer = () => {
    this.setState({ modalTransfer: true })
  }

  deleteTransaction = (item) => {
    const params = this.props.navigation.state.params
    this.props.deleteTransaction(item.id, params.data.id)
  }

  editTransaction = (item) => {
    this.setState({
      modalVisible: true,
      editTransaction: true,
      id_transaction: item.id,
      // total: String(item.total),
      ex_total: String(item.total),
      note: item.note,
    })
  }

  buttonMore = (id) => {
    this.setState({ moreButton: id })
    if (this.state.moreButton == id) {
      this.setState({ moreButton: "" })
    }
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  deleteAllTransaction = (value, arrayTransaction) => {
    Alert.alert(
      "Warning", "Apakah Anda ingin menghapus semua transaksi ?",
      [
        {
          text: 'Iya',
          onPress: () => this.props.deleteAllTransaction(value.id),
        },
        { text: 'Tidak', style: 'cancel', },
      ],
      { cancelable: false })
  }

  saveTransaction = () => {
    const { total, note, date, type, editTransaction, id_transaction, typeEdit, ex_total } = this.state
    let params = this.props.navigation.state.params
    var UUID = [];

    if (editTransaction == true) {
      if (total == "") {
        this.setState({ errorValidation: true })
      } else {
        this.props.updateTransaction(id_transaction, params.data.id, total, ex_total, note, typeEdit)
        this.cancelSave()
      }
    } else {
      if (total == "") {
        this.setState({ errorValidation: true })
      } else {
        for (var i = 0; i < 10; i++) {
          UUID.push(Math.floor(Math.random() * 6) + 1)
        }

        this.props.addTransaction(UUID.join(""), total, note, type, date, params.data.id)
        this.cancelSave()
      }
    }
  }

  transfer = () => {
    const { id_transfer, name_transfer, total_transfer, date } = this.state
    let params = this.props.navigation.state.params
    var ID_FROM_TRANSACTION = [];
    var ID_TO_TRANSACTION = []

    if (total_transfer == "") {
      this.setState({ errorTotalTransfer: true })
    } else if (name_transfer == "") {
      this.setState({ errorAccountTransfer: true })
    } else {
      for (var i = 0; i < 10; i++) {
        ID_FROM_TRANSACTION.push(Math.floor(Math.random() * 6) + 1)
        ID_TO_TRANSACTION.push(Math.floor(Math.random() * 6) + 1)
      }

      this.props.transferBalance(params.data.id, params.data.name, id_transfer, name_transfer, ID_FROM_TRANSACTION.join(""), ID_TO_TRANSACTION.join(""), total_transfer, date)
      this.cancelTransfer()
    }
  }

  chooseAccountTransfer = (item) => {
    this.setState({
      id_transfer: item.id,
      name_transfer: item.name,
      errorAccountTransfer: false,
    })
  }

  cancelSave = () => {
    this.setState({ modalVisible: false, moreButton: '', id_transaction: '', total: '', note: '', type: "", errorValidation: false, typeEdit: false, editTransaction: false, ex_total: "", })
  }

  cancelTransfer = () => {
    this.setState({
      modalTransfer: false,
      id_transfer: "",
      name_transfer: "",
      total_transfer: "",
      errorTotalTransfer: false,
      errorAccountTransfer: false,
    })
  }

  changeTypeEdit = () => {
    this.setState({ typeEdit: true })
    if (this.state.typeEdit == true) {
      this.setState({ typeEdit: false })
    }
  }

  _onRefresh = () => {
    this.props.refreshList(true)
    setTimeout(() => {
      this.props.refreshList(false)
    }, 500);
  }

  renderListTransaction(item, index) {
    const { moreButton } = this.state

    return (
      <View key={index} style={{ backgroundColor: '#dadaed', paddingHorizontal: 10, paddingVertical: 5, marginTop: 10, marginBottom: 5, borderRadius: 5, marginHorizontal: 10 }}>
        <TouchableOpacity style={{ paddingVertical: 5 }} onPress={() => this.buttonMore(item.id)}>
          <View style={{ flexDirection: 'row', flex: 1, borderBottomWidth: 0.5, paddingBottom: 5 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: '#222226' }}>{item.total > 0 ? "Added :" : "Reduced :"}</Text>
              <Text style={{ fontSize: 16, color: '#222226' }}>{item.total > 0 ? "(+)" : "(-)"} {Utils.currencyCommas(String(item.total))}</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
              <Text style={{ fontSize: 14, color: '#222226' }}>{item.date}</Text>
            </View>
          </View>

          <View style={{ paddingTop: 5 }}>
            <Text style={{ fontSize: 14, color: '#222226' }}>Note :</Text>
            <Text style={{ fontSize: 16, color: '#222226' }}>{item.note == "" ? "-" : item.note}</Text>
          </View>
        </TouchableOpacity>
        {moreButton == item.id ?
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <TouchableOpacity style={{ backgroundColor: '#a0a0a3', flex: 1, paddingVertical: 20, alignItems: 'center', borderRadius: 3, marginRight: 5, }} onPress={() => this.editTransaction(item)}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#a0a0a3', flex: 1, paddingVertical: 20, alignItems: 'center', borderRadius: 3 }} onPress={() => this.deleteTransaction(item)}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>Delete</Text>
            </TouchableOpacity>
          </View>
          : null
        }
      </View>
    )
  }

  render() {
    let { users } = this.props
    let params = this.props.navigation.state.params
    let arrayTransaction = []
    const index = users.users.findIndex((e) => e.id === params.data.id);
    const { moreButton, note, total, total_transfer, id_transfer, name_transfer, ex_total, errorValidation, errorTotalTransfer, errorAccountTransfer, editTransaction, typeEdit } = this.state

    if (index !== -1) {
      if (users.users[index].transaction.length !== 0) {
        arrayTransaction = users.users[index].transaction
      }
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 92 }}>
          <View style={{ backgroundColor: '#9896ff', flexDirection: 'row', justifyContent: 'space-between', height: 60 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
              <TouchableOpacity style={{ backgroundColor: '#6565db', marginLeft: 10, paddingHorizontal: 5, paddingVertical: 10, borderRadius: 5 }} onPress={() => this.goBack()}>
                <Text style={{ fontSize: 14, color: '#FFFFFF', textAlign: 'center' }}>BACK</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginHorizontal: 5 }} numberOfLines={2}>DETAIL BALANCE {params.data.name}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', padding: 5 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6565db',
                  justifyContent: 'center',
                  marginHorizontal: 5,
                  borderRadius: 5,
                  width: 60,
                  height: 50,
                }}
                onPress={() => this.deleteAllTransaction(params.data, arrayTransaction)}
              >
                <Text style={{ fontSize: 14, color: '#FFFFFF', textAlign: 'center' }}>DELETE ALL</Text>
              </TouchableOpacity>
            </View>
          </View>

          {arrayTransaction.length == 0 ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ fontSize: 22, color: '#222226' }}>No Data</Text>
            </View>
            :
            <FlatList
              data={arrayTransaction}
              // extraData={this.state}
              renderItem={({ item, index }) => this.renderListTransaction(item, index)}
              keyExtractor={(item, index) => `key-${item.id}`}
              refreshControl={
                <RefreshControl
                  refreshing={users.refreshList}
                  onRefresh={this._onRefresh}
                  tintColor="#9896ff"
                  colors={['#9896ff']}
                />
              }
            />
          }

        </View>

        <View style={{ flex: 8, flexDirection: 'row' }}>
          <View style={{ flex: 1.5, justifyContent: 'center', paddingLeft: 5 }}>
            <Text style={{ flex: 1, textAlignVertical: 'center', fontSize: 18, color: '#222226' }}>
              Remaining Balance :
            </Text>
            <Text style={{ flex: 1, textAlignVertical: 'center', fontSize: 16, color: '#222226' }}>
              Rp. {Utils.currencyCommas(String(params.data.balance))}
            </Text>
          </View>

          <View style={{ flex: 1, padding: 5, flexDirection: 'row' }}>
            <TouchableOpacity style={{ backgroundColor: '#9896ff', flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 5 }} activeOpacity={0.5} onPress={() => this.modalTransfer()}>
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                TF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#9896ff', flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 5, marginHorizontal: 5 }} activeOpacity={0.5} onPress={() => this.modalTransaction(false)}>
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                (-)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#9896ff', flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 5 }} activeOpacity={0.5} onPress={() => this.modalTransaction(true)}>
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                (+)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.cancelSave()
          }}>
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ width: SCREEN_WIDTH, padding: 10 }}>
              <View style={{ backgroundColor: '#dadaed', justifyContent: 'center', paddingTop: 10, paddingBottom: 50, paddingHorizontal: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                <TextInput
                  style={{ borderBottomWidth: 0.5, color: '#222226', paddingLeft: 0, paddingBottom: 0, fontSize: 14, marginBottom: 10 }}
                  placeholder={editTransaction == true ? `Total past transactions (${ex_total})` : 'Total'}
                  value={total}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'number-pad'}
                  onChangeText={(total) => this.setState({ total: total, errorValidation: false })}
                  onSubmitEditing={() => this.note.focus()}
                  returnKeyType={'next'}
                />
                {errorValidation == true ?
                  <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    Please complete this fields
                  </Text>
                  : null
                }
                <TextInput
                  ref={(note) => { this.note = note }}
                  style={{ borderBottomWidth: 0.5, color: '#222226', paddingLeft: 0, paddingBottom: 0, fontSize: 14 }}
                  placeholder={'Note'}
                  value={note}
                  multiline={true}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'default'}
                  onChangeText={(note) => this.setState({ note: note, errorValidation: false })}
                />
              </View>
              {editTransaction == true ?
                <View style={{ backgroundColor: '#dadaed', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 5, flexDirection: 'row', }}>
                  <TouchableOpacity style={{ backgroundColor: '#9896ff', marginRight: 5, width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.changeTypeEdit()}>
                    {typeEdit == false ?
                      <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>Reduced (-)</Text>
                      :
                      <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>Added (+)</Text>
                    }
                  </TouchableOpacity>
                </View>
                : null
              }

              <View style={{ backgroundColor: '#dadaed', justifyContent: 'flex-end', alignItems: 'center', padding: 10, flexDirection: 'row', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', marginRight: 5, width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.cancelSave()} activeOpacity={0.5}>
                  <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.saveTransaction()} activeOpacity={0.5}>
                  {editTransaction == true ?
                    <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>UPDATE</Text>
                    :
                    <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>SAVE</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalTransfer}
          onRequestClose={() => {
            this.cancelTransfer()
          }}>
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2, padding: 10 }}>
              <View style={{ backgroundColor: '#dadaed', paddingTop: 10, paddingHorizontal: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5, flex: 1 }}>
                <TextInput
                  style={{ borderBottomWidth: 0.5, color: '#222226', paddingLeft: 0, paddingBottom: 0, fontSize: 14, marginBottom: 10 }}
                  placeholder={"Total Transfer"}
                  value={total_transfer}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'number-pad'}
                  onChangeText={(total) => this.setState({ total_transfer: total, errorTotalTransfer: false })}
                  returnKeyType={'done'}
                />
                {errorTotalTransfer == true ?
                  <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    Please complete this fields
                  </Text>
                  : null
                }
                <View
                  style={{
                    paddingVertical: 5,
                    borderBottomColor: '#7e7e82',
                    borderBottomWidth: 0.7,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: name_transfer !== "" ? '#222226' : '#7e7e82',
                    }}
                  >
                    {name_transfer !== "" ? name_transfer : "Press one of the accounts below"}
                  </Text>
                  {errorAccountTransfer == true ?
                    <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      Please complete this fields
                  </Text>
                    : null
                  }
                </View>
                <View
                  style={{
                    marginVertical: 10,
                    borderWidth: 0.8,
                    borderColor: '#222226',
                    borderRadius: 5,
                    flex: 1,
                  }}
                >
                  <FlatList
                    data={users.users}
                    renderItem={({ item, index }) =>
                      item.length !== 0 ?
                        item.id == params.data.id ?
                          null
                          :
                          <TouchableOpacity
                            style={{
                              marginHorizontal: 5,
                              paddingVertical: 3,
                              marginVertical: 3,
                              borderBottomColor: '#222226',
                              borderBottomWidth: 0.8,
                            }}
                            onPress={() => { this.chooseAccountTransfer(item) }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: '#222226'
                              }}
                            >
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        :
                        <View>
                          <Text>No Data</Text>
                        </View>
                    }
                    keyExtractor={(item, index) => `key-${item.id}`}
                  />
                </View>
              </View>

              <View style={{ backgroundColor: '#dadaed', justifyContent: 'flex-end', alignItems: 'center', padding: 10, flexDirection: 'row', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', marginRight: 5, width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.cancelTransfer()} activeOpacity={0.5}>
                  <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.transfer()} activeOpacity={0.5}>
                  <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>TRANSFER</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users
})

const mapDispatchToProps = dispatch => ({
  addTransaction: (id, total, note, type, date, id_user) => dispatch(addTransaction(id, total, note, type, date, id_user)),
  deleteTransaction: (id, user_id) => dispatch(deleteTransaction(id, user_id)),
  deleteAllTransaction: (id) => dispatch(deleteAllTransaction(id)),
  updateTransaction: (id, id_user, total, ex_total, note, type_edit) => dispatch(updateTransaction(id, id_user, total, ex_total, note, type_edit)),
  refreshList: (bool) => dispatch(refreshList(bool)),
  transferBalance: (id_from, name_from, id_to, name_to, id_from_transaction, id_to_transaction, total_transfer, date) => dispatch(transferBalance(id_from, name_from, id_to, name_to, id_from_transaction, id_to_transaction, total_transfer, date))
})

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(DetailBalance)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
})
