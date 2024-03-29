var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function (b, g, d) {
    b instanceof String && (b = String(b));
    for (var k = b.length, h = 0; h < k; h++) {
        var f = b[h];
        if (g.call(d, f, h, b)) return {
            i: h,
            v: f
        }
    }
    return {
        i: -1,
        v: void 0
    }
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (b, g, d) {
    b != Array.prototype && b != Object.prototype && (b[g] = d.value)
};
$jscomp.getGlobal = function (b) {
    return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (b, g, d, k) {
    if (g) {
        d = $jscomp.global;
        b = b.split(".");
        for (k = 0; k < b.length - 1; k++) {
            var h = b[k];
            h in d || (d[h] = {});
            d = d[h]
        }
        b = b[b.length - 1];
        k = d[b];
        g = g(k);
        g != k && null != g && $jscomp.defineProperty(d, b, {
            configurable: !0,
            writable: !0,
            value: g
        })
    }
};
$jscomp.polyfill("Array.prototype.find", function (b) {
    return b ? b : function (b, d) {
        return $jscomp.findInternal(this, b, d).v
    }
}, "es6", "es3");
(function (b) {
    var g = b.fn.navDropdown,
        d = {
            ESC: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        },
        k = {
            XS: 544,
            SM: 768,
            MD: 992,
            LG: 1200,
            XL: Infinity
        },
        h = function () {
            function a(a, e) {
                "length" in a || (a = [a]);
                this.props = {};
                this.length = a.length;
                e && (this.prevItem = e, b.extend(this.props, e.props));
                for (e = 0; e < a.length; e++) this[e] = a[e]
            }
            a.prototype.eq = function (b) {
                return new a(this[b] ? this[b] : [], this)
            };
            a.prototype.parent = function () {
                return new a(b(this).map(function () {
                    var c = new a(this);
                    return c.is(":upper") ? null : b(c.is(":toggle") ? this.parentNode.parentNode :
                        this).closest(".dropdown").find('>[data-toggle="dropdown-submenu"]')[0]
                }), this)
            };
            a.prototype.parents = function (c) {
                var e = b(this).map(function () {
                    return (new a(this)).is(":toggle") ? this.parentNode : this
                }).parentsUntil(".nav-dropdown", ".dropdown");
                ":upper" === c && (e = e.last());
                e = e.find('>[data-toggle="dropdown-submenu"]');
                return new a(e, this)
            };
            a.prototype.children = function (c) {
                var e = [];
                b(this).each(function () {
                    var d = new a(this);
                    if (d.is(":root")) var f = b(this);
                    else if (d.is(":toggle")) f = b(this).parent().find(">.dropdown-menu");
                    else return;
                    (c ? f.find("a") : d.is(":root") ? f.find(">li>a") : f.find(">a, >.dropdown>a")).each(function () {
                        c && !this.offsetWidth && !this.offsetHeight || this.disabled || b(this).is("[data-button]") || b(this).hasClass("disabled") || ~b.inArray(this, e) || e.push(this)
                    })
                });
                return new a(e, this)
            };
            a.prototype.root = function () {
                return new a(b(this).closest(".nav-dropdown"), this)
            };
            a.prototype.jump = function (c) {
                c = c || "next";
                if (!this.length) return new a([], this);
                var e = this.eq(0);
                e = this.is(":flat") || e.is(":upper") ? e.root().children(this.is(":flat")) :
                    e.parent().children();
                var d = b.inArray(this[0], e);
                if (!e.length || !~d) return new a([], this);
                if ("next" == c) {
                    d += 1;
                    if (d < e.length) return new a(e[d], this);
                    c = "first"
                } else if ("prev" == c) {
                    --d;
                    if (0 <= d) return new a(e[d], this);
                    c = "last"
                }
                return "first" == c ? new a(e[0], this) : "last" == c ? new a(e[e.length - 1], this) : new a([], this)
            };
            a.prototype.next = function () {
                return this.jump("next")
            };
            a.prototype.prev = function () {
                return this.jump("prev")
            };
            a.prototype.first = function () {
                return this.jump("first")
            };
            a.prototype.last = function () {
                return this.jump("last")
            };
            a.prototype.prop = function (a, e) {
                return arguments.length ? 1 < arguments.length ? (this.props[a] = e, this) : "object" == typeof arguments[0] ? (b.extend(this.props, arguments[0]), this) : a in this.props ? this.props[a] : null : b.extend({}, this.props)
            };
            a.prototype.removeProp = function (a) {
                delete this.props[a];
                return this
            };
            a.prototype.is = function (a) {
                for (var c = b(this), d = (a || "").split(/(?=[*#.\[:\s])/); a = d.pop();) switch (a) {
                    case ":root":
                        if (!c.is(".nav-dropdown")) return !1;
                        break;
                    case ":upper":
                        if (!c.parent().parent().is(".nav-dropdown")) return !1;
                        break;
                    case ":opened":
                    case ":closed":
                        if (":opened" == a != c.parent().hasClass("open")) return !1;
                    case ":toggle":
                        if (!c.is('[data-toggle="dropdown-submenu"]')) return !1;
                        break;
                    default:
                        if (!this.props[a]) return !1
                }
                return !0
            };
            a.prototype.open = function () {
                this.is(":closed") && this.click();
                return this
            };
            a.prototype.close = function () {
                this.is(":opened") && this.click();
                return this
            };
            a.prototype.focus = function () {
                this.length && this[0].focus();
                return this
            };
            a.prototype.click = function () {
                this.length && b(this[0]).trigger("click");
                return this
            };
            return function (b) {
                return new a(b)
            }
        }(),
        f = function (a) {
            this._element = a;
            b(this._element).on("click.bs.nav-dropdown", this.toggle)
        };
    f.prototype.toggle = function (a) {
        if (this.disabled || b(this).hasClass("disabled")) return !1;
        a = b(this.parentNode);
        var c = a.hasClass("open"),
            d = f._isCollapsed(b(this).closest(".nav-dropdown"));
        f._clearMenus(b.Event("click", {
            target: this,
            data: {
                toggles: d ? [this] : null
            }
        }));
        if (c) return !1;
        "ontouchstart" in document.documentElement && !a.closest(".dropdown.open").length && (c = document.createElement("div"),
            c.className = "dropdown-backdrop", b(c).insertBefore(b(this).closest(".nav-dropdown")), b(c).on("click", f._clearMenus));
        c = {
            relatedTarget: this
        };
        d = b.Event("show.bs.nav-dropdown", c);
        a.trigger(d);
        if (d.isDefaultPrevented()) return !1;
        this.focus();
        this.setAttribute("aria-expanded", "true");
        a.toggleClass("open");
        a.trigger(b.Event("shown.bs.nav-dropdown", c));
        return !1
    };
    f.prototype.dispose = function () {
        b.removeData(this._element, "bs.nav-dropdown");
        b(this._element).off(".bs.nav-dropdown");
        this._element = null
    };
    f._clearMenus =
        function (a) {
            a = a || {};
            if (3 !== a.which) {
                var c = function () {
                    return !1
                };
                if (a.target) {
                    if (this === document)
                        if (b(a.target).is("a:not([disabled], .disabled)")) var d = b.Event("collapse.bs.nav-dropdown", {
                            relatedTarget: a.target
                        });
                        else {
                            var g = a.targetWrapper && b(a.targetWrapper).find(".nav-dropdown") || b(a.target).closest(".nav-dropdown");
                            if (f._isCollapsed(g)) return
                        }
                    else if (b(a.target).hasClass("dropdown-backdrop") && (g = b(a.target).next(), g.is(".nav-dropdown") && f._isCollapsed(g))) return;
                    b(a.target).is('[data-toggle="dropdown-submenu"]') ?
                        c = b(a.target.parentNode).parents(".dropdown").find('>[data-toggle="dropdown-submenu"]') : b(".dropdown-backdrop").remove()
                }
                c = a.data && a.data.toggles && b(a.data.toggles).parent().find('[data-toggle="dropdown-submenu"]') || b.makeArray(b('[data-toggle="dropdown-submenu"]').not(c));
                for (g = 0; g < c.length; g++) {
                    var h = c[g].parentNode,
                        k = {
                            relatedTarget: c[g]
                        };
                    if (b(h).hasClass("open") && ("click" !== a.type || !/input|textarea/i.test(a.target.tagName) || !b.contains(h, a.target))) {
                        var l = b.Event("hide.bs.nav-dropdown", k);
                        b(h).trigger(l);
                        l.isDefaultPrevented() || (c[g].setAttribute("aria-expanded", "false"), b(h).removeClass("open").trigger(b.Event("hidden.bs.nav-dropdown", k)))
                    }
                }
                d && b(document).trigger(d)
            }
        };
    f._dataApiKeydownHandler = function (a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
            var c, e;
            for (e in d)
                if (c = d[e] === a.which) break;
            c && (a.preventDefault(), a.stopPropagation(), a.which == d.ESC ? f._isCollapsed(this) || (a = b(a.target).parents(".dropdown.open").last().find('>[data-toggle="dropdown-submenu"]'), f._clearMenus(), a.trigger("focus")) :
                "A" == a.target.tagName && (c = h(a.target), c.prop(":flat", f._isCollapsed(c.root())), c.is(":flat") ? a.which === d.DOWN || a.which === d.UP ? c[a.which === d.UP ? "prev" : "next"]().focus() : a.which === d.LEFT ? c.is(":opened") ? c.close() : c.parent().close().focus() : a.which === d.RIGHT && c.is(":toggle") && c.open() : c.is(":upper") ? a.which === d.LEFT || a.which === d.RIGHT ? (c[a.which === d.LEFT ? "prev" : "next"]().focus().open(), c.is(":toggle") && c.close()) : a.which !== d.DOWN && a.which !== d.UP || !c.is(":toggle") || c.children()[a.which === d.DOWN ? "first" :
                    "last"]().focus() : a.which === d.LEFT ? (a = c.parent(), a.is(":upper") ? a.close().prev().focus().open() : a.focus().close()) : a.which === d.RIGHT ? (a = c.children(), a.length ? (c.open(), a.first().focus()) : c.parents(":upper").close().next().focus().open()) : a.which !== d.DOWN && a.which !== d.UP || c[a.which === d.UP ? "prev" : "next"]().focus()))
        }
    };
    f._isCollapsed = function (a) {
        var b;
        a.length && (a = a[0]);
        return a && (b = /navbar-toggleable-(xs|sm|md|lg|xl)/.exec(a.className)) && window.innerWidth < k[b[1].toUpperCase()]
    };
    f._dataApiResizeHandler =
        function () {
            b(".nav-dropdown").each(function () {
                var a = f._isCollapsed(this);
                b(this).find(".dropdown").removeClass("open");
                b(this).find('[aria-expanded="true"]').attr("aria-expanded", "false");
                var c = b(".dropdown-backdrop")[0];
                c && c.parentNode.removeChild(c);
                a != b(this).hasClass("nav-dropdown-sm") && (a ? b(this).addClass("nav-dropdown-sm") : b(this).removeClass("nav-dropdown-sm"))
            })
        };
    b.fn.navDropdown = function (a) {
        return this.each(function () {
            var c = b(this).data("bs.nav-dropdown");
            c || b(this).data("bs.nav-dropdown",
                c = new f(this));
            if ("string" === typeof a) {
                if (void 0 === c[a]) throw Error('No method named "' + a + '"');
                c[a].call(this)
            }
        })
    };
    b.fn.navDropdown.noConflict = function () {
        b.fn.navDropdown = g;
        return this
    };
    b.fn.navDropdown.Constructor = f;
    b.fn.navDropdown.$$ = h;
    b(window).on("resize.bs.nav-dropdown.data-api ready.bs.nav-dropdown.data-api", f._dataApiResizeHandler);
    b(document).on("keydown.bs.nav-dropdown.data-api", ".nav-dropdown", f._dataApiKeydownHandler).on("collapse.bs.navbar-dropdown", f._clearMenus).on("click.bs.nav-dropdown.data-api",
        f._clearMenus).on("click.bs.nav-dropdown.data-api", '[data-toggle="dropdown-submenu"]', f.prototype.toggle).on("click.bs.nav-dropdown.data-api", ".dropdown form", function (a) {
        a.stopPropagation()
    });
    b(window).trigger("ready.bs.nav-dropdown")
})(jQuery);