const ADMIN_PASSCODE = "parliament2026";

document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const statutes = getStatutes();

    if (page === 'index.html' || page === '') {
        const featuredContainer = document.getElementById('featuredStatutesList');
        if (featuredContainer) {
            featuredContainer.innerHTML = statutes.slice(0, 3).map(law => renderLawCard(law)).join('');
        }
    }

    if (page === 'search.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('q');
        if (queryParam) {
            const searchInput = document.getElementById('pageSearchInput');
            if (searchInput) searchInput.value = queryParam;
        }
        performSearch();
    }

    if (page === 'primary.html') {
        const primaryContainer = document.getElementById('primaryActsList');
        const primaryLaws = statutes.filter(s => s.category === 'Primary');
        primaryContainer.innerHTML = primaryLaws.map(law => renderLawCard(law)).join('');
    }

    if (page === 'secondary.html') {
        const secondaryContainer = document.getElementById('secondaryActsList');
        const secondaryLaws = statutes.filter(s => s.category === 'Secondary');
        secondaryContainer.innerHTML = secondaryLaws.map(law => renderLawCard(law)).join('');
    }

    if (page === 'act-viewer.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id') || statutes[0].id;
        const law = statutes.find(s => s.id === id) || statutes[0];

        document.getElementById('actFullTitle').innerText = law.title;
        document.getElementById('actNumberCode').innerText = law.code;
        document.getElementById('actEnactmentDate').innerText = law.year;
        document.getElementById('actMetaDescription').innerText = `${law.category} Legislation • Enacted ${law.year}`;
        document.getElementById('actFullTextContent').innerText = `${law.section}\n\n${law.content}`;

        document.getElementById('actTocList').innerHTML = `
            <li><a href="#">Arrangement of Act</a></li>
            <li><a href="#"><strong>${law.section}</strong></a></li>
            <li><a href="#">Schedules & Extent</a></li>
        `;
    }

    if (page === 'admin.html') {
        checkAdminAuthStatus();

        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const role = document.getElementById('adminUser').value;
                const pass = document.getElementById('adminPass').value;

                if (pass === ADMIN_PASSCODE) {
                    sessionStorage.setItem('legislation_admin_role', role);
                    checkAdminAuthStatus();
                } else {
                    alert('Invalid security passcode.');
                }
            });
        }
    }

    const adminForm = document.getElementById('adminEnactForm');
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentRole = sessionStorage.getItem('legislation_admin_role') || 'Authorized Officer';
            
            const newLaw = {
                id: 'act-' + Date.now(),
                code: document.getElementById('actCode').value.trim(),
                title: document.getElementById('actTitle').value.trim(),
                category: document.getElementById('actCategory').value,
                section: document.getElementById('sectionTitle').value.trim(),
                content: document.getElementById('actContent').value.trim() + `\n\n[Enacted by: ${currentRole}]`,
                year: parseInt(document.getElementById('enactmentYear').value)
            };

            const updated = getStatutes();
            updated.unshift(newLaw);
            saveStatutes(updated);
            alert(`Statutory provision successfully enacted by ${currentRole}!`);
            window.location.href = 'search.html';
        });
    }
});

function checkAdminAuthStatus() {
    const activeRole = sessionStorage.getItem('legislation_admin_role');
    const loginSection = document.getElementById('loginSection');
    const enactSection = document.getElementById('enactSection');
    const roleTitleDisplay = document.getElementById('activeRoleTitle');

    if (activeRole) {
        if (loginSection) loginSection.style.display = 'none';
        if (enactSection) enactSection.style.display = 'block';
        if (roleTitleDisplay) roleTitleDisplay.innerText = activeRole;
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (enactSection) enactSection.style.display = 'none';
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('legislation_admin_role');
    checkAdminAuthStatus();
}

function renderLawCard(law) {
    return `
        <article class="law-card">
            <h3><a href="act-viewer.html?id=${law.id}">${law.title}</a></h3>
            <div class="meta-bar">${law.code} • ${law.category} • Enacted ${law.year}</div>
            <div class="section-header">${law.section}</div>
            <p>${law.content.substring(0, 150)}...</p>
            <a href="act-viewer.html?id=${law.id}" class="govuk-link">View Full Statute →</a>
        </article>
    `;
}

function performSearch() {
    const statutes = getStatutes();
    const type = document.getElementById('filterType')?.value || 'all';
    const query = document.getElementById('pageSearchInput')?.value.toLowerCase().trim() || '';
    
    const results = statutes.filter(law => {
        const matchesType = type === 'all' || law.category === type;
        const matchesQuery = law.title.toLowerCase().includes(query) ||
                             law.code.toLowerCase().includes(query) ||
                             law.section.toLowerCase().includes(query) ||
                             law.content.toLowerCase().includes(query);
        return matchesType && matchesQuery;
    });

    const resultsContainer = document.getElementById('searchResultsList');
    const summaryText = document.getElementById('searchSummaryText');

    if (summaryText) summaryText.innerText = `Showing ${results.length} result(s) in database.`;
    if (resultsContainer) {
        resultsContainer.innerHTML = results.length > 0 
            ? results.map(law => renderLawCard(law)).join('')
            : '<p>No matching statutes found.</p>';
    }
}

function exportDatabaseJSON() {
    const jsonBlob = new Blob([JSON.stringify(getStatutes(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'uk_legislation_register.json';
    link.click();
    URL.revokeObjectURL(url);
}

function resetRegisterDefaults() {
    if (confirm("Reset register back to default statutes?")) {
        localStorage.removeItem('legislation_replica_db');
        window.location.reload();
    }
}
