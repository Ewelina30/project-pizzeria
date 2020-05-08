import {select,classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

export class Product{
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

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
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

    /*END LOOP: for each paramId in thisProduct.data.params */
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

export default Product;