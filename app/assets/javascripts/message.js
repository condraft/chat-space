$(document).on('turbolinks:load', function(){
  function buildHTML(message) {
    var content = message.content ? `${ message.content }` : ""; //条件分岐
    var img = message.image ? `<img src= ${ message.image }>` : ""; //条件分岐
    var html = `<div class="chat-main__messages__message" data-id="${message.id}"> 
                  <div class="chat-main__messages__message__upper-info">
                    <p class="chat-main__messages__message__upper-info__talker">
                      ${message.user_name}
                    </p>
                    <p class="chat-main__messages__message__upper-info__date">
                      ${message.date}
                    </p>
                  </div>
                  <p class="chat-main__messages__message__text">
                    <div>
                    ${content}
                    </div>
                    ${img}
                  </p>
                </div>` //雛形作成
  return html;
  }
  function scrollBottom(){
    var target = $('.chat-main__messages__message').last();
    var position = target.offset().top + $('.chat-main__messages').scrollTop();
    $('.chat-main__messages').animate({
      scrollTop: position
    },300, 'swing');
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({ //データベース送信
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){    
      var html = buildHTML(data);
      $('.chat-main__messages').append(html); //親クラスにアペンド
      $('#new_message')[0].reset(); //フォームを一括でリセットする
      scrollBottom();
    })
    .fail(function(data){
      alert('エラーが発生しました')
    })
    .always(function(data){
      $('.form__submit').prop('disabled', false);
    })
  })
});
