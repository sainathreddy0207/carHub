public with sharing class carController {
    
    public class Filters{
        @AuraEnabled
        public String searchKey {get;set;}
        @AuraEnabled
        public Decimal maxPrice {get;set;}
        @AuraEnabled
        public String[] categories {get;set;}
        @AuraEnabled
        public String[] makeType {get;set;}
        
    }
    @AuraEnabled(cacheable=true)
    public static List<Car__c> getCars(Filters filters){
        String key, whereClause = '';
        Decimal maxPrice;
        String[] categories, makeType, criteria= new List<String>();
        if(filters != null){
            maxPrice = filters.maxPrice;
            categories = filters.categories;
            makeType = filters.makeType;
            if(!String.isEmpty(filters.searchKey)){
                key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }   
            if(filters.maxPrice >=0){
                criteria.add('MSRP__c <= :maxPrice');
            }
            if(filters.categories != null){
                criteria.add('Category__c IN :categories');
            }
            if(filters.makeType != null){
                criteria.add('Make__c IN :makeType');
            }
            if(criteria.size()>0){
                whereClause = 'Where ' + String.join(criteria, ' AND ');
            }
        }
        String query= 'SELECT Id, Name, MSRP__c, Picture_URL__c, seats__c, Fuel_Type__c, Control__c, Category__c, Make__c FROM Car__c '+ whereClause +'  ORDER BY Name ' ;
        system.debug('query'+ query);
        return Database.query(query);
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Car__c> getSimilarCars(Id carId, List<String> makeType){
        return [SELECT Id, Name, MSRP__c, Picture_URL__c, seats__c, Fuel_Type__c, Control__c, Category__c, Make__c FROM Car__c where Make__c In :makeType AND Id != :carId];
        
    }

}