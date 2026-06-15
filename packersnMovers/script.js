// script.js
// Main client-side entry point for the application.
// This file sets up the JavaScript environment, provides minimal polyfills,
// and defines the initialization routine that runs when the DOM is ready.

(() => {
  "use strict";

  // ---------- Minimal Polyfills (if needed) ----------
  // Polyfill for Element.closest for older browsers (IE9+ support)
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      let el = this;
      while (el) {
        if (el.matches(selector)) return el;
        el = el.parentElement;
      }
      return null;
    };
  }

  // Polyfill for NodeList.forEach for older browsers
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // ---------- Application Entry Point ----------
  /**
   * initApp - Called when the DOM is fully loaded.
   * Place any startup logic here (event listeners, initial UI rendering, etc.).
   */
  function initApp() {
    console.log("Application initialized.");
    // Example: Attach a click listener to elements with data-action="example"
    document.body.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      const action = target.getAttribute("data-action");
      // Dispatch based on action attribute – placeholder for future logic
      switch (action) {
        case "example":
          handleExampleAction(target);
          break;
        // Add more cases as needed
        default:
          console.warn(`No handler for action: ${action}`);
      }
    });
  }

  /**
   * handleExampleAction - Sample handler demonstrating how actions can be processed.
   * @param {Element} element - The element that triggered the action.
   */
  function handleExampleAction(element) {
    alert("Example action triggered!");
    // Future logic can be added here.
  }

  // Register the initApp function to run when the DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    // DOM already loaded
    initApp();
  }
})();
