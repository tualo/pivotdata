Ext.define('Tualo.Pivotdata.models.Viewport', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.pivotdata_viewport',
    /*
    data:{
        currentWMState: 'unkown',
        countKeys: 0,
        countPriatveKeys: 0,
        progressMax: 0,
        decrypted: 0,
        progress: 0,
        showwait: false,
    },
    formulas: {
        estimatedTimeText: function(get){
            let time = get('estimatedTime');
            if (time){
                if(Math.round(time)>0){
                    return 'ca. '+Math.round(time)+' Minuten verbleiben';
                }else{
                    return 'wenige Sekunden verbleiben';
                }
            }
            return '';
        }
    },
    */
    stores: {
        pivot_configuration: {
            type: 'pivot_configuration_store',
            autoLoad: true
        }
    }
});