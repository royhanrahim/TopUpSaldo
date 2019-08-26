export const addUser = (id, name, balance, date) => ({
  type: 'ADD_USER',
  data: {
    "id": id,
    "name": name,
    "balance": Number(balance),
    "date": date,
    "transaction": [],
    "order": {},
  }
})
export const deleteAllUser = () => ({
  type: 'DELETE_ALL_USER',
})
export const deleteUser = (id) => ({
  type: 'DELETE_USER',
  id: id,
})
export const updateUser = (id, name, balance, date, transaction, order) => ({
  type: 'UPDATE_USER',
  data: {
    "id": id,
    "name": name,
    "balance": Number(balance),
    "date": date,
    "transaction": transaction,
    "order": order,
  }
})
export const addTransaction = (id, total, note, type, date, id_user) => ({
  type: 'ADD_TRANSACTION',
  id: id_user,
  data: {
    id: id,
    total: Number(total),
    note: note,
    date: date,
  },
  _type: type,
})
export const updateTransaction = (id, id_user, total, ex_total, note, type_edit) => ({
  type: 'UPDATE_TRANSACTION',
  data: {
    id: id,
    id_user: id_user,
    total: Number(total),
    ex_total: Number(ex_total),
    note: note,
    type_edit: type_edit
  }
})
export const deleteTransaction = (id, user_id) => ({
  type: 'DELETE_TRANSACTION',
  id,
  user_id,
})
export const deleteAllTransaction = (id) => ({
  type: 'DELETE_ALL_TRANSACTION',
  id
})
export const refreshList = (refresh_list) => ({
  type: 'REFRESH_LIST',
  refresh_list
})
export const loadingProccess = (loading_proccess) => ({
  type: 'LOADING_PROCCESS',
  loading_proccess
})
export const transferBalance = (id_from, name_from, id_to, name_to, id_from_transfer, id_to_transfer, total_transfer, date_transfer) => ({
  type: "TRANSFER_BALANCE",
  id_from,
  name_from,
  id_to,
  name_to,
  id_from_transfer,
  id_to_transfer,
  total_transfer: Number(total_transfer),
  date_transfer,
})
export const addListOrder = (id_account, food_order, price_order) => ({
  type: "ADD_LIST_ORDER",
  id_account,
  data: {
    food: food_order,
    price: Number(price_order),
    order_complete: false,
  },
})
export const updateListOrder = (id_account, food_order, price_order) => ({
  type: "UPDATE_LIST_ORDER",
  id_account,
  food: food_order,
  price: Number(price_order),
})
export const deleteListOrder = (id_user) => ({
  type: "DELETE_LIST_ORDER",
  id_user
})
export const deleteAllListOrder = () => ({
  type: "DELETE_ALL_LIST_ORDER",
})
export const addOrderToTransaction = (date) => ({
  type: "ADD_ORDER_TRANSACTION",
  date
})
export const completeOrder = (id_user, complete_order) => ({
  type: "COMPLETE_ORDER",
  id_user,
  complete_order
})