## ht.js - RequireJS plugin for Hogan.js.

[ht.js](https://github.com/speier/ht.js) is a RequireJS plugin for [Hogan.js](https://github.com/twitter/hogan.js).

Usage:

```javascript
require(['ht!templates/widget.html'], function (WidgetTemplate) {
  document.body.innerHTML = WidgetTemplate.render({ title: 'test' });
});
```