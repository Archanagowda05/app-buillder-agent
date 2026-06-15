/*
 * Footer Component (Vanilla JavaScript)
 * -----------------------------------
 * This module defines a lightweight Footer component that can be used
 * in a pure HTML/CSS/JS project. It creates the markup for the site
 * footer, including navigation links, social media links, and copyright
 * information, and injects it into the DOM.
 *
 * Usage:
 *   const footer = new Footer({
 *     container: document.querySelector('footer') // optional, defaults to <footer>
 *   });
 *   footer.render();
 *
 * The component does not rely on any external libraries or frameworks.
 */

(() => {
  "use strict";

  /**
   * Footer class – creates a footer element with useful links and info.
   * @param {Object} [options]
   * @param {HTMLElement|string} [options.container] - The element or selector
   *   where the footer markup will be injected. If omitted, a new <footer>
   *   element is appended to <body>.
   * @param {Array<{label:string, href:string}>} [options.links] - Footer navigation links.
   * @param {Array<{label:string, href:string, icon?:string}>} [options.social] - Social media links.
   * @param {string} [options.copyright] - Copyright text.
   */
  class Footer {
    constructor(options = {}) {
      const defaults = {
        container: null,
        links: [
          { label: "Privacy Policy", href: "#privacy" },
          { label: "Terms of Service", href: "#terms" },
          { label: "Contact", href: "#contact" },
        ],
        social: [
          { label: "Twitter", href: "https://twitter.com", icon: "🐦" },
          { label: "Facebook", href: "https://facebook.com", icon: "📘" },
          { label: "LinkedIn", href: "https://linkedin.com", icon: "🔗" },
        ],
        copyright: `© ${new Date().getFullYear()} Company Name. All rights reserved.`,
      };
      this.opts = Object.assign({}, defaults, options);
    }

    /**
     * Creates the DOM structure for the footer.
     * @returns {HTMLElement} The constructed <footer> element.
     */
    _buildFooter() {
      // <footer>
      const footerEl = document.createElement("footer");

      // Container div (optional styling hook)
      const containerDiv = document.createElement("div");
      containerDiv.className = "container";

      // ----- Navigation Links -----
      const nav = document.createElement("nav");
      nav.setAttribute("aria-label", "Footer navigation");
      const ul = document.createElement("ul");
      ul.className = "footer-links";

      this.opts.links.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        ul.appendChild(li);
      });
      nav.appendChild(ul);

      // ----- Social Media Links -----
      const socialDiv = document.createElement("div");
      socialDiv.className = "footer-social";
      this.opts.social.forEach((item) => {
        const a = document.createElement("a");
        a.href = item.href;
        a.setAttribute("aria-label", item.label);
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = item.icon ? item.icon : item.label;
        socialDiv.appendChild(a);
      });

      // ----- Copyright -----
      const p = document.createElement("p");
      p.className = "footer-copy";
      p.textContent = this.opts.copyright;

      // Assemble all parts
      containerDiv.appendChild(nav);
      containerDiv.appendChild(socialDiv);
      containerDiv.appendChild(p);
      footerEl.appendChild(containerDiv);

      return footerEl;
    }

    /**
     * Render the footer into the target container.
     */
    render() {
      const target = this._resolveContainer();
      const footerMarkup = this._buildFooter();

      // If the target itself is a <footer>, replace its contents.
      if (target.tagName.toLowerCase() === "footer") {
        while (target.firstChild) target.removeChild(target.firstChild);
        while (footerMarkup.firstChild) target.appendChild(footerMarkup.firstChild);
      } else {
        target.appendChild(footerMarkup);
      }
    }

    /**
     * Resolve the container element based on the provided option.
     * @returns {HTMLElement}
     */
    _resolveContainer() {
      let el = null;
      if (!this.opts.container) {
        // No container supplied – create a new <footer> at the end of body.
        el = document.createElement("footer");
        document.body.appendChild(el);
        return el;
      }
      if (typeof this.opts.container === "string") {
        el = document.querySelector(this.opts.container);
      } else if (this.opts.container instanceof HTMLElement) {
        el = this.opts.container;
      }
      // Fallback: if selector not found, create a new footer.
      if (!el) {
        el = document.createElement("footer");
        document.body.appendChild(el);
      }
      return el;
    }
  }

  // Expose globally so other scripts (e.g., script.js) can instantiate it.
  window.Footer = Footer;
})();