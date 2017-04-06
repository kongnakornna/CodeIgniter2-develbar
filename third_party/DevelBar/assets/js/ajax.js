CIjs = function() {
    "use strict";
    var j, a = function(a, b) {
            return a.className.match(new RegExp("\\b" + b + "\\b"))
        },
        b = function(a, b) {
            a.className = a.className.replace(new RegExp("\\b" + b + "\\b"), " ")
        },
        c = function(b, c) {
            a(b, c) || (b.className += " " + c)
        },
        d = [],
        e = 4,
        f = 0,
        g = function() {
            var a = document.querySelector(".ci-toolbar-ajax-requests");
            if (a) {
                a.textContent = "(" + d.length + ")", a.className = "ci-toolbar-ajax-requests";
                var g = document.querySelector(".ci-toolbar-ajax-info");
                g && (g.textContent = d.length + " AJAX request" + (d.length > 1 ? "s" : ""));
                var h = document.querySelector(".ci-toolbar-block-ajax");
                d.length ? c(h.parentNode, "active") : b(h.parentNode, "active"), f > 0 ? c(h, "ci-ajax-request-loading") : e < 4 ? (c(h, "ci-toolbar-status-red"), b(h, "ci-ajax-request-loading")) : (b(h, "ci-ajax-request-loading"), b(h, "ci-toolbar-status-red"))
            }
        },
        h = function(a) {
            var b = d[a];
            f++;
            var c = document.createElement("tr");
            b.DOMNode = c;
            var e = document.querySelector(".ci-toolbar-ajax-request-list");
            if (e) {
                var h = document.createElement("td");
                h.textContent = b.method, c.appendChild(h);
                var i = document.createElement("td"),
                    j = document.createElement("span");
                j.textContent = "-", i.appendChild(j), c.appendChild(i);
                var k = document.createElement("td");
                if (k.className = "ci-ajax-request-url", "GET" === b.method) {
                    var l = document.createElement("a");
                    l.setAttribute("href", b.url), l.setAttribute("target", "_blank"), l.textContent = b.url.split("?")[0], k.appendChild(l)
                } else k.textContent = b.url;
                k.setAttribute("title", b.url), c.appendChild(k);
                var m = document.createElement("td");
                m.className = "ci-ajax-request-duration", m.textContent = "-", c.appendChild(m);
                var n = document.createElement("td");
                n.className = "ci-ajax-profiler-url", "" != b.profiler && (profilerLink.textContent = "profiler", n.appendChild(n)), c.appendChild(n), c.className = "ci-ajax-request ci-ajax-request-loading", e.insertBefore(c, e.firstChild), g()
            }
        },
        i = function(a) {
            var b = d[a];
            f--;
            var c = b.DOMNode,
                h = c.children[0],
                i = c.children[1],
                j = i.children[0],
                k = c.children[3],
                l = c.children[4];
            if (b.error ? (c.className = "ci-ajax-request ci-ajax-request-error", h.className = "ci-ajax-request-error", e = 0) : (c.className = "ci-ajax-request ci-ajax-request-ok", e++), b.statusCode && (b.statusCode < 300 ? j.setAttribute("class", "ci-toolbar-status") : b.statusCode < 400 ? j.setAttribute("class", "ci-toolbar-status ci-toolbar-status-yellow") : j.setAttribute("class", "ci-toolbar-status ci-toolbar-status-red"), j.textContent = b.statusCode), b.duration && (k.textContent = b.duration + "ms"), b.profiler) {
                var m = document.createElement("a");
                //m.setAttribute("href", "/index.php/develbarprofiler/profil/" + b.profiler), m.setAttribute("target", "_blank"), m.textContent = "profiler", l.appendChild(m)
				var app_url=window.location.href ;
				m.setAttribute("href", app_url+"develbarprofiler/profil/" + b.profiler), m.setAttribute("target", "_blank"), m.textContent = "profiler", l.appendChild(m)
            }
            g()
        },
        k = document.createElement("div");
    if (j = "addEventListener" in k ? function(a, b, c) {
            a.addEventListener(b, c, !1)
        } : function(a, b, c) {
            a.attachEvent("on" + b, c)
        }, window.fetch && void 0 === window.fetch.polyfill) {
        var l = window.fetch;
        window.fetch = function() {
            var a = l.apply(this, arguments),
                b = arguments[0],
                c = arguments[1],
                e = Object.prototype.toString.call(arguments[0]);
            "[object Request]" === e && (b = arguments[0].url, c = {
                method: arguments[0].method,
                credentials: arguments[0].credentials,
                headers: arguments[0].headers,
                mode: arguments[0].mode,
                redirect: arguments[0].redirect
            });
            var f = "GET";
            c && void 0 !== c.method && (f = c.method);
            var g = {
                    error: !1,
                    url: b,
                    method: f,
                    type: "fetch",
                    start: new Date
                },
                j = d.push(g) - 1;
            return a.then(function(a) {
                g.duration = new Date - g.start, g.error = a.status < 200 || a.status >= 400, g.statusCode = a.status, i(j)
            }, function(a) {
                g.error = !0
            }), h(j), a
        }
    }
    if (window.XMLHttpRequest && XMLHttpRequest.prototype.addEventListener) {
        var m = XMLHttpRequest.prototype.open,
            n = 0;
        XMLHttpRequest.prototype.open = function(a, b, c, e, f) {
            var g = this,
                j = {
                    error: !1,
                    url: b,
                    method: a,
                    profiler: "",
                    start: new Date
                };
            n = d.push(j) - 1, this.addEventListener("readystatechange", function() {
                4 == g.readyState && (j.duration = new Date - j.start, j.error = g.status < 200 || g.status >= 400, j.statusCode = g.status, j.profiler = g.getResponseHeader("X-CI-Toolbar-Profiler"), i(n))
            }, !1), h(n), m.apply(this, Array.prototype.slice.call(arguments))
        }
    }
    return {
        hasClass: a,
        removeClass: b,
        addClass: c,
        addEventListener: j,
        renderAjaxRequests: g
    }
}(), CIjs.addEventListener(window, "load", function() {
    CIjs.renderAjaxRequests()
});