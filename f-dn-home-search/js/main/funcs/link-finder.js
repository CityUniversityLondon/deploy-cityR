module.exports = function (bodyElement) {


/**
 * Adds a FontAwesome icon (or any other classes) as a <span> element to the specified DOM element.
 * The icon can be appended to the end or prepended to the beginning of the element based on the append flag.
 *
 * @param {HTMLElement} element - The DOM element to which the icon will be added. It must be a valid HTMLElement.
 * @param {string|string[]} classes - A string or an array of strings representing the class(es) to be added to the icon's <span> element. If a single class is passed, it will be added directly. If an array is passed, all classes will be added.
 * @param {boolean} [append=false] - A boolean flag indicating whether the icon should be appended or prepended.
 *                                   If true, the icon will be appended to the end of the element. 
 *                                   If false or not provided, the icon will be prepended to the beginning.
 *
 * Usage:
 * addIcon(element, 'fa-kit', true);       // Appends a single class icon
 * addIcon(element, ['fa-kit', 'fa-share'], false); // Prepends multiple classes
 */
    function addIcon(element, classes, append = false) {
        if (element && classes) {
            // Create span for FA icon
            const spanNode = document.createElement('span');
            
            // Check if 'classes' is a string (single class) or an array (multiple classes)
            if (typeof classes === 'string') {
                spanNode.classList.add(classes);  // Add the single class
            } else if (Array.isArray(classes)) {
                classes.forEach(cls => spanNode.classList.add(cls));  // Add multiple classes
            }
   
            // Append or prepend the icon based on the `pos` parameter
            if (append) {
                element.append(' ',spanNode); // Adds icon to the beginning
            } else {
                element.prepend(spanNode);  // Adds icon to the end
            }
        }
    }

/**
 * Checks if provided element is a sharepoint link and if so adds the fa-sharepoint icon.
 *
*/
    function findSharepointLink(anchor) {
        const url = new URL(anchor.href);
        const excludedExtensions = ['.pdf', '.docx', '.xlsx', '.pptx', '.xls', '.doc']; 
        const pathname = url.pathname.toLowerCase();
        // Check if the URL hostname ends with sharepoint.com and does not have an excluded extension
        const hasExcludedExtension = excludedExtensions.some(ext => pathname.endsWith(ext));

        if (url.hostname.endsWith('sharepoint.com') && !hasExcludedExtension) {
            const firstChild = anchor.firstChild;
            if (firstChild && firstChild.nodeType === 3 && firstChild.nodeValue.trim() !== '') {
                // Only add the icon if the first child of anchor is a text node, avoiding duplicate icons
                addIcon(anchor, ['fa-kit', 'fa-sharepoint']);
            }
        }
    }



    /**
     * Loop over every link and apply nessessary classes
     *
     */
    function findLinks() {
        const anchors = bodyElement.querySelectorAll('a');

        anchors.forEach(function (anchor) {
            findSharepointLink(anchor);
        });
    }

    findLinks();

};
