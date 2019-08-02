import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, Alert } from 'react-native'
import { Fab, Icon, Button } from 'native-base'
import { connect } from 'react-redux'

import {
  deleteAllUser,
  deleteUser,
  refreshList,
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
    console.log('==== THIS PROPS ==== ', this.props.users.users);
  }

  componentWillReceiveProps() {

  }

  deleteAllData = () => {
    this.props.deleteAll()
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
    this.props.deleteUser(id)
  }

  detailBalance = (item) => {
    this.setState({ moreButton: '' })
    this.props.navigation.navigate("DetailBalance", { data: item })
  }

  _onRefresh = () => {
    this.props.refreshList(true)
    setTimeout(() => {
      this.props.refreshList(false)
    }, 500);
  }

  buttonMore = (id) => {
    this.setState({ moreButton: id })
    if (this.state.moreButton == id) {
      this.setState({ moreButton: "" })
    }
  }

  listOrder = () => {
    Alert.alert("Warning", "Next version ...")
  }

  renderListUser(item, index) {
    let { users } = this.props
    const { moreButton } = this.state

    return (
      <View key={index} style={{ backgroundColor: '#dadaed', paddingHorizontal: 10, paddingVertical: 5, marginTop: 10, marginBottom: 5, borderRadius: 5, marginHorizontal: 10 }}>
        <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 5 }} onPress={() => this.buttonMore(item.id)}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: '#222226' }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: '#222226' }}>
              Create date : {item.date}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 16, color: '#222226' }}>Rp {Utils.currencyCommas(String(item.balance))}</Text>
          </View>
        </TouchableOpacity>
        {moreButton == item.id ?
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <TouchableOpacity style={{ backgroundColor: '#a0a0a3', flex: 1, paddingVertical: 20, alignItems: 'center', borderRadius: 3 }} onPress={() => this.editUser(item)}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#a0a0a3', flex: 1, paddingVertical: 20, alignItems: 'center', marginHorizontal: 5, borderRadius: 3 }} onPress={() => this.detailBalance(item)}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>Balance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#a0a0a3', flex: 1, paddingVertical: 20, alignItems: 'center', borderRadius: 3 }} onPress={() => this.deleteUser(item.id)}>
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
    let _balance = []
    var total_balance = 0

    if (users.users.length !== 0) {
      for (let i = 0; i < users.users.length; i++) {
        _balance.push(Number(users.users[i].balance))
      }

      total_balance = _balance.reduce((partial_sum, a) => partial_sum + a);
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 92 }}>
          <View style={{ backgroundColor: '#9896ff', flexDirection: 'row' }}>
            <View style={{ flex: 2, justifyContent: 'center', paddingLeft: 10 }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>USER</Text>
            </View>
            <View style={{ flex: 0.5, padding: 5, justifyContent: 'center', alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ backgroundColor: '#6565db', width: 60, height: 50, justifyContent: 'center', borderRadius: 5, marginHorizontal: 5 }} activeOpacity={0.5} onPress={() => this.deleteAllData()}>
                <Text style={{ fontSize: 14, textAlign: 'center', color: '#FFFFFF' }}>DELETE ALL</Text>
              </TouchableOpacity>
            </View>
          </View>

          {users.users.length == 0 ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ fontSize: 22, color: '#222226' }}>No Data</Text>
            </View>
            :
            <FlatList
              data={users.users}
              // extraData={this.state}
              // keyExtractor={(item, index) => `key-${item.id}`}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => this.renderListUser(item, index)}
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
              All Total Balance :
                        </Text>
            <Text style={{ flex: 1, textAlignVertical: 'center', fontSize: 16, color: '#222226' }}>
              Rp. {Utils.currencyCommas(String(total_balance))}
            </Text>
          </View>

          <View style={{ flex: 1, padding: 5, flexDirection: 'row' }}>
            <TouchableOpacity style={{ backgroundColor: '#9896ff', flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 5, borderRadius: 5 }} activeOpacity={0.5} onPress={() => this.addUser()}>
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                Add User
                            </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#9896ff', flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} activeOpacity={0.5} onPress={() => this.listOrder()}>
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                List Order Lunch
                            </Text>
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
  refreshList: (bool) => dispatch(refreshList(bool))
})

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
})
