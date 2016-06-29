UserManager.Views.User = Backbone.View.extend({
  tagName: 'li',
  className: 'col-md-4',
  template: _.template($('#tpl-user').html()),

  events: {
    'click .delete-user': 'onClickDelete'
  },

  initialize: function() {
    this.listenTo(this.model, 'remove', this.remove);
  },

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.append(html);
    return this;
  },

  onClickDelete: function(e) {
    e.preventDefault();
    this.model.collection.remove(this.model);
  }
});
