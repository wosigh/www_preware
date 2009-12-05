dd.preware.tags = {
    init:function()
    {
        // Screenshot
        this.preware.addCustomTag("screenshots",
            function(ele, text, attributes){
                var s = this(ele).addElement("div", {"class":"viewer"});
                var t = this(s).addElement("div", {"class":"viewer-title"});
                var ti = this(t).addElement("div", {"class":"viewer-title-left"});
                var prev = this(ti).addElement("a", {"href":"#","class":"viewer-previous-disabled"});
                var next = this(ti).addElement("a", {"href":"#","class":"viewer-next-disabled"});
                var label = this(ti).addElement("div", attributes["label"], {"class":"viewer-title-right"});
                var r = this(s).addElement("div", {"class":"viewer-content"});
                this(r).parameters.screenshots = [];
                this(r).parameters.screenshotPrev = prev;
                this(r).parameters.screenshotNext = next;
                this(r).parameters.labelText = attributes["label"];
                this(r).parameters.label = label;
                var b = this(s).addElement("div", {"class":"viewer-bottom"});
                var bi = this(b).addElement("div", {"class":"viewer-bottom-left"});
                this(bi).addElement("div", {"class":"viewer-bottom-right"});
                this(next).event({
                    onClick:function()
                    {
                        var totalScreenshots = dd(this.parameters.container).parameters.totalScreenshots;
                        var currentScreenshot = dd(this.parameters.container).parameters.currentScreenshot;
                        var next = this.parameters.next;
                        var prev = this.parameters.prev;
                        var labelText = this.parameters.labelText;
                        var label = this.parameters.label;
                        if(totalScreenshots > currentScreenshot)
                        {
                            dd(this.parameters.container).clearElements();
                            dd(this.parameters.container).parameters.currentScreenshot++;
                            currentScreenshot++;
                            dd(this.parameters.container).addElement("img",
                                {"src":this(this.parameters.container).parameters.screenshots[currentScreenshot]});
                            dd(prev).removeClass("viewer-previous-disabled").addClass("viewer-previous");
                            if(totalScreenshots == currentScreenshot)
                            {
                                dd(next).removeClass("viewer-next").addClass("viewer-next-disabled");
                            }
                            dd(label).text = labelText + " (" + (currentScreenshot + 1) + " of " + (totalScreenshots + 1) + ")";
                        }
                    }
                }, {"container":r,"next":next,"prev":prev,"label":label,"labelText":attributes["label"]});
                this(prev).event({
                    onClick:function()
                    {
                        var totalScreenshots = dd(this.parameters.container).parameters.totalScreenshots;
                        var currentScreenshot = dd(this.parameters.container).parameters.currentScreenshot;
                        var next = this.parameters.next;
                        var prev = this.parameters.prev;
                        var labelText = this.parameters.labelText;
                        var label = this.parameters.label;
                        if(currentScreenshot > 0)
                        {
                            dd(this.parameters.container).clearElements();
                            dd(this.parameters.container).parameters.currentScreenshot--;
                            currentScreenshot--;
                            dd(this.parameters.container).addElement("img",
                                {"src":this(this.parameters.container).parameters.screenshots[currentScreenshot]});
                            dd(next).removeClass("viewer-next-disabled").addClass("viewer-next");
                            if(currentScreenshot == 0)
                            {
                                dd(prev).removeClass("viewer-previous").addClass("viewer-previous-disabled");
                            }
                            dd(label).text = labelText + " (" + (currentScreenshot + 1) + " of " + (totalScreenshots + 1) + ")";
                        }
                    }
                }, {"container":r,"next":next,"prev":prev,"label":label,"labelText":attributes["label"]});
                return r;
            });
        this.preware.addCustomTag("screenshot",
            function(ele, text, attributes){
                this(ele).parameters.screenshots.push(attributes["src"]);
                if(this(ele).parameters.screenshots.length == 1)
                {
                    this(ele).addElement("img", {"src":this(ele).parameters.screenshots[0]});
                    this(ele).parameters.currentScreenshot = 0;
                }
                else if(this(ele).parameters.screenshots.length == 2)
                {
                    var next = this(ele).parameters.screenshotNext;
                    this(next).removeClass("viewer-next-disabled").addClass("viewer-next");
                }
                this(ele).parameters.totalScreenshots = this(ele).parameters.screenshots.length - 1;
                var totalScreenshots = this(ele).parameters.totalScreenshots;
                var currentScreenshot = this(ele).parameters.currentScreenshot;
                var labelText = this(ele).parameters.labelText;
                var label = this(ele).parameters.label;
                dd(label).text = labelText + " (" + (currentScreenshot + 1) + " of " + (totalScreenshots + 1) + ")";
                return ele;
            });
        // Inline Screenshot
        this.preware.addCustomTag("inlinescreenshot",
            function(ele, text, attributes){
                var i = this(ele).addElement("div", {"class":"inline-screenshot"});
                var r = this(i).addElement("img", {"src":attributes["src"]});
                return r;
            });
        // Left Column
        this.preware.addCustomTag("left",
            function(ele, text, attributes){
                var r = this(ele).addElement("div", {"class":"left"});
                return r;
            });
        // Right Column
        this.preware.addCustomTag("right",
            function(ele, text, attributes){
                var r = this(ele).addElement("div", {"class":"right"});
                return r;
            });
        // Button
        this.preware.addCustomTag("button",
            function(ele, text, attributes){
                var b = this(ele).addElement("a", {"href":"#","class":"button","id":attributes["id"]});
                var r = this(b).addElement("span", attributes["label"]);
                return r;
            });
        // Section with Label
        this.preware.addCustomTag("section",
            function(ele, text, attributes){
                var s = this(ele).addElement("div", {"class":"section"});
                var t = this(s).addElement("div", {"class":"section-title"});
                var ti = this(t).addElement("div", {"class":"section-title-left"});
                this(ti).addElement("div", attributes["label"], {"class":"section-title-right"});
                var r = this(s).addElement("div", {"class":"section-content"});
                var b = this(s).addElement("div", {"class":"section-bottom"});
                var bi = this(b).addElement("div", {"class":"section-bottom-left"});
                this(bi).addElement("div", {"class":"section-bottom-right"});
                return r;
            });
        // Section with Label
        this.preware.addCustomTag("subsection",
            function(ele, text, attributes){
                if(typeof(attributes["open"]) == "undefined")
                    attributes["open"] = "true";
                if(attributes["open"] == "true")
                    var s = this(ele).addElement("div", {"class":"subsection-opened"});
                else
                    var s = this(ele).addElement("div", {"class":"subsection-closed"});
                var t = this(s).addElement("div", {"class":"subsection-title"});
                var ti = this(t).addElement("div", {"class":"subsection-title-left"});
                this(ti).addElement("div", attributes["label"], {"class":"subsection-title-label"});
                var id = (Math.ceil(Math.random() * 9999)).toString();
                this(ti).addElement("a", {
                    "class":"subsection-title-right",
                    "href":"#",
                    "id":id
                });
                dd(id).event({
                    onClick:function()
                    {
                        if(dd(this.parameters.sectionElement).classExists("subsection-closed"))
                            dd(this.parameters.sectionElement).removeClass("subsection-closed")
                                                              .addClass("subsection-opened");
                        else
                            dd(this.parameters.sectionElement).removeClass("subsection-opened")
                                                              .addClass("subsection-closed");
                    }
                }, {"sectionElement":s});
                var r = this(s).addElement("div", {"class":"content"});
                return r;
            });
        // Step
        this.preware.addCustomTag("step",
            function(ele, text, attributes){
                this(ele).addElement("p", attributes["label"], {"class":"step-label"});
                var r = this(ele).addElement("div", {"class":"step-content"});
                return r;
            });
        // SubStep
        this.preware.addCustomTag("substep",
            function(ele, text, attributes){
                var r = this(ele).addElement("p");
                this(r).addElement("strong", attributes["label"]);
                return r;
            });
    }
};