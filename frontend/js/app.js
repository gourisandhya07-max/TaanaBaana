/* =========================================================
   TAANA-BAANA
   MAIN APPLICATION JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = (selector) =>
        document.querySelector(selector);

    const $$ = (selector) =>
        document.querySelectorAll(selector);


    /* =====================================================
       INTRO ANIMATION
    ===================================================== */

    // Intro animation is handled by main.js — do not override it here


    /* =====================================================
       NAVBAR
    ===================================================== */

    const navbar = $("#navbar");

    window.addEventListener(
        "scroll",
        () => {

            if (!navbar) return;

            navbar.classList.toggle(
                "scrolled",
                window.scrollY > 40
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuButton = $("#menuButton");
    const mobileMenu = $("#mobileMenu");
    const mobileClose = $("#mobileClose");

    function openMobileMenu() {

        mobileMenu?.classList.add("open");

        document.body.classList.add("no-scroll");

    }


    function closeMobileMenu() {

        mobileMenu?.classList.remove("open");

        document.body.classList.remove("no-scroll");

    }


    menuButton?.addEventListener(
        "click",
        openMobileMenu
    );


    mobileClose?.addEventListener(
        "click",
        closeMobileMenu
    );


    /* =====================================================
       SMOOTH NAVIGATION
    ===================================================== */

    $$("[data-scroll]").forEach((link) => {

        link.addEventListener("click", (event) => {

            const target =
                link.getAttribute("href");

            if (
                target &&
                target.startsWith("#")
            ) {

                event.preventDefault();

                const element =
                    document.querySelector(target);

                if (element) {

                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

                closeMobileMenu();

            }

        });

    });


    $$("[data-scroll-target]").forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    button.getAttribute(
                        "data-scroll-target"
                    );

                document
                    .querySelector(target)
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


    /* =====================================================
       GSAP SCROLL ANIMATIONS
    ===================================================== */

    if (
        window.gsap &&
        window.ScrollTrigger
    ) {

        gsap.registerPlugin(
            ScrollTrigger
        );


        gsap.utils.toArray(
            ".section-label"
        ).forEach((element) => {

            gsap.from(element, {

                scrollTrigger: {
                    trigger: element,
                    start: "top 85%"
                },

                opacity: 0,
                x: -30,
                duration: .8,
                ease: "power3.out"

            });

        });


        gsap.utils.toArray(
            ".process-card"
        ).forEach((card, index) => {

            gsap.from(card, {

                scrollTrigger: {
                    trigger: card,
                    start: "top 85%"
                },

                opacity: 0,
                y: 50,

                duration: .7,

                delay: index * .08,

                ease: "power3.out"

            });

        });


        gsap.utils.toArray(
            ".product-card"
        ).forEach((card, index) => {

            gsap.from(card, {

                scrollTrigger: {
                    trigger: card,
                    start: "top 88%"
                },

                opacity: 0,
                y: 40,

                duration: .7,

                delay: index * .08

            });

        });


        gsap.utils.toArray(
            ".artisan-story"
        ).forEach((card, index) => {

            gsap.from(card, {

                scrollTrigger: {
                    trigger: card,
                    start: "top 88%"
                },

                opacity: 0,
                y: 45,

                duration: .8,

                delay: index * .1

            });

        });


        gsap.from(".hero-visual", {

            opacity: 0,
            x: 80,
            duration: 1.2,
            delay: .4,
            ease: "power3.out"

        });


        gsap.from(".hero-content .reveal", {

            opacity: 0,
            y: 35,

            duration: .9,

            stagger: .12,

            delay: 3.2,

            ease: "power3.out"

        });


        /* Parallax */

        window.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    (event.clientX /
                        window.innerWidth
                    - .5) * 2;

                const y =
                    (event.clientY /
                        window.innerHeight
                    - .5) * 2;


                $$(".floating-shape").forEach(
                    (shape) => {

                        const depth =
                            parseFloat(
                                shape.dataset.depth
                            ) || .2;

                        gsap.to(shape, {

                            x:
                                x * 35 * depth,

                            y:
                                y * 35 * depth,

                            duration: 1.2,

                            ease: "power2.out",

                            overwrite: true

                        });

                    }
                );

            }
        );

    }


    /* =====================================================
       PRODUCT STUDIO
    ===================================================== */

    const enhanceButton =
        $("#enhanceButton");

    const enhanceOverlay =
        $("#enhanceOverlay");


    enhanceButton?.addEventListener(
        "click",
        () => {

            enhanceOverlay?.classList.add(
                "show"
            );

            enhanceButton.disabled = true;

            enhanceButton.textContent =
                "Enhancing...";


            setTimeout(() => {

                enhanceOverlay?.classList.remove(
                    "show"
                );

                enhanceButton.disabled = false;

                enhanceButton.innerHTML =
                    "✓ Enhanced";

                showToast(
                    "Product image enhanced successfully"
                );

            }, 2200);

        }
    );


    /* =====================================================
       PRICING CALCULATOR
    ===================================================== */

    const calculatePrice =
        $("#calculatePrice");


    calculatePrice?.addEventListener(
        "click",
        () => {

            const material =
                Number(
                    $("#materialCost")?.value
                ) || 0;

            const labour =
                Number(
                    $("#labourCost")?.value
                ) || 0;

            const packaging =
                Number(
                    $("#packagingCost")?.value
                ) || 0;

            const other =
                Number(
                    $("#otherCost")?.value
                ) || 0;


            const cost =
                material +
                labour +
                packaging +
                other;


            const minimum =
                Math.round(
                    cost * 1.2
                );


            const recommended =
                Math.round(
                    cost * 1.5
                );


            const premium =
                Math.round(
                    cost * 1.8
                );


            $("#minimumPrice").textContent =
                formatCurrency(minimum);

            $("#recommendedPrice").textContent =
                formatCurrency(recommended);

            $("#premiumPrice").textContent =
                formatCurrency(premium);


            $("#pricingExplanation").textContent =
                `Your estimated base cost is ${formatCurrency(cost)}. `
                +
                `The recommendation includes a sustainable margin `
                +
                `to help protect the value of your craft.`;


            showToast(
                "Smart price updated"
            );

        }
    );


    function formatCurrency(value) {

        return "₹" +
            Number(value).toLocaleString(
                "en-IN"
            );

    }


    /* =====================================================
       FAVORITES
    ===================================================== */

    $$(".favorite").forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                button.classList.toggle(
                    "active"
                );

                button.textContent =
                    button.classList.contains(
                        "active"
                    )
                        ? "♥"
                        : "♡";

                showToast(
                    button.classList.contains(
                        "active"
                    )
                        ? "Added to favorites"
                        : "Removed from favorites"
                );

            }
        );

    });


    /* =====================================================
       MARKET FILTER
    ===================================================== */

    $$(".filter").forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                $$(".filter").forEach(
                    (filter) =>
                        filter.classList.remove(
                            "active"
                        )
                );

                button.classList.add(
                    "active"
                );


                const category =
                    button.textContent.trim();


                $$(".product-card").forEach(
                    (card) => {

                        if (
                            category === "All" ||
                            card.dataset.category ===
                                category
                        ) {

                            card.style.display =
                                "";

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    });


    /* =====================================================
       PRODUCT MODAL
    ===================================================== */

    $$(".view-product").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const product =
                        button.dataset.product;

                    openModal(`
                        <span style="
                            font-size:9px;
                            letter-spacing:.18em;
                            color:#c96f4a;
                        ">
                            ARTISAN MARKETPLACE
                        </span>

                        <h2>
                            ${product}
                        </h2>

                        <p>
                            A handcrafted product created
                            by skilled Indian makers using
                            traditional techniques and
                            locally sourced materials.
                        </p>

                        <div style="
                            margin-top:30px;
                            padding:25px;
                            background:#f4eadb;
                            border-radius:12px;
                        ">

                            <strong>
                                AI PRODUCT STORY
                            </strong>

                            <p>
                                This digital listing demonstrates
                                how Taana-Baana can preserve the
                                maker's story while making the
                                product easier to discover online.
                            </p>

                        </div>

                        <button
                            class="primary-button"
                            style="margin-top:25px"
                            onclick="window.taanaBaanaAddToCart('${product}')"
                        >
                            Add to enquiry →
                        </button>
                    `);

                }
            );

        }
    );


    /* =====================================================
       AI ASSISTANT
    ===================================================== */

    const aiFloatingButton =
        $("#aiFloatingButton");

    const openAiAssistant =
        $("#openAiAssistant");

    const aiPanel =
        $("#aiPanel");

    const closeAi =
        $("#closeAi");


    function openAI() {

        aiPanel?.classList.add(
            "open"
        );

    }


    function closeAI() {

        aiPanel?.classList.remove(
            "open"
        );

    }


    aiFloatingButton?.addEventListener(
        "click",
        openAI
    );


    openAiAssistant?.addEventListener(
        "click",
        openAI
    );


    closeAi?.addEventListener(
        "click",
        closeAI
    );


    /* =====================================================
       AI CHAT
    ===================================================== */

    const aiForm =
        $("#aiForm");

    const aiInput =
        $("#aiInput");

    const aiMessages =
        $("#aiMessages");


    aiForm?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const message =
                aiInput.value.trim();

            if (!message) return;

            addMessage(
                message,
                "user"
            );

            aiInput.value = "";
            aiInput.disabled = true;
            aiForm.querySelector("button[type='submit']")?.setAttribute("disabled", "disabled");

            try {
                const reply = await generateAIResponse(message);
                addMessage(reply, "bot");
            } catch (error) {
                addMessage("The AI service is currently unavailable. Please try again in a moment.", "bot");
            } finally {
                aiInput.disabled = false;
                aiForm.querySelector("button[type='submit']")?.removeAttribute("disabled");
                aiInput.focus();
            }

        }
    );


    $$(".quick-prompts button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const question =
                        button.textContent.trim();

                    addMessage(
                        question,
                        "user"
                    );

                    try {
                        const response = await generateAIResponse(question);
                        addMessage(response, "bot");
                    } catch (error) {
                        addMessage("The AI service is currently unavailable. Please try again in a moment.", "bot");
                    }

                }
            );

        });


    function addMessage(
        text,
        type
    ) {

        const message =
            document.createElement("div");

        message.className =
            `ai-message ${type}`;


        if (type === "bot") {

            message.innerHTML = `
                <span>✦</span>
                <p>${text}</p>
            `;

        } else {

            message.innerHTML = `
                <p>${text}</p>
            `;

        }


        aiMessages.appendChild(
            message
        );


        aiMessages.scrollTop =
            aiMessages.scrollHeight;

    }


    async function generateAIResponse(message) {
        const payload = { message: message.trim() };

        if (!payload.message) {
            return "Please type a question to continue.";
        }

        try {
            const result = await window.TaanaBaana.apiRequest("/api/business-advisor", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            return result.message || "I can help with that.";
        } catch (error) {
            const text = message.toLowerCase();

            if (text.includes("price") || text.includes("pricing")) {
                return "Start with your raw material, labour, packaging and other costs. Taana-Baana’s smart pricing assistant can then suggest a minimum sustainable, recommended and premium price.";
            }

            if (text.includes("description") || text.includes("catalog")) {
                return "Tell me your product name, material, how it was made and what makes it special. I can turn those details into a professional marketplace description.";
            }

            if (text.includes("buyer") || text.includes("b2b")) {
                return "B2B matching can connect buyer requirements with artisan clusters based on product type, quantity, location and pricing.";
            }

            if (text.includes("sell") || text.includes("market")) {
                return "Your product can be prepared as a digital listing and shared with buyers, marketplaces, cooperatives and your artisan network.";
            }

            return "I can help with product descriptions, pricing, marketplace preparation, buyer matching and your digital artisan profile. Tell me what you are making.";
        }
    }


    /* =====================================================
       VOICE DEMO
    ===================================================== */

    const voiceDemoButton =
        $("#voiceDemoButton");


    voiceDemoButton?.addEventListener(
        "click",
        () => {

            const original =
                voiceDemoButton.innerHTML;


            if (
                "webkitSpeechRecognition"
                in window
            ) {

                const Recognition =
                    window.webkitSpeechRecognition;

                const recognition =
                    new Recognition();


                recognition.lang =
                    "en-IN";


                recognition.start();


                voiceDemoButton.innerHTML =
                    "● Listening...";


                recognition.onresult =
                    (event) => {

                        const transcript =
                            event.results[0][0]
                                .transcript;


                        showToast(
                            `Heard: "${transcript}"`
                        );

                        voiceDemoButton.innerHTML =
                            "✓ Voice captured";

                    };


                recognition.onerror =
                    () => {

                        voiceDemoButton.innerHTML =
                            original;

                        showToast(
                            "Voice demo could not start"
                        );

                    };


                recognition.onend =
                    () => {

                        setTimeout(() => {

                            voiceDemoButton.innerHTML =
                                original;

                        }, 1200);

                    };

            } else {

                showToast(
                    "Voice demo is not supported in this browser"
                );

            }

        }
    );


    /* =====================================================
       ARTISAN CARD
    ===================================================== */

    $("#createCard")?.addEventListener(
        "click",
        () => {

            openModal(`

                <span style="
                    font-size:9px;
                    letter-spacing:.18em;
                    color:#c96f4a;
                ">
                    DIGITAL ARTISAN IDENTITY
                </span>

                <h2>
                    Create your Artisan Card
                </h2>

                <p>
                    Build a simple digital identity for
                    your craft and share it with buyers.
                </p>

                <form class="modal-form">

                    <label>
                        Your name

                        <input
                            type="text"
                            placeholder="Enter your name"
                        >
                    </label>

                    <label>
                        Craft / speciality

                        <input
                            type="text"
                            placeholder="e.g. Handloom weaving"
                        >
                    </label>

                    <label>
                        Location

                        <input
                            type="text"
                            placeholder="Village / district"
                        >
                    </label>

                    <button
                        type="button"
                        class="primary-button"
                        onclick="window.taanaBaanaCreateCard()"
                    >
                        Create Artisan Card →
                    </button>

                </form>

            `);

        }
    );


    window.taanaBaanaCreateCard =
        () => {

            closeModal();

            showToast(
                "Your Artisan Card has been created"
            );

        };


    /* =====================================================
       START SELLING
    ===================================================== */

    function startSelling() {

        openModal(`

            <span style="
                font-size:9px;
                letter-spacing:.18em;
                color:#c96f4a;
            ">
                WELCOME TO TAANA-BAANA
            </span>

            <h2>
                Start with one product.
            </h2>

            <p>
                Upload a product photo and let
                Taana-Baana guide you through creating
                your first digital listing.
            </p>

            <form class="modal-form">

                <label>
                    Product name

                    <input
                        type="text"
                        placeholder="What are you making?"
                    >
                </label>

                <label>
                    Craft category

                    <select>

                        <option>
                            Textiles
                        </option>

                        <option>
                            Pottery
                        </option>

                        <option>
                            Woodcraft
                        </option>

                        <option>
                            Jewellery
                        </option>

                        <option>
                            Other
                        </option>

                    </select>

                </label>

                <label>
                    Tell us about it

                    <textarea
                        placeholder="You can describe your product naturally..."
                    ></textarea>

                </label>

                <button
                    type="button"
                    class="primary-button"
                    onclick="window.taanaBaanaCreateProduct()"
                >
                    Generate listing with AI →
                </button>

            </form>

        `);

    }


    $("#startSelling")?.addEventListener(
        "click",
        startSelling
    );


    $("#finalStart")?.addEventListener(
        "click",
        startSelling
    );


    $("#addProduct")?.addEventListener(
        "click",
        startSelling
    );


    window.taanaBaanaCreateProduct =
        () => {

            closeModal();

            document
                .querySelector("#studio")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

            setTimeout(() => {

                showToast(
                    "AI Product Studio is ready"
                );

            }, 800);

        };


    /* =====================================================
       B2B DEMO
    ===================================================== */

    $("#buyerDemo")?.addEventListener(
        "click",
        () => {

            openModal(`

                <span style="
                    font-size:9px;
                    letter-spacing:.18em;
                    color:#c96f4a;
                ">
                    B2B BUYER MATCHING
                </span>

                <h2>
                    Describe what you need.
                </h2>

                <p>
                    Example: "I need 500 eco-friendly
                    jute bags under ₹250 each."
                </p>

                <form class="modal-form">

                    <label>
                        Requirement

                        <textarea
                            id="buyerRequirement"
                            placeholder="Describe quantity, material, budget and delivery needs..."
                        ></textarea>

                    </label>

                    <button
                        type="button"
                        class="primary-button"
                        onclick="window.taanaBaanaMatchBuyer()"
                    >
                        Find artisan matches →
                    </button>

                </form>

            `);

        }
    );


    window.taanaBaanaMatchBuyer =
        () => {

            const requirement =
                $("#buyerRequirement")
                    ?.value.trim();


            closeModal();


            showToast(
                requirement
                    ? "AI found 2 potential artisan matches"
                    : "Add a requirement first"
            );

        };


    /* =====================================================
       MARKETPLACE BUTTON
    ===================================================== */

    $("#viewMarketplace")?.addEventListener(
        "click",
        () => {

            showToast(
                "Marketplace demo loaded"
            );

        }
    );


    /* =====================================================
       EDIT LISTING
    ===================================================== */

    $("#editListing")?.addEventListener(
        "click",
        () => {

            openModal(`

                <span style="
                    font-size:9px;
                    letter-spacing:.18em;
                    color:#c96f4a;
                ">
                    AI PRODUCT LISTING
                </span>

                <h2>
                    Edit your listing
                </h2>

                <form class="modal-form">

                    <label>
                        Product title

                        <input
                            value="Handwoven Artisan Textile"
                        >
                    </label>

                    <label>
                        Description

                        <textarea> A handcrafted textile created using traditional weaving techniques, combining natural fibres with contemporary Indian design.</textarea>
                    </label>

                    <label>
                        Material

                        <input
                            value="Natural cotton"
                        >
                    </label>

                    <button
                        type="button"
                        class="primary-button"
                        onclick="window.taanaBaanaSaveListing()"
                    >
                        Save listing →
                    </button>

                </form>

            `);

        }
    );


    window.taanaBaanaSaveListing =
        () => {

            closeModal();

            showToast(
                "Listing saved successfully"
            );

        };


    /* =====================================================
       CART / ENQUIRY
    ===================================================== */

    window.taanaBaanaAddToCart =
        (product) => {

            closeModal();

            showToast(
                `${product} added to your enquiry`
            );

        };


    /* =====================================================
       MODAL
    ===================================================== */

    const modalOverlay =
        $("#modalOverlay");

    const modalContent =
        $("#modalContent");

    const closeModalButton =
        $("#closeModal");


    function openModal(content) {

        modalContent.innerHTML =
            content;

        modalOverlay.classList.add(
            "open"
        );

        document.body.classList.add(
            "no-scroll"
        );

    }


    function closeModal() {

        modalOverlay.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "no-scroll"
        );

    }


    closeModalButton?.addEventListener(
        "click",
        closeModal
    );


    modalOverlay?.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                modalOverlay
            ) {

                closeModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeModal();

                closeAI();

            }

        }
    );


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer;


    function showToast(message) {

        const toast =
            $("#toast");

        const text =
            toast?.querySelector("p");


        if (!toast || !text) return;


        text.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

    }


    /* =====================================================
       THREE.JS BACKGROUND
       Lightweight decorative canvas
    ===================================================== */

    function initThreeBackground() {

        if (!window.THREE) return;


        const canvas =
            document.createElement("canvas");


        canvas.id =
            "taanaThreeCanvas";


        canvas.style.position =
            "fixed";

        canvas.style.inset =
            "0";

        canvas.style.pointerEvents =
            "none";

        canvas.style.zIndex =
            "-1";

        canvas.style.opacity =
            ".12";


        document.body.appendChild(
            canvas
        );


        const renderer =
            new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true
            });


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.5
            )
        );


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        const scene =
            new THREE.Scene();


        const camera =
            new THREE.PerspectiveCamera(
                50,
                window.innerWidth /
                    window.innerHeight,
                .1,
                100
            );


        camera.position.z =
            8;


        const geometry =
            new THREE.BufferGeometry();


        const points = [];


        for (
            let i = 0;
            i < 250;
            i++
        ) {

            points.push(
                (Math.random() - .5) * 16,
                (Math.random() - .5) * 10,
                (Math.random() - .5) * 8
            );

        }


        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                points,
                3
            )
        );


        const material =
            new THREE.PointsMaterial({
                color: 0x879b76,
                size: .035,
                transparent: true,
                opacity: .7
            });


        const particleSystem =
            new THREE.Points(
                geometry,
                material
            );


        scene.add(
            particleSystem
        );


        function animate() {

            requestAnimationFrame(
                animate
            );

            particleSystem.rotation.y +=
                .0003;

            particleSystem.rotation.x +=
                .0001;

            renderer.render(
                scene,
                camera
            );

        }


        animate();


        window.addEventListener(
            "resize",
            () => {

                camera.aspect =
                    window.innerWidth /
                    window.innerHeight;

                camera.updateProjectionMatrix();

                renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                );

            }
        );

    }


    initThreeBackground();


    /* =====================================================
       CONSOLE
    ===================================================== */

    console.log(
        "%c TAANA-BAANA ",
        "background:#3b2922;color:#fff9f0;padding:8px 14px;border-radius:20px;font-weight:bold;"
    );

    console.log(
        "From Hands to Markets. 🧵"
    );

});