const APP = new Vue({
  el: '#app',
  data: {
    products: [],
    prices: [],
    newPrice: {
      value: null,
      isAdding: false
    },
    newProduct: {
      name: null,
      type: null,
      quantity: null,
      price: null,
      isLoading: false
    },
    typeAvailable: ['protein', 'carbohydrate', 'grease', 'vitamin'],
    search: '',
    sortAvailable: ['quantity', 'price'],
    currentSort: 'name',
    toast: {
      class: '',
      msg: ''
    },
    icons: ['fas fa-bong','fas fa-bicycle','fas fa-bell','fab fa-bitcoin',
      'fas fa-bread-slice','fas fa-box','fas fa-broom','fas fa-car-side',
      'fas fa-chart-area','fas fa-chart-bar','far fa-chart-bar',
      'fas fa-chart-line','fas fa-child','fas fa-clipboard-list',
      'fas fa-cookie-bite','fas fa-dog','fas fa-flushed','far fa-frown-open',
      'fab fa-github','fas fa-globe-americas','far fa-grin-beam-sweat',
      'far fa-meh-rolling-eyes','fas fa-mug-hot'
    ]
  },
  methods: {
    // --------
    // HTTP methods
    // --------
    /**
     * Get data for the product
     * HTTP GET: getOne
     * @param {Number} index 
     */
    getProduct(index) {
      const product = this.$data.products[index];

      // Get product data
      $.ajax({
        url: './api/product.php?id=' + product.id,
        dataType: 'json',
      }).done(r => {
        if (!r.error) {
          product.name = r.name;
          product.quantity = r.quantity;
          product.type = r.type;
        } else {
          APP.showToast({type: 'danger', msg: r.error});
          console.error(r)
        }
        product.isLoading = false;
      })
    },

    /**
     * Get the prices for one product
     * HTTP GET: getAll
     * @param {Number} productId 
     */
    getPrices(productId) {
      $.ajax({
        url: './api/price.php?productId=' + productId,
        dataType: 'json',
      }).done(r => {
        if (!r.error) {
          console.log(r);
        } else {
          APP.showToast({type: 'danger', msg: r.error});
          console.error(r)
        }
        product.isLoading = false;
      })
    },

    /**
     * Add a new product into the database
     * HTTP POST: create
     * @requires this.$data.newProduct
     */
    addProduct() {
      this.$data.newProduct.isLoading = true;
      
      const data = this.$data.newProduct;
      if(data.type == 'null')
        data.type = '';

      $.ajax({
        url: './api/product.php',
        dataType: 'json',
        method: 'POST',
        data
      }).done(r => {
        $('#modal-add-product').modal('hide');
        if (!r.error) {
          APP.showToast({type: 'success', msg: 'Product added'});

          APP.$data.products.push({
            id: r.product_id,
            price: data.price,
            name: data.name,
            quantity: data.quantity,
            isCollapse: true,
            isLoading: true
          });

          // Add new price
          if(data.price && data.price > 0) {
            this.addPrice(r.product_id, data.price);
          }

          APP.sortBy(APP.$data.currentSort, false); // Insert in the correct order
        } else {
          APP.showToast({type: 'danger', msg: r.error});
          console.error(r)
        }
        
        // Restore newProduct values before 300 ms
        setTimeout(() => {
          APP.$data.newProduct = {
            name: null,
            type: null,
            quantity: null,
            price: null,
            isLoading: false
          };
        }, 300);        
      });

    },

    /**
     * Insert a new price into database
     * @param {Number} productId 
     * @requires this.$data.newPrice
     */
    addPrice(productId) {
      const price = this.$data.newPrice.value;
      this.$data.newPrice.isAdding = false;

      $.ajax({
        url: './api/price.php',
        dataType: 'json',
        method: 'POST',
        data: {productId, price}
      }).done(r => {   
        if (!r.error) {
          for (let i = 0; i < APP.$data.products.length; i++) {
            const product = APP.$data.products[i];
            if(product.id == productId) {
              APP.showToast({type: 'success', msg: 'Price added successful'});
              APP.$data.newPrice.value = null;
              product.price = r.newPrice;
              break;
            }
          }
        } else {
          APP.showToast({type: 'danger', msg: r.error});
          console.error(r)
        }
      })
    },

    /**
     * Update one product
     * HTTP PUT: update
     * @param {Number} index
     */
    updateProduct(index) {
      const product = this.$data.products[index];
      product.isLoading = true;

      if (product.quantity == '') {
        product.quantity = 0;
      }
      if (product.type == 'null') {
        product.type = null;
      }

      var data = `?id=${product.id}`;
      if(product.name)
        data += `&name=${product.name}`;
      if(product.quantity || product.quantity == 0)
        data += `&quantity=${product.quantity}`;
      if(product.type)
        data += `&type=${product.type}`;
      
      // Update product data
      $.ajax({
        url: './api/product.php' + data,
        dataType: 'json',
        method: 'PUT'
      }).done(r => {
        if (!r.error) {
          APP.showToast({type: 'success', msg: 'Product updated'});
        } else {
          APP.showToast({type: 'danger', msg: r.error});
          console.error(r);
          APP.getProduct(index)
        }
        APP.toggleCollapse(index);
      });

      // Add new price
      if(product.price && product.price > 0) {
        this.addPrice(product.id, product.price);
      }
    },

    /**
     * Delete one product
     * HTTP DELETE: update
     * @param {Number} index 
     */
    daleteProduct(index) {
      
      const product = this.$data.products[index];
      const data = `?id=${product.id}`;
      product.isLoading = true;
      
      $.ajax({
        url: './api/product.php' + data,
        dataType: 'json',
        method: 'DELETE'
      }).done(r => {
        if (!r.error) {
          APP.showToast({type: 'success', msg: 'Product deleted'});
          APP.$data.products.splice(index, 1);
        } else {
          APP.showToast({type: 'danger', msg: r.error});
          console.error(r)
        }
      })
    },

    // --------
    // Useful methods for the view
    // --------
    /**
     * Hide all collapse and show the selected row
     * @param {Number} index 
     */
    toggleCollapse(index) {
      $('.collapse').collapse('hide');
      const product = this.$data.products[index];
      if(product.isCollapse) {
        product.isCollapse = false;
        this.getProduct(index);
        $('#product-detail-' + product.id).collapse('show');
      } else {
        product.isCollapse = true;
        product.isLoading = true;
      }
    },

    /**
     * Sort the list by a custom argument
     * @param {String} argument type of the sort
     * @param {Boolean?} validate To jump validations when insert or firs sort
     */
    sortBy(argument, validate = true) {
      const sortAvailable = this.$data.sortAvailable;
      const products = this.$data.products;

      if(!sortAvailable.includes(argument) && validate)
        return;

      sortAvailable.push(this.currentSort);
      sortAvailable.splice(sortAvailable.indexOf(argument), 1);
      this.currentSort = argument;

      if(argument === 'name') {
        // This is a string sort
        products.sort((a,b) => {
          if(a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
          if(a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
          return 0;
        });
      } else {
        // All numeric sorts
        products.sort((a,b) => a[argument] - b[argument]);
      }
    },

    /**
     * Show the toast elemetn with a custom msg
     * @param {String} type success or error
     * @param {String} msg 
     */
    showToast({type, msg}) {
      this.$data.toast.msg = msg;
      this.$data.toast.class = 'alert-' + type;
      $('#toast-custom-msg').fadeIn();
      setTimeout(() => {
        APP.hideToast();
      }, 3000);
    },

    /**
     * Hide toast element
     */
    hideToast() {
      $('#toast-custom-msg').fadeOut();
      setTimeout(() => {
        APP.$data.toast.msg = '';
        APP.$data.toast.class = '';
      }, 300);
    },

    showGraph() {

    }
  },

  /**
   * Get the data and add useful vars
   * HTTP GET: getAll
   */
  created() {
    $.ajax({
      url: './api/product.php',
      dataType: 'json',
    }).done(r => {
      if (!r.error) {
        const products = r;
        for (const key in products) {
          if (products.hasOwnProperty(key)) {
            const product = products[key];
            APP.$data.products.push({ // Add to the list
              id: product.id,
              name: product.name,
              quantity: product.quantity,
              price: product.price,
              isCollapse: true,     // Useful vars
              isLoading: true
            });
          }
        }
        APP.sortBy(APP.$data.currentSort, false); // First sort
      } else {
        console.error(r)
      }
    });
  }
})