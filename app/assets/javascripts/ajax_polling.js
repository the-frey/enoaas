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
    if($('#bootstrap-music').data('currentTextId') === response.latest_text_id) {
      // we already have it on page
      console.log('Already running on latest Text record.');
      self.updateText(response.quote);
    } else {
      eno.updateVis(response);
      $('#bootstrap-music').data('currentTextId', response.latest_text_id);
      self.updateText(response.content);
    }
  };

  this.unsuccessfulUpdate = function(message){
    // do nothing
    console.log('An error occurred:');
    console.log(message);
  };

  this.updateText = function(newText){
    $('#eno-text .replace-text').html(newText);
  }

  this.polling = window.setInterval(function() {
      self.update()
        .then(
          self.successfulUpdate,
          self.unsuccessfulUpdate);
  }, 30000);


}
