$(document).ready(() => {window['APP'] = new Vue({
  el: '#app',
  data: {
    products: []
  },
  methods: {

  },
  created() {
    $.ajax({
      url: './api/index.php',
      method: 'GET'
      //data: {}
    }).done(r => {
      console.log(r);
    })
  }
})})