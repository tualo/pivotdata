
Ext.define('Tualo.routes.Pivotdata', {
    statics: {
        load: async function () {
            let response = await Tualo.Fetch.post('ds/ds/read', { limit: 10000 });
            let list = [];
            if (response.success == true) {
                for (let i = 0; i < response.data.length; i++) {
                    if (!Ext.isEmpty(response.data[i].table_name))
                        list.push({
                            name: 'Pivot: '+response.data[i].title + ' (' + '#pivotdata/' + response.data[i].table_name + ')',
                            path: '#pivotdata/' + response.data[i].table_name
                        });
                }
            }
            return list;
        },
    }, 
    url: 'pivotdata/:{id}',
    handler: {
        action: function (values) {
            Ext.require('Tualo.'+'Pivotdata.Viewport', function(){
                let options = {}
                if (values.table){
                    options.pivotId = values.id;
                }
                Ext.getApplication().addView('Tualo.Pivotdata.Viewport',{
                    pivotId: values.id
                });
            });
            //
        },
        before: function (values,action) {
            action.resume();
        }
    }
});

