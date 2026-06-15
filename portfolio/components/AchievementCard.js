// AchievementCard component (vanilla JavaScript)
// This module defines a simple function that creates a DOM element representing an achievement.
// It does NOT rely on any external libraries (e.g., React) and can be used directly from script.js.

/**
 * Creates a DOM element for an achievement card.
 *
 * @param {Object} options - The achievement data.
 * @param {string} options.title - The title of the achievement.
 * @param {string} options.description - A short description of the achievement.
 * @param {string} [options.imageUrl] - URL of an image representing the achievement. Optional.
 * @returns {HTMLElement} The constructed achievement card element.
 */
function AchievementCard({ title, description, imageUrl }) {
    // Create the container
    const card = document.createElement('div');
    card.className = 'achievement-card';

    // Image (if provided)
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = title + ' image';
        img.className = 'achievement-image';
        card.appendChild(img);
    }

    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'achievement-title';
    titleEl.textContent = title;
    card.appendChild(titleEl);

    // Description
    const descEl = document.createElement('p');
    descEl.className = 'achievement-description';
    descEl.textContent = description;
    card.appendChild(descEl);

    return card;
}

// Expose the component globally so other scripts (e.g., script.js) can use it.
window.AchievementCard = AchievementCard;
