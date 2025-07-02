document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let currentState = {
        view: 'main', // main, sub, content
        choice: null, // nazm, nasr
        format: null, // text, audio
    };
    let nazmData = [], nasrData = [];

    // Element Selectors
    const body = document.body;
    const header = document.getElementById('header');
    const backButton = document.getElementById('back-button');
    const themeSwitcher = document.getElementById('theme-switcher');

    const mainMenu = document.getElementById('main-menu');
    const subMenu = document.getElementById('sub-menu');
    const contentSection = document.getElementById('content-section');

    const subMenuTitle = document.getElementById('sub-menu-title');
    const searchInput = document.getElementById('search-input');
    const contentDisplay = document.getElementById('content-display');
    const audioPlayerContainer = document.getElementById('audio-player-container');
    const audioPlayer = document.getElementById('audio-player');
    const audioElement = document.getElementById('audio-element');
    const audioTitle = document.getElementById('audio-title');

    // --- DATA LOADING ---
    async function loadData() {
        try {
            const [nazmRes, nasrRes] = await Promise.all([
                fetch('data/nazm.json'),
                fetch('data/nasr.json')
            ]);
            nazmData = await nazmRes.json();
            nasrData = await nasrRes.json();
        } catch (error) {
            console.error('Error loading data:', error);
            contentDisplay.innerHTML = '<p>متاسفانه در بارگذاری اطلاعات خطایی رخ داد.</p>';
        }
    }

    // --- UI RENDERING ---
    function switchView(viewName) {
        mainMenu.classList.replace('visible', 'hidden');
        subMenu.classList.replace('visible', 'hidden');
        contentSection.classList.replace('visible', 'hidden');

        document.getElementById(viewName).classList.replace('hidden', 'visible');
        
        // Toggle back button visibility
        if (viewName === 'main-menu') {
            backButton.classList.add('hidden');
        } else {
            backButton.classList.remove('hidden');
        }
    }

    // --- EVENT LISTENERS ---
    
    // 1. Theme Switcher
    header.addEventListener('click', (e) => {
        if(e.target.id === 'theme-switcher' || e.target.id === 'header-title') {
            body.classList.toggle('dark-theme');
            body.classList.toggle('light-theme');
        }
    });

    // 2. Main Menu Logic
    mainMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-option')) {
            const choice = e.target.dataset.choice;
            if (choice === 'settings') {
                alert('بخش تنظیمات در حال ساخت است.');
                return;
            }
            currentState.choice = choice;
            subMenuTitle.textContent = e.target.textContent; // "به نظم" or "به نثر"
            currentState.view = 'sub';
            switchView('sub-menu');
        }
    });

    // 3. Sub-Menu Logic
    subMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-option')) {
            currentState.format = e.target.dataset.format;
            currentState.view = 'content';
            renderContent();
            switchView('content-section');
        }
    });

    // 4. Back Button
    backButton.addEventListener('click', () => {
        if (currentState.view === 'content') {
            currentState.format = null;
            currentState.view = 'sub';
            // Hide keyboard on mobile if it's open
            searchInput.blur();
            switchView('sub-menu');
        } else if (currentState.view === 'sub') {
            currentState.choice = null;
            currentState.view = 'main';
            switchView('main-menu');
        }
    });
    
    // 5. Search Input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const dataToSearch = currentState.choice === 'nazm' ? nazmData : nasrData;
        const filteredData = dataToSearch.filter(item => 
            item.text.toLowerCase().includes(searchTerm)
        );
        displayText(filteredData);
    });

    // --- CONTENT RENDERING LOGIC ---
    function renderContent() {
        // Reset search
        searchInput.value = '';

        if (currentState.format === 'text') {
            audioPlayerContainer.classList.add('hidden');
            contentDisplay.classList.remove('hidden');
            searchInput.classList.remove('hidden');
            const data = currentState.choice === 'nazm' ? nazmData : nasrData;
            displayText(data);
        } else if (currentState.format === 'audio') {
            contentDisplay.classList.add('hidden');
            searchInput.classList.add('hidden');
            audioPlayerContainer.classList.remove('hidden');
            displayAudio();
        }
    }

    function displayText(data) {
        contentDisplay.innerHTML = '';
        if (data.length === 0) {
            contentDisplay.innerHTML = '<p>موردی یافت نشد.</p>';
            return;
        }
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'content-item';
            div.innerHTML = `<p>${item.text.replace(/<br>/g, '\n')}</p>`; // Use newline for better copy-paste
            contentDisplay.appendChild(div);
        });
    }

    function displayAudio() {
        const choice = currentState.choice;
        audioTitle.textContent = `پخش صوتی شاهنامه به ${choice === 'nazm' ? 'نظم' : 'نثر'}`;
        audioElement.src = `assets/audio/${choice}-sample.mp3`;
    }

    // --- INITIALIZATION ---
    loadData();
    switchView('main-menu'); // Start at main menu
});
