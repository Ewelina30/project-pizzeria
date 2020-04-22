/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id,data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      console.log('new Product', thisProduct);

      thisProduct.initAccordion();

  }

  renderInMenu(){
    const thisProduct = this;

    /* generate HTML based on template */
    const generateHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generateHTML);

    /* find menu container */
    const menuContainer = document .querySelector(select.containerOf.menu);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }


initAccordion(){
  const thisProduct = this;

  /* find the clickable trigger (the element that should react to clicking) */
  /* znajdź klikalny wyzwalacz (element, który powinien zareagować na kliknięcie) */
   const clicableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
   console.log(clicableTrigger);

    /* START: click event listener to trigger */
    /*START: kliknij detektor zdarzeń, aby uruchomić*/
    clicableTrigger.addEventListener('click', function(event){

      /* prevent default action for event */
      /* zapobiec domyślnej akcji dla zdarzenia */
          event.preventDefault();

      /* toggle active class on element of thisProduct */
      /* przełącz aktywną klasę na elemencie thisProduct */
      thisProduct.element.classList.toggle('active');

      /* find all active products */
      /* znajdź wszystkie aktywne produkty */
      const allActiveProducts = document.querySelectorAll('article.active');

      /* START LOOP: for each active product */
      /* PĘTLA STARTOWA: dla każdego aktywnego produktu */
      for(let activeProduct of allActiveProducts ){

        /* START: if the active product isn't the element of thisProduct */
        /* START: jeśli aktywny produkt nie jest elementem tego produktu */
        if( activeProduct !== thisProduct.element){

          /* remove class active for the active product */
          /* usuń klasę aktywną dla aktywnego produktu */
          activeProduct.classList.remove('active');
          console.log(activeProduct);
        }
        /* END: if the active product isn't the element of thisProduct */
        /* KONIEC: aktywnego produktu nie jest elementem tego produktu */
      }

      /* END LOOP: for each active product */
      /* PĘTLA KOŃCOWA: dla każdego aktywnego produktu */
      });
    /* END: click event listener to trigger */
    /* END: kliknij detektor zdarzeń, aby uruchomić */
  }
}


  const app = {
    initMenu: function(){
      const thisApp = this;

      console.log('thisApp:', thisApp.data);

      for (let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);


      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}