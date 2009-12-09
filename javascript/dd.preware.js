dd.preware.extend({
    init:function()
    {
        dd(dd.html.body).clearElements();
        var o = dd(dd.html.body).addElement("div", {
            "id":"loading"
        });
        var l = dd(o).addElement("div", {
            "class":"center"
        });
        var c = dd(l).addElement("div");
        dd(c).addElement("h1", "Loading Page");
        dd(c).addElement("p", "The site content and package feeds are loading.");
        dd("loading").height(window.innerHeight);
        this.preware.animateFadeOut();
        this.preware.page.extend = function(o)
        {
            for(i in o)
                this[i] = o[i];
        };
    },
    animateFadeOut:function()
    {
        var o = [1, 1, 1, 1, 1, 1, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0];
        for(var i in o)
        {
            setTimeout((function(t){dd.preware.animateOverlayHandle(t);})(o[i]), i * 50);
        }
    },
    animateOverlayHandle:function(o)
    {
        dd("loading").opacity(o);
        if(o == 0)
            dd.preware.page("index");
    },
    scripts:[],
    styles:[],
    page:function(page, parameters)
    {
        if(typeof(page) == "string")
        {
            if(typeof(parameters) == "undefined")
                var parameters = {};
            dd.xml({
                url: "page/" + page + "/" + page + ".xml",
                id:"_page",
                method:"GET",
                parameters:{r:Math.ceil(Math.random() * 9999)},
                onSuccess:function()
                {
                    window.location = "#/" + page + "/"
                    this.preware.page._current = page;
                    this(this.html.body).clearElements();
                    for(var i in this.preware.styles)
                        this.removeStyle(this.preware.styles[i]);
                    this.preware.styles = [];
                    for(var i in this.preware.scripts)
                        this.removeScript(this.preware.scripts[i]);
                    this.preware.scripts = [];
                    // Add Styles
                    for(var i in this.xml.style)
                    {
                        this.preware.styles.push(this.xml.style[i].getAttribute("src"));
                        this.addStyle(this.xml.style[i].getAttribute("src"));
                    }
                    // Add Content
                    // - Background
                    this(this.html.body).e.style.background = "url(images/background.png) center top repeat-y #AFAFA8";
                    // - Fixed Header
                    var s = this(this.html.body).addElement("div", {"class":"main"});
                    var h = this(s).addElement("div", {"class":"header"});
                    var ha = this(h).addElement("div", {"class":"advertisement"});
                    /*this(ha).addElement("script", {
                        "type":"text/javascript",
                        "src":"http://pagead2.googlesyndication.com/pagead/show_ads.js"
                    });*/
                    var img = this(ha).addElement("a", {
                        "href":"http://webos-internals.org/",
                        "style":"padding: 15px 0 0 10px; display: block;"
                    });
                    this(img).addElement("img", {
                        "src":"images/temp_ad.png",
                        "style":"border:none;"
                    });
                    this(h).addElement("img", {"src":"images/logo.png"});
                    this.preware._dom.call(this, s, this.xml.body[0]);
                    this.preware.page.properties = parameters;
                    var f = this(s).addElement("div", {"class":"footer"});
                    this(f).addElement("span", "Copyright Preware.org");
                    this(f).addElement("a", "View Page Source", {"href":"page/" + page + "/" + page + ".xml"});
                    // Add Scripts
                    for(var i in this.xml.script)
                    {
                        this.preware.scripts.push(this.xml.script[i].getAttribute("src"));
                        this.addScript(this.xml.script[i].getAttribute("src"));
                    }
                },
                onFailure:function()
                {
                    dd(this.html.body).addElement("div", "Invalid XML page");
                }
            });
        }
        else if(typeof(page) == "object")
        {
            this.page.extend(page);
            this.page.setup.call(this);
        }
    },
    _dom:function(e, xml)
    {
        var tags = xml.children;
        for(var i in tags)
        {
            if(this.preware._customTags[tags[i].tagName] != undefined)
            {
                if(typeof(xml[tags[i].tagName][tags[i].index].innerText) == undefined)
                    var ne = this.preware._customTags[tags[i].tagName].func.call(this, e, "", xml[tags[i].tagName][tags[i].index].attributes);
                else
                    var ne = this.preware._customTags[tags[i].tagName].func.call(this, e, xml[tags[i].tagName][tags[i].index].innerText, xml[tags[i].tagName][tags[i].index].attributes);
            }
            else
            {
                if(typeof(xml[tags[i].tagName][tags[i].index].innerText) == undefined)
                    var ne = this(e).addElement(tags[i].tagName, "");
                else
                    var ne = this(e).addElement(tags[i].tagName, xml[tags[i].tagName][tags[i].index].innerText, xml[tags[i].tagName][tags[i].index].attributes);
            }
            if(typeof(xml[tags[i].tagName][tags[i].index].children) != undefined)
                this.preware._dom.call(this, ne, xml[tags[i].tagName][tags[i].index]);
        }
    },
    _customTags:{},
    addCustomTag:function(tag, func)
    {
        this._customTags[tag] = {
            "tag":tag,
            "func":func
        };
    }
});