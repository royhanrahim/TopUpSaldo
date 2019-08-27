module.exports = {
  currencyCommas(nStr) {
    nStr = parseFloat(nStr).toFixed(2)
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    // var vCurrency = APIVar.varCurrency;
    // if (vCurrency == null || vCurrency == '') {
    //     vCurrency = 'IDR '
    // }
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1;
  },
  formatterCurrencyBillion(value) {
    let amount = ""

    if (value.length == 4) {
      amount = [value.slice(0, 1), ".", value.slice(1)].join('');
    } else if (value.length == 5) {
      amount = [value.slice(0, 2), ".", value.slice(2)].join('');
    } else if (value.length == 6) {
      amount = [value.slice(0, 3), ".", value.slice(3)].join('');
    } else if (value.length == 7) {
      amount = [value.slice(0, 1), ".", value.slice(1, 4), ".", value.slice(4)].join('');
    } else if (value.length == 8) {
      amount = [value.slice(0, 2), ".", value.slice(1, 4), ".", value.slice(5)].join('');
    } else if (value.length == 9) {
      amount = [value.slice(0, 3), ".", value.slice(1, 4), ".", value.slice(6)].join('');
    } else if (value.length == 10) {
      amount = [value.slice(0, 1), ".", value.slice(1, 4), ".", value.slice(1, 4), ".", value.slice(7)].join('');
    } else {
      amount = value
    }

    return amount
  }
}