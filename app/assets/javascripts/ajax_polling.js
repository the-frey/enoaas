function AjaxRequest(){
  var self = this;

  this.update = function(){
    var promise = jQuery.Deferred();

    jQuery.ajax({
      url: '/update_music',
      data: {},
      type: 'get',
      dataType: 'json',
      beforeSend: function(xhr){
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      },
      success: function(response){
        promise.resolve(response);
      },
      error: function(message){
        promise.reject(message);
      }
    });

    return promise;
  }

  this.successfulUpdate = function(response){
    window.eno.updateDOM(response);
  };

  this.unsuccessfulUpdate = function(message){
    // do nothing
    console.log('An error occurred:');
    console.log(message);
  };
}

function triggerUpdate(){
  window.eno.ajax.update()
    .then(
      window.eno.ajax.successfulUpdate,
      window.eno.ajax.unsuccessfulUpdate  
    );
}

$(function(){
  var ajax = new AjaxRequest();

  window.eno = window.eno || new Object();
  window.eno.ajax = ajax;

  window.eno.polling = window.setInterval(triggerUpdate, 5000);
});
