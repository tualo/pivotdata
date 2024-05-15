
Ext.define('Tualo.Pivotdata.RepeatedAjaxProxy', {
    requires: ['Ext.Ajax'],
    extend: 'Tualo.Pivotdata.RepeatedServerProxy',
    alias: 'proxy.repeatedajax',
 
    isAjaxProxy: true,
 
    // Keep a default copy of the action methods here. Ideally could just null
    // out actionMethods and just check if it exists & has a property, otherwise
    // fallback to the default. But at the moment it's defined as a public property,
    // so we need to be able to maintain the ability to modify/access it. 
    defaultActionMethods: {
        create: 'POST',
        read: 'GET',
        update: 'POST',
        destroy: 'POST'
    },
 
    config: {
        /**
        * @cfg {Boolean} binary
        * True to request binary data from the server.  This feature requires
        * the use of a binary reader such as {@link Ext.data.amf.Reader AMF Reader}
        */
        binary: false,
 
        /**
         * @cfg {Object} [headers]
         * Any headers to add to the Ajax request.
         *
         * example:
         *
         *     proxy: {
         *         headers: {'Content-Type': "text/plain" }
         *         ...
         *     }
         */
        headers: undefined,
 
        /**
         * @cfg {Boolean} paramsAsJson
         * Set to `true` to have any request parameters sent as
         * {@link Ext.data.Connection#method-request jsonData} where they can be parsed from the
         * raw request. By default, parameters are sent via the
         * {@link Ext.data.Connection#method-request params} property.
         * **Note**: This setting does not apply when the request is sent as a 'GET' request.
         * See {@link #cfg!actionMethods} for controlling the HTTP verb that is used when sending
         * requests.
         */
        paramsAsJson: false,
 
        /**
         * @cfg {Boolean} withCredentials
         * This configuration is sometimes necessary when using cross-origin resource sharing.
         * @accessor
         */
        withCredentials: false,
 
        /**
         * @cfg {Boolean} useDefaultXhrHeader
         * Set this to false to not send the default Xhr header (X-Requested-With) with every
         * request. This should be set to false when making CORS (cross-domain) requests.
         * @accessor
         */
        useDefaultXhrHeader: true,
 
        /**
         * @cfg {String} username
         * Most oData feeds require basic HTTP authentication. This configuration allows
         * you to specify the username.
         * @accessor
         */
        username: null,
 
        /**
         * @cfg {String} password
         * Most oData feeds require basic HTTP authentication. This configuration allows
         * you to specify the password.
         * @accessor
         */
        password: null,
 
        /**
        * @cfg {Object} actionMethods
        * Mapping of action name to HTTP request method. In the basic AjaxProxy these are set to
        * 'GET' for 'read' actions and 'POST' for 'create', 'update' and 'destroy' actions. The
        * {@link Ext.data.proxy.Rest} maps these to the correct RESTful methods.
        */
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'POST'
        },

    },
 
    doRequest: function(operation) {
        console.log('doRequest', operation);
        var me = this,
            writer = me.getWriter(),
            request = me.buildRequest(operation),
            method = me.getMethod(request),
            jsonData, params;
 
        if (writer && operation.allowWrite()) {
            request = writer.write(request);
        }
 
        request.setConfig({
            binary: me.getBinary(),
            headers: me.getHeaders(),
            timeout: me.getTimeout(),
            scope: me,
            callback: me.createRequestCallback(request, operation),
            method: method,
            useDefaultXhrHeader: me.getUseDefaultXhrHeader(),
            disableCaching: false // explicitly set it to false, ServerProxy handles caching
        });
 
        if (me.responseType != null && Ext.supports.XHR2) {
            request.setResponseType(me.responseType);
        }
 
        if (method.toUpperCase() !== 'GET' && me.getParamsAsJson()) {
            params = request.getParams();
 
            if (params) {
                jsonData = request.getJsonData();
 
                if (jsonData) {
                    jsonData = Ext.Object.merge({}, jsonData, params);
                }
                else {
                    jsonData = params;
                }
 
                request.setJsonData(jsonData);
                request.setParams(undefined);
            }
        }
 
        if (me.getWithCredentials()) {
            request.setWithCredentials(true);
            request.setUsername(me.getUsername());
            request.setPassword(me.getPassword());
        }
 
        return me.sendRequest(request);
    },
 
    /**
     * Fires a request
     * @param {Ext.data.Request} request The request
     * @return {Ext.data.Request} The request
     * @private
     */
    sendRequest: function(request) {
        console.log('sendRequest', request);
        request.setRawRequest(Ext.Ajax.request(request.getCurrentConfig()));
        this.lastRequest = request;
 
        return request;
    },
 
    /**
     * Aborts a running request.
     * @param {Ext.data.Request} [request] The request to abort. If not passed, the most recent
     * active request will be aborted.
     */
    abort: function(request) {
        request = request || this.lastRequest;
 
        if (request) {
            Ext.Ajax.abort(request.getRawRequest());
        }
    },
 
    /**
     * Returns the HTTP method name for a given request. By default this returns based on a lookup
     * on {@link #cfg!actionMethods}.
     * @param {Ext.data.Request} request The request object
     * @return {String} The HTTP method to use (should be one of 'GET', 'POST', 'PUT' or 'DELETE')
     */
    getMethod: function(request) {
        var actions = this.getActionMethods(),
            action = request.getAction(),
            method;
 
        if (actions) {
            method = actions[action];
        }
 
        return method || this.defaultActionMethods[action];
    },
 

    lastJSON: null,
    appendJSON: function(json){
        if (this.lastJSON==null) this.lastJSON = json;
        this.lastJSON.data  = this.lastJSON.data.concat(json.data);
        this.lastJSON.total = this.lastJSON.total + json.total;
    },
    /**
     * @private
     * TODO: This is currently identical to the JsonPProxy version except for the return function's
     * signature. There is a lot of code duplication inside the returned function so we need to
     * find a way to DRY this up.
     * @param {Ext.data.Request} request The Request object
     * @param {Ext.data.operation.Operation} operation The Operation being executed
     * @return {Function} The callback function
     */
    createRequestCallback: function(request, operation) {
        return function(options, success, response) {
            var me = this;
 
            if (request === me.lastRequest) {
                me.lastRequest = null;
            }

            if (success) {
                if (operation.getPage()==1) me.lastJSON = {
                    data: [],
                    total: 0
                };

                me.appendJSON(response.responseJson);
                if (operation.getLimit() <= response.responseJson.data.length){
                    operation.setPage(operation.getPage()+1 );
                    operation.setStart(operation.getLimit()*operation.getPage()-operation.getLimit());
                    me.doRequest(operation);
                    return;
                }
            }

            response.responseJson.data = me.lastJSON.data;
            response.responseJson.total = me.lastJSON.total;

            console.log('createRequestCallback', options, success, response);
            if (!me.destroying && !me.destroyed) {
                me.processResponse(success, operation, request, response);
            }
        };
    },
 
    destroy: function() {
        this.lastRequest = null;
 
        this.callParent();
    }
});