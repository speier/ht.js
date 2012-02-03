## ht.js - Hogan.js template loader and compiler plugin for RequireJS.

[ht.js](https://github.com/speier/ht.js) is a [Hogan.js](https://github.com/twitter/hogan.js)
template loader and compiler plugin for RequireJS.

Usage example:

```javascript
require(['backbone', 'ht!templates/widget.html'], function (Backbone, WidgetTemplate) {
  return Backbone.View.extend({
    template: WidgetTemplate,
    render: function () {
      this.$el.html(this.template.render(this.model.toJSON()));
      }
  });
});
```