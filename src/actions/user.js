export const addUser = (id, name, balance, date) => ({
  type: 'ADD_USER',
  data: {
    "id": id,
    "name": name,
    "balance": Number(balance),
    "date": date,
    "transaction": [],
  }
})
export const deleteAllUser = () => ({
  type: 'DELETE_ALL_USER',
})
export const deleteUser = (id) => ({
  type: 'DELETE_USER',
  id: id,
})
export const updateUser = (id, name, balance, date, transaction) => ({
  type: 'UPDATE_USER',
  data: {
    "id": id,
    "name": name,
    "balance": Number(balance),
    "date": date,
    "transaction": transaction,
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