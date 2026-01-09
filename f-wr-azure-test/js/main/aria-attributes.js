/**
 * WAI-ARIA attributes
 *
 * Quicker to type, intellisensible, documents what they're for, and saves a
 * tiny amount of code by replacing the string 'aria-' with a minifiable
 * variable and dot notation.
 *
 * @module aria-attributes
 * @author Web Development
 * @copyright City, University of London 2018
 */

/**
 * @readonly
 * @enum {string}
 */
const aria = {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    activeDescendant: 'aria-activedescendant',
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    atomic: 'aria-atomic',
    /** Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. */
    autoComplete: 'aria-autocomplete',
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    busy: 'aria-busy',
    /** Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. */
    checked: 'aria-checked',
    /** Defines the total number of columns in a table, grid, or treegrid. */
    colCount: 'aria-colcount',
    /** Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. */
    colIndex: 'aria-colindex',
    /** Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. */
    colSpan: 'aria-colspan',
    /** Identifies the element (or elements) whose contents or presence are controlled by the current element. */
    controls: 'aria-controls',
    /** Indicates the element that represents the current item within a container or set of related elements. */
    current: 'aria-current',
    /** Identifies the element (or elements) that describes the object. */
    describedBy: 'aria-describedby',
    /** Identifies the element that provides a detailed, extended description for the object. */
    details: 'aria-details',
    /** Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. */
    disabled: 'aria-disabled',
    /** [Deprecated in ARIA 1.1] Indicates what functions can be performed when a dragged object is released on the drop target. */
    dropEffect: 'aria-dropeffect',
    /** Identifies the element that provides an error message for the object. */
    errorMessage: 'aria-errormessage',
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    expanded: 'aria-expanded',
    /** Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. */
    flowTo: 'aria-flowto',
    /** [Deprecated in ARIA 1.1] Indicates an element's "grabbed" state in a drag-and-drop operation. */
    grabbed: 'aria-grabbed',
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    hasPopup: 'aria-haspopup',
    /** Indicates whether the element is exposed to an accessibility API. */
    hidden: 'aria-hidden',
    /** Indicates the entered value does not conform to the format expected by the application. */
    invalid: 'aria-invalid',
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    keyShortcuts: 'aria-keyshortcuts',
    /** Defines a string value that labels the current element. */
    label: 'aria-label',
    /** Identifies the element (or elements) that labels the current element. */
    labelledBy: 'aria-labelledby',
    /** Defines the hierarchical level of an element within a structure. */
    level: 'aria-level',
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    live: 'aria-live',
    /** Indicates whether an element is modal when displayed. */
    modal: 'aria-modal',
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    multiLine: 'aria-multiline',
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    multiSelectable: 'aria-multiselectable',
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    orientation: 'aria-orientation',
    /** Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. */
    owns: 'aria-owns',
    /** Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. */
    placeholder: 'aria-placeholder',
    /** Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. */
    posInset: 'aria-posinset',
    /** Indicates the current "pressed" state of toggle buttons. */
    pressed: 'aria-pressed',
    /** Indicates that the element is not editable, but is otherwise operable. */
    readOnly: 'aria-readonly',
    /** Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. */
    relevant: 'aria-relevant',
    /** Indicates that user input is required on the element before a form may be submitted. */
    required: 'aria-required',
    /** Defines a human-readable, author-localized description for the role of an element. */
    roleDescription: 'aria-roledescription',
    /** Defines the total number of rows in a table, grid, or treegrid. */
    rowCount: 'aria-rowcount',
    /** Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. */
    rowIndex: 'aria-rowindex',
    /** Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. */
    rowSpan: 'aria-rowspan',
    /** Indicates the current "selected" state of various widgets. */
    selected: 'aria-selected',
    /** Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. */
    setSize: 'aria-setsize',
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    sort: 'aria-sort',
    /** Defines the maximum allowed value for a range widget. */
    valueMax: 'aria-valuemax',
    /** Defines the minimum allowed value for a range widget. */
    valueMin: 'aria-valuemin',
    /** Defines the current value for a range widget. */
    valueNow: 'aria-valuenow',
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    valueText: 'aria-valuetext',
};
exports.aria = Object.freeze(aria);