/* eslint-disable no-undef */
/* global Handlebars, utils, dataSource */// eslint-disable-line no-unused-vars

import {settings, select,classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import {Booking} from './components/booking.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }

    }

    thisApp.activatePages(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href atribute*/
        /* pobierz identyfikator strony z atrybutu href */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /*run thisApp.activatePage with that id*/
        /* uruchom thisApp.activatePage z tym identyfikatorem */
        thisApp.activatePages(id);

        /*change URL hash*/
        /* zmiana skrótu adresu URL */
        window.location.hash = '#/' + id;

      });
    }
  },

  initBooking: function (){
    const thisApp = this;

    const bookingWrapper = document.querySelector(select.containerOf.booking); //znajduje kontener widgetu do rezerwacji stron, którego selektor mamy zapisany w select.containerOf.booking

    thisApp.booking = new Booking(bookingWrapper); //tworzy nową instancję klasy Booking
  },

  activatePages: function(pageId){
    const thisApp = this;

    /*add class "active" to maching pages, remove from non-matching*/
    /* dodaj klasę „aktywną” do stron obróbki, usuń z niepasujących */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /*add class "active" to maching links, remove from non-matching*/
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function () {
    const thisApp = this;
    // console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
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

    
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initMenu();
  },
};

app.init();