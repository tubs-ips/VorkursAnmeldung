'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Vorkurs = new Module('vorkurs');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Vorkurs.register(function (app, auth, database) {

    Vorkurs.aggregateAsset('js', '../lib/ngDialog/js/ngDialog.min.js', {
        absolute: false,
        global: true
    });

    Vorkurs.aggregateAsset('css', '../lib/ngDialog/css/ngDialog.min.css', {
        absolute: false,
        global: true
    });

    Vorkurs.aggregateAsset('css', '../lib/ngDialog/css/ngDialog-theme-default.min.css', {
        absolute: false,
        global: true
    });

    //We enable routing. By default the Package Object is passed to the routes
    Vorkurs.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Vorkurs.menus.add({
        title: 'Vorkurs Anmeldung',
        link: 'vorkurs anmeldung',
        roles: ['anonymous', 'authenticated'],
        menu: 'main'
    });

    Vorkurs.menus.add({
        title: 'Anmeldungsstatus anfordern',
        link: 'vorkurs resend',
        roles: ['anonymous', 'authenticated'],
        menu: 'main'
    });

    /*Vorkurs.menus.add({
        title: 'Anmeldungsstatus',
        link: 'vorkurs status',
        roles: ['anonymous', 'authenticated'],
        menu: 'main'
    });

    Vorkurs.menus.add({
        title: 'Anmeldung Editieren',
        link: 'vorkurs edit',
        roles: ['anonymous', 'authenticated'],
        menu: 'main'
    });*/

    Vorkurs.aggregateAsset('css', 'vorkurs.css');

    /**
     //Uncomment to use. Requires meanio@0.3.7 or above
     // Save settings with callback
     // Use this for saving data from administration pages
     Vorkurs.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

     // Another save settings example this time with no callback
     // This writes over the last settings.
     Vorkurs.settings({
    'anotherSettings': 'some value'
  });

     // Get settings. Retrieves latest saved settigns
     Vorkurs.settings(function(err, settings) {
        //you now have the settings object
    });
     */

    return Vorkurs;
});
