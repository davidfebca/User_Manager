UserManager.Address = Backbone.Component.extend(
  {
    tagName: function(){return "div"},
    template:   function(address) {
      return "<input type='text' class='form-control user-address-input' value='" + address + "'/>";
    }
  }
);
