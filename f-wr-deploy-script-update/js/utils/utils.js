/**
 * Turns string boolean into real boolean.
 *
 * @param {string} s - A string that may be 'true'.
 * @returns {boolean} True if 'true'.
 */
const toBool =  function toBool(s) {
    return s === 'true' ? true : false;
}

/**
 * Append an array of elements to an element.
 *
 * @param {HTMLElement} elem - The parent element.
 * @param {HTMLElement[]} children - An array of elements to append to it.
 */
const appendAll = function (elem, children) {
    children.forEach((child) => elem.appendChild(child));
}

/**
 * Predicate testing whether an element is positioned in the window.
 *
 *
 * @param {HTMLElement} elem - An HTML element.
 * @returns {boolean} - Is it onscreen?
 */
const verticallyInWindow =  function(elem) {
    return elem.getBoundingClientRect().top >= 0 &&
        elem.getBoundingClientRect().top <= window.innerHeight
        ? true
        : false;
}


exports.appendAll = appendAll;
exports.toBool = toBool;
exports.verticallyInWindow = verticallyInWindow;
