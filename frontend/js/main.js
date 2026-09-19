/* ============================================================
   TAANA-BAANA
   Global JavaScript
   Frontend-only version

   "From Hands to Markets."

   Handles:
   - Intro animation
   - Custom cursor
   - Cursor trail
   - Navbar
   - Mobile navigation
   - Dropdowns
   - Scroll reveal
   - Parallax
   - 3D tilt cards
   - Magnetic buttons
   - Smooth scrolling
   - Back-to-top
   - Page transitions
   - Image reveal
   - Craft interaction
   - Toast notifications
   - Modal system
   - Mouse parallax
   - Counter animation
   - Active navigation
   - Lazy images
   - Image fallback
   - Accessibility
   ============================================================ */

window.TaanaBaana = window.TaanaBaana || {};

const TAANA_SUPABASE_CONFIG = {
    url: "https://noyrfotqdzwnalbnmbcu.supabase.co",
    anonKey: "sb_publishable_owxWgT3liD0TTwl7Z3TkwQ_7-bV1dJz"
};

function loadSupabaseSdk() {
    if (window.supabase) {
        return Promise.resolve(window.supabase);
    }

    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector("script[data-taana-supabase]");
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(window.supabase), { once: true });
            existingScript.addEventListener("error", () => reject(new Error("Supabase SDK failed to load.")), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async = true;
        script.setAttribute("data-taana-supabase", "true");
        script.onload = () => resolve(window.supabase);
        script.onerror = () => reject(new Error("Supabase SDK failed to load."));
        document.head.appendChild(script);
    });
}

async function initSupabaseConnection() {
    try {
        const supabaseSdk = await loadSupabaseSdk();
        if (!supabaseSdk || !supabaseSdk.createClient) {
            console.warn("Supabase SDK is not available in this browser session.");
            return;
        }

        const supabaseClient = supabaseSdk.createClient(TAANA_SUPABASE_CONFIG.url, TAANA_SUPABASE_CONFIG.anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });

        window.TaanaBaana.supabase = supabaseClient;
        window.TaanaBaana.supabaseReady = true;
        window.TaanaBaana.supabaseConfig = TAANA_SUPABASE_CONFIG;

        const { data: { session }, error } = await supabaseClient.auth.getSession();

        if (error) {
            console.warn("Supabase session warning:", error.message);
        }

        if (session) {
            window.TaanaBaana.authSession = session;
        }
    } catch (error) {
        console.warn("Supabase connection unavailable:", error.message || error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    /* ========================================================
       INITIAL SETUP
       ======================================================== */

    initSupabaseConnection();
    initIntro();
    initCustomCursor();
    initNavbar();
    initMobileMenu();
    initDropdowns();
    initScrollReveal();
    initParallax();
    initTiltCards();
    initSmoothScrolling();
    initBackToTop();
    initPageTransitions();
    initMagneticButtons();
    initImageReveal();
    initCraftPoints();
    initGlobalButtons();
    initMouseParallax();
    initCounters();
    setActiveNavLink();
    initLazyImages();
    initImageFallback();
    initKeyboardAccessibility();
    initAuthFlow();

    console.log(
        "%cTAANA-BAANA 🧵",
        "font-size:24px;font-weight:bold;color:#c96f4a;"
    );

    console.log(
        "%cFrom Hands to Markets.",
        "font-size:14px;color:#3b2922;"
    );

    console.log(
        "%cFrontend system initialized successfully.",
        "color:#879b76;"
    );
});

function initAuthFlow() {
    const AUTH_KEY = "taanaBaanaUser";
    const DEMO_USERS = [
        {
            name: "Meera Devi",
            email: "demo@taanabaana.in",
            password: "password",
            role: "artisan"
        },
        {
            name: "Aarav Kumar",
            email: "buyer@taanabaana.in",
            password: "password",
            role: "buyer"
        },
        {
            name: "Priya Nair",
            email: "admin@taanabaana.in",
            password: "password",
            role: "admin"
        }
    ];

    function getCurrentUser() {
        try {
            const raw = localStorage.getItem(AUTH_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function setCurrentUser(user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }

    function logoutUser() {
        localStorage.removeItem(AUTH_KEY);

        const inPagesFolder = window.location.pathname.includes("/pages/") || window.location.pathname.endsWith("/pages/");
        const target = inPagesFolder ? "login.html" : "./pages/login.html";

        window.location.href = target;
    }

    function getRoleDashboard(role) {
        const dashboardMap = {
            artisan: "artisan-dashboard.html",
            buyer: "buyer-dashboard.html",
            admin: "admin-dashboard.html"
        };

        return dashboardMap[role] || "login.html";
    }

    function normalizeRole(value) {
        const role = (value || "").toLowerCase();
        if (["artisan", "seller", "maker"].includes(role)) return "artisan";
        if (["buyer", "customer", "user"].includes(role)) return "buyer";
        if (["admin", "administrator"].includes(role)) return "admin";
        return "buyer";
    }

    function redirectByRole(role) {
        const target = getRoleDashboard(role);
        const currentPage = window.location.pathname.split("/").pop();

        if (currentPage === target) return;

        const pagePath = window.location.pathname.includes("/pages/")
            ? "./"
            : "./pages/";

        const href = pagePath + target;
        window.location.href = href;
    }

    function handleProtectedPage() {
        const currentPage = window.location.pathname.split("/").pop();
        const protectedPages = [
            "artisan-dashboard.html",
            "buyer-dashboard.html",
            "admin-dashboard.html"
        ];

        if (!protectedPages.includes(currentPage)) {
            return;
        }

        const user = getCurrentUser();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const userRole = normalizeRole(user.role);

        if (currentPage === "artisan-dashboard.html" && userRole !== "artisan") {
            redirectByRole(userRole);
            return;
        }

        if (currentPage === "buyer-dashboard.html" && userRole !== "buyer") {
            redirectByRole(userRole);
            return;
        }

        if (currentPage === "admin-dashboard.html" && userRole !== "admin") {
            redirectByRole(userRole);
            return;
        }
    }

    function attachLoginSubmit() {
        const loginButton = document.getElementById("loginButton");
        const roleCards = document.querySelectorAll(".role-card");
        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        const demoCredentialsByRole = {
            artisan: {
                email: "demo@taanabaana.in",
                password: "password"
            },
            buyer: {
                email: "buyer@taanabaana.in",
                password: "password"
            },
            admin: {
                email: "admin@taanabaana.in",
                password: "password"
            }
        };

        roleCards.forEach((card) => {
            card.addEventListener("click", () => {
                roleCards.forEach((item) => item.classList.remove("active"));
                card.classList.add("active");

                const selectedRole = normalizeRole(card.dataset.role || "artisan");
                const credentials = demoCredentialsByRole[selectedRole] || demoCredentialsByRole.artisan;

                if (emailInput) emailInput.value = credentials.email;
                if (passwordInput) passwordInput.value = credentials.password;
            });
        });

        if (!loginButton) {
            return;
        }

        loginButton.addEventListener("click", () => {
            const selectedRole = normalizeRole(document.querySelector(".role-card.active")?.dataset.role || "artisan");
            const email = (emailInput?.value || "").trim();
            const password = passwordInput?.value || "";

            if (!email) {
                window.TaanaBaana?.showToast("Please enter your email.");
                emailInput?.focus();
                return;
            }

            if (!password) {
                window.TaanaBaana?.showToast("Please enter your password.");
                passwordInput?.focus();
                return;
            }

            const matchedUser = DEMO_USERS.find((user) => {
                return user.email.toLowerCase() === email.toLowerCase() && user.password === password;
            });

            const finalRole = matchedUser ? matchedUser.role : selectedRole;

            if (!matchedUser && !email.includes("@")) {
                window.TaanaBaana?.showToast("Invalid login credentials.");
                return;
            }

            if (!matchedUser) {
                setCurrentUser({
                    name: email.split("@")[0].replace(/[._-]/g, " "),
                    email,
                    role: finalRole
                });
                window.TaanaBaana?.showToast("Welcome to Taana-Baana.");
                redirectByRole(finalRole);
                return;
            }

            setCurrentUser({
                name: matchedUser.name,
                email: matchedUser.email,
                role: finalRole
            });

            window.TaanaBaana?.showToast("Login successful.");
            redirectByRole(finalRole);
        });
    }

    async function handleSupabaseSignup(name, email, password, role) {
        const client = window.TaanaBaana?.supabase;
        if (!client || !client.auth || !client.auth.signUp) {
            return false;
        }

        try {
            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role
                    }
                }
            });

            if (error) {
                console.warn("Supabase signup failed:", error.message);
                return false;
            }

            const user = data?.user;
            if (!user) {
                return false;
            }

            setCurrentUser({
                name: name || user.email?.split("@")[0] || "Taana-Baana User",
                email: user.email,
                role
            });

            window.TaanaBaana?.showToast("Account created and synced with Supabase.");
            redirectByRole(role);
            return true;
        } catch (error) {
            console.warn("Supabase signup error:", error);
            return false;
        }
    }

    function attachRegisterSubmit() {
        const registerButton = document.getElementById("registerButton");
        if (!registerButton) return;

        registerButton.addEventListener("click", async () => {
            const role = document.getElementById("registerRole")?.value || "artisan";
            const name = document.getElementById("registerName")?.value?.trim() || "";
            const email = document.getElementById("registerEmail")?.value?.trim() || "";
            const password = document.getElementById("registerPassword")?.value || "";
            const confirmPassword = document.getElementById("registerConfirmPassword")?.value || "";

            if (!name || !email || !password) {
                window.TaanaBaana?.showToast("Please complete all required fields.");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                window.TaanaBaana?.showToast("Please enter a valid email address.");
                return;
            }

            if (password.length < 6) {
                window.TaanaBaana?.showToast("Password must be at least 6 characters.");
                return;
            }

            if (password !== confirmPassword && document.getElementById("registerConfirmPassword")) {
                window.TaanaBaana?.showToast("Passwords do not match.");
                return;
            }

            const normalizedRole = normalizeRole(role);

            if (window.TaanaBaana?.supabaseReady) {
                const supabaseSignedUp = await handleSupabaseSignup(name, email, password, normalizedRole);
                if (supabaseSignedUp) {
                    return;
                }
            }

            const user = {
                name,
                email,
                role: normalizedRole
            };

            setCurrentUser(user);
            window.TaanaBaana?.showToast("Account created successfully.");
            redirectByRole(user.role);
        });
    }

    function attachLogoutButtons() {
        document.querySelectorAll("[data-auth-logout], [data-logout]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                logoutUser();
            });
        });
    }

    function attachDashboardButtons() {
        document.querySelectorAll("[data-open-dashboard]").forEach((button) => {
            button.addEventListener("click", () => {
                const user = getCurrentUser();
                const target = user ? getRoleDashboard(normalizeRole(user.role)) : "login.html";
                const href = window.location.pathname.includes("/pages/") ? "./" + target : "./pages/" + target;
                window.location.href = href;
            });
        });

        document.querySelectorAll("[data-open-studio]").forEach((button) => {
            button.addEventListener("click", () => {
                const currentPath = window.location.pathname;
                const href = currentPath.includes("/pages/") ? "./studio.html" : "./pages/studio.html";
                window.location.href = href;
            });
        });

        document.querySelectorAll("[data-open-marketplace]").forEach((button) => {
            button.addEventListener("click", () => {
                const href = window.location.pathname.includes("/pages/") ? "./marketplace.html" : "./pages/marketplace.html";
                window.location.href = href;
            });
        });
    }

    if (window.location.pathname.endsWith("/login.html") || window.location.pathname.endsWith("login.html")) {
        attachLoginSubmit();
    }

    if (window.location.pathname.endsWith("/register.html") || window.location.pathname.endsWith("register.html")) {
        attachRegisterSubmit();
    }

    attachLogoutButtons();
    attachDashboardButtons();
    handleProtectedPage();

    if (window.TaanaBaana) {
        window.TaanaBaana.auth = {
            getCurrentUser,
            setCurrentUser,
            logout: logoutUser,
            isLoggedIn: () => Boolean(getCurrentUser()),
            redirectToRole: redirectByRole,
            getRoleDashboard
        };

        window.TaanaBaana.apiRequest = async function(path, options = {}) {
            const API_BASE_URL = window.TB_API_BASE_URL || "http://127.0.0.1:5000";
            const url = `${API_BASE_URL.replace(/\/$/, "")}${path}`;
            const response = await fetch(url, {
                headers: { "Content-Type": "application/json", ...(options.headers || {}) },
                ...options,
                body: options.body ? options.body : undefined
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "The AI service is currently unavailable.");
            }

            return response.json();
        };

        window.TaanaBaana.addToCart = function(productItem) {
            const cart = JSON.parse(localStorage.getItem("taanaBaanaCart") || "[]");
            cart.push(productItem);
            localStorage.setItem("taanaBaanaCart", JSON.stringify(cart));
            window.TaanaBaana.showToast(`${productItem.name || "Product"} added to your enquiry`);
        };
    }
}


/* ============================================================
   01. INTRO SCREEN
   ============================================================ */

function initIntro() {

    const intro = document.querySelector(".intro-screen");

    if (!intro) {
        return;
    }

    const enterButton =
        document.querySelector(".intro-enter");

    /*
       During development, the intro appears every time.

       When the website is ready, change:

       const SHOW_INTRO_ALWAYS = true;

       to:

       const SHOW_INTRO_ALWAYS = false;
    */

    const SHOW_INTRO_ALWAYS = true;

    const hasSeenIntro =
        localStorage.getItem("taanaBaanaIntroSeen");

    if (!SHOW_INTRO_ALWAYS && hasSeenIntro) {

        intro.classList.add("hide");

        document.body.classList.remove("no-scroll");

        return;
    }

    /*
       Prevent scrolling while intro is visible.
    */

    document.body.classList.add("no-scroll");


    function closeIntro() {

        intro.classList.add("hide");

        document.body.classList.remove("no-scroll");

        localStorage.setItem(
            "taanaBaanaIntroSeen",
            "true"
        );
    }


    /*
       Enter button.
    */

    if (enterButton) {

        enterButton.addEventListener(
            "click",
            closeIntro
        );
    }


    /*
       Optional skip button.

       Works if index.html contains:

       <button class="intro-skip">Skip</button>
    */

    const skipButton =
        document.querySelector(".intro-skip");

    if (skipButton) {

        skipButton.addEventListener(
            "click",
            closeIntro
        );
    }


    /*
       Automatically enter after 4.2 seconds.
    */

    setTimeout(() => {

        if (!intro.classList.contains("hide")) {
            closeIntro();
        }

    }, 4200);
}


/* ============================================================
   02. CUSTOM MOVING MOUSE POINTER
   ============================================================ */

function initCustomCursor() {

    /*
       Disable custom cursor on touch devices.
    */

    const isTouchDevice =
        window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
        return;
    }


    /*
       Prevent duplicate cursors.
    */

    if (
        document.querySelector(".cursor-dot") ||
        document.querySelector(".cursor-ring")
    ) {
        return;
    }


    /*
       Cursor dot.
    */

    const dot =
        document.createElement("div");

    dot.className = "cursor-dot";

    document.body.appendChild(dot);


    /*
       Cursor outer ring.
    */

    const ring =
        document.createElement("div");

    ring.className = "cursor-ring";

    document.body.appendChild(ring);


    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;


    /*
       Track mouse position.
    */

    document.addEventListener(
        "mousemove",
        (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            dot.style.transform =
                `translate3d(
                    ${mouseX}px,
                    ${mouseY}px,
                    0
                ) translate(-50%, -50%)`;
        }
    );


    /*
       Smooth outer ring.
    */

    function animateCursor() {

        ringX +=
            (mouseX - ringX) * 0.14;

        ringY +=
            (mouseY - ringY) * 0.14;

        ring.style.transform =
            `translate3d(
                ${ringX}px,
                ${ringY}px,
                0
            ) translate(-50%, -50%)`;

        requestAnimationFrame(
            animateCursor
        );
    }

    animateCursor();


    /*
       Cursor interaction.

       Event delegation is used so that
       dynamically created buttons also work.
    */

    document.addEventListener(
        "mouseover",
        (event) => {

            const interactive =
                event.target.closest(
                    "a, button, input, textarea, select, .product-card, .feature-card, .craft-point, [data-cursor]"
                );

            if (!interactive) {
                return;
            }

            ring.classList.add(
                "cursor-hover"
            );

            dot.classList.add(
                "cursor-hover"
            );
        }
    );


    document.addEventListener(
        "mouseout",
        (event) => {

            const interactive =
                event.target.closest(
                    "a, button, input, textarea, select, .product-card, .feature-card, .craft-point, [data-cursor]"
                );

            if (!interactive) {
                return;
            }

            ring.classList.remove(
                "cursor-hover"
            );

            dot.classList.remove(
                "cursor-hover"
            );
        }
    );


    document.addEventListener(
        "mousedown",
        () => {

            ring.classList.add(
                "cursor-click"
            );
        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            ring.classList.remove(
                "cursor-click"
            );
        }
    );


    /*
       Cursor particle trail.
    */

    let lastTrailTime = 0;

    document.addEventListener(
        "mousemove",
        (event) => {

            const now =
                performance.now();

            if (
                now - lastTrailTime < 45
            ) {
                return;
            }

            lastTrailTime = now;

            createCursorTrail(
                event.clientX,
                event.clientY
            );
        }
    );
}


/* ============================================================
   03. CURSOR TRAIL PARTICLE
   ============================================================ */

function createCursorTrail(x, y) {

    const trail =
        document.createElement("span");

    trail.className =
        "cursor-trail";


    const size =
        4 + Math.random() * 5;


    trail.style.width =
        `${size}px`;

    trail.style.height =
        `${size}px`;

    trail.style.left =
        `${x}px`;

    trail.style.top =
        `${y}px`;


    document.body.appendChild(trail);


    /*
       Remove after animation.
    */

    setTimeout(() => {

        trail.remove();

    }, 750);
}


/* ============================================================
   04. NAVBAR
   ============================================================ */

function initNavbar() {

    const navbar =
        document.querySelector(".site-nav");

    if (!navbar) {
        return;
    }


    let previousScroll =
        window.scrollY;


    function updateNavbar() {

        const currentScroll =
            window.scrollY;


        /*
           Add scrolled state.
        */

        if (currentScroll > 30) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );
        }


        /*
           Hide navbar while scrolling down.

           Show it while scrolling up.
        */

        if (
            currentScroll > 180 &&
            currentScroll > previousScroll + 5
        ) {

            navbar.style.transform =
                "translateY(-100%)";

        } else if (
            currentScroll <
            previousScroll - 5
        ) {

            navbar.style.transform =
                "translateY(0)";
        }


        previousScroll =
            currentScroll;
    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();
}


/* ============================================================
   05. MOBILE NAVIGATION
   ============================================================ */

function initMobileMenu() {

    const button =
        document.querySelector(
            ".mobile-menu-button"
        );

    const nav =
        document.querySelector(
            ".nav-links"
        );


    if (!button || !nav) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const isOpen =
                nav.classList.toggle(
                    "mobile-open"
                );


            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            const spans =
                button.querySelectorAll(
                    "span"
                );


            /*
               Hamburger → X animation.
            */

            if (spans.length >= 3) {

                if (isOpen) {

                    spans[0].style.transform =
                        "translateY(5.5px) rotate(45deg)";

                    spans[1].style.opacity =
                        "0";

                    spans[2].style.transform =
                        "translateY(-5.5px) rotate(-45deg)";

                } else {

                    spans[0].style.transform =
                        "";

                    spans[1].style.opacity =
                        "";

                    spans[2].style.transform =
                        "";
                }
            }
        }
    );


    /*
       Close menu after clicking a link.
    */

    nav.querySelectorAll("a").forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove(
                        "mobile-open"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const spans =
                        button.querySelectorAll(
                            "span"
                        );


                    if (spans.length >= 3) {

                        spans[0].style.transform =
                            "";

                        spans[1].style.opacity =
                            "";

                        spans[2].style.transform =
                            "";
                    }
                }
            );
        }
    );
}


/* ============================================================
   06. DROPDOWN MENUS
   ============================================================ */

function initDropdowns() {

    const dropdowns =
        document.querySelectorAll(
            ".nav-dropdown"
        );


    if (!dropdowns.length) {
        return;
    }


    dropdowns.forEach(
        (dropdown) => {

            const toggle =
                dropdown.querySelector(
                    "[data-dropdown-toggle]"
                );


            if (!toggle) {
                return;
            }


            toggle.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    /*
                       Close other dropdowns.
                    */

                    dropdowns.forEach(
                        (other) => {

                            if (
                                other !==
                                dropdown
                            ) {

                                other.classList.remove(
                                    "open"
                                );
                            }
                        }
                    );


                    dropdown.classList.toggle(
                        "open"
                    );


                    const isOpen =
                        dropdown.classList.contains(
                            "open"
                        );


                    toggle.setAttribute(
                        "aria-expanded",
                        String(isOpen)
                    );
                }
            );
        }
    );


    /*
       Close when clicking outside.
    */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".nav-dropdown"
                )
            ) {

                dropdowns.forEach(
                    (dropdown) => {

                        dropdown.classList.remove(
                            "open"
                        );
                    }
                );
            }
        }
    );
}


/* ============================================================
   07. SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right, .reveal-scale"
        );


    if (!elements.length) {
        return;
    }


    /*
       Respect reduced-motion preference.
    */

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reduceMotion) {

        elements.forEach(
            (element) => {

                element.classList.add(
                    "revealed"
                );
            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "revealed"
                        );


                        observer.unobserve(
                            entry.target
                        );
                    }
                );
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    elements.forEach(
        (element) => {

            observer.observe(
                element
            );
        }
    );
}


/* ============================================================
   08. PARALLAX
   ============================================================ */

function initParallax() {

    const elements =
        document.querySelectorAll(
            "[data-parallax]"
        );


    if (!elements.length) {
        return;
    }


    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reduceMotion) {
        return;
    }


    let ticking = false;


    function updateParallax() {

        elements.forEach(
            (element) => {

                const speed =
                    parseFloat(
                        element.dataset.parallax
                    ) || 0.15;


                const rect =
                    element.getBoundingClientRect();


                /*
                   Only animate elements
                   close to the viewport.
                */

                if (
                    rect.bottom < 0 ||
                    rect.top >
                        window.innerHeight
                ) {
                    return;
                }


                const center =
                    rect.top +
                    rect.height / 2;


                const viewportCenter =
                    window.innerHeight / 2;


                const distance =
                    center -
                    viewportCenter;


                const movement =
                    distance * speed;


                element.style.transform =
                    `translate3d(
                        0,
                        ${movement}px,
                        0
                    )`;
            }
        );


        ticking = false;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateParallax
                );

                ticking = true;
            }
        },
        {
            passive: true
        }
    );


    updateParallax();
}


/* ============================================================
   09. 3D TILT CARDS
   ============================================================ */

function initTiltCards() {

    const cards =
        document.querySelectorAll(
            ".tilt-card"
        );


    if (!cards.length) {
        return;
    }


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {
        return;
    }


    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reduceMotion) {
        return;
    }


    cards.forEach(
        (card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        ((y - centerY) /
                            centerY) *
                        -5;


                    const rotateY =
                        ((x - centerX) /
                            centerX) *
                        5;


                    card.style.transform =
                        `perspective(1000px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-8px)`;
                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";
                }
            );
        }
    );
}


/* ============================================================
   10. MAGNETIC BUTTONS
   ============================================================ */

function initMagneticButtons() {

    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {
        return;
    }


    const buttons =
        document.querySelectorAll(
            ".magnetic"
        );


    if (!buttons.length) {
        return;
    }


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    const strength =
                        0.18;


                    button.style.transform =
                        `translate(
                            ${x * strength}px,
                            ${y * strength}px
                        )`;
                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";
                }
            );
        }
    );
}


/* ============================================================
   11. SMOOTH SCROLL
   ============================================================ */

function initSmoothScrolling() {

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    let target;


                    try {

                        target =
                            document.querySelector(
                                targetId
                            );

                    } catch (error) {

                        return;
                    }


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const navbar =
                        document.querySelector(
                            ".site-nav"
                        );


                    const offset =
                        navbar
                            ? navbar.offsetHeight
                            : 0;


                    const position =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        offset -
                        15;


                    window.scrollTo({
                        top: position,
                        behavior: "smooth"
                    });
                }
            );
        }
    );
}


/* ============================================================
   12. BACK TO TOP
   ============================================================ */

function initBackToTop() {

    let button =
        document.querySelector(
            ".back-to-top"
        );


    /*
       Create automatically if missing.
    */

    if (!button) {

        button =
            document.createElement(
                "button"
            );

        button.className =
            "back-to-top";

        button.setAttribute(
            "aria-label",
            "Back to top"
        );

        button.type =
            "button";

        button.innerHTML =
            "↑";

        document.body.appendChild(
            button
        );
    }


    function updateBackToTop() {

        if (
            window.scrollY > 500
        ) {

            button.classList.add(
                "visible"
            );

        } else {

            button.classList.remove(
                "visible"
            );
        }
    }


    window.addEventListener(
        "scroll",
        updateBackToTop,
        {
            passive: true
        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    updateBackToTop();
}


/* ============================================================
   13. PAGE TRANSITIONS
   ============================================================ */

function initPageTransitions() {

    let transition =
        document.querySelector(
            ".page-transition"
        );


    /*
       Create transition overlay if missing.
    */

    if (!transition) {

        transition =
            document.createElement(
                "div"
            );

        transition.className =
            "page-transition";

        document.body.appendChild(
            transition
        );
    }


    /*
       Internal HTML links only.
    */

    document.querySelectorAll(
        'a[href$=".html"]'
    ).forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (!href) {
                        return;
                    }


                    /*
                       Ignore external links.
                    */

                    if (
                        href.startsWith(
                            "http://"
                        ) ||
                        href.startsWith(
                            "https://"
                        ) ||
                        href.startsWith(
                            "//"
                        )
                    ) {
                        return;
                    }


                    /*
                       Ignore new tabs.
                    */

                    if (
                        link.target ===
                        "_blank"
                    ) {
                        return;
                    }


                    /*
                       Ignore modifier clicks.
                    */

                    if (
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey ||
                        event.altKey
                    ) {
                        return;
                    }


                    event.preventDefault();


                    transition.classList.add(
                        "active"
                    );


                    setTimeout(
                        () => {

                            window.location.href =
                                href;

                        },
                        420
                    );
                }
            );
        }
    );
}


/* ============================================================
   14. IMAGE REVEAL
   ============================================================ */

function initImageReveal() {

    const images =
        document.querySelectorAll(
            ".image-reveal"
        );


    if (!images.length) {
        return;
    }


    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reduceMotion) {

        images.forEach(
            (image) => {

                image.classList.add(
                    "revealed"
                );
            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "revealed"
                        );


                        observer.unobserve(
                            entry.target
                        );
                    }
                );
            },
            {
                threshold: 0.15
            }
        );


    images.forEach(
        (image) => {

            observer.observe(
                image
            );
        }
    );
}


/* ============================================================
   15. INTERACTIVE CRAFT POINTS
   ============================================================ */

function initCraftPoints() {

    const points =
        document.querySelectorAll(
            ".craft-point"
        );


    points.forEach(
        (point) => {

            point.addEventListener(
                "click",
                () => {

                    const craft =
                        point.dataset.craft ||
                        "Indian Craft";


                    showToast(
                        `${craft} • Discover the story behind the craft.`,
                        "success"
                    );
                }
            );
        }
    );
}


/* ============================================================
   16. GLOBAL BUTTON INTERACTIONS
   ============================================================ */

function initGlobalButtons() {

    /*
       Toast buttons.

       Example:

       <button
           data-action="toast"
           data-message="Product saved successfully!"
       >
    */

    document.querySelectorAll(
        "[data-action='toast']"
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const message =
                        button.dataset.message ||
                        "Your action was completed.";


                    showToast(
                        message,
                        "success"
                    );
                }
            );
        }
    );


    /*
       Favorite buttons.
    */

    document.querySelectorAll(
        ".favorite-button"
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    button.classList.toggle(
                        "active"
                    );


                    const active =
                        button.classList.contains(
                            "active"
                        );


                    button.innerHTML =
                        active
                            ? "♥"
                            : "♡";


                    button.setAttribute(
                        "aria-pressed",
                        String(active)
                    );


                    showToast(
                        active
                            ? "Added to your favorites."
                            : "Removed from your favorites.",
                        "success"
                    );
                }
            );
        }
    );


    /*
       Demo action buttons.

       These are useful for hackathon
       prototype interactions.
    */

    document.querySelectorAll(
        "[data-demo-action]"
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.demoAction;


                    if (
                        action ===
                        "enhance"
                    ) {

                        showToast(
                            "AI Product Studio is preparing your product image.",
                            "success"
                        );

                    } else if (
                        action ===
                        "catalog"
                    ) {

                        showToast(
                            "Your voice is being transformed into a professional catalog.",
                            "success"
                        );

                    } else if (
                        action ===
                        "pricing"
                    ) {

                        showToast(
                            "AI is analysing material cost, labour and market signals.",
                            "success"
                        );

                    } else if (
                        action ===
                        "publish"
                    ) {

                        showToast(
                            "Your digital product listing is ready to publish.",
                            "success"
                        );

                    } else {

                        showToast(
                            "Taana-Baana AI is working on it.",
                            "success"
                        );
                    }
                }
            );
        }
    );
}


/* ============================================================
   17. TOAST SYSTEM
   ============================================================ */

function showToast(
    message,
    type = "success"
) {

    let container =
        document.querySelector(
            ".toast-container"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast ${type}`;


    toast.setAttribute(
        "role",
        "status"
    );


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    /*
       Trigger animation.
    */

    requestAnimationFrame(() => {

        toast.classList.add(
            "show"
        );
    });


    /*
       Remove after 3.2 seconds.
    */

    setTimeout(
        () => {

            toast.classList.add(
                "hide"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                450
            );

        },
        3200
    );
}


/* ============================================================
   18. MODAL SYSTEM
   ============================================================ */

function openModal(modalId) {

    const modal =
        document.getElementById(
            modalId
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "no-scroll"
    );
}


function closeModal(modalId) {

    const modal =
        document.getElementById(
            modalId
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
       Only remove no-scroll if
       no other modal remains open.
    */

    if (
        !document.querySelector(
            ".modal.active"
        )
    ) {

        document.body.classList.remove(
            "no-scroll"
        );
    }
}


/*
   Expose globally.

   This allows HTML to use:

   TaanaBaana.openModal("demoModal");

   TaanaBaana.closeModal("demoModal");

   TaanaBaana.showToast("Done!");
*/

window.TaanaBaana = Object.assign(window.TaanaBaana || {}, {
    openModal,
    closeModal,
    showToast
});


/* ============================================================
   19. MODAL AUTO-CLOSE
   ============================================================ */

document.addEventListener(
    "click",
    (event) => {

        /*
           Click outside modal content.
        */

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            const modal =
                event.target;


            modal.classList.remove(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.classList.remove(
                "no-scroll"
            );
        }


        /*
           Close button.
        */

        const closeButton =
            event.target.closest(
                ".modal-close"
            );


        if (!closeButton) {
            return;
        }


        const modal =
            closeButton.closest(
                ".modal"
            );


        if (!modal) {
            return;
        }


        modal.classList.remove(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (
            !document.querySelector(
                ".modal.active"
            )
        ) {

            document.body.classList.remove(
                "no-scroll"
            );
        }
    }
);


/* ============================================================
   20. ESCAPE KEY
   ============================================================ */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        document.querySelectorAll(
            ".modal.active"
        ).forEach(
            (modal) => {

                modal.classList.remove(
                    "active"
                );

                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );


        document.body.classList.remove(
            "no-scroll"
        );
    }
);


/* ============================================================
   21. MOUSE-BASED HERO PARALLAX
   ============================================================ */

function initMouseParallax() {

    /*
       Disable on touch devices.
    */

    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {
        return;
    }


    const elements =
        document.querySelectorAll(
            "[data-mouse-parallax]"
        );


    if (!elements.length) {
        return;
    }


    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reduceMotion) {
        return;
    }


    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    window.addEventListener(
        "mousemove",
        (event) => {

            targetX =
                event.clientX /
                    window.innerWidth -
                0.5;


            targetY =
                event.clientY /
                    window.innerHeight -
                0.5;
        }
    );


    function animate() {

        currentX +=
            (targetX - currentX) *
            0.08;


        currentY +=
            (targetY - currentY) *
            0.08;


        elements.forEach(
            (element) => {

                const strength =
                    parseFloat(
                        element.dataset
                            .mouseParallax
                    ) || 15;


                const moveX =
                    currentX *
                    strength;


                const moveY =
                    currentY *
                    strength;


                element.style.transform =
                    `translate3d(
                        ${moveX}px,
                        ${moveY}px,
                        0
                    )`;
            }
        );


        requestAnimationFrame(
            animate
        );
    }


    animate();
}


/* ============================================================
   22. NUMBER COUNTER ANIMATION
   ============================================================ */

function initCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (!counters.length) {
        return;
    }


    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /*
       If reduced motion is enabled,
       immediately display final numbers.
    */

    if (reduceMotion) {

        counters.forEach(
            (element) => {

                const target =
                    parseFloat(
                        element.dataset.counter
                    );


                const suffix =
                    element.dataset.suffix ||
                    "";


                element.textContent =
                    `${target.toLocaleString()}${suffix}`;
            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const element =
                            entry.target;


                        const target =
                            parseFloat(
                                element.dataset.counter
                            );


                        const suffix =
                            element.dataset.suffix ||
                            "";


                        const duration =
                            1600;


                        const start =
                            performance.now();


                        function update(
                            currentTime
                        ) {

                            const progress =
                                Math.min(
                                    (
                                        currentTime -
                                        start
                                    ) /
                                    duration,
                                    1
                                );


                            /*
                               Ease-out cubic.
                            */

                            const eased =
                                1 -
                                Math.pow(
                                    1 - progress,
                                    3
                                );


                            const value =
                                target *
                                eased;


                            element.textContent =
                                `${Math.floor(value).toLocaleString()}${suffix}`;


                            if (
                                progress < 1
                            ) {

                                requestAnimationFrame(
                                    update
                                );

                            } else {

                                element.textContent =
                                    `${target.toLocaleString()}${suffix}`;
                            }
                        }


                        requestAnimationFrame(
                            update
                        );


                        observer.unobserve(
                            element
                        );
                    }
                );
            },
            {
                threshold: 0.7
            }
        );


    counters.forEach(
        (counter) => {

            observer.observe(
                counter
            );
        }
    );
}


/* ============================================================
   23. ACTIVE NAV LINK
   ============================================================ */

function setActiveNavLink() {

    const currentPath =
        window.location.pathname;


    let currentPage =
        currentPath
            .split("/")
            .pop();


    /*
       When opening through Live Server
       the filename can be empty.
    */

    if (!currentPage) {
        currentPage = "index.html";
    }


    const links =
        document.querySelectorAll(
            ".nav-link[data-page]"
        );


    links.forEach(
        (link) => {

            const page =
                link.dataset.page;


            if (
                page === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            } else {

                link.classList.remove(
                    "active"
                );
            }
        }
    );
}


/* ============================================================
   24. LAZY IMAGE LOADING
   ============================================================ */

function initLazyImages() {

    document.querySelectorAll(
        "img"
    ).forEach(
        (image) => {

            /*
               Do not override explicit loading values.
            */

            if (
                image.hasAttribute(
                    "loading"
                )
            ) {
                return;
            }


            /*
               Keep images marked as hero
               eager-loaded.

               Example:

               <img class="hero-image">
            */

            if (
                image.classList.contains(
                    "hero-image"
                )
            ) {

                image.setAttribute(
                    "loading",
                    "eager"
                );

            } else {

                image.setAttribute(
                    "loading",
                    "lazy"
                );
            }
        }
    );
}


/* ============================================================
   25. IMAGE ERROR FALLBACK
   ============================================================ */

function initImageFallback() {

    document.addEventListener(
        "error",
        (event) => {

            const target =
                event.target;


            if (
                !target ||
                target.tagName !==
                    "IMG"
            ) {
                return;
            }


            /*
               Avoid infinite fallback loops.
            */

            if (
                target.dataset
                    .fallbackApplied
            ) {
                return;
            }


            target.dataset
                .fallbackApplied =
                "true";


            /*
               Remove broken image source.
            */

            target.removeAttribute(
                "src"
            );


            /*
               Give the image element
               a warm Taana-Baana fallback.
            */

            target.style.objectFit =
                "cover";


            target.style.background =
                "linear-gradient(135deg, #f4eadb, #dce2d2)";


            /*
               Accessibility text.
            */

            if (
                !target.alt
            ) {

                target.alt =
                    "Taana-Baana craft image";
            }
        },
        true
    );
}


/* ============================================================
   26. KEYBOARD ACCESSIBILITY
   ============================================================ */

function initKeyboardAccessibility() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Tab"
            ) {

                document.body.classList.add(
                    "keyboard-user"
                );
            }
        }
    );


    document.addEventListener(
        "mousedown",
        () => {

            document.body.classList.remove(
                "keyboard-user"
            );
        }
    );
}


/* ============================================================
   27. WINDOW RESIZE
   ============================================================ */

window.addEventListener(
    "resize",
    () => {

        /*
           Close mobile navigation
           when switching to desktop.
        */

        if (
            window.innerWidth > 900
        ) {

            const nav =
                document.querySelector(
                    ".nav-links"
                );


            const button =
                document.querySelector(
                    ".mobile-menu-button"
                );


            if (nav) {

                nav.classList.remove(
                    "mobile-open"
                );
            }


            if (button) {

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const spans =
                    button.querySelectorAll(
                        "span"
                    );


                if (spans.length >= 3) {

                    spans[0].style.transform =
                        "";

                    spans[1].style.opacity =
                        "";

                    spans[2].style.transform =
                        "";
                }
            }
        }
    }
);


/* ============================================================
   28. PAGE VISIBILITY
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
           When user switches tabs,
           avoid unnecessary animations.
        */

        if (
            document.hidden
        ) {

            document.body.classList.add(
                "page-hidden"
            );

        } else {

            document.body.classList.remove(
                "page-hidden"
            );
        }
    }
);


/* ============================================================
   29. PREVENT ACCIDENTAL FORM SUBMISSION
       FOR DEMO-ONLY FRONTEND FORMS
   ============================================================ */

document.addEventListener(
    "submit",
    (event) => {

        const form =
            event.target;


        /*
           Forms marked data-demo-form
           are frontend-only for now.

           Backend can be connected later.
        */

        if (
            form.hasAttribute(
                "data-demo-form"
            )
        ) {

            event.preventDefault();


            showToast(
                "Demo action completed. Backend integration can be connected later.",
                "success"
            );
        }
    }
);


/* ============================================================
   30. SEARCH INPUT DEMO INTERACTION
   ============================================================ */

document.querySelectorAll(
    "[data-live-search]"
).forEach(
    (input) => {

        const targetSelector =
            input.dataset.liveSearch;


        if (!targetSelector) {
            return;
        }


        const items =
            document.querySelectorAll(
                targetSelector
            );


        input.addEventListener(
            "input",
            () => {

                const query =
                    input.value
                        .trim()
                        .toLowerCase();


                items.forEach(
                    (item) => {

                        const text =
                            item.textContent
                                .toLowerCase();


                        if (
                            !query ||
                            text.includes(
                                query
                            )
                        ) {

                            item.style.display =
                                "";

                        } else {

                            item.style.display =
                                "none";
                        }
                    }
                );
            }
        );
    }
);


/* ============================================================
   31. SCROLL PROGRESS BAR
   ============================================================ */

function initScrollProgress() {

    let progress =
        document.querySelector(
            ".scroll-progress"
        );


    /*
       Create automatically if it
       doesn't exist in HTML.
    */

    if (!progress) {

        progress =
            document.createElement(
                "div"
            );

        progress.className =
            "scroll-progress";

        document.body.appendChild(
            progress
        );
    }


    function updateProgress() {

        const scrollTop =
            window.scrollY;


        const documentHeight =
            document.documentElement
                .scrollHeight -
            window.innerHeight;


        if (
            documentHeight <= 0
        ) {

            progress.style.width =
                "0%";

            return;
        }


        const percentage =
            (
                scrollTop /
                documentHeight
            ) *
            100;


        progress.style.width =
            `${percentage}%`;
    }


    window.addEventListener(
        "scroll",
        updateProgress,
        {
            passive: true
        }
    );


    updateProgress();
}


/*
   Start scroll progress.
*/

initScrollProgress();


/* ============================================================
   32. HOVER IMAGE MAGNIFICATION
   ============================================================ */

function initImageHover() {

    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {
        return;
    }


    const images =
        document.querySelectorAll(
            "[data-image-hover]"
        );


    images.forEach(
        (image) => {

            image.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        image.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width *
                        100;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height *
                        100;


                    image.style.transformOrigin =
                        `${x}% ${y}%`;
                }
            );
        }
    );
}


initImageHover();


/* ============================================================
   33. ACTIVE SECTION DETECTION
   ============================================================ */

function initSectionTracking() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    if (!sections.length) {
        return;
    }


    const navLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    if (!navLinks.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const id =
                            entry.target.id;


                        navLinks.forEach(
                            (link) => {

                                link.classList.toggle(
                                    "section-active",
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${id}`
                                );
                            }
                        );
                    }
                );
            },
            {
                threshold: 0.35
            }
        );


    sections.forEach(
        (section) => {

            observer.observe(
                section
            );
        }
    );
}


initSectionTracking();


/* ============================================================
   34. EXTERNAL LINK SAFETY
   ============================================================ */

function initExternalLinks() {

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(
        (link) => {

            const rel =
                link.getAttribute(
                    "rel"
                ) || "";


            if (
                !rel.includes(
                    "noopener"
                )
            ) {

                link.setAttribute(
                    "rel",
                    `${rel} noopener noreferrer`.trim()
                );
            }
        }
    );
}


initExternalLinks();


/* ============================================================
   35. REDUCED MOTION DETECTION
   ============================================================ */

function initReducedMotion() {

    const mediaQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    function updateMotionState() {

        document.body.classList.toggle(
            "reduced-motion",
            mediaQuery.matches
        );
    }


    updateMotionState();


    if (
        mediaQuery.addEventListener
    ) {

        mediaQuery.addEventListener(
            "change",
            updateMotionState
        );

    } else if (
        mediaQuery.addListener
    ) {

        mediaQuery.addListener(
            updateMotionState
        );
    }
}


initReducedMotion();


/* ============================================================
   36. FINAL READY STATE
   ============================================================ */

window.requestAnimationFrame(() => {

    document.body.classList.add(
        "js-ready"
    );
});