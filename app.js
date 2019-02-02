$(document).ready(() => {
window['APP'] = new Vue({
  el: '#app',
  data: {
    products: [],
    newProduct: {
      name: null,
      type: null,
      quantity: null,
      price: null
    },
    typeAvailable: ['protein', 'carbohydrate', 'grease', 'vitamin']
  },
  methods: {
    // --------
    // HTTP methods
    // --------
    /**
     * Add a new into the database
     * HTTP POST: create
     * @requires this.$data.newProduct
     */
    addProduct() {
      const data = this.$data.newProduct;
      $.ajax({
        url: './api/product.php',
        dataType: 'json',
        method: 'POST',
        data
      }).done(r => {
        if (!r.error) {
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
        $('#modal-add-product').modal('hide');
        APP.$data.newProduct = {
          name: null,
          type: null,
          quantity: null,
          price: null
        };
      })
    },
    /**
     * Update one product
     * HTTP PUT: update
     * @param {Number} productId
     */
    updateProduct(productId) {
      if (this.$data.products.hasOwnProperty(productId)) {
        const product = this.$data.products[productId];
        if (product.quantity == '') {
          product.quantity = 0;
        }
        const data = `?id=${product.id}&name=${product.name}&quantity=${product.quantity}`;
        $.ajax({
          url: './api/product.php' + data,
          dataType: 'json',
          method: 'PUT'
        }).done(r => {
          if (!r.error) {
            console.log('Update: ' + (r.success ? 'suecces' : 'not success'));
          } else {
            // Bug: get the previous value
            console.error(r)
          }
          APP.toggleCollapse(productId);
        })
      }
    },
    /**
     * Delete one product
     * HTTP DELETE: update
     * @param {Number} productId 
     */
    daleteProduct(productId) {
      if (this.$data.products.hasOwnProperty(productId)) {
        const product = this.$data.products[productId];
        const data = `?id=${product.id}`;
        $.ajax({
          url: './api/product.php' + data,
          dataType: 'json',
          method: 'DELETE'
        }).done(r => {
          if (!r.error) {
            console.log('Delete: ' + (r.success ? 'suecces' : 'not success'));
            delete APP.$data.products[productId];
          } else {
            console.error(r)
          }
          APP.toggleCollapse(productId);
          // To fix the bug that not update the view
          APP.$data.newProduct = {
            name: null,
            type: null,
            quantity: null,
            price: null
          };
        })
      }
    },

    // --------
    // Useful methods for the view
    // --------
    /**
     * Hide all collapse and show the selected row
     * @param {Number} productId 
     */
    toggleCollapse(productId) {
      $('.collapse').collapse('hide');
      $('#product-detail-' + productId).collapse('toggle');
      // Get data in a backup
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
          // product.isCollapse = false; Don't used
          delete product.price_index;
        }
      }
    }

  },
  /**
   * HTTP GET: getAll
   */
  created() {
    $.ajax({
      url: './api/product.php',
      dataType: 'json',
    }).done(r => {
      if (!r.error) {
        APP.$data.products = r;
        APP.addAttributes();
      } else {
        console.error(r)
      }
    })
  }
})
})