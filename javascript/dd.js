/**
 * DD Framework: Web Version
 * http://webos.templarian.com
 * 
 * CC Attribution-No Derivative Works 2.0
 * http://creativecommons.org/licenses/by-nd/2.0/
 */
dd = function(o)
{
    return dd.fn.init.call(dd, o);
};
dd.extend = function(o)
{
    for(var i in o)
        this[i] = o[i];
};
dd.extend({
    fn:{
        init:function(o)
        {
            if(typeof o == "object")
            {
                this.fn.e = o;
            }
            else
            {
                if(document.getElementById(o))
                {
                    this.fn.id = o;
                    this.fn.e = document.getElementById(o);
                    if(this.fn.e.tagName.toLowerCase() == "canvas")
                        this.fn.canvas = this.fn.e.getContext('2d');
                }
                else
                {
                    alert("Error: ID '" + o + "' does not exist");
                }
            }
            this.fn.scope = this;
            return this.fn;
        },
        parameters:function(v)
        {
            if(typeof(v) == "undefined")
            {
                if(typeof(this.e._ddParameters) == "undefined")
                    this.e._ddParameters = {};
                return this.e._ddParameters;
            }
            else
            {
                this.e._ddParameters = v;
                return this.e._ddParameters;
            }
        },
        event:function(o, parameters)
        {
            if(parameters)
                this.e._ddParameters = parameters;
            else
                this.e._ddParameters = {};
            var a = {"onLoad":false,
                     "onResize":false,
                     "onClick":false,
                     "onMouseDown":false,
                     "onMouseUp":false,
                     "onMouseMove":false,
                     "onMouseOver":false,
                     "onMouseOut":false,
                     "onScroll":false,
                     "onKeyDown":false,
                     "onKeyUp":false};
            o.scope = this.scope;
            o.scope.extend = function(o)
            {
                for(i in o)
                    this[i] = o[i];
            }
            for(i in a)
            {
                if(o[i] != undefined)
                {
                    a[i] = true;
                    this.e[i.toLowerCase()] = this.eventHandler(o, i);
                }
            }
            // MouseMove requires MouseUp and MouseDown defined
            var e = "onMouseDown";
            if(a["onMouseMove"] && !a[e])
            {
                o[e] = function(){};
                o[e].r = true;
                this.e[e.toLowerCase()] = this.eventHandler(o, e);
            }
            e = "onMouseUp";
            if(a["onMouseMove"] && !a[e])
            {
                o[e] = function(){};
                o[e].r = true;
                this.e[e.toLowerCase()] = this.eventHandler(o, e);
            }
        },
        eventHandler:function(o, type)
        {
            return function(e)
            {
                if(!e)
                    var e = window.event;
                if (e.srcElement)
                    e.target = e.srcElement;
                o.scope.extend(o.scope.fn.eventHandlers[type].call(o.scope.fn, e, this));
                if(!(o.scope.fn.event.clickVoid && type == "onClick"))
                    var r = o[type].call(o.scope);
                else if(type == "onClick")
                    o.scope.fn.event.clickVoid = false;
                return o[type].r == undefined ? r == null ? false : r : o[type].r;
            };
        },
        eventHandlers:{
            onLoad:function(e, ele)
            {
                var r = {
                    parameters:{}
                };
                for(var i in ele._ddParameters)
                    r.parameters[i] = ele._ddParameters[i];
                return r;
            },
            onResize:function(e, ele)
            {
                return {
                    window:{
                        width:window.innerWidth,
                        height:window.innerHeight
                    },
                    width:e.innerWidth,
                    height:e.innerHeight
                };
            },
            onClick:function(e, ele)
            {
                var r = {
                    parameters:{},
                    element:ele,
                    mouse:
                    {
                        x:e.clientX - e.target.offsetLeft + window.scrollX,
                        y:e.clientY - e.target.offsetTop + window.scrollY
                    }
                };
                for(var i in ele._ddParameters)
                    r.parameters[i] = ele._ddParameters[i];
                return r;
            },
            onScroll:function(e, ele)
            {
                var r = {
                    parameters:{},
                    scroll:{
                        x:ele.scrollLeft,
                        y:ele.scrollTop
                    }
                };
                for(var i in ele._ddParameters)
                    r.parameters[i] = ele._ddParameters[i];
                return r;
            },
            onMouseDown:function(e, ele)
            {
                this.event.clickVoid = false;
                this.event.oldX = e.clientX;
                this.event.oldY = e.clientY;
                this.event.currentX = e.clientX;
                this.event.currentY = e.clientY;
                this.event.mouseDown = true;
                var ol = ele.offsetLeft == undefined ? 0 : ele.offsetLeft;
                var ot = ele.offsetTop == undefined ? 0 : ele.offsetTop;
                var r = {
                    mouse:
                    {
                        x:e.clientX + window.scrollX - ol,
                        y:e.clientY + window.scrollY - ot
                    }
                };
                r.target = e.target;
                return r;
            },
            onMouseMove:function(e)
            {
                // Other
                var changeX = e.clientX - this.event.currentX;
                var changeY = e.clientY - this.event.currentY;
                var cX = e.clientX - this.event.oldX;
                var cY = e.clientY - this.event.oldY;
                if(cX !== 0 || cY !== 0)
                    this.event.clickVoid = true;
                this.event.currentX = e.clientX;
                this.event.currentY = e.clientY;
                return {
                    window:{
                        // TODO: Bottom / Top
                        scroll:{
                            top:function(px)
                            {
                                if(typeof(px) == "undefined")
                                {
                                    return window.scrollY;
                                }
                                else
                                {
                                    window.scrollY = px;
                                    return window.scrollY;
                                }
                            },
                            left:function(px)
                            {
                                if(typeof(px) == "undefined")
                                {
                                    return window.scrollX;
                                }
                                else
                                {
                                    window.scrollX = px;
                                    return window.scrollX;
                                }
                            }
                        },
                        width:window.innerWidth,
                        height:window.innerHeight
                    },
                    mouse:
                    {
                        x:e.clientX,
                        y:e.clientY,
                        changeX:changeX,
                        changeY:changeY,
                        pageX:e.pageX,
                        pageY:e.pageY,
                        offsetX:e.clientX - this.event.oldX,
                        offsetY:e.clientY - this.event.oldY,
                        down:this.event.mouseDown
                    }
                };
            },
            onMouseUp:function(e)
            {
                this.event.mouseDown = false;
                return {
                    clientX:e.clientX,
                    clientY:e.clientY,
                    mouse:
                    {
                        offsetX:100,
                        offsetY:200
                    }
                };
            },
            onMouseOver:function(e)
            {
                return {
                    clientX:e.clientX,
                    clientY:e.clientY,
                    mouse:
                    {
                        offsetX:100,
                        offsetY:200
                    }
                };
            },
            onMouseOut:function(e)
            {
                return {
                    clientX:e.clientX,
                    clientY:e.clientY,
                    mouse:
                    {
                        offsetX:100,
                        offsetY:200
                    }
                };
            },
            onKeyDown:function(e)
            {
                var c = String.fromCharCode(e.keyCode);
                if(!e.shiftKey)
                    c = c.toLowerCase();
                return {
                    keyCode:e.keyCode,
                    keyCharacter:c,
                    ctrlKey:e.ctrlKey,
                    altKey:e.altKey
                }
            },
            onKeyUp:function(e)
            {
                var c = String.fromCharCode(e.keyCode);
                if(!e.shiftKey)
                    c = c.toLowerCase();
                return {
                    keyCode:e.keyCode,
                    keyCharacter:c,
                    ctrlKey:e.ctrlKey,
                    altKey:e.altKey
                }
            }
        },
        setAttribute:function(property, value)
        {
            return this.e.setAttribute(property, value);
        },
        /**
         * Set a style
         * @returns {object} dd.fn
         */
        setStyle:function(o)
        {
            for(var i in o)
                this.e.style[i] = o[i];
            return dd.fn;
        },
        /**
         * Remove a style
         * @returns {object} dd.fn
         */
        removeStyle:function(name)
        {
            return dd.fn;
        },
        focus:function()
        {
            this.e.focus();
            return dd.fn;
        },
        selectAll:function()
        {
            this.e.select();
            return dd.fn;
        },
        text:function(s)
        {
            if(typeof(s) == "undefined")
            {
                if(this.e.firstChild)
                    return this.e.firstChild.nodeValue;
                else
                    return "";
            }
            else
            {
                if(this.e.firstChild)
                    this.e.firstChild.nodeValue = s;
                else
                    this.e.appendChild(document.createTextNode(s));
                return this.e.firstChild.nodeValue;
            }
        },
        width:function(px)
        {
            if(typeof(px) == "undefined")
            {
                return this.e.offsetWidth;
            }
            else
            {
                this.e.style.width = px + "px";
                return this.e.offsetWidth;
            }
        },
        height:function(px)
        {
            if(typeof(px) == "undefined")
            {
                return this.e.offsetHeight;
            }
            else
            {
                this.e.style.height = px + "px";
                return this.e.offsetHeight;
            }
        },
        top:function(px)
        {
            if(typeof(px) == "undefined")
            {
                if(this.e.style.top == "")
                    return 0;
                else
                    return parseInt(this.e.style.top.match(/(-?\d+)px/i)[1]);
            }
            else
            {
                this.e.style.top = px + "px";
                return parseInt(this.e.style.top.match(/(-?\d+)px/i)[1]);
            }
        },
        left:function()
        {
            if(typeof(px) == "undefined")
            {
                return this.e.offsetLeft;
            }
            else
            {
                this.e.style.left = px + "px";
                return this.e.offsetLeft;
            }
        },
        opacity:function(i)
        {
            if(typeof(i) == "undefined")
            {
                if(this.e.style.opacity == "")
                    return 1;
                else
                    return parseInt(this.e.style.opacity);
            }
            else
            {
                this.e.zoom = 1;
                this.e.style.filter = "alpha(opacity=" + (i * 100) + ")";
                this.e.style.opacity = i;
                return i;
            }
        },
        addClass:function(name)
        {
            var c = this.e.className.split(/ /);
            c.push(name);
            this.e.className = c.join(" ");
            return this;
        },
        removeClass:function(name)
        {
            var c = this.e.className.split(/ /);
            var nc = [];
            for(var i in c)
                if(c[i] != name)
                    nc.push(c[i]);
            this.e.className = nc.join(" ");
            return this;
        },
        classExists:function(name)
        {
            var c = this.e.className.split(/ /);
            for(var i in c)
                if(c[i] == name)
                    return true;
            return false;
        },
        value:function(v)
        {
            if(typeof(v) == "undefined")
            {
                if(this.e.value)
                    return this.e.value;
                else
                    return "";
            }
            else
            {
                this.e.value = v;
                return this.e.value;
            }
        },
        addElement:function(tag, text, o)
        {
            var e = document.createElement(tag);
            if(typeof(text) == "object")
            {
                for(var i in text)
                {
                    e.setAttribute(i, text[i]);
                }
            }
            else if(typeof(text) == "string")
            {
                if(text != "")
                {
                    e.appendChild(document.createTextNode(text));
                }
            }
            if(o)
            {
                for(var i in o)
                {
                    e.setAttribute(i, o[i]);
                }
            }
            this.e.appendChild(e);
            return e;
        },
        clearElements:function()
        {
            while(this.e.childNodes.length)
                this.e.removeChild(this.e.childNodes[0]);
        },
        /**
         * ToDo: Recode this badly
         */
        ajax:{
            // TODO: Integrated .abort() method
            request:function(o)
            {
                if(o.scope == undefined)
                    o.scope = this;
                if(o.method)
                    o.method = o.method.toUpperCase();
                else
                    o.method = "POST";
                var req;
                if (window.XMLHttpRequest)
                    req = new XMLHttpRequest();
                else if (window.ActiveXObject)
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                req.onreadystatechange = function()
                {
                    if(req.readyState == 4)
                    {
                        if(req.status == 200)
                            o.onSuccess.call(o.scope, {text:req.responseText});
                        else
                            o.onFailure.call(o.scope, {status:req.status,text:req.statusText});
                    }
                };
                var param = "";
                var params = false;
                
                for(i in o.parameters)
                {
                    if(!params)
                    {
                        if(o.method == "POST")
                            param += i + "=" + encodeURIComponent(o.parameters[i]);
                        else
                            param += i + "=" + o.parameters[i];
                        params = true;
                    }
                    else
                    {
                        if(o.method == "POST")
                            param += "&" + i + "=" + encodeURIComponent(o.parameters[i]);
                        else
                            param += "&" + i + "=" + o.parameters[i];
                    }
                }
                
                if(o.method == "POST")
                {
                    req.open("POST", o.url, true);
                }
                else
                {
                    req.open("GET", o.url + "?" + param, true);
                }
                req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                if(o.connection)
                    req.setRequestHeader("Connection", "close");
                if(params && o.method == "POST")
                {
                    req.setRequestHeader("Content-length", param.length);
                    req.send(param);
                }
                else
                {
                    req.setRequestHeader("Connection", "close");
                    req.send(null);
                }
            }
        },
        xml:{
            file:'',
            doc:{},
            remove:function()
            {
                
            },
            parser:function(o)
            {
                var doc = o.doc.childNodes[o.index];
                var xml = [];
                xml.children = [];
                var p = {};
                if(doc.childNodes.length > 0)
                {
                    for(var i = 0; i < doc.childNodes.length; i++)
                    {
                        if(!(/^\s+$/.test(doc.childNodes[i].nodeValue)))
                        {
                            if(doc.childNodes[i].attributes != null)
                            {
                                if(xml[doc.childNodes[i].tagName] == undefined)
                                    xml[doc.childNodes[i].tagName] = [];
                                var n = doc.childNodes[i].tagName;
                                p[n] = isNaN(p[n]) ? 0 : p[n] + 1;
                                xml.children.push({tagName:n, index:p[n]});
                                var d = xml[doc.childNodes[i].tagName].push(this.fn.xml.parser.call(this, {
                                    doc:doc,
                                    index:i
                                }));
                                xml.attributes = [];
                                xml.tagName = doc.childNodes[i].tagName;
                                xml.setAttribute = function(name, value)
                                {
                                    this.attributes[name] = value;
                                }
                                xml.getAttribute = function(name)
                                {
                                    return this.attributes[name];
                                }
                                for(var x = 0; x < doc.attributes.length; x++)
                                    xml.setAttribute(doc.attributes[x].nodeName, doc.attributes[x].nodeValue);
                            }
                            else
                            {
                                xml = {
                                    innerText:doc.childNodes[i].nodeValue == undefined ? null : doc.childNodes[i].nodeValue,
                                    attributes:[],
                                    tagName:doc.childNodes[i].tagName,
                                    setAttribute:function(name, value)
                                    {
                                        this.attributes[name] = value;
                                    },
                                    getAttribute:function(name)
                                    {
                                        return this.attributes[name];
                                    }
                                }
                                for(var x = 0; x < doc.attributes.length; x++)
                                    xml.setAttribute(doc.attributes[x].nodeName, doc.attributes[x].nodeValue);
                            }
                        }
                    }
                }
                else
                {
                    xml = {
                        innerText:"",
                        attributes:[],
                        setAttribute:function(name, value)
                        {
                            this.attributes[name] = value;
                        },
                        getAttribute:function(name)
                        {
                            return this.attributes[name];
                        }
                    }
                    for(var x = 0; x < doc.attributes.length; x++)
                        xml.setAttribute(doc.attributes[x].nodeName, doc.attributes[x].nodeValue);
                }
                return xml;
            }
        }
    },
    ajax:function(o)
    {
        
    },
    addScript:function(file)
    {
        var headID = document.getElementsByTagName("head")[0];         
        var newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.src = file;
        headID.appendChild(newScript);
    },
    removeScript:function(file)
    {
        var headID = document.getElementsByTagName("head")[0].children;
        for(var i in headID)
            if(headID[i].tagName == "SCRIPT")
                if(headID[i].getAttribute('src') == file)
                    headID[i].parentNode.removeChild(headID[i]);
    },
    addStyle:function(file)
    {
        var headID = document.getElementsByTagName("head")[0];         
        var cssNode = document.createElement('link');
        cssNode.type = 'text/css';
        cssNode.rel = 'stylesheet';
        cssNode.href = file;
        cssNode.media = 'screen';
        headID.appendChild(cssNode);
    },
    removeStyle:function(file)
    {
        var headID = document.getElementsByTagName("head")[0].children;
        for(var i in headID)
            if(headID[i].tagName == "LINK")
                if(headID[i].getAttribute('href') == file)
                    headID[i].parentNode.removeChild(headID[i]);
    },
    xml:function(o)
    {
        if(o.id)
            this.fn.xml.id = o.id;
        else
            this.fn.xml.current = o.id;
        this.fn.xml.onSuccess = o.onSuccess;
        this.fn.xml.onFailure = o.onFailure;
        this.fn.ajax.request({
            scope:this,
            url:o.url,
            method:o.method,
            parameters:o.parameters,
            onSuccess:function(o)
            {
                // TODO: Optimise this with 1 regex later on
                var text = o.text.replace(/\w+:\w+=".*?"|<!--.*?-->/g, "");
                if (window.DOMParser)
                {
                    parser = new DOMParser();
                    this.fn.xml.doc = parser.parseFromString(text, "text/xml");
                }
                else
                {
                    var temp = new ActiveXObject("Microsoft.XMLDOM");
                    temp.async="false";
                    temp.loadXML(text);
                    this.fn.xml.doc = {};
                    this.fn.xml.doc.childNodes = [];
                    this.fn.xml.doc.childNodes[0] = temp.childNodes[1];
                }
                
                this.xml[this.fn.xml.id] = this.fn.xml.parser.call(this, {
                    doc:this.fn.xml.doc,
                    index:0
                });
                // Makes references easier.
                this.xml._id[this.fn.xml.id] = true;
                for(var i in this.xml)
                    if(!(i in this.xml._id || i == "extend" || i == "_id"))
                        delete(this.xml[i]);
                this.xml.extend(this.xml[this.fn.xml.id]);
                
                this.fn.xml.onSuccess.call(this, {
                    id:this.fn.xml.id,
                    xml:this.xml[this.fn.xml.id]
                });
                delete(parser);
                delete(this.fn.xml.doc);
            },
            onFailure:function(o)
            {
                if(this.fn.xml.onFailure)
                    this.fn.xml.onFailure.call(this, {
                        status:o.status,
                        text:o.statusText
                    });
                else
                    alert("Warning: Please catch errors with onFailure:function(){/* this.status, this.statusText */}");
            }
        });
    },
    xml:{
        _id:{},
        extend:function(o)
        {
            for(i in o)
                this[i] = o[i];
        }
    },
    preferences:{
        _data:{},
        load:function()
        {
            for(i in this)
            {
                if(i != "save" || i != "load")
                    delete(this[i]);
            }
            var the_cookie = document.cookie.split(';');
            if (the_cookie[0])
            {
                this._data = unescape(the_cookie[0]).parseJSON();
            }
            this.extend(this._data);
            return this._data;
        },
        save:function()
        {
            var d = new Date(2020, 02, 02);
            var p = '/';
            for(i in this)
            {
                if(i != "save" || i != "load")
                    this._data[i] = this[i];
            }
            document.cookie = escape(this._data.toJSONString())
                              + ';path=' + p
                              + ';expires=' + d.toUTCString();
        },
        extend:function(o)
        {
            for(i in o)
                this[i] = o[i];
        }
    },
    _modules:[],
    addModule:function(file)
    {
        var o = file.split(/\./);
        var module = dd;
        for(var j = 0; j < o.length; j++)
        {
            if(typeof(module[o[j]]) == "undefined")
                module[o[j]] = {};
            module = module[o[j]];
        }
        module.extend = function(o)
        {
            for(i in o)
                this[i] = o[i];
        };
        dd.addScript("javascript/dd." + file + ".js");
        dd._modules.push(file);
    },
    _loadModuleCount:0,
    _loadModules:function()
    {
        for(var i = dd._loadModuleCount; i < dd._modules.length; i++)
        {
            var o = dd._modules[i].split(/\./);
            var module = dd;
            for(var j = 0; j < o.length; j++)
                module = module[o[j]];
            if(typeof(module.init) == "undefined")
            {
                dd._loadInterval = setTimeout(dd._loadModules, 200);
                break;
            }
            module.init.call(dd);
            dd._loadModuleCount++;
        }
    },
    _load:function()
    {
        dd.html = document.getElementsByTagName("html")[0];
        dd.html.head = document.getElementsByTagName("head")[0];
        dd.html.body = document.getElementsByTagName("body")[0];
        dd._loadModules();
    }
});
// Initialise
if(window.addEventListener)
    window.addEventListener("load", dd._load, false);
else
    window.attachEvent('onload', dd._load);