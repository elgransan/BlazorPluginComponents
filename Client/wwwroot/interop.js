var BlazorPlugin2 = BlazorPlugin2 || {};

BlazorPlugin2.Interop = {
    includeLink: function (id, href) {
        var link = document.getElementById(id);
        if (link === null)
        {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = href;
            link.id = id;
            document.head.appendChild(link);
        }
    },
    addLink: function (id, style, location) {
        var link = document.getElementById(id);
        if (link === null)
        {
            link = document.createElement("style");
            link.textContent = style;
            link.id = id;
            if (location === 'head') {
                document.head.appendChild(link);
            }
            if (location === 'body') {
                document.body.appendChild(link);
            }
        }
    },
    includeScript: function (id, src) {
        var script = document.getElementById(id);
        if (script === null)
        {
            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.id = id;
            document.body.appendChild(script);
        }
    }
};
