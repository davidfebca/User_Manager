// Backbone.Component v0.3.1
// (c) 2015 Oleg Kalistratov, for SourceTalk project (http://sourcetalk.net)
// Distributed Under MIT License

(
    function ( factory ) {
        if ( ( typeof define === "function" ) && ( define.amd ) ) {
            // AMD. Register as an anonymous module.
            define( [ "underscore", "backbone" ] ,
                    factory                      );
        } else {
            // Browser globals
            factory( _, Backbone );
        }
    }(
        function( _, Backbone ) {
            "use strict";

            var namespace          = Backbone.Components;
            var baseViewClass      = Backbone.View;
            var transformHTML      = null;
            var observedSelectors  = { };
            var activeComponents   = { };

            var observe = function( selector, componentClass ) {
                observedSelectors[ selector ] ||
                    ( observedSelectors[ selector ] = componentClass );
            };

            var toComponentClass = function( componentName ) {
                var cls = null;

                if ( _.isArray( namespace ) ) {
                    _.each(
                        namespace ,
                        function( ns ) {
                            cls || ( cls = ns[ componentName ] );
                        }
                    );
                } else {
                    cls = namespace[ componentName ];
                }

                return cls;
            };

            var toClassName = function( componentName  ,
                                        proto          ,
                                        isComponent    ) {
                return _.result( proto , "className" ) || (
                           ( isComponent ? "component-" : "helper-" ) +
                           componentName.
                           replace( /([A-Z])/g, "-$1" ).
                           replace( /^\-+/, "" ).
                           toLowerCase( )
                       );
            };

            var register = function( componentName ) {
                var cls         = toComponentClass( componentName );
                var cmpProto    = cls.prototype;
                var isComponent = cmpProto instanceof Backbone.Component;
                var viewProto   = baseViewClass.prototype;
                var className   = toClassName( componentName ,
                                               cmpProto      ,
                                               isComponent   );
                var selector    = cmpProto.selector || "." + className;

                if ( isComponent ) {
                    observe( selector, cls );
                }

                viewProto[ "insert" + componentName ] = function( ) {
                    var res       = "";
                    var wrapper   =
                        ( _.last( arguments ) || { } )[ "wrapper" ] || { };

                    res = template(
                        {
                            "html"          :
                              cmpProto.template.apply( cmpProto  ,
                                                       arguments ) ,
                            "tagName"       :
                              ( _.result( cmpProto, "tagName" )  ||
                                "span"                           ) ,
                            "className"     :
                              ( ( wrapper[ "htmlClass" ] || "" ) +
                                " "                              +
                                className                        ) ,
                            "id"            :
                              ( wrapper[ "htmlId" ]              ||
                                _.result( cmpProto, "id" )       ||
                                _.uniqueId( className + "-" )    )
                        }
                    );

                    if ( _.isFunction( transformHTML ) ) {
                        res = transformHTML.call( this, res );
                    }

                    return res;
                };
            };

            var componentObserver = new MutationObserver(
                function( mutations ) {
                    // First, look for untracked elements
                    _.each(
                        observedSelectors ,
                        function( componentClass, selector ) {
                            var elements =
                                document.querySelectorAll(
                                    selector + ":not(.component-active)"
                                );

                            _.each(
                                elements ,
                                function( el ) {
                                    var component = new componentClass;
                                    var id        = _.uniqueId( "component-" );

                                    component.cid = id;
                                    component.setElement( el );
                                    component.initialize( );
                                    activeComponents[ id ] = component;
                                    el.className += " component-active";
                                    el.setAttribute( "data-component-id", id );
                                }
                            );
                        }
                    );

                    // Now, look for removed elements
                    _.each(
                        activeComponents ,
                        function( component ) {
                            var el = component.el;

                            if ( !document.body.contains( el ) ) {
                                el.setAttribute( "data-component-id" ,
                                                 null                );
                                el.className =
                                    _.chain( el.className.split( /\s/ ) ).
                                    compact( ).
                                    without( "component-active" ).
                                    value( ).
                                    join( " " );
                                component.undelegateEvents( );
                                component.stopListening( );
                                component.remove( );
                                component.el = null;
                                delete activeComponents[ component.cid ];
                            }
                        }
                    );
                }
            );

            var template = _.template(
                "<<%= tagName %> class=\"<%= className %>\" id=\"<%= id %>\">" +
                "<%= html %>"                                                  +
                "</<%= tagName %>>"
            );

            Backbone.Helper = function( ) { };

            _.extend(
                Backbone.Helper.prototype ,
                {
                    template:   function( ) {
                        return "";
                    }
                }
            );

            Backbone.Helper.extend = Backbone.Model.extend;

            Backbone.Component = Backbone.Helper.extend(
                {
                    initialize: function( ) {
                    } ,

                    remove:     function( ) {
                    }
                }
            );

            _.extend(
                Backbone.Component.prototype ,
                Backbone.Events              ,
                _.pick(
                    Backbone.View.prototype ,
                    "$"                     ,
                    "setElement"            ,
                    "_setElement"           ,
                    "delegate"              ,
                    "delegateEvents"        ,
                    "undelegate"            ,
                    "undelegateEvents"
                )
            );

            Backbone.Component.VERSION  = "0.3.0";

            Backbone.Component.initialize = function( options ) {
                var initNS = function( ns ) {
                    _.each(
                        ns ,
                        function( v, k ) {
                            if ( ( typeof( v ) === "function"             ) &&
                                 ( v.prototype instanceof Backbone.Helper ) ) {
                                register( k );
                            };
                        }
                    );
                };

                options || ( options = { } );

                namespace     = options[ "namespace"     ] || namespace;
                baseViewClass = options[ "baseViewClass" ] || baseViewClass;
                transformHTML = options[ "transformHTML" ] || transformHTML;

                if ( _.isArray( namespace ) ) {
                    _.each( namespace, initNS );
                } else {
                    initNS( namespace );
                }

                componentObserver.observe(
                    document.body ,
                    {
                        "childList" : true ,
                        "subtree"   : true
                    }
                );
            };
        }
    )
);
