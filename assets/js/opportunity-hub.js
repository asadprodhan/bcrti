(function(){
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));

  async function loadJSON(path){
    const r = await fetch(path);
    if(!r.ok) throw new Error(path);
    return r.json();
  }

  function computeCard(r){
    const cls = r.cost === 'Paid'
      ? 'paid'
      : (r.cost === 'Free' ? 'free' : 'subsidised');

    return `<article class="resource-card compact-resource-card">
      <div class="resource-top">
        <p class="resource-provider">${esc(r.provider)}</p>
        <span class="resource-badge ${cls}">${esc(r.cost)}</span>
      </div>
      <h3>${esc(r.name)}</h3>
      <p><strong>${esc(r.kind)}</strong> · ${esc(r.country)}</p>
      <p>${esc(r.best)}</p>
      <p class="resource-meta"><strong>Access:</strong> ${esc(r.access)}</p>
      <div class="resource-actions">
        <a class="resource-link" href="${esc(r.apply)}" target="_blank" rel="noopener noreferrer">Access / apply ↗</a>
        <a class="resource-link secondary" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Details</a>
      </div>
    </article>`;
  }

  function computeCategory(r){
    if(r.kind === 'Web platform') return 'Web platform';
    if(r.kind === 'HPC' || r.kind === 'HPC allocation') return 'HPC';
    if(r.kind === 'Research cloud' || r.kind === 'Commercial cloud') return 'Cloud';
    return r.kind;
  }

  loadJSON('data/compute_resources.json')
    .then(compute => {
      const grid = document.querySelector('#compute-grid');
      const select = document.querySelector('#compute-kind');
      const button = document.querySelector('#compute-search-button');
      const clearButton = document.querySelector('#compute-clear-button');

      if(!grid) return;

      function render(){
        const kind = select?.value || 'all';

        const filtered = compute.filter(
          r => kind === 'all' || computeCategory(r) === kind
        );

        grid.innerHTML = filtered.length
          ? filtered.map(computeCard).join('')
          : '<div class="empty-state">No matching compute resources.</div>';
      }

      if(button){
        button.addEventListener('click', render);
      }

      if(clearButton){
        clearButton.addEventListener('click', () => {
          if(select) select.value = 'all';
          grid.innerHTML = '';
        });
      }

      grid.innerHTML = '';
    })
    .catch(() => {
      const grid = document.querySelector('#compute-grid');

      if(grid){
        grid.innerHTML =
          '<div class="empty-state">Listings could not be loaded. Please refresh the page.</div>';
      }
    });
})();
