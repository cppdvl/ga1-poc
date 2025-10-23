document.addEventListener('DOMContentLoaded', () => {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    if (window.GestaltLocalization && typeof window.GestaltLocalization.initLocalization === 'function') {
        window.GestaltLocalization.initLocalization();
    }

    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        ['dragenter', 'dragover'].forEach((eventName) => {
            dropzone.addEventListener(eventName, (event) => {
                event.preventDefault();
                dropzone.classList.add('border-teal-500', 'bg-teal-50');
            });
        });

        ['dragleave', 'drop'].forEach((eventName) => {
            dropzone.addEventListener(eventName, (event) => {
                event.preventDefault();
                dropzone.classList.remove('border-teal-500', 'bg-teal-50');
            });
        });
    }

    document.querySelectorAll('[data-nav-target]').forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-nav-target');
            if (!targetId) {
                return;
            }

            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const sidebar = document.getElementById('workspace-sidebar');
    const sidebarBackdrop = document.getElementById('workspace-sidebar-backdrop');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    let sidebarOpen = false;

    const openSidebar = () => {
        if (!sidebar) {
            return;
        }

        sidebar.classList.remove('-translate-x-full');

        if (sidebarBackdrop) {
            sidebarBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        }

        sidebarOpen = true;
    };

    const closeSidebar = () => {
        if (!sidebar) {
            return;
        }

        sidebar.classList.add('-translate-x-full');

        if (sidebarBackdrop) {
            sidebarBackdrop.classList.add('opacity-0', 'pointer-events-none');
        }

        sidebarOpen = false;
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (sidebarOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebarOpen) {
            closeSidebar();
        }
    });

    document.querySelectorAll('#workspace-sidebar [data-nav-target]').forEach((button) => {
        button.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeSidebar();
            }
        });
    });
});
