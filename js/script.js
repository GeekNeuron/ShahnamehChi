document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;
    const contentDisplay = document.getElementById('content-display');
    const searchInput = document.getElementById('search-input');
    const showNazmBtn = document.getElementById('show-nazm');
    const showNasrBtn = document.getElementById('show-nasr');
    const audioNazm = document.getElementById('audio-nazm');
    const audioNasr = document.getElementById('audio-nasr');

    let nazmData = [];
    let nasrData = [];
    let currentView = 'nazm'; // 'nazm' or 'nasr'

    // 1. Theme Switcher
    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
    });

    // 2. Fetch Data
    async function loadData() {
        try {
            const nazmRes = await fetch('data/nazm.json');
            nazmData = await nazmRes.json();
            const nasrRes = await fetch('data/nasr.json');
            nasrData = await nasrRes.json();
            
            renderContent(nazmData); // Initial render
        } catch (error) {
            console.error('Error loading data:', error);
            contentDisplay.innerHTML = '<p>متاسفانه در بارگذاری اطلاعات خطایی رخ داد.</p>';
        }
    }

    // 3. Render Content
    function renderContent(data) {
        contentDisplay.innerHTML = '';
        if (data.length === 0) {
            contentDisplay.innerHTML = '<p>موردی یافت نشد.</p>';
            return;
        }
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'content-item';
            div.innerHTML = `<p>${item.text}</p>`;
            contentDisplay.appendChild(div);
        });
    }

    // 4. Search Functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const dataToSearch = currentView === 'nazm' ? nazmData : nasrData;
        
        const filteredData = dataToSearch.filter(item => 
            item.text.toLowerCase().includes(searchTerm)
        );
        
        renderContent(filteredData);
    });

    // 5. View Switcher (Nazm/Nasr)
    showNazmBtn.addEventListener('click', () => {
        if (currentView === 'nazm') return;
        currentView = 'nazm';
        updateView();
    });

    showNasrBtn.addEventListener('click', () => {
        if (currentView === 'nasr') return;
        currentView = 'nasr';
        updateView();
    });
    
    function updateView() {
        searchInput.value = ''; // Clear search on view switch
        if (currentView === 'nazm') {
            renderContent(nazmData);
            showNazmBtn.classList.add('active');
            showNasrBtn.classList.remove('active');
            audioNazm.style.display = 'block';
            audioNasr.style.display = 'none';
        } else {
            renderContent(nasrData);
            showNasrBtn.classList.add('active');
            showNazmBtn.classList.remove('active');
            audioNazm.style.display = 'none';
            audioNasr.style.display = 'block';
        }
    }

    // Initial Load
    loadData();
});
