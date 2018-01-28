// HXMLHttpRequest.readyState values
var ajaxHttp = {
  states: {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
  },
  httpStatus: {
    OK: 200,
    BAD_REQUESET: 300,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
};

(function(){
  // Chargement des news
  ajax({
    'url': 'http://127.0.0.1:8000/todos',
    'dataType': 'json', 
    'success': function(response){
      var app = new Vue({
        el: '#app',
        data: {
          todos: response
        }
      });
    }
  });
})();

/**************************** Fonctions ************************/
/**
 * Envoi une requête ajax
 */
function ajax(options){
  if(!typeof options.url=='undefined') throw "'url' must be defined";

  // Création de l'objet xhttp
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState==ajaxHttp.states.DONE){
      switch(this.status){
        case ajaxHttp.httpStatus.OK:
          if(typeof options.success == 'function'){
            var formattedResponse = this.response;

            // Formatt response
            if(typeof(options.dataType)!=='undefined'){
              switch(options.dataType){
                case 'json':
                  formattedResponse = JSON.parse(this.response);
                break;
              }
            }

            options.success.call(null, formattedResponse);
          }
        break;
      }
    }
  }

  // POST
  if(typeof options.data != 'undefined'){
    var params = "";
    var data;
    var keys = Object.keys(options.data);
    var dataLenght = keys.length;
    keys.forEach(function(attr, i){
      data = options.data[attr];
      params+=attr+"="+(typeof data=='object' ? JSON.stringify(data) : data); // Ajoute la paramètre

      // Ajoute & si on n'est pas sur le dernier élément
      if(i < dataLenght-1)
        params += "&";
    });

    // Envoi la requête
    xhttp.open("POST", options.url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
  }

  // GET
  else{
    xhttp.open("GET", options.url, true);
    xhttp.send();
  }
}