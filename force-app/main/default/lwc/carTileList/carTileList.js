import { LightningElement,wire } from 'lwc';
import getCars from '@salesforce/apex/carController.getCars';

import CARS_FILTERED_DATA from '@salesforce/messageChannel/carsFiltered__c';
import CARS_SELECTED_DATA from '@salesforce/messageChannel/carSelected__c';
import {publish,subscribe, MessageContext} from 'lightning/messageService'


export default class CarTileList extends LightningElement {
    carsData =[];
    error;
    filters={};
    carsFilterSubcription;
    @wire(MessageContext)
    messageContext;
   
    connectedCallback(){
        this.subscribeHandler();
    }
    
    @wire(getCars,{filters: '$filters'})
    carsHandler({data, error}){
        if(data){
            console.log(data)
            this.carsData = data;
        }else{
            console.error(error)
            this.error = error;
        }
    }

    subscribeHandler(){
        this.carsFilterSubcription = subscribe(this.messageContext, CARS_FILTERED_DATA, (message)=>this.handleFilterChanges(message));
    }

    handleFilterChanges(message){
        console.log(message.filters);
        this.filters = {...message.filters};
    }

    handleCarSelected(event){
        publish(this.messageContext, CARS_SELECTED_DATA, {
            carId: event.detail
        });
        console.log("id",event.detail);

    }

    disconnectedCallback(){
            unsubscribe(this.carsFilterSubcription);
            this.carsFilterSubcription = null;
    }

    

}