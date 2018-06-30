let postMonger = require('postmonger');
let connection = new postMonger.Session();
$(window).ready(function () {
    connection.trigger('ready');
});