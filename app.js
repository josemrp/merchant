const APP = new Vue({
  el: '#app',
  data: {
    products: [],
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
    getProduct(index) {
      const product = this.$data.products[index];
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
     * Add a new into the database
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
            // type: data.type,
            quantity: data.quantity,
            isCollapse: true,
            isLoading: true
          });
          APP.sortBy(APP.$data.currentSort, false); // Insert in the correct order
        } else {
          console.error(r)
        }
        setTimeout(() => {
          APP.$data.newProduct = {
            name: null,
            type: null,
            quantity: null,
            price: null,
            isLoading: false
          };
        }, 300);        
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
      })
    },
    /**
     * Delete one product
     * HTTP DELETE: update
     * @param {Number} index 
     */
    daleteProduct(index) {
      const product = this.$data.products[index];
      product.isLoading = true;
      const data = `?id=${product.id}`;
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