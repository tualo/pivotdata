
Ext.define('Tualo.routes.Pivotdata', {
    statics: {
        load: async function() {
            return [
                {
                    name: 'pivotdata/test',
                    path: '#pivotdata/test'
                }
            ]
        }
    }, 
    url: 'pivotdata/test',
    handler: {
        action: function () {
            Ext.require('Tualo.'+'Pivotdata.Viewport', function(){
                Ext.getApplication().addView('Tualo.Pivotdata.Viewport');
            });
            //
        },
        before: function (action) {
            action.resume();
        }
    }
});

