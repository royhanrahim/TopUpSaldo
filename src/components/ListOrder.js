import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput, Alert, Modal, } from 'react-native'
import { Fab, Button, Toast } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux'

import {
  addListOrder,
  updateListOrder,
  deleteListOrder,
  addTransaction,
  loadingProccess,
  deleteAllListOrder,
  addOrderToTransaction,
  completeOrder,
} from '../actions/user';
import Utils from '../components/Utils';
import ModalLoading from '../components/Utilites/ModalLoading';

var moment = require('moment');

let SCREEN_WIDTH = Dimensions.get('window').width
let SCREEN_HEIGHT = Dimensions.get('window').height
let DATE = new Date()

class ListOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      food: "",
      price: "",
      date: moment(DATE).format("DD MMMM YYYY"),
      transaction: [],
      id_user: '',
      name_user: '',
      errorFood: false,
      errorUser: false,
      editOrder: false,
      modalOrder: false,
    }
  }

  componentDidMount() {
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  addListOrder = () => {
    const { food, price, editOrder, id_user, } = this.state
    let { users } = this.props

    if (editOrder == true) {
      if (food == "") {
        this.setState({
          errorFood: true
        })
      } else {
        this.props.updateListOrder(id_user, food, price)
        this.setState({
          id_user: "",
          name_user: "",
          food: "",
          price: "",
          modalOrder: false,
        })
      }
    } else {
      if (id_user == "") {
        this.setState({
          errorUser: true
        })
      } else if (food == "") {
        this.setState({
          errorFood: true
        })
      } else {
        this.props.addListOrder(id_user, food, price)
        this.setState({
          id_user: "",
          name_user: "",
          food: "",
          price: "",
          modalOrder: false,
        })
      }
    }
  }

  removeEntry = () => {
    this.setState({
      errorFood: false,
      errorUser: false,
      id_user: "",
      name_user: "",
      food: "",
      price: "",
      modalOrder: false,
      editOrder: false,
    })
  }

  removeListOrder = (id) => {
    Alert.alert(
      "Warning", "Apakah Anda ingin menghapus pesanan dan total harga ?",
      [
        {
          text: 'Iya',
          onPress: () => {
            this.props.deleteListOrder(id)

            this.setState({
              id_user: "",
              food: "",
              price: "",
            })
          },
        },
        { text: 'Tidak', style: 'cancel', },
      ],
      { cancelable: false })
  }

  deleteAllOrder = () => {
    let { users } = this.props
    let orders = users.users.map((data) => {
      if (data) {
        if (data.order.food || data.order.price) {
          return true
        } else {
          return false
        }
      }
    })

    if (users.users.length == 0) {
      Alert.alert("Warning", "Anda harus masukan pengguna")
    } else {
      if (orders.findIndex((e) => e == true) == -1) {
        Alert.alert("Warning", "Anda harus masukan pesanan")
      } else {
        Alert.alert(
          "Warning", "Apakah Anda ingin mengkosongkan seluruh pesanan ?",
          [
            {
              text: 'Iya',
              onPress: () => {
                this.props.loadingProccess(true)
                this.props.deleteAllListOrder()
              },
            },
            { text: 'Tidak', style: 'cancel', },
          ],
          { cancelable: false })
      }
    }
  }

  saveAllOrder = () => {
    let { users } = this.props
    let orders = users.users.map((data) => {
      if (data) {
        if (data.order.food || data.order.price) {
          return true
        } else {
          return false
        }
      }
    })

    if (users.users.length == 0) {
      Alert.alert("Warning", "Anda harus masukan pengguna")
    } else {
      if (orders.findIndex((e) => e == true) == -1) {
        Alert.alert("Warning", "Anda harus masukan pesanan")
      } else {
        Alert.alert(
          "Warning", "Apakah Anda ingin memasukan semua pesanan ke transaksi ?",
          [
            {
              text: 'Iya',
              onPress: () => {
                this.props.loadingProccess(true)
                this.props.addOrderToTransaction(this.state.date)
              },
            },
            { text: 'Tidak', style: 'cancel', },
          ],
          { cancelable: false })
      }
    }
  }

  editListOrder = (user, value) => {
    this.setState({
      errorFood: false,
      id_user: user.id,
      name_user: user.name,
      food: value.food,
      price: value.price ? value.price : "",
      modalOrder: true,
      editOrder: true,
    })
  }

  saveToTransaction = (item) => {
    const { date } = this.state
    var UUID = [];

    for (var i = 0; i < 10; i++) {
      UUID.push(Math.floor(Math.random() * 6) + 1)
    }

    Alert.alert(
      "Warning", "Apakah Anda ingin memasukan pesanan ini ke transaksi ?",
      [
        {
          text: 'Iya',
          onPress: () => {
            this.props.addTransaction(UUID.join(""), item.order.price, item.order.food, false, date, item.id)
            this.props.deleteListOrder(item.id)
          },
        },
        { text: 'Tidak', style: 'cancel', },
      ],
      { cancelable: false })

  }

  changeFood = (text) => {
    this.setState({
      errorFood: false,
      food: text,
    })
  }
  changePrice = (text) => {
    let amount = text.split(".").join('')

    this.setState({
      price: amount
    })
  }

  changeSquare = (id_user, complete_order) => {
    if (complete_order == true) {
      this.props.completeOrder(id_user, false)
    } else {
      this.props.completeOrder(id_user, true)
    }
  }

  renderOrder = (item, index, first, last) => {
    const { food, price, id_user, errorFood } = this.state

    return (
      item.order.food && String(item.order.price) &&
      <View
        key={item.id}
        style={[styles.containerListOrder, { marginTop: first == item.id ? 20 : 10, marginBottom: last == item.id ? 20 : 5 }]}
        disabled={item.order.food && String(item.order.price) && true}
        activeOpacity={0.5}
      >
        <View style={styles.bodyListOrder}>
          <Text style={styles.textNameListOrder}>{item.name}</Text>
          <Text style={styles.textTotalListOrder}>Rp. {Utils.currencyCommas(String(item.order.price ? item.order.price : 0))}</Text>
        </View>

        <View style={styles.footerListOrder}>
          <TouchableOpacity style={styles.buttonCheck} activeOpacity={0.7} onPress={() => this.changeSquare(item.id, item.order.order_complete)}>
            <Icon
              name={item.order.order_complete == true ? 'check-square' : 'square'}
              size={20}
              color='#9896ff'
            />

            <Text style={styles.textOrder}>
              {item.order.food ? item.order.food : "-"}
            </Text>

          </TouchableOpacity>

          <View style={styles.containerButtonEditDeleteArchive}>
            <View style={{ flexDirection: 'row', marginBottom: 5, }}>
              <TouchableOpacity style={styles.buttonEdit} activeOpacity={0.5} onPress={() => this.editListOrder(item, item.order)}>
                <Icon
                  name='pen-square'
                  size={20}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDelete} activeOpacity={0.5} onPress={() => this.removeListOrder(item.id)}>
                <Icon
                  name='trash-alt'
                  size={20}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity style={styles.buttonArchive} activeOpacity={0.5} onPress={() => this.saveToTransaction(item)}>
                <Icon
                  name='archive'
                  size={20}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    let { users } = this.props
    let params = this.props.navigation.state.params
    let firstIndex = ""
    let lastIndex = ""
    const { food, price, errorFood, errorUser, modalOrder, id_user, name_user, editOrder } = this.state

    if (users.users[0]) {
      firstIndex = users.users[0].id
    }
    if (users.users[users.users.length - 1]) {
      lastIndex = users.users[users.users.length - 1].id
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View
            style={styles.containerHeader}
          >
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
              <Text style={styles.textCenterHeader} numberOfLines={2}>DAFTAR PESANAN</Text>
            </View>
            <View style={styles.containerRightHeader}>
              <TouchableOpacity
                style={styles.buttonSaveAll}
                onPress={() => this.saveAllOrder()}
              >
                <Icon
                  name='save'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDeleteAll}
                onPress={() => this.deleteAllOrder()}
              >
                <Icon
                  name='trash'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
            {users.users.length == 0 ?
              <View style={styles.containerNoData}>
                <Text style={styles.textNoData}>Tidak ada data</Text>
              </View>
              :
              <FlatList
                contentContainerStyle={{ paddingVertical: 5 }}
                data={users.users}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => this.renderOrder(item, index, firstIndex, lastIndex)}
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
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.setState({ modalOrder: true })}
            style={styles.buttonAddOrder}
          >
            <Icon
              name='plus'
              size={18}
              color='#FFFFFF'
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalOrder}
          onRequestClose={() => {
            this.removeEntry()
          }}
        >
          <TouchableOpacity
            style={styles.containerModal}
            onPress={() => this.removeEntry()}
            activeOpacity={1}
          >
            <View style={styles.containerModalInput}>
              <View
                style={styles.modalInput}
              >
                {editOrder == false &&
                  <View>
                    <View style={styles.containerModalInputUser}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: name_user !== "" ? '#222226' : '#615cff',
                          flex: 1,
                          paddingVertical: 5,
                          fontFamily: 'Bellota-Regular'
                        }}
                        onPress={() => this.setState({ errorUser: false, id_user: "", name_user: "", })}
                      >
                        {name_user !== "" ? name_user : "Tekan salah satu pengguna di bawah ini"}
                      </Text>
                      {name_user !== "" ?
                        <Icon
                          name='times'
                          size={14}
                          color='#ff0000'
                          style={{ marginHorizontal: 5, }}
                          onPress={() => this.setState({ errorUser: false, id_user: "", name_user: "", })}
                        />
                        : null
                      }
                    </View>
                    {errorUser == true &&
                      <Text style={styles.textErrorUser}>
                        Nama pengguna tidak boleh kosong
                    </Text>
                    }
                    <FlatList
                      data={users.users}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      indicatorStyle="white"
                      renderItem={({ item, index }) =>
                        item.length !== 0 ?
                          item.order.food && String(item.order.price) ?
                            null
                            :
                            <TouchableOpacity
                              style={[styles.buttonUser, { marginRight: lastIndex == item.id ? 0 : 5 }]}
                              onPress={() => { this.setState({ id_user: item.id, name_user: item.name, errorUser: false }) }}
                              activeOpacity={0.5}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: '#222226',
                                  fontFamily: 'Bellota-Regular'
                                }}
                              >
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          : null
                      }
                      keyExtractor={(item, index) => `key-${item.id}`}
                    />
                  </View>
                }
                {editOrder == true &&
                  <View style={styles.containerStatusName}>
                    <Text style={styles.textOrderStatus}>Pemesan :</Text>
                    <Text style={styles.textNameStatus}>{name_user}</Text>
                  </View>
                }
                <TextInput
                  placeholder="Pesanan"
                  placeholderTextColor={'#7e7e82'}
                  value={food}
                  onChangeText={(text) => this.changeFood(text)}
                  keyboardType="default"
                  multiline={true}
                  style={styles.inputOrder}
                />
                {errorFood == true &&
                  <Text style={styles.textErrorOrder}>Pesanan harus di isi</Text>
                }
                <TextInput
                  style={styles.inputPrice}
                  placeholder="Harga"
                  placeholderTextColor={'#7e7e82'}
                  value={Utils.formatterCurrencyBillion(String(price))}
                  onChangeText={(text) => this.changePrice(text)}
                  keyboardType="number-pad"
                  maxLength={13}
                  returnKeyType="done"
                  onSubmitEditing={() => this.addListOrder()}
                />
              </View>

              <View style={styles.containerButtonOrder}>
                <TouchableOpacity style={styles.buttonCancel} onPress={() => this.removeEntry()} activeOpacity={0.5}>
                  <Text style={styles.textButtonCancelSave}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSave} onPress={() => this.addListOrder()} activeOpacity={0.5}>
                  <Text style={styles.textButtonCancelSave}>SIMPAN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <ModalLoading
          modalVisible={users.loadingProccess}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users
})

const mapDispatchToProps = dispatch => ({
  addListOrder: (id_user, food_order, price_order) => dispatch(addListOrder(id_user, food_order, price_order)),
  updateListOrder: (id_user, food_order, price_order) => dispatch(updateListOrder(id_user, food_order, price_order)),
  deleteListOrder: (id_user) => dispatch(deleteListOrder(id_user)),
  addTransaction: (id, total, note, type, date, id_user) => dispatch(addTransaction(id, total, note, type, date, id_user)),
  loadingProccess: (loading_proccess) => dispatch(loadingProccess(loading_proccess)),
  deleteAllListOrder: () => dispatch(deleteAllListOrder()),
  addOrderToTransaction: (date) => dispatch(addOrderToTransaction(date)),
  completeOrder: (id_user, complete_order) => dispatch(completeOrder(id_user, complete_order))
})

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(ListOrder)

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
    height: 60,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5
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
  textCenterHeader: {
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
  buttonSaveAll: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonDeleteAll: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  containerNoData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  textNoData: {
    fontSize: 18,
    color: '#222226',
    fontFamily: 'Bellota-Regular'
  },
  buttonAddOrder: {
    backgroundColor: '#9896ff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  containerModalInput: {
    backgroundColor: '#fafafa',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 2.5
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    flex: 1,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  inputOrder: {
    borderBottomWidth: 0.5,
    color: '#222226',
    fontSize: 14,
    paddingLeft: 0,
    paddingVertical: 3,
    borderBottomColor: '#808080',
    textAlignVertical: 'center',
    fontFamily: 'Bellota-Regular'
  },
  textErrorOrder: {
    fontSize: 12,
    color: '#cf2749',
    fontFamily: 'Bellota-Regular'
  },
  inputPrice: {
    borderBottomWidth: 0.5,
    color: '#222226',
    fontSize: 14,
    paddingLeft: 0,
    paddingVertical: 3,
    borderBottomColor: '#808080',
    textAlignVertical: 'center',
    fontFamily: 'Bellota-Regular'
  },
  containerModalInputUser: {
    borderBottomColor: '#808080',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textErrorUser: {
    color: '#cf2749',
    paddingBottom: 5,
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    fontFamily: 'Bellota-Regular'
  },
  buttonUser: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    marginVertical: 10,
    backgroundColor: '#c4c2ff',
    borderRadius: 5,
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5,
  },
  containerButtonOrder: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  buttonCancel: {
    backgroundColor: '#9896ff',
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButtonCancelSave: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Bellota-Regular'
  },
  buttonSave: {
    backgroundColor: '#9896ff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerStatusName: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  textOrderStatus: {
    flex: 0.5,
    fontSize: 18,
    textAlignVertical: 'center',
    color: '#b8adff',
    fontFamily: 'Bellota-Bold'
  },
  textNameStatus: {
    flex: 1,
    fontSize: 18,
    textAlignVertical: 'center',
    textAlign: 'right',
    color: '#b8adff',
    fontFamily: 'Bellota-Bold'
  },
  containerListOrder: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5
  },
  bodyListOrder: {
    flex: 1,
    marginBottom: 5,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textNameListOrder: {
    fontSize: 18,
    color: '#222226',
    flex: 1,
    fontFamily: 'Bellota-Bold'
  },
  textTotalListOrder: {
    fontSize: 18,
    color: '#222226',
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'right',
    fontFamily: 'Bellota-Bold'
  },
  footerListOrder: {
    flex: 1,
    paddingVertical: 3,
    marginBottom: 5,
    flexDirection: 'row',
  },
  buttonCheck: {
    flex: 0.8,
    alignItems: 'center',
    flexDirection: 'row'
  },
  textOrder: {
    paddingVertical: 3,
    fontSize: 14,
    color: '#222226',
    marginLeft: 5,
    fontFamily: 'Bellota-Regular'
  },
  containerButtonEditDeleteArchive: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEdit: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#9896ff',
    paddingHorizontal: 5,
    marginRight: 3,
    borderRadius: 3
  },
  buttonDelete: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#9896ff',
    paddingHorizontal: 5,
    borderRadius: 3
  },
  buttonArchive: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#9896ff',
    paddingHorizontal: 18,
    borderRadius: 3
  }
})
