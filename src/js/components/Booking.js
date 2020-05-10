import {templates, select} from '../settings.js';
import {AmountWidget} from './AmountWidget.js';
import {DatePicker} from './DatePicker.js';

export class Booking {
  constructor(element){
    const thisBooking = this; 

    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {}; //pusty obiekt thisBooking.dom
    thisBooking.dom.wrapper = element; //zapisywanie do obiektu thisBooking.dom właściwość wrapper równą otrzymanemu argumentowi
    thisBooking.dom.wrapper.innerHTML = generatedHTML; //zawartość wrappera zamienia na kod HTML wygenerowany z szablonu

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector( //właściwość peopleAmount zapisuje pojedynczy element znaleziony we wrapperze i pasujący do selektora select.booking.peopleAmount
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector( //właściwość hoursAmount zapisuje pojedynczy element znaleziony we wraperze i pasujący do selektora select.booking.hoursAmount
      select.booking.hoursAmount
    );
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
  }

  initWidgets() {
    const thisBooking = this;
        
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount); //właściwość thisBooking.peopleAmount zapisuje nową instancję klasy AmountWidget, który jako argument przekazujemy odpowiednei właściwości z obiketu thisBooking.dom
    thisBooking.hourseAmount = new AmountWidget(thisBooking.dom.hoursAmount); ////właściwość thisBooking.hourseAmount zapisuje nową instancję klasy AmountWidget, który jako argument przekazujemy odpowiednei właściwości z obiketu thisBooking.dom
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    //console.log('datePicker', thisBooking.datePicker);
  }
}