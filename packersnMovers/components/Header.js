/*
 * Header Component (Vanilla JavaScript)
 * -----------------------------------
 * This module defines a lightweight Header component that can be used
 * in a pure HTML/CSS/JS project. It creates the markup for the site
 * header, including the logo and navigation links, and injects it into
 * the DOM.
 *
 * Usage:
 *   const header = new Header({
 *     container: document.querySelector('header') // optional, defaults to <header>
 *   });
 *   header.render();
 *
 * The component does not rely on any external libraries or frameworks.
 */

(() => {
  "use strict";

  /**
   * Header class – creates a header element with logo and navigation.
   * @param {Object} [options]
   * @param {HTMLElement|string} [options.container] - The element or selector
   *   where the header markup will be injected. If omitted, a new <header>
   *   element is appended to <body>.
   * @param {string} [options.logoText] - Text for the logo. Defaults to "Company Name".
   * @param {string} [options.logoHref] - URL for the logo link. Defaults to "#".
   * @param {Array<{label:string, href:string}>} [options.navItems] - Navigation items.
   */
  class Header {
    constructor(options = {}) {
      const defaults = {
        container: null,
        logoText: "Company Name",
        logoHref: "#",
        navItems: [
          { label: "Services", href: "#services" },
          { label: "Testimonials", href: "#testimonials" },
          { label: "Contact", href: "#contact" },
        ],
      };
      this.opts = Object.assign({}, defaults, options);
    }

    /**
     * Creates the DOM structure for the header.
     * @returns {HTMLElement} The constructed <header> element.
     */
    _buildHeader() {
      // <header>
      const headerEl = document.createElement("header");

      // Container div
      const containerDiv = document.createElement("div");
      containerDiv.className = "container";

      // Logo
      const h1 = document.createElement("h1");
      h1.className = "logo";
      const logoLink = document.createElement("a");
      logoLink.href = this.opts.logoHref;
      logoLink.setAttribute("aria-label", `${this.opts.logoText} Home`);
      logoLink.textContent = this.opts.logoText;
      h1.appendChild(logoLink);

      // Navigation
      const nav = document.createElement("nav");
      nav.setAttribute("aria-label", "Main navigation");
      const ul = document.createElement("ul");

      this.opts.navItems.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        ul.appendChild(li);
      });

      nav.appendChild(ul);

      // Assemble
      containerDiv.appendChild(h1);
      containerDiv.appendChild(nav);
      headerEl.appendChild(containerDiv);

      return headerEl;
    }

    /**
     * Render the header into the target container.
     */
    render() {
      const target = this._resolveContainer();
      const headerMarkup = this._buildHeader();

      // If the target is an existing <header>, replace its contents.
      if (target.tagName.toLowerCase() === "header") {
        // Clear existing children
        while (target.firstChild) {
          target.removeChild(target.firstChild);
        }
        // Append new markup
        while (headerMarkup.firstChild) {
          target.appendChild(headerMarkup.firstChild);
        }
      } else {
        // Append the whole header element to the target.
        target.appendChild(headerMarkup);
      }
    }

    /**
     * Resolve the container element based on the provided option.
     * @returns {HTMLElement}
     */
    _resolveContainer() {
      let el = null;
      if (!this.opts.container) {
        // No container supplied – create a new <header> at the top of body.
        el = document.createElement("header");
        document.body.insertBefore(el, document.body.firstChild);
        return el;
      }
      if (typeof this.opts.container === "string") {
        el = document.querySelector(this.opts.container);
      } else if (this.opts.container instanceof HTMLElement) {
        el = this.opts.container;
      }
      // Fallback: if selector not found, create a new header.
      if (!el) {
        el = document.createElement("header");
        document.body.insertBefore(el, document.body.firstChild);
      }
      return el;
    }
  }

  // Expose globally so other scripts (e.g., script.js) can instantiate it.
  window.Header = Header;
})();