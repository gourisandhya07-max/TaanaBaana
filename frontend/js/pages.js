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

    calculatePrice.addEventListener(
        "click",
        () => {

            const material =
                Number(
                    document.getElementById(
                        "materialCost"
                    )?.value
                ) || 0;


            const labour =
                Number(
                    document.getElementById(
                        "labourCost"
                    )?.value
                ) || 0;


            const packaging =
                Number(
                    document.getElementById(
                        "packagingCost"
                    )?.value
                ) || 0;


            const transport =
                Number(
                    document.getElementById(
                        "transportCost"
                    )?.value
                ) || 0;


            const overhead =
                Number(
                    document.getElementById(
                        "overheadCost"
                    )?.value
                ) || 0;


            const profit =
                Number(
                    document.getElementById(
                        "profitMargin"
                    )?.value
                ) || 30;


            const totalCost =
                material +
                labour +
                packaging +
                transport +
                overhead;


            const recommended =
                totalCost *
                (1 + profit / 100);


            const minimum =
                totalCost *
                1.10;


            const premium =
                totalCost *
                1.65;


            document.getElementById(
                "minimumPrice"
            ).textContent =
                formatRupee(minimum);


            document.getElementById(
                "recommendedPrice"
            ).textContent =
                formatRupee(recommended);


            document.getElementById(
                "premiumPrice"
            ).textContent =
                formatRupee(premium);


            const result =
                document.getElementById(
                    "priceResult"
                );


            if (result) {

                result.style.display =
                    "block";

            }


            const reason =
                document.getElementById(
                    "priceReason"
                );


            if (reason) {

                reason.innerHTML = `
                    Your total estimated cost is
                    <strong>
                        ${formatRupee(totalCost)}
                    </strong>.
                    Based on your selected margin,
                    Taana-Baana suggests
                    <strong>
                        ${formatRupee(recommended)}
                    </strong>
                    as a sustainable starting price.
                `;

            }

        }
    );
}


function formatRupee(
    value
) {

    return "₹" +
        Math.round(value)
            .toLocaleString("en-IN");

}


/* =========================================================
   MARKETPLACE FILTER
========================================================= */

const searchInput =
    document.getElementById(
        "productSearch"
    );


const productCards =
    document.querySelectorAll(
        ".product-card"
    );


function filterProducts() {

    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
            : "";


    const activeFilter =
        document
            .querySelector(
                ".filter-button.active"
            );


    const category =
        activeFilter
            ? activeFilter.dataset.category
            : "all";


    productCards.forEach(
        card => {

            const name =
                card.dataset.name
                    ?.toLowerCase() || "";


            const cardCategory =
                card.dataset.category ||
                "all";


            const matchesSearch =
                name.includes(
                    query
                );


            const matchesCategory =
                category === "all" ||
                cardCategory === category;


            card.style.display =
                matchesSearch &&
                matchesCategory
                    ? ""
                    : "none";

        }
    );
}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


document
    .querySelectorAll(
        ".filter-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-button"
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

                filterProducts();

            }
        );

    });


/* =========================================================
   FAVORITES
========================================================= */

document
    .querySelectorAll(
        ".favorite-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const active =
                    button.classList.toggle(
                        "liked"
                    );

                button.textContent =
                    active
                        ? "♥"
                        : "♡";


                window.TaanaBaana.showToast(
                    active
                        ? "Added to favorites ❤️"
                        : "Removed from favorites"
                );

            }
        );

    });


/* =========================================================
   ADD TO CART
========================================================= */

document
    .querySelectorAll(
        "[data-add-cart]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".product-card"
                    );


                const name =
                    card?.dataset.name ||
                    "Handcrafted product";


                const price =
                    card?.dataset.price ||
                    "0";


                window.TaanaBaana.addToCart({

                    name,

                    price,

                    addedAt:
                        new Date()
                            .toISOString()

                });

            }
        );

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