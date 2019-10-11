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
  var reloadMessages = function() {
    console.log("ok")
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      last_message_id = $('.message:last').data("message-id"); //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
      $.ajax({
        url: 'api/messages',  //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
        type: 'get',  //ルーティングで設定した通りhttpメソッドをgetに指定
        dataType: 'json',
        data: {id: last_message_id}  //dataオプションでリクエストに値を含める
      })
      .done(function(messages) {
        var insertHTML = '';  //追加するHTMLの入れ物を作る
        messages.forEach(function (message){  //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
          insertHTML = buildHTML(message); //メッセージが入ったHTMLを取得
          $('.chat-main__messages').append(insertHTML);  //メッセージを追加
        })
        $('.chat-main__messages').animate({scrollTop: $('.chat-main__messages')[0].scrollHeight}, 'fast'); //スクロール
      })
      .fail(function() {
        console.log('error');
      });
    }
  };
  // setInterval(reloadMessages, 5000);
});
