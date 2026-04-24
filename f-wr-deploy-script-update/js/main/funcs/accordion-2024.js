module.exports = function () {
    const { aria } = require('../aria-attributes');
    const { appendAll, toBool, verticallyInWindow } = require('../../utils/utils');

    const className = 'accordion',
        headingClassName = className + '__heading',
        headingTextClassName = headingClassName + '__text',
        headingIconClassName = headingClassName + '__indicator',
        bodyClassName = className + '__body',
        oneSecond = 1000,
        tenthOfASecond = 100,
        scrollDuration = oneSecond,
        scrollTo = true;

    /**
     * Cleanup after transition.
     *
     * @param {HTMLElement} accordionSection - The section that transitioned.
     */
    function cleanupTransition(section) {
        const open = toBool(section.previousElementSibling.dataset.open);
        section.style.height = null;
        section.dataset.closed = open ? 'false' : 'true';
    }

    /**
     * Set style properties for transition.
     *
     * @param {HTMLElement} element - The section to transition.
     * @param {string} initialHeight - The initial height from which to transition.
     */
    function setupTransition(element, initialHeight) {
        element.style.height = initialHeight;
        element.dataset.closed = 'false';
        return true;
    }

    /**
     * Open a section, calculate its height, then close it again.
     *
     * With no transition, this is essentially invisible to the user.
     *
     * @param {HTMLHeadingElement} heading - An accordion heading.
     * @return {string} The pixel height of the section when open.
     */
    function calculateAccordionBodyHeight(heading) {
        const section = heading.nextElementSibling;

        setSection(heading, true);
        section.dataset.closed = 'false';
        const height = section.offsetHeight + 'px';

        setSection(heading, false);
        section.dataset.closed = 'true';

        return height;
    }

    /**
     * Respond to button clicks - open if closed, close if open.
     *
     * If opening, will also push the heading ID into the history, so C+Ping the URL
     * will open the most recently viewed section. Closing a section removes any
     * hash.
     *
     * @param {HTMLButtonElement} button - The button that was clicked.
     * @param {HTMLElement[]} headings - All headings in this accordion.
     * @param {boolean} [toggleOpen] - Should other accordion sections close? Default to false.
     */
    function buttonClick(button, headings, toggleOpen, e) {
        e.preventDefault();
        const heading = button.parentNode,
            accordionSection = heading.nextElementSibling;

        /**
         * After we've transitioned the opening/closing, we want to revert to
         * letting the CSS size the element. Add a listener to do this that will
         * self-destruct after running.
         */
        accordionSection.addEventListener(
            'transitionend',
            () => cleanupTransition(accordionSection),
            { capture: true, once: true }
        );

        if (toBool(button.getAttribute(aria.expanded))) {
            // Starting height is the current height
            setupTransition(accordionSection, accordionSection.offsetHeight + 'px');
            // setTimeout lets the DOM recalculate before we continue, so the transition will fire
            setTimeout(() => {
                accordionSection.style.height = '0px';
            }, tenthOfASecond);

            setSection(heading, false);
            // updates URL hash, by removing hash from URL when accordion closes
            //history.pushState({}, null, location.href.split('#')[0]);
        } else {
            // Calclulate and save how big we're transitioning to
            const sectionHeight = calculateAccordionBodyHeight(heading);
            // Starting height is 0
            setupTransition(accordionSection, '0px');
            // setTimeout lets the DOM recalculate before we continue, so the transition will fire
            setTimeout(() => {
                accordionSection.style.height = sectionHeight;
            }, tenthOfASecond);

            if (toggleOpen) {
                const sections = Array.from(
                    heading.parentNode.parentNode.querySelectorAll(
                        `#${heading.parentElement.id} > .${bodyClassName}`
                    )
                );
                headings.forEach((heading) => setSection(heading, false));
                sections
                    .filter((section) => section.id !== accordionSection.id)
                    .forEach((section) => {
                        section.dataset.closed = 'true';
                    });
            }
            setSection(heading, true);
            if (
                scrollTo &&
                !(
                    verticallyInWindow(heading) &&
                    verticallyInWindow(accordionSection)
                )
            ) {
                //scroll.to(heading, scrollDuration);
                window.scrollTo(
                    {
                        top: window.scrollY + heading.getBoundingClientRect().top - 200, 
                        left: window.scrollX + heading.getBoundingClientRect().left,
                        behavior : 'smooth'
                    });
            }

            // updates URL hash with accordion heading, when accordion opens
            //window.location.hash = event.currentTarget.parentElement.id;
        }
    }

    /**
     * Sets a heading and the button nested within to be open or closed.
     *
     * @param {HTMLHeadingElement} heading - An accordion heading.
     * @param {boolean} open - Set this section to be open?
     */
    function setSection(heading, open) {
        heading.dataset.open = open;
        heading.firstElementChild.setAttribute(aria.expanded, open);
    }

    /**
     * Create a button from the text content of a heading.
     *
     * @param {HTMLElement} heading - An accordion heading.
     * @returns {HTMLButtonElement} An accordion section button.
     */
    function buttonFromHeading(heading) {
        const button = document.createElement('button'),
            // Chrome can't apply grid layout to buttons, need to wrap contents
            wrapper = document.createElement('div'),
            textSpan = document.createElement('span'),
            iconSpan = document.createElement('span');

        textSpan.className = headingTextClassName;
        iconSpan.className = headingIconClassName;
        iconSpan.setAttribute(aria.hidden, true);
        button.setAttribute('type', 'button');

        textSpan.appendChild(document.createTextNode(heading.textContent));
        appendAll(wrapper, [textSpan, iconSpan]);
        button.appendChild(wrapper);

        return button;
    }

    return function (accordion, options) {
        const toggleOpen = false,
            defaultOpen = false,
            allowSingle = false,
            headingLevel = accordion.firstElementChild.tagName;

        const headings = Array.from(
            accordion.querySelectorAll(
                `:scope > ${headingLevel}`
            )
        );

        const contentBody = Array.from(
            accordion.querySelectorAll(
                ':scope > :nth-child(even)'
            ));

        contentBody.forEach( body => {
            body.classList.add(bodyClassName);
        });

        let idLinked = false;

        headings.forEach( h => 
            {
                const link = h.querySelector('a');

                if(link) {

                    h.id = h.firstChild.hash;

                    const el = document.createElement('span');
                    el.textContent = h.querySelector('a').textContent;
                    h.firstChild.replaceWith(el);
                }
                 h.classList.add(headingClassName);

                
                const content = h.nextElementSibling,
                    button = buttonFromHeading(h);

                content.setAttribute(aria.labelledBy, h.id);
                content.setAttribute('role', 'region');
                h.replaceChild(button, h.firstChild);

                setSection(h, false);
                h.nextElementSibling.dataset.closed = 'true';

                button.addEventListener(
                    'click',
                    (e) => buttonClick(button, headings, toggleOpen, e),
                    true
                );
            }
        );

        /* Show first item of accordion, if accordion is set to default open,
           and we haven't linked to a specific section */
        if (defaultOpen && !idLinked) {
            setSection(headings[0], true);
            headings[0].nextElementSibling.dataset.closed = 'false';
        }
    }
}();