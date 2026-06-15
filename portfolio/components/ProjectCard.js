// ProjectCard component - vanilla JavaScript implementation
// Define default data for a project card. These can be overridden when calling renderProjectCard.

export const projectTitle = "My Awesome Project";
export const projectDescription = "A brief description of the project showcasing its features and technologies used.";
export const projectImage = "https://via.placeholder.com/300x200.png?text=Project+Image";

/**
 * Creates and returns a DOM element representing a project card.
 *
 * @param {Object} options - Options to customize the card.
 * @param {string} [options.title] - Title of the project.
 * @param {string} [options.description] - Short description of the project.
 * @param {string} [options.image] - URL of the project image.
 * @returns {HTMLElement} The constructed project card element.
 */
export function renderProjectCard({ title = projectTitle, description = projectDescription, image = projectImage } = {}) {
    // Create container
    const card = document.createElement("div");
    card.className = "project-card";
    card.style.border = "1px solid #ddd";
    card.style.borderRadius = "8px";
    card.style.overflow = "hidden";
    card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    card.style.maxWidth = "300px";
    card.style.fontFamily = "Arial, sans-serif";

    // Image
    const img = document.createElement("img");
    img.src = image;
    img.alt = title;
    img.style.width = "100%";
    img.style.display = "block";
    card.appendChild(img);

    // Content container
    const content = document.createElement("div");
    content.style.padding = "16px";
    card.appendChild(content);

    // Title
    const h3 = document.createElement("h3");
    h3.textContent = title;
    h3.style.margin = "0 0 8px 0";
    h3.style.fontSize = "1.25rem";
    content.appendChild(h3);

    // Description
    const p = document.createElement("p");
    p.textContent = description;
    p.style.margin = "0";
    p.style.fontSize = "1rem";
    p.style.color = "#555";
    content.appendChild(p);

    return card;
}
