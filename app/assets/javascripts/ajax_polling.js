function AjaxRequest(eno){
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
    eno.updateDOM(response);
  };

  this.unsuccessfulUpdate = function(message){
    // do nothing
    console.log('An error occurred:');
    console.log(message);
  };

  this.polling = window.setInterval(function() {
      self.update()
        .then(
          self.successfulUpdate,
          self.unsuccessfulUpdate);
  }, 3000);


}
