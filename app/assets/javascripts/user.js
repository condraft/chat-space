$(document).on('turbolinks:load', function(){
  var search_list = $("#user-search-result");
  var member_list = $(".member_search_result");

  function appendUser(user){
    var html = `<div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${user.name}</p>
                <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${user.id} data-user-name=${user.name}>追加</div>
                </div>`;
    search_list.append(html);
    return html;
  }

  function appendMembers(name, user_id){
    var html = `<div class='chat-group-user'>
                <input name='group[user_ids][]' type='hidden' value=${ user_id }>
                <p class='chat-group-user__name'>${ name }</p>
                <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>`;
    $(member_list).append(html);
  }
  
  function appendErrMsgToHTML(noone){
    var html = `<div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${noone}</p>
                </div>`;
    search_list.append(html);
  }
  $(function(){
    $('#user-search-field').on('keyup', function(e){ //検索窓のkeyupで発火
      var input = $("#user-search-field").val(); //inputに検索窓にあるデータを入れる
      $.ajax({
        type: 'GET',                // HTTPメソッド
        url:  '/users',       // usersコントローラのindexアクション
        data: { keyword: input },   // keyword: inputを送信する
        dataType: 'json'            // サーバから値を返すjson
      })
      .done(function(users){                // json形式のuserを代入。複数形:配列型
        if (input.length === 0) {         // フォームの文字列長さが0であれば、結果を表示しない
          $('#user-search-result').empty();
          }
        else if (input.length !== 0){     // 値が等しくないもしくは型が等しくなければtrueを返す。
          $('#user-search-result').empty();
          users.forEach(function(user){ // users情報をひとつずつとりだしてuserに代入
            appendUser(user)              // appendUserメソッド全部に適用
          });
        }
        else {
          $('#user-search-result').empty(); // ユーザーが見つからない記述
          appendErrMsgToHTML("一致するユーザーが見つかりません");
        }
        })
      .fail(function() {
        alert('ユーザー検索に失敗しました');  
      })
    });
    $(function(){
      $(document).on('click','.user-search-add', function(){
        var name = $(this).data("user-name");
        var user_id = $(this).data("user-id");
        $(this).parent().remove();
        appendMembers(name, user_id);
      });
      $(document).on('click','.user-search-remove', function(){
        $(this).parent().remove();
      });
    });
  });
});
