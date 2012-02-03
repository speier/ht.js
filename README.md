## ht.js - Hogan.js plugin for RequireJS.

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

Requirements:
Require.js (1.0.5), Hogan.js (1.0.4)

Note: The optimization works with node.js only.
