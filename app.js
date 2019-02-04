const APP = new Vue({
  el: '#app',
  data: {
    products: [],
    prices: [],
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
    currentSort: 'name'
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

      $.ajax({
        url: './api/product.php',
        dataType: 'json',
        method: 'POST',
        data
      }).done(r => {
        $('#modal-add-product').modal('hide');
        if (!r.error) {
          APP.$data.products.push({
            id: r.product_id,
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
     * @param {Float} price 
     */
    addPrice(productId, price) {
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
              product.price = r.newPrice;
              break;
            }
          }
        } else {
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

      const data = `?id=${product.id}&name=${product.name}&quantity=${product.quantity}&type=${product.type}`;
      
      // Update product data
      $.ajax({
        url: './api/product.php' + data,
        dataType: 'json',
        method: 'PUT'
      }).done(r => {
        if (!r.error) {
          console.log('Update: ' + (r.success ? 'suecces' : 'not success'));
        } else {
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
          console.log('Delete: ' + (r.success ? 'suecces' : 'not success'));
          APP.$data.products.splice(index, 1);
        } else {
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
    })
  }
})