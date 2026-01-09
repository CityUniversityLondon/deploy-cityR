CITY.guidelines = (function () {

    var metaViewport = document.querySelector('meta[name="viewport"]');
    var metaCharset = document.querySelector('meta[charset]');
    var metaViewportStr = metaViewport && metaViewport.outerHTML || '';
    var metaCharsetStr = metaCharset && metaCharset.outerHTML || '';
    var queryCache = {};

    /**
     * Get the styling nodes to inject in the head of the embedded document
     *
     * @param  {String} selector
     * @return {String}
     */
    function getStylingNodes(selector) {
        if (typeof queryCache[selector] === 'undefined') {
            queryCache[selector] = Array.prototype.map.call(
                document.querySelectorAll(selector),
                function (stylesheet) {
                    return stylesheet.outerHTML;
                }
            ).join('');
        }

        return queryCache[selector];
    }

    /**
     * Get the content for the iframified version of a node.
     *
     * @param  {HTMLElement} node
     * @param  {Object} options
     * @return {String}
     */
    function getIframeContentForNode(node, options) {
        return '<!doctype html>' +
            '<html ' + options.htmlAttr + '>' +
            '<head>' +
            options.metaCharset +
            options.metaViewport +
            options.stylesheets +
            options.styles +
            '</head>' +
            '<body ' + options.bodyAttr + '>' +
            node.innerHTML +
            '</body>' +
            '</html>';
    }

    /**
     * Format an object of attributes into a HTML string
     *
     * @param  {Object} attrObj
     * @return {String}
     */
    function formatAttributes(attrObj) {
        var attributes = [];

        for (var attribute in attrObj) {
            attributes.push(attribute + '="' + attrObj[attribute] + '"');
        }

        return attributes.join(' ');
    }

    /**
     * Get document height (stackoverflow.com/questions/1145850/)
     *
     * @param  {Document} doc
     * @return {Number}
     */
    function getDocumentHeight(doc) {
        doc = doc || document;
        var body = doc.body;
        var html = doc.documentElement;

        return Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
    }

    function getOptions(options) {
        var opts = options || {};
        opts.htmlAttr = formatAttributes(opts.htmlAttr || {});
        opts.bodyAttr = formatAttributes(opts.bodyAttr || {});
        opts.sizingTimeout = opts.sizingTimeout || 1000;
        opts.styles = (opts.styles ? '<style>' + opts.styles + '</style>' : '');
        opts.stylesheets = getStylingNodes(opts.stylesSelector || 'link[rel*=stylesheet], style');
        opts.metaCharset = opts.metaCharset || metaCharsetStr;
        opts.metaViewport = opts.metaViewport || metaViewportStr;

        return opts;
    }

    /**
     * Transform a collection of nodes into an iframe version of themselves
     * including all the styles they need to perform correctly.
     *
     * @param  {HTMLElement} nodes
     * @param  {Object} options
     * @return undefined
     */
    function iframify(node, options) {
        options = getOptions(options);

        var iframe = document.createElement('iframe');
        iframe.srcdoc = getIframeContentForNode(node, options);
        node.parentNode.replaceChild(iframe, node);

        setTimeout(function () {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframe.height = getDocumentHeight(iframeDocument);
        }, options.sizingTimeout);

        return iframe;
    }


    var
        $menuToggler = $(".menu-toggler"),
        $menuTogglerIcon = $(".menu-toggler i"),
        $nav = $(".navigation"),

    // hack for dev testing, removing when live
        devHack = function () {
            $("a").attr("href", function (i, val) {
                return val + "?dev=guidelines"
            });
        },

        guidelinesInit = function () {
            $menuToggler.click(function () {
                $menuToggler.toggleClass("menu-toggler-close");
                $nav.toggleClass("sr-only");
                $menuTogglerIcon.toggleClass("icon-reorder").toggleClass("icon-remove-sign");
            });

            //devHack();

            $('.guidelines-component').each(function () {
                var component = $(this);
                var content = component.find('.guidelines-component__presentation__contents');

                var templateSrc = component.find('script.hb-template').html();
                var modelDefault = component.find('script.model-default').html();
                var modelDescription = component.find('script.model-description').html();

                if (templateSrc) {
                    var model = JSON.parse(modelDefault || "{}");
                    var template = Handlebars.compile(templateSrc);
                    var code = template(model);

                    content.html(code);

                    var codeDisplay = component.find('.guidelines-component__code');

                    codeDisplay.html('');

                    codeDisplay.append('<h3>Template</h3>')
                        .append($('<pre></pre>').append($('<code></code>').text(templateSrc)));

                    if (modelDescription) {
                        codeDisplay.append('<h3>Data model</h3>')
                            .append($('<pre></pre>').append($('<code></code>').text(modelDescription)));

                    }

                    if (modelDefault) {
                        codeDisplay.append('<h3>Test data</h3>')
                            .append($('<pre></pre>').append($('<code></code>').text(modelDefault)));

                    }
                }

                iframify(content[0], {
                    styles: 'body > * { margin: 0 !important; overflow: hidden; }'
                });
            });

            $("[class*='guidelines-component__controls__']").click(function () {
                var targetComponent = $(this).closest(".guidelines-component");
                var targetIframe = targetComponent.find('iframe');
                setTimeout(function () {
                    var iframeDocument = targetIframe.contentDocument || targetIframe[0].contentWindow.document;
                    targetIframe.attr("height", iframeDocument.body.scrollHeight);
                    window.location.hash = "#";
                    window.location.hash = "#" + targetComponent.attr('id');
                }, 1000);
            });
        };

    return {
        init: guidelinesInit
    }

}(CITY.debug));

CITY.guidelines.init();
