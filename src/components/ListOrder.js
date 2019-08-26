import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput, Alert, Modal } from 'react-native'
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
      errorPrice: false,
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
      if (food == "") {
        this.setState({
          errorFood: true
        })
      } else if (id_user == "") {
        this.setState({
          errorUser: true
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
      errorPrice: false,
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
      errorPrice: false,
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
    this.setState({
      errorPrice: false,
      price: text
    })
  }

  changeSquare = (id_user, complete_order) => {
    if (complete_order == true) {
      this.props.completeOrder(id_user, false)
    } else {
      this.props.completeOrder(id_user, true)
    }
  }

  renderOrder = (item, index) => {
    const { food, price, id_user, errorFood, errorPrice } = this.state

    return (
      item.order.food && String(item.order.price) ?
        <View
          key={item.id}
          style={{
            backgroundColor: 'rgba(250, 250, 250, 1)',
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 5,
            elevation: 5,
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 0.5 * 5 },
            shadowOpacity: 0.3,
            shadowRadius: 0.8 * 5
          }}
          disabled={item.order.food && String(item.order.price) && true}
          activeOpacity={0.5}
        >
          <View style={{ flex: 1, marginBottom: 5, paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#000000', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#222226', flex: 1, }}>{item.name}</Text>
            <Text style={{ fontSize: 18, color: '#222226', flex: 1, textAlignVertical: 'center', textAlign: 'right', }}>Rp. {Utils.currencyCommas(String(item.order.price ? item.order.price : 0))}</Text>
          </View>

          <View style={{ flex: 1, paddingVertical: 3, marginBottom: 5, flexDirection: 'row', }}>
            <View style={{ flex: item.order.food && String(item.order.price) ? 0.8 : 1, alignItems: 'center', flexDirection: 'row' }}>
              <Icon
                name={item.order.order_complete == true ? 'check-square' : 'square'}
                size={22}
                color='#9896ff'
                onPress={() => this.changeSquare(item.id, item.order.order_complete)}
              />

              <Text style={{ paddingVertical: 3, fontSize: 14, color: '#222226', marginLeft: 5, }}>
                {item.order.food ? item.order.food : "-"}
              </Text>

            </View>

            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', }}>
              <View style={{ flexDirection: 'row', marginBottom: 5, }}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, backgroundColor: '#9896ff', paddingHorizontal: 5, marginRight: 3, borderRadius: 3 }} activeOpacity={0.5} onPress={() => this.editListOrder(item, item.order)}>
                  <Icon
                    name='pen-square'
                    size={22}
                    color='#FFFFFF'
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, backgroundColor: '#9896ff', paddingHorizontal: 5, borderRadius: 3 }} activeOpacity={0.5} onPress={() => this.removeListOrder(item.id)}>
                  <Icon
                    name='trash-alt'
                    size={22}
                    color='#FFFFFF'
                  />
                </TouchableOpacity>
              </View>

              <View style={{}}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, backgroundColor: '#9896ff', paddingHorizontal: 18, borderRadius: 3 }} activeOpacity={0.5} onPress={() => this.saveToTransaction(item)}>
                  <Icon
                    name='cloud-upload-alt'
                    size={22}
                    color='#FFFFFF'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        : null
    )
  }

  render() {
    let { users } = this.props
    let params = this.props.navigation.state.params
    const { food, price, errorFood, errorPrice, errorUser, modalOrder, id_user, name_user, editOrder } = this.state

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', }}>
              <TouchableOpacity style={{ marginLeft: 10, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, }} onPress={() => this.goBack()}>
                <Icon
                  name='chevron-left'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginHorizontal: 5 }} numberOfLines={2}>DAFTAR PESANAN</Text>
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
                onPress={() => this.saveAllOrder()}
              >
                <Icon
                  name='save'
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
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontSize: 22, color: '#222226' }}>Tidak ada data</Text>
              </View>
              :
              <FlatList
                contentContainerStyle={{ paddingVertical: 5 }}
                data={users.users}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => this.renderOrder(item, index)}
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
            style={{ backgroundColor: '#9896ff', paddingHorizontal: 20, paddingVertical: 15, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, marginVertical: 5, }}
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
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', paddingHorizontal: 10, paddingBottom: 10 }}
          >
            <View style={{ backgroundColor: 'rgba(250, 250, 250, 1)', borderRadius: 5, }}>
              <TextInput
                placeholder="Pesanan"
                value={food}
                onChangeText={(text) => this.changeFood(text)}
                keyboardType="default"
                multiline={true}
                style={{
                  borderBottomWidth: 1,
                  color: '#222226',
                  fontSize: 14,
                  marginHorizontal: 10,
                  paddingLeft: 0,
                  paddingBottom: 5,
                  borderBottomColor: '#7e7e82',
                }}
              />
              {errorFood == true &&
                <Text style={{ marginBottom: 5, fontSize: 12, marginHorizontal: 10, color: '#cf2749' }}>Pesanan harus di isi</Text>
              }
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  color: '#222226',
                  fontSize: 14,
                  marginHorizontal: 10,
                  paddingLeft: 0,
                  paddingBottom: 10,
                  borderBottomColor: '#7e7e82',
                }}
                placeholder="Harga"
                value={String(price)}
                onChangeText={(text) => this.changePrice(text)}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={() => this.addListOrder()}
              />
              {errorPrice == true &&
                <Text style={{ marginBottom: 5, fontSize: 12, marginHorizontal: 10, color: '#cf2749' }}>Harga harus di isi</Text>
              }
              {editOrder == false ?
                <View>
                  <View
                    style={{
                      marginHorizontal: 10,
                      paddingVertical: 10,
                      borderBottomColor: '#7e7e82',
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: name_user !== "" ? '#222226' : 'rgba(97, 92, 255, 1)',
                      }}
                    >
                      {name_user !== "" ? name_user : "Tekan salah satu pengguna di bawah ini"}
                    </Text>
                  </View>
                  {errorUser == true &&
                    <Text style={{ color: '#cf2749', paddingHorizontal: 10, paddingVertical: 5, textAlignVertical: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      Nama pengguna tidak boleh kosong
                    </Text>
                  }
                  <FlatList
                    style={{ marginHorizontal: 10 }}
                    data={users.users}
                    horizontal={true}
                    indicatorStyle="white"
                    renderItem={({ item, index }) =>
                      item.length !== 0 ?
                        item.order.food && String(item.order.price) ?
                          null
                          :
                          <TouchableOpacity
                            style={{
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              marginTop: 10,
                              marginRight: 5,
                              backgroundColor: 'rgba(196, 194, 255, 1)',
                              borderRadius: 5,
                              elevation: 1,
                              shadowColor: 'black',
                              shadowOffset: { width: 0, height: 0.5 * 5 },
                              shadowOpacity: 0.3,
                              shadowRadius: 0.8 * 5,
                            }}
                            onPress={() => { this.setState({ id_user: item.id, name_user: item.name, errorUser: false }) }}
                            activeOpacity={0.5}
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
                        : null
                    }
                    keyExtractor={(item, index) => `key-${item.id}`}
                  />
                </View>
                : null
              }

              <View style={{ justifyContent: 'flex-end', alignItems: 'center', padding: 10, flexDirection: 'row', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', marginRight: 5, width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.removeEntry()} activeOpacity={0.5}>
                  <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#9896ff', width: 60, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.addListOrder()} activeOpacity={0.5}>
                  <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>SIMPAN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
})
