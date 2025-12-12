// Intersection observer for fade-up animation
document.addEventListener('DOMContentLoaded', () => {
  const faders = document.querySelectorAll('.fade-up');
  const observerOptions = {
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  faders.forEach(el => observer.observe(el));

  // Load change feed if on changes page
  const feedContainer = document.getElementById('feed-container');
  if (feedContainer) {
    fetch('change-feed.json')
      .then(res => res.json())
      .then(data => {
        const genAt = document.getElementById('generated-at');
        if (genAt && data.generatedAt) {
          genAt.textContent = `Generated: ${data.generatedAt}`;
        }
        if (!data.items || data.items.length === 0) {
          feedContainer.innerHTML = '<p>No change records yet. Once the pipeline is enabled, events will appear here.</p>';
        } else {
          data.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card fade-up';
            card.innerHTML = `
              <h3>${item.service}: ${item.action}</h3>
              <p><strong>Risk:</strong> ${item.risk.toUpperCase()}</p>
              <p>${item.summary}</p>
              <p><small>Time: ${item.time} | Actor: ${item.actor}${item.region ? ' | Region: ' + item.region : ''}</small></p>
              ${item.link ? `<p><a href="${item.link}" target="_blank">View Evidence</a></p>` : ''}
            `;
            feedContainer.appendChild(card);
          });
        }

        // Re-observe new cards for animation
        const newFaders = feedContainer.querySelectorAll('.fade-up');
        newFaders.forEach(el => observer.observe(el));
      })
      .catch(() => {
        feedContainer.innerHTML = '<p>Failed to load change feed.</p>';
      });
  }
});