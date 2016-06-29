var root = 'http://jsonplaceholder.typicode.com';
var users = [];

function initApp(){
  Backbone.Component.initialize( { "namespace" : UserManager } );
  UserManager.start({
    users: users
  });
}
$.ajax({
    url:root + "/users",
    type:'GET',
    dataType: 'json',
    success:function(response){
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
          avatar: 'https://api.adorable.io/avatars/285/'
        };
        users.push(newUser);
      });
      initApp();
    },
    error: function(error){
      console.log("Could not load users");
    }
});
