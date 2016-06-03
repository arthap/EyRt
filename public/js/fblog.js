 window.fbAsyncInit = function() {
      FB.init({appId: '145726158803248', status: true, cookie: true, xfbml: true});

      FB.Event.subscribe('auth.login', function(response) {
        login();
      });
      FB.Event.subscribe('auth.logout', function(response) {
        logout();
      });

      FB.getLoginStatus(function(response) {
        if (response.session) {
          greet();
        }
      });
    };
    (function() {
      var e = document.createElement('script');
      e.type = 'text/javascript';
      e.src = document.location.protocol +
              '//connect.facebook.net/en_US/all.js';
      e.async = true;
      document.getElementById('fb-root').appendChild(e);
    }());

    function login(){
      FB.api('/me', function(response) {
        alert('Вы удачно зарегистрировались, '+response.name+"!");
      });
    }
    function logout(){
      alert('Вы удачно вышли из Facebook!');
    }
    function greet(){
      FB.api('/me', function(response) {
        alert('Добро пожаловать, '+response.name+"!");
      });
    }

    function setStatus(){

      // Проверяем, зарегистрировался ли пользовательы:
      FB.getLoginStatus(function(response) {
        if (response.session) {
          new_status = document.getElementById('status').value;
          FB.api(
                  {
                    method: 'status.set',
                    status: new_status
                  },
                  function(response) {
                    if (response == 0){
                      alert('Ваш статус Facebook не обновлен. Установите права для обновления статуса.');
                    }
                    else{
                      alert('Ваш статус Facebook обновлен');
                    }
                  }
          );
        } else {
          alert('Сначала зарегистрируейтесь :)');
        }
      });
    }