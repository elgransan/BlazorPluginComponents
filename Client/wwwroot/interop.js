var BlazorPlugin2 = BlazorPlugin2 || {};

BlazorPlugin2.Interop = {
    includeLink: function (href) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.head.appendChild(link);
    },
    addLink: function (style, location) {
        link = document.createElement("style");
        link.textContent = style;
        if (location === 'head') {
            document.head.appendChild(link);
        }
        if (location === 'body') {
            document.body.appendChild(link);    
        }
    },
    includeScript: function (src) {
        var script = document.createElement("script");
        script.src = src;
    },
    addScript: function (script, location) {
        if (location === 'head') {
            document.head.appendChild(script);
        }
        if (location === 'body') {
            document.body.appendChild(script);
        }

        return new Promise((res, rej) => {
            script.onload = res();
            script.onerror = rej();
        });
    },
};
