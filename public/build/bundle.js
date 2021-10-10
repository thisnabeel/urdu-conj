
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function self$1(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
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
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    const file$3 = "src/ContactCard.svelte";

    function create_fragment$3(ctx) {
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
    			add_location(img, file$3, 69, 6, 1115);
    			attr_dev(div0, "class", "thumb svelte-p7z0xn");
    			toggle_class(div0, "thumb-placeholder", !/*userImage*/ ctx[3]);
    			add_location(div0, file$3, 68, 4, 1050);
    			attr_dev(h1, "class", "svelte-p7z0xn");
    			add_location(h1, file$3, 72, 6, 1199);
    			attr_dev(h2, "class", "svelte-p7z0xn");
    			add_location(h2, file$3, 73, 6, 1225);
    			attr_dev(div1, "class", "user-data svelte-p7z0xn");
    			add_location(div1, file$3, 71, 4, 1169);
    			attr_dev(header, "class", "svelte-p7z0xn");
    			add_location(header, file$3, 67, 2, 1037);
    			add_location(p, file$3, 77, 4, 1300);
    			attr_dev(div2, "class", "description svelte-p7z0xn");
    			add_location(div2, file$3, 76, 2, 1270);
    			attr_dev(div3, "class", "contact-card svelte-p7z0xn");
    			add_location(div3, file$3, 66, 0, 1008);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			userName: 0,
    			jobTitle: 1,
    			description: 2,
    			userImage: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactCard",
    			options,
    			id: create_fragment$3.name
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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    		path: basedir,
    		exports: {},
    		require: function (path, base) {
    			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    		}
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var sweetalert2_all = createCommonjsModule(function (module, exports) {
    /*!
    * sweetalert2 v11.1.7
    * Released under the MIT License.
    */
    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, function () {
      const DismissReason = Object.freeze({
        cancel: 'cancel',
        backdrop: 'backdrop',
        close: 'close',
        esc: 'esc',
        timer: 'timer'
      });

      const consolePrefix = 'SweetAlert2:';
      /**
       * Filter the unique values into a new array
       * @param arr
       */

      const uniqueArray = arr => {
        const result = [];

        for (let i = 0; i < arr.length; i++) {
          if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
          }
        }

        return result;
      };
      /**
       * Capitalize the first letter of a string
       * @param str
       */

      const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
      /**
       * Convert NodeList to Array
       * @param nodeList
       */

      const toArray = nodeList => Array.prototype.slice.call(nodeList);
      /**
       * Standardise console warnings
       * @param message
       */

      const warn = message => {
        console.warn("".concat(consolePrefix, " ").concat(typeof message === 'object' ? message.join(' ') : message));
      };
      /**
       * Standardise console errors
       * @param message
       */

      const error = message => {
        console.error("".concat(consolePrefix, " ").concat(message));
      };
      /**
       * Private global state for `warnOnce`
       * @type {Array}
       * @private
       */

      const previousWarnOnceMessages = [];
      /**
       * Show a console warning, but only if it hasn't already been shown
       * @param message
       */

      const warnOnce = message => {
        if (!previousWarnOnceMessages.includes(message)) {
          previousWarnOnceMessages.push(message);
          warn(message);
        }
      };
      /**
       * Show a one-time console warning about deprecated params/methods
       */

      const warnAboutDeprecation = (deprecatedParam, useInstead) => {
        warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
      };
      /**
       * If `arg` is a function, call it (with no arguments or context) and return the result.
       * Otherwise, just pass the value through
       * @param arg
       */

      const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;
      const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';
      const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
      const isPromise = arg => arg && Promise.resolve(arg) === arg;

      const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;

      const isElement = elem => elem instanceof Element || isJqueryElement(elem);

      const argsToParams = args => {
        const params = {};

        if (typeof args[0] === 'object' && !isElement(args[0])) {
          Object.assign(params, args[0]);
        } else {
          ['title', 'html', 'icon'].forEach((name, index) => {
            const arg = args[index];

            if (typeof arg === 'string' || isElement(arg)) {
              params[name] = arg;
            } else if (arg !== undefined) {
              error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(typeof arg));
            }
          });
        }

        return params;
      };

      const swalPrefix = 'swal2-';
      const prefix = items => {
        const result = {};

        for (const i in items) {
          result[items[i]] = swalPrefix + items[i];
        }

        return result;
      };
      const swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error']);
      const iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

      const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));
      const elementBySelector = selectorString => {
        const container = getContainer();
        return container ? container.querySelector(selectorString) : null;
      };

      const elementByClass = className => {
        return elementBySelector(".".concat(className));
      };

      const getPopup = () => elementByClass(swalClasses.popup);
      const getIcon = () => elementByClass(swalClasses.icon);
      const getTitle = () => elementByClass(swalClasses.title);
      const getHtmlContainer = () => elementByClass(swalClasses['html-container']);
      const getImage = () => elementByClass(swalClasses.image);
      const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);
      const getValidationMessage = () => elementByClass(swalClasses['validation-message']);
      const getConfirmButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
      const getDenyButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
      const getInputLabel = () => elementByClass(swalClasses['input-label']);
      const getLoader = () => elementBySelector(".".concat(swalClasses.loader));
      const getCancelButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
      const getActions = () => elementByClass(swalClasses.actions);
      const getFooter = () => elementByClass(swalClasses.footer);
      const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);
      const getCloseButton = () => elementByClass(swalClasses.close); // https://github.com/jkup/focusable/blob/master/index.js

      const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
      const getFocusableElements = () => {
        const focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
        .sort((a, b) => {
          a = parseInt(a.getAttribute('tabindex'));
          b = parseInt(b.getAttribute('tabindex'));

          if (a > b) {
            return 1;
          } else if (a < b) {
            return -1;
          }

          return 0;
        });
        const otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(el => el.getAttribute('tabindex') !== '-1');
        return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(el => isVisible(el));
      };
      const isModal = () => {
        return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
      };
      const isToast = () => {
        return document.body.classList.contains(swalClasses['toast-shown']);
      };
      const isLoading = () => {
        return getPopup().hasAttribute('data-loading');
      };

      const states = {
        previousBodyPadding: null
      };
      const setInnerHtml = (elem, html) => {
        // #1926
        elem.textContent = '';

        if (html) {
          const parser = new DOMParser();
          const parsed = parser.parseFromString(html, "text/html");
          toArray(parsed.querySelector('head').childNodes).forEach(child => {
            elem.appendChild(child);
          });
          toArray(parsed.querySelector('body').childNodes).forEach(child => {
            elem.appendChild(child);
          });
        }
      };
      const hasClass = (elem, className) => {
        if (!className) {
          return false;
        }

        const classList = className.split(/\s+/);

        for (let i = 0; i < classList.length; i++) {
          if (!elem.classList.contains(classList[i])) {
            return false;
          }
        }

        return true;
      };

      const removeCustomClasses = (elem, params) => {
        toArray(elem.classList).forEach(className => {
          if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
            elem.classList.remove(className);
          }
        });
      };

      const applyCustomClass = (elem, params, className) => {
        removeCustomClasses(elem, params);

        if (params.customClass && params.customClass[className]) {
          if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
            return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(typeof params.customClass[className], "\""));
          }

          addClass(elem, params.customClass[className]);
        }
      };
      const getInput = (popup, inputType) => {
        if (!inputType) {
          return null;
        }

        switch (inputType) {
          case 'select':
          case 'textarea':
          case 'file':
            return getChildByClass(popup, swalClasses[inputType]);

          case 'checkbox':
            return popup.querySelector(".".concat(swalClasses.checkbox, " input"));

          case 'radio':
            return popup.querySelector(".".concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.radio, " input:first-child"));

          case 'range':
            return popup.querySelector(".".concat(swalClasses.range, " input"));

          default:
            return getChildByClass(popup, swalClasses.input);
        }
      };
      const focusInput = input => {
        input.focus(); // place cursor at end of text in text input

        if (input.type !== 'file') {
          // http://stackoverflow.com/a/2345915
          const val = input.value;
          input.value = '';
          input.value = val;
        }
      };
      const toggleClass = (target, classList, condition) => {
        if (!target || !classList) {
          return;
        }

        if (typeof classList === 'string') {
          classList = classList.split(/\s+/).filter(Boolean);
        }

        classList.forEach(className => {
          if (target.forEach) {
            target.forEach(elem => {
              condition ? elem.classList.add(className) : elem.classList.remove(className);
            });
          } else {
            condition ? target.classList.add(className) : target.classList.remove(className);
          }
        });
      };
      const addClass = (target, classList) => {
        toggleClass(target, classList, true);
      };
      const removeClass = (target, classList) => {
        toggleClass(target, classList, false);
      };
      const getChildByClass = (elem, className) => {
        for (let i = 0; i < elem.childNodes.length; i++) {
          if (hasClass(elem.childNodes[i], className)) {
            return elem.childNodes[i];
          }
        }
      };
      const applyNumericalStyle = (elem, property, value) => {
        if (value === "".concat(parseInt(value))) {
          value = parseInt(value);
        }

        if (value || parseInt(value) === 0) {
          elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
        } else {
          elem.style.removeProperty(property);
        }
      };
      const show = (elem, display = 'flex') => {
        elem.style.display = display;
      };
      const hide = elem => {
        elem.style.display = 'none';
      };
      const setStyle = (parent, selector, property, value) => {
        const el = parent.querySelector(selector);

        if (el) {
          el.style[property] = value;
        }
      };
      const toggle = (elem, condition, display) => {
        condition ? show(elem, display) : hide(elem);
      }; // borrowed from jquery $(elem).is(':visible') implementation

      const isVisible = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
      const allButtonsAreHidden = () => !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
      const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight); // borrowed from https://stackoverflow.com/a/46352119

      const hasCssAnimation = elem => {
        const style = window.getComputedStyle(elem);
        const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
        const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
        return animDuration > 0 || transDuration > 0;
      };
      const animateTimerProgressBar = (timer, reset = false) => {
        const timerProgressBar = getTimerProgressBar();

        if (isVisible(timerProgressBar)) {
          if (reset) {
            timerProgressBar.style.transition = 'none';
            timerProgressBar.style.width = '100%';
          }

          setTimeout(() => {
            timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
            timerProgressBar.style.width = '0%';
          }, 10);
        }
      };
      const stopTimerProgressBar = () => {
        const timerProgressBar = getTimerProgressBar();
        const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        timerProgressBar.style.removeProperty('transition');
        timerProgressBar.style.width = '100%';
        const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        const timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
        timerProgressBar.style.removeProperty('transition');
        timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
      };

      // Detect Node env
      const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

      const sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses['html-container'], "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n   <div class=\"").concat(swalClasses.icon, "\"></div>\n   <img class=\"").concat(swalClasses.image, "\" />\n   <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n   <div class=\"").concat(swalClasses['html-container'], "\" id=\"").concat(swalClasses['html-container'], "\"></div>\n   <input class=\"").concat(swalClasses.input, "\" />\n   <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n   <div class=\"").concat(swalClasses.range, "\">\n     <input type=\"range\" />\n     <output></output>\n   </div>\n   <select class=\"").concat(swalClasses.select, "\"></select>\n   <div class=\"").concat(swalClasses.radio, "\"></div>\n   <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n     <input type=\"checkbox\" />\n     <span class=\"").concat(swalClasses.label, "\"></span>\n   </label>\n   <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n   <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

      const resetOldContainer = () => {
        const oldContainer = getContainer();

        if (!oldContainer) {
          return false;
        }

        oldContainer.remove();
        removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
        return true;
      };

      const resetValidationMessage = () => {
        if (Swal.isVisible()) {
          Swal.resetValidationMessage();
        }
      };

      const addInputChangeListeners = () => {
        const popup = getPopup();
        const input = getChildByClass(popup, swalClasses.input);
        const file = getChildByClass(popup, swalClasses.file);
        const range = popup.querySelector(".".concat(swalClasses.range, " input"));
        const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
        const select = getChildByClass(popup, swalClasses.select);
        const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
        const textarea = getChildByClass(popup, swalClasses.textarea);
        input.oninput = resetValidationMessage;
        file.onchange = resetValidationMessage;
        select.onchange = resetValidationMessage;
        checkbox.onchange = resetValidationMessage;
        textarea.oninput = resetValidationMessage;

        range.oninput = () => {
          resetValidationMessage();
          rangeOutput.value = range.value;
        };

        range.onchange = () => {
          resetValidationMessage();
          range.nextSibling.value = range.value;
        };
      };

      const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

      const setupAccessibility = params => {
        const popup = getPopup();
        popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
        popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

        if (!params.toast) {
          popup.setAttribute('aria-modal', 'true');
        }
      };

      const setupRTL = targetElement => {
        if (window.getComputedStyle(targetElement).direction === 'rtl') {
          addClass(getContainer(), swalClasses.rtl);
        }
      };
      /*
       * Add modal + backdrop to DOM
       */


      const init = params => {
        // Clean up the old popup container if it exists
        const oldContainerExisted = resetOldContainer();
        /* istanbul ignore if */

        if (isNodeEnv()) {
          error('SweetAlert2 requires document to initialize');
          return;
        }

        const container = document.createElement('div');
        container.className = swalClasses.container;

        if (oldContainerExisted) {
          addClass(container, swalClasses['no-transition']);
        }

        setInnerHtml(container, sweetHTML);
        const targetElement = getTarget(params.target);
        targetElement.appendChild(container);
        setupAccessibility(params);
        setupRTL(targetElement);
        addInputChangeListeners();
      };

      const parseHtmlToContainer = (param, target) => {
        // DOM element
        if (param instanceof HTMLElement) {
          target.appendChild(param); // Object
        } else if (typeof param === 'object') {
          handleObject(param, target); // Plain string
        } else if (param) {
          setInnerHtml(target, param);
        }
      };

      const handleObject = (param, target) => {
        // JQuery element(s)
        if (param.jquery) {
          handleJqueryElem(target, param); // For other objects use their string representation
        } else {
          setInnerHtml(target, param.toString());
        }
      };

      const handleJqueryElem = (target, elem) => {
        target.textContent = '';

        if (0 in elem) {
          for (let i = 0; (i in elem); i++) {
            target.appendChild(elem[i].cloneNode(true));
          }
        } else {
          target.appendChild(elem.cloneNode(true));
        }
      };

      const animationEndEvent = (() => {
        // Prevent run in Node env

        /* istanbul ignore if */
        if (isNodeEnv()) {
          return false;
        }

        const testEl = document.createElement('div');
        const transEndEventNames = {
          WebkitAnimation: 'webkitAnimationEnd',
          OAnimation: 'oAnimationEnd oanimationend',
          animation: 'animationend'
        };

        for (const i in transEndEventNames) {
          if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
            return transEndEventNames[i];
          }
        }

        return false;
      })();

      // https://github.com/twbs/bootstrap/blob/master/js/src/modal.js

      const measureScrollbar = () => {
        const scrollDiv = document.createElement('div');
        scrollDiv.className = swalClasses['scrollbar-measure'];
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      };

      const renderActions = (instance, params) => {
        const actions = getActions();
        const loader = getLoader();
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton(); // Actions (buttons) wrapper

        if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
          hide(actions);
        } else {
          show(actions);
        } // Custom class


        applyCustomClass(actions, params, 'actions'); // Render buttons

        renderButton(confirmButton, 'confirm', params);
        renderButton(denyButton, 'deny', params);
        renderButton(cancelButton, 'cancel', params);
        handleButtonsStyling(confirmButton, denyButton, cancelButton, params);

        if (params.reverseButtons) {
          actions.insertBefore(cancelButton, loader);
          actions.insertBefore(denyButton, loader);
          actions.insertBefore(confirmButton, loader);
        } // Loader


        setInnerHtml(loader, params.loaderHtml);
        applyCustomClass(loader, params, 'loader');
      };

      function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
        if (!params.buttonsStyling) {
          return removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
        }

        addClass([confirmButton, denyButton, cancelButton], swalClasses.styled); // Buttons background colors

        if (params.confirmButtonColor) {
          confirmButton.style.backgroundColor = params.confirmButtonColor;
          addClass(confirmButton, swalClasses['default-outline']);
        }

        if (params.denyButtonColor) {
          denyButton.style.backgroundColor = params.denyButtonColor;
          addClass(denyButton, swalClasses['default-outline']);
        }

        if (params.cancelButtonColor) {
          cancelButton.style.backgroundColor = params.cancelButtonColor;
          addClass(cancelButton, swalClasses['default-outline']);
        }
      }

      function renderButton(button, buttonType, params) {
        toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
        setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

        button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
        // Add buttons custom classes

        button.className = swalClasses[buttonType];
        applyCustomClass(button, params, "".concat(buttonType, "Button"));
        addClass(button, params["".concat(buttonType, "ButtonClass")]);
      }

      function handleBackdropParam(container, backdrop) {
        if (typeof backdrop === 'string') {
          container.style.background = backdrop;
        } else if (!backdrop) {
          addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
        }
      }

      function handlePositionParam(container, position) {
        if (position in swalClasses) {
          addClass(container, swalClasses[position]);
        } else {
          warn('The "position" parameter is not valid, defaulting to "center"');
          addClass(container, swalClasses.center);
        }
      }

      function handleGrowParam(container, grow) {
        if (grow && typeof grow === 'string') {
          const growClass = "grow-".concat(grow);

          if (growClass in swalClasses) {
            addClass(container, swalClasses[growClass]);
          }
        }
      }

      const renderContainer = (instance, params) => {
        const container = getContainer();

        if (!container) {
          return;
        }

        handleBackdropParam(container, params.backdrop);
        handlePositionParam(container, params.position);
        handleGrowParam(container, params.grow); // Custom class

        applyCustomClass(container, params, 'container');
      };

      /**
       * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
       * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
       * This is the approach that Babel will probably take to implement private methods/fields
       *   https://github.com/tc39/proposal-private-methods
       *   https://github.com/babel/babel/pull/7555
       * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
       *   then we can use that language feature.
       */
      var privateProps = {
        promise: new WeakMap(),
        innerParams: new WeakMap(),
        domCache: new WeakMap()
      };

      const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
      const renderInput = (instance, params) => {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(instance);
        const rerender = !innerParams || params.input !== innerParams.input;
        inputTypes.forEach(inputType => {
          const inputClass = swalClasses[inputType];
          const inputContainer = getChildByClass(popup, inputClass); // set attributes

          setAttributes(inputType, params.inputAttributes); // set class

          inputContainer.className = inputClass;

          if (rerender) {
            hide(inputContainer);
          }
        });

        if (params.input) {
          if (rerender) {
            showInput(params);
          } // set custom class


          setCustomClass(params);
        }
      };

      const showInput = params => {
        if (!renderInputType[params.input]) {
          return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
        }

        const inputContainer = getInputContainer(params.input);
        const input = renderInputType[params.input](inputContainer, params);
        show(input); // input autofocus

        setTimeout(() => {
          focusInput(input);
        });
      };

      const removeAttributes = input => {
        for (let i = 0; i < input.attributes.length; i++) {
          const attrName = input.attributes[i].name;

          if (!['type', 'value', 'style'].includes(attrName)) {
            input.removeAttribute(attrName);
          }
        }
      };

      const setAttributes = (inputType, inputAttributes) => {
        const input = getInput(getPopup(), inputType);

        if (!input) {
          return;
        }

        removeAttributes(input);

        for (const attr in inputAttributes) {
          input.setAttribute(attr, inputAttributes[attr]);
        }
      };

      const setCustomClass = params => {
        const inputContainer = getInputContainer(params.input);

        if (params.customClass) {
          addClass(inputContainer, params.customClass.input);
        }
      };

      const setInputPlaceholder = (input, params) => {
        if (!input.placeholder || params.inputPlaceholder) {
          input.placeholder = params.inputPlaceholder;
        }
      };

      const setInputLabel = (input, prependTo, params) => {
        if (params.inputLabel) {
          input.id = swalClasses.input;
          const label = document.createElement('label');
          const labelClass = swalClasses['input-label'];
          label.setAttribute('for', input.id);
          label.className = labelClass;
          addClass(label, params.customClass.inputLabel);
          label.innerText = params.inputLabel;
          prependTo.insertAdjacentElement('beforebegin', label);
        }
      };

      const getInputContainer = inputType => {
        const inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
        return getChildByClass(getPopup(), inputClass);
      };

      const renderInputType = {};

      renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
        if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
          input.value = params.inputValue;
        } else if (!isPromise(params.inputValue)) {
          warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof params.inputValue, "\""));
        }

        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        input.type = params.input;
        return input;
      };

      renderInputType.file = (input, params) => {
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        return input;
      };

      renderInputType.range = (range, params) => {
        const rangeInput = range.querySelector('input');
        const rangeOutput = range.querySelector('output');
        rangeInput.value = params.inputValue;
        rangeInput.type = params.input;
        rangeOutput.value = params.inputValue;
        setInputLabel(rangeInput, range, params);
        return range;
      };

      renderInputType.select = (select, params) => {
        select.textContent = '';

        if (params.inputPlaceholder) {
          const placeholder = document.createElement('option');
          setInnerHtml(placeholder, params.inputPlaceholder);
          placeholder.value = '';
          placeholder.disabled = true;
          placeholder.selected = true;
          select.appendChild(placeholder);
        }

        setInputLabel(select, select, params);
        return select;
      };

      renderInputType.radio = radio => {
        radio.textContent = '';
        return radio;
      };

      renderInputType.checkbox = (checkboxContainer, params) => {
        const checkbox = getInput(getPopup(), 'checkbox');
        checkbox.value = 1;
        checkbox.id = swalClasses.checkbox;
        checkbox.checked = Boolean(params.inputValue);
        const label = checkboxContainer.querySelector('span');
        setInnerHtml(label, params.inputPlaceholder);
        return checkboxContainer;
      };

      renderInputType.textarea = (textarea, params) => {
        textarea.value = params.inputValue;
        setInputPlaceholder(textarea, params);
        setInputLabel(textarea, textarea, params);

        const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

        setTimeout(() => {
          // #2291
          if ('MutationObserver' in window) {
            // #1699
            const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);

            const textareaResizeHandler = () => {
              const textareaWidth = textarea.offsetWidth + getMargin(textarea);

              if (textareaWidth > initialPopupWidth) {
                getPopup().style.width = "".concat(textareaWidth, "px");
              } else {
                getPopup().style.width = null;
              }
            };

            new MutationObserver(textareaResizeHandler).observe(textarea, {
              attributes: true,
              attributeFilter: ['style']
            });
          }
        });
        return textarea;
      };

      const renderContent = (instance, params) => {
        const htmlContainer = getHtmlContainer();
        applyCustomClass(htmlContainer, params, 'htmlContainer'); // Content as HTML

        if (params.html) {
          parseHtmlToContainer(params.html, htmlContainer);
          show(htmlContainer, 'block'); // Content as plain text
        } else if (params.text) {
          htmlContainer.textContent = params.text;
          show(htmlContainer, 'block'); // No content
        } else {
          hide(htmlContainer);
        }

        renderInput(instance, params);
      };

      const renderFooter = (instance, params) => {
        const footer = getFooter();
        toggle(footer, params.footer);

        if (params.footer) {
          parseHtmlToContainer(params.footer, footer);
        } // Custom class


        applyCustomClass(footer, params, 'footer');
      };

      const renderCloseButton = (instance, params) => {
        const closeButton = getCloseButton();
        setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

        applyCustomClass(closeButton, params, 'closeButton');
        toggle(closeButton, params.showCloseButton);
        closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
      };

      const renderIcon = (instance, params) => {
        const innerParams = privateProps.innerParams.get(instance);
        const icon = getIcon(); // if the given icon already rendered, apply the styling without re-rendering the icon

        if (innerParams && params.icon === innerParams.icon) {
          // Custom or default content
          setContent(icon, params);
          applyStyles(icon, params);
          return;
        }

        if (!params.icon && !params.iconHtml) {
          return hide(icon);
        }

        if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
          error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
          return hide(icon);
        }

        show(icon); // Custom or default content

        setContent(icon, params);
        applyStyles(icon, params); // Animate icon

        addClass(icon, params.showClass.icon);
      };

      const applyStyles = (icon, params) => {
        for (const iconType in iconTypes) {
          if (params.icon !== iconType) {
            removeClass(icon, iconTypes[iconType]);
          }
        }

        addClass(icon, iconTypes[params.icon]); // Icon color

        setColor(icon, params); // Success icon background color

        adjustSuccessIconBackgoundColor(); // Custom class

        applyCustomClass(icon, params, 'icon');
      }; // Adjust success icon background color to match the popup background color


      const adjustSuccessIconBackgoundColor = () => {
        const popup = getPopup();
        const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
        const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

        for (let i = 0; i < successIconParts.length; i++) {
          successIconParts[i].style.backgroundColor = popupBackgroundColor;
        }
      };

      const setContent = (icon, params) => {
        icon.textContent = '';

        if (params.iconHtml) {
          setInnerHtml(icon, iconContent(params.iconHtml));
        } else if (params.icon === 'success') {
          setInnerHtml(icon, "\n      <div class=\"swal2-success-circular-line-left\"></div>\n      <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n      <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n      <div class=\"swal2-success-circular-line-right\"></div>\n    ");
        } else if (params.icon === 'error') {
          setInnerHtml(icon, "\n      <span class=\"swal2-x-mark\">\n        <span class=\"swal2-x-mark-line-left\"></span>\n        <span class=\"swal2-x-mark-line-right\"></span>\n      </span>\n    ");
        } else {
          const defaultIconHtml = {
            question: '?',
            warning: '!',
            info: 'i'
          };
          setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
        }
      };

      const setColor = (icon, params) => {
        if (!params.iconColor) {
          return;
        }

        icon.style.color = params.iconColor;
        icon.style.borderColor = params.iconColor;

        for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
          setStyle(icon, sel, 'backgroundColor', params.iconColor);
        }

        setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
      };

      const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");

      const renderImage = (instance, params) => {
        const image = getImage();

        if (!params.imageUrl) {
          return hide(image);
        }

        show(image, ''); // Src, alt

        image.setAttribute('src', params.imageUrl);
        image.setAttribute('alt', params.imageAlt); // Width, height

        applyNumericalStyle(image, 'width', params.imageWidth);
        applyNumericalStyle(image, 'height', params.imageHeight); // Class

        image.className = swalClasses.image;
        applyCustomClass(image, params, 'image');
      };

      const createStepElement = step => {
        const stepEl = document.createElement('li');
        addClass(stepEl, swalClasses['progress-step']);
        setInnerHtml(stepEl, step);
        return stepEl;
      };

      const createLineElement = params => {
        const lineEl = document.createElement('li');
        addClass(lineEl, swalClasses['progress-step-line']);

        if (params.progressStepsDistance) {
          lineEl.style.width = params.progressStepsDistance;
        }

        return lineEl;
      };

      const renderProgressSteps = (instance, params) => {
        const progressStepsContainer = getProgressSteps();

        if (!params.progressSteps || params.progressSteps.length === 0) {
          return hide(progressStepsContainer);
        }

        show(progressStepsContainer);
        progressStepsContainer.textContent = '';

        if (params.currentProgressStep >= params.progressSteps.length) {
          warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
        }

        params.progressSteps.forEach((step, index) => {
          const stepEl = createStepElement(step);
          progressStepsContainer.appendChild(stepEl);

          if (index === params.currentProgressStep) {
            addClass(stepEl, swalClasses['active-progress-step']);
          }

          if (index !== params.progressSteps.length - 1) {
            const lineEl = createLineElement(params);
            progressStepsContainer.appendChild(lineEl);
          }
        });
      };

      const renderTitle = (instance, params) => {
        const title = getTitle();
        toggle(title, params.title || params.titleText, 'block');

        if (params.title) {
          parseHtmlToContainer(params.title, title);
        }

        if (params.titleText) {
          title.innerText = params.titleText;
        } // Custom class


        applyCustomClass(title, params, 'title');
      };

      const renderPopup = (instance, params) => {
        const container = getContainer();
        const popup = getPopup(); // Width

        if (params.toast) {
          // #2170
          applyNumericalStyle(container, 'width', params.width);
          popup.style.width = '100%';
          popup.insertBefore(getLoader(), getIcon());
        } else {
          applyNumericalStyle(popup, 'width', params.width);
        } // Padding


        applyNumericalStyle(popup, 'padding', params.padding); // Background

        if (params.background) {
          popup.style.background = params.background;
        }

        hide(getValidationMessage()); // Classes

        addClasses(popup, params);
      };

      const addClasses = (popup, params) => {
        // Default Class + showClass when updating Swal.update({})
        popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');

        if (params.toast) {
          addClass([document.documentElement, document.body], swalClasses['toast-shown']);
          addClass(popup, swalClasses.toast);
        } else {
          addClass(popup, swalClasses.modal);
        } // Custom class


        applyCustomClass(popup, params, 'popup');

        if (typeof params.customClass === 'string') {
          addClass(popup, params.customClass);
        } // Icon class (#1842)


        if (params.icon) {
          addClass(popup, swalClasses["icon-".concat(params.icon)]);
        }
      };

      const render = (instance, params) => {
        renderPopup(instance, params);
        renderContainer(instance, params);
        renderProgressSteps(instance, params);
        renderIcon(instance, params);
        renderImage(instance, params);
        renderTitle(instance, params);
        renderCloseButton(instance, params);
        renderContent(instance, params);
        renderActions(instance, params);
        renderFooter(instance, params);

        if (typeof params.didRender === 'function') {
          params.didRender(getPopup());
        }
      };

      /*
       * Global function to determine if SweetAlert2 popup is shown
       */

      const isVisible$1 = () => {
        return isVisible(getPopup());
      };
      /*
       * Global function to click 'Confirm' button
       */

      const clickConfirm = () => getConfirmButton() && getConfirmButton().click();
      /*
       * Global function to click 'Deny' button
       */

      const clickDeny = () => getDenyButton() && getDenyButton().click();
      /*
       * Global function to click 'Cancel' button
       */

      const clickCancel = () => getCancelButton() && getCancelButton().click();

      function fire(...args) {
        const Swal = this;
        return new Swal(...args);
      }

      /**
       * Returns an extended version of `Swal` containing `params` as defaults.
       * Useful for reusing Swal configuration.
       *
       * For example:
       *
       * Before:
       * const textPromptOptions = { input: 'text', showCancelButton: true }
       * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
       * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
       *
       * After:
       * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
       * const {value: firstName} = await TextPrompt('What is your first name?')
       * const {value: lastName} = await TextPrompt('What is your last name?')
       *
       * @param mixinParams
       */
      function mixin(mixinParams) {
        class MixinSwal extends this {
          _main(params, priorityMixinParams) {
            return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
          }

        }

        return MixinSwal;
      }

      /**
       * Shows loader (spinner), this is useful with AJAX requests.
       * By default the loader be shown instead of the "Confirm" button.
       */

      const showLoading = buttonToReplace => {
        let popup = getPopup();

        if (!popup) {
          Swal.fire();
        }

        popup = getPopup();
        const loader = getLoader();

        if (isToast()) {
          hide(getIcon());
        } else {
          replaceButton(popup, buttonToReplace);
        }

        show(loader);
        popup.setAttribute('data-loading', true);
        popup.setAttribute('aria-busy', true);
        popup.focus();
      };

      const replaceButton = (popup, buttonToReplace) => {
        const actions = getActions();
        const loader = getLoader();

        if (!buttonToReplace && isVisible(getConfirmButton())) {
          buttonToReplace = getConfirmButton();
        }

        show(actions);

        if (buttonToReplace) {
          hide(buttonToReplace);
          loader.setAttribute('data-button-to-replace', buttonToReplace.className);
        }

        loader.parentNode.insertBefore(loader, buttonToReplace);
        addClass([popup, actions], swalClasses.loading);
      };

      const RESTORE_FOCUS_TIMEOUT = 100;

      const globalState = {};

      const focusPreviousActiveElement = () => {
        if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
          globalState.previousActiveElement.focus();
          globalState.previousActiveElement = null;
        } else if (document.body) {
          document.body.focus();
        }
      }; // Restore previous active (focused) element


      const restoreActiveElement = returnFocus => {
        return new Promise(resolve => {
          if (!returnFocus) {
            return resolve();
          }

          const x = window.scrollX;
          const y = window.scrollY;
          globalState.restoreFocusTimeout = setTimeout(() => {
            focusPreviousActiveElement();
            resolve();
          }, RESTORE_FOCUS_TIMEOUT); // issues/900

          window.scrollTo(x, y);
        });
      };

      /**
       * If `timer` parameter is set, returns number of milliseconds of timer remained.
       * Otherwise, returns undefined.
       */

      const getTimerLeft = () => {
        return globalState.timeout && globalState.timeout.getTimerLeft();
      };
      /**
       * Stop timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const stopTimer = () => {
        if (globalState.timeout) {
          stopTimerProgressBar();
          return globalState.timeout.stop();
        }
      };
      /**
       * Resume timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const resumeTimer = () => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.start();
          animateTimerProgressBar(remaining);
          return remaining;
        }
      };
      /**
       * Resume timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const toggleTimer = () => {
        const timer = globalState.timeout;
        return timer && (timer.running ? stopTimer() : resumeTimer());
      };
      /**
       * Increase timer. Returns number of milliseconds of an updated timer.
       * If `timer` parameter isn't set, returns undefined.
       */

      const increaseTimer = n => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.increase(n);
          animateTimerProgressBar(remaining, true);
          return remaining;
        }
      };
      /**
       * Check if timer is running. Returns true if timer is running
       * or false if timer is paused or stopped.
       * If `timer` parameter isn't set, returns undefined
       */

      const isTimerRunning = () => {
        return globalState.timeout && globalState.timeout.isRunning();
      };

      let bodyClickListenerAdded = false;
      const clickHandlers = {};
      function bindClickHandler(attr = 'data-swal-template') {
        clickHandlers[attr] = this;

        if (!bodyClickListenerAdded) {
          document.body.addEventListener('click', bodyClickListener);
          bodyClickListenerAdded = true;
        }
      }

      const bodyClickListener = event => {
        for (let el = event.target; el && el !== document; el = el.parentNode) {
          for (const attr in clickHandlers) {
            const template = el.getAttribute(attr);

            if (template) {
              clickHandlers[attr].fire({
                template
              });
              return;
            }
          }
        }
      };

      const defaultParams = {
        title: '',
        titleText: '',
        text: '',
        html: '',
        footer: '',
        icon: undefined,
        iconColor: undefined,
        iconHtml: undefined,
        template: undefined,
        toast: false,
        showClass: {
          popup: 'swal2-show',
          backdrop: 'swal2-backdrop-show',
          icon: 'swal2-icon-show'
        },
        hideClass: {
          popup: 'swal2-hide',
          backdrop: 'swal2-backdrop-hide',
          icon: 'swal2-icon-hide'
        },
        customClass: {},
        target: 'body',
        backdrop: true,
        heightAuto: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: true,
        keydownListenerCapture: false,
        showConfirmButton: true,
        showDenyButton: false,
        showCancelButton: false,
        preConfirm: undefined,
        preDeny: undefined,
        confirmButtonText: 'OK',
        confirmButtonAriaLabel: '',
        confirmButtonColor: undefined,
        denyButtonText: 'No',
        denyButtonAriaLabel: '',
        denyButtonColor: undefined,
        cancelButtonText: 'Cancel',
        cancelButtonAriaLabel: '',
        cancelButtonColor: undefined,
        buttonsStyling: true,
        reverseButtons: false,
        focusConfirm: true,
        focusDeny: false,
        focusCancel: false,
        returnFocus: true,
        showCloseButton: false,
        closeButtonHtml: '&times;',
        closeButtonAriaLabel: 'Close this dialog',
        loaderHtml: '',
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
        imageUrl: undefined,
        imageWidth: undefined,
        imageHeight: undefined,
        imageAlt: '',
        timer: undefined,
        timerProgressBar: false,
        width: undefined,
        padding: undefined,
        background: undefined,
        input: undefined,
        inputPlaceholder: '',
        inputLabel: '',
        inputValue: '',
        inputOptions: {},
        inputAutoTrim: true,
        inputAttributes: {},
        inputValidator: undefined,
        returnInputValueOnDeny: false,
        validationMessage: undefined,
        grow: false,
        position: 'center',
        progressSteps: [],
        currentProgressStep: undefined,
        progressStepsDistance: undefined,
        willOpen: undefined,
        didOpen: undefined,
        didRender: undefined,
        willClose: undefined,
        didClose: undefined,
        didDestroy: undefined,
        scrollbarPadding: true
      };
      const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];
      const deprecatedParams = {};
      const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];
      /**
       * Is valid parameter
       * @param {String} paramName
       */

      const isValidParameter = paramName => {
        return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
      };
      /**
       * Is valid parameter for Swal.update() method
       * @param {String} paramName
       */

      const isUpdatableParameter = paramName => {
        return updatableParams.indexOf(paramName) !== -1;
      };
      /**
       * Is deprecated parameter
       * @param {String} paramName
       */

      const isDeprecatedParameter = paramName => {
        return deprecatedParams[paramName];
      };

      const checkIfParamIsValid = param => {
        if (!isValidParameter(param)) {
          warn("Unknown parameter \"".concat(param, "\""));
        }
      };

      const checkIfToastParamIsValid = param => {
        if (toastIncompatibleParams.includes(param)) {
          warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
        }
      };

      const checkIfParamIsDeprecated = param => {
        if (isDeprecatedParameter(param)) {
          warnAboutDeprecation(param, isDeprecatedParameter(param));
        }
      };
      /**
       * Show relevant warnings for given params
       *
       * @param params
       */


      const showWarningsForParams = params => {
        if (!params.backdrop && params.allowOutsideClick) {
          warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
        }

        for (const param in params) {
          checkIfParamIsValid(param);

          if (params.toast) {
            checkIfToastParamIsValid(param);
          }

          checkIfParamIsDeprecated(param);
        }
      };



      var staticMethods = /*#__PURE__*/Object.freeze({
        isValidParameter: isValidParameter,
        isUpdatableParameter: isUpdatableParameter,
        isDeprecatedParameter: isDeprecatedParameter,
        argsToParams: argsToParams,
        isVisible: isVisible$1,
        clickConfirm: clickConfirm,
        clickDeny: clickDeny,
        clickCancel: clickCancel,
        getContainer: getContainer,
        getPopup: getPopup,
        getTitle: getTitle,
        getHtmlContainer: getHtmlContainer,
        getImage: getImage,
        getIcon: getIcon,
        getInputLabel: getInputLabel,
        getCloseButton: getCloseButton,
        getActions: getActions,
        getConfirmButton: getConfirmButton,
        getDenyButton: getDenyButton,
        getCancelButton: getCancelButton,
        getLoader: getLoader,
        getFooter: getFooter,
        getTimerProgressBar: getTimerProgressBar,
        getFocusableElements: getFocusableElements,
        getValidationMessage: getValidationMessage,
        isLoading: isLoading,
        fire: fire,
        mixin: mixin,
        showLoading: showLoading,
        enableLoading: showLoading,
        getTimerLeft: getTimerLeft,
        stopTimer: stopTimer,
        resumeTimer: resumeTimer,
        toggleTimer: toggleTimer,
        increaseTimer: increaseTimer,
        isTimerRunning: isTimerRunning,
        bindClickHandler: bindClickHandler
      });

      /**
       * Hides loader and shows back the button which was hidden by .showLoading()
       */

      function hideLoading() {
        // do nothing if popup is closed
        const innerParams = privateProps.innerParams.get(this);

        if (!innerParams) {
          return;
        }

        const domCache = privateProps.domCache.get(this);
        hide(domCache.loader);

        if (isToast()) {
          if (innerParams.icon) {
            show(getIcon());
          }
        } else {
          showRelatedButton(domCache);
        }

        removeClass([domCache.popup, domCache.actions], swalClasses.loading);
        domCache.popup.removeAttribute('aria-busy');
        domCache.popup.removeAttribute('data-loading');
        domCache.confirmButton.disabled = false;
        domCache.denyButton.disabled = false;
        domCache.cancelButton.disabled = false;
      }

      const showRelatedButton = domCache => {
        const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));

        if (buttonToReplace.length) {
          show(buttonToReplace[0], 'inline-block');
        } else if (allButtonsAreHidden()) {
          hide(domCache.actions);
        }
      };

      function getInput$1(instance) {
        const innerParams = privateProps.innerParams.get(instance || this);
        const domCache = privateProps.domCache.get(instance || this);

        if (!domCache) {
          return null;
        }

        return getInput(domCache.popup, innerParams.input);
      }

      const fixScrollbar = () => {
        // for queues, do not do this more than once
        if (states.previousBodyPadding !== null) {
          return;
        } // if the body has overflow


        if (document.body.scrollHeight > window.innerHeight) {
          // add padding so the content doesn't shift after removal of scrollbar
          states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
          document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
        }
      };
      const undoScrollbar = () => {
        if (states.previousBodyPadding !== null) {
          document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
          states.previousBodyPadding = null;
        }
      };

      /* istanbul ignore file */

      const iOSfix = () => {
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

        if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
          const offset = document.body.scrollTop;
          document.body.style.top = "".concat(offset * -1, "px");
          addClass(document.body, swalClasses.iosfix);
          lockBodyScroll();
          addBottomPaddingForTallPopups(); // #1948
        }
      };

      const addBottomPaddingForTallPopups = () => {
        const safari = !navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i);

        if (safari) {
          const bottomPanelHeight = 44;

          if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
            getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
          }
        }
      };

      const lockBodyScroll = () => {
        // #1246
        const container = getContainer();
        let preventTouchMove;

        container.ontouchstart = e => {
          preventTouchMove = shouldPreventTouchMove(e);
        };

        container.ontouchmove = e => {
          if (preventTouchMove) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
      };

      const shouldPreventTouchMove = event => {
        const target = event.target;
        const container = getContainer();

        if (isStylys(event) || isZoom(event)) {
          return false;
        }

        if (target === container) {
          return true;
        }

        if (!isScrollable(container) && target.tagName !== 'INPUT' && // #1603
        target.tagName !== 'TEXTAREA' && // #2266
        !(isScrollable(getHtmlContainer()) && // #1944
        getHtmlContainer().contains(target))) {
          return true;
        }

        return false;
      };

      const isStylys = event => {
        // #1786
        return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
      };

      const isZoom = event => {
        // #1891
        return event.touches && event.touches.length > 1;
      };

      const undoIOSfix = () => {
        if (hasClass(document.body, swalClasses.iosfix)) {
          const offset = parseInt(document.body.style.top, 10);
          removeClass(document.body, swalClasses.iosfix);
          document.body.style.top = '';
          document.body.scrollTop = offset * -1;
        }
      };

      // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
      // elements not within the active modal dialog will not be surfaced if a user opens a screen
      // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

      const setAriaHidden = () => {
        const bodyChildren = toArray(document.body.children);
        bodyChildren.forEach(el => {
          if (el === getContainer() || el.contains(getContainer())) {
            return;
          }

          if (el.hasAttribute('aria-hidden')) {
            el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
          }

          el.setAttribute('aria-hidden', 'true');
        });
      };
      const unsetAriaHidden = () => {
        const bodyChildren = toArray(document.body.children);
        bodyChildren.forEach(el => {
          if (el.hasAttribute('data-previous-aria-hidden')) {
            el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
            el.removeAttribute('data-previous-aria-hidden');
          } else {
            el.removeAttribute('aria-hidden');
          }
        });
      };

      /**
       * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
       * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
       * This is the approach that Babel will probably take to implement private methods/fields
       *   https://github.com/tc39/proposal-private-methods
       *   https://github.com/babel/babel/pull/7555
       * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
       *   then we can use that language feature.
       */
      var privateMethods = {
        swalPromiseResolve: new WeakMap()
      };

      /*
       * Instance method to close sweetAlert
       */

      function removePopupAndResetState(instance, container, returnFocus, didClose) {
        if (isToast()) {
          triggerDidCloseAndDispose(instance, didClose);
        } else {
          restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
          globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = false;
        }

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // workaround for #2088
        // for some reason removing the container in Safari will scroll the document to bottom

        if (isSafari) {
          container.setAttribute('style', 'display:none !important');
          container.removeAttribute('class');
          container.innerHTML = '';
        } else {
          container.remove();
        }

        if (isModal()) {
          undoScrollbar();
          undoIOSfix();
          unsetAriaHidden();
        }

        removeBodyClasses();
      }

      function removeBodyClasses() {
        removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
      }

      function close(resolveValue) {
        const popup = getPopup();

        if (!popup) {
          return;
        }

        resolveValue = prepareResolveValue(resolveValue);
        const innerParams = privateProps.innerParams.get(this);

        if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
          return;
        }

        const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
        removeClass(popup, innerParams.showClass.popup);
        addClass(popup, innerParams.hideClass.popup);
        const backdrop = getContainer();
        removeClass(backdrop, innerParams.showClass.backdrop);
        addClass(backdrop, innerParams.hideClass.backdrop);
        handlePopupAnimation(this, popup, innerParams); // Resolve Swal promise

        swalPromiseResolve(resolveValue);
      }

      const prepareResolveValue = resolveValue => {
        // When user calls Swal.close()
        if (typeof resolveValue === 'undefined') {
          return {
            isConfirmed: false,
            isDenied: false,
            isDismissed: true
          };
        }

        return Object.assign({
          isConfirmed: false,
          isDenied: false,
          isDismissed: false
        }, resolveValue);
      };

      const handlePopupAnimation = (instance, popup, innerParams) => {
        const container = getContainer(); // If animation is supported, animate

        const animationIsSupported = animationEndEvent && hasCssAnimation(popup);

        if (typeof innerParams.willClose === 'function') {
          innerParams.willClose(popup);
        }

        if (animationIsSupported) {
          animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
        } else {
          // Otherwise, remove immediately
          removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
        }
      };

      const animatePopup = (instance, popup, container, returnFocus, didClose) => {
        globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
        popup.addEventListener(animationEndEvent, function (e) {
          if (e.target === popup) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
        });
      };

      const triggerDidCloseAndDispose = (instance, didClose) => {
        setTimeout(() => {
          if (typeof didClose === 'function') {
            didClose.bind(instance.params)();
          }

          instance._destroy();
        });
      };

      function setButtonsDisabled(instance, buttons, disabled) {
        const domCache = privateProps.domCache.get(instance);
        buttons.forEach(button => {
          domCache[button].disabled = disabled;
        });
      }

      function setInputDisabled(input, disabled) {
        if (!input) {
          return false;
        }

        if (input.type === 'radio') {
          const radiosContainer = input.parentNode.parentNode;
          const radios = radiosContainer.querySelectorAll('input');

          for (let i = 0; i < radios.length; i++) {
            radios[i].disabled = disabled;
          }
        } else {
          input.disabled = disabled;
        }
      }

      function enableButtons() {
        setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
      }
      function disableButtons() {
        setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
      }
      function enableInput() {
        return setInputDisabled(this.getInput(), false);
      }
      function disableInput() {
        return setInputDisabled(this.getInput(), true);
      }

      function showValidationMessage(error) {
        const domCache = privateProps.domCache.get(this);
        const params = privateProps.innerParams.get(this);
        setInnerHtml(domCache.validationMessage, error);
        domCache.validationMessage.className = swalClasses['validation-message'];

        if (params.customClass && params.customClass.validationMessage) {
          addClass(domCache.validationMessage, params.customClass.validationMessage);
        }

        show(domCache.validationMessage);
        const input = this.getInput();

        if (input) {
          input.setAttribute('aria-invalid', true);
          input.setAttribute('aria-describedby', swalClasses['validation-message']);
          focusInput(input);
          addClass(input, swalClasses.inputerror);
        }
      } // Hide block with validation message

      function resetValidationMessage$1() {
        const domCache = privateProps.domCache.get(this);

        if (domCache.validationMessage) {
          hide(domCache.validationMessage);
        }

        const input = this.getInput();

        if (input) {
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-describedby');
          removeClass(input, swalClasses.inputerror);
        }
      }

      function getProgressSteps$1() {
        const domCache = privateProps.domCache.get(this);
        return domCache.progressSteps;
      }

      class Timer {
        constructor(callback, delay) {
          this.callback = callback;
          this.remaining = delay;
          this.running = false;
          this.start();
        }

        start() {
          if (!this.running) {
            this.running = true;
            this.started = new Date();
            this.id = setTimeout(this.callback, this.remaining);
          }

          return this.remaining;
        }

        stop() {
          if (this.running) {
            this.running = false;
            clearTimeout(this.id);
            this.remaining -= new Date() - this.started;
          }

          return this.remaining;
        }

        increase(n) {
          const running = this.running;

          if (running) {
            this.stop();
          }

          this.remaining += n;

          if (running) {
            this.start();
          }

          return this.remaining;
        }

        getTimerLeft() {
          if (this.running) {
            this.stop();
            this.start();
          }

          return this.remaining;
        }

        isRunning() {
          return this.running;
        }

      }

      var defaultInputValidators = {
        email: (string, validationMessage) => {
          return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
        },
        url: (string, validationMessage) => {
          // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
        }
      };

      function setDefaultInputValidators(params) {
        // Use default `inputValidator` for supported input types if not provided
        if (!params.inputValidator) {
          Object.keys(defaultInputValidators).forEach(key => {
            if (params.input === key) {
              params.inputValidator = defaultInputValidators[key];
            }
          });
        }
      }

      function validateCustomTargetElement(params) {
        // Determine if the custom target element is valid
        if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
          warn('Target parameter is not valid, defaulting to "body"');
          params.target = 'body';
        }
      }
      /**
       * Set type, text and actions on popup
       *
       * @param params
       * @returns {boolean}
       */


      function setParameters(params) {
        setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

        if (params.showLoaderOnConfirm && !params.preConfirm) {
          warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
        }

        validateCustomTargetElement(params); // Replace newlines with <br> in title

        if (typeof params.title === 'string') {
          params.title = params.title.split('\n').join('<br />');
        }

        init(params);
      }

      const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];
      const getTemplateParams = params => {
        const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;

        if (!template) {
          return {};
        }

        const templateContent = template.content;
        showWarningsForElements(templateContent);
        const result = Object.assign(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
        return result;
      };

      const getSwalParams = templateContent => {
        const result = {};
        toArray(templateContent.querySelectorAll('swal-param')).forEach(param => {
          showWarningsForAttributes(param, ['name', 'value']);
          const paramName = param.getAttribute('name');
          let value = param.getAttribute('value');

          if (typeof defaultParams[paramName] === 'boolean' && value === 'false') {
            value = false;
          }

          if (typeof defaultParams[paramName] === 'object') {
            value = JSON.parse(value);
          }

          result[paramName] = value;
        });
        return result;
      };

      const getSwalButtons = templateContent => {
        const result = {};
        toArray(templateContent.querySelectorAll('swal-button')).forEach(button => {
          showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
          const type = button.getAttribute('type');
          result["".concat(type, "ButtonText")] = button.innerHTML;
          result["show".concat(capitalizeFirstLetter(type), "Button")] = true;

          if (button.hasAttribute('color')) {
            result["".concat(type, "ButtonColor")] = button.getAttribute('color');
          }

          if (button.hasAttribute('aria-label')) {
            result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
          }
        });
        return result;
      };

      const getSwalImage = templateContent => {
        const result = {};
        const image = templateContent.querySelector('swal-image');

        if (image) {
          showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);

          if (image.hasAttribute('src')) {
            result.imageUrl = image.getAttribute('src');
          }

          if (image.hasAttribute('width')) {
            result.imageWidth = image.getAttribute('width');
          }

          if (image.hasAttribute('height')) {
            result.imageHeight = image.getAttribute('height');
          }

          if (image.hasAttribute('alt')) {
            result.imageAlt = image.getAttribute('alt');
          }
        }

        return result;
      };

      const getSwalIcon = templateContent => {
        const result = {};
        const icon = templateContent.querySelector('swal-icon');

        if (icon) {
          showWarningsForAttributes(icon, ['type', 'color']);

          if (icon.hasAttribute('type')) {
            result.icon = icon.getAttribute('type');
          }

          if (icon.hasAttribute('color')) {
            result.iconColor = icon.getAttribute('color');
          }

          result.iconHtml = icon.innerHTML;
        }

        return result;
      };

      const getSwalInput = templateContent => {
        const result = {};
        const input = templateContent.querySelector('swal-input');

        if (input) {
          showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
          result.input = input.getAttribute('type') || 'text';

          if (input.hasAttribute('label')) {
            result.inputLabel = input.getAttribute('label');
          }

          if (input.hasAttribute('placeholder')) {
            result.inputPlaceholder = input.getAttribute('placeholder');
          }

          if (input.hasAttribute('value')) {
            result.inputValue = input.getAttribute('value');
          }
        }

        const inputOptions = templateContent.querySelectorAll('swal-input-option');

        if (inputOptions.length) {
          result.inputOptions = {};
          toArray(inputOptions).forEach(option => {
            showWarningsForAttributes(option, ['value']);
            const optionValue = option.getAttribute('value');
            const optionName = option.innerHTML;
            result.inputOptions[optionValue] = optionName;
          });
        }

        return result;
      };

      const getSwalStringParams = (templateContent, paramNames) => {
        const result = {};

        for (const i in paramNames) {
          const paramName = paramNames[i];
          const tag = templateContent.querySelector(paramName);

          if (tag) {
            showWarningsForAttributes(tag, []);
            result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
          }
        }

        return result;
      };

      const showWarningsForElements = template => {
        const allowedElements = swalStringParams.concat(['swal-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
        toArray(template.children).forEach(el => {
          const tagName = el.tagName.toLowerCase();

          if (allowedElements.indexOf(tagName) === -1) {
            warn("Unrecognized element <".concat(tagName, ">"));
          }
        });
      };

      const showWarningsForAttributes = (el, allowedAttributes) => {
        toArray(el.attributes).forEach(attribute => {
          if (allowedAttributes.indexOf(attribute.name) === -1) {
            warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
          }
        });
      };

      const SHOW_CLASS_TIMEOUT = 10;
      /**
       * Open popup, add necessary classes and styles, fix scrollbar
       *
       * @param params
       */

      const openPopup = params => {
        const container = getContainer();
        const popup = getPopup();

        if (typeof params.willOpen === 'function') {
          params.willOpen(popup);
        }

        const bodyStyles = window.getComputedStyle(document.body);
        const initialBodyOverflow = bodyStyles.overflowY;
        addClasses$1(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

        setTimeout(() => {
          setScrollingVisibility(container, popup);
        }, SHOW_CLASS_TIMEOUT);

        if (isModal()) {
          fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
          setAriaHidden();
        }

        if (!isToast() && !globalState.previousActiveElement) {
          globalState.previousActiveElement = document.activeElement;
        }

        if (typeof params.didOpen === 'function') {
          setTimeout(() => params.didOpen(popup));
        }

        removeClass(container, swalClasses['no-transition']);
      };

      const swalOpenAnimationFinished = event => {
        const popup = getPopup();

        if (event.target !== popup) {
          return;
        }

        const container = getContainer();
        popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
        container.style.overflowY = 'auto';
      };

      const setScrollingVisibility = (container, popup) => {
        if (animationEndEvent && hasCssAnimation(popup)) {
          container.style.overflowY = 'hidden';
          popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
        } else {
          container.style.overflowY = 'auto';
        }
      };

      const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
        iOSfix();

        if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
          fixScrollbar();
        } // sweetalert2/issues/1247


        setTimeout(() => {
          container.scrollTop = 0;
        });
      };

      const addClasses$1 = (container, popup, params) => {
        addClass(container, params.showClass.backdrop); // the workaround with setting/unsetting opacity is needed for #2019 and 2059

        popup.style.setProperty('opacity', '0', 'important');
        show(popup, 'grid');
        setTimeout(() => {
          // Animate popup right after showing it
          addClass(popup, params.showClass.popup); // and remove the opacity workaround

          popup.style.removeProperty('opacity');
        }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

        addClass([document.documentElement, document.body], swalClasses.shown);

        if (params.heightAuto && params.backdrop && !params.toast) {
          addClass([document.documentElement, document.body], swalClasses['height-auto']);
        }
      };

      const handleInputOptionsAndValue = (instance, params) => {
        if (params.input === 'select' || params.input === 'radio') {
          handleInputOptions(instance, params);
        } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
          showLoading(getConfirmButton());
          handleInputValue(instance, params);
        }
      };
      const getInputValue = (instance, innerParams) => {
        const input = instance.getInput();

        if (!input) {
          return null;
        }

        switch (innerParams.input) {
          case 'checkbox':
            return getCheckboxValue(input);

          case 'radio':
            return getRadioValue(input);

          case 'file':
            return getFileValue(input);

          default:
            return innerParams.inputAutoTrim ? input.value.trim() : input.value;
        }
      };

      const getCheckboxValue = input => input.checked ? 1 : 0;

      const getRadioValue = input => input.checked ? input.value : null;

      const getFileValue = input => input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

      const handleInputOptions = (instance, params) => {
        const popup = getPopup();

        const processInputOptions = inputOptions => populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);

        if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
          showLoading(getConfirmButton());
          asPromise(params.inputOptions).then(inputOptions => {
            instance.hideLoading();
            processInputOptions(inputOptions);
          });
        } else if (typeof params.inputOptions === 'object') {
          processInputOptions(params.inputOptions);
        } else {
          error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
        }
      };

      const handleInputValue = (instance, params) => {
        const input = instance.getInput();
        hide(input);
        asPromise(params.inputValue).then(inputValue => {
          input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : "".concat(inputValue);
          show(input);
          input.focus();
          instance.hideLoading();
        }).catch(err => {
          error("Error in inputValue promise: ".concat(err));
          input.value = '';
          show(input);
          input.focus();
          instance.hideLoading();
        });
      };

      const populateInputOptions = {
        select: (popup, inputOptions, params) => {
          const select = getChildByClass(popup, swalClasses.select);

          const renderOption = (parent, optionLabel, optionValue) => {
            const option = document.createElement('option');
            option.value = optionValue;
            setInnerHtml(option, optionLabel);
            option.selected = isSelected(optionValue, params.inputValue);
            parent.appendChild(option);
          };

          inputOptions.forEach(inputOption => {
            const optionValue = inputOption[0];
            const optionLabel = inputOption[1]; // <optgroup> spec:
            // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
            // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
            // check whether this is a <optgroup>

            if (Array.isArray(optionLabel)) {
              // if it is an array, then it is an <optgroup>
              const optgroup = document.createElement('optgroup');
              optgroup.label = optionValue;
              optgroup.disabled = false; // not configurable for now

              select.appendChild(optgroup);
              optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
            } else {
              // case of <option>
              renderOption(select, optionLabel, optionValue);
            }
          });
          select.focus();
        },
        radio: (popup, inputOptions, params) => {
          const radio = getChildByClass(popup, swalClasses.radio);
          inputOptions.forEach(inputOption => {
            const radioValue = inputOption[0];
            const radioLabel = inputOption[1];
            const radioInput = document.createElement('input');
            const radioLabelElement = document.createElement('label');
            radioInput.type = 'radio';
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;

            if (isSelected(radioValue, params.inputValue)) {
              radioInput.checked = true;
            }

            const label = document.createElement('span');
            setInnerHtml(label, radioLabel);
            label.className = swalClasses.label;
            radioLabelElement.appendChild(radioInput);
            radioLabelElement.appendChild(label);
            radio.appendChild(radioLabelElement);
          });
          const radios = radio.querySelectorAll('input');

          if (radios.length) {
            radios[0].focus();
          }
        }
      };
      /**
       * Converts `inputOptions` into an array of `[value, label]`s
       * @param inputOptions
       */

      const formatInputOptions = inputOptions => {
        const result = [];

        if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
          inputOptions.forEach((value, key) => {
            let valueFormatted = value;

            if (typeof valueFormatted === 'object') {
              // case of <optgroup>
              valueFormatted = formatInputOptions(valueFormatted);
            }

            result.push([key, valueFormatted]);
          });
        } else {
          Object.keys(inputOptions).forEach(key => {
            let valueFormatted = inputOptions[key];

            if (typeof valueFormatted === 'object') {
              // case of <optgroup>
              valueFormatted = formatInputOptions(valueFormatted);
            }

            result.push([key, valueFormatted]);
          });
        }

        return result;
      };

      const isSelected = (optionValue, inputValue) => {
        return inputValue && inputValue.toString() === optionValue.toString();
      };

      const handleConfirmButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.input) {
          handleConfirmOrDenyWithInput(instance, 'confirm');
        } else {
          confirm(instance, true);
        }
      };
      const handleDenyButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.returnInputValueOnDeny) {
          handleConfirmOrDenyWithInput(instance, 'deny');
        } else {
          deny(instance, false);
        }
      };
      const handleCancelButtonClick = (instance, dismissWith) => {
        instance.disableButtons();
        dismissWith(DismissReason.cancel);
      };

      const handleConfirmOrDenyWithInput = (instance, type
      /* 'confirm' | 'deny' */
      ) => {
        const innerParams = privateProps.innerParams.get(instance);
        const inputValue = getInputValue(instance, innerParams);

        if (innerParams.inputValidator) {
          handleInputValidator(instance, inputValue, type);
        } else if (!instance.getInput().checkValidity()) {
          instance.enableButtons();
          instance.showValidationMessage(innerParams.validationMessage);
        } else if (type === 'deny') {
          deny(instance, inputValue);
        } else {
          confirm(instance, inputValue);
        }
      };

      const handleInputValidator = (instance, inputValue, type
      /* 'confirm' | 'deny' */
      ) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableInput();
        const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
        validationPromise.then(validationMessage => {
          instance.enableButtons();
          instance.enableInput();

          if (validationMessage) {
            instance.showValidationMessage(validationMessage);
          } else if (type === 'deny') {
            deny(instance, inputValue);
          } else {
            confirm(instance, inputValue);
          }
        });
      };

      const deny = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || undefined);

        if (innerParams.showLoaderOnDeny) {
          showLoading(getDenyButton());
        }

        if (innerParams.preDeny) {
          const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
          preDenyPromise.then(preDenyValue => {
            if (preDenyValue === false) {
              instance.hideLoading();
            } else {
              instance.closePopup({
                isDenied: true,
                value: typeof preDenyValue === 'undefined' ? value : preDenyValue
              });
            }
          });
        } else {
          instance.closePopup({
            isDenied: true,
            value
          });
        }
      };

      const succeedWith = (instance, value) => {
        instance.closePopup({
          isConfirmed: true,
          value
        });
      };

      const confirm = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || undefined);

        if (innerParams.showLoaderOnConfirm) {
          showLoading();
        }

        if (innerParams.preConfirm) {
          instance.resetValidationMessage();
          const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
          preConfirmPromise.then(preConfirmValue => {
            if (isVisible(getValidationMessage()) || preConfirmValue === false) {
              instance.hideLoading();
            } else {
              succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
            }
          });
        } else {
          succeedWith(instance, value);
        }
      };

      const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
        if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
          globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = false;
        }

        if (!innerParams.toast) {
          globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);

          globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
          globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
          globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = true;
        }
      }; // Focus handling

      const setFocus = (innerParams, index, increment) => {
        const focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

        if (focusableElements.length) {
          index = index + increment; // rollover to first item

          if (index === focusableElements.length) {
            index = 0; // go to last item
          } else if (index === -1) {
            index = focusableElements.length - 1;
          }

          return focusableElements[index].focus();
        } // no visible focusable elements, focus the popup


        getPopup().focus();
      };
      const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
      const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

      const keydownHandler = (instance, e, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (!innerParams) {
          return; // This instance has already been destroyed
        }

        if (innerParams.stopKeydownPropagation) {
          e.stopPropagation();
        } // ENTER


        if (e.key === 'Enter') {
          handleEnter(instance, e, innerParams); // TAB
        } else if (e.key === 'Tab') {
          handleTab(e, innerParams); // ARROWS - switch focus between buttons
        } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(e.key)) {
          handleArrows(e.key); // ESC
        } else if (e.key === 'Escape') {
          handleEsc(e, innerParams, dismissWith);
        }
      };

      const handleEnter = (instance, e, innerParams) => {
        // #720 #721
        if (e.isComposing) {
          return;
        }

        if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
          if (['textarea', 'file'].includes(innerParams.input)) {
            return; // do not submit
          }

          clickConfirm();
          e.preventDefault();
        }
      };

      const handleTab = (e, innerParams) => {
        const targetElement = e.target;
        const focusableElements = getFocusableElements();
        let btnIndex = -1;

        for (let i = 0; i < focusableElements.length; i++) {
          if (targetElement === focusableElements[i]) {
            btnIndex = i;
            break;
          }
        }

        if (!e.shiftKey) {
          // Cycle to the next button
          setFocus(innerParams, btnIndex, 1);
        } else {
          // Cycle to the prev button
          setFocus(innerParams, btnIndex, -1);
        }

        e.stopPropagation();
        e.preventDefault();
      };

      const handleArrows = key => {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();

        if (![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
          return;
        }

        const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
        const buttonToFocus = document.activeElement[sibling];

        if (buttonToFocus) {
          buttonToFocus.focus();
        }
      };

      const handleEsc = (e, innerParams, dismissWith) => {
        if (callIfFunction(innerParams.allowEscapeKey)) {
          e.preventDefault();
          dismissWith(DismissReason.esc);
        }
      };

      const handlePopupClick = (instance, domCache, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (innerParams.toast) {
          handleToastClick(instance, domCache, dismissWith);
        } else {
          // Ignore click events that had mousedown on the popup but mouseup on the container
          // This can happen when the user drags a slider
          handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

          handleContainerMousedown(domCache);
          handleModalClick(instance, domCache, dismissWith);
        }
      };

      const handleToastClick = (instance, domCache, dismissWith) => {
        // Closing toast by internal click
        domCache.popup.onclick = () => {
          const innerParams = privateProps.innerParams.get(instance);

          if (innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.timer || innerParams.input) {
            return;
          }

          dismissWith(DismissReason.close);
        };
      };

      let ignoreOutsideClick = false;

      const handleModalMousedown = domCache => {
        domCache.popup.onmousedown = () => {
          domCache.container.onmouseup = function (e) {
            domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
            // have any other direct children aside of the popup

            if (e.target === domCache.container) {
              ignoreOutsideClick = true;
            }
          };
        };
      };

      const handleContainerMousedown = domCache => {
        domCache.container.onmousedown = () => {
          domCache.popup.onmouseup = function (e) {
            domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

            if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
              ignoreOutsideClick = true;
            }
          };
        };
      };

      const handleModalClick = (instance, domCache, dismissWith) => {
        domCache.container.onclick = e => {
          const innerParams = privateProps.innerParams.get(instance);

          if (ignoreOutsideClick) {
            ignoreOutsideClick = false;
            return;
          }

          if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
            dismissWith(DismissReason.backdrop);
          }
        };
      };

      function _main(userParams, mixinParams = {}) {
        showWarningsForParams(Object.assign({}, mixinParams, userParams));

        if (globalState.currentInstance) {
          globalState.currentInstance._destroy();

          if (isModal()) {
            unsetAriaHidden();
          }
        }

        globalState.currentInstance = this;
        const innerParams = prepareParams(userParams, mixinParams);
        setParameters(innerParams);
        Object.freeze(innerParams); // clear the previous timer

        if (globalState.timeout) {
          globalState.timeout.stop();
          delete globalState.timeout;
        } // clear the restore focus timeout


        clearTimeout(globalState.restoreFocusTimeout);
        const domCache = populateDomCache(this);
        render(this, innerParams);
        privateProps.innerParams.set(this, innerParams);
        return swalPromise(this, domCache, innerParams);
      }

      const prepareParams = (userParams, mixinParams) => {
        const templateParams = getTemplateParams(userParams);
        const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131

        params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
        params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
        return params;
      };

      const swalPromise = (instance, domCache, innerParams) => {
        return new Promise(resolve => {
          // functions to handle all closings/dismissals
          const dismissWith = dismiss => {
            instance.closePopup({
              isDismissed: true,
              dismiss
            });
          };

          privateMethods.swalPromiseResolve.set(instance, resolve);

          domCache.confirmButton.onclick = () => handleConfirmButtonClick(instance);

          domCache.denyButton.onclick = () => handleDenyButtonClick(instance);

          domCache.cancelButton.onclick = () => handleCancelButtonClick(instance, dismissWith);

          domCache.closeButton.onclick = () => dismissWith(DismissReason.close);

          handlePopupClick(instance, domCache, dismissWith);
          addKeydownHandler(instance, globalState, innerParams, dismissWith);
          handleInputOptionsAndValue(instance, innerParams);
          openPopup(innerParams);
          setupTimer(globalState, innerParams, dismissWith);
          initFocus(domCache, innerParams); // Scroll container to top on open (#1247, #1946)

          setTimeout(() => {
            domCache.container.scrollTop = 0;
          });
        });
      };

      const populateDomCache = instance => {
        const domCache = {
          popup: getPopup(),
          container: getContainer(),
          actions: getActions(),
          confirmButton: getConfirmButton(),
          denyButton: getDenyButton(),
          cancelButton: getCancelButton(),
          loader: getLoader(),
          closeButton: getCloseButton(),
          validationMessage: getValidationMessage(),
          progressSteps: getProgressSteps()
        };
        privateProps.domCache.set(instance, domCache);
        return domCache;
      };

      const setupTimer = (globalState$$1, innerParams, dismissWith) => {
        const timerProgressBar = getTimerProgressBar();
        hide(timerProgressBar);

        if (innerParams.timer) {
          globalState$$1.timeout = new Timer(() => {
            dismissWith('timer');
            delete globalState$$1.timeout;
          }, innerParams.timer);

          if (innerParams.timerProgressBar) {
            show(timerProgressBar);
            setTimeout(() => {
              if (globalState$$1.timeout && globalState$$1.timeout.running) {
                // timer can be already stopped or unset at this point
                animateTimerProgressBar(innerParams.timer);
              }
            });
          }
        }
      };

      const initFocus = (domCache, innerParams) => {
        if (innerParams.toast) {
          return;
        }

        if (!callIfFunction(innerParams.allowEnterKey)) {
          return blurActiveElement();
        }

        if (!focusButton(domCache, innerParams)) {
          setFocus(innerParams, -1, 1);
        }
      };

      const focusButton = (domCache, innerParams) => {
        if (innerParams.focusDeny && isVisible(domCache.denyButton)) {
          domCache.denyButton.focus();
          return true;
        }

        if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
          domCache.cancelButton.focus();
          return true;
        }

        if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
          domCache.confirmButton.focus();
          return true;
        }

        return false;
      };

      const blurActiveElement = () => {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      };

      /**
       * Updates popup parameters.
       */

      function update(params) {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(this);

        if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
          return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
        }

        const validUpdatableParams = {}; // assign valid params from `params` to `defaults`

        Object.keys(params).forEach(param => {
          if (Swal.isUpdatableParameter(param)) {
            validUpdatableParams[param] = params[param];
          } else {
            warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js\n\nIf you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md"));
          }
        });
        const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
        render(this, updatedParams);
        privateProps.innerParams.set(this, updatedParams);
        Object.defineProperties(this, {
          params: {
            value: Object.assign({}, this.params, params),
            writable: false,
            enumerable: true
          }
        });
      }

      function _destroy() {
        const domCache = privateProps.domCache.get(this);
        const innerParams = privateProps.innerParams.get(this);

        if (!innerParams) {
          return; // This instance has already been destroyed
        } // Check if there is another Swal closing


        if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
          globalState.swalCloseEventFinishedCallback();
          delete globalState.swalCloseEventFinishedCallback;
        } // Check if there is a swal disposal defer timer


        if (globalState.deferDisposalTimer) {
          clearTimeout(globalState.deferDisposalTimer);
          delete globalState.deferDisposalTimer;
        }

        if (typeof innerParams.didDestroy === 'function') {
          innerParams.didDestroy();
        }

        disposeSwal(this);
      }

      const disposeSwal = instance => {
        // Unset this.params so GC will dispose it (#1569)
        delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

        delete globalState.keydownHandler;
        delete globalState.keydownTarget; // Unset WeakMaps so GC will be able to dispose them (#1569)

        unsetWeakMaps(privateProps);
        unsetWeakMaps(privateMethods); // Unset currentInstance

        delete globalState.currentInstance;
      };

      const unsetWeakMaps = obj => {
        for (const i in obj) {
          obj[i] = new WeakMap();
        }
      };



      var instanceMethods = /*#__PURE__*/Object.freeze({
        hideLoading: hideLoading,
        disableLoading: hideLoading,
        getInput: getInput$1,
        close: close,
        closePopup: close,
        closeModal: close,
        closeToast: close,
        enableButtons: enableButtons,
        disableButtons: disableButtons,
        enableInput: enableInput,
        disableInput: disableInput,
        showValidationMessage: showValidationMessage,
        resetValidationMessage: resetValidationMessage$1,
        getProgressSteps: getProgressSteps$1,
        _main: _main,
        update: update,
        _destroy: _destroy
      });

      let currentInstance;

      class SweetAlert {
        constructor(...args) {
          // Prevent run in Node env
          if (typeof window === 'undefined') {
            return;
          }

          currentInstance = this;
          const outerParams = Object.freeze(this.constructor.argsToParams(args));
          Object.defineProperties(this, {
            params: {
              value: outerParams,
              writable: false,
              enumerable: true,
              configurable: true
            }
          });

          const promise = this._main(this.params);

          privateProps.promise.set(this, promise);
        } // `catch` cannot be the name of a module export, so we define our thenable methods here instead


        then(onFulfilled) {
          const promise = privateProps.promise.get(this);
          return promise.then(onFulfilled);
        }

        finally(onFinally) {
          const promise = privateProps.promise.get(this);
          return promise.finally(onFinally);
        }

      } // Assign instance methods from src/instanceMethods/*.js to prototype


      Object.assign(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor

      Object.assign(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility

      Object.keys(instanceMethods).forEach(key => {
        SweetAlert[key] = function (...args) {
          if (currentInstance) {
            return currentInstance[key](...args);
          }
        };
      });
      SweetAlert.DismissReason = DismissReason;
      SweetAlert.version = '11.1.7';

      const Swal = SweetAlert;
      Swal.default = Swal;

      return Swal;

    }));
    if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){  commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}

    "undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:1fr 99fr 1fr;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto);grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-bottom-start,.swal2-container.swal2-center-start,.swal2-container.swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-bottom,.swal2-container.swal2-center,.swal2-container.swal2-top{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-bottom-end,.swal2-container.swal2-center-end,.swal2-container.swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-left>.swal2-popup,.swal2-container.swal2-center-start>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-left>.swal2-popup,.swal2-container.swal2-bottom-start>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-fullscreen>.swal2-popup,.swal2-container.swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7367f0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(115,103,240,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#ea5455;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(234,84,85,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7d88;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,125,136,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:0}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;height:.25em;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em 2em 0}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 0;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}");
    });

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* node_modules/sv-bootstrap-modal/src/Modal.svelte generated by Svelte v3.43.0 */
    const file$2 = "node_modules/sv-bootstrap-modal/src/Modal.svelte";

    // (82:0) {#if open}
    function create_if_block(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div1_class_value;
    	let div1_intro;
    	let div1_outro;
    	let div2_transition;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let if_block = /*open*/ ctx[0] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div0, "class", "modal-content");
    			add_location(div0, file$2, 98, 6, 2062);
    			attr_dev(div1, "class", div1_class_value = "modal-dialog " + /*dialogClasses*/ ctx[1] + " svelte-1m2bluk");
    			attr_dev(div1, "role", "document");
    			add_location(div1, file$2, 93, 4, 1884);
    			attr_dev(div2, "class", "modal show svelte-1m2bluk");
    			attr_dev(div2, "tabindex", "-1");
    			attr_dev(div2, "role", "dialog");
    			attr_dev(div2, "aria-labelledby", /*labelledby*/ ctx[3]);
    			attr_dev(div2, "aria-describedby", /*describedby*/ ctx[2]);
    			attr_dev(div2, "aria-modal", "true");
    			add_location(div2, file$2, 82, 2, 1606);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", self$1(/*handleBackdrop*/ ctx[4]), false, false, false),
    					listen_dev(div2, "introend", /*onModalOpened*/ ctx[5], false, false, false),
    					listen_dev(div2, "outroend", /*onModalClosed*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*dialogClasses*/ 2 && div1_class_value !== (div1_class_value = "modal-dialog " + /*dialogClasses*/ ctx[1] + " svelte-1m2bluk")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*labelledby*/ 8) {
    				attr_dev(div2, "aria-labelledby", /*labelledby*/ ctx[3]);
    			}

    			if (!current || dirty & /*describedby*/ 4) {
    				attr_dev(div2, "aria-describedby", /*describedby*/ ctx[2]);
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, fly, { y: -50, duration: 300 });
    				div1_intro.start();
    			});

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, true);
    				div2_transition.run(1);
    			});

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fly, { y: -50, duration: 300, easing: quintOut });
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, false);
    			div2_transition.run(0);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_outro) div1_outro.end();
    			if (detaching && div2_transition) div2_transition.end();
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(82:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (104:2) {#if open}
    function create_if_block_1(ctx) {
    	let div;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "modal-backdrop show");
    			add_location(div, file$2, 104, 4, 2157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 150 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 150 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(104:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function attachEvent(target, ...args) {
    	target.addEventListener(...args);

    	return {
    		remove: () => target.removeEventListener(...args)
    	};
    }

    function checkClass(className) {
    	return document.body.classList.contains(className);
    }

    function modalOpen() {
    	if (!checkClass("modal-open")) {
    		document.body.classList.add("modal-open");
    	}
    }

    function modalClose() {
    	if (checkClass("modal-open")) {
    		document.body.classList.remove("modal-open");
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);

    	const noop = () => {
    		
    	};

    	let { open = false } = $$props;
    	let { dialogClasses = "" } = $$props;
    	let { backdrop = true } = $$props;
    	let { ignoreBackdrop = false } = $$props;
    	let { keyboard = true } = $$props;
    	let { describedby = "" } = $$props;
    	let { labelledby = "" } = $$props;
    	let { onOpened = noop } = $$props;
    	let { onClosed = noop } = $$props;
    	let _keyboardEvent;

    	function handleBackdrop(event) {
    		if (backdrop && !ignoreBackdrop) {
    			event.stopPropagation();
    			$$invalidate(0, open = false);
    		}
    	}

    	function onModalOpened() {
    		if (keyboard) {
    			_keyboardEvent = attachEvent(document, "keydown", e => {
    				if (event.key === "Escape") {
    					$$invalidate(0, open = false);
    				}
    			});
    		}

    		onOpened();
    	}

    	function onModalClosed() {
    		if (_keyboardEvent) {
    			_keyboardEvent.remove();
    		}

    		onClosed();
    	}

    	const writable_props = [
    		'open',
    		'dialogClasses',
    		'backdrop',
    		'ignoreBackdrop',
    		'keyboard',
    		'describedby',
    		'labelledby',
    		'onOpened',
    		'onClosed'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('dialogClasses' in $$props) $$invalidate(1, dialogClasses = $$props.dialogClasses);
    		if ('backdrop' in $$props) $$invalidate(7, backdrop = $$props.backdrop);
    		if ('ignoreBackdrop' in $$props) $$invalidate(8, ignoreBackdrop = $$props.ignoreBackdrop);
    		if ('keyboard' in $$props) $$invalidate(9, keyboard = $$props.keyboard);
    		if ('describedby' in $$props) $$invalidate(2, describedby = $$props.describedby);
    		if ('labelledby' in $$props) $$invalidate(3, labelledby = $$props.labelledby);
    		if ('onOpened' in $$props) $$invalidate(10, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(11, onClosed = $$props.onClosed);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		quintOut,
    		noop,
    		open,
    		dialogClasses,
    		backdrop,
    		ignoreBackdrop,
    		keyboard,
    		describedby,
    		labelledby,
    		onOpened,
    		onClosed,
    		_keyboardEvent,
    		attachEvent,
    		checkClass,
    		modalOpen,
    		modalClose,
    		handleBackdrop,
    		onModalOpened,
    		onModalClosed
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('dialogClasses' in $$props) $$invalidate(1, dialogClasses = $$props.dialogClasses);
    		if ('backdrop' in $$props) $$invalidate(7, backdrop = $$props.backdrop);
    		if ('ignoreBackdrop' in $$props) $$invalidate(8, ignoreBackdrop = $$props.ignoreBackdrop);
    		if ('keyboard' in $$props) $$invalidate(9, keyboard = $$props.keyboard);
    		if ('describedby' in $$props) $$invalidate(2, describedby = $$props.describedby);
    		if ('labelledby' in $$props) $$invalidate(3, labelledby = $$props.labelledby);
    		if ('onOpened' in $$props) $$invalidate(10, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(11, onClosed = $$props.onClosed);
    		if ('_keyboardEvent' in $$props) _keyboardEvent = $$props._keyboardEvent;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			// Watching changes for Open vairable
    			{
    				if (open) {
    					modalOpen();
    				} else {
    					modalClose();
    				}
    			}
    		}
    	};

    	return [
    		open,
    		dialogClasses,
    		describedby,
    		labelledby,
    		handleBackdrop,
    		onModalOpened,
    		onModalClosed,
    		backdrop,
    		ignoreBackdrop,
    		keyboard,
    		onOpened,
    		onClosed,
    		$$scope,
    		slots
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			open: 0,
    			dialogClasses: 1,
    			backdrop: 7,
    			ignoreBackdrop: 8,
    			keyboard: 9,
    			describedby: 2,
    			labelledby: 3,
    			onOpened: 10,
    			onClosed: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get open() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dialogClasses() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dialogClasses(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdrop() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdrop(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ignoreBackdrop() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ignoreBackdrop(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keyboard() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keyboard(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get describedby() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set describedby(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelledby() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelledby(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOpened() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOpened(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClosed() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClosed(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/quizModal.svelte generated by Svelte v3.43.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/quizModal.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (104:12) {#each shuffle(randomQuestion["test"]) as q}
    function create_each_block(ctx) {
    	let li;
    	let raw_value = /*q*/ ctx[13] + "";
    	let li_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*q*/ ctx[13] === /*randomQuestion*/ ctx[3]["answer"]
    			? 'green'
    			: 'red') + " svelte-sip56g"));

    			add_location(li, file$1, 104, 16, 2608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			li.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = listen_dev(
    					li,
    					"click",
    					function () {
    						if (is_function(/*checkAnswer*/ ctx[9](/*q*/ ctx[13], /*randomQuestion*/ ctx[3]["answer"]))) /*checkAnswer*/ ctx[9](/*q*/ ctx[13], /*randomQuestion*/ ctx[3]["answer"]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*randomQuestion*/ 8 && raw_value !== (raw_value = /*q*/ ctx[13] + "")) li.innerHTML = raw_value;
    			if (dirty & /*randomQuestion*/ 8 && li_class_value !== (li_class_value = "" + (null_to_empty(/*q*/ ctx[13] === /*randomQuestion*/ ctx[3]["answer"]
    			? 'green'
    			: 'red') + " svelte-sip56g"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(104:12) {#each shuffle(randomQuestion[\\\"test\\\"]) as q}",
    		ctx
    	});

    	return block;
    }

    // (93:0) <Modal bind:open={isOpen}>
    function create_default_slot(ctx) {
    	let div0;
    	let h5;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let button0;
    	let span;
    	let t5;
    	let div1;
    	let html_tag;
    	let raw_value = /*randomQuestion*/ ctx[3]["question"] + "";
    	let t6;
    	let hr0;
    	let t7;
    	let ul;
    	let ul_class_value;
    	let t8;
    	let hr1;
    	let t9;
    	let p0;
    	let t10;
    	let t11;
    	let t12;
    	let p1;
    	let t13;
    	let t14;
    	let t15;
    	let div2;
    	let button1;
    	let mounted;
    	let dispose;
    	let each_value = shuffle(/*randomQuestion*/ ctx[3]["test"]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h5 = element("h5");
    			t0 = text(/*gerund*/ ctx[0]);
    			t1 = text("-na = ");
    			t2 = text(/*trans*/ ctx[1]);
    			t3 = space();
    			button0 = element("button");
    			span = element("span");
    			span.textContent = "×";
    			t5 = space();
    			div1 = element("div");
    			html_tag = new HtmlTag();
    			t6 = space();
    			hr0 = element("hr");
    			t7 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			hr1 = element("hr");
    			t9 = space();
    			p0 = element("p");
    			t10 = text("Correct: ");
    			t11 = text(/*correct*/ ctx[4]);
    			t12 = space();
    			p1 = element("p");
    			t13 = text("Incorrect: ");
    			t14 = text(/*incorrect*/ ctx[5]);
    			t15 = space();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Refresh";
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$1, 94, 4, 2187);
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$1, 96, 8, 2325);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "close");
    			add_location(button0, file$1, 95, 8, 2246);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$1, 93, 4, 2156);
    			html_tag.a = t6;
    			add_location(hr0, file$1, 101, 8, 2474);
    			attr_dev(ul, "class", ul_class_value = "" + (null_to_empty(!/*showColors*/ ctx[6] ? 'hide-answers' : '') + " svelte-sip56g"));
    			add_location(ul, file$1, 102, 8, 2487);
    			attr_dev(div1, "class", "modal-body");
    			add_location(div1, file$1, 99, 4, 2398);
    			add_location(hr1, file$1, 110, 4, 2810);
    			add_location(p0, file$1, 111, 4, 2819);
    			add_location(p1, file$1, 112, 4, 2849);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary");
    			add_location(button1, file$1, 114, 8, 2918);
    			attr_dev(div2, "class", "modal-footer");
    			add_location(div2, file$1, 113, 4, 2883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h5);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    			append_dev(h5, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button0);
    			append_dev(button0, span);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			html_tag.m(raw_value, div1);
    			append_dev(div1, t6);
    			append_dev(div1, hr0);
    			append_dev(div1, t7);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert_dev(target, t8, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t10);
    			append_dev(p0, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t13);
    			append_dev(p1, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*randomizer*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*gerund*/ 1) set_data_dev(t0, /*gerund*/ ctx[0]);
    			if (dirty & /*trans*/ 2) set_data_dev(t2, /*trans*/ ctx[1]);
    			if (dirty & /*randomQuestion*/ 8 && raw_value !== (raw_value = /*randomQuestion*/ ctx[3]["question"] + "")) html_tag.p(raw_value);

    			if (dirty & /*shuffle, randomQuestion, checkAnswer*/ 520) {
    				each_value = shuffle(/*randomQuestion*/ ctx[3]["test"]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*showColors*/ 64 && ul_class_value !== (ul_class_value = "" + (null_to_empty(!/*showColors*/ ctx[6] ? 'hide-answers' : '') + " svelte-sip56g"))) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (dirty & /*correct*/ 16) set_data_dev(t11, /*correct*/ ctx[4]);
    			if (dirty & /*incorrect*/ 32) set_data_dev(t14, /*incorrect*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(93:0) <Modal bind:open={isOpen}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let modal;
    	let updating_open;
    	let t0;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[11](value);
    	}

    	let modal_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*isOpen*/ ctx[2] !== void 0) {
    		modal_props.open = /*isOpen*/ ctx[2];
    	}

    	modal = new Modal({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'open', modal_open_binding));

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    			t0 = space();
    			button = element("button");
    			button.textContent = "Quiz";
    			attr_dev(button, "class", "btn btn-block btn-primary");
    			add_location(button, file$1, 118, 0, 3027);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*openQuiz*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, incorrect, correct, showColors, randomQuestion, isOpen, trans, gerund*/ 65663) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty & /*isOpen*/ 4) {
    				updating_open = true;
    				modal_changes.open = /*isOpen*/ ctx[2];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
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

    function randomAnswer() {
    	let randomArticles = document.querySelectorAll('article');
    	return randomArticles[Math.floor(Math.random() * randomArticles.length)].querySelector("small").innerHTML;
    }

    function shuffle(array) {
    	let currentIndex = array.length, randomIndex;

    	// While there remain elements to shuffle...
    	while (currentIndex != 0) {
    		// Pick a remaining element...
    		randomIndex = Math.floor(Math.random() * currentIndex);

    		currentIndex--;

    		// And swap it with the current element.
    		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    	}

    	return array;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuizModal', slots, []);
    	let isOpen = false;
    	let { gerund } = $$props;
    	let { trans } = $$props;
    	let questions = [];
    	let randomQuestion = "";
    	let correct = 0;
    	let incorrect = 0;
    	let showColors = false;

    	function openQuiz() {
    		$$invalidate(2, isOpen = !isOpen);
    		$$invalidate(4, correct = 0);
    		$$invalidate(5, incorrect = 0);
    		randomizer();
    	}

    	function randomizer() {
    		questions = [];
    		$$invalidate(6, showColors = false);

    		document.querySelectorAll('article').forEach((el, index) => {
    			//do stuff with _el here
    			let answer = el.querySelector("small").innerHTML;

    			questions.push({
    				question: el.querySelector("p").innerHTML,
    				answer,
    				test: [randomAnswer(), randomAnswer(), answer]
    			});
    		});

    		console.log(questions);
    		$$invalidate(3, randomQuestion = questions[Math.floor(Math.random() * questions.length)]);
    	}

    	function checkAnswer(q, a) {
    		if (q == a) {
    			$$invalidate(4, correct += 1);
    		} else {
    			$$invalidate(5, incorrect += 1);
    		}

    		$$invalidate(6, showColors = true);
    		setTimeout(randomizer, 1500);
    	}

    	const writable_props = ['gerund', 'trans'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<QuizModal> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, isOpen = false);

    	function modal_open_binding(value) {
    		isOpen = value;
    		$$invalidate(2, isOpen);
    	}

    	$$self.$$set = $$props => {
    		if ('gerund' in $$props) $$invalidate(0, gerund = $$props.gerund);
    		if ('trans' in $$props) $$invalidate(1, trans = $$props.trans);
    	};

    	$$self.$capture_state = () => ({
    		Modal,
    		isOpen,
    		gerund,
    		trans,
    		questions,
    		randomQuestion,
    		correct,
    		incorrect,
    		showColors,
    		openQuiz,
    		randomizer,
    		randomAnswer,
    		checkAnswer,
    		shuffle
    	});

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) $$invalidate(2, isOpen = $$props.isOpen);
    		if ('gerund' in $$props) $$invalidate(0, gerund = $$props.gerund);
    		if ('trans' in $$props) $$invalidate(1, trans = $$props.trans);
    		if ('questions' in $$props) questions = $$props.questions;
    		if ('randomQuestion' in $$props) $$invalidate(3, randomQuestion = $$props.randomQuestion);
    		if ('correct' in $$props) $$invalidate(4, correct = $$props.correct);
    		if ('incorrect' in $$props) $$invalidate(5, incorrect = $$props.incorrect);
    		if ('showColors' in $$props) $$invalidate(6, showColors = $$props.showColors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gerund,
    		trans,
    		isOpen,
    		randomQuestion,
    		correct,
    		incorrect,
    		showColors,
    		openQuiz,
    		randomizer,
    		checkAnswer,
    		click_handler,
    		modal_open_binding
    	];
    }

    class QuizModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { gerund: 0, trans: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuizModal",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*gerund*/ ctx[0] === undefined && !('gerund' in props)) {
    			console_1.warn("<QuizModal> was created without expected prop 'gerund'");
    		}

    		if (/*trans*/ ctx[1] === undefined && !('trans' in props)) {
    			console_1.warn("<QuizModal> was created without expected prop 'trans'");
    		}
    	}

    	get gerund() {
    		throw new Error("<QuizModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gerund(value) {
    		throw new Error("<QuizModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trans() {
    		throw new Error("<QuizModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trans(value) {
    		throw new Error("<QuizModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    	let quizmodal;
    	let t5;
    	let hr1;
    	let t6;
    	let article0;
    	let small0;
    	let t7;
    	let t8;
    	let t9;
    	let p0;
    	let t10;
    	let b0;
    	let t11;
    	let t12;
    	let t13;
    	let hr2;
    	let t14;
    	let article1;
    	let small1;
    	let t15;
    	let t16;
    	let t17;
    	let p1;
    	let u0;
    	let t19;
    	let b1;
    	let t20;
    	let t21;
    	let t22;
    	let hr3;
    	let t23;
    	let article2;
    	let small2;
    	let t24;
    	let t25;
    	let t26;
    	let t27;
    	let p2;
    	let t28;
    	let b2;
    	let t29;
    	let t30;
    	let t31;
    	let hr4;
    	let t32;
    	let article3;
    	let small3;
    	let t33;
    	let t34;
    	let t35;
    	let t36;
    	let p3;
    	let t37;
    	let b3;
    	let t38;
    	let t39;
    	let t40;
    	let hr5;
    	let t41;
    	let article4;
    	let small4;
    	let t42;
    	let t43;
    	let t44;
    	let p4;
    	let t45;
    	let b4;
    	let t46;
    	let t47;
    	let t48;
    	let hr6;
    	let t49;
    	let article5;
    	let small5;
    	let t50;
    	let t51;
    	let t52;
    	let p5;
    	let u1;
    	let t54;
    	let b5;
    	let t55;
    	let t56;
    	let t57;
    	let hr7;
    	let t58;
    	let article6;
    	let small6;
    	let t59;
    	let t60;
    	let t61;
    	let t62;
    	let p6;
    	let t63;
    	let b6;
    	let t64;
    	let t65;
    	let t66;
    	let hr8;
    	let t67;
    	let article7;
    	let small7;
    	let t68;
    	let t69;
    	let t70;
    	let t71;
    	let p7;
    	let t72;
    	let b7;
    	let t73;
    	let t74;
    	let t75;
    	let hr9;
    	let t76;
    	let article8;
    	let small8;
    	let t77;
    	let t78;
    	let t79;
    	let t80;
    	let p8;
    	let t81;
    	let b8;
    	let t82;
    	let t83;
    	let t84;
    	let hr10;
    	let t85;
    	let article9;
    	let small9;
    	let t86;
    	let t87;
    	let t88;
    	let t89;
    	let p9;
    	let u2;
    	let t91;
    	let b9;
    	let t92;
    	let t93;
    	let t94;
    	let hr11;
    	let t95;
    	let article10;
    	let small10;
    	let t96;
    	let t97_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t97;
    	let t98;
    	let t99;
    	let p10;
    	let t100;
    	let b10;
    	let t101;
    	let t102;
    	let t103;
    	let hr12;
    	let t104;
    	let article11;
    	let small11;
    	let t105;
    	let t106_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t106;
    	let t107;
    	let p11;
    	let u3;
    	let t109;
    	let b11;
    	let t110;
    	let t111;
    	let t112;
    	let hr13;
    	let t113;
    	let article12;
    	let small12;
    	let t114;
    	let t115_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t115;
    	let t116;
    	let p12;
    	let t117;
    	let b12;
    	let t118;
    	let t119;
    	let t120;
    	let hr14;
    	let t121;
    	let article13;
    	let small13;
    	let t122;
    	let t123_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t123;
    	let t124;
    	let p13;
    	let u4;
    	let t126;
    	let b13;
    	let t127;
    	let t128;
    	let t129;
    	let hr15;
    	let t130;
    	let article14;
    	let small14;
    	let t131;
    	let t132_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t132;
    	let t133;
    	let t134;
    	let p14;
    	let t135;
    	let b14;
    	let t136;
    	let t137;
    	let t138;
    	let hr16;
    	let t139;
    	let article15;
    	let small15;
    	let t140;
    	let t141_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t141;
    	let t142;
    	let t143;
    	let p15;
    	let u5;
    	let t145;
    	let b15;
    	let t146;
    	let t147;
    	let t148;
    	let hr17;
    	let t149;
    	let article16;
    	let small16;
    	let t150_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t150;
    	let t151;
    	let t152;
    	let p16;
    	let b16;
    	let t153;
    	let t154;
    	let t155;
    	let hr18;
    	let t156;
    	let article17;
    	let small17;
    	let t157;
    	let t158_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t158;
    	let t159;
    	let t160;
    	let p17;
    	let b17;
    	let t161;
    	let t162;
    	let t163;
    	let hr19;
    	let t164;
    	let article18;
    	let small18;
    	let t165_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t165;
    	let t166;
    	let t167;
    	let p18;
    	let b18;
    	let t168;
    	let t169;
    	let t170;
    	let hr20;
    	let t171;
    	let article19;
    	let small19;
    	let t172;
    	let t173_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t173;
    	let t174;
    	let t175;
    	let p19;
    	let b19;
    	let t176;
    	let t177;
    	let t178;
    	let hr21;
    	let t179;
    	let article20;
    	let small20;
    	let t180;
    	let t181_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t181;
    	let t182;
    	let t183;
    	let p20;
    	let t184;
    	let b20;
    	let t185;
    	let t186;
    	let t187;
    	let hr22;
    	let t188;
    	let article21;
    	let small21;
    	let t189;
    	let t190_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t190;
    	let t191;
    	let t192;
    	let p21;
    	let t193;
    	let b21;
    	let t194;
    	let t195;
    	let t196;
    	let hr23;
    	let t197;
    	let article22;
    	let small22;
    	let t198;
    	let t199_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t199;
    	let t200;
    	let t201;
    	let p22;
    	let t202;
    	let b22;
    	let t203;
    	let t204;
    	let t205;
    	let hr24;
    	let t206;
    	let article23;
    	let small23;
    	let t207;
    	let t208_value = /*trans*/ ctx[1].split("ing")[0] + "";
    	let t208;
    	let t209;
    	let t210;
    	let p23;
    	let t211;
    	let b23;
    	let t212;
    	let t213;
    	let t214;
    	let hr25;
    	let t215;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	quizmodal = new QuizModal({
    			props: {
    				gerund: /*gerund*/ ctx[0],
    				trans: /*trans*/ ctx[1]
    			},
    			$$inline: true
    		});

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
    			create_component(quizmodal.$$.fragment);
    			t5 = space();
    			hr1 = element("hr");
    			t6 = space();
    			article0 = element("article");
    			small0 = element("small");
    			t7 = text("I'm ");
    			t8 = text(/*trans*/ ctx[1]);
    			t9 = space();
    			p0 = element("p");
    			t10 = text("Mein ");
    			b0 = element("b");
    			t11 = text(/*bones*/ ctx[2]);
    			t12 = text("rahaa hun");
    			t13 = space();
    			hr2 = element("hr");
    			t14 = space();
    			article1 = element("article");
    			small1 = element("small");
    			t15 = text("He is  ");
    			t16 = text(/*trans*/ ctx[1]);
    			t17 = space();
    			p1 = element("p");
    			u0 = element("u");
    			u0.textContent = "Woh";
    			t19 = space();
    			b1 = element("b");
    			t20 = text(/*bones*/ ctx[2]);
    			t21 = text("rahaa he");
    			t22 = space();
    			hr3 = element("hr");
    			t23 = space();
    			article2 = element("article");
    			small2 = element("small");
    			t24 = text("You are ");
    			t25 = text(/*trans*/ ctx[1]);
    			t26 = text(" (informal)");
    			t27 = space();
    			p2 = element("p");
    			t28 = text("Tum ");
    			b2 = element("b");
    			t29 = text(/*bones*/ ctx[2]);
    			t30 = text("rahey ho");
    			t31 = space();
    			hr4 = element("hr");
    			t32 = space();
    			article3 = element("article");
    			small3 = element("small");
    			t33 = text("You are ");
    			t34 = text(/*trans*/ ctx[1]);
    			t35 = text(" (formal)");
    			t36 = space();
    			p3 = element("p");
    			t37 = text("Aap ");
    			b3 = element("b");
    			t38 = text(/*bones*/ ctx[2]);
    			t39 = text("rahey hein");
    			t40 = space();
    			hr5 = element("hr");
    			t41 = space();
    			article4 = element("article");
    			small4 = element("small");
    			t42 = text("I'm ");
    			t43 = text(/*trans*/ ctx[1]);
    			t44 = space();
    			p4 = element("p");
    			t45 = text("Mein ");
    			b4 = element("b");
    			t46 = text(/*bones*/ ctx[2]);
    			t47 = text("rahee hun");
    			t48 = space();
    			hr6 = element("hr");
    			t49 = space();
    			article5 = element("article");
    			small5 = element("small");
    			t50 = text("She is ");
    			t51 = text(/*trans*/ ctx[1]);
    			t52 = space();
    			p5 = element("p");
    			u1 = element("u");
    			u1.textContent = "Woh";
    			t54 = space();
    			b5 = element("b");
    			t55 = text(/*bones*/ ctx[2]);
    			t56 = text("rahee he");
    			t57 = space();
    			hr7 = element("hr");
    			t58 = space();
    			article6 = element("article");
    			small6 = element("small");
    			t59 = text("You are ");
    			t60 = text(/*trans*/ ctx[1]);
    			t61 = text(" (informal)");
    			t62 = space();
    			p6 = element("p");
    			t63 = text("Tum ");
    			b6 = element("b");
    			t64 = text(/*bones*/ ctx[2]);
    			t65 = text("rahee ho");
    			t66 = space();
    			hr8 = element("hr");
    			t67 = space();
    			article7 = element("article");
    			small7 = element("small");
    			t68 = text("You are ");
    			t69 = text(/*trans*/ ctx[1]);
    			t70 = text(" (formal)");
    			t71 = space();
    			p7 = element("p");
    			t72 = text("Aap ");
    			b7 = element("b");
    			t73 = text(/*bones*/ ctx[2]);
    			t74 = text("raheen hein");
    			t75 = space();
    			hr9 = element("hr");
    			t76 = space();
    			article8 = element("article");
    			small8 = element("small");
    			t77 = text("We're ");
    			t78 = text(/*trans*/ ctx[1]);
    			t79 = text(" (neutral)");
    			t80 = space();
    			p8 = element("p");
    			t81 = text("Hum ");
    			b8 = element("b");
    			t82 = text(/*bones*/ ctx[2]);
    			t83 = text("rahey hein");
    			t84 = space();
    			hr10 = element("hr");
    			t85 = space();
    			article9 = element("article");
    			small9 = element("small");
    			t86 = text("They're ");
    			t87 = text(/*trans*/ ctx[1]);
    			t88 = text(" (they/formal neutral)");
    			t89 = space();
    			p9 = element("p");
    			u2 = element("u");
    			u2.textContent = "Woh";
    			t91 = space();
    			b9 = element("b");
    			t92 = text(/*bones*/ ctx[2]);
    			t93 = text("rahey hein");
    			t94 = space();
    			hr11 = element("hr");
    			t95 = space();
    			article10 = element("article");
    			small10 = element("small");
    			t96 = text("I will ");
    			t97 = text(t97_value);
    			t98 = text(" (1stp)");
    			t99 = space();
    			p10 = element("p");
    			t100 = text("Mein ");
    			b10 = element("b");
    			t101 = text(/*bones*/ ctx[2]);
    			t102 = text("unga");
    			t103 = space();
    			hr12 = element("hr");
    			t104 = space();
    			article11 = element("article");
    			small11 = element("small");
    			t105 = text("He will ");
    			t106 = text(t106_value);
    			t107 = space();
    			p11 = element("p");
    			u3 = element("u");
    			u3.textContent = "Woh";
    			t109 = space();
    			b11 = element("b");
    			t110 = text(/*bones*/ ctx[2]);
    			t111 = text("eyga");
    			t112 = space();
    			hr13 = element("hr");
    			t113 = space();
    			article12 = element("article");
    			small12 = element("small");
    			t114 = text("I will ");
    			t115 = text(t115_value);
    			t116 = space();
    			p12 = element("p");
    			t117 = text("Mein ");
    			b12 = element("b");
    			t118 = text(/*bones*/ ctx[2]);
    			t119 = text("ungi");
    			t120 = space();
    			hr14 = element("hr");
    			t121 = space();
    			article13 = element("article");
    			small13 = element("small");
    			t122 = text("She will ");
    			t123 = text(t123_value);
    			t124 = space();
    			p13 = element("p");
    			u4 = element("u");
    			u4.textContent = "Woh";
    			t126 = space();
    			b13 = element("b");
    			t127 = text(/*bones*/ ctx[2]);
    			t128 = text("eygi");
    			t129 = space();
    			hr15 = element("hr");
    			t130 = space();
    			article14 = element("article");
    			small14 = element("small");
    			t131 = text("We will ");
    			t132 = text(t132_value);
    			t133 = text(" (neutral)");
    			t134 = space();
    			p14 = element("p");
    			t135 = text("Hum ");
    			b14 = element("b");
    			t136 = text(/*bones*/ ctx[2]);
    			t137 = text("eingay");
    			t138 = space();
    			hr16 = element("hr");
    			t139 = space();
    			article15 = element("article");
    			small15 = element("small");
    			t140 = text("They/He will ");
    			t141 = text(t141_value);
    			t142 = text(" (they/formal neutral)");
    			t143 = space();
    			p15 = element("p");
    			u5 = element("u");
    			u5.textContent = "Woh";
    			t145 = space();
    			b15 = element("b");
    			t146 = text(/*bones*/ ctx[2]);
    			t147 = text("eingay");
    			t148 = space();
    			hr17 = element("hr");
    			t149 = space();
    			article16 = element("article");
    			small16 = element("small");
    			t150 = text(t150_value);
    			t151 = text("! (informal neutral)");
    			t152 = space();
    			p16 = element("p");
    			b16 = element("b");
    			t153 = text(/*bones*/ ctx[2]);
    			t154 = text("o!");
    			t155 = space();
    			hr18 = element("hr");
    			t156 = space();
    			article17 = element("article");
    			small17 = element("small");
    			t157 = text("Please ");
    			t158 = text(t158_value);
    			t159 = text("! (informal neutral)");
    			t160 = space();
    			p17 = element("p");
    			b17 = element("b");
    			t161 = text(/*bones*/ ctx[2]);
    			t162 = text("ein!");
    			t163 = space();
    			hr19 = element("hr");
    			t164 = space();
    			article18 = element("article");
    			small18 = element("small");
    			t165 = text(t165_value);
    			t166 = text("! (formal neutral)");
    			t167 = space();
    			p18 = element("p");
    			b18 = element("b");
    			t168 = text(/*bones*/ ctx[2]);
    			t169 = text("ein!");
    			t170 = space();
    			hr20 = element("hr");
    			t171 = space();
    			article19 = element("article");
    			small19 = element("small");
    			t172 = text("Please ");
    			t173 = text(t173_value);
    			t174 = text("! (formal neutral)");
    			t175 = space();
    			p19 = element("p");
    			b19 = element("b");
    			t176 = text(/*bones*/ ctx[2]);
    			t177 = text("ein!");
    			t178 = space();
    			hr21 = element("hr");
    			t179 = space();
    			article20 = element("article");
    			small20 = element("small");
    			t180 = text("Will you ");
    			t181 = text(t181_value);
    			t182 = text("? (informal)");
    			t183 = space();
    			p20 = element("p");
    			t184 = text("Tum ");
    			b20 = element("b");
    			t185 = text(/*bones*/ ctx[2]);
    			t186 = text("ogay?");
    			t187 = space();
    			hr22 = element("hr");
    			t188 = space();
    			article21 = element("article");
    			small21 = element("small");
    			t189 = text("Will you ");
    			t190 = text(t190_value);
    			t191 = text("? (formal)");
    			t192 = space();
    			p21 = element("p");
    			t193 = text("Aap ");
    			b21 = element("b");
    			t194 = text(/*bones*/ ctx[2]);
    			t195 = text("eingey?");
    			t196 = space();
    			hr23 = element("hr");
    			t197 = space();
    			article22 = element("article");
    			small22 = element("small");
    			t198 = text("Will you ");
    			t199 = text(t199_value);
    			t200 = text("? (informal)");
    			t201 = space();
    			p22 = element("p");
    			t202 = text("Tum ");
    			b22 = element("b");
    			t203 = text(/*bones*/ ctx[2]);
    			t204 = text("ogi?");
    			t205 = space();
    			hr24 = element("hr");
    			t206 = space();
    			article23 = element("article");
    			small23 = element("small");
    			t207 = text("Will you ");
    			t208 = text(t208_value);
    			t209 = text("? (formal)");
    			t210 = space();
    			p23 = element("p");
    			t211 = text("Aap ");
    			b23 = element("b");
    			t212 = text(/*bones*/ ctx[2]);
    			t213 = text("eingee?");
    			t214 = space();
    			hr25 = element("hr");
    			t215 = space();
    			br = element("br");
    			attr_dev(label, "for", "gerund");
    			add_location(label, file, 52, 4, 844);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "gerund");
    			attr_dev(input0, "placeholder", "Gerund");
    			add_location(input0, file, 53, 4, 883);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "trans");
    			attr_dev(input1, "placeholder", "Translation");
    			add_location(input1, file, 54, 4, 962);
    			attr_dev(div0, "class", "form-control");
    			add_location(div0, file, 51, 2, 813);
    			add_location(hr0, file, 57, 2, 1054);
    			add_location(hr1, file, 60, 2, 1120);
    			attr_dev(small0, "class", "svelte-azb90x");
    			add_location(small0, file, 63, 2, 1151);
    			add_location(b0, file, 64, 10, 1188);
    			add_location(p0, file, 64, 2, 1180);
    			add_location(hr2, file, 65, 2, 1219);
    			attr_dev(article0, "class", "masc svelte-azb90x");
    			add_location(article0, file, 62, 0, 1126);
    			attr_dev(small1, "class", "svelte-azb90x");
    			add_location(small1, file, 69, 2, 1261);
    			add_location(u0, file, 70, 5, 1297);
    			add_location(b1, file, 70, 16, 1308);
    			add_location(p1, file, 70, 2, 1294);
    			add_location(hr3, file, 71, 2, 1338);
    			attr_dev(article1, "class", "masc svelte-azb90x");
    			add_location(article1, file, 68, 0, 1236);
    			attr_dev(small2, "class", "svelte-azb90x");
    			add_location(small2, file, 75, 2, 1380);
    			add_location(b2, file, 76, 9, 1432);
    			add_location(p2, file, 76, 2, 1425);
    			add_location(hr4, file, 77, 2, 1462);
    			attr_dev(article2, "class", "masc svelte-azb90x");
    			add_location(article2, file, 74, 0, 1355);
    			attr_dev(small3, "class", "svelte-azb90x");
    			add_location(small3, file, 82, 2, 1505);
    			add_location(b3, file, 83, 9, 1555);
    			add_location(p3, file, 83, 2, 1548);
    			add_location(hr5, file, 84, 2, 1587);
    			attr_dev(article3, "class", "masc svelte-azb90x");
    			add_location(article3, file, 81, 0, 1480);
    			attr_dev(small4, "class", "svelte-azb90x");
    			add_location(small4, file, 89, 2, 1629);
    			add_location(b4, file, 90, 10, 1666);
    			add_location(p4, file, 90, 2, 1658);
    			add_location(hr6, file, 91, 2, 1697);
    			attr_dev(article4, "class", "fem svelte-azb90x");
    			add_location(article4, file, 88, 0, 1605);
    			attr_dev(small5, "class", "svelte-azb90x");
    			add_location(small5, file, 95, 2, 1738);
    			add_location(u1, file, 96, 5, 1774);
    			add_location(b5, file, 96, 16, 1785);
    			add_location(p5, file, 96, 2, 1771);
    			add_location(hr7, file, 97, 2, 1815);
    			attr_dev(article5, "class", "fem svelte-azb90x");
    			add_location(article5, file, 94, 0, 1714);
    			attr_dev(small6, "class", "svelte-azb90x");
    			add_location(small6, file, 101, 2, 1856);
    			add_location(b6, file, 102, 9, 1908);
    			add_location(p6, file, 102, 2, 1901);
    			add_location(hr8, file, 103, 2, 1938);
    			attr_dev(article6, "class", "fem svelte-azb90x");
    			add_location(article6, file, 100, 0, 1832);
    			attr_dev(small7, "class", "svelte-azb90x");
    			add_location(small7, file, 107, 2, 1979);
    			add_location(b7, file, 108, 9, 2029);
    			add_location(p7, file, 108, 2, 2022);
    			add_location(hr9, file, 109, 2, 2062);
    			attr_dev(article7, "class", "fem svelte-azb90x");
    			add_location(article7, file, 106, 0, 1955);
    			attr_dev(small8, "class", "neutral");
    			add_location(small8, file, 113, 2, 2091);
    			add_location(b8, file, 114, 9, 2155);
    			add_location(p8, file, 114, 2, 2148);
    			add_location(hr10, file, 115, 2, 2187);
    			add_location(article8, file, 112, 0, 2079);
    			add_location(small9, file, 120, 2, 2217);
    			add_location(u2, file, 121, 5, 2275);
    			add_location(b9, file, 121, 16, 2286);
    			add_location(p9, file, 121, 2, 2272);
    			add_location(hr11, file, 122, 2, 2318);
    			add_location(article9, file, 119, 0, 2205);
    			attr_dev(small10, "class", "svelte-azb90x");
    			add_location(small10, file, 127, 2, 2361);
    			add_location(b10, file, 128, 10, 2424);
    			add_location(p10, file, 128, 2, 2416);
    			add_location(hr12, file, 129, 2, 2449);
    			attr_dev(article10, "class", "masc svelte-azb90x");
    			add_location(article10, file, 126, 0, 2336);
    			attr_dev(small11, "class", "svelte-azb90x");
    			add_location(small11, file, 133, 2, 2491);
    			add_location(u3, file, 134, 5, 2543);
    			add_location(b11, file, 134, 16, 2554);
    			add_location(p11, file, 134, 2, 2540);
    			add_location(hr13, file, 135, 2, 2579);
    			attr_dev(article11, "class", "masc svelte-azb90x");
    			add_location(article11, file, 132, 0, 2466);
    			attr_dev(small12, "class", "svelte-azb90x");
    			add_location(small12, file, 139, 2, 2620);
    			add_location(b12, file, 140, 10, 2676);
    			add_location(p12, file, 140, 2, 2668);
    			add_location(hr14, file, 141, 2, 2701);
    			attr_dev(article12, "class", "fem svelte-azb90x");
    			add_location(article12, file, 138, 0, 2596);
    			attr_dev(small13, "class", "svelte-azb90x");
    			add_location(small13, file, 145, 2, 2742);
    			add_location(u4, file, 146, 5, 2795);
    			add_location(b13, file, 146, 16, 2806);
    			add_location(p13, file, 146, 2, 2792);
    			add_location(hr15, file, 147, 2, 2831);
    			attr_dev(article13, "class", "fem svelte-azb90x");
    			add_location(article13, file, 144, 0, 2718);
    			add_location(small14, file, 152, 2, 2861);
    			add_location(b14, file, 153, 9, 2927);
    			add_location(p14, file, 153, 2, 2920);
    			add_location(hr16, file, 154, 2, 2954);
    			add_location(article14, file, 151, 0, 2849);
    			add_location(small15, file, 158, 2, 2983);
    			add_location(u5, file, 159, 5, 3062);
    			add_location(b15, file, 159, 16, 3073);
    			add_location(p15, file, 159, 2, 3059);
    			add_location(hr17, file, 160, 2, 3100);
    			add_location(article15, file, 157, 0, 2971);
    			add_location(small16, file, 165, 2, 3130);
    			add_location(b16, file, 166, 5, 3194);
    			add_location(p16, file, 166, 2, 3191);
    			add_location(hr18, file, 167, 2, 3217);
    			add_location(article16, file, 164, 0, 3118);
    			add_location(small17, file, 171, 2, 3246);
    			add_location(b17, file, 172, 5, 3317);
    			add_location(p17, file, 172, 2, 3314);
    			add_location(hr19, file, 173, 2, 3342);
    			add_location(article17, file, 170, 0, 3234);
    			add_location(small18, file, 177, 2, 3371);
    			add_location(b18, file, 178, 5, 3433);
    			add_location(p18, file, 178, 2, 3430);
    			add_location(hr20, file, 179, 2, 3458);
    			add_location(article18, file, 176, 0, 3359);
    			add_location(small19, file, 183, 2, 3487);
    			add_location(b19, file, 184, 5, 3556);
    			add_location(p19, file, 184, 2, 3553);
    			add_location(hr21, file, 185, 2, 3581);
    			add_location(article19, file, 182, 0, 3475);
    			attr_dev(small20, "class", "svelte-azb90x");
    			add_location(small20, file, 189, 2, 3623);
    			add_location(b20, file, 190, 9, 3692);
    			add_location(p20, file, 190, 2, 3685);
    			add_location(hr22, file, 191, 2, 3718);
    			attr_dev(article20, "class", "masc svelte-azb90x");
    			add_location(article20, file, 188, 0, 3598);
    			attr_dev(small21, "class", "svelte-azb90x");
    			add_location(small21, file, 195, 2, 3760);
    			add_location(b21, file, 196, 9, 3827);
    			add_location(p21, file, 196, 2, 3820);
    			add_location(hr23, file, 197, 2, 3855);
    			attr_dev(article21, "class", "masc svelte-azb90x");
    			add_location(article21, file, 194, 0, 3735);
    			attr_dev(small22, "class", "svelte-azb90x");
    			add_location(small22, file, 202, 2, 3897);
    			add_location(b22, file, 203, 9, 3966);
    			add_location(p22, file, 203, 2, 3959);
    			add_location(hr24, file, 204, 2, 3991);
    			attr_dev(article22, "class", "fem svelte-azb90x");
    			add_location(article22, file, 201, 0, 3873);
    			attr_dev(small23, "class", "svelte-azb90x");
    			add_location(small23, file, 208, 2, 4032);
    			add_location(b23, file, 209, 9, 4099);
    			add_location(p23, file, 209, 2, 4092);
    			add_location(hr25, file, 210, 2, 4127);
    			attr_dev(article23, "class", "fem svelte-azb90x");
    			add_location(article23, file, 207, 0, 4008);
    			attr_dev(div1, "id", "form");
    			attr_dev(div1, "class", "svelte-azb90x");
    			add_location(div1, file, 50, 0, 795);
    			add_location(br, file, 215, 0, 4152);
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
    			set_input_value(input1, /*trans*/ ctx[1]);
    			append_dev(div1, t3);
    			append_dev(div1, hr0);
    			append_dev(div1, t4);
    			mount_component(quizmodal, div1, null);
    			append_dev(div1, t5);
    			append_dev(div1, hr1);
    			append_dev(div1, t6);
    			append_dev(div1, article0);
    			append_dev(article0, small0);
    			append_dev(small0, t7);
    			append_dev(small0, t8);
    			append_dev(article0, t9);
    			append_dev(article0, p0);
    			append_dev(p0, t10);
    			append_dev(p0, b0);
    			append_dev(b0, t11);
    			append_dev(p0, t12);
    			append_dev(article0, t13);
    			append_dev(article0, hr2);
    			append_dev(div1, t14);
    			append_dev(div1, article1);
    			append_dev(article1, small1);
    			append_dev(small1, t15);
    			append_dev(small1, t16);
    			append_dev(article1, t17);
    			append_dev(article1, p1);
    			append_dev(p1, u0);
    			append_dev(p1, t19);
    			append_dev(p1, b1);
    			append_dev(b1, t20);
    			append_dev(p1, t21);
    			append_dev(article1, t22);
    			append_dev(article1, hr3);
    			append_dev(div1, t23);
    			append_dev(div1, article2);
    			append_dev(article2, small2);
    			append_dev(small2, t24);
    			append_dev(small2, t25);
    			append_dev(small2, t26);
    			append_dev(article2, t27);
    			append_dev(article2, p2);
    			append_dev(p2, t28);
    			append_dev(p2, b2);
    			append_dev(b2, t29);
    			append_dev(p2, t30);
    			append_dev(article2, t31);
    			append_dev(article2, hr4);
    			append_dev(div1, t32);
    			append_dev(div1, article3);
    			append_dev(article3, small3);
    			append_dev(small3, t33);
    			append_dev(small3, t34);
    			append_dev(small3, t35);
    			append_dev(article3, t36);
    			append_dev(article3, p3);
    			append_dev(p3, t37);
    			append_dev(p3, b3);
    			append_dev(b3, t38);
    			append_dev(p3, t39);
    			append_dev(article3, t40);
    			append_dev(article3, hr5);
    			append_dev(div1, t41);
    			append_dev(div1, article4);
    			append_dev(article4, small4);
    			append_dev(small4, t42);
    			append_dev(small4, t43);
    			append_dev(article4, t44);
    			append_dev(article4, p4);
    			append_dev(p4, t45);
    			append_dev(p4, b4);
    			append_dev(b4, t46);
    			append_dev(p4, t47);
    			append_dev(article4, t48);
    			append_dev(article4, hr6);
    			append_dev(div1, t49);
    			append_dev(div1, article5);
    			append_dev(article5, small5);
    			append_dev(small5, t50);
    			append_dev(small5, t51);
    			append_dev(article5, t52);
    			append_dev(article5, p5);
    			append_dev(p5, u1);
    			append_dev(p5, t54);
    			append_dev(p5, b5);
    			append_dev(b5, t55);
    			append_dev(p5, t56);
    			append_dev(article5, t57);
    			append_dev(article5, hr7);
    			append_dev(div1, t58);
    			append_dev(div1, article6);
    			append_dev(article6, small6);
    			append_dev(small6, t59);
    			append_dev(small6, t60);
    			append_dev(small6, t61);
    			append_dev(article6, t62);
    			append_dev(article6, p6);
    			append_dev(p6, t63);
    			append_dev(p6, b6);
    			append_dev(b6, t64);
    			append_dev(p6, t65);
    			append_dev(article6, t66);
    			append_dev(article6, hr8);
    			append_dev(div1, t67);
    			append_dev(div1, article7);
    			append_dev(article7, small7);
    			append_dev(small7, t68);
    			append_dev(small7, t69);
    			append_dev(small7, t70);
    			append_dev(article7, t71);
    			append_dev(article7, p7);
    			append_dev(p7, t72);
    			append_dev(p7, b7);
    			append_dev(b7, t73);
    			append_dev(p7, t74);
    			append_dev(article7, t75);
    			append_dev(article7, hr9);
    			append_dev(div1, t76);
    			append_dev(div1, article8);
    			append_dev(article8, small8);
    			append_dev(small8, t77);
    			append_dev(small8, t78);
    			append_dev(small8, t79);
    			append_dev(article8, t80);
    			append_dev(article8, p8);
    			append_dev(p8, t81);
    			append_dev(p8, b8);
    			append_dev(b8, t82);
    			append_dev(p8, t83);
    			append_dev(article8, t84);
    			append_dev(article8, hr10);
    			append_dev(div1, t85);
    			append_dev(div1, article9);
    			append_dev(article9, small9);
    			append_dev(small9, t86);
    			append_dev(small9, t87);
    			append_dev(small9, t88);
    			append_dev(article9, t89);
    			append_dev(article9, p9);
    			append_dev(p9, u2);
    			append_dev(p9, t91);
    			append_dev(p9, b9);
    			append_dev(b9, t92);
    			append_dev(p9, t93);
    			append_dev(article9, t94);
    			append_dev(article9, hr11);
    			append_dev(div1, t95);
    			append_dev(div1, article10);
    			append_dev(article10, small10);
    			append_dev(small10, t96);
    			append_dev(small10, t97);
    			append_dev(small10, t98);
    			append_dev(article10, t99);
    			append_dev(article10, p10);
    			append_dev(p10, t100);
    			append_dev(p10, b10);
    			append_dev(b10, t101);
    			append_dev(p10, t102);
    			append_dev(article10, t103);
    			append_dev(article10, hr12);
    			append_dev(div1, t104);
    			append_dev(div1, article11);
    			append_dev(article11, small11);
    			append_dev(small11, t105);
    			append_dev(small11, t106);
    			append_dev(article11, t107);
    			append_dev(article11, p11);
    			append_dev(p11, u3);
    			append_dev(p11, t109);
    			append_dev(p11, b11);
    			append_dev(b11, t110);
    			append_dev(p11, t111);
    			append_dev(article11, t112);
    			append_dev(article11, hr13);
    			append_dev(div1, t113);
    			append_dev(div1, article12);
    			append_dev(article12, small12);
    			append_dev(small12, t114);
    			append_dev(small12, t115);
    			append_dev(article12, t116);
    			append_dev(article12, p12);
    			append_dev(p12, t117);
    			append_dev(p12, b12);
    			append_dev(b12, t118);
    			append_dev(p12, t119);
    			append_dev(article12, t120);
    			append_dev(article12, hr14);
    			append_dev(div1, t121);
    			append_dev(div1, article13);
    			append_dev(article13, small13);
    			append_dev(small13, t122);
    			append_dev(small13, t123);
    			append_dev(article13, t124);
    			append_dev(article13, p13);
    			append_dev(p13, u4);
    			append_dev(p13, t126);
    			append_dev(p13, b13);
    			append_dev(b13, t127);
    			append_dev(p13, t128);
    			append_dev(article13, t129);
    			append_dev(article13, hr15);
    			append_dev(div1, t130);
    			append_dev(div1, article14);
    			append_dev(article14, small14);
    			append_dev(small14, t131);
    			append_dev(small14, t132);
    			append_dev(small14, t133);
    			append_dev(article14, t134);
    			append_dev(article14, p14);
    			append_dev(p14, t135);
    			append_dev(p14, b14);
    			append_dev(b14, t136);
    			append_dev(p14, t137);
    			append_dev(article14, t138);
    			append_dev(article14, hr16);
    			append_dev(div1, t139);
    			append_dev(div1, article15);
    			append_dev(article15, small15);
    			append_dev(small15, t140);
    			append_dev(small15, t141);
    			append_dev(small15, t142);
    			append_dev(article15, t143);
    			append_dev(article15, p15);
    			append_dev(p15, u5);
    			append_dev(p15, t145);
    			append_dev(p15, b15);
    			append_dev(b15, t146);
    			append_dev(p15, t147);
    			append_dev(article15, t148);
    			append_dev(article15, hr17);
    			append_dev(div1, t149);
    			append_dev(div1, article16);
    			append_dev(article16, small16);
    			append_dev(small16, t150);
    			append_dev(small16, t151);
    			append_dev(article16, t152);
    			append_dev(article16, p16);
    			append_dev(p16, b16);
    			append_dev(b16, t153);
    			append_dev(p16, t154);
    			append_dev(article16, t155);
    			append_dev(article16, hr18);
    			append_dev(div1, t156);
    			append_dev(div1, article17);
    			append_dev(article17, small17);
    			append_dev(small17, t157);
    			append_dev(small17, t158);
    			append_dev(small17, t159);
    			append_dev(article17, t160);
    			append_dev(article17, p17);
    			append_dev(p17, b17);
    			append_dev(b17, t161);
    			append_dev(p17, t162);
    			append_dev(article17, t163);
    			append_dev(article17, hr19);
    			append_dev(div1, t164);
    			append_dev(div1, article18);
    			append_dev(article18, small18);
    			append_dev(small18, t165);
    			append_dev(small18, t166);
    			append_dev(article18, t167);
    			append_dev(article18, p18);
    			append_dev(p18, b18);
    			append_dev(b18, t168);
    			append_dev(p18, t169);
    			append_dev(article18, t170);
    			append_dev(article18, hr20);
    			append_dev(div1, t171);
    			append_dev(div1, article19);
    			append_dev(article19, small19);
    			append_dev(small19, t172);
    			append_dev(small19, t173);
    			append_dev(small19, t174);
    			append_dev(article19, t175);
    			append_dev(article19, p19);
    			append_dev(p19, b19);
    			append_dev(b19, t176);
    			append_dev(p19, t177);
    			append_dev(article19, t178);
    			append_dev(article19, hr21);
    			append_dev(div1, t179);
    			append_dev(div1, article20);
    			append_dev(article20, small20);
    			append_dev(small20, t180);
    			append_dev(small20, t181);
    			append_dev(small20, t182);
    			append_dev(article20, t183);
    			append_dev(article20, p20);
    			append_dev(p20, t184);
    			append_dev(p20, b20);
    			append_dev(b20, t185);
    			append_dev(p20, t186);
    			append_dev(article20, t187);
    			append_dev(article20, hr22);
    			append_dev(div1, t188);
    			append_dev(div1, article21);
    			append_dev(article21, small21);
    			append_dev(small21, t189);
    			append_dev(small21, t190);
    			append_dev(small21, t191);
    			append_dev(article21, t192);
    			append_dev(article21, p21);
    			append_dev(p21, t193);
    			append_dev(p21, b21);
    			append_dev(b21, t194);
    			append_dev(p21, t195);
    			append_dev(article21, t196);
    			append_dev(article21, hr23);
    			append_dev(div1, t197);
    			append_dev(div1, article22);
    			append_dev(article22, small22);
    			append_dev(small22, t198);
    			append_dev(small22, t199);
    			append_dev(small22, t200);
    			append_dev(article22, t201);
    			append_dev(article22, p22);
    			append_dev(p22, t202);
    			append_dev(p22, b22);
    			append_dev(b22, t203);
    			append_dev(p22, t204);
    			append_dev(article22, t205);
    			append_dev(article22, hr24);
    			append_dev(div1, t206);
    			append_dev(div1, article23);
    			append_dev(article23, small23);
    			append_dev(small23, t207);
    			append_dev(small23, t208);
    			append_dev(small23, t209);
    			append_dev(article23, t210);
    			append_dev(article23, p23);
    			append_dev(p23, t211);
    			append_dev(p23, b23);
    			append_dev(b23, t212);
    			append_dev(p23, t213);
    			append_dev(article23, t214);
    			append_dev(article23, hr25);
    			insert_dev(target, t215, anchor);
    			insert_dev(target, br, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*gerund*/ 1 && input0.value !== /*gerund*/ ctx[0]) {
    				set_input_value(input0, /*gerund*/ ctx[0]);
    			}

    			if (dirty & /*trans*/ 2 && input1.value !== /*trans*/ ctx[1]) {
    				set_input_value(input1, /*trans*/ ctx[1]);
    			}

    			const quizmodal_changes = {};
    			if (dirty & /*gerund*/ 1) quizmodal_changes.gerund = /*gerund*/ ctx[0];
    			if (dirty & /*trans*/ 2) quizmodal_changes.trans = /*trans*/ ctx[1];
    			quizmodal.$set(quizmodal_changes);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t8, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t11, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t16, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t20, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t25, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t29, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t34, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t38, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t43, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t46, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t51, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t55, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t60, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t64, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t69, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t73, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t78, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t82, /*bones*/ ctx[2]);
    			if (!current || dirty & /*trans*/ 2) set_data_dev(t87, /*trans*/ ctx[1]);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t92, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t97_value !== (t97_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t97, t97_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t101, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t106_value !== (t106_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t106, t106_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t110, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t115_value !== (t115_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t115, t115_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t118, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t123_value !== (t123_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t123, t123_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t127, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t132_value !== (t132_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t132, t132_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t136, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t141_value !== (t141_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t141, t141_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t146, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t150_value !== (t150_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t150, t150_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t153, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t158_value !== (t158_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t158, t158_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t161, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t165_value !== (t165_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t165, t165_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t168, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t173_value !== (t173_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t173, t173_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t176, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t181_value !== (t181_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t181, t181_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t185, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t190_value !== (t190_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t190, t190_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t194, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t199_value !== (t199_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t199, t199_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t203, /*bones*/ ctx[2]);
    			if ((!current || dirty & /*trans*/ 2) && t208_value !== (t208_value = /*trans*/ ctx[1].split("ing")[0] + "")) set_data_dev(t208, t208_value);
    			if (!current || dirty & /*bones*/ 4) set_data_dev(t212, /*bones*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quizmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quizmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(quizmodal);
    			if (detaching) detach_dev(t215);
    			if (detaching) detach_dev(br);
    			mounted = false;
    			run_all(dispose);
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
    	// let pieces = gerund.split("na")
    	// if (pieces.length > 1){
    	//   return pieces.splice(0, pieces.length-2).join('na') + 'na';
    	// } else {
    	//   return gerund
    	// }
    	return gerund;
    }

    function instance($$self, $$props, $$invalidate) {
    	let bones;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let gerund = "khaa";
    	let trans = "eating";
    	let questions = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		gerund = this.value;
    		$$invalidate(0, gerund);
    	}

    	function input1_input_handler() {
    		trans = this.value;
    		$$invalidate(1, trans);
    	}

    	$$self.$capture_state = () => ({
    		ContactCard,
    		Swal: sweetalert2_all,
    		QuizModal,
    		gerund,
    		trans,
    		questions,
    		sanitize,
    		bones
    	});

    	$$self.$inject_state = $$props => {
    		if ('gerund' in $$props) $$invalidate(0, gerund = $$props.gerund);
    		if ('trans' in $$props) $$invalidate(1, trans = $$props.trans);
    		if ('questions' in $$props) questions = $$props.questions;
    		if ('bones' in $$props) $$invalidate(2, bones = $$props.bones);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*gerund*/ 1) {
    			$$invalidate(2, bones = sanitize(gerund));
    		}
    	};

    	return [gerund, trans, bones, input0_input_handler, input1_input_handler];
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
