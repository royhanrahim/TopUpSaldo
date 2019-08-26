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
  }
}