import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, Alert } from 'react-native'
import { Fab, Button } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux'

import {
  deleteAllUser,
  deleteUser,
  refreshList,
  loadingProccess,
} from '../actions/user';
import Utils from '../components/Utils';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moreButton: '',
    }
  }

  componentDidMount() {
    this.props.loadingProccess(false)
    this.props.refreshList(false)
    console.log('==== THIS PROPS ==== ', this.props.users.users);
  }

  componentWillUnmount = () => {
    this.props.refreshList(false)
  }

  deleteAllData = () => {
    Alert.alert(
      "Peringatan", "Apakah Anda ingin menghapus semua transaksi ?",
      [
        {
          text: 'Iya',
          onPress: () => this.props.deleteAll(),
        },
        { text: 'Tidak', style: 'cancel', },
      ],
      { cancelable: false })
  }

  addUser = () => {
    this.setState({ moreButton: '' })
    this.props.navigation.navigate('AddUser')
  }

  editUser = (item) => {
    this.setState({ moreButton: '' })
    this.props.navigation.navigate("AddUser", { data: item })
  }

  deleteUser = (id) => {
    Alert.alert("Peringatan", "Apakah Anda ingin menghapus pengguna ini ?",
      [
        {
          text: 'Iya',
          onPress: () => this.props.deleteUser(id),
        },
        {
          text: 'Tidak', style: 'cancel',
        }
      ],
      { cancelable: false })
  }

  detailBalance = (item) => {
    this.setState({ moreButton: '' })
    this.props.navigation.navigate("DetailBalance", { data: item })
  }

  _onRefresh = () => {
    this.props.refreshList(true)
    setTimeout(() => {
      this.props.refreshList(false)
    }, 1000);
  }

  buttonMore = (id) => {
    this.setState({ moreButton: id })
    if (this.state.moreButton == id) {
      this.setState({ moreButton: "" })
    }
  }

  listOrder = () => {
    this.props.navigation.navigate("ListOrder")
  }

  renderListUser(item, index, first, last) {
    let { users } = this.props
    const { moreButton } = this.state

    return (
      <View
        key={index}
        style={[styles.containerBodyList, { marginTop: item.id == first ? 20 : 10, marginBottom: item.id == last ? 20 : 5 }]}
      >
        <TouchableOpacity style={styles.containerButtonListUser} onPress={() => this.buttonMore(item.id)} activeOpacity={0.5}>
          <View style={{ flex: 1.2 }}>
            <Text style={[styles.textHeaderListUser, { fontFamily: 'Bellota-Bold' }]}>{item.name}</Text>
            <Text style={styles.textDateListOrder}>
              Tanggal dibuat : {item.date}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <Text style={[styles.textHeaderListUser, { color: item.balance < 0 ? '#ff0000' : '#6652ff' }]}>Rp {Utils.currencyCommas(String(item.balance))}</Text>
          </View>
        </TouchableOpacity>
        {moreButton == item.id ?
          <View style={{ flexDirection: 'row', marginBottom: 5, }}>
            <TouchableOpacity style={styles.containerButtonOption} onPress={() => this.editUser(item)}>
              <Icon
                name='edit'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.containerButtonOption, { marginHorizontal: 5, }]} onPress={() => this.detailBalance(item)}>
              <Icon
                name='money-check'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.containerButtonOption} onPress={() => this.deleteUser(item.id)}>
              <Icon
                name='trash'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>
          </View>
          : null
        }
      </View>
    )
  }

  render() {
    let { users } = this.props
    let _balance = []
    let firstIndex = ""
    let lastIndex = ""
    var total_balance = 0

    if (users.users.length !== 0) {
      for (let i = 0; i < users.users.length; i++) {
        _balance.push(Number(users.users[i].balance))
      }

      total_balance = _balance.reduce((partial_sum, a) => partial_sum + a);
    }

    if (users.users[0]) {
      firstIndex = users.users[0].id
    }
    if (users.users[users.users.length - 1]) {
      lastIndex = users.users[users.users.length - 1].id
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 92 }}>
          <View style={styles.containerHeader}>
            <View style={styles.containerLeftHeader}>
              <Text style={styles.textContainerLeftHeader}>PENGGUNA</Text>
            </View>
            <View style={styles.containerRightHeader}>
              <TouchableOpacity style={styles.containerButtonDelete} activeOpacity={0.5} onPress={() => this.deleteAllData()}>
                <Icon
                  name='trash'
                  size={16}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
          </View>

          {users.users.length == 0 ?
            <View style={styles.containerBodyNoData}>
              <Text style={styles.textContainerBodyNoData}>Tidak ada data</Text>
            </View>
            :
            <FlatList
              data={users.users}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => this.renderListUser(item, index, firstIndex, lastIndex)}
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
              Total semua saldo :
            </Text>
            <Text style={[styles.textBalance, { color: total_balance < 0 ? '#ff0000' : '#6652ff' }]}>
              Rp. {Utils.currencyCommas(String(total_balance))}
            </Text>
          </View>

          <View style={styles.containerRightFooter}>
            <TouchableOpacity style={styles.containerButtonAddUser} activeOpacity={0.5} onPress={() => this.addUser()}>
              <Icon
                style={{ textAlign: 'center' }}
                name='user-plus'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.containerButtonListOrder} activeOpacity={0.5} onPress={() => this.listOrder()}>
              <Icon
                style={{ textAlign: 'center' }}
                name='clipboard-list'
                size={18}
                color='#FFFFFF'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users
})

const mapDispatchToProps = dispatch => ({
  deleteAll: (id, email, phone, password) => dispatch(deleteAllUser(id, email, phone, password)),
  deleteUser: (id) => dispatch(deleteUser(id)),
  refreshList: (bool) => dispatch(refreshList(bool)),
  loadingProccess: (value) => dispatch(loadingProccess(value))
})

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  containerHeader: {
    backgroundColor: '#9896ff',
    flexDirection: 'row',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5,
  },
  containerLeftHeader: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  textContainerLeftHeader: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Bellota-Bold',
  },
  containerRightHeader: {
    flex: 0.5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  containerButtonDelete: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  containerBodyNoData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  textContainerBodyNoData: {
    fontSize: 18,
    color: '#f31616',
    fontFamily: 'Bellota-Regular',
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
  containerButtonAddUser: {
    backgroundColor: '#9896ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 5,
    padding: 15
  },
  containerButtonListOrder: {
    backgroundColor: '#9896ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 20
  },
  containerBodyList: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5,
  },
  containerButtonListUser: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  textHeaderListUser: {
    fontSize: 16,
    fontFamily: 'Bellota-Regular',
  },
  textDateListOrder: {
    fontSize: 12,
    color: '#222226',
    fontFamily: 'Bellota-Regular',
  },
  containerButtonOption: {
    backgroundColor: '#a0a0a3',
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 3
  }
})
