/* eslint-disable no-undef */
/* global Handlebars, utils, dataSource */// eslint-disable-line no-unused-vars

import {settings, select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {

  initMenu: function () {
    const thisApp = this;
    // console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(productData, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('ParsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.Data.products */
        /* zapisz parsedResponse jako thisApp.Data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        /* wykonaj metodę initMenu */
        thisApp.initMenu();
      });

    console.log('ThisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);


    thisApp.initData();
    thisApp.initCart();
  },
};

app.init();
