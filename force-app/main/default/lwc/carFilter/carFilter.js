import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CAR_OBJECT from '@salesforce/schema/Car__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';

import CARS_FILTERED_DATA from '@salesforce/messageChannel/carsFiltered__c';
import {publish, MessageContext} from 'lightning/messageService'

const CATEGORY_ERROR = 'Error Loading Categories'
const MAKE_ERROR = 'Error Loading Make'
export default class CarFilter extends LightningElement {
    filters={
        searchKey:'',
        maxPrice:999999
    }
    categoryError = CATEGORY_ERROR
    makeTypeError = MAKE_ERROR
    timer;

    /** Loanding LMS */
    @wire(MessageContext)
    messageContext;


    /*fetching Cateogry*/
    @wire(getObjectInfo,{objectApiName:CAR_OBJECT})
    carObjectInfo

    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: CATEGORY_FIELD
    })categories

    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: MAKE_FIELD
    })makeType

    handleSearchKeyChange(event){
        console.log('search string', event.target.value);
        this.filters ={...this.filters,"searchKey":event.target.value};
        this.sendDataToCarList();
    }

    handleMaxPriceChange(event){
        console.log('Maxprice string', event.target.value);
        this.filters ={...this.filters,"maxPrice":event.target.value};
        this.sendDataToCarList();
    }

    handleCheckbox(event){
        if(!this.filters.categories || !this.filters.makeType){
            const categories = this.categories.data.values.map(item=>item.value)
            const makeType = this.makeType.data.values.map(item=>item.value)
            this.filters = {...this.filters, categories, makeType}

        }
        const {name, value}= event.target.dataset;
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
            else{
                this.filters[name] = this.filters[name].filter(item=> item!==value)
            }
            this.sendDataToCarList()
        }
    }

    sendDataToCarList(){
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext, CARS_FILTERED_DATA, {
                filters:this.filters
            })
        },490)
        
    }

}