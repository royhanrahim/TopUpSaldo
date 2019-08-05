import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput, Alert } from 'react-native'
import { Fab, Button, } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux'

import {
} from '../actions/user';
import Utils from '../components/Utils';

var moment = require('moment');

let SCREEN_WIDTH = Dimensions.get('window').width
let SCREEN_HEIGHT = Dimensions.get('window').height
let DATE = new Date()

class ListOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      balance: "",
      date: moment(DATE).format("DD MMMM YYYY"),
      transaction: [],
      errorName: '',
      errorBalance: '',
      foods: [
        {
          "id": 1,
          "food": "Ayam Goreng",
          "price": "15000"
        },
        {
          "id": 2,
          "food": "Ayam Bakar",
          "price": "15000"
        },
        {
          "id": 3,
          "food": "Ayam Peyet",
          "price": "15000"
        },
      ]
    }
  }

  componentDidMount() {
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
              <TouchableOpacity style={{ marginLeft: 10, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 }} onPress={() => this.goBack()}>
                <Icon
                  name='chevron-left'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginHorizontal: 5 }} numberOfLines={2}>DETAIL BALANCE</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', padding: 5 }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 5,
                  borderRadius: 5,
                  width: 60,
                  height: 50,
                }}
                onPress={() => this.deleteAllTransaction(params.data, arrayTransaction)}
              >
                <Icon
                  name='trash'
                  size={18}
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', height: SCREEN_HEIGHT }}>
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
                renderItem={({ item, index }) => (
                  <View key={item.id} style={{ backgroundColor: 'skyblue', paddingHorizontal: 10, }}>
                    <View style={{ flex: 1, backgroundColor: 'yellow', marginBottom: 5, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 14, color: '#222226' }}>{item.name}</Text>
                    </View>

                    {this.state.foods.length !== 0 ?
                      this.state.foods.map((data) => (
                        <View key={data.id} style={{ flex: 1, backgroundColor: 'white', paddingVertical: 3, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                          <TextInput
                            style={{ borderWidth: 0.5, borderColor: "#000000", fontSize: 14, flex: 1, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 5, marginRight: 5, }}
                            value={data.food}
                            multiline={true}
                            editable={false}
                          />
                          <TextInput
                            style={{ borderWidth: 0.5, borderColor: "#000000", fontSize: 14, flex: 0.7, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 5, marginRight: 5, }}
                            value={data.price}
                            multiline={true}
                            editable={false}
                          />
                          <TouchableOpacity style={{ backgroundColor: 'grey', flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingVertical: 5 }}>
                            <Icon
                              name='minus-circle'
                              size={22}
                              color='#000000'
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                      : null
                    }

                    <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: 3, flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput
                        style={{ borderWidth: 0.5, borderColor: "#000000", fontSize: 14, flex: 1, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 5, marginRight: 5, }}
                        placeholder="Food"
                        multiline={true}
                      />
                      <TextInput
                        style={{ borderWidth: 0.5, borderColor: "#000000", fontSize: 14, flex: 0.7, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 5, marginRight: 5, }}
                        placeholder="Price"
                      />
                      <TouchableOpacity style={{ backgroundColor: 'grey', flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingVertical: 5 }}>
                        <Icon
                          name='plus-circle'
                          size={22}
                          color='#000000'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
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

        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users
})

const mapDispatchToProps = dispatch => ({
  addUser: (id, name, balance, date) => dispatch(addUser(id, name, balance, date)),
  updateUser: (id, name, balance, date, transaction) => dispatch(updateUser(id, name, balance, date, transaction)),
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
