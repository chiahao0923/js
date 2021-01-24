window.KlookAffV5 = (function () {
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (l) {
            var o = document,
                n, m, k, j = [];
            if (o.querySelectorAll) {
                return o.querySelectorAll("." + l)
            }
            if (o.evaluate) {
                m = ".//*[contains(concat(' ', @class, ' '), ' " + l + " ')]";
                n = o.evaluate(m, o, null, 0, null);
                while ((k = n.iterateNext())) {
                    j.push(k)
                }
            } else {
                n = o.getElementsByTagName("*");
                m = new RegExp("(^|\\s)" + l + "(\\s|$)");
                for (k = 0;
                     k < n.length;
                     k++) {
                    if (m.test(n[k].className)) {
                        j.push(n[k])
                    }
                }
            }
            return j
        }
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "")
        }
    }
    function d(j) {
        if (window.console && typeof window.console.error == "function") {
            console.error(j)
        }
    }
    function joinAttribute(k) {
        var l, j = "";
        for (l in k) {
            if (typeof k[l] != "undefined") {
                j += l + '="' + k[l] + '" '
            }
        }
        return j
    }
    function attribute(k, j, l) {
        if (typeof l == "undefined") {
            return k.getAttribute(j)
        } else {
            k.setAttribute(j, l)
        }
    }

    function joinParams(j) {
        var k, l = "";
        for (k in j) {
            if (typeof j[k] != "undefined") {
                l += k + "=" + encodeURIComponent(j[k]) + "&"
            }
        }
        return l
    }

    function get_host() {
        if (window.__klk_aff_host) {
            return window.__klk_aff_host
        }
        return "//affiliate.klook.com";
    }

    function getStyle(widthValue, heightValue) {
        return "border:none;padding:0;margin:0;overflow:hidden;max-width:none;width:" + widthValue + ";height:" + heightValue;
    }

    function joinHtml(j, w = '100%', h = '100%') {
        var prodType = j.prod.toLowerCase();
        // å¼€å‘èµ° widget.htmlæ¸²æŸ“ï¼Œå…¶ä»–çŽ¯å¢ƒèµ°æŽ¥å£
        var url = "/v1/affnode/render?"
        var m = get_host() + url,
            l = "<iframe ";
        // ä¸ºäº†å‡å°‘ç»™åŽç«¯å‘é€æ— æ•ˆè¯·æ±‚ï¼Œå¢žåŠ æ¸²æŸ“æŽ¥å£çš„å‚æ•°åˆ¤æ–­é€»è¾‘ï¼Œåœ¨ä»¥ä¸‹æƒ…å†µï¼ˆæ²¡æœ‰adidï¼‰ï¼Œä¸å‘é€æ¸²æŸ“çš„è¯·æ±‚ï¼Œå‚æ•°é”™è¯¯ä¼šæŠ¥é”™.
        if (!isNaN(j.adid)) {
            m += joinParams({
                prod: prodType,
                adid: j.adid,
                currency: j.currency,
                cid: j.cid,
                lang: j.lang,
                tid: j.tid,
                w: j.width,
                h: j.height,
                amount: j.amount
            });
            l += joinAttribute({
                src: m,
                scrolling: "no",
                style: getStyle(w, h),
                marginheight: "0",
                marginwidth: "0",
                frameborder: "0",
                allowtransparency: "true",
                title: "Klook.com third party widget. Discover and book amazing things to do at exclusive prices. Links open in an external site that may or may not meet accessibility guidelines."
            });
            l += ">";
            l += "</iframe>";
            return l
        }
        return '';
    }
    function getAttrData(n) {
        var j = ["width", "height", "prod", "adid", "lang", "currency", "actids", "price", 'bgtype', 'cid', 'tid', 'amount', 'cardH', 'padding', 'lgH', 'edgeValue'],
            m = {},
            l, k;
        for (l = j.length - 1;
             l >= 0;
             l--) {
            k = attribute(n, "data-" + j[l]);
            if (typeof k == "string" && k.length) {
                m[j[l]] = k.trim()
            }
        }
        return m
    }
    function checkData(l) {
        var p = l.width,
            k = l.height,
            j = l.prod,
            n = ['static_widget', 'dynamic_widget'],
            m, o = false;
        if (p && k && j) {
            j = j.toLowerCase();
            for (m = n.length - 1;
                 m >= 0;
                 m--) {
                if (n[m] == j) {
                    o = true;
                    break
                }
            }
            if (!o) {
                throw Error("KlookAff: Invalid product type: " + j)
            }
        }
    }
    function c() {
        var n = document.getElementsByClassName("klookaff_v5"),
            m = "data-kl-touched",
            k, l = n.length,
            j, q;
        for (var o = 0; o < l; o++) {
            j = n[o];
            k = attribute(j, m);
            if (!k) {
                q = getAttrData(n[o]);
                try {
                    checkData(q);
                    const [ch, pd, lh, ev, at] = [q.cardH, q.padding, q.lgH, q.edgeValue, q.amount].map(i => parseInt(i));
                    var htm = joinHtml(q),
                        minh_sm = ch * at + pd,
                        minh_lg = lh,
                        pw = j.parentElement.clientWidth || 0;
                    if (pw > 0) {
                        if (pw < ev) {
                            htm = joinHtml(q, '100%', `${minh_sm}px`);
                        }
                        if (pw >= ev) {
                            htm = joinHtml(q, '100%', `${minh_lg}px`);
                        }
                    }
                    if (htm) {
                        n[o].innerHTML = htm;
                    }
                } catch (p) {
                    d(p.message)
                }
                attribute(j, m, "true")
            }
        }
    }
    return {
        run: c
    }
}());
KlookAffV5.run();
