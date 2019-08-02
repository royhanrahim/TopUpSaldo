const initialState = {
  users: [],
  balance_total: 0,
  refreshList: false,
  // accountDeleteSuccess: false,
}

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: state.users.concat(action.data)
      }
    case 'DELETE_ALL_USER':
      return {
        ...state,
        users: []
      }
    case 'DELETE_USER':
      var newListUser = state.users.filter(function (list) {
        return list.id !== action.id
      })

      return {
        ...state,
        users: newListUser
      }
    case 'UPDATE_USER':
      let user = state.users
      const index = user.findIndex((e) => e.id === action.data.id);

      if (index === -1) {
        user.push(action.data);
      } else {
        user[index] = action.data;
      }

      return {
        ...state,
        users: user
      }
    case 'ADD_TRANSACTION':
      const index_transaction = state.users.findIndex((e) => e.id === action.id);

      if (index_transaction !== -1) {
        state.users[index_transaction].balance = action._type == true ? Number(state.users[index_transaction].balance + action.data.total) : Number(state.users[index_transaction].balance - action.data.total)

        state.users[index_transaction].transaction.push({
          "id": action.data.id,
          "total": action._type == true ? action.data.total : Number(action.data.total * -1),
          "note": action.data.note,
          "date": action.data.date,
        })
      }
      return {
        ...state,
        users: state.users
      }
    case 'UPDATE_TRANSACTION':
      const id_transaction = state.users.findIndex((e) => e.id === action.data.id_user);

      if (id_transaction !== -1) {
        var transactions = state.users[id_transaction].transaction
        var new_transaction = state.users[id_transaction].transaction.findIndex((x) => x.id === action.data.id);
        // Perhitungan untuk balance di dikurangin total dari transaksi
        state.users[id_transaction].balance = action.data.type_edit == true ? Number(state.users[id_transaction].balance + action.data.total) : Number(state.users[id_transaction].balance - action.data.total)

        if (new_transaction !== -1) {
          // Perhitungan untuk total di dalam transaksi
          var type_totals = transactions[new_transaction].type_edit == true ? Number(action.data.total) : Number(action.data.total * -1)
          var totals = action.data.type_edit == true ? Number(transactions[new_transaction].total - type_totals) : Number(transactions[new_transaction].total + type_totals)

          transactions[new_transaction].total = totals
          transactions[new_transaction].note = action.data.note
        }
      }
      return {
        ...state,
        user: state.users
      }
    case 'DELETE_TRANSACTION':
      const transaction = state.users.findIndex((e) => e.id === action.user_id);

      if (transaction !== -1) {
        var newList = state.users[transaction].transaction.filter(function (list) {
          return list.id !== action.id
        })

        state.users[transaction].transaction = newList
      }

      return {
        ...state,
        users: state.users
      }
    case 'DELETE_ALL_TRANSACTION':
      const transaction_id = state.users.findIndex((e) => e.id === action.id);

      if (transaction_id !== -1) {
        state.users[transaction_id].transaction = []
      }
      return {
        ...state,
        users: state.users
      }
    case 'REFRESH_LIST':
      return {
        ...state,
        refreshList: action.refresh_list
      }
    case 'TRANSFER_BALANCE':
      const index_from = state.users.findIndex((e) => e.id === action.id_from);
      const index_to = state.users.findIndex((e) => e.id === action.id_to);

      if (index_from !== -1) {
        state.users[index_from].balance = Number(state.users[index_from].balance - action.total_transfer)

        state.users[index_from].transaction.push({
          "id": action.id_from_transfer,
          "total": Number(action.total_transfer * -1),
          "note": "Transfer untuk " + action.name_to,
          "date": action.date_transfer,
        })
      }
      if (index_to !== -1) {
        state.users[index_to].balance = Number(state.users[index_to].balance + action.total_transfer)

        state.users[index_to].transaction.push({
          "id": action.id_to_transfer,
          "total": Number(action.total_transfer),
          "note": "Ditransfer dari " + action.name_from,
          "date": action.date_transfer,
        })
      }

      return {
        ...state,
        users: state.users
      }
    default:
      return state
  }
}

export default users