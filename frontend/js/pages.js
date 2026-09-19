/* =========================================================
   TAANA-BAANA
   INNER PAGE INTERACTIONS
========================================================= */


/* =========================================================
   IMAGE UPLOAD
========================================================= */

function setupImageUpload() {

    const input =
        document.getElementById(
            "imageInput"
        );

    const area =
        document.getElementById(
            "uploadArea"
        );

    const preview =
        document.getElementById(
            "uploadPreview"
        );


    if (!input || !area || !preview)
        return;


    input.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;

            preview.src =
                URL.createObjectURL(
                    file
                );

            area.classList.add(
                "has-image"
            );

            if (
                window.TaanaBaana
            ) {

                window.TaanaBaana.showToast(
                    "Product image uploaded ✨"
                );

            }

        }
    );


    [
        "dragenter",
        "dragover"
    ].forEach(
        eventName => {

            area.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    area.classList.add(
                        "dragging"
                    );

                }
            );

        }
    );


    [
        "dragleave",
        "drop"
    ].forEach(
        eventName => {

            area.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    area.classList.remove(
                        "dragging"
                    );

                }
            );

        }
    );


    area.addEventListener(
        "drop",
        event => {

            const file =
                event.dataTransfer.files[0];

            if (!file) return;

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                window.TaanaBaana.showToast(
                    "Please upload an image file."
                );

                return;
            }

            preview.src =
                URL.createObjectURL(
                    file
                );

            area.classList.add(
                "has-image"
            );

        }
    );

}


setupImageUpload();


/* =========================================================
   AI IMAGE ENHANCEMENT DEMO
========================================================= */

const enhanceButton =
    document.getElementById(
        "enhanceButton"
    );


if (enhanceButton) {

    enhanceButton.addEventListener(
        "click",
        () => {

            const result =
                document.getElementById(
                    "enhanceResult"
                );

            enhanceButton.disabled =
                true;

            enhanceButton.textContent =
                "✨ Enhancing...";


            setTimeout(
                () => {

                    enhanceButton.disabled =
                        false;

                    enhanceButton.textContent =
                        "✨ Enhance Image";

                    if (result) {

                        result.classList.add(
                            "show"
                        );

                        result.innerHTML = `
                            <div class="ai-result-title">
                                ✓ AI ENHANCEMENT COMPLETE
                            </div>

                            <h3>
                                Your product is marketplace-ready.
                            </h3>

                            <p>
                                Background cleaned, lighting balanced,
                                product centered and e-commerce framing
                                applied.
                            </p>
                        `;

                    }

                    window.TaanaBaana.showToast(
                        "AI Product Studio finished enhancing your image ✨"
                    );

                },
                1800
            );

        }
    );
}


/* =========================================================
   CATALOG GENERATOR
========================================================= */

const catalogButton =
    document.getElementById(
        "generateCatalog"
    );


if (catalogButton) {

    catalogButton.addEventListener(
        "click",
        () => {

            const input =
                document.getElementById(
                    "catalogInput"
                );

            const output =
                document.getElementById(
                    "catalogResult"
                );

            const productText =
                input
                    ? input.value.trim()
                    : "";


            if (!productText) {

                window.TaanaBaana.showToast(
                    "Tell us something about your product first 🎙️"
                );

                return;
            }


            catalogButton.textContent =
                "✨ Creating...";


            setTimeout(
                () => {

                    catalogButton.textContent =
                        "✨ Generate Catalog";


                    if (output) {

                        output.classList.add(
                            "show"
                        );

                        output.innerHTML = `
                            <div class="ai-result-title">
                                ✓ AI CATALOG GENERATED
                            </div>

                            <h3>
                                Handcrafted ${productText}
                            </h3>

                            <p>
                                Beautifully handcrafted using traditional
                                techniques and carefully selected materials.
                                Designed to bring the warmth of Indian
                                craftsmanship into everyday spaces.
                            </p>

                            <p style="margin-top:10px;">
                                <strong>Keywords:</strong>
                                handmade, Indian craft, artisan,
                                traditional, handcrafted, sustainable
                            </p>

                        `;

                    }

                    window.TaanaBaana.showToast(
                        "Your multilingual product listing is ready 🧵"
                    );

                },
                1400
            );

        }
    );
}


/* =========================================================
   LANGUAGE SELECTOR
========================================================= */

document
    .querySelectorAll(
        ".language-chip"
    )
    .forEach(chip => {

        chip.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".language-chip"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                chip.classList.add(
                    "active"
                );

                if (
                    window.TaanaBaana
                ) {

                    window.TaanaBaana.showToast(
                        `Language selected: ${chip.textContent}`
                    );

                }

            }
        );

    });


/* =========================================================
   VOICE RECOGNITION
========================================================= */

const micButton =
    document.getElementById(
        "micButton"
    );


const voiceOutput =
    document.getElementById(
        "voiceOutput"
    );


const voiceStatus =
    document.getElementById(
        "voiceStatus"
    );


let recognition = null;


if (
    "webkitSpeechRecognition"
    in window ||
    "SpeechRecognition"
    in window
) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    recognition =
        new SpeechRecognition();


    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    recognition.onstart =
        () => {

            if (micButton) {

                micButton.classList.add(
                    "recording"
                );

                micButton.textContent =
                    "⏹️";

            }

            if (voiceStatus) {

                voiceStatus.textContent =
                    "Listening... speak naturally";

            }

        };


    recognition.onresult =
        event => {

            const text =
                event
                    .results[0][0]
                    .transcript;


            if (voiceOutput) {

                voiceOutput.value =
                    text;

            }

            if (voiceStatus) {

                voiceStatus.textContent =
                    "Voice captured successfully ✓";

            }

        };


    recognition.onerror =
        () => {

            if (voiceStatus) {

                voiceStatus.textContent =
                    "Couldn't capture voice. Try again.";

            }

        };


    recognition.onend =
        () => {

            if (micButton) {

                micButton.classList.remove(
                    "recording"
                );

                micButton.textContent =
                    "🎙️";

            }

        };

}


if (micButton) {

    micButton.addEventListener(
        "click",
        () => {

            if (!recognition) {

                window.TaanaBaana.showToast(
                    "Voice recognition is not supported in this browser."
                );

                return;
            }


            try {

                recognition.start();

            } catch (error) {

                recognition.stop();

            }

        }
    );
}


/* =========================================================
   PRICING CALCULATOR
========================================================= */

const calculatePrice =
    document.getElementById(
        "calculatePrice"
    );


if (calculatePrice) {
    calculatePrice.addEventListener("click", async () => {
        const material = Number(document.getElementById("materialCost")?.value) || 0;
        const labour = Number(document.getElementById("labourCost")?.value) || 0;
        const packaging = Number(document.getElementById("packagingCost")?.value) || 0;
        const transport = Number(document.getElementById("transportCost")?.value) || 0;
        const overhead = Number(document.getElementById("overheadCost")?.value) || 0;
        const other = transport + overhead;

        if (window.TaanaBaana?.apiRequest) {
            try {
                const res = await window.TaanaBaana.apiRequest("/api/pricing", {
                    method: "POST",
                    body: JSON.stringify({
                        materialCost: material,
                        labourCost: labour,
                        packagingCost: packaging,
                        otherCost: other
                    })
                });

                if (res && res.recommendedPrice !== undefined) {
                    const minElem = document.getElementById("minimumPrice");
                    const recElem = document.getElementById("recommendedPrice");
                    const premElem = document.getElementById("premiumPrice");
                    const resultElem = document.getElementById("priceResult");
                    const reasonElem = document.getElementById("priceReason");

                    if (minElem) minElem.textContent = formatRupee(res.minimumPrice);
                    if (recElem) recElem.textContent = formatRupee(res.recommendedPrice);
                    if (premElem) premElem.textContent = formatRupee(res.premiumPrice);
                    if (resultElem) resultElem.style.display = "block";
                    if (reasonElem) {
                        reasonElem.innerHTML = `
                            Base estimated cost is <strong>${formatRupee(res.baseCost)}</strong>.
                            ${res.explanation}
                        `;
                    }
                    return;
                }
            } catch (err) {
                console.warn("AI Pricing API fallback:", err);
            }
        }

        const totalCost = material + labour + packaging + transport + overhead;
        const recommended = totalCost * 1.50;
        const minimum = totalCost * 1.20;
        const premium = totalCost * 1.80;

        const minElem = document.getElementById("minimumPrice");
        const recElem = document.getElementById("recommendedPrice");
        const premElem = document.getElementById("premiumPrice");
        const resultElem = document.getElementById("priceResult");
        const reasonElem = document.getElementById("priceReason");

        if (minElem) minElem.textContent = formatRupee(minimum);
        if (recElem) recElem.textContent = formatRupee(recommended);
        if (premElem) premElem.textContent = formatRupee(premium);
        if (resultElem) resultElem.style.display = "block";
        if (reasonElem) {
            reasonElem.innerHTML = `
                Your total estimated cost is <strong>${formatRupee(totalCost)}</strong>.
                Taana-Baana AI suggests <strong>${formatRupee(recommended)}</strong> as a sustainable recommended price.
            `;
        }
    });
}


function formatRupee(
    value
) {

    return "₹" +
        Math.round(value)
            .toLocaleString("en-IN");

}


/* =========================================================
   MARKETPLACE (SUPABASE INTEGRATION)
========================================================= */

const SUPABASE_REST_URL = "https://noyrfotqdzwnalbnmbcu.supabase.co/rest/v1/marketplace?select=*&order=created_at.desc";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veXJmb3RxZHp3bmFsYm5tYmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MzQ3MTEsImV4cCI6MjEwNTMxMDcxMX0.gSOtf53nY_lFsKbnQyS7TsUCo71ecqZ7tpHlF6rcfYk";

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateCartCount() {
    const cartCount = document.querySelector(".cart-count");
    if (!cartCount) return;
    try {
        const cart = JSON.parse(localStorage.getItem("taanaBaanaCart") || "[]");
        cartCount.textContent = String(cart.length);
    } catch (error) {
        cartCount.textContent = "0";
    }
}

function filterProducts() {
    const searchInput = document.getElementById("productSearch");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeFilter = document.querySelector(".filter-button.active");
    const category = activeFilter ? activeFilter.dataset.category : "all";

    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
        const name = card.dataset.name?.toLowerCase() || "";
        const artisan = card.dataset.artisan?.toLowerCase() || "";
        const material = card.dataset.material?.toLowerCase() || "";
        const cardCategory = card.dataset.category || "all";

        const matchesSearch = !query || name.includes(query) || artisan.includes(query) || material.includes(query);
        const matchesCategory = category === "all" || cardCategory === category;

        card.style.display = matchesSearch && matchesCategory ? "" : "none";
    });
}

function openProductModal(card) {
    if (!card) return;
    const modal = document.getElementById("productModal");
    if (!modal) return;

    const name = card.dataset.name || "Handcrafted product";
    const artisan = card.dataset.artisan || "Local artisan";
    const price = card.dataset.price || "0";
    const image = card.dataset.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85";

    const modalName = modal.querySelector(".product-modal-name");
    const modalArtisan = modal.querySelector(".product-modal-artisan");
    const modalPrice = modal.querySelector(".product-modal-price");
    const modalImage = modal.querySelector(".product-modal-image");

    if (modalName) modalName.textContent = name;
    if (modalArtisan) modalArtisan.textContent = artisan;
    if (modalPrice) modalPrice.textContent = `₹${Number(price).toLocaleString("en-IN")}`;
    if (modalImage) modalImage.src = image;

    modal.classList.add("active");
    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".modal-close");
    if (closeButton) {
        closeButton.onclick = () => {
            modal.classList.remove("active");
            document.body.classList.remove("modal-open");
        };
    }
}

function bindMarketplaceEvents() {
    const searchInput = document.getElementById("productSearch");
    if (searchInput) {
        searchInput.removeEventListener("input", filterProducts);
        searchInput.addEventListener("input", filterProducts);
    }

    document.querySelectorAll(".filter-button").forEach(button => {
        button.onclick = () => {
            document.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            filterProducts();
        };
    });

    document.querySelectorAll(".product-card").forEach(card => {
        card.onclick = (e) => {
            if (e.target.closest(".favorite-button") || e.target.closest("[data-add-cart]")) return;
            openProductModal(card);
        };
    });

    document.querySelectorAll(".favorite-button").forEach(button => {
        button.onclick = (event) => {
            event.stopPropagation();
            const active = button.classList.toggle("liked");
            button.textContent = active ? "♥" : "♡";
            if (window.TaanaBaana?.showToast) {
                window.TaanaBaana.showToast(active ? "Added to favorites ❤️" : "Removed from favorites");
            }
        };
    });

    document.querySelectorAll("[data-add-cart]").forEach(button => {
        button.onclick = (event) => {
            event.stopPropagation();
            const card = button.closest(".product-card");
            const name = card?.dataset.name || "Handcrafted product";
            const price = card?.dataset.price || "0";

            if (window.TaanaBaana?.addToCart) {
                window.TaanaBaana.addToCart({
                    name,
                    price,
                    addedAt: new Date().toISOString()
                });
            } else {
                try {
                    const cart = JSON.parse(localStorage.getItem("taanaBaanaCart") || "[]");
                    cart.push({ name, price, addedAt: new Date().toISOString() });
                    localStorage.setItem("taanaBaanaCart", JSON.stringify(cart));
                    updateCartCount();
                    if (window.TaanaBaana?.showToast) {
                        window.TaanaBaana.showToast(`Added ${name} to cart 🛍️`);
                    }
                } catch (e) {}
            }
        };
    });
}

function renderMarketplaceItems(items) {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid || !items || items.length === 0) return;

    productGrid.innerHTML = items.map(item => `
        <article
            class="product-card"
            data-id="${item.id}"
            data-name="${escapeHtml(item.title)}"
            data-category="${(item.category || 'all').toLowerCase()}"
            data-price="${item.price}"
            data-image="${item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85'}"
            data-artisan="${escapeHtml(item.artisan_name || 'Artisan')} · ${escapeHtml(item.artisan_location || 'India')}"
            data-description="${escapeHtml(item.description || '')}"
            data-technique="${escapeHtml(item.craft_technique || '')}"
            data-material="${escapeHtml(item.material || '')}"
        >
            <div class="product-image">
                <img
                    src="${item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85'}"
                    alt="${escapeHtml(item.title)}"
                    loading="lazy"
                >
                <button class="favorite-button" type="button" aria-label="Add to favorites">♡</button>
            </div>

            <div class="product-info">
                <div class="product-category">${escapeHtml((item.category || 'Craft').toUpperCase())}</div>
                <h3 class="product-name">${escapeHtml(item.title)}</h3>
                <p class="product-artisan">${escapeHtml(item.artisan_name || 'Artisan')} · ${escapeHtml(item.artisan_location || 'India')}</p>

                <div class="product-bottom">
                    <span class="product-price">₹${Number(item.price).toLocaleString("en-IN")}</span>
                    <button class="add-cart" type="button" data-add-cart>+</button>
                </div>
            </div>
        </article>
    `).join("");

    bindMarketplaceEvents();
}

async function initSupabaseMarketplace() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    bindMarketplaceEvents();
    updateCartCount();

    try {
        let items = [];

        if (window.TaanaBaana?.supabase) {
            const { data, error } = await window.TaanaBaana.supabase
                .from("marketplace")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data && data.length > 0) {
                items = data;
            }
        }

        if (!items || items.length === 0) {
            const res = await fetch(SUPABASE_REST_URL, {
                headers: { "apikey": SUPABASE_API_KEY }
            });
            if (res.ok) {
                items = await res.json();
            }
        }

        if (items && items.length > 0) {
            renderMarketplaceItems(items);
        }
    } catch (err) {
        console.warn("Marketplace Supabase sync warning:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initSupabaseMarketplace();
});


/* =========================================================
   PUBLISH DEMO
========================================================= */

document
    .querySelectorAll(
        "[data-publish]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                button.textContent =
                    "✓ Published";

                button.disabled =
                    true;

                window.TaanaBaana.showToast(
                    "Your product is now ready to reach buyers 🌐"
                );

            }
        );

    });


/* =========================================================
   SHARE DEMO
========================================================= */

document
    .querySelectorAll(
        "[data-share]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const shareText =
                    "Discover this handcrafted product on Taana-Baana — From Hands to Markets.";


                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share({

                            title:
                                "Taana-Baana",

                            text:
                                shareText

                        });

                    } catch (error) {

                        // User cancelled share.

                    }

                } else {

                    try {

                        await navigator.clipboard.writeText(
                            shareText
                        );

                        window.TaanaBaana.showToast(
                            "Share text copied 📋"
                        );

                    } catch {

                        window.TaanaBaana.showToast(
                            shareText
                        );

                    }

                }

            }
        );

    });


/* =========================================================
   DASHBOARD SIDEBAR
========================================================= */

document
    .querySelectorAll(
        ".dashboard-nav button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".dashboard-nav button"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                button.classList.add(
                    "active"
                );

                const section =
                    button.dataset.section;


                document
                    .querySelectorAll(
                        ".dashboard-tab"
                    )
                    .forEach(
                        tab => {

                            tab.style.display =
                                tab.dataset.tab === section
                                    ? "block"
                                    : "none";

                        }
                    );

            }
        );

    });


/* =========================================================
   DEMO LOGIN / CTA
========================================================= */

document
    .querySelectorAll(
        "[data-demo-login]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                window.TaanaBaana.showToast(
                    "Demo mode activated 👋"
                );

                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );

            }
        );

    });


/* =========================================================
   NUMBER COUNTER
========================================================= */

const counters =
    document.querySelectorAll(
        "[data-counter]"
    );


const counterObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        !entry.isIntersecting
                    )
                        return;


                    const element =
                        entry.target;


                    const target =
                        Number(
                            element.dataset.counter
                        );


                    let current = 0;

                    const increment =
                        target / 50;


                    const timer =
                        setInterval(
                            () => {

                                current +=
                                    increment;


                                if (
                                    current >= target
                                ) {

                                    current =
                                        target;

                                    clearInterval(
                                        timer
                                    );

                                }


                                element.textContent =
                                    Math.floor(
                                        current
                                    ).toLocaleString(
                                        "en-IN"
                                    );

                            },
                            25
                        );


                    counterObserver.unobserve(
                        element
                    );

                }
            );

        }
    );


counters.forEach(
    counter =>
        counterObserver.observe(
            counter
        )
);


/* =========================================================
   READY
========================================================= */

console.log(
    "🧵 Taana-Baana frontend loaded successfully."
);