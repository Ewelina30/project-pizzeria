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
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();

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

  getElements(){
  const thisProduct = this;

  thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
  thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
  thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
  thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
  thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
  thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
}


initAccordion(){
  const thisProduct = this;

  /* find the clickable trigger (the element that should react to clicking) */
  /* znajdź klikalny wyzwalacz (element, który powinien zareagować na kliknięcie) */
   //const clicableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);


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
  });
}


processOrder(){
  const thisProduct = this;

// read all data from the form (using utils.serializeFormToObject) and save it to const formData
// odczytaj wszystkie dane z formularza (używając utils.serializeFormToObject) i zapisz je w const formData
  const formData = utils.serializeFormToObject(thisProduct.form);
  console.log('formData', formData);
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
    console.log('IMAGES:', optionImages);

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

  /* set the contents of thisProduct.priceElem to be the value of variable price */
  /* ustaw zawartość thisProduct.priceElem na wartość zmiennej ceny */
  thisProduct.priceElem.textContent = price;
  console.log(thisProduct.params);
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
