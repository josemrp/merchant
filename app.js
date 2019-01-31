$(document).ready(() => {window['APP'] = new Vue({
  el: '#app',
  data: {
    products: []
  },
  methods: {

  },
  created() {
    $.ajax({
      url: './api/product.php',
      dataType: 'json',
    }).done(r => {
      if(!r.error)
        APP.$data.products = r;
      else
        console.error(r);
    })
  }
})})