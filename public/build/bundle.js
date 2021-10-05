
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/ContactCard.svelte generated by Svelte v3.43.0 */

    const file$1 = "src/ContactCard.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let header;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let t1;
    	let t2;
    	let h2;
    	let t3;
    	let t4;
    	let div2;
    	let p;
    	let t5;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			header = element("header");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			t1 = text(/*userName*/ ctx[0]);
    			t2 = space();
    			h2 = element("h2");
    			t3 = text(/*jobTitle*/ ctx[1]);
    			t4 = space();
    			div2 = element("div");
    			p = element("p");
    			t5 = text(/*description*/ ctx[2]);
    			if (!src_url_equal(img.src, img_src_value = /*userImage*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*userName*/ ctx[0]);
    			attr_dev(img, "class", "svelte-p7z0xn");
    			add_location(img, file$1, 69, 6, 1115);
    			attr_dev(div0, "class", "thumb svelte-p7z0xn");
    			toggle_class(div0, "thumb-placeholder", !/*userImage*/ ctx[3]);
    			add_location(div0, file$1, 68, 4, 1050);
    			attr_dev(h1, "class", "svelte-p7z0xn");
    			add_location(h1, file$1, 72, 6, 1199);
    			attr_dev(h2, "class", "svelte-p7z0xn");
    			add_location(h2, file$1, 73, 6, 1225);
    			attr_dev(div1, "class", "user-data svelte-p7z0xn");
    			add_location(div1, file$1, 71, 4, 1169);
    			attr_dev(header, "class", "svelte-p7z0xn");
    			add_location(header, file$1, 67, 2, 1037);
    			add_location(p, file$1, 77, 4, 1300);
    			attr_dev(div2, "class", "description svelte-p7z0xn");
    			add_location(div2, file$1, 76, 2, 1270);
    			attr_dev(div3, "class", "contact-card svelte-p7z0xn");
    			add_location(div3, file$1, 66, 0, 1008);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, header);
    			append_dev(header, div0);
    			append_dev(div0, img);
    			append_dev(header, t0);
    			append_dev(header, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, p);
    			append_dev(p, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*userImage*/ 8 && !src_url_equal(img.src, img_src_value = /*userImage*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*userName*/ 1) {
    				attr_dev(img, "alt", /*userName*/ ctx[0]);
    			}

    			if (dirty & /*userImage*/ 8) {
    				toggle_class(div0, "thumb-placeholder", !/*userImage*/ ctx[3]);
    			}

    			if (dirty & /*userName*/ 1) set_data_dev(t1, /*userName*/ ctx[0]);
    			if (dirty & /*jobTitle*/ 2) set_data_dev(t3, /*jobTitle*/ ctx[1]);
    			if (dirty & /*description*/ 4) set_data_dev(t5, /*description*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContactCard', slots, []);
    	let { userName } = $$props;
    	let { jobTitle } = $$props;
    	let { description } = $$props;
    	let { userImage } = $$props;
    	const writable_props = ['userName', 'jobTitle', 'description', 'userImage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContactCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('userName' in $$props) $$invalidate(0, userName = $$props.userName);
    		if ('jobTitle' in $$props) $$invalidate(1, jobTitle = $$props.jobTitle);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('userImage' in $$props) $$invalidate(3, userImage = $$props.userImage);
    	};

    	$$self.$capture_state = () => ({
    		userName,
    		jobTitle,
    		description,
    		userImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('userName' in $$props) $$invalidate(0, userName = $$props.userName);
    		if ('jobTitle' in $$props) $$invalidate(1, jobTitle = $$props.jobTitle);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('userImage' in $$props) $$invalidate(3, userImage = $$props.userImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userName, jobTitle, description, userImage];
    }

    class ContactCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			userName: 0,
    			jobTitle: 1,
    			description: 2,
    			userImage: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactCard",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*userName*/ ctx[0] === undefined && !('userName' in props)) {
    			console.warn("<ContactCard> was created without expected prop 'userName'");
    		}

    		if (/*jobTitle*/ ctx[1] === undefined && !('jobTitle' in props)) {
    			console.warn("<ContactCard> was created without expected prop 'jobTitle'");
    		}

    		if (/*description*/ ctx[2] === undefined && !('description' in props)) {
    			console.warn("<ContactCard> was created without expected prop 'description'");
    		}

    		if (/*userImage*/ ctx[3] === undefined && !('userImage' in props)) {
    			console.warn("<ContactCard> was created without expected prop 'userImage'");
    		}
    	}

    	get userName() {
    		throw new Error("<ContactCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userName(value) {
    		throw new Error("<ContactCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get jobTitle() {
    		throw new Error("<ContactCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set jobTitle(value) {
    		throw new Error("<ContactCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<ContactCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<ContactCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get userImage() {
    		throw new Error("<ContactCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userImage(value) {
    		throw new Error("<ContactCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let label;
    	let t1;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let hr0;
    	let t4;
    	let article0;
    	let small0;
    	let t6;
    	let p0;
    	let t7;
    	let b0;
    	let t8;
    	let t9;
    	let t10;
    	let hr1;
    	let t11;
    	let article1;
    	let small1;
    	let t13;
    	let p1;
    	let u0;
    	let t15;
    	let b1;
    	let t16;
    	let t17;
    	let t18;
    	let hr2;
    	let t19;
    	let article2;
    	let small2;
    	let t21;
    	let p2;
    	let t22;
    	let b2;
    	let t23;
    	let t24;
    	let t25;
    	let hr3;
    	let t26;
    	let article3;
    	let small3;
    	let t28;
    	let p3;
    	let t29;
    	let b3;
    	let t30;
    	let t31;
    	let t32;
    	let hr4;
    	let t33;
    	let article4;
    	let small4;
    	let t35;
    	let p4;
    	let t36;
    	let b4;
    	let t37;
    	let t38;
    	let t39;
    	let hr5;
    	let t40;
    	let article5;
    	let small5;
    	let t42;
    	let p5;
    	let u1;
    	let t44;
    	let b5;
    	let t45;
    	let t46;
    	let t47;
    	let hr6;
    	let t48;
    	let article6;
    	let small6;
    	let t50;
    	let p6;
    	let t51;
    	let b6;
    	let t52;
    	let t53;
    	let t54;
    	let hr7;
    	let t55;
    	let article7;
    	let small7;
    	let t57;
    	let p7;
    	let t58;
    	let b7;
    	let t59;
    	let t60;
    	let t61;
    	let hr8;
    	let t62;
    	let article8;
    	let small8;
    	let t64;
    	let p8;
    	let t65;
    	let b8;
    	let t66;
    	let t67;
    	let t68;
    	let hr9;
    	let t69;
    	let article9;
    	let small9;
    	let t71;
    	let p9;
    	let u2;
    	let t73;
    	let b9;
    	let t74;
    	let t75;
    	let t76;
    	let hr10;
    	let t77;
    	let article10;
    	let small10;
    	let t79;
    	let p10;
    	let t80;
    	let b10;
    	let t81;
    	let t82;
    	let t83;
    	let hr11;
    	let t84;
    	let article11;
    	let small11;
    	let t86;
    	let p11;
    	let u3;
    	let t88;
    	let b11;
    	let t89;
    	let t90;
    	let t91;
    	let hr12;
    	let t92;
    	let article12;
    	let small12;
    	let t94;
    	let p12;
    	let t95;
    	let b12;
    	let t96;
    	let t97;
    	let t98;
    	let hr13;
    	let t99;
    	let article13;
    	let small13;
    	let t101;
    	let p13;
    	let u4;
    	let t103;
    	let b13;
    	let t104;
    	let t105;
    	let t106;
    	let hr14;
    	let t107;
    	let article14;
    	let small14;
    	let t109;
    	let p14;
    	let t110;
    	let b14;
    	let t111;
    	let t112;
    	let t113;
    	let hr15;
    	let t114;
    	let article15;
    	let small15;
    	let t116;
    	let p15;
    	let u5;
    	let t118;
    	let b15;
    	let t119;
    	let t120;
    	let t121;
    	let hr16;
    	let t122;
    	let article16;
    	let small16;
    	let t124;
    	let p16;
    	let b16;
    	let t125;
    	let t126;
    	let t127;
    	let hr17;
    	let t128;
    	let article17;
    	let small17;
    	let t130;
    	let p17;
    	let b17;
    	let t131;
    	let t132;
    	let t133;
    	let hr18;
    	let t134;
    	let article18;
    	let small18;
    	let t136;
    	let p18;
    	let t137;
    	let b18;
    	let t138;
    	let t139;
    	let t140;
    	let hr19;
    	let t141;
    	let article19;
    	let small19;
    	let t143;
    	let p19;
    	let t144;
    	let b19;
    	let t145;
    	let t146;
    	let t147;
    	let hr20;
    	let t148;
    	let article20;
    	let small20;
    	let t150;
    	let p20;
    	let t151;
    	let b20;
    	let t152;
    	let t153;
    	let t154;
    	let hr21;
    	let t155;
    	let article21;
    	let small21;
    	let t157;
    	let p21;
    	let t158;
    	let b21;
    	let t159;
    	let t160;
    	let t161;
    	let hr22;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Gerund";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			hr0 = element("hr");
    			t4 = space();
    			article0 = element("article");
    			small0 = element("small");
    			small0.textContent = "I'm ____-ing";
    			t6 = space();
    			p0 = element("p");
    			t7 = text("Mein ");
    			b0 = element("b");
    			t8 = text(/*bones*/ ctx[1]);
    			t9 = text("rahaa hun");
    			t10 = space();
    			hr1 = element("hr");
    			t11 = space();
    			article1 = element("article");
    			small1 = element("small");
    			small1.textContent = "He is ____-ing";
    			t13 = space();
    			p1 = element("p");
    			u0 = element("u");
    			u0.textContent = "Woh";
    			t15 = space();
    			b1 = element("b");
    			t16 = text(/*bones*/ ctx[1]);
    			t17 = text("rahaa he");
    			t18 = space();
    			hr2 = element("hr");
    			t19 = space();
    			article2 = element("article");
    			small2 = element("small");
    			small2.textContent = "You are ____-ing (informal)";
    			t21 = space();
    			p2 = element("p");
    			t22 = text("Tum ");
    			b2 = element("b");
    			t23 = text(/*bones*/ ctx[1]);
    			t24 = text("rahey ho");
    			t25 = space();
    			hr3 = element("hr");
    			t26 = space();
    			article3 = element("article");
    			small3 = element("small");
    			small3.textContent = "You are ____-ing (formal)";
    			t28 = space();
    			p3 = element("p");
    			t29 = text("Aap ");
    			b3 = element("b");
    			t30 = text(/*bones*/ ctx[1]);
    			t31 = text("rahey hein");
    			t32 = space();
    			hr4 = element("hr");
    			t33 = space();
    			article4 = element("article");
    			small4 = element("small");
    			small4.textContent = "I'm ____-ing (1stp)";
    			t35 = space();
    			p4 = element("p");
    			t36 = text("Mein ");
    			b4 = element("b");
    			t37 = text(/*bones*/ ctx[1]);
    			t38 = text("rahee hun");
    			t39 = space();
    			hr5 = element("hr");
    			t40 = space();
    			article5 = element("article");
    			small5 = element("small");
    			small5.textContent = "She is ____-ing";
    			t42 = space();
    			p5 = element("p");
    			u1 = element("u");
    			u1.textContent = "Woh";
    			t44 = space();
    			b5 = element("b");
    			t45 = text(/*bones*/ ctx[1]);
    			t46 = text("rahee he");
    			t47 = space();
    			hr6 = element("hr");
    			t48 = space();
    			article6 = element("article");
    			small6 = element("small");
    			small6.textContent = "You are ____-ing (informal)";
    			t50 = space();
    			p6 = element("p");
    			t51 = text("Tum ");
    			b6 = element("b");
    			t52 = text(/*bones*/ ctx[1]);
    			t53 = text("rahee ho");
    			t54 = space();
    			hr7 = element("hr");
    			t55 = space();
    			article7 = element("article");
    			small7 = element("small");
    			small7.textContent = "You are ____-ing (formal)";
    			t57 = space();
    			p7 = element("p");
    			t58 = text("Aap ");
    			b7 = element("b");
    			t59 = text(/*bones*/ ctx[1]);
    			t60 = text("raheen hein");
    			t61 = space();
    			hr8 = element("hr");
    			t62 = space();
    			article8 = element("article");
    			small8 = element("small");
    			small8.textContent = "We're ____-ing (neutral)";
    			t64 = space();
    			p8 = element("p");
    			t65 = text("Hum ");
    			b8 = element("b");
    			t66 = text(/*bones*/ ctx[1]);
    			t67 = text("rahey hein");
    			t68 = space();
    			hr9 = element("hr");
    			t69 = space();
    			article9 = element("article");
    			small9 = element("small");
    			small9.textContent = "They're ____-ing (they/formal neutral)";
    			t71 = space();
    			p9 = element("p");
    			u2 = element("u");
    			u2.textContent = "Woh";
    			t73 = space();
    			b9 = element("b");
    			t74 = text(/*bones*/ ctx[1]);
    			t75 = text("rahey hein");
    			t76 = space();
    			hr10 = element("hr");
    			t77 = space();
    			article10 = element("article");
    			small10 = element("small");
    			small10.textContent = "I will ____ (1stp)";
    			t79 = space();
    			p10 = element("p");
    			t80 = text("Mein ");
    			b10 = element("b");
    			t81 = text(/*bones*/ ctx[1]);
    			t82 = text("unga");
    			t83 = space();
    			hr11 = element("hr");
    			t84 = space();
    			article11 = element("article");
    			small11 = element("small");
    			small11.textContent = "I will ____ (1stp)";
    			t86 = space();
    			p11 = element("p");
    			u3 = element("u");
    			u3.textContent = "Woh";
    			t88 = space();
    			b11 = element("b");
    			t89 = text(/*bones*/ ctx[1]);
    			t90 = text("eyga");
    			t91 = space();
    			hr12 = element("hr");
    			t92 = space();
    			article12 = element("article");
    			small12 = element("small");
    			small12.textContent = "I will ____";
    			t94 = space();
    			p12 = element("p");
    			t95 = text("Mein ");
    			b12 = element("b");
    			t96 = text(/*bones*/ ctx[1]);
    			t97 = text("ungi");
    			t98 = space();
    			hr13 = element("hr");
    			t99 = space();
    			article13 = element("article");
    			small13 = element("small");
    			small13.textContent = "She will ____";
    			t101 = space();
    			p13 = element("p");
    			u4 = element("u");
    			u4.textContent = "Woh";
    			t103 = space();
    			b13 = element("b");
    			t104 = text(/*bones*/ ctx[1]);
    			t105 = text("eygi");
    			t106 = space();
    			hr14 = element("hr");
    			t107 = space();
    			article14 = element("article");
    			small14 = element("small");
    			small14.textContent = "We will ____ (neutral)";
    			t109 = space();
    			p14 = element("p");
    			t110 = text("Hum ");
    			b14 = element("b");
    			t111 = text(/*bones*/ ctx[1]);
    			t112 = text("eingay");
    			t113 = space();
    			hr15 = element("hr");
    			t114 = space();
    			article15 = element("article");
    			small15 = element("small");
    			small15.textContent = "They will ____ (they/formal neutral)";
    			t116 = space();
    			p15 = element("p");
    			u5 = element("u");
    			u5.textContent = "Woh";
    			t118 = space();
    			b15 = element("b");
    			t119 = text(/*bones*/ ctx[1]);
    			t120 = text("eingay");
    			t121 = space();
    			hr16 = element("hr");
    			t122 = space();
    			article16 = element("article");
    			small16 = element("small");
    			small16.textContent = "____! (neutral)";
    			t124 = space();
    			p16 = element("p");
    			b16 = element("b");
    			t125 = text(/*bones*/ ctx[1]);
    			t126 = text("o!");
    			t127 = space();
    			hr17 = element("hr");
    			t128 = space();
    			article17 = element("article");
    			small17 = element("small");
    			small17.textContent = "____! (formal neutral)";
    			t130 = space();
    			p17 = element("p");
    			b17 = element("b");
    			t131 = text(/*bones*/ ctx[1]);
    			t132 = text("ein!");
    			t133 = space();
    			hr18 = element("hr");
    			t134 = space();
    			article18 = element("article");
    			small18 = element("small");
    			small18.textContent = "____? (informal)";
    			t136 = space();
    			p18 = element("p");
    			t137 = text("Tum ");
    			b18 = element("b");
    			t138 = text(/*bones*/ ctx[1]);
    			t139 = text("ogay?");
    			t140 = space();
    			hr19 = element("hr");
    			t141 = space();
    			article19 = element("article");
    			small19 = element("small");
    			small19.textContent = "____? (formal)";
    			t143 = space();
    			p19 = element("p");
    			t144 = text("Aap ");
    			b19 = element("b");
    			t145 = text(/*bones*/ ctx[1]);
    			t146 = text("eingey?");
    			t147 = space();
    			hr20 = element("hr");
    			t148 = space();
    			article20 = element("article");
    			small20 = element("small");
    			small20.textContent = "____? (formal)";
    			t150 = space();
    			p20 = element("p");
    			t151 = text("Aap ");
    			b20 = element("b");
    			t152 = text(/*bones*/ ctx[1]);
    			t153 = text("ogi?");
    			t154 = space();
    			hr21 = element("hr");
    			t155 = space();
    			article21 = element("article");
    			small21 = element("small");
    			small21.textContent = "____? (formal)";
    			t157 = space();
    			p21 = element("p");
    			t158 = text("Aap ");
    			b21 = element("b");
    			t159 = text(/*bones*/ ctx[1]);
    			t160 = text("eingee?");
    			t161 = space();
    			hr22 = element("hr");
    			attr_dev(label, "for", "gerund");
    			add_location(label, file, 45, 4, 679);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "gerund");
    			attr_dev(input0, "placeholder", "Gerund");
    			add_location(input0, file, 46, 4, 718);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "trans");
    			attr_dev(input1, "placeholder", "Translation");
    			add_location(input1, file, 47, 5, 798);
    			attr_dev(div0, "class", "form-control");
    			add_location(div0, file, 44, 2, 648);
    			add_location(hr0, file, 50, 2, 870);
    			attr_dev(small0, "class", "svelte-azb90x");
    			add_location(small0, file, 54, 2, 902);
    			add_location(b0, file, 55, 10, 941);
    			add_location(p0, file, 55, 2, 933);
    			add_location(hr1, file, 56, 2, 972);
    			attr_dev(article0, "class", "masc svelte-azb90x");
    			add_location(article0, file, 53, 0, 877);
    			attr_dev(small1, "class", "svelte-azb90x");
    			add_location(small1, file, 60, 2, 1014);
    			add_location(u0, file, 61, 5, 1050);
    			add_location(b1, file, 61, 16, 1061);
    			add_location(p1, file, 61, 2, 1047);
    			add_location(hr2, file, 62, 2, 1091);
    			attr_dev(article1, "class", "masc svelte-azb90x");
    			add_location(article1, file, 59, 0, 989);
    			attr_dev(small2, "class", "svelte-azb90x");
    			add_location(small2, file, 66, 2, 1133);
    			add_location(b2, file, 67, 9, 1186);
    			add_location(p2, file, 67, 2, 1179);
    			add_location(hr3, file, 68, 2, 1216);
    			attr_dev(article2, "class", "masc svelte-azb90x");
    			add_location(article2, file, 65, 0, 1108);
    			attr_dev(small3, "class", "svelte-azb90x");
    			add_location(small3, file, 73, 2, 1259);
    			add_location(b3, file, 74, 9, 1310);
    			add_location(p3, file, 74, 2, 1303);
    			add_location(hr4, file, 75, 2, 1342);
    			attr_dev(article3, "class", "masc svelte-azb90x");
    			add_location(article3, file, 72, 0, 1234);
    			attr_dev(small4, "class", "svelte-azb90x");
    			add_location(small4, file, 80, 2, 1384);
    			add_location(b4, file, 81, 10, 1429);
    			add_location(p4, file, 81, 2, 1421);
    			add_location(hr5, file, 82, 2, 1460);
    			attr_dev(article4, "class", "fem svelte-azb90x");
    			add_location(article4, file, 79, 0, 1360);
    			attr_dev(small5, "class", "svelte-azb90x");
    			add_location(small5, file, 86, 2, 1501);
    			add_location(u1, file, 87, 5, 1538);
    			add_location(b5, file, 87, 16, 1549);
    			add_location(p5, file, 87, 2, 1535);
    			add_location(hr6, file, 88, 2, 1579);
    			attr_dev(article5, "class", "fem svelte-azb90x");
    			add_location(article5, file, 85, 0, 1477);
    			attr_dev(small6, "class", "svelte-azb90x");
    			add_location(small6, file, 92, 2, 1620);
    			add_location(b6, file, 93, 9, 1673);
    			add_location(p6, file, 93, 2, 1666);
    			add_location(hr7, file, 94, 2, 1703);
    			attr_dev(article6, "class", "fem svelte-azb90x");
    			add_location(article6, file, 91, 0, 1596);
    			attr_dev(small7, "class", "svelte-azb90x");
    			add_location(small7, file, 98, 2, 1744);
    			add_location(b7, file, 99, 9, 1795);
    			add_location(p7, file, 99, 2, 1788);
    			add_location(hr8, file, 100, 2, 1828);
    			attr_dev(article7, "class", "fem svelte-azb90x");
    			add_location(article7, file, 97, 0, 1720);
    			attr_dev(small8, "class", "neutral");
    			add_location(small8, file, 104, 2, 1857);
    			add_location(b8, file, 105, 9, 1922);
    			add_location(p8, file, 105, 2, 1915);
    			add_location(hr9, file, 106, 2, 1954);
    			add_location(article8, file, 103, 0, 1845);
    			add_location(small9, file, 111, 2, 1984);
    			add_location(u2, file, 112, 5, 2043);
    			add_location(b9, file, 112, 16, 2054);
    			add_location(p9, file, 112, 2, 2040);
    			add_location(hr10, file, 113, 2, 2086);
    			add_location(article9, file, 110, 0, 1972);
    			attr_dev(small10, "class", "svelte-azb90x");
    			add_location(small10, file, 118, 2, 2129);
    			add_location(b10, file, 119, 10, 2173);
    			add_location(p10, file, 119, 2, 2165);
    			add_location(hr11, file, 120, 2, 2198);
    			attr_dev(article10, "class", "masc svelte-azb90x");
    			add_location(article10, file, 117, 0, 2104);
    			attr_dev(small11, "class", "svelte-azb90x");
    			add_location(small11, file, 124, 2, 2240);
    			add_location(u3, file, 125, 5, 2279);
    			add_location(b11, file, 125, 16, 2290);
    			add_location(p11, file, 125, 2, 2276);
    			add_location(hr12, file, 126, 2, 2315);
    			attr_dev(article11, "class", "masc svelte-azb90x");
    			add_location(article11, file, 123, 0, 2215);
    			attr_dev(small12, "class", "svelte-azb90x");
    			add_location(small12, file, 130, 2, 2356);
    			add_location(b12, file, 131, 10, 2393);
    			add_location(p12, file, 131, 2, 2385);
    			add_location(hr13, file, 132, 2, 2418);
    			attr_dev(article12, "class", "fem svelte-azb90x");
    			add_location(article12, file, 129, 0, 2332);
    			attr_dev(small13, "class", "svelte-azb90x");
    			add_location(small13, file, 136, 2, 2459);
    			add_location(u4, file, 137, 5, 2493);
    			add_location(b13, file, 137, 16, 2504);
    			add_location(p13, file, 137, 2, 2490);
    			add_location(hr14, file, 138, 2, 2529);
    			attr_dev(article13, "class", "fem svelte-azb90x");
    			add_location(article13, file, 135, 0, 2435);
    			add_location(small14, file, 143, 2, 2559);
    			add_location(b14, file, 144, 9, 2606);
    			add_location(p14, file, 144, 2, 2599);
    			add_location(hr15, file, 145, 2, 2633);
    			add_location(article14, file, 142, 0, 2547);
    			add_location(small15, file, 149, 2, 2662);
    			add_location(u5, file, 150, 5, 2719);
    			add_location(b15, file, 150, 16, 2730);
    			add_location(p15, file, 150, 2, 2716);
    			add_location(hr16, file, 151, 2, 2757);
    			add_location(article15, file, 148, 0, 2650);
    			add_location(small16, file, 156, 2, 2787);
    			add_location(b16, file, 157, 5, 2823);
    			add_location(p16, file, 157, 2, 2820);
    			add_location(hr17, file, 158, 2, 2846);
    			add_location(article16, file, 155, 0, 2775);
    			add_location(small17, file, 162, 2, 2875);
    			add_location(b17, file, 163, 5, 2918);
    			add_location(p17, file, 163, 2, 2915);
    			add_location(hr18, file, 164, 2, 2943);
    			add_location(article17, file, 161, 0, 2863);
    			attr_dev(small18, "class", "svelte-azb90x");
    			add_location(small18, file, 168, 2, 2985);
    			add_location(b18, file, 169, 9, 3026);
    			add_location(p18, file, 169, 2, 3019);
    			add_location(hr19, file, 170, 2, 3052);
    			attr_dev(article18, "class", "masc svelte-azb90x");
    			add_location(article18, file, 167, 0, 2960);
    			attr_dev(small19, "class", "svelte-azb90x");
    			add_location(small19, file, 174, 2, 3094);
    			add_location(b19, file, 175, 9, 3133);
    			add_location(p19, file, 175, 2, 3126);
    			add_location(hr20, file, 176, 2, 3161);
    			attr_dev(article19, "class", "masc svelte-azb90x");
    			add_location(article19, file, 173, 0, 3069);
    			attr_dev(small20, "class", "svelte-azb90x");
    			add_location(small20, file, 181, 2, 3203);
    			add_location(b20, file, 182, 9, 3242);
    			add_location(p20, file, 182, 2, 3235);
    			add_location(hr21, file, 183, 2, 3267);
    			attr_dev(article20, "class", "fem svelte-azb90x");
    			add_location(article20, file, 180, 0, 3179);
    			attr_dev(small21, "class", "svelte-azb90x");
    			add_location(small21, file, 187, 2, 3308);
    			add_location(b21, file, 188, 9, 3347);
    			add_location(p21, file, 188, 2, 3340);
    			add_location(hr22, file, 189, 2, 3375);
    			attr_dev(article21, "class", "fem svelte-azb90x");
    			add_location(article21, file, 186, 0, 3284);
    			attr_dev(div1, "id", "form");
    			attr_dev(div1, "class", "svelte-azb90x");
    			add_location(div1, file, 43, 0, 630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*gerund*/ ctx[0]);
    			append_dev(div0, t2);
    			append_dev(div0, input1);
    			append_dev(div1, t3);
    			append_dev(div1, hr0);
    			append_dev(div1, t4);
    			append_dev(div1, article0);
    			append_dev(article0, small0);
    			append_dev(article0, t6);
    			append_dev(article0, p0);
    			append_dev(p0, t7);
    			append_dev(p0, b0);
    			append_dev(b0, t8);
    			append_dev(p0, t9);
    			append_dev(article0, t10);
    			append_dev(article0, hr1);
    			append_dev(div1, t11);
    			append_dev(div1, article1);
    			append_dev(article1, small1);
    			append_dev(article1, t13);
    			append_dev(article1, p1);
    			append_dev(p1, u0);
    			append_dev(p1, t15);
    			append_dev(p1, b1);
    			append_dev(b1, t16);
    			append_dev(p1, t17);
    			append_dev(article1, t18);
    			append_dev(article1, hr2);
    			append_dev(div1, t19);
    			append_dev(div1, article2);
    			append_dev(article2, small2);
    			append_dev(article2, t21);
    			append_dev(article2, p2);
    			append_dev(p2, t22);
    			append_dev(p2, b2);
    			append_dev(b2, t23);
    			append_dev(p2, t24);
    			append_dev(article2, t25);
    			append_dev(article2, hr3);
    			append_dev(div1, t26);
    			append_dev(div1, article3);
    			append_dev(article3, small3);
    			append_dev(article3, t28);
    			append_dev(article3, p3);
    			append_dev(p3, t29);
    			append_dev(p3, b3);
    			append_dev(b3, t30);
    			append_dev(p3, t31);
    			append_dev(article3, t32);
    			append_dev(article3, hr4);
    			append_dev(div1, t33);
    			append_dev(div1, article4);
    			append_dev(article4, small4);
    			append_dev(article4, t35);
    			append_dev(article4, p4);
    			append_dev(p4, t36);
    			append_dev(p4, b4);
    			append_dev(b4, t37);
    			append_dev(p4, t38);
    			append_dev(article4, t39);
    			append_dev(article4, hr5);
    			append_dev(div1, t40);
    			append_dev(div1, article5);
    			append_dev(article5, small5);
    			append_dev(article5, t42);
    			append_dev(article5, p5);
    			append_dev(p5, u1);
    			append_dev(p5, t44);
    			append_dev(p5, b5);
    			append_dev(b5, t45);
    			append_dev(p5, t46);
    			append_dev(article5, t47);
    			append_dev(article5, hr6);
    			append_dev(div1, t48);
    			append_dev(div1, article6);
    			append_dev(article6, small6);
    			append_dev(article6, t50);
    			append_dev(article6, p6);
    			append_dev(p6, t51);
    			append_dev(p6, b6);
    			append_dev(b6, t52);
    			append_dev(p6, t53);
    			append_dev(article6, t54);
    			append_dev(article6, hr7);
    			append_dev(div1, t55);
    			append_dev(div1, article7);
    			append_dev(article7, small7);
    			append_dev(article7, t57);
    			append_dev(article7, p7);
    			append_dev(p7, t58);
    			append_dev(p7, b7);
    			append_dev(b7, t59);
    			append_dev(p7, t60);
    			append_dev(article7, t61);
    			append_dev(article7, hr8);
    			append_dev(div1, t62);
    			append_dev(div1, article8);
    			append_dev(article8, small8);
    			append_dev(article8, t64);
    			append_dev(article8, p8);
    			append_dev(p8, t65);
    			append_dev(p8, b8);
    			append_dev(b8, t66);
    			append_dev(p8, t67);
    			append_dev(article8, t68);
    			append_dev(article8, hr9);
    			append_dev(div1, t69);
    			append_dev(div1, article9);
    			append_dev(article9, small9);
    			append_dev(article9, t71);
    			append_dev(article9, p9);
    			append_dev(p9, u2);
    			append_dev(p9, t73);
    			append_dev(p9, b9);
    			append_dev(b9, t74);
    			append_dev(p9, t75);
    			append_dev(article9, t76);
    			append_dev(article9, hr10);
    			append_dev(div1, t77);
    			append_dev(div1, article10);
    			append_dev(article10, small10);
    			append_dev(article10, t79);
    			append_dev(article10, p10);
    			append_dev(p10, t80);
    			append_dev(p10, b10);
    			append_dev(b10, t81);
    			append_dev(p10, t82);
    			append_dev(article10, t83);
    			append_dev(article10, hr11);
    			append_dev(div1, t84);
    			append_dev(div1, article11);
    			append_dev(article11, small11);
    			append_dev(article11, t86);
    			append_dev(article11, p11);
    			append_dev(p11, u3);
    			append_dev(p11, t88);
    			append_dev(p11, b11);
    			append_dev(b11, t89);
    			append_dev(p11, t90);
    			append_dev(article11, t91);
    			append_dev(article11, hr12);
    			append_dev(div1, t92);
    			append_dev(div1, article12);
    			append_dev(article12, small12);
    			append_dev(article12, t94);
    			append_dev(article12, p12);
    			append_dev(p12, t95);
    			append_dev(p12, b12);
    			append_dev(b12, t96);
    			append_dev(p12, t97);
    			append_dev(article12, t98);
    			append_dev(article12, hr13);
    			append_dev(div1, t99);
    			append_dev(div1, article13);
    			append_dev(article13, small13);
    			append_dev(article13, t101);
    			append_dev(article13, p13);
    			append_dev(p13, u4);
    			append_dev(p13, t103);
    			append_dev(p13, b13);
    			append_dev(b13, t104);
    			append_dev(p13, t105);
    			append_dev(article13, t106);
    			append_dev(article13, hr14);
    			append_dev(div1, t107);
    			append_dev(div1, article14);
    			append_dev(article14, small14);
    			append_dev(article14, t109);
    			append_dev(article14, p14);
    			append_dev(p14, t110);
    			append_dev(p14, b14);
    			append_dev(b14, t111);
    			append_dev(p14, t112);
    			append_dev(article14, t113);
    			append_dev(article14, hr15);
    			append_dev(div1, t114);
    			append_dev(div1, article15);
    			append_dev(article15, small15);
    			append_dev(article15, t116);
    			append_dev(article15, p15);
    			append_dev(p15, u5);
    			append_dev(p15, t118);
    			append_dev(p15, b15);
    			append_dev(b15, t119);
    			append_dev(p15, t120);
    			append_dev(article15, t121);
    			append_dev(article15, hr16);
    			append_dev(div1, t122);
    			append_dev(div1, article16);
    			append_dev(article16, small16);
    			append_dev(article16, t124);
    			append_dev(article16, p16);
    			append_dev(p16, b16);
    			append_dev(b16, t125);
    			append_dev(p16, t126);
    			append_dev(article16, t127);
    			append_dev(article16, hr17);
    			append_dev(div1, t128);
    			append_dev(div1, article17);
    			append_dev(article17, small17);
    			append_dev(article17, t130);
    			append_dev(article17, p17);
    			append_dev(p17, b17);
    			append_dev(b17, t131);
    			append_dev(p17, t132);
    			append_dev(article17, t133);
    			append_dev(article17, hr18);
    			append_dev(div1, t134);
    			append_dev(div1, article18);
    			append_dev(article18, small18);
    			append_dev(article18, t136);
    			append_dev(article18, p18);
    			append_dev(p18, t137);
    			append_dev(p18, b18);
    			append_dev(b18, t138);
    			append_dev(p18, t139);
    			append_dev(article18, t140);
    			append_dev(article18, hr19);
    			append_dev(div1, t141);
    			append_dev(div1, article19);
    			append_dev(article19, small19);
    			append_dev(article19, t143);
    			append_dev(article19, p19);
    			append_dev(p19, t144);
    			append_dev(p19, b19);
    			append_dev(b19, t145);
    			append_dev(p19, t146);
    			append_dev(article19, t147);
    			append_dev(article19, hr20);
    			append_dev(div1, t148);
    			append_dev(div1, article20);
    			append_dev(article20, small20);
    			append_dev(article20, t150);
    			append_dev(article20, p20);
    			append_dev(p20, t151);
    			append_dev(p20, b20);
    			append_dev(b20, t152);
    			append_dev(p20, t153);
    			append_dev(article20, t154);
    			append_dev(article20, hr21);
    			append_dev(div1, t155);
    			append_dev(div1, article21);
    			append_dev(article21, small21);
    			append_dev(article21, t157);
    			append_dev(article21, p21);
    			append_dev(p21, t158);
    			append_dev(p21, b21);
    			append_dev(b21, t159);
    			append_dev(p21, t160);
    			append_dev(article21, t161);
    			append_dev(article21, hr22);

    			if (!mounted) {
    				dispose = listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*gerund*/ 1 && input0.value !== /*gerund*/ ctx[0]) {
    				set_input_value(input0, /*gerund*/ ctx[0]);
    			}

    			if (dirty & /*bones*/ 2) set_data_dev(t8, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t16, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t23, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t30, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t37, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t45, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t52, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t59, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t66, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t74, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t81, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t89, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t96, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t104, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t111, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t119, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t125, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t131, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t138, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t145, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t152, /*bones*/ ctx[1]);
    			if (dirty & /*bones*/ 2) set_data_dev(t159, /*bones*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sanitize(gerund) {
    	let pieces = gerund.split("na");

    	if (pieces.length > 1) {
    		return pieces.splice(0, pieces.length - 2).join('na') + 'na';
    	} else {
    		return gerund;
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let bones;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let gerund = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		gerund = this.value;
    		$$invalidate(0, gerund);
    	}

    	$$self.$capture_state = () => ({ ContactCard, gerund, sanitize, bones });

    	$$self.$inject_state = $$props => {
    		if ('gerund' in $$props) $$invalidate(0, gerund = $$props.gerund);
    		if ('bones' in $$props) $$invalidate(1, bones = $$props.bones);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*gerund*/ 1) {
    			$$invalidate(1, bones = sanitize(gerund));
    		}
    	};

    	return [gerund, bones, input0_input_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
