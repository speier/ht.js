## ht.js - RequireJS plugin for Hogan.js.

[ht.js](https://github.com/speier/ht.js) is a RequireJS plugin for [Hogan.js](https://github.com/twitter/hogan.js).

Usage:

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