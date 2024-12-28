import { LightningElement, wire } from 'lwc';
import CAR_OBJECT from '@salesforce/schema/Car__c'
import NAME_FIELD from '@salesforce/schema/Car__c.Name';
import URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c';
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c';
import SEATS_FIELD from '@salesforce/schema/Car__c.seats__c';
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c';
import { getFieldValue } from 'lightning/uiRecordApi';
import CARS_SELECTED_DATA from '@salesforce/messageChannel/carSelected__c';
import {subscribe, MessageContext, unsubscribe} from 'lightning/messageService'
import {NavigationMixin} from 'lightning/navigation';

export default class CarCard extends NavigationMixin(LightningElement) {
    categoryField = CATEGORY_FIELD;
    makeField = MAKE_FIELD;
    msrpField = MSRP_FIELD;
    fuelField = FUEL_FIELD;
    seatsField =SEATS_FIELD;
    controlField = CONTROL_FIELD;

    recordId;

    carName;
    carUrlPicture;
    carSelectedSubscription;

    @wire(MessageContext)
    messageContext;
       
    connectedCallback(){
        this.subscribeHandler();
    }
    handleRecordLoaded(event){
        const {records}= event.detail;
        const recordData = records[this.recordId];
        this.carName = getFieldValue(recordData, NAME_FIELD);
        this.carUrlPicture = getFieldValue(recordData, URL_FIELD);
    }

    subscribeHandler(){
       this.carSelectedSubscription =  subscribe(this.messageContext, CARS_SELECTED_DATA, (message)=>this.handleCarSelected(message));
    }

    handleCarSelected(car){
        this.recordId = car.carId;
        console.log('recordId', this.recordId);
    }

    disconnectedCallback(){
        unsubscribe(this.carSelectedSubscription);
        this.carSelectedSubscription = null;
    }

    handleNavigateRecord(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId: this.recordId,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName: 'view'
            }
        })
        
    }
}