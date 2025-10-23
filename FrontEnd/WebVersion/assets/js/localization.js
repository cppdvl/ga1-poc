(function (window) {
    const LANGUAGE_STORAGE_KEY = 'gestalt-language';
    let translationsDictionary = null;
    let translationsLoadPromise = null;

    const getStoredLanguage = () => {
        try {
            return localStorage.getItem(LANGUAGE_STORAGE_KEY);
        } catch (error) {
            console.error('Localization storage read error:', error);
            return null;
        }
    };

    const persistLanguage = (language) => {
        try {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch (error) {
            console.error('Localization storage write error:', error);
        }
    };

    const applyTranslations = (dictionary, language) => {
        const entries = dictionary[language] ?? {};

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const value = entries[key];
            if (typeof value === 'string') {
                element.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const key = element.getAttribute('data-i18n-placeholder');
            const value = entries[key];
            if (typeof value === 'string') {
                element.setAttribute('placeholder', value);
            }
        });

        document.querySelectorAll('[data-i18n-html]').forEach((element) => {
            const key = element.getAttribute('data-i18n-html');
            const value = entries[key];
            if (typeof value === 'string') {
                element.innerHTML = value;
            }
        });
    };

    const toggleActiveClasses = (buttons, language, activeClass) => {
        buttons.forEach((button) => {
            const isActive = button.getAttribute('data-lang') === language;
            button.classList.toggle(activeClass, isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const loadTranslations = () => {
        if (translationsLoadPromise) {
            return translationsLoadPromise;
        }

        translationsLoadPromise = fetch('locales.json', { cache: 'no-cache' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load locales: ${response.status}`);
                }

                return response.json();
            })
            .then((dictionary) => {
                translationsDictionary = dictionary;
                return translationsDictionary;
            })
            .catch((error) => {
                translationsLoadPromise = null;
                console.error('Localization error:', error);

                if (window.location.protocol === 'file:') {
                    console.warn('Serve the app over http:// or https:// so locales.json can be fetched.');
                }

                throw error;
            });

        return translationsLoadPromise;
    };

    const initLocalization = ({
        buttonSelector = '.language-button',
        activeClass = 'language-button-active',
        defaultLanguage = 'en'
    } = {}) => {
        const languageButtons = Array.from(document.querySelectorAll(buttonSelector));
        const storedLanguage = getStoredLanguage();
        let activeLanguage = storedLanguage || defaultLanguage;

        const setActiveLanguage = (language, { persist = true } = {}) => {
            if (!language) {
                return;
            }

            activeLanguage = language;

            if (persist) {
                persistLanguage(activeLanguage);
            }

            if (translationsDictionary && translationsDictionary[activeLanguage]) {
                applyTranslations(translationsDictionary, activeLanguage);
            } else if (translationsDictionary && !translationsDictionary[activeLanguage]) {
                activeLanguage = defaultLanguage;
                applyTranslations(translationsDictionary, activeLanguage);
            }

            toggleActiveClasses(languageButtons, activeLanguage, activeClass);
        };

        languageButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const nextLanguage = button.getAttribute('data-lang');
                if (nextLanguage && nextLanguage !== activeLanguage) {
                    setActiveLanguage(nextLanguage);
                }
            });
        });

        loadTranslations()
            .then(() => {
                if (!translationsDictionary[activeLanguage]) {
                    activeLanguage = defaultLanguage;
                }

                applyTranslations(translationsDictionary, activeLanguage);
                toggleActiveClasses(languageButtons, activeLanguage, activeClass);
            })
            .catch(() => {
                toggleActiveClasses(languageButtons, activeLanguage, activeClass);
            });

        return {
            setLanguage: setActiveLanguage,
            getActiveLanguage: () => activeLanguage
        };
    };

    window.GestaltLocalization = {
        initLocalization
    };
})(window);
