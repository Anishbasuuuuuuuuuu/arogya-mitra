// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Download app function
function downloadApp(platform) {
    // Show download modal or redirect to app stores
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl text-white">🎉</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h3>
            <p class="text-gray-600 mb-6">
                Arogya Mitra is launching soon! Enter your email to be notified when we're available on ${platform === 'ios' ? 'App Store' : platform === 'android' ? 'Google Play' : 'all platforms'}.
            </p>
            <div class="space-y-4">
                <input type="email" placeholder="Enter your email" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest">
                <button onclick="subscribeUser()" class="w-full bg-forest text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                    Notify Me
                </button>
                <button onclick="closeModal()" class="w-full text-gray-500 hover:text-gray-700 transition-colors">
                    Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function subscribeUser() {
    const email = document.querySelector('input[type="email"]').value;
    if (email && email.includes('@')) {
        alert('Thank you! We\'ll notify you when Arogya Mitra launches. 🎉');
        closeModal();
    } else {
        alert('Please enter a valid email address.');
    }
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-in');
        }
    });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('bg-white/95');
        nav.classList.add('shadow-sm');
    } else {
        nav.classList.remove('shadow-sm');
    }
})