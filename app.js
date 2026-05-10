// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================

let currentLang = localStorage.getItem('language') || 'ru';
let currentSlide = 0;
let totalSlides = 0;

// ==================== ФУНКЦИИ ДЛЯ ПОЛУЧЕНИЯ ПЕРЕВОДОВ ====================

function getServiceTitle(id) {
    const langMap = { ru: 'title_ru', en: 'title_en', kk: 'title_kk' };
    return servicesData[id]?.[langMap[currentLang]] || servicesData[id]?.title_ru;
}

function getServiceSubtitle(id) {
    const langMap = { ru: 'subtitle_ru', en: 'subtitle_en', kk: 'subtitle_kk' };
    return servicesData[id]?.[langMap[currentLang]] || servicesData[id]?.subtitle_ru;
}

function getServiceDesc(id) {
    const langMap = { ru: 'desc_ru', en: 'desc_en', kk: 'desc_kk' };
    return servicesData[id]?.[langMap[currentLang]] || servicesData[id]?.desc_ru;
}

function getServiceHow(id) {
    const langMap = { ru: 'how_ru', en: 'how_en', kk: 'how_kk' };
    return servicesData[id]?.[langMap[currentLang]] || servicesData[id]?.how_ru;
}

function getServiceIndications(id) {
    const langMap = { ru: 'indications_ru', en: 'indications_en', kk: 'indications_kk' };
    return servicesData[id]?.[langMap[currentLang]] || servicesData[id]?.indications_ru;
}

function getServiceContraindications(id) {
    const langMap = { ru: 'contraindications_ru', en: 'contraindications_en', kk: 'contraindications_kk' };
    return servicesData[id]?.[langMap[currentLang]] || servicesData[id]?.contraindications_ru;
}

function getServiceEffect(id) {
    const langMap = { ru: 'effect_ru', en: 'effect_en', kk: 'effect_kk' };
    return servicesData[id]?.[langMap[currentLang]] || servicesData[id]?.effect_ru;
}

function getModalLabels() {
    const labels = {
        ru: { indications: 'Показания:', contraindications: 'Противопоказания:', effect: 'Эффект:', how: 'Как проходит:' },
        en: { indications: 'Indications:', contraindications: 'Contraindications:', effect: 'Effect:', how: 'Procedure:' },
        kk: { indications: 'Көрсеткіштер:', contraindications: 'Қарсы көрсеткіштер:', effect: 'Әсері:', how: 'Өтуі:' }
    };
    return labels[currentLang] || labels.ru;
}

// ==================== ФУНКЦИИ ДЛЯ ОБНОВЛЕНИЯ КОНТЕНТА ====================

function renderServicesGrid() {
    try {
        const grid = document.getElementById('services-grid');
        if (!grid) return;
        
        let html = '';
        for (let i = 1; i <= 13; i++) {
            html += `
                <div class="bg-white/10 backdrop-blur rounded-xl p-4 cursor-pointer hover:bg-white/20 transition service-card" onclick="openModal(${i})" role="button" tabindex="0" aria-label="${getServiceTitle(i)}">
                    <img src="${servicesData[i].image}" alt="${getServiceTitle(i)}" class="w-full h-32 md:h-40 object-cover rounded-lg mb-3" loading="lazy">
                    <h3 class="text-lg font-bold text-white mb-1 text-center">${getServiceTitle(i)}</h3>
                    <p class="text-white/70 text-sm text-center">${getServiceSubtitle(i)}</p>
                </div>
            `;
        }
        grid.innerHTML = html;
    } catch (error) {
        console.error('Error rendering services grid:', error);
    }
}

function updateUILabels() {
    try {
        const t = translations[currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.innerHTML.includes('<strong>') && (key === 'about_text1' || key === 'about_katon_text1' || key === 'about_katon_text2' || key === 'about_katon_text3')) {
                    el.innerHTML = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
        
        const labels = getModalLabels();
        const indicationsLabel = document.getElementById('modal-indications-label');
        const contraindicationsLabel = document.getElementById('modal-contraindications-label');
        const effectLabel = document.getElementById('modal-effect-label');
        if (indicationsLabel) indicationsLabel.textContent = labels.indications;
        if (contraindicationsLabel) contraindicationsLabel.textContent = labels.contraindications;
        if (effectLabel) effectLabel.textContent = labels.effect;
        
        const flagMap = { ru: '🇷🇺', en: '🇬🇧', kk: '🇰🇿' };
        const codeMap = { ru: 'RU', en: 'EN', kk: 'KZ' };
        const currentFlag = document.getElementById('current-lang-flag');
        const currentCode = document.getElementById('current-lang-code');
        if (currentFlag) currentFlag.textContent = flagMap[currentLang];
        if (currentCode) currentCode.textContent = codeMap[currentLang];
    } catch (error) {
        console.error('Error updating UI labels:', error);
    }
}

function applyTranslations() {
    try {
        updateUILabels();
        renderServicesGrid();
        localStorage.setItem('language', currentLang);
        document.documentElement.lang = currentLang;
        
        document.querySelectorAll('.lang-option').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error applying translations:', error);
    }
}

// ==================== ФУНКЦИИ ДЛЯ МОДАЛЬНОГО ОКНА ====================

function openModal(id) {
    try {
        const data = servicesData[id];
        if (!data) return;
        
        document.getElementById('modal-title').textContent = getServiceTitle(id);
        const modalImg = document.getElementById('modal-img');
        modalImg.src = data.image;
        modalImg.alt = getServiceTitle(id);
        document.getElementById('modal-desc').textContent = getServiceDesc(id);
        
        const labels = getModalLabels();
        const howText = getServiceHow(id);
        document.getElementById('modal-how').innerHTML = `<span class="label">${labels.how}</span> ${howText}`;
        
        document.getElementById('modal-indications').textContent = getServiceIndications(id);
        document.getElementById('modal-contraindications').textContent = getServiceContraindications(id);
        document.getElementById('modal-effect').textContent = getServiceEffect(id);
        
        document.getElementById('service-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

function closeModal() {
    try {
        document.getElementById('service-modal').classList.remove('active');
        document.body.style.overflow = '';
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

// ==================== ФУНКЦИИ ДЛЯ ЯЗЫКОВОГО ДРОПДАУНА ====================

function toggleLanguageDropdown(event) {
    try {
        event.stopPropagation();
        const dropdown = document.getElementById('lang-dropdown');
        dropdown.classList.toggle('show');
    } catch (error) {
        console.error('Error toggling language dropdown:', error);
    }
}

function switchLanguage(lang) {
    try {
        if (!translations[lang]) return;
        currentLang = lang;
        applyTranslations();
        
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.remove('show');
    } catch (error) {
        console.error('Error switching language:', error);
    }
}

// ==================== ФУНКЦИИ ДЛЯ ГАЛЕРЕИ ====================

function initGallery() {
    try {
        const slides = document.querySelectorAll('#gallery-slider > div');
        totalSlides = slides.length;
        const dotsContainer = document.getElementById('gallery-dots');
        
        if (dotsContainer && totalSlides > 0) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'w-3 h-3 rounded-full bg-sage/30 hover:bg-sage/50 transition';
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.onclick = () => goToSlide(i);
                dotsContainer.appendChild(dot);
            }
            updateDots();
            setInterval(nextSlide, 5000);
        }
    } catch (error) {
        console.error('Error initializing gallery:', error);
    }
}

function updateDots() {
    try {
        const dots = document.querySelectorAll('#gallery-dots button');
        dots.forEach((dot, index) => {
            dot.className = index === currentSlide 
                ? 'w-3 h-3 rounded-full bg-sage transition' 
                : 'w-3 h-3 rounded-full bg-sage/30 hover:bg-sage/50 transition';
        });
    } catch (error) {
        console.error('Error updating dots:', error);
    }
}

function goToSlide(index) {
    try {
        const slides = document.querySelectorAll('#gallery-slider > div');
        totalSlides = slides.length;
        currentSlide = index;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        const slider = document.getElementById('gallery-slider');
        if (slider) slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    } catch (error) {
        console.error('Error going to slide:', error);
    }
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

// ==================== ФУНКЦИИ ДЛЯ МОБИЛЬНОГО МЕНЮ ====================

function toggleMobileMenu() {
    try {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
    } catch (error) {
        console.error('Error toggling mobile menu:', error);
    }
}

function closeMobileMenu() {
    try {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.add('hidden');
    } catch (error) {
        console.error('Error closing mobile menu:', error);
    }
}

// ==================== NAVIGATION SMOOTH SCROLL ====================

document.addEventListener('DOMContentLoaded', function() {
    try {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
        
        applyTranslations();
        initGallery();
        
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('lang-dropdown');
            const btn = document.querySelector('.lang-btn-main');
            if (dropdown && btn && !btn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    } catch (error) {
        console.error('Error during DOMContentLoaded:', error);
    }
});

// ==================== ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА ПО ESC ====================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

const modal = document.getElementById('service-modal');
if (modal) {
    modal.addEventListener('click', function(e) {
        if (!e.target.closest('.modal-content')) closeModal();
    });
}

console.log('Сайт Qaton Qaragai Resort & SPA загружен');