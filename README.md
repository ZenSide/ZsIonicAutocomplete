# ZsIonicAutocomplete
A simple and efficient autocomplete field to use with promise or static lists

Use ionic-autocomplete attribute to the field which will launch autocomplete modal.

    <input ionic-autocomplete ng-model="country">

To populate the list, two options :
- load all fields at initialisation then let the module filter on client side
- reload list filtered each time user type a letter

Loading the list once at startup
---
In attribute `elts-method`, enter the name of the method which will send back a promise with all the choices of the autocomplete field.
This list will be populated once and then used to filter search of user. This is to use with static list with a medium number of choices (less than 500 choices)

    <input ionic-autocomplete elts-method="countriesCallback" ng-model="country">
    
in your controller :

    $scope.countriesCallback = function() {
        // you can use a method which return a promise
        return $http.get('countries.json');
        // OR create the promise yourself
        var defer = $q.defer();
        myAsyncMethod(function(countries){
            defer.resolve(countries);
        });
        return defer.promise;
        // OR you can use defer to send your already loaded array
        var defer = $q.defer();
        defer.resolve(countries);
        return defer.promise;
    }

Loading list at every input
---
Instead using `elts-method`, it's possible to use `search-method` which will be called at every input in search field.
This method has to send back a promise and take one argument wich will be the user input.

    <input ionic-autocomplete search-method="searchCountriesCallback" ng-model="country">
    
in your controller :

    $scope.searchCountriesCallback = function(input){
        return $http.get('countries?q='+input);
    }
    
Display attributes
---
For now, the autocomplete field only works with arrays of object returned by promise. Some parameters allow you to define wich properties of this object will be used to display and search in the value.
- `search-field` contains the property name used to filter list when `elts-method` is used
- `results-field` contains the property name used to display list of elements
- `label-field` contains the property name which will be displayed in the input field once a choice is selected

    <input ionic-autocomplete elts-method="currenciesCallback" search-field="label" results-field="label" label-field="c">
    
Important
---
This is a first version, for now all display attributes are mandatory (except `search-field` if you use `search-method`)
