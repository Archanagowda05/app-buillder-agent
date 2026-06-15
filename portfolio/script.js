/*
 * script.js - Vanilla JavaScript implementation for dynamic site rendering.
 *
 * This file parses the JSON data embedded in the <script id="site-data" type="application/json">
 * element of index.html and populates the navigation bar, main content area, and footer.
 * It also defines two reusable component classes – ProjectCard and AchievementCard – that
 * generate DOM structures representing a project and an achievement respectively.
 *
 * The implementation follows the project rules: **no React or external libraries** are used.
 */

/**
 * Utility: safely parse JSON from a <script type="application/json"> element.
 * @param {string} selector - CSS selector for the script element containing JSON.
 * @returns {object|null} Parsed object or null if parsing fails.
 */
function getJsonData(selector) {
  const scriptEl = document.querySelector(selector);
  if (!scriptEl) return null;
  try {
    return JSON.parse(scriptEl.textContent);
  } catch (e) {
    console.error('Failed to parse JSON data from', selector, e);
    return null;
  }
}

/**
 * Render the navigation bar based on an array of link objects.
 * Each link object should have the shape: { name: string, href: string }.
 * The function populates the <ul> inside the element with class "site-nav".
 *
 * @param {Array<{name:string, href:string}>} navLinks
 */
function renderNavBar(navLinks) {
  const navContainer = document.querySelector('.site-nav ul');
  if (!navContainer) return;

  // Clear any existing items
  navContainer.innerHTML = '';

  navLinks.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = link.name;
    a.href = link.href || '#';
    li.appendChild(a);
    navContainer.appendChild(li);
  });
}

/**
 * Render the main content area.
 * Expects an object with "heading" and "paragraph" properties.
 * The content is placed inside the <section> element within .site-main.
 *
 * @param {{heading:string, paragraph:string}} mainContent
 */
function renderMainContent(mainContent) {
  const mainSection = document.querySelector('.site-main section');
  if (!mainSection) return;

  // Clear existing content
  mainSection.innerHTML = '';

  const h2 = document.createElement('h2');
  h2.textContent = mainContent.heading || '';
  const p = document.createElement('p');
  p.textContent = mainContent.paragraph || '';

  mainSection.appendChild(h2);
  mainSection.appendChild(p);
}

/**
 * Render the footer. The JSON can optionally contain a "footerText" property.
 * If not provided, the existing markup is left untouched.
 *
 * @param {{footerText?:string}} footerData
 */
function renderFooter(footerData) {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  // If a custom footer text is supplied, replace the innerHTML.
  if (footerData && footerData.footerText) {
    footer.innerHTML = `<p>${footerData.footerText}</p>`;
  }
}

/**
 * Class representing a generic card component for a project.
 * It creates a DOM element with the following structure:
 *   <div class="project-card">
 *     <img src="..." alt="..." class="project-card-image" />
 *     <h3 class="project-card-title">...</h3>
 *     <p class="project-card-description">...</p>
 *     <a href="..." class="project-card-link" target="_blank">Learn more</a>
 *   </div>
 */
class ProjectCard {
  /**
   * @param {object} options
   * @param {string} options.title - Project title.
   * @param {string} options.description - Short description.
   * @param {string} [options.imageUrl] - URL of the thumbnail image.
   * @param {string} [options.link] - URL to the full project page.
   */
  constructor({ title, description, imageUrl, link }) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.link = link;
  }

  /**
   * Generates and returns the DOM element for this card.
   * @returns {HTMLElement}
   */
  render() {
    const card = document.createElement('div');
    card.className = 'project-card';

    if (this.imageUrl) {
      const img = document.createElement('img');
      img.src = this.imageUrl;
      img.alt = this.title;
      img.className = 'project-card-image';
      card.appendChild(img);
    }

    const titleEl = document.createElement('h3');
    titleEl.className = 'project-card-title';
    titleEl.textContent = this.title;
    card.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.className = 'project-card-description';
    descEl.textContent = this.description;
    card.appendChild(descEl);

    if (this.link) {
      const linkEl = document.createElement('a');
      linkEl.href = this.link;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.className = 'project-card-link';
      linkEl.textContent = 'Learn more';
      card.appendChild(linkEl);
    }

    return card;
  }
}

/**
 * Class representing an achievement card.
 * Structure:
 *   <div class="achievement-card">
 *     <h4 class="achievement-title">...</h4>
 *     <p class="achievement-description">...</p>
 *   </div>
 */
class AchievementCard {
  /**
   * @param {object} options
   * @param {string} options.title - Title of the achievement.
   * @param {string} options.description - Description or details.
   */
  constructor({ title, description }) {
    this.title = title;
    this.description = description;
  }

  /**
   * Returns a DOM element representing the achievement.
   * @returns {HTMLElement}
   */
  render() {
    const card = document.createElement('div');
    card.className = 'achievement-card';

    const titleEl = document.createElement('h4');
    titleEl.className = 'achievement-title';
    titleEl.textContent = this.title;
    card.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.className = 'achievement-description';
    descEl.textContent = this.description;
    card.appendChild(descEl);

    return card;
  }
}

/**
 * Initialize the page once the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  const siteData = getJsonData('#site-data');
  if (!siteData) {
    console.warn('No site data found – skipping dynamic rendering.');
    return;
  }

  // Render core sections
  if (Array.isArray(siteData.navLinks)) renderNavBar(siteData.navLinks);
  if (siteData.mainContent) renderMainContent(siteData.mainContent);
  if (siteData.footer) renderFooter(siteData.footer);

  // Example usage of ProjectCard and AchievementCard.
  // These examples assume there are containers with IDs "projects" and "achievements"
  // elsewhere in the HTML. If such containers do not exist, the code silently does nothing.

  // Render sample project cards
  const projectsContainer = document.getElementById('projects');
  if (projectsContainer && Array.isArray(siteData.projects)) {
    siteData.projects.forEach(p => {
      const card = new ProjectCard(p);
      projectsContainer.appendChild(card.render());
    });
  }

  // Render sample achievement cards
  const achievementsContainer = document.getElementById('achievements');
  if (achievementsContainer && Array.isArray(siteData.achievements)) {
    siteData.achievements.forEach(a => {
      const card = new AchievementCard(a);
      achievementsContainer.appendChild(card.render());
    });
  }
});

// Export symbols for potential external usage (e.g., other script modules).
window.SiteRenderer = {
  renderNavBar,
  renderMainContent,
  renderFooter,
  ProjectCard,
  AchievementCard,
};
