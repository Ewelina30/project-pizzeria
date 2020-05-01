/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', 
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
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },

    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },

    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

  class Product{
    constructor(id,data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      /* generuj HTML na podstawie szablonu */
      const generateHTML = templates.menuProduct(thisProduct.data);

      /* create element using utils.createElementFromHTML */
      /* utwórz element za pomocą utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generateHTML);

      /* find menu container */
      /* znajdź kontener menu */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      /* dodaj element do menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }


    initAccordion(){
      const thisProduct = this;

      /* START: click event listener to trigger */
      /*START: kliknij detektor zdarzeń, aby uruchomić*/
      thisProduct.accordionTrigger.addEventListener('click', function(){
        console.log('clicked');

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
          if(activeProduct !== thisProduct.element){

            /* remove class active for the active product */
            /* usuń klasę aktywną dla aktywnego produktu */
            activeProduct.classList.remove('active');
          //console.log(activeProduct);
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


    initOrderForm(){
      const thisProduct = this;
      console.log(this.initOrderFrom);

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
    }

    addToCart(){
      const thisProduct = this;

      thisProduct.name = thisProduct.data.name;
      console.log(thisProduct.name);

      thisProduct.amount = thisProduct.amountWidget.value;
      console.log(thisProduct.value);

      app.cart.add(thisProduct);
    }


    processOrder(){
      const thisProduct = this;

      // read all data from the form (using utils.serializeFormToObject) and save it to const formData
      // odczytaj wszystkie dane z formularza (używając utils.serializeFormToObject) i zapisz je w const formData
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);

      thisProduct.params = {};

      /* set variable price to equal thisProduct.data.price */
      /* ustaw cenę zmienną na tę samą cenę produktu. cena */
      let price = thisProduct.data.price;
      console.log(price);

      /* START LOOP: for each paramId in thisProduct.data.params */
      /* PĘTLA STARTOWA: dla każdej piramidy w tym produkcie.data.params */
      for(let paramId in thisProduct.data.params) {
        //console.log('param:',param);

        /* save the element in thisProduct.data.params with key paramId as const param */
        /* zapisz element w thisProduct.data.params z kluczem paramId jako const param */
        const param = thisProduct.data.params[paramId];

        /* START LOOP: for each optionId in param.options */
        /* START LOOP: dla każdej opcjiId w param.options */
        for(let optionId in param.options){

          /* save the element in param.options with key optionId as const option */
          /* zapisz element w param.options z kluczem optionId jako const opcja */
          const option = param.options[optionId];
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

          /* START IF: if option is selected and option is not default */
          /* ROZPOCZNIJ JEŚLI: jeśli opcja jest wybrana, a opcja nie jest domyślna */
          if(optionSelected && !option.default){

            // add price of option to variable price
            // dodaj cenę opcji do ceny zmiennej
            price += option.price;
          }

          /* START IF: if option is selected and option is not default */
          /* ROZPOCZNIJ JEŚLI: jeśli opcja jest wybrana, a opcja nie jest domyślna */
          else if(!optionSelected && option.default){

            // deduct price of option from price
            // odjąć cenę opcji od ceny
            price -= option.price;

            /* END IF: if option is selected and option is not default */
            /* KONIEC JEŻELI: jeśli opcja jest zaznaczona, a opcja nie jest domyślna */
          }

          //make constant and add to it all images for option
          //ustaw stałą i dodaj do niej wszystkie obrazy dla opcji
          const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          //console.log('IMAGES:', optionImages);

          if(optionSelected){
            if(!thisProduct.params[paramId]){

              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;

            for (let images of optionImages) {
              images.classList.add(classNames.menuProduct.imageVisible);
            }
          }
          else {
            for(let images of optionImages) {
              images.classList.remove(classNames.menuProduct.imageVisible);
            }
          }

          /* END ELSE IF: if option is not selected and option is default */
          /* ZAKOŃCZ JESZCZE: jeśli opcja nie jest zaznaczona, a opcja jest domyślna */
        }

        /* END LOOP: for each optionId in param.options */
        /* END LOOP: dla każdej opcjiId w param.options */
      }

      /* END LOOP: for each paramId in thisProduct.data.params */
      /* PĘTLA KOŃCOWA: dla każdej piramidy w tym produkcie.data.params */

      /*multiply price by amount*/
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */
      /* ustaw zawartość thisProduct.priceElem na wartość zmiennej ceny */
      thisProduct.priceElem.innerHTML = thisProduct.price;
      console.log(thisProduct.params);
    }
  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.dom = {};
      thisWidget.dom.wrapper = element;

      thisWidget.getElements(element);
      //thisWidget.value = settings.amountWidget.defaultValue;
      //thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      //console.log('AmountWidget', thisWidget);
      //console.log('constructor arguments:', element);
    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);

      console.log(settings);
      /*TODO: Add validation*/
      /* DO ZROBIENIA: Dodaj weryfikację */
      if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }

      thisWidget.input.value = thisWidget.value;
    }

    initActions(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    announce(){
      const thisWidget = this;

      const event = new Event ('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    initActions(){
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;

      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = document.querySelector(select.cart.productList);  
    }

    add(menuProduct){
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      console.log(generatedHTML);

      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      console.log(generatedDOM);

      thisCart.dom.productList.appendChild(generatedDOM);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('thisCart.products', thisCart.products);

      //console.log('adding product', menuProduct);
    }
  }

  class CartProduct{
    constructor(menuProduct,element){
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      
      console.log('new CartProduct', thisCartProduct);
      console.log('productData', menuProduct);
    }

    getElements(element){
      const thisCartProduct = this;

      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }
    initAmountWidget(){
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);

      thisCartProduct.dom.amountWidgetElem.addEventListener('updated', function(){
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        console.log('thisCartProduct price is: ', thisCartProduct.price);
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }
  }


  const app = {
    initMenu: function(){
      const thisApp = this;

      //console.log('thisApp:', thisApp.data);

      for (let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function(){
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);


      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}