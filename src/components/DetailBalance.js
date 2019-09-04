import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, Alert, Modal, TextInput, ScrollView } from 'react-native'
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
      id_transaction: "",
      total: "",
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

  modalTransaction = (value) => {
    this.setState({ modalVisible: true, type: value })
  }

  modalTransfer = () => {
    this.setState({ modalTransfer: true })
  }

  deleteTransaction = (item) => {
    const params = this.props.navigation.state.params

    Alert.alert(
      "Peringatan", "Apakah Anda ingin menghapus transaksi ini ?",
      [
        {
          text: 'Iya',
          onPress: () => this.props.deleteTransaction(item.id, params.data.id),
        },
        { text: 'Tidak', style: 'cancel', },
      ],
      { cancelable: false })
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
      Alert.alert("Peringatan", "Harap isi saldo terlebih dahulu")
    } else if (params.data.balance < 0) {
      Alert.alert("Peringatan", "Maaf saldo Anda sudah kurang dari nol, mohon isi saldo terlebih dahulu")
    } else {
      Alert.alert(
        "Peringatan", "Apakah Anda ingin mengambil semua saldo ?",
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
      "Peringatan", "Apakah Anda ingin menghapus semua transaksi ?",
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
    const { total, note, date, type, id_transaction, } = this.state
    let params = this.props.navigation.state.params
    var UUID = [];

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

  transfer = () => {
    const { id_transfer, name_transfer, total_transfer, date } = this.state
    let params = this.props.navigation.state.params
    var ID_FROM_TRANSACTION = [];
    var ID_TO_TRANSACTION = []

    if (name_transfer == "") {
      this.setState({ errorAccountTransfer: true })
    } else if (total_transfer == "") {
      this.setState({ errorTotalTransfer: true })
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
    this.setState({ modalVisible: false, id_transaction: '', total: '', note: '', type: "", errorValidation: false, })
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

  renderListTransaction(item, index, first, last) {
    const { } = this.state

    return (
      <View
        key={index}
        style={[styles.containerListTransaction, { marginTop: item.id == first ? 20 : 10, marginBottom: item.id == last ? 20 : 5 }]}
      >
        <View style={{ paddingVertical: 5 }}>
          <View style={{ flexDirection: 'row', flex: 1, borderBottomWidth: 0.5, paddingBottom: 5, borderBottomColor: '#808080' }}>
            <View style={{ flex: 1, }}>
              <Text style={{ fontSize: 14, fontFamily: 'Bellota-Regular', color: item.total > 0 ? '#6652ff' : '#ff0000' }}>{item.total > 0 ? "Ditambah :" : "Dikurang :"}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Bellota-Regular', color: '#222226' }}>Rp. {Utils.currencyCommas(String(item.total))}</Text>
            </View>

            <View style={{ alignItems: 'flex-end', flex: 1, }}>
              <Text style={{ fontSize: 14, fontFamily: 'Bellota-Regular', color: '#76ad78' }}>Saldo Terakhir</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Bellota-Regular', color: '#222226' }}>Rp. {Utils.currencyCommas(String(item.last_balance ? item.last_balance : 0))}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', flex: 1, paddingTop: 5, }}>
            <View style={{ flex: 1, }}>
              <Text style={{ fontSize: 14, fontFamily: 'Bellota-Regular', color: '#222226' }}>Catatan :</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Bellota-Regular', color: '#222226' }}>{item.note == "" ? "-" : item.note}</Text>
            </View>

            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Bellota-Regular', color: '#222226', textAlign: 'right' }}>{item.date}</Text>
              <Icon
                onPress={() => this.deleteTransaction(item)}
                name='trash'
                size={18}
                color='#FFFFFF'
                style={{ backgroundColor: '#9896ff', padding: 5, justifyContent: 'center', alignItems: 'center', marginTop: 5, borderRadius: 5, }}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    let { users } = this.props
    let params = this.props.navigation.state.params
    let arrayTransaction = []
    let firstIndex = ""
    let lastIndex = ""
    const index = users.users.findIndex((e) => e.id === params.data.id);
    const { note, total, total_transfer, id_transfer, name_transfer, errorValidation, errorTotalTransfer, errorAccountTransfer } = this.state

    if (index !== -1) {
      if (users.users[index].transaction.length !== 0) {
        arrayTransaction = users.users[index].transaction
      }
    }

    if (arrayTransaction[0]) {
      firstIndex = arrayTransaction[0].id
    }
    if (arrayTransaction[arrayTransaction.length - 1]) {
      lastIndex = arrayTransaction[arrayTransaction.length - 1].id
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 92 }}>
          <View style={styles.containerHeader}>
            <View style={styles.containerLeftHeader}>
              <TouchableOpacity style={styles.buttonBack} onPress={() => this.goBack()}>
                <Icon
                  name='chevron-left'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
            <View style={styles.containerCenterHeader}>
              <Text style={styles.textContainerCenterHeader} numberOfLines={2}>SALDO DETAIL {params.data.name}</Text>
            </View>
            <View style={styles.containerRightHeader}>
              <TouchableOpacity
                style={styles.buttonGetAllBalance}
                onPress={() => this.getAllBalance(arrayTransaction)}
              >
                <Icon
                  name='coins'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDeleteAllTransaction}
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
            <View style={styles.containerNoData}>
              <Text style={styles.textNoData}>Tidak ada data</Text>
            </View>
            :
            <FlatList
              data={arrayTransaction}
              renderItem={({ item, index }) => this.renderListTransaction(item, index, firstIndex, lastIndex)}
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

        <View style={styles.containerFooter}>
          <View style={styles.containerLeftFooter}>
            <Text style={styles.textTotalBalance}>
              Sisa Saldo :
            </Text>
            <Text style={[styles.textBalance, { color: params.data.balance < 0 ? '#ff0000' : '#6652ff' }]}>
              Rp. {Utils.currencyCommas(String(params.data.balance))}
            </Text>
          </View>

          <View style={styles.containerRightFooter}>
            <TouchableOpacity style={styles.containerButtonTF} activeOpacity={0.5} onPress={() => this.modalTransfer()}>
              <Icon
                style={{ textAlign: 'center' }}
                name='paper-plane'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.containerButtonMinus} activeOpacity={0.5} onPress={() => this.modalTransaction(false)}>
              <Icon
                style={{ textAlign: 'center' }}
                name='minus'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.containerButtonPlus} activeOpacity={0.5} onPress={() => this.modalTransaction(true)}>
              <Icon
                style={{ textAlign: 'center' }}
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
          <TouchableOpacity style={styles.containerModal} activeOpacity={1} onPress={() => this.cancelSave()}>
            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2.5 }}>
              <ScrollView style={styles.containerInput}>
                <TextInput
                  style={styles.containerInputTotal}
                  placeholder={'Total'}
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
                  <Text style={styles.textErrorTotal}>
                    Silahkan lengkapi kolomnya
                  </Text>
                  : null
                }
                <TextInput
                  ref={(note) => { this.note = note }}
                  style={styles.containerInputNote}
                  placeholder={`Catatan${'\n'}(Tekan enter untuk menambahkan catatan)`}
                  value={note}
                  multiline={true}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'default'}
                  onChangeText={(note) => this.setState({ note: note, errorValidation: false })}
                />
              </ScrollView>

              <View style={styles.containerButtonModalReducedAdded}>
                <TouchableOpacity style={styles.buttonCancelReducedAdded} onPress={() => this.cancelSave()} activeOpacity={0.5}>
                  <Text style={styles.textButtonRA}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSaveReducedAdded} onPress={() => this.saveTransaction()} activeOpacity={0.5}>
                  <Text style={styles.textButtonRA}>SIMPAN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalTransfer}
          onRequestClose={() => {
            this.cancelTransfer()
          }}>
          <TouchableOpacity style={styles.containerModalTF} activeOpacity={1} onPress={() => this.cancelTransfer()}>
            <View style={styles.bodyModalTF}>
              <View style={styles.containerInputTF}>
                <View style={styles.containerTextUser}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Bellota-Regular',
                      flex: 1,
                      color: name_transfer !== "" ? '#222226' : 'rgba(97, 92, 255, 1)',
                    }}
                    onPress={() => this.setState({ errorAccountTransfer: false, id_transfer: "", name_transfer: "", })}
                  >
                    {name_transfer !== "" ? name_transfer : "Tekan salah satu akun di bawah ini"}
                  </Text>
                  {name_transfer !== "" ?
                    <Icon
                      name='times'
                      size={14}
                      color='#ff0000'
                      style={{ paddingHorizontal: 5, }}
                      onPress={() => this.setState({ errorAccountTransfer: false, id_transfer: "", name_transfer: "", })}
                    />
                    : null
                  }
                </View>
                {errorAccountTransfer == true ?
                  <Text style={styles.textErrorAccountTF}>
                    Silahkan lengkapi kolomnya
                  </Text>
                  : null
                }
                <View
                  style={{
                    marginVertical: 5,
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
                            style={styles.buttonAccount}
                            onPress={() => { this.chooseAccountTransfer(item) }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: '#222226',
                                fontFamily: 'Bellota-Regular',
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
                <TextInput
                  style={styles.containerInputTotalTF}
                  placeholder={"Total Transfer"}
                  value={Utils.formatterCurrencyBillion(total_transfer)}
                  placeholderTextColor={'#7e7e82'}
                  keyboardType={'number-pad'}
                  maxLength={13}
                  onChangeText={(total) => this.changeTotalTransfer(total)}
                  returnKeyType={'done'}
                  onSubmitEditing={() => this.transfer()}
                />
                {errorTotalTransfer == true ?
                  <Text style={styles.textErrorTotalTF}>
                    Silahkan lengkapi kolomnya
                  </Text>
                  : null
                }
              </View>

              <View style={styles.containerButtonTC}>
                <TouchableOpacity style={styles.buttonCancelTC} onPress={() => this.cancelTransfer()} activeOpacity={0.5}>
                  <Text style={styles.textButtonRA}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonTransferTC} onPress={() => this.transfer()} activeOpacity={0.5}>
                  <Text style={styles.textButtonRA}>TRANSFER</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  containerHeader: {
    backgroundColor: '#9896ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5,
  },
  containerLeftHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 5,
  },
  buttonBack: {
    marginLeft: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  containerCenterHeader: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainerCenterHeader: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 5,
    fontFamily: 'Bellota-Bold',
  },
  containerRightHeader: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  buttonGetAllBalance: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonDeleteAllTransaction: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  containerModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  containerInput: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    flex: 1,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  containerInputTotal: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#808080',
    color: '#222226',
    paddingLeft: 0,
    paddingVertical: 5,
    fontSize: 14,
    fontFamily: 'Bellota-Regular',
  },
  textErrorTotal: {
    color: '#cf2749',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
  },
  containerInputNote: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#808080',
    color: '#222226',
    paddingLeft: 0,
    paddingVertical: 5,
    fontSize: 14,
    fontFamily: 'Bellota-Regular',
  },
  containerButtonModalReducedAdded: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
  buttonCancelReducedAdded: {
    backgroundColor: '#9896ff',
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButtonRA: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Bellota-Regular',
  },
  buttonSaveReducedAdded: {
    backgroundColor: '#9896ff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerModalTF: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bodyModalTF: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 2.5,
  },
  containerInputTF: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  containerInputTotalTF: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#808080',
    color: '#222226',
    paddingLeft: 0,
    paddingVertical: 0,
    fontSize: 14,
    fontFamily: 'Bellota-Regular',
  },
  textErrorTotalTF: {
    color: '#cf2749',
    paddingVertical: 5,
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
  },
  containerTextUser: {
    paddingVertical: 5,
    borderBottomColor: '#808080',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textErrorAccountTF: {
    color: '#cf2749',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
  },
  buttonAccount: {
    marginRight: 5,
    paddingVertical: 8,
    paddingHorizontal: 13,
    marginVertical: 5,
    backgroundColor: 'rgba(196, 194, 255, 1)',
    borderRadius: 5,
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5,
  },
  containerButtonTC: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
  buttonCancelTC: {
    backgroundColor: '#9896ff',
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTransferTC: {
    backgroundColor: '#9896ff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerNoData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  textNoData: {
    fontSize: 18,
    color: '#f31616',
    fontFamily: 'Bellota-Regular',
  },
  containerListTransaction: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5,
  },
  containerFooter: {
    flex: 8,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#cfcfcf',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerLeftFooter: {
    flex: 1.5,
    justifyContent: 'center',
  },
  textTotalBalance: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#76ad78',
    fontFamily: 'Bellota-Regular',
  },
  textBalance: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 16,
    fontFamily: 'Bellota-Regular',
  },
  containerRightFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerButtonTF: {
    backgroundColor: '#9896ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15
  },
  containerButtonMinus: {
    backgroundColor: '#9896ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    padding: 15
  },
  containerButtonPlus: {
    backgroundColor: '#9896ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15
  },
})
