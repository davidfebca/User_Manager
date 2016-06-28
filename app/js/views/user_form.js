UserManager.Views.UserForm = Backbone.View.extend({
  template: _.template($('#tpl-new-user').html()),

  events: {
    'submit .user-form': 'onFormSubmit'
  },

  render: function() {
    var html = this.template(_.extend(this.model.toJSON(), {
      isNew: this.model.isNew()
    }));
    this.$el.append(html);
    return this;
  },

  onFormSubmit: function(e) {
    e.preventDefault();

    this.trigger('form:submitted', {
      name: this.$('.user-name-input').val(),
      username: this.$('.user-username-input').val(),
      address:  this.$('.user-address-input').val(),
      email: this.$('.user-email-input').val(),
      website: this.$('.user-website-input').val(),
      city: this.$('.user-city-input').val(),
      phone: this.$('.user-phone-input').val(),
      avatar: 'https://api.adorable.io/avatars/285/'

    });
  }
});
