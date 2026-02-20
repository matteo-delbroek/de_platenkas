// ── Zoekfunctie ─────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.lp-card');
        let visible = 0;

        cards.forEach(card => {
            const titel   = card.dataset.titel   || card.innerText.toLowerCase();
            const artiest = card.dataset.artiest  || '';
            const match   = titel.includes(term) || artiest.includes(term);
            card.style.display = match ? '' : 'none';
            if (match) visible++;
        });

        // Toon lege staat als niets matcht
        let empty = document.getElementById('searchEmpty');
        if (visible === 0 && term !== '') {
            if (!empty) {
                empty = document.createElement('div');
                empty.id = 'searchEmpty';
                empty.className = 'empty-state';
                empty.style.gridColumn = '1 / -1';
                empty.innerHTML = `
                    <i class="fa-solid fa-magnifying-glass" style="animation:none; font-size:2.5rem;"></i>
                    <h3>Niets gevonden</h3>
                    <p>Geen platen voor "<strong>${term}</strong>"</p>
                `;
                document.getElementById('lpContainer').appendChild(empty);
            }
        } else if (empty) {
            empty.remove();
        }
    });
}

// ── Dobbelsteen / Random pick ────────────────────────────────
const randomBtn = document.getElementById('randomBtn');
const toast     = document.getElementById('vinylToast');

if (randomBtn && toast) {
    randomBtn.addEventListener('click', () => {
        const cards = [...document.querySelectorAll('.lp-card')]
            .filter(c => c.style.display !== 'none');

        if (cards.length === 0) {
            showToast('Voeg eerst platen toe!', '');
            return;
        }

        // Kleine animatie op het icoon
        const icon = randomBtn.querySelector('i');
        icon.style.transition = 'transform 0.35s';
        icon.style.transform  = 'rotate(360deg) scale(1.2)';
        setTimeout(() => { icon.style.transform = ''; }, 350);

        const pick    = cards[Math.floor(Math.random() * cards.length)];
        const titel   = pick.querySelector('h3')?.innerText || '—';
        const artiest = pick.querySelector('p')?.innerText  || '—';

        showToast(titel, artiest);
    });
}

function showToast(titel, artiest) {
    document.getElementById('toastTitle').textContent  = titel;
    document.getElementById('toastArtist').textContent = artiest;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Staggered card animations ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lp-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.05}s`;
    });
});