$(document).ready(() => {window['APP'] = new Vue({
  el: '#app',
  data: {
    products: [],
    newProduct: {
      name: null,
      type: null,
      quantity: null,
      price: null
    },
    typeAvailable: ['protein','carbohydrate','grease','vitamin']
  },
  methods: {
    // HTTP methods
    addProduct() {
      const data = this.$data.newProduct;
      $.ajax({
        url: './api/product.php',
        dataType: 'json',
        method: 'POST',
        data
      }).done(r => {
        if(!r.error) {
          const product = {
            id: r.product_id,
            name: data.name,
            type: data.type,
            quantity: data.quantity
          };
          APP.$data.products[product.id] = product;
        } else {
          console.error(r)
        }
      })
    },
    // Useful for the view
    /**
     * Hide all collapse and show the selected row
     * @param {Number} productId 
     */
    toggleCollapse(productId) {
      $('.collapse').collapse('hide');
      $('#product-detail-'+productId).collapse('toggle');
      // HTTP getOne
    },
    /**
     * Add attributes for the view in the product list
     */
    addAttributes() {
      const products = this.$data.products;
      for (const key in products) {
        if (products.hasOwnProperty(key)) {
          const product = products[key];
          product.isCollapse = false;
          delete product.price_index;
        }
      }
    }

  },
  /**
   * HTTP getAll
   */
  created() {
    $.ajax({
      url: './api/product.php',
      dataType: 'json',
    }).done(r => {
      if(!r.error) {
        APP.$data.products = r;
        APP.addAttributes();
      } else {
        console.error(r)
      }
    })
  }
})})