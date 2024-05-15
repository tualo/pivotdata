Ext.define('Tualo.Pivotdata.Viewport', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pivotdata_viewport',
    requires: [
        'Tualo.Pivotdata.controller.Viewport',
        'Tualo.Pivotdata.models.Viewport',
        'Tualo.Pivotdata.RepeatedAjaxProxy',
        'Tualo.Pivotdata.RepeatedServerProxy',
    ],
    layout: 'fit',
    // pivotId: 'view_agenda_blg_zahlungen',
    bodyPadding: 0,
    viewModel: {
        type: 'pivotdata_viewport'
    },
    listeners:{
        boxReady: 'onReady'
    },
    controller: 'pivotdata_viewport',
    items: [
        {
            xtype: 'panel'
        }
    ],
    buttons: [
        {
            text: 'Speichern',
            handler: 'save'
        }
    ]
    
});

