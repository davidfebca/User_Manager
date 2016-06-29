window.UserManager = {
  Models: {},
  Collections: {},
  Views: {},

  start: function(data) {
    var users = new UserManager.Collections.Users(data.users),
        router = new UserManager.Router();

    router.on('route:home', function() {
      router.navigate('users', {
        trigger: true,
        replace: true
      });
    });

    router.on('route:showUsers', function() {
      var usersView = new UserManager.Views.Users({
        collection: users
      });

      $('.main-container').html(usersView.render().$el);
    });

    router.on('route:newUser', function() {
      var newUserForm = new UserManager.Views.UserForm({
        model: new UserManager.Models.User()
      });

      newUserForm.on('form:submitted', function(attrs) {
        attrs.id = users.isEmpty() ? 1 : (_.max(users.pluck('id')) + 1);
        $.ajax(root + "/users", {
            method: 'POST',
            data: {
              email: attrs.email,
              website:attrs.website,
              userId: attrs.id
          }
          }).then(function(data) {
            console.log(data);
            users.add(attrs);
            router.navigate('users', true);
          });
      });

      $('.main-container').html(newUserForm.render().$el);
    });

    router.on('route:editUser', function(id) {
      var user = users.get(id),
          editUserForm;

      if (user) {
        editUserForm = new UserManager.Views.UserForm({
            model: user
        });

        editUserForm.on('form:submitted', function(attrs) {
          $.ajax(root + "/users/" + id, {
              method: 'PUT',
              data: {
                email: attrs.email,
                website:attrs.website,
                userId: attrs.id
              }
            }).then(function(data) {
                console.log(data);
                user.set(attrs);
                router.navigate('users', true);
          });
        });
        $('.main-container').html(editUserForm.render().$el);
      } else {
        router.navigate('users', true);
      }
    });

    Backbone.history.start();
  }
};
