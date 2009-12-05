/**
 * http://webos.templarian.com
 * DD Framework (c) 2009
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
dd.fn = {
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
    get parameters()
    {
        if(typeof(this.e._ddParameters) == "undefined")
            this.e._ddParameters = {};
        return this.e._ddParameters;
    },
    set parameters(v)
    {
        this.e._ddParameters = v;
        return this.e._ddParameters;
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
                        get top()
                        {
                            return window.scrollY;
                        },
                        set top(v)
                        {
                            window.scrollY = v;
                            return window.scrollY;
                        },
                        get left()
                        {
                            return window.scrollX;
                        },
                        set left(v)
                        {
                            window.scrollX = v;
                            return window.scrollX;
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
    get display()
    {
        if(this.e.style.display)
            return this.e.style.display;
        else
            return "block";
    },
    set display(v)
    {
        this.e.style.display = v;
        return this.e.style.display;
    },
    get scrollTop()
    {
        return this.e.scrollTop;
    },
    set scrollTop(v)
    {
        this.e.scrollTop = v;
        return this.e.scrollTop;
    },
    get text()
    {
        if(this.e.firstChild)
            return this.e.firstChild.nodeValue;
        else
            return "";
    },
    set text(s)
    {
        if(this.e.firstChild)
            this.e.firstChild.nodeValue = s;
        else
            this.e.appendChild(document.createTextNode(s));
        return this.e.firstChild.nodeValue;
    },
    get width()
    {
        return this.e.offsetWidth;
    },
    set width(w)
    {
        this.e.style.width = w + "px";
        return this.e.offsetWidth;
    },
    get height()
    {
        return this.e.offsetHeight;
    },
    set height(h)
    {
        this.e.style.height = h + "px";
        return this.e.offsetHeight;
    },
    get top()
    {
        if(this.e.style.top == "")
            return 0;
        else
            return parseInt(this.e.style.top.match(/(-?\d+)px/i)[1]);
    },
    set top(t)
    {
        this.e.style.top = t + "px";
        return parseInt(this.e.style.top.match(/(-?\d+)px/i)[1]);
    },
    get left()
    {
        return this.e.offsetLeft;
    },
    set left(l)
    {
        this.e.style.left = l + "px";
        return this.e.offsetLeft;
    },
    get opacity()
    {
        if(this.e.style.opacity == "")
            return 1;
        else
            return parseInt(this.e.style.opacity);
    },
    set opacity(v)
    {
        this.e.style.opacity = v;
        return parseInt(this.e.style.opacity);
    },
    get className()
    {
        return this.e.style.className;
    },
    set className(n)
    {
        this.e.className = n;
        return this.e.className;
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
    get value()
    {
        if(this.e.value)
            return this.e.value;
        else
            return "";
    },
    set value(v)
    {
        this.e.value = v;
        return this.e.value;
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
    toggle:function(o)
    {
        var nia = true;
        for(var i in o.value)
            if(o.value[i] == this.text)
                nia = false;
        for(var i = 0; i<= o.value.length; i++)
        {
            if(i == o.value.length - 1 || nia)
            {
                this.text = o.value[0];
            }
            else if(o.value[i] == this.text)
            {
                this.text = o.value[i + 1];
                break;
            }
        }
    },
    sprite:function(o)
    {
        
    },
    animate:function(o)
    {
        o.scope = this;
        o.duration = o.duration / 10;
        o.frame = [];
        var type = ["width", "height", "left"];
        for(t in type)
        {
            if(o[type[t]])
            {
                if(o[type[t]] != this[type[t]])
                {
                    var diff = o[type[t]] - this[type[t]];
                    if(diff < 0)
                        var each = Math.ceil((o[type[t]] - this[type[t]]) / o.duration);
                    else
                        var each = Math.floor((o[type[t]] - this[type[t]]) / o.duration);
                    var mod = (o[type[t]] - this[type[t]]) % o.duration;
                    for(var i = 0; i < o.duration; i++)
                    {
                        if(!o.frame[i])
                            o.frame[i] = {};
                        o.frame[i][type[t]] = each;
                    }
                    if(!o.frame[o.duration])
                            o.frame[o.duration] = {};
                    o.frame[o.duration][type[t]] = mod;
                }
                else
                {
                    delete o[type[t]];
                }
            }
        }
        if(o.width || o.height || o.left)
        {
            var timers = [];
            for (var i = 0; i <= o.duration; i++)
            {
                timers[i] = function(o)
                {
                    setTimeout(this.animateHandler, 10 * (i + 1), o, i);
                }
                timers[i].call(this, o)
            }
        }
    },
    animateHandler:function(o, key)
    {
        if(o.height)
            o.scope.height += o.frame[key].height;
        if(o.width)
            o.scope.width += o.frame[key].width;
        if(o.left)
            o.scope.left += o.frame[key].left;
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
            var req = new XMLHttpRequest();
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
                // XML PARSED ONE DEEPER THAN EXPECTED PARENT MAYBE?
                /*xml.children = [];
                var p = {};
                for(var i = 0; i < doc.childNodes.length; i++)
                {
                    if(doc.childNodes[i].nodeValue == null)//if(!(/^\s+$/.test(doc.childNodes[i].nodeValue)))
                    {
                        var n = doc.childNodes[i].tagName;
                        p[n] = isNaN(p[n]) ? 0 : p[n] + 1;
                        xml.children.push(xml[n][p[n]]);
                    }
                }*/
                /*
                for(var i = 0; i < doc.childNodes.length; i++)
                {
                    if(doc.childNodes[i].nodeValue == null)//if(!(/^\s+$/.test(doc.childNodes[i].nodeValue)))
                    {
                        var n = doc.childNodes[i].tagName;
                        p[n] = isNaN(p[n]) ? 0 : p[n] + 1;
                        xml.children.push(xml[n][p[n]]);
                    }
                }*/
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
    },
    drawImage:function(image, x, y, width, height)
    {
        if(!width)
            width = image.width;
        if(!height)
            height = image.height;
        this.canvas.drawImage(image, 0, 0, width, height, x, y, width, height);
    },
    drawText:function(text, x, y)
    {
        dd(document.body).addElement({
            tag:"span",
            text:"lol"
        });
    },
    // Not supported yet
    getImageData:function(x, y)
    {
        var oDataSrc = this.canvas.getImageData(0,0,32,32);
        var aDataSrc = oDataSrc.data;
        var iOffset = y + (x-1)*4;
	
        var iR = aDataSrc[iOffset];
        var iG = aDataSrc[iOffset+1];
        var iB = aDataSrc[iOffset+2];
        dd("output").addElement({
            tag:"li",
            text:"color: " + iR + ", " + iG + ", " + iB
        });
    },
    dot:function(x, y)
    {
        var i = new Image();
        i.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9YGARc5KB0XV+IAAAAddEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIFRoZSBHSU1Q72QlbgAAAF1JREFUGNO9zL0NglAAxPEfdLTs4BZM4DIO4C7OwQg2JoQ9LE1exdlYvBBeZ7jqch9//q1uH4TLzw4d6+ErXMMcXuHWxId3KOETnnXXV6MJpcq2MLaI97CER3N0vr4MkhoXe0rZigAAAABJRU5ErkJggg==";
        dd.images.dot = {loaded:false};
        i.onload = function()
        {
            dd.images.dot = this;
            dd.images.dot.loaded = true;
            dd.fn.canvas.drawImage(dd.images.dot, 0, 0, 10, 10, x, y, 10, 10);
        };
        
    }
};
dd.image = function(o)
{
    var i = new Image();
    i.src = o.url;
    dd.images[o.id] = {loaded:false};
    i.onload = function()
    {
        dd.images[o.id] = this;
        dd.images[o.id].loaded = true;
    };
};
dd.images = {};
dd.ajax = function(o)
{
    
};
dd.math = {
    random:function(o)
    {
        return Math.floor((o.max - o.min - 1) * Math.random()) + o.min;
    }
};
dd.screen = {
    get width()
    {
        return window.availWidth;
    },
    get height()
    {
        return window.availHeight;
    }
};
dd.addScript = function(file)
{
    var headID = document.getElementsByTagName("head")[0];         
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = file;
    headID.appendChild(newScript);
};
dd.removeScript = function(file)
{
    var headID = document.getElementsByTagName("head")[0].children;
    for(var i in headID)
        if(headID[i].tagName == "SCRIPT")
            if(headID[i].getAttribute('src') == file)
                headID[i].parentNode.removeChild(headID[i]);
};
dd.addStyle = function(file)
{
    var headID = document.getElementsByTagName("head")[0];         
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.href = file;
    cssNode.media = 'screen';
    headID.appendChild(cssNode);
};
dd.removeStyle = function(file)
{
    var headID = document.getElementsByTagName("head")[0].children;
    for(var i in headID)
        if(headID[i].tagName == "LINK")
            if(headID[i].getAttribute('href') == file)
                headID[i].parentNode.removeChild(headID[i]);
};
dd.xml = function(o)
{
    if(o.id)
        this.fn.xml.id = o.id;
    else
        this.fn.xml.current = o.id;
    // Change to Remove Tags array later on
    if(o.removeStyle){this.fn.xml.removeStyle = o.removeStyle;}else{this.fn.xml.removeStyle = false;}
    if(o.removeScript){this.fn.xml.removeScript = o.removeScript;}else{this.fn.xml.removeScript = false;}
    if(o.removeScript){this.fn.xml.removeMeta = o.removeMeta;}else{this.fn.xml.removeMeta = false;}
    if(o.removeLink){this.fn.xml.removeLink = o.removeLink;}else{this.fn.xml.removeLink = false;}
    if(o.removeInput){this.fn.xml.removeInput = o.removeInput;}else{this.fn.xml.removeInput = false;}
    if(o.removeImg){this.fn.xml.removeImg = o.removeImg;}else{this.fn.xml.removeImg = false;}
    if(o.fixXHTML){this.fn.xml.fixXHTML = o.fixXHTML;}else{this.fn.xml.fixXHTML = false;}
    this.fn.xml.onSuccess = o.onSuccess;
    this.fn.xml.onFailure = o.onFailure;
    this.fn.ajax.request({
        scope:this,
        url:o.url,
        method:o.method,
        parameters:o.parameters,
        onSuccess:function(o)
        {
            var parser = new DOMParser();
            // TODO: Optimise this with 1 regex later on
            var text = o.text.replace(/\w+:\w+=".*?"|<!--.*?-->/g, "");
            text = text.replace(/<\?xml-stylesheet([^\?]*?)\?>/img, "");
            if(this.fn.xml.removeStyle)
                text = text.replace(/<(style)([\s\S]*?)<\/\1>/img, "");
            if(this.fn.xml.removeScript)
                text = text.replace(/<(script)([\s\S]*?)<\/\1>/img, "");
            if(this.fn.xml.removeMeta)
                text = text.replace(/<meta([\s\S]*?)>/img, "");
            if(this.fn.xml.removeLink)
                text = text.replace(/<link([\s\S]*?)>/img, "");
            if(this.fn.xml.removeInput)
                text = text.replace(/<input([\s\S]*?)>/img, "");
            if(this.fn.xml.removeImg)
                text = text.replace(/<img([\s\S]*?)>/img, "");
            if(this.fn.xml.fixXHTML)
            {
                text = text.replace(/<br(\s+)?>/img, "<br />");
                text.replace(/onmouseover="([^"]*)"/img,
                function($1)
                {
                    return 'onmouseover="' + encodeURIComponent($1) + '"';
                });
                text.replace(/onmouseout="([^"]*)"/img,
                function($1)
                {
                    return 'onmouseout="' + encodeURIComponent($1) + '"';
                });
            }
            this.fn.xml.doc = parser.parseFromString(text, "text/xml");
            
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
};
dd.xml._id = {};
dd.xml.extend = function(o)
{
    for(i in o)
        this[i] = o[i];
};
dd.preferences = {
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
    }
}
dd.preferences.extend = function(o)
{
    for(i in o)
        this[i] = o[i];
};
dd._modules = [];
dd.addModule = function(file)
{
    dd.addScript("javascript/dd." + file + ".js");
    dd._modules.push(file);
};
dd._loadModuleCount = 0;
dd._loadModules = function()
{
    for(var i = dd._loadModuleCount; i < dd._modules.length; i++)
    {
        var o = dd._modules[i].split(/\./);
        var module = dd;
        for(var j in o)
            if(typeof(o[j]) == "string")
                module = module[o[j]];
        if(typeof(module) == "undefined")
        {
            dd._loadInterval = setTimeout(dd._loadModules, 200);
            break;
        }
        module.init.call(dd);
        dd._loadModuleCount++;
    }
}
dd._load = function()
{
    dd.html = document.getElementsByTagName("html")[0];
    dd.html.head = document.getElementsByTagName("head")[0];
    dd.html.body = document.getElementsByTagName("body")[0];
    dd._loadModules();
};
// Initialise
window.addEventListener("load", dd._load, false);

// JSON
if(!this.JSON){
this.JSON={};
}
(function(){
function f(n){
return n<10?'0'+n:n;
}
if(typeof Date.prototype.toJSON!=='function'){
Date.prototype.toJSON=function(key){
return isFinite(this.valueOf())?
this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;
};
String.prototype.toJSON=
Number.prototype.toJSON=
Boolean.prototype.toJSON=function(key){
return this.valueOf();
};
}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
gap,
indent,
meta={
'\b':'\\b',
'\t':'\\t',
'\n':'\\n',
'\f':'\\f',
'\r':'\\r',
'"':'\\"',
'\\':'\\\\'
},
rep;
function quote(string){
escapable.lastIndex=0;
return escapable.test(string)?
'"'+string.replace(escapable,function(a){
var c=meta[a];
return typeof c==='string'?c:
'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);
})+'"':
'"'+string+'"';
}
function str(key,holder){
var i,
k,
v,
length,
mind=gap,
partial,
value=holder[key];
if(value&&typeof value==='object'&&
typeof value.toJSON==='function'){
value=value.toJSON(key);
}
if(typeof rep==='function'){
value=rep.call(holder,key,value);
}
switch(typeof value){
case'string':
return quote(value);
case'number':
return isFinite(value)?String(value):'null';
case'boolean':
case'null':
return String(value);
case'object':
if(!value){
return'null';
}
gap+=indent;
partial=[];
if(Object.prototype.toString.apply(value)==='[object Array]'){
length=value.length;
for(i=0;i<length;i+=1){
partial[i]=str(i,value)||'null';
}
v=partial.length===0?'[]':
gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':
'['+partial.join(',')+']';
gap=mind;
return v;
}
if(rep&&typeof rep==='object'){
length=rep.length;
for(i=0;i<length;i+=1){
k=rep[i];
if(typeof k==='string'){
v=str(k,value);
if(v){
partial.push(quote(k)+(gap?': ':':')+v);
}
}
}
}else{
for(k in value){
if(Object.hasOwnProperty.call(value,k)){
v=str(k,value);
if(v){
partial.push(quote(k)+(gap?': ':':')+v);
}
}
}
}
v=partial.length===0?'{}':
gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';
gap=mind;
return v;
}
}
if(typeof JSON.stringify!=='function'){
JSON.stringify=function(value,replacer,space){
var i;
gap='';
indent='';
if(typeof space==='number'){
for(i=0;i<space;i+=1){
indent+=' ';
}
}else if(typeof space==='string'){
indent=space;
}
rep=replacer;
if(replacer&&typeof replacer!=='function'&&
(typeof replacer!=='object'||
typeof replacer.length!=='number')){
throw new Error('JSON.stringify');
}
return str('',{'':value});
};
}
if(typeof JSON.parse!=='function'){
JSON.parse=function(text,reviver){
var j;
function walk(holder,key){
var k,v,value=holder[key];
if(value&&typeof value==='object'){
for(k in value){
if(Object.hasOwnProperty.call(value,k)){
v=walk(value,k);
if(v!==undefined){
value[k]=v;
}else{
delete value[k];
}
}
}
}
return reviver.call(holder,key,value);
}
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').
replace(/(?:^|:|,)(?:\s*\[)+/g,''))){
j=eval('('+text+')');
return typeof reviver==='function'?
walk({'':j},''):j;
}
throw new SyntaxError('JSON.parse');
};
}
}());