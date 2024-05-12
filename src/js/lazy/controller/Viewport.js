Ext.define('Tualo.Pivotdata.controller.Viewport', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pivotdata_viewport',

    create: async function(){

        let me=this,
            cnf = await fetch('./pivotdata/configuration/'+this.getView().pivotId).then((response)=>{
            return response.json();
        });
        

        if (cnf.success){
            let object = cnf.config;
            object.xtype = 'pivotgrid';
            object.multiSelect = true;
            object.columnLines = true;
            object.selModel = {
                type: 'spreadsheet'
            };
            
            let c = Ext.create(object);
            
            me.getView().removeAll();
            me.getView().add(c);
            
        }

    },
    onReady: function () {
        this.create();
    },
    save: function(){
        let me = this;
        let pivotgrid = me.getView().down('pivotgrid');
        
        let config = pivotgrid.getConfig();
        let pivotId = me.getView().pivotId;
        let newPivotId = me.getView().pivotId;

        let aggregators=[];
        let topAxis = [];
        let leftAxis = [];
        let index=0;
        let a = pivotgrid.getPlugin("configurator").getConfig().configPanel.items.items[1].items.get('fieldsAggCt').items.items;

        a.forEach(element => {
            console.log(element);   
            element = element.config.field.config;
            /*
            dataIndex
            header
            formatter
            aggregator
            align
            */
            aggregators.push({
                dataIndex: element.dataIndex,
                header: element.header,
                formatter: element.formatter,
                aggregator: element.aggregator,
                align: element.align,
                position: index++
            });
        });
        index=0;
        a = pivotgrid.getPlugin("configurator").getConfig().configPanel.items.items[1].items.get('fieldsTopCt').items.items;
        a.forEach(element => {
            element = element.config.field.config;
            topAxis.push({
                dataIndex: element.dataIndex,
                header: element.header,
                position: index++
            });
        });
        index=0;
        a = pivotgrid.getPlugin("configurator").getConfig().configPanel.items.items[1].items.get('fieldsLeftCt').items.items;
        a.forEach(element => {
            element = element.config.field.config;
            leftAxis.push({
                dataIndex: element.dataIndex,
                header: element.header,
                position: index++
            });
        });


        
        fetch('./pivotdata/configuration/'+pivotId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pivotId: newPivotId,
                aggregate: aggregators,
                topAxis: topAxis,
                leftAxis: leftAxis
            })
        }).then((response)=>{
            return response.json();
        }).then((response)=>{
            console.log(response);
        });
        
    },

    exportToPivotXlsx: function() {
        let me = this;
        let pivotgrid = me.getView().down('pivotgrid');
        let title = pivotgrid.getTitle() || 'PivotGrid';
        this.doExport({
            type: 'pivotxlsx',
            matrix: pivotgrid.getMatrix(),
            title: title,
            fileName: 'ExportPivot.xlsx'
        });
    },

    exportTo: function(btn) {
        let me = this;
        let pivotgrid = me.getView().down('pivotgrid');
        let title = pivotgrid.getTitle() || 'PivotGrid';
        var cfg = Ext.merge({
            title: title,
            fileName: title + (btn.cfg.onlyExpandedNodes ? 'Visible' : '') + '.' + (btn.cfg.ext || btn.cfg.type)
        }, btn.cfg);

        this.doExport(cfg);
    },

    doExport: function(config) {
        let me = this;
        let pivotgrid = me.getView().down('pivotgrid');
        pivotgrid.saveDocumentAs(config).then(null, this.onError);
    },

    onError: function(error) {
        Ext.Msg.alert('Error', typeof error === 'string' ? error : 'Unknown error');
    },

    onBeforeDocumentSave: function(view) {
        view.mask('Document is prepared for export. Please wait ...');
    },

    onDocumentSave: function(view) {
        view.unmask();
    }

});