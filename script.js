document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on reload
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Splash Screen Timer
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('hidden');
        }, 2000); // 2 seconds
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Modal Logic
    const modal = document.getElementById('offer-modal');
    const openBtns = document.querySelectorAll('.open-offer-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (modal && openBtns.length > 0) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Supabase Configuration
    const SUPABASE_URL = 'https://inwnhjwsszjayhhjawqc.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_xj-6R4kE20Ft2oEgLbuTog_n8j5Jq5t';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const offerForm = document.getElementById('offer-form');
    if (offerForm) {
        offerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = offerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Traitement en cours...';

            const formData = {
                nom: document.getElementById('last-name').value,
                prenom: document.getElementById('first-name').value,
                telephone: document.getElementById('phone').value
            };

            try {
                const { error } = await supabaseClient
                    .from('leads')
                    .insert([formData]);

                if (error) throw error;

                // Success: Send SILENT notification to Telegram Bot
                const botToken = '8632060731:AAE15F3eaydzsxg6Q_qll-fhnE_GIqA0jHE';
                const chatId = '5984764511';
                const telegramMessage = `🚀 Nouveau lead 7AYYA !\n👤 Nom: ${formData.nom}\n👤 Prénom: ${formData.prenom}\n📞 Téléphone: ${formData.telephone}`;
                const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(telegramMessage)}`;

                // Send the notification in the background (silent)
                await fetch(telegramUrl).catch(err => console.error('Telegram notification error:', err));

                // Success: Redirect to simulator in main tab
                window.location.href = 'https://www.star.com.tn/simulation-7ayya';

                // Clear fields
                offerForm.reset();
            } catch (err) {
                console.error('Supabase error:', err);
                alert('Une erreur est survenue, veuillez réessayer');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }



    // Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Parallax effect on Hero
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        }
    });

    // Smooth Click behavior for internal links (already handled by CSS scroll-behavior: smooth, but good for JS fallback)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
