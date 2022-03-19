var BlazorPlugin2 = BlazorPlugin2 || {};

BlazorPlugin2.Interop = {
    setCookie: function (name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },
    getCookie: function (name) {
        name = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    updateTitle: function (title) {
        if (document.title !== title) {
            document.title = title;
        }
    },
    includeMeta: function (id, attribute, name, content, key) {
        var meta;
        if (id !== "" && key === "id") {
            meta = document.getElementById(id);
        }
        else {
            meta = document.querySelector("meta[" + attribute + "=\"" + CSS.escape(name) + "\"]");
        }
        if (meta === null) {
            meta = document.createElement("meta");
            meta.setAttribute(attribute, name);
            if (id !== "") {
                meta.id = id;
            }
            meta.content = content;
            document.head.appendChild(meta);
        }
        else {
            if (id !== "") {
                meta.setAttribute("id", id);
            }
            if (meta.content !== content) {
                meta.setAttribute("content", content);
            }
        }
    },
    includeLink: function (id, rel, href, type, integrity, crossorigin, key) {
        var link;
        if (id !== "" && key === "id") {
            link = document.getElementById(id);
        }
        else {
            link = document.querySelector("link[href=\"" + CSS.escape(href) + "\"]");
        }
        if (link === null) {
            link = document.createElement("link");
            if (id !== "") {
                link.id = id;
            }
            link.rel = rel;
            if (type !== "") {
                link.type = type;
            }
            link.href = href;
            if (integrity !== "") {
                link.integrity = integrity;
            }
            if (crossorigin !== "") {
                link.crossOrigin = crossorigin;
            }
            document.head.appendChild(link);
        }
        else {
            if (link.id !== id) {
                link.setAttribute('id', id);
            }
            if (link.rel !== rel) {
                link.setAttribute('rel', rel);
            }
            if (type !== "") {
                if (link.type !== type) {
                    link.setAttribute('type', type);
                }
            } else {
                link.removeAttribute('type');
            }
            if (link.href !== this.getAbsoluteUrl(href)) {
                link.removeAttribute('integrity');
                link.removeAttribute('crossorigin');
                link.setAttribute('href', href);
            }
            if (integrity !== "") {
                if (link.integrity !== integrity) {
                    link.setAttribute('integrity', integrity);
                }
            } else {
                link.removeAttribute('integrity');
            }
            if (crossorigin !== "") {
                if (link.crossOrigin !== crossorigin) {
                    link.setAttribute('crossorigin', crossorigin);
                }
            } else {
                link.removeAttribute('crossorigin');
            }
        }
    },
    includeLinks: function (links) {
        for (let i = 0; i < links.length; i++) {
            this.includeLink(links[i].id, links[i].rel, links[i].href, links[i].type, links[i].integrity, links[i].crossorigin, links[i].key);
        }
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
    includeScript: function (id, src, integrity, crossorigin, content, location, key) {
        var script;
        if (id !== "" && key === "id") {
            script = document.getElementById(id);
        }
        else {
            script = document.querySelector("script[src=\"" + CSS.escape(src) + "\"]");
        }
        if (script === null) {
            script = document.createElement("script");
            if (id !== "") {
                script.id = id;
            }
            if (src !== "") {
                script.src = src;
                if (integrity !== "") {
                    script.integrity = integrity;
                }
                if (crossorigin !== "") {
                    script.crossOrigin = crossorigin;
                }
            }
            else {
                script.innerHTML = content;
            }
            script.async = false;
            this.addScript(script, location)
                .then(() => {
                    console.log(src + ' loaded');
                })
                .catch(() => {
                    console.error(src + ' failed');
                });
        }
        else {
            if (script.id !== id) {
                script.setAttribute('id', id);
            }
            if (src !== "") {
                if (script.src !== this.getAbsoluteUrl(src)) {
                    script.removeAttribute('integrity');
                    script.removeAttribute('crossorigin');
                    script.src = src;
                }
                if (integrity !== "") {
                    if (script.integrity !== integrity) {
                        script.setAttribute('integrity', integrity);
                    }
                } else {
                    script.removeAttribute('integrity');
                }
                if (crossorigin !== "") {
                    if (script.crossOrigin !== crossorigin) {
                        script.setAttribute('crossorigin', crossorigin);
                    }
                } else {
                    script.removeAttribute('crossorigin');
                }
            }
            else {
                if (script.innerHTML !== content) {
                    script.innerHTML = content;
                }
            }
        }
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
    includeScripts: async function (scripts) {
        const bundles = [];
        for (let s = 0; s < scripts.length; s++) {
            if (scripts[s].bundle === '') {
                scripts[s].bundle = scripts[s].href;
            }
            if (!bundles.includes(scripts[s].bundle)) {
                bundles.push(scripts[s].bundle);
            }
        }
        const promises = [];
        for (let b = 0; b < bundles.length; b++) {
            const urls = [];
            for (let s = 0; s < scripts.length; s++) {
                if (scripts[s].bundle === bundles[b]) {
                    urls.push(scripts[s].href);
                }
            }
            promises.push(new Promise((resolve, reject) => {
                if (loadjs.isDefined(bundles[b])) {
                    resolve(true);
                }
                else {
                    loadjs(urls, bundles[b], {
                        async: false,
                        returnPromise: true,
                        before: function (path, element) {
                            for (let s = 0; s < scripts.length; s++) {
                                if (path === scripts[s].href && scripts[s].integrity !== '') {
                                    element.integrity = scripts[s].integrity;
                                }
                                if (path === scripts[s].href && scripts[s].crossorigin !== '') {
                                    element.crossOrigin = scripts[s].crossorigin;
                                }
                            }
                        }
                    })
                    .then(function () { resolve(true) })
                    .catch(function (pathsNotFound) { reject(false) });
                }
            }));
        }
        if (promises.length !== 0) {
            await Promise.all(promises);
        }
    },
    getAbsoluteUrl: function (url) {
        var a = document.createElement('a');
        getAbsoluteUrl = function (url) {
            a.href = url;
            return a.href;
        }
        return getAbsoluteUrl(url);
    },
    removeElementsById: function (prefix, first, last) {
        var elements = document.querySelectorAll('[id^=' + prefix + ']');
        for (var i = elements.length - 1; i >= 0; i--) {
            var element = elements[i];
            if (element.id.startsWith(prefix) && (first === '' || element.id >= first) && (last === '' || element.id <= last)) {
                element.parentNode.removeChild(element);
            }
        }
    },
    getElementByName: function (name) {
        var elements = document.getElementsByName(name);
        if (elements.length) {
            return elements[0].value;
        } else {
            return "";
        }
    },
    submitForm: function (path, fields) {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = path;

        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = fields[key];
                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    },
    getFiles: function (id) {
        var files = [];
        var fileinput = document.getElementById(id);
        if (fileinput !== null) {
            for (var i = 0; i < fileinput.files.length; i++) {
                files.push(fileinput.files[i].name);
            }
        }
        return files;
    },
    uploadFiles: function (posturl, folder, id) {
        var fileinput = document.getElementById(id + 'FileInput');
        var files = fileinput.files;
        var progressinfo = document.getElementById(id + 'ProgressInfo');
        var progressbar = document.getElementById(id + 'ProgressBar');

        progressinfo.setAttribute("style", "display: inline;");
        progressbar.setAttribute("style", "width: 200px; display: inline;");

        for (var i = 0; i < files.length; i++) {
            var FileChunk = [];
            var file = files[i];
            var MaxFileSizeMB = 1;
            var BufferChunkSize = MaxFileSizeMB * (1024 * 1024);
            var FileStreamPos = 0;
            var EndPos = BufferChunkSize;
            var Size = file.size;

            while (FileStreamPos < Size) {
                FileChunk.push(file.slice(FileStreamPos, EndPos));
                FileStreamPos = EndPos;
                EndPos = FileStreamPos + BufferChunkSize;
            }

            var TotalParts = FileChunk.length;
            var PartCount = 0;

            while (Chunk = FileChunk.shift()) {
                PartCount++;
                var FileName = file.name + ".part_" + PartCount.toString().padStart(3, '0') + "_" + TotalParts.toString().padStart(3, '0');

                var data = new FormData();
                data.append('folder', folder);
                data.append('formfile', Chunk, FileName);
                var request = new XMLHttpRequest();
                request.open('POST', posturl, true);
                request.upload.onloadstart = function (e) {
                    progressinfo.innerHTML = file.name + ' 0%';
                    progressbar.value = 0;
                };
                request.upload.onprogress = function (e) {
                    var percent = Math.ceil((e.loaded / e.total) * 100);
                    progressinfo.innerHTML = file.name + '[' + PartCount + '] ' + percent + '%';
                    progressbar.value = (percent / 100);
                };
                request.upload.onloadend = function (e) {
                    progressinfo.innerHTML = file.name + ' 100%';
                    progressbar.value = 1;
                };
                request.send(data);
            }
        }
        fileinput.value = '';
    },
    refreshBrowser: function (reload, wait) {
        setInterval(function () {
            window.location.reload(reload);
        }, wait * 1000);
    },
    redirectBrowser: function (url, wait) {
        setInterval(function () {
            window.location.href = url;
        }, wait * 1000);
    },
    formValid: function (formRef) {
        return formRef.checkValidity();
    },
    setElementAttribute: function (id, attribute, value) {
        var element = document.getElementById(id);
        if (element !== null) {
            element.setAttribute(attribute, value);
        }
    }
};
