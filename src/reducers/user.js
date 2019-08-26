const initialState = {
  users: [],
  balance_total: 0,
  refreshList: false,
  loadingProccess: false,
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
        state.users[index_transaction].transaction.push({
          "id": action.data.id,
          "total": action._type == true ? action.data.total : Number(action.data.total * -1),
          "last_balance": Number(state.users[index_transaction].balance),
          "note": action.data.note,
          "date": action.data.date,
        })

        state.users[index_transaction].balance = action._type == true ? Number(state.users[index_transaction].balance + action.data.total) : Number(state.users[index_transaction].balance - action.data.total)
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

    case 'LOADING_PROCCESS':
      return {
        ...state,
        loadingProccess: action.loading_proccess
      }

    case 'TRANSFER_BALANCE':
      const index_from = state.users.findIndex((e) => e.id === action.id_from);
      const index_to = state.users.findIndex((e) => e.id === action.id_to);

      if (index_from !== -1) {
        state.users[index_from].transaction.push({
          "id": action.id_from_transfer,
          "total": Number(action.total_transfer * -1),
          "last_balance": Number(state.users[index_from].balance),
          "note": "Transfer untuk " + action.name_to,
          "date": action.date_transfer,
        })

        state.users[index_from].balance = Number(state.users[index_from].balance - action.total_transfer)
      }
      if (index_to !== -1) {
        state.users[index_to].transaction.push({
          "id": action.id_to_transfer,
          "total": Number(action.total_transfer),
          "last_balance": Number(state.users[index_to].balance),
          "note": "Ditransfer dari " + action.name_from,
          "date": action.date_transfer,
        })

        state.users[index_to].balance = Number(state.users[index_to].balance + action.total_transfer)
      }
      return {
        ...state,
        users: state.users
      }

    case "ADD_LIST_ORDER":
      const transaction_order = state.users.findIndex((e) => e.id === action.id_account);

      if (transaction_order !== -1) {
        state.users[transaction_order].order = action.data
      }
      return {
        ...state,
        users: state.users
      }

    case "UPDATE_LIST_ORDER":
      const update_transaction_order = state.users.findIndex((e) => e.id === action.id_account);

      if (update_transaction_order !== -1) {
        state.users[update_transaction_order].order.food = action.food
        state.users[update_transaction_order].order.price = action.price
      }
      return {
        ...state,
        users: state.users
      }

    case "DELETE_LIST_ORDER":
      const delete_transaction_order = state.users.findIndex((e) => e.id === action.id_user);

      if (delete_transaction_order !== -1) {
        state.users[delete_transaction_order].order = {}
      }
      return {
        ...state,
        users: state.users
      }

    case 'DELETE_ALL_LIST_ORDER':
      for (let i = 0; i < state.users.length; i++) {
        if (state.users[i].id) {
          state.users[i].order = {}
        }
      }
      return {
        ...state,
        users: state.users,
        loadingProccess: false,
      }

    case 'ADD_ORDER_TRANSACTION':
      var UUID = [];
      for (let i = 0; i < state.users.length; i++) {
        for (var id = 0; id < 10; id++) {
          UUID.push(Math.floor(Math.random() * 6) + 1)
        }

        if (state.users[i].id) {
          if (state.users[i].order.food || state.users[i].order.price) {
            state.users[i].transaction.push({
              "id": UUID.join(""),
              "total": Number(state.users[i].order.price * -1),
              "last_balance": Number(state.users[i].balance),
              "note": state.users[i].order.food,
              "date": action.date,
            })

            state.users[i].balance = action._type == true ? Number(state.users[i].balance + state.users[i].order.price) : Number(state.users[i].balance - state.users[i].order.price)

            state.users[i].order = {}
          }
        }
      }
      return {
        ...state,
        users: state.users,
        loadingProccess: false,
      }

    case "COMPLETE_ORDER":
      const update_complete_order = state.users.findIndex((e) => e.id === action.id_user);

      if (update_complete_order !== -1) {
        state.users[update_complete_order].order.order_complete = action.complete_order
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