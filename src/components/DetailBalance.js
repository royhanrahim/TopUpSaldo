import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, Alert, Modal, TextInput } from 'react-native'
import { Fab, Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5';
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

    Alert.alert(
      "Warning", "Apakah Anda ingin menghapus transaksi ini ?",
      [
        {
          text: 'Iya',
          onPress: () => this.props.deleteTransaction(item.id, params.data.id),
        },
        { text: 'Tidak', style: 'cancel', },
      ],
      { cancelable: false })
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

  goBack = () => {
    this.props.navigation.goBack()
  }

  getAllBalance = (item) => {
    const { date, } = this.state
    let params = this.props.navigation.state.params
    var UUID = [];
    var _note = "Ambil semua saldo"

    for (var i = 0; i < 10; i++) {
      UUID.push(Math.floor(Math.random() * 6) + 1)
    }

    if (params.data.balance == 0) {
      Alert.alert("Warning", "Harap isi saldo terlebih dahulu")
    } else if (params.data.balance < 0) {
      Alert.alert("Warning", "Maaf saldo Anda sudah kurang dari nol, mohon isi saldo terlebih dahulu")
    } else {
      Alert.alert(
        "Warning", "Apakah Anda ingin mengambil semua saldo ?",
        [
          {
            text: 'Iya',
            onPress: () => {
              this.props.addTransaction(UUID.join(""), params.data.balance, _note, false, date, params.data.id)
            },
          },
          { text: 'Tidak', style: 'cancel', },
        ],
        { cancelable: false })
    }
  }

  deleteAllTransaction = (value) => {
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
    this.setState({ modalVisible: false, id_transaction: '', total: '', note: '', type: "", errorValidation: false, typeEdit: false, editTransaction: false, ex_total: "", })
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

  changeTotal = (value) => {
    let amount = value.split(".").join('')

    this.setState({
      total: amount,
      errorValidation: false
    })
  }
  changeTotalTransfer = (value) => {
    let amount = value.split(".").join('')

    this.setState({
      total_transfer: amount,
      errorTotalTransfer: false,
    })
  }

  _onRefresh = () => {
    this.props.refreshList(true)
    setTimeout(() => {
      this.props.refreshList(false)
    }, 500);
  }

  renderListTransaction(item, index) {
    const { } = this.state

    return (
      <View
        key={index}
        style={{
          backgroundColor: 'rgba(250, 250, 250, 1)',
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginTop: 10,
          marginBottom: 5,
          borderRadius: 5,
          marginHorizontal: 10,
          elevation: 5,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 0.5 * 5 },
          shadowOpacity: 0.3,
          shadowRadius: 0.8 * 5
        }}
      >
        <View style={{ paddingVertical: 5 }}>
          <View style={{ flexDirection: 'row', flex: 1, borderBottomWidth: 0.5, paddingBottom: 5 }}>
            <View style={{ flex: 1, }}>
              <Text style={{ fontSize: 14, color: item.total > 0 ? 'rgba(102, 82, 255, 1)' : 'rgba(255, 0, 0, 1)' }}>{item.total > 0 ? "Ditambah :" : "Dikurang :"}</Text>
              <Text style={{ fontSize: 16, color: '#222226' }}>Rp. {Utils.currencyCommas(String(item.total))}</Text>
            </View>

            <View style={{ alignItems: 'flex-end', flex: 1, }}>
              <Text style={{ fontSize: 14, color: 'rgba(118, 173, 120, 1)' }}>Saldo Terakhir</Text>
              <Text style={{ fontSize: 14, color: '#222226' }}>Rp. {Utils.currencyCommas(String(item.last_balance ? item.last_balance : 0))}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', flex: 1, paddingTop: 5, }}>
            <View style={{ flex: 1, }}>
              <Text style={{ fontSize: 14, color: '#222226' }}>Catatan :</Text>
              <Text style={{ fontSize: 16, color: '#222226' }}>{item.note == "" ? "-" : item.note}</Text>
            </View>

            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 14, color: '#222226' }}>{item.date}</Text>
              <Icon
                onPress={() => this.deleteTransaction(item)}
                name='trash'
                size={18}
                color='#FFFFFF'
                style={{ backgroundColor: '#9896ff', padding: 5, justifyContent: 'center', alignItems: 'center', marginTop: 5, borderRadius: 5, }}
              />
            </View>
          </View>

          {/* <View style={{ paddingTop: 5, backgroundColor: 'grey' }}>
            <Text style={{ fontSize: 14, color: '#222226' }}>Catatan :</Text>
            <Text style={{ fontSize: 16, color: '#222226' }}>{item.note == "" ? "-" : item.note}</Text>
          </View> */}
        </View>
      </View>
    )
  }

  render() {
    let { users } = this.props
    let params = this.props.navigation.state.params
    let arrayTransaction = []
    const index = users.users.findIndex((e) => e.id === params.data.id);
    const { note, total, total_transfer, id_transfer, name_transfer, ex_total, errorValidation, errorTotalTransfer, errorAccountTransfer, editTransaction, typeEdit } = this.state

    if (index !== -1) {
      if (users.users[index].transaction.length !== 0) {
        arrayTransaction = users.users[index].transaction
      }
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 92 }}>
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
            }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
              <TouchableOpacity style={{ marginLeft: 10, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 }} onPress={() => this.goBack()}>
                <Icon
                  name='chevron-left'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginHorizontal: 5 }} numberOfLines={2}>SALDO DETAIL {params.data.name}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                }}
                onPress={() => this.getAllBalance(arrayTransaction)}
              >
                <Icon
                  name='coins'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  marginRight: 10,
                  marginLeft: 5,
                }}
                onPress={() => this.deleteAllTransaction(params.data)}
              >
                <Icon
                  name='trash'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
          </View>

          {arrayTransaction.length == 0 ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ fontSize: 22, color: '#222226' }}>Tidak ada data</Text>
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
          <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 5 }}>
            <Text style={{ flex: 1, textAlignVertical: 'center', fontSize: 18, color: '#222226' }}>
              Sisa Saldo :
            </Text>
            <Text numberOfLines={2} style={{ flex: 1, textAlignVertical: 'center', fontSize: 16, color: '#222226' }}>
              Rp. {Utils.currencyCommas(String(params.data.balance))}
            </Text>
          </View>

          <View style={{ flex: 1, padding: 5, flexDirection: 'row', justifyContent: 'flex-end', }}>
            <TouchableOpacity style={{ backgroundColor: '#9896ff', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 18 }} activeOpacity={0.5} onPress={() => this.modalTransfer()}>
              <Icon
                name='paper-plane'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#9896ff', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 18, marginHorizontal: 5 }} activeOpacity={0.5} onPress={() => this.modalTransaction(false)}>
              <Icon
                name='minus'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#9896ff', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 18 }} activeOpacity={0.5} onPress={() => this.modalTransaction(true)}>
              <Icon
                name='plus'
                size={18}
                color='#FFFFFF'
              />
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
              <View style={{ backgroundColor: 'rgba(250, 250, 250, 1)', justifyContent: 'center', paddingTop: 10, paddingBottom: 50, paddingHorizontal: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                <TextInput
                  style={{ borderBottomWidth: 0.5, color: '#222226', paddingLeft: 0, paddingBottom: 0, fontSize: 14, marginBottom: 10 }}
                  placeholder={editTransaction == true ? `Total past transactions (${ex_total})` : 'Total'}
                  value={Utils.formatterCurrencyBillion(total)}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'number-pad'}
                  maxLength={13}
                  onChangeText={(total) => this.changeTotal(total)}
                  onSubmitEditing={() => this.note.focus()}
                  returnKeyType={'next'}
                  autoFocus={true}
                />
                {errorValidation == true ?
                  <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    Silakan lengkapi kolomnya
                  </Text>
                  : null
                }
                <TextInput
                  ref={(note) => { this.note = note }}
                  style={{ borderBottomWidth: 0.5, color: '#222226', paddingLeft: 0, paddingBottom: 0, fontSize: 14 }}
                  placeholder={'Catatan'}
                  value={note}
                  multiline={true}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'default'}
                  onChangeText={(note) => this.setState({ note: note, errorValidation: false })}
                />
              </View>
              {editTransaction == true ?
                <View style={{ backgroundColor: 'rgba(250, 250, 250, 1)', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 5, flexDirection: 'row', }}>
                  <TouchableOpacity style={{ backgroundColor: '#9896ff', marginRight: 5, width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.changeTypeEdit()}>
                    {typeEdit == false ?
                      <Icon
                        name='minus'
                        size={18}
                        color='#FFFFFF'
                      />
                      :
                      <Icon
                        name='plus'
                        size={18}
                        color='#FFFFFF'
                      />
                    }
                  </TouchableOpacity>
                </View>
                : null
              }

              <View style={{ backgroundColor: 'rgba(250, 250, 250, 1)', justifyContent: 'flex-end', alignItems: 'center', padding: 10, flexDirection: 'row', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', marginRight: 5, width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.cancelSave()} activeOpacity={0.5}>
                  <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.saveTransaction()} activeOpacity={0.5}>
                  {editTransaction == true ?
                    <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>PERBARUI</Text>
                    :
                    <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>SIMPAN</Text>
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
            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 3, padding: 10 }}>
              <View style={{ backgroundColor: 'rgba(250, 250, 250, 1)', paddingTop: 10, paddingHorizontal: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5, flex: 1 }}>
                <TextInput
                  style={{ borderBottomWidth: 0.5, color: '#222226', paddingLeft: 0, paddingBottom: 0, fontSize: 14, marginBottom: 10 }}
                  placeholder={"Total Transfer"}
                  value={Utils.formatterCurrencyBillion(total_transfer)}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'number-pad'}
                  maxLength={13}
                  onChangeText={(total) => this.changeTotalTransfer(total)}
                  returnKeyType={'done'}
                />
                {errorTotalTransfer == true ?
                  <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    Silakan lengkapi kolomnya
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
                      color: name_transfer !== "" ? '#222226' : 'rgba(97, 92, 255, 1)',
                    }}
                  >
                    {name_transfer !== "" ? name_transfer : "Tekan salah satu akun di bawah ini"}
                  </Text>
                  {errorAccountTransfer == true ?
                    <Text style={{ color: '#cf2749', paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      Silakan lengkapi kolomnya
                  </Text>
                    : null
                  }
                </View>
                <View
                  style={{
                    marginVertical: 10,
                    borderRadius: 5,
                  }}
                >
                  <FlatList
                    data={users.users}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) =>
                      item.length !== 0 ?
                        item.id == params.data.id ?
                          null
                          :
                          <TouchableOpacity
                            style={{
                              marginRight: 5,
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              marginVertical: 3,
                              backgroundColor: 'rgba(196, 194, 255, 1)',
                              borderRadius: 5,
                              elevation: 1,
                              shadowColor: 'black',
                              shadowOffset: { width: 0, height: 0.5 * 5 },
                              shadowOpacity: 0.3,
                              shadowRadius: 0.8 * 5,
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
                          <Text>Tidak ada data</Text>
                        </View>
                    }
                    keyExtractor={(item, index) => `key-${item.id}`}
                  />
                </View>
              </View>

              <View style={{ backgroundColor: 'rgba(250, 250, 250, 1)', justifyContent: 'flex-end', alignItems: 'center', padding: 10, flexDirection: 'row', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', marginRight: 5, width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.cancelTransfer()} activeOpacity={0.5}>
                  <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>BATAL</Text>
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
