/* ============================================================
   TAANA-BAANA
   AI STUDIO + MULTILINGUAL CATALOG
   FRONTEND DEMO ENGINE
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initImageStudio();
    initVoiceDemo();
    initCatalogGenerator();
    initLanguageTabs();
    initListingActions();

});


/* ============================================================
   UTILITIES
============================================================ */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.taanaToastTimer
    );

    window.taanaToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2600);

}


/* ============================================================
   IMAGE STUDIO
============================================================ */

function initImageStudio() {

    const uploadZone =
        document.getElementById("uploadZone");

    const fileInput =
        document.getElementById("productImage");

    const canvas =
        document.getElementById("imageCanvas");

    const emptyPhoto =
        document.getElementById("emptyPhoto");

    const processing =
        document.getElementById("photoProcessing");

    const developButton =
        document.getElementById("developProduct");

    const enhanceButton =
        document.getElementById("enhancePhoto");

    const resetButton =
        document.getElementById("resetPhoto");

    const brightness =
        document.getElementById("brightness");

    const sharpness =
        document.getElementById("sharpness");


    if (!uploadZone || !fileInput) {
        return;
    }


    let currentImage = null;

    let currentStyle = "natural";


    /* --------------------------------------------
       CLICK UPLOAD
    -------------------------------------------- */

    uploadZone.addEventListener(
        "click",
        () => fileInput.click()
    );


    /* --------------------------------------------
       FILE SELECT
    -------------------------------------------- */

    fileInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;

            loadImage(file);

        }
    );


    /* --------------------------------------------
       DRAG & DROP
    -------------------------------------------- */

    uploadZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            uploadZone.style.transform =
                "scale(1.02)";

        }
    );


    uploadZone.addEventListener(
        "dragleave",
        () => {

            uploadZone.style.transform =
                "";

        }
    );


    uploadZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            uploadZone.style.transform =
                "";

            const file =
                event.dataTransfer.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {

                showToast(
                    "Please choose an image file."
                );

                return;
            }

            loadImage(file);

        }
    );


    /* --------------------------------------------
       LOAD IMAGE
    -------------------------------------------- */

    function loadImage(file) {

        const reader =
            new FileReader();

        reader.onload = event => {

            const image =
                new Image();

            image.onload = () => {

                currentImage = image;

                drawImage();

                if (emptyPhoto) {

                    emptyPhoto.style.display =
                        "none";

                }

                canvas.style.display =
                    "block";

                showToast(
                    "Photograph loaded into the studio."
                );

            };

            image.src =
                event.target.result;

        };

        reader.readAsDataURL(file);

    }


    /* --------------------------------------------
       DRAW IMAGE
    -------------------------------------------- */

    function drawImage() {

        if (!currentImage) return;

        const context =
            canvas.getContext("2d");

        const width =
            canvas.clientWidth || 700;

        const height =
            canvas.clientHeight || 480;


        canvas.width =
            width * window.devicePixelRatio;

        canvas.height =
            height * window.devicePixelRatio;


        context.setTransform(
            window.devicePixelRatio,
            0,
            0,
            window.devicePixelRatio,
            0,
            0
        );


        context.clearRect(
            0,
            0,
            width,
            height
        );


        const scale =
            Math.min(
                width / currentImage.width,
                height / currentImage.height
            );


        const drawWidth =
            currentImage.width * scale;

        const drawHeight =
            currentImage.height * scale;


        const x =
            (width - drawWidth) / 2;

        const y =
            (height - drawHeight) / 2;


        let filter = "";


        const b =
            brightness
                ? Number(brightness.value)
                : 100;


        if (currentStyle === "warm") {

            filter =
                `brightness(${b}%) sepia(18%) saturate(115%)`;

        }

        else if (
            currentStyle === "heritage"
        ) {

            filter =
                `brightness(${b}%) sepia(30%) saturate(85%) contrast(105%)`;

        }

        else if (
            currentStyle === "minimal"
        ) {

            filter =
                `brightness(${b}%) saturate(70%) contrast(105%)`;

        }

        else if (
            currentStyle === "studio"
        ) {

            filter =
                `brightness(${b}%) saturate(105%) contrast(108%)`;

        }

        else {

            filter =
                `brightness(${b}%)`;

        }


        context.filter =
            filter;


        context.drawImage(
            currentImage,
            x,
            y,
            drawWidth,
            drawHeight
        );


        context.filter =
            "none";


        if (
            sharpness &&
            Number(sharpness.value) > 70
        ) {

            context.globalAlpha =
                .07;

            context.drawImage(
                currentImage,
                x - 1,
                y,
                drawWidth,
                drawHeight
            );

            context.globalAlpha =
                1;

        }

    }


    /* --------------------------------------------
       STYLE BUTTONS
    -------------------------------------------- */

    document
        .querySelectorAll(
            ".control-chip"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".control-chip"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                    button.classList.add(
                        "active"
                    );

                    currentStyle =
                        button.dataset.style ||
                        "natural";

                    drawImage();

                    showToast(
                        `${capitalize(currentStyle)} treatment selected.`
                    );

                }
            );

        });


    /* --------------------------------------------
       SLIDERS
    -------------------------------------------- */

    if (brightness) {

        brightness.addEventListener(
            "input",
            drawImage
        );

    }


    if (sharpness) {

        sharpness.addEventListener(
            "input",
            drawImage
        );

    }


    /* --------------------------------------------
       DEVELOP PHOTO
    -------------------------------------------- */

    function developPhoto() {

        if (!currentImage) {

            showToast(
                "Upload a product photograph first."
            );

            return;
        }


        if (!processing) return;


        processing.style.display =
            "grid";


        setTimeout(() => {

            processing.style.display =
                "none";

            drawImage();

            showToast(
                "✦ Your product photograph has been developed."
            );

        }, 1800);

    }


    if (enhanceButton) {

        enhanceButton.addEventListener(
            "click",
            developPhoto
        );

    }


    if (developButton) {

        developButton.addEventListener(
            "click",
            developPhoto
        );

    }


    /* --------------------------------------------
       RESET
    -------------------------------------------- */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                currentImage = null;

                fileInput.value = "";

                canvas.style.display =
                    "none";

                if (emptyPhoto) {

                    emptyPhoto.style.display =
                        "block";

                }

                if (brightness) {

                    brightness.value = 100;

                }

                if (sharpness) {

                    sharpness.value = 50;

                }

                showToast(
                    "Photo studio reset."
                );

            }
        );

    }


    /* --------------------------------------------
       RESIZE
    -------------------------------------------- */

    window.addEventListener(
        "resize",
        () => {

            if (currentImage) {
                drawImage();
            }

        }
    );

}


/* ============================================================
   VOICE DEMO
============================================================ */

function initVoiceDemo() {

    const button =
        document.getElementById(
            "startVoice"
        );

    const textarea =
        document.getElementById(
            "artisanStory"
        );

    const language =
        document.getElementById(
            "voiceLanguage"
        );

    const clear =
        document.getElementById(
            "clearVoice"
        );


    if (!button || !textarea) {
        return;
    }


    let recognition = null;

    let listening = false;


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (SpeechRecognition) {

        recognition =
            new SpeechRecognition();

        recognition.continuous =
            false;

        recognition.interimResults =
            true;


        recognition.onstart = () => {

            listening = true;

            button.innerHTML =
                "⏹ Stop Listening";

            button.style.background =
                "#b9432f";

        };


        recognition.onend = () => {

            listening = false;

            button.innerHTML =
                "🎙 Start Speaking";

            button.style.background =
                "";

        };


        recognition.onerror = () => {

            listening = false;

            button.innerHTML =
                "🎙 Start Speaking";

            button.style.background =
                "";

            showToast(
                "Voice input could not be started. You can type instead."
            );

        };


        recognition.onresult =
            event => {

                let transcript = "";

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    transcript +=
                        event.results[i][0]
                            .transcript;

                }

                textarea.value =
                    transcript;

            };

    }


    button.addEventListener(
        "click",
        () => {

            if (!recognition) {

                showToast(
                    "Voice recognition is not supported in this browser."
                );

                return;
            }


            recognition.lang =
                getSpeechLanguage(
                    language?.value
                );


            if (listening) {

                recognition.stop();

            } else {

                recognition.start();

            }

        }
    );


    if (clear) {

        clear.addEventListener(
            "click",
            () => {

                textarea.value = "";

                showToast(
                    "Story cleared."
                );

            }
        );

    }

}


function getSpeechLanguage(language) {

    const languages = {

        Malayalam: "ml-IN",

        Hindi: "hi-IN",

        Tamil: "ta-IN",

        Telugu: "te-IN",

        Kannada: "kn-IN",

        Bengali: "bn-IN",

        Marathi: "mr-IN",

        English: "en-IN"

    };


    return languages[language] ||
        "en-IN";

}


/* ============================================================
   CATALOG GENERATOR
============================================================ */

function initCatalogGenerator() {

    const button =
        document.getElementById(
            "generateCatalog"
        );

    const story =
        document.getElementById(
            "catalogStory"
        );

    const title =
        document.getElementById(
            "catalogTitle"
        );

    const description =
        document.getElementById(
            "catalogDescription"
        );


    if (!button) return;

    button.addEventListener("click", async () => {
        const text = story?.value.trim();

        if (!text) {
            showToast("Tell us something about your product first.");
            story?.focus();
            return;
        }

        button.disabled = true;
        button.textContent = "✦ Processing with AI Engine...";

        try {
            let generated;
            if (window.TaanaBaana?.apiRequest) {
                generated = await window.TaanaBaana.apiRequest("/api/catalog", {
                    method: "POST",
                    body: JSON.stringify({
                        name: text,
                        category: document.getElementById("craftCategory")?.value || "handicraft",
                        material: text,
                        notes: text
                    })
                });
            }

            if (!generated || !generated.title) {
                generated = generateDemoCatalog(text);
            }

            if (title) title.textContent = generated.title;
            if (description) description.textContent = generated.description;

            showToast("Multilingual AI catalog generated! ✨");
        } catch (err) {
            console.warn("AI Catalog API fallback:", err);
            const fallback = generateDemoCatalog(text);
            if (title) title.textContent = fallback.title;
            if (description) description.textContent = fallback.description;
            showToast("Catalog generated.");
        } finally {
            button.disabled = false;
            button.textContent = "✦ Generate Multilingual Catalog";
        }
    });
}


function generateDemoCatalog(story) {

    const lower =
        story.toLowerCase();


    let title =
        "Handcrafted Heritage Creation";


    let description =
        "A thoughtfully handcrafted piece that brings together traditional Indian craftsmanship, skilled hands and contemporary everyday use.";


    if (
        lower.includes("basket") ||
        lower.includes("bamboo")
    ) {

        title =
            "Handwoven Bamboo Heritage Basket";

        description =
            "A beautifully handcrafted bamboo basket created using traditional weaving techniques. Natural materials, careful handwork and functional design come together in a piece that carries the warmth of Indian craft traditions.";

    }

    else if (
        lower.includes("saree") ||
        lower.includes("sari") ||
        lower.includes("cotton") ||
        lower.includes("handloom")
    ) {

        title =
            "Handwoven Heritage Cotton Saree";

        description =
            "A handcrafted handloom textile created with carefully selected cotton yarn and traditional weaving knowledge. Its distinctive pattern reflects the character of Indian textile traditions while remaining suitable for contemporary use.";

    }

    else if (
        lower.includes("pot") ||
        lower.includes("clay") ||
        lower.includes("ceramic")
    ) {

        title =
            "Handcrafted Traditional Clay Pot";

        description =
            "A handcrafted clay creation shaped by skilled artisan hands. Inspired by traditional pottery practices, this piece celebrates natural texture, organic form and the timeless character of Indian ceramic craft.";

    }

    else if (
        lower.includes("jewel") ||
        lower.includes("necklace") ||
        lower.includes("earring")
    ) {

        title =
            "Artisan Crafted Heritage Jewellery";

        description =
            "A distinctive handcrafted jewellery piece combining traditional design influences with detailed artisan workmanship. Created to carry the individuality and cultural character of handmade Indian craft.";

    }


    return {
        title,
        description
    };

}


/* ============================================================
   LANGUAGE TABS
============================================================ */

function initLanguageTabs() {

    const tabs =
        document.querySelectorAll(
            ".lang-tab"
        );

    const box =
        document.getElementById(
            "translationBox"
        );


    if (!tabs.length || !box) {
        return;
    }


    const content = {

        english: {

            title: "English",

            text:
                "Handcrafted with traditional techniques, carefully selected materials and the unique character of Indian artisan work."

        },


        hindi: {

            title: "हिन्दी",

            text:
                "पारंपरिक तकनीकों, सावधानी से चुनी गई सामग्री और भारतीय हस्तशिल्प की विशेष पहचान के साथ तैयार किया गया हस्तनिर्मित उत्पाद।"

        },


        malayalam: {

            title: "മലയാളം",

            text:
                "പരമ്പരാഗത കൈത്തറി രീതികളും ശ്രദ്ധാപൂർവ്വം തിരഞ്ഞെടുത്ത വസ്തുക്കളും ഉപയോഗിച്ച് ഒരു കലാകാരന്റെ കൈകളാൽ നിർമ്മിച്ച മനോഹരമായ ഉൽപ്പന്നം."

        }

    };


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(item =>
                    item.classList.remove(
                        "active"
                    )
                );

                tab.classList.add(
                    "active"
                );


                const key =
                    tab.dataset.language;

                const selected =
                    content[key];

                if (!selected) return;


                box.innerHTML = `

                    <h3>
                        ${selected.title}
                    </h3>

                    <p>
                        ${selected.text}
                    </p>

                `;

            }
        );

    });

}


/* ============================================================
   LISTING ACTIONS
============================================================ */

function initListingActions() {

    const approve =
        document.getElementById(
            "approveListing"
        );

    const regenerate =
        document.getElementById(
            "regenerateListing"
        );

    const approveCatalog =
        document.getElementById(
            "approveCatalog"
        );

    const copyCatalog =
        document.getElementById(
            "copyCatalog"
        );


    if (approve) {

        approve.addEventListener(
            "click",
            () => {

                showToast(
                    "✓ Listing approved and saved to your workspace."
                );

            }
        );

    }


    if (regenerate) {

        regenerate.addEventListener(
            "click",
            () => {

                showToast(
                    "✦ Creating another version..."
                );

            }
        );

    }


    if (approveCatalog) {

        approveCatalog.addEventListener(
            "click",
            () => {

                showToast(
                    "✓ Catalog approved and saved."
                );

            }
        );

    }


    if (copyCatalog) {

        copyCatalog.addEventListener(
            "click",
            async () => {

                const title =
                    document.getElementById(
                        "catalogTitle"
                    )?.textContent ||
                    "";

                const description =
                    document.getElementById(
                        "catalogDescription"
                    )?.textContent ||
                    "";


                const text =
                    `${title}\n\n${description}`;


                try {

                    await navigator.clipboard.writeText(
                        text
                    );

                    showToast(
                        "Catalog copied to clipboard."
                    );

                }

                catch {

                    showToast(
                        "Select and copy the catalog manually."
                    );

                }

            }
        );

    }

}


/* ============================================================
   HELPER
============================================================ */

function capitalize(value) {

    if (!value) return "";

    return value.charAt(0).toUpperCase() +
        value.slice(1);

}