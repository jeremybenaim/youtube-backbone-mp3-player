// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v2.1.0
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com


/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Wreqr
 * https://github.com/marionettejs/backbone.wreqr/
 */

!function(a,b){if("function"==typeof define&&define.amd)define(["backbone","underscore"],function(c,d){return a.Marionette=b(a,c,d)});else if("undefined"!=typeof exports){var c=require("backbone"),d=require("underscore");module.exports=b(a,c,d)}else a.Marionette=b(a,a.Backbone,a._)}(this,function(a,b,c){"use strict";function d(a,b){var c=new Error(a);throw c.name=b||"Error",c}!function(a,b){var c=a.ChildViewContainer;return a.ChildViewContainer=function(a,b){var c=function(a){this._views={},this._indexByModel={},this._indexByCustom={},this._updateLength(),b.each(a,this.add,this)};b.extend(c.prototype,{add:function(a,b){var c=a.cid;return this._views[c]=a,a.model&&(this._indexByModel[a.model.cid]=c),b&&(this._indexByCustom[b]=c),this._updateLength(),this},findByModel:function(a){return this.findByModelCid(a.cid)},findByModelCid:function(a){var b=this._indexByModel[a];return this.findByCid(b)},findByCustom:function(a){var b=this._indexByCustom[a];return this.findByCid(b)},findByIndex:function(a){return b.values(this._views)[a]},findByCid:function(a){return this._views[a]},remove:function(a){var c=a.cid;return a.model&&delete this._indexByModel[a.model.cid],b.any(this._indexByCustom,function(a,b){return a===c?(delete this._indexByCustom[b],!0):void 0},this),delete this._views[c],this._updateLength(),this},call:function(a){this.apply(a,b.tail(arguments))},apply:function(a,c){b.each(this._views,function(d){b.isFunction(d[a])&&d[a].apply(d,c||[])})},_updateLength:function(){this.length=b.size(this._views)}});var d=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];return b.each(d,function(a){c.prototype[a]=function(){var c=b.values(this._views),d=[c].concat(b.toArray(arguments));return b[a].apply(b,d)}}),c}(a,b),a.ChildViewContainer.VERSION="0.1.4",a.ChildViewContainer.noConflict=function(){return a.ChildViewContainer=c,this},a.ChildViewContainer}(b,c),function(a,b){var c=a.Wreqr,d=a.Wreqr={};return a.Wreqr.VERSION="1.3.1",a.Wreqr.noConflict=function(){return a.Wreqr=c,this},d.Handlers=function(a,b){var c=function(a){this.options=a,this._wreqrHandlers={},b.isFunction(this.initialize)&&this.initialize(a)};return c.extend=a.Model.extend,b.extend(c.prototype,a.Events,{setHandlers:function(a){b.each(a,function(a,c){var d=null;b.isObject(a)&&!b.isFunction(a)&&(d=a.context,a=a.callback),this.setHandler(c,a,d)},this)},setHandler:function(a,b,c){var d={callback:b,context:c};this._wreqrHandlers[a]=d,this.trigger("handler:add",a,b,c)},hasHandler:function(a){return!!this._wreqrHandlers[a]},getHandler:function(a){var b=this._wreqrHandlers[a];if(b)return function(){var a=Array.prototype.slice.apply(arguments);return b.callback.apply(b.context,a)}},removeHandler:function(a){delete this._wreqrHandlers[a]},removeAllHandlers:function(){this._wreqrHandlers={}}}),c}(a,b),d.CommandStorage=function(){var c=function(a){this.options=a,this._commands={},b.isFunction(this.initialize)&&this.initialize(a)};return b.extend(c.prototype,a.Events,{getCommands:function(a){var b=this._commands[a];return b||(b={command:a,instances:[]},this._commands[a]=b),b},addCommand:function(a,b){var c=this.getCommands(a);c.instances.push(b)},clearCommands:function(a){var b=this.getCommands(a);b.instances=[]}}),c}(),d.Commands=function(a){return a.Handlers.extend({storageType:a.CommandStorage,constructor:function(b){this.options=b||{},this._initializeStorage(this.options),this.on("handler:add",this._executeCommands,this);var c=Array.prototype.slice.call(arguments);a.Handlers.prototype.constructor.apply(this,c)},execute:function(a,b){a=arguments[0],b=Array.prototype.slice.call(arguments,1),this.hasHandler(a)?this.getHandler(a).apply(this,b):this.storage.addCommand(a,b)},_executeCommands:function(a,c,d){var e=this.storage.getCommands(a);b.each(e.instances,function(a){c.apply(d,a)}),this.storage.clearCommands(a)},_initializeStorage:function(a){var c,d=a.storageType||this.storageType;c=b.isFunction(d)?new d:d,this.storage=c}})}(d),d.RequestResponse=function(a){return a.Handlers.extend({request:function(){var a=arguments[0],b=Array.prototype.slice.call(arguments,1);return this.hasHandler(a)?this.getHandler(a).apply(this,b):void 0}})}(d),d.EventAggregator=function(a,b){var c=function(){};return c.extend=a.Model.extend,b.extend(c.prototype,a.Events),c}(a,b),d.Channel=function(){var c=function(b){this.vent=new a.Wreqr.EventAggregator,this.reqres=new a.Wreqr.RequestResponse,this.commands=new a.Wreqr.Commands,this.channelName=b};return b.extend(c.prototype,{reset:function(){return this.vent.off(),this.vent.stopListening(),this.reqres.removeAllHandlers(),this.commands.removeAllHandlers(),this},connectEvents:function(a,b){return this._connect("vent",a,b),this},connectCommands:function(a,b){return this._connect("commands",a,b),this},connectRequests:function(a,b){return this._connect("reqres",a,b),this},_connect:function(a,c,d){if(c){d=d||this;var e="vent"===a?"on":"setHandler";b.each(c,function(c,f){this[a][e](f,b.bind(c,d))},this)}}}),c}(d),d.radio=function(a){var c=function(){this._channels={},this.vent={},this.commands={},this.reqres={},this._proxyMethods()};b.extend(c.prototype,{channel:function(a){if(!a)throw new Error("Channel must receive a name");return this._getChannel(a)},_getChannel:function(b){var c=this._channels[b];return c||(c=new a.Channel(b),this._channels[b]=c),c},_proxyMethods:function(){b.each(["vent","commands","reqres"],function(a){b.each(d[a],function(b){this[a][b]=e(this,a,b)},this)},this)}});var d={vent:["on","off","trigger","once","stopListening","listenTo","listenToOnce"],commands:["execute","setHandler","setHandlers","removeHandler","removeAllHandlers"],reqres:["request","setHandler","setHandlers","removeHandler","removeAllHandlers"]},e=function(a,b,c){return function(d){var e=a._getChannel(d)[b],f=Array.prototype.slice.call(arguments,1);return e[c].apply(e,f)}};return new c}(d),a.Wreqr}(b,c);var e=a.Marionette,f=b.Marionette={};f.VERSION="2.1.0",f.noConflict=function(){return a.Marionette=e,this},b.Marionette=f,f.Deferred=b.$.Deferred;var g=Array.prototype.slice;return f.extend=b.Model.extend,f.getOption=function(a,b){if(a&&b){var c;return c=a.options&&void 0!==a.options[b]?a.options[b]:a[b]}},f.proxyGetOption=function(a){return f.getOption(this,a)},f.normalizeMethods=function(a){var b={};return c.each(a,function(a,d){c.isFunction(a)||(a=this[a]),a&&(b[d]=a)},this),b},f.normalizeUIKeys=function(a,b){return"undefined"!=typeof a?(c.each(c.keys(a),function(c){var d=/@ui\.[a-zA-Z_$0-9]*/g;c.match(d)&&(a[c.replace(d,function(a){return b[a.slice(4)]})]=a[c],delete a[c])}),a):void 0},f.actAsCollection=function(a,b){var d=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];c.each(d,function(d){a[d]=function(){var a=c.values(c.result(this,b)),e=[a].concat(c.toArray(arguments));return c[d].apply(c,e)}})},f.triggerMethod=function(){function a(a,b,c){return c.toUpperCase()}var b=/(^|:)(\w)/gi,d=function(d){var e,f="on"+d.replace(b,a),g=this[f];return c.isFunction(g)&&(e=g.apply(this,c.tail(arguments))),c.isFunction(this.trigger)&&this.trigger.apply(this,arguments),e};return d}(),f.MonitorDOMRefresh=function(a){function d(a){a._isShown=!0,f(a)}function e(a){a._isRendered=!0,f(a)}function f(a){a._isShown&&a._isRendered&&g(a)&&c.isFunction(a.triggerMethod)&&a.triggerMethod("dom:refresh")}function g(c){return b.$.contains(a,c.el)}return function(a){a.listenTo(a,"show",function(){d(a)}),a.listenTo(a,"render",function(){e(a)})}}(document.documentElement),function(a){function b(a,b,e,f){var g=f.split(/\s+/);c.each(g,function(c){var f=a[c];f||d('Method "'+c+'" was configured as an event handler, but does not exist.'),a.listenTo(b,e,f)})}function e(a,b,c,d){a.listenTo(b,c,d)}function f(a,b,d,e){var f=e.split(/\s+/);c.each(f,function(c){var e=a[c];a.stopListening(b,d,e)})}function g(a,b,c,d){a.stopListening(b,c,d)}function h(a,b,d,e,f){b&&d&&(c.isFunction(d)&&(d=d.call(a)),c.each(d,function(d,g){c.isFunction(d)?e(a,b,g,d):f(a,b,g,d)}))}a.bindEntityEvents=function(a,c,d){h(a,c,d,e,b)},a.unbindEntityEvents=function(a,b,c){h(a,b,c,g,f)},a.proxyBindEntityEvents=function(b,c){return a.bindEntityEvents(this,b,c)},a.proxyUnbindEntityEvents=function(b,c){return a.unbindEntityEvents(this,b,c)}}(f),f.Callbacks=function(){this._deferred=f.Deferred(),this._callbacks=[]},c.extend(f.Callbacks.prototype,{add:function(a,b){var d=c.result(this._deferred,"promise");this._callbacks.push({cb:a,ctx:b}),d.then(function(c){b&&(c.context=b),a.call(c.context,c.options)})},run:function(a,b){this._deferred.resolve({options:a,context:b})},reset:function(){var a=this._callbacks;this._deferred=f.Deferred(),this._callbacks=[],c.each(a,function(a){this.add(a.cb,a.ctx)},this)}}),f.Controller=function(a){this.options=a||{},c.isFunction(this.initialize)&&this.initialize(this.options)},f.Controller.extend=f.extend,c.extend(f.Controller.prototype,b.Events,{destroy:function(){var a=g.call(arguments);return this.triggerMethod.apply(this,["before:destroy"].concat(a)),this.triggerMethod.apply(this,["destroy"].concat(a)),this.stopListening(),this.off(),this},triggerMethod:f.triggerMethod,getOption:f.proxyGetOption}),f.Object=function(a){this.options=c.extend({},c.result(this,"options"),a),this.initialize(this.options)},f.Object.extend=f.extend,c.extend(f.Object.prototype,{initialize:function(){},destroy:function(){this.triggerMethod("before:destroy"),this.triggerMethod("destroy"),this.stopListening()},triggerMethod:f.triggerMethod,getOption:f.proxyGetOption,bindEntityEvents:f.proxyBindEntityEvents,unbindEntityEvents:f.proxyUnbindEntityEvents}),c.extend(f.Object.prototype,b.Events),f.Region=function(a){if(this.options=a||{},this.el=this.getOption("el"),this.el=this.el instanceof b.$?this.el[0]:this.el,this.el||d('An "el" must be specified for a region.',"NoElError"),this.$el=this.getEl(this.el),this.initialize){var c=g.apply(arguments);this.initialize.apply(this,c)}},c.extend(f.Region,{buildRegion:function(a,b){return c.isString(a)?this._buildRegionFromSelector(a,b):a.selector||a.el||a.regionClass?this._buildRegionFromObject(a,b):c.isFunction(a)?this._buildRegionFromRegionClass(a):void d("Improper region configuration type. Please refer to http://marionettejs.com/docs/marionette.region.html#region-configuration-types")},_buildRegionFromSelector:function(a,b){return new b({el:a})},_buildRegionFromObject:function(a,d){var e=a.regionClass||d,f=c.omit(a,"selector","regionClass");a.selector&&!f.el&&(f.el=a.selector);var g=new e(f);return a.parentEl&&(g.getEl=function(d){if(c.isObject(d))return b.$(d);var e=a.parentEl;return c.isFunction(e)&&(e=e()),e.find(d)}),g},_buildRegionFromRegionClass:function(a){return new a}}),c.extend(f.Region.prototype,b.Events,{show:function(a,b){this._ensureElement();var d=b||{},e=a!==this.currentView,f=!!d.preventDestroy,g=!!d.forceShow,h=!!this.currentView,i=!f&&e;i&&this.empty();var j=e||g;return j?(a.once("destroy",c.bind(this.empty,this)),a.render(),h&&this.triggerMethod("before:swap",a),this.triggerMethod("before:show",a),c.isFunction(a.triggerMethod)?a.triggerMethod("before:show"):this.triggerMethod.call(a,"before:show"),this.attachHtml(a),this.currentView=a,h&&this.triggerMethod("swap",a),this.triggerMethod("show",a),c.isFunction(a.triggerMethod)?a.triggerMethod("show"):this.triggerMethod.call(a,"show"),this):this},_ensureElement:function(){c.isObject(this.el)||(this.$el=this.getEl(this.el),this.el=this.$el[0]),this.$el&&0!==this.$el.length||d('An "el" '+this.$el.selector+" must exist in DOM")},getEl:function(a){return b.$(a)},attachHtml:function(a){this.el.innerHTML="",this.el.appendChild(a.el)},empty:function(){var a=this.currentView;if(a)return this.triggerMethod("before:empty",a),this._destroyView(),this.triggerMethod("empty",a),delete this.currentView,this},_destroyView:function(){var a=this.currentView;a.destroy&&!a.isDestroyed?a.destroy():a.remove&&a.remove()},attachView:function(a){return this.currentView=a,this},hasView:function(){return!!this.currentView},reset:function(){return this.empty(),this.$el&&(this.el=this.$el.selector),delete this.$el,this},getOption:f.proxyGetOption,triggerMethod:f.triggerMethod}),f.Region.extend=f.extend,f.RegionManager=function(a){var b=a.Controller.extend({constructor:function(b){this._regions={},a.Controller.call(this,b)},addRegions:function(a,b){c.isFunction(a)&&(a=a.apply(this,arguments));var d={};return c.each(a,function(a,e){c.isString(a)&&(a={selector:a}),a.selector&&(a=c.defaults({},a,b));var f=this.addRegion(e,a);d[e]=f},this),d},addRegion:function(b,d){var e,f=c.isObject(d),g=c.isString(d),h=!!d.selector;return e=g||f&&h?a.Region.buildRegion(d,a.Region):c.isFunction(d)?a.Region.buildRegion(d,a.Region):d,this.triggerMethod("before:add:region",b,e),this._store(b,e),this.triggerMethod("add:region",b,e),e},get:function(a){return this._regions[a]},getRegions:function(){return c.clone(this._regions)},removeRegion:function(a){var b=this._regions[a];return this._remove(a,b),b},removeRegions:function(){var a=this.getRegions();return c.each(this._regions,function(a,b){this._remove(b,a)},this),a},emptyRegions:function(){var a=this.getRegions();return c.each(a,function(a){a.empty()},this),a},destroy:function(){return this.removeRegions(),a.Controller.prototype.destroy.apply(this,arguments)},_store:function(a,b){this._regions[a]=b,this._setLength()},_remove:function(a,b){this.triggerMethod("before:remove:region",a,b),b.empty(),b.stopListening(),delete this._regions[a],this._setLength(),this.triggerMethod("remove:region",a,b)},_setLength:function(){this.length=c.size(this._regions)}});return a.actAsCollection(b.prototype,"_regions"),b}(f),f.TemplateCache=function(a){this.templateId=a},c.extend(f.TemplateCache,{templateCaches:{},get:function(a){var b=this.templateCaches[a];return b||(b=new f.TemplateCache(a),this.templateCaches[a]=b),b.load()},clear:function(){var a,b=g.call(arguments),c=b.length;if(c>0)for(a=0;c>a;a++)delete this.templateCaches[b[a]];else this.templateCaches={}}}),c.extend(f.TemplateCache.prototype,{load:function(){if(this.compiledTemplate)return this.compiledTemplate;var a=this.loadTemplate(this.templateId);return this.compiledTemplate=this.compileTemplate(a),this.compiledTemplate},loadTemplate:function(a){var c=b.$(a).html();return c&&0!==c.length||d('Could not find template: "'+a+'"',"NoTemplateError"),c},compileTemplate:function(a){return c.template(a)}}),f.Renderer={render:function(a,b){a||d("Cannot render the template since its false, null or undefined.","TemplateNotFoundError");var c;return(c="function"==typeof a?a:f.TemplateCache.get(a))(b)}},f.View=b.View.extend({constructor:function(a){c.bindAll(this,"render"),this.options=c.extend({},c.result(this,"options"),c.isFunction(a)?a.call(this):a),this.events=this.normalizeUIKeys(c.result(this,"events")),c.isObject(this.behaviors)&&new f.Behaviors(this),b.View.apply(this,arguments),f.MonitorDOMRefresh(this),this.listenTo(this,"show",this.onShowCalled)},getTemplate:function(){return this.getOption("template")},serializeModel:function(a){return a.toJSON.apply(a,g.call(arguments,1))},mixinTemplateHelpers:function(a){a=a||{};var b=this.getOption("templateHelpers");return c.isFunction(b)&&(b=b.call(this)),c.extend(a,b)},normalizeUIKeys:function(a){var b=c.result(this,"ui"),d=c.result(this,"_uiBindings");return f.normalizeUIKeys(a,d||b)},configureTriggers:function(){if(this.triggers){var a={},b=this.normalizeUIKeys(c.result(this,"triggers"));return c.each(b,function(b,d){var e=c.isObject(b),f=e?b.event:b;a[d]=function(a){if(a){var c=a.preventDefault,d=a.stopPropagation,g=e?b.preventDefault:c,h=e?b.stopPropagation:d;g&&c&&c.apply(a),h&&d&&d.apply(a)}var i={view:this,model:this.model,collection:this.collection};this.triggerMethod(f,i)}},this),a}},delegateEvents:function(a){return this._delegateDOMEvents(a),this.bindEntityEvents(this.model,this.getOption("modelEvents")),this.bindEntityEvents(this.collection,this.getOption("collectionEvents")),this},_delegateDOMEvents:function(a){a=a||this.events,c.isFunction(a)&&(a=a.call(this)),a=this.normalizeUIKeys(a);var d={},e=c.result(this,"behaviorEvents")||{},f=this.configureTriggers();c.extend(d,e,a,f),b.View.prototype.delegateEvents.call(this,d)},undelegateEvents:function(){var a=g.call(arguments);return b.View.prototype.undelegateEvents.apply(this,a),this.unbindEntityEvents(this.model,this.getOption("modelEvents")),this.unbindEntityEvents(this.collection,this.getOption("collectionEvents")),this},onShowCalled:function(){},_ensureViewIsIntact:function(){if(this.isDestroyed){var a=new Error("Cannot use a view thats already been destroyed.");throw a.name="ViewDestroyedError",a}},destroy:function(){if(!this.isDestroyed){var a=g.call(arguments);return this.triggerMethod.apply(this,["before:destroy"].concat(a)),this.isDestroyed=!0,this.triggerMethod.apply(this,["destroy"].concat(a)),this.unbindUIElements(),this.remove(),this}},bindUIElements:function(){if(this.ui){this._uiBindings||(this._uiBindings=this.ui);var a=c.result(this,"_uiBindings");this.ui={},c.each(c.keys(a),function(b){var c=a[b];this.ui[b]=this.$(c)},this)}},unbindUIElements:function(){this.ui&&this._uiBindings&&(c.each(this.ui,function(a,b){delete this.ui[b]},this),this.ui=this._uiBindings,delete this._uiBindings)},triggerMethod:f.triggerMethod,normalizeMethods:f.normalizeMethods,getOption:f.proxyGetOption,bindEntityEvents:f.proxyBindEntityEvents,unbindEntityEvents:f.proxyUnbindEntityEvents}),f.ItemView=f.View.extend({constructor:function(){f.View.apply(this,arguments)},serializeData:function(){var a={};return this.model?a=c.partial(this.serializeModel,this.model).apply(this,arguments):this.collection&&(a={items:c.partial(this.serializeCollection,this.collection).apply(this,arguments)}),a},serializeCollection:function(a){return a.toJSON.apply(a,g.call(arguments,1))},render:function(){return this._ensureViewIsIntact(),this.triggerMethod("before:render",this),this._renderTemplate(),this.bindUIElements(),this.triggerMethod("render",this),this},_renderTemplate:function(){var a=this.getTemplate();if(a!==!1){a||d("Cannot render the template since it is null or undefined.","UndefinedTemplateError");var b=this.serializeData();b=this.mixinTemplateHelpers(b);var c=f.Renderer.render(a,b,this);return this.attachElContent(c),this}},attachElContent:function(a){return this.$el.html(a),this},destroy:function(){return this.isDestroyed?void 0:f.View.prototype.destroy.apply(this,arguments)}}),f.CollectionView=f.View.extend({childViewEventPrefix:"childview",constructor:function(a){var b=a||{};this.sort=c.isUndefined(b.sort)?!0:b.sort,this._initChildViewStorage(),f.View.apply(this,arguments),this._initialEvents(),this.initRenderBuffer()},initRenderBuffer:function(){this.elBuffer=document.createDocumentFragment(),this._bufferedChildren=[]},startBuffering:function(){this.initRenderBuffer(),this.isBuffering=!0},endBuffering:function(){this.isBuffering=!1,this._triggerBeforeShowBufferedChildren(),this.attachBuffer(this,this.elBuffer),this._triggerShowBufferedChildren(),this.initRenderBuffer()},_triggerBeforeShowBufferedChildren:function(){this._isShown&&c.invoke(this._bufferedChildren,"triggerMethod","before:show")},_triggerShowBufferedChildren:function(){this._isShown&&(c.each(this._bufferedChildren,function(a){c.isFunction(a.triggerMethod)?a.triggerMethod("show"):f.triggerMethod.call(a,"show")}),this._bufferedChildren=[])},_initialEvents:function(){this.collection&&(this.listenTo(this.collection,"add",this._onCollectionAdd),this.listenTo(this.collection,"remove",this._onCollectionRemove),this.listenTo(this.collection,"reset",this.render),this.sort&&this.listenTo(this.collection,"sort",this._sortViews))},_onCollectionAdd:function(a){this.destroyEmptyView();var b=this.getChildView(a),c=this.collection.indexOf(a);this.addChild(a,b,c)},_onCollectionRemove:function(a){var b=this.children.findByModel(a);this.removeChildView(b),this.checkEmpty()},onShowCalled:function(){this.children.each(function(a){c.isFunction(a.triggerMethod)?a.triggerMethod("show"):f.triggerMethod.call(a,"show")})},render:function(){return this._ensureViewIsIntact(),this.triggerMethod("before:render",this),this._renderChildren(),this.triggerMethod("render",this),this},resortView:function(){this.render()},_sortViews:function(){var a=this.collection.find(function(a,b){var c=this.children.findByModel(a);return!c||c._index!==b},this);a&&this.resortView()},_renderChildren:function(){this.destroyEmptyView(),this.destroyChildren(),this.isEmpty(this.collection)?this.showEmptyView():(this.triggerMethod("before:render:collection",this),this.startBuffering(),this.showCollection(),this.endBuffering(),this.triggerMethod("render:collection",this))},showCollection:function(){var a;this.collection.each(function(b,c){a=this.getChildView(b),this.addChild(b,a,c)},this)},showEmptyView:function(){var a=this.getEmptyView();if(a&&!this._showingEmptyView){this.triggerMethod("before:render:empty"),this._showingEmptyView=!0;var c=new b.Model;this.addEmptyView(c,a),this.triggerMethod("render:empty")}},destroyEmptyView:function(){this._showingEmptyView&&(this.destroyChildren(),delete this._showingEmptyView)},getEmptyView:function(){return this.getOption("emptyView")},addEmptyView:function(a,b){var d=this.getOption("emptyViewOptions")||this.getOption("childViewOptions");c.isFunction(d)&&(d=d.call(this));var e=this.buildChildView(a,b,d);this._isShown&&this.triggerMethod.call(e,"before:show"),this.children.add(e),this.renderChildView(e,-1),this._isShown&&this.triggerMethod.call(e,"show")},getChildView:function(){var a=this.getOption("childView");return a||d('A "childView" must be specified',"NoChildViewError"),a},addChild:function(a,b,d){var e=this.getOption("childViewOptions");c.isFunction(e)&&(e=e.call(this,a,d));var f=this.buildChildView(a,b,e);return this._updateIndices(f,!0,d),this._addChildView(f,d),f},_updateIndices:function(a,b,c){this.sort&&(b?(a._index=c,this.children.each(function(b){b._index>=a._index&&b._index++})):this.children.each(function(b){b._index>=a._index&&b._index--}))},_addChildView:function(a,b){this.proxyChildEvents(a),this.triggerMethod("before:add:child",a),this.children.add(a),this.renderChildView(a,b),this._isShown&&!this.isBuffering&&(c.isFunction(a.triggerMethod)?a.triggerMethod("show"):f.triggerMethod.call(a,"show")),this.triggerMethod("add:child",a)},renderChildView:function(a,b){return a.render(),this.attachHtml(this,a,b),a},buildChildView:function(a,b,d){var e=c.extend({model:a},d);return new b(e)},removeChildView:function(a){return a&&(this.triggerMethod("before:remove:child",a),a.destroy?a.destroy():a.remove&&a.remove(),this.stopListening(a),this.children.remove(a),this.triggerMethod("remove:child",a),this._updateIndices(a,!1)),a},isEmpty:function(){return!this.collection||0===this.collection.length},checkEmpty:function(){this.isEmpty(this.collection)&&this.showEmptyView()},attachBuffer:function(a,b){a.$el.append(b)},attachHtml:function(a,b,c){a.isBuffering?(a.elBuffer.appendChild(b.el),a._bufferedChildren.push(b)):a._insertBefore(b,c)||a._insertAfter(b)},_insertBefore:function(a,b){var c,d=this.sort&&b<this.children.length-1;return d&&(c=this.children.find(function(a){return a._index===b+1})),c?(c.$el.before(a.el),!0):!1},_insertAfter:function(a){this.$el.append(a.el)},_initChildViewStorage:function(){this.children=new b.ChildViewContainer},destroy:function(){return this.isDestroyed?void 0:(this.triggerMethod("before:destroy:collection"),this.destroyChildren(),this.triggerMethod("destroy:collection"),f.View.prototype.destroy.apply(this,arguments))},destroyChildren:function(){var a=this.children.map(c.identity);return this.children.each(this.removeChildView,this),this.checkEmpty(),a},proxyChildEvents:function(a){var b=this.getOption("childViewEventPrefix");this.listenTo(a,"all",function(){var d=g.call(arguments),e=d[0],f=this.normalizeMethods(c.result(this,"childEvents"));d[0]=b+":"+e,d.splice(1,0,a),"undefined"!=typeof f&&c.isFunction(f[e])&&f[e].apply(this,d.slice(1)),this.triggerMethod.apply(this,d)},this)}}),f.CompositeView=f.CollectionView.extend({constructor:function(){f.CollectionView.apply(this,arguments)},_initialEvents:function(){this.once("render",function(){this.collection&&(this.listenTo(this.collection,"add",this._onCollectionAdd),this.listenTo(this.collection,"remove",this._onCollectionRemove),this.listenTo(this.collection,"reset",this._renderChildren),this.sort&&this.listenTo(this.collection,"sort",this._sortViews))})},getChildView:function(){var a=this.getOption("childView")||this.constructor;return a||d('A "childView" must be specified',"NoChildViewError"),a},serializeData:function(){var a={};return this.model&&(a=c.partial(this.serializeModel,this.model).apply(this,arguments)),a},render:function(){return this._ensureViewIsIntact(),this.isRendered=!0,this.resetChildViewContainer(),this.triggerMethod("before:render",this),this._renderTemplate(),this._renderChildren(),this.triggerMethod("render",this),this},_renderChildren:function(){this.isRendered&&f.CollectionView.prototype._renderChildren.call(this)},_renderTemplate:function(){var a={};a=this.serializeData(),a=this.mixinTemplateHelpers(a),this.triggerMethod("before:render:template");var b=this.getTemplate(),c=f.Renderer.render(b,a,this);this.attachElContent(c),this.bindUIElements(),this.triggerMethod("render:template")},attachElContent:function(a){return this.$el.html(a),this},attachBuffer:function(a,b){var c=this.getChildViewContainer(a);c.append(b)},_insertAfter:function(a){var b=this.getChildViewContainer(this);b.append(a.el)},getChildViewContainer:function(a){if("$childViewContainer"in a)return a.$childViewContainer;var b,e=f.getOption(a,"childViewContainer");if(e){var g=c.isFunction(e)?e.call(a):e;b="@"===g.charAt(0)&&a.ui?a.ui[g.substr(4)]:a.$(g),b.length<=0&&d('The specified "childViewContainer" was not found: '+a.childViewContainer,"ChildViewContainerMissingError")}else b=a.$el;return a.$childViewContainer=b,b},resetChildViewContainer:function(){this.$childViewContainer&&delete this.$childViewContainer}}),f.LayoutView=f.ItemView.extend({regionClass:f.Region,constructor:function(a){a=a||{},this._firstRender=!0,this._initializeRegions(a),f.ItemView.call(this,a)},render:function(){return this._ensureViewIsIntact(),this._firstRender?this._firstRender=!1:this._reInitializeRegions(),f.ItemView.prototype.render.apply(this,arguments)},destroy:function(){return this.isDestroyed?this:(this.regionManager.destroy(),f.ItemView.prototype.destroy.apply(this,arguments))},addRegion:function(a,b){this.triggerMethod("before:region:add",a);var c={};return c[a]=b,this._buildRegions(c)[a]},addRegions:function(a){return this.regions=c.extend({},this.regions,a),this._buildRegions(a)},removeRegion:function(a){return this.triggerMethod("before:region:remove",a),delete this.regions[a],this.regionManager.removeRegion(a)},getRegion:function(a){return this.regionManager.get(a)},getRegions:function(){return this.regionManager.getRegions()},_buildRegions:function(a){var b=this,c={regionClass:this.getOption("regionClass"),parentEl:function(){return b.$el}};return this.regionManager.addRegions(a,c)},_initializeRegions:function(a){var b;this._initRegionManager(),b=c.isFunction(this.regions)?this.regions(a):this.regions||{};var d=this.getOption.call(a,"regions");c.isFunction(d)&&(d=d.call(this,a)),c.extend(b,d),this.addRegions(b)},_reInitializeRegions:function(){this.regionManager.emptyRegions(),this.regionManager.each(function(a){a.reset()})},getRegionManager:function(){return new f.RegionManager},_initRegionManager:function(){this.regionManager=this.getRegionManager(),this.listenTo(this.regionManager,"before:add:region",function(a){this.triggerMethod("before:add:region",a)}),this.listenTo(this.regionManager,"add:region",function(a,b){this[a]=b,this.triggerMethod("add:region",a,b)}),this.listenTo(this.regionManager,"before:remove:region",function(a){this.triggerMethod("before:remove:region",a)}),this.listenTo(this.regionManager,"remove:region",function(a,b){delete this[a],this.triggerMethod("remove:region",a,b)})}}),f.Behavior=function(a,b){function c(b,c){this.view=c,this.defaults=a.result(this,"defaults")||{},this.options=a.extend({},this.defaults,b),this.$=function(){return this.view.$.apply(this.view,arguments)},this.initialize.apply(this,arguments)}return a.extend(c.prototype,b.Events,{initialize:function(){},destroy:function(){this.stopListening()},triggerMethod:f.triggerMethod,getOption:f.proxyGetOption,bindEntityEvents:f.proxyBindEntityEvents,unbindEntityEvents:f.proxyUnbindEntityEvents}),c.extend=f.extend,c}(c,b),f.Behaviors=function(a,b){function c(a,e){e=c.parseBehaviors(a,e||b.result(a,"behaviors")),c.wrap(a,e,b.keys(d))}var d={setElement:function(a,c){return a.apply(this,b.tail(arguments,2)),b.each(c,function(a){a.$el=this.$el,a.el=this.el},this),this},destroy:function(a,c){var d=b.tail(arguments,2);return a.apply(this,d),b.invoke(c,"destroy",d),this},bindUIElements:function(a,c){a.apply(this),b.invoke(c,a)},unbindUIElements:function(a,c){a.apply(this),b.invoke(c,a)},triggerMethod:function(a,c){var d=b.tail(arguments,2);a.apply(this,d),b.each(c,function(b){a.apply(b,d)})},delegateEvents:function(c,d){var e=b.tail(arguments,2);return c.apply(this,e),b.each(d,function(b){a.bindEntityEvents(b,this.model,a.getOption(b,"modelEvents")),a.bindEntityEvents(b,this.collection,a.getOption(b,"collectionEvents"))},this),this},undelegateEvents:function(c,d){var e=b.tail(arguments,2);return c.apply(this,e),b.each(d,function(b){a.unbindEntityEvents(b,this.model,a.getOption(b,"modelEvents")),a.unbindEntityEvents(b,this.collection,a.getOption(b,"collectionEvents"))},this),this},behaviorEvents:function(c,d){var e={},f=b.result(this,"ui");return b.each(d,function(c,d){var g={},h=b.clone(b.result(c,"events"))||{},i=b.result(c,"ui"),j=b.extend({},f,i);h=a.normalizeUIKeys(h,j),b.each(b.keys(h),function(a){var e=new Array(d+2).join(" "),f=a+e,i=b.isFunction(h[a])?h[a]:c[h[a]];g[f]=b.bind(i,c)}),e=b.extend(e,g)}),e}};return b.extend(c,{behaviorsLookup:function(){throw new Error("You must define where your behaviors are stored.See https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.behaviors.md#behaviorslookup")},getBehaviorClass:function(a,d){return a.behaviorClass?a.behaviorClass:b.isFunction(c.behaviorsLookup)?c.behaviorsLookup.apply(this,arguments)[d]:c.behaviorsLookup[d]},parseBehaviors:function(a,d){return b.chain(d).map(function(d,e){var f=c.getBehaviorClass(d,e),g=new f(d,a),h=c.parseBehaviors(a,b.result(g,"behaviors"));return[g].concat(h)}).flatten().value()},wrap:function(a,c,e){b.each(e,function(e){a[e]=b.partial(d[e],a[e],c)})}}),c}(f,c),f.AppRouter=b.Router.extend({constructor:function(a){b.Router.apply(this,arguments),this.options=a||{};var c=this.getOption("appRoutes"),d=this._getController();this.processAppRoutes(d,c),this.on("route",this._processOnRoute,this)},appRoute:function(a,b){var c=this._getController();this._addAppRoute(c,a,b)},_processOnRoute:function(a,b){var d=c.invert(this.getOption("appRoutes"))[a];c.isFunction(this.onRoute)&&this.onRoute(a,d,b)},processAppRoutes:function(a,b){if(b){var d=c.keys(b).reverse();c.each(d,function(c){this._addAppRoute(a,c,b[c])},this)}},_getController:function(){return this.getOption("controller")},_addAppRoute:function(a,b,e){var f=a[e];f||d('Method "'+e+'" was not found on the controller'),this.route(b,e,c.bind(f,a))},getOption:f.proxyGetOption}),f.Application=function(a){this._initializeRegions(a),this._initCallbacks=new f.Callbacks,this.submodules={},c.extend(this,a),this._initChannel()},c.extend(f.Application.prototype,b.Events,{execute:function(){this.commands.execute.apply(this.commands,arguments)},request:function(){return this.reqres.request.apply(this.reqres,arguments)},addInitializer:function(a){this._initCallbacks.add(a)
},start:function(a){this.triggerMethod("before:start",a),this._initCallbacks.run(a,this),this.triggerMethod("start",a)},addRegions:function(a){return this._regionManager.addRegions(a)},emptyRegions:function(){return this._regionManager.emptyRegions()},removeRegion:function(a){return this._regionManager.removeRegion(a)},getRegion:function(a){return this._regionManager.get(a)},getRegions:function(){return this._regionManager.getRegions()},module:function(a,b){var c=f.Module.getClass(b),d=g.call(arguments);return d.unshift(this),c.create.apply(c,d)},getRegionManager:function(){return new f.RegionManager},_initializeRegions:function(a){var b=c.isFunction(this.regions)?this.regions(a):this.regions||{};this._initRegionManager();var d=f.getOption(a,"regions");return c.isFunction(d)&&(d=d.call(this,a)),c.extend(b,d),this.addRegions(b),this},_initRegionManager:function(){this._regionManager=this.getRegionManager(),this.listenTo(this._regionManager,"before:add:region",function(a){this.triggerMethod("before:add:region",a)}),this.listenTo(this._regionManager,"add:region",function(a,b){this[a]=b,this.triggerMethod("add:region",a,b)}),this.listenTo(this._regionManager,"before:remove:region",function(a){this.triggerMethod("before:remove:region",a)}),this.listenTo(this._regionManager,"remove:region",function(a,b){delete this[a],this.triggerMethod("remove:region",a,b)})},_initChannel:function(){this.channelName=c.result(this,"channelName")||"global",this.channel=c.result(this,"channel")||b.Wreqr.radio.channel(this.channelName),this.vent=c.result(this,"vent")||this.channel.vent,this.commands=c.result(this,"commands")||this.channel.commands,this.reqres=c.result(this,"reqres")||this.channel.reqres},triggerMethod:f.triggerMethod,getOption:f.proxyGetOption}),f.Application.extend=f.extend,f.Module=function(a,b,d){this.moduleName=a,this.options=c.extend({},this.options,d),this.initialize=d.initialize||this.initialize,this.submodules={},this._setupInitializersAndFinalizers(),this.app=b,this.startWithParent=!0,c.isFunction(this.initialize)&&this.initialize(a,b,this.options)},f.Module.extend=f.extend,c.extend(f.Module.prototype,b.Events,{initialize:function(){},addInitializer:function(a){this._initializerCallbacks.add(a)},addFinalizer:function(a){this._finalizerCallbacks.add(a)},start:function(a){this._isInitialized||(c.each(this.submodules,function(b){b.startWithParent&&b.start(a)}),this.triggerMethod("before:start",a),this._initializerCallbacks.run(a,this),this._isInitialized=!0,this.triggerMethod("start",a))},stop:function(){this._isInitialized&&(this._isInitialized=!1,this.triggerMethod("before:stop"),c.each(this.submodules,function(a){a.stop()}),this._finalizerCallbacks.run(void 0,this),this._initializerCallbacks.reset(),this._finalizerCallbacks.reset(),this.triggerMethod("stop"))},addDefinition:function(a,b){this._runModuleDefinition(a,b)},_runModuleDefinition:function(a,d){if(a){var e=c.flatten([this,this.app,b,f,b.$,c,d]);a.apply(this,e)}},_setupInitializersAndFinalizers:function(){this._initializerCallbacks=new f.Callbacks,this._finalizerCallbacks=new f.Callbacks},triggerMethod:f.triggerMethod}),c.extend(f.Module,{create:function(a,b,d){var e=a,f=g.call(arguments);f.splice(0,3),b=b.split(".");var h=b.length,i=[];return i[h-1]=d,c.each(b,function(b,c){var g=e;e=this._getModule(g,b,a,d),this._addModuleDefinition(g,e,i[c],f)},this),e},_getModule:function(a,b,d,e){var f=c.extend({},e),g=this.getClass(e),h=a[b];return h||(h=new g(b,d,f),a[b]=h,a.submodules[b]=h),h},getClass:function(a){var b=f.Module;return a?a.prototype instanceof b?a:a.moduleClass||b:b},_addModuleDefinition:function(a,b,c,d){var e=this._getDefine(c),f=this._getStartWithParent(c,b);e&&b.addDefinition(e,d),this._addStartWithParent(a,b,f)},_getStartWithParent:function(a,b){var d;return c.isFunction(a)&&a.prototype instanceof f.Module?(d=b.constructor.prototype.startWithParent,c.isUndefined(d)?!0:d):c.isObject(a)?(d=a.startWithParent,c.isUndefined(d)?!0:d):!0},_getDefine:function(a){return!c.isFunction(a)||a.prototype instanceof f.Module?c.isObject(a)?a.define:null:a},_addStartWithParent:function(a,b,c){b.startWithParent=b.startWithParent&&c,b.startWithParent&&!b.startWithParentIsConfigured&&(b.startWithParentIsConfigured=!0,a.addInitializer(function(a){b.startWithParent&&b.start(a)}))}}),f});
