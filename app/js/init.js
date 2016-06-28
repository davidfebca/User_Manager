var root = 'http://jsonplaceholder.typicode.com';
$.ajax({
    url:root + "/users",
    type:'GET',
    dataType: 'json',
    success:function(response){
      var users = [];
      $.each(response, function(index, element) {
        var newUser = {
          id : element.id,
          name : element.name,
          username: element.username,
          email: element.email,
          city: element.address.city,
          address: element.address.street + ", " + element.address.suite + ", " + element.address.zipcode,
          phone:element.phone,
          website:element.website,
          avatar: 'http://www.gravatar.com/avatar'
        };
        users.push(newUser);
      });
      Backbone.Component.initialize( { "namespace" : UserManager } );
      UserManager.start({
        users: users
      });
    },
    error: function(error){
      console.log("Could not load users");
    }
});
