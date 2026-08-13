// =====================================================
// MAP VIEWER
// =====================================================

const viewer = document.getElementById("mapViewer");
const stage = document.getElementById("mapStage");
const mapImage = document.getElementById("mapImage");
const mapTitle = document.getElementById("mapTitle");


// =====================================================
// DAFTAR 2 PETA
// =====================================================

const maps = [
    {
        title: "Peta 1 — Fasilitas Umum Desa Tukadaya",
        image: "assets/peta.jpg",
        alt: "Peta Fasilitas Umum Desa Tukadaya"
    },

    {
        title: "Peta 2 — Peta Desa Tukadaya",
        image: "assets/peta 3.jpg",
        alt: "Peta Desa Tukadaya"
    }
];


// =====================================================
// VARIABEL ZOOM
// =====================================================

let scale = 1;
let translateX = 0;
let translateY = 0;

const MIN_SCALE = 0.6;
const MAX_SCALE = 4;


// =====================================================
// UPDATE POSISI PETA
// =====================================================

function updateMap() {

    stage.style.transform =
        `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scale})`;

    const resetButton = document.getElementById("resetZoom");

    if (resetButton) {
        resetButton.textContent =
            `${Math.round(scale * 100)}%`;
    }
}


// =====================================================
// ZOOM IN
// =====================================================

function zoomIn() {

    scale = Math.min(
        MAX_SCALE,
        scale + 0.2
    );

    updateMap();
}


// =====================================================
// ZOOM OUT
// =====================================================

function zoomOut() {

    scale = Math.max(
        MIN_SCALE,
        scale - 0.2
    );

    updateMap();
}


// =====================================================
// RESET ZOOM DAN POSISI
// =====================================================

function resetMap() {

    scale = 1;

    translateX = 0;
    translateY = 0;

    updateMap();
}


// =====================================================
// TOMBOL ZOOM
// =====================================================

const zoomInButton =
    document.getElementById("zoomIn");

const zoomOutButton =
    document.getElementById("zoomOut");

const resetZoomButton =
    document.getElementById("resetZoom");


if (zoomInButton) {

    zoomInButton.addEventListener(
        "click",
        zoomIn
    );

}


if (zoomOutButton) {

    zoomOutButton.addEventListener(
        "click",
        zoomOut
    );

}


if (resetZoomButton) {

    resetZoomButton.addEventListener(
        "click",
        resetMap
    );

}


// =====================================================
// FULLSCREEN
// =====================================================

const fullscreenButton =
    document.getElementById("fullscreenBtn");


if (fullscreenButton) {

    fullscreenButton.addEventListener(
        "click",
        () => {

            if (!document.fullscreenElement) {

                if (viewer.requestFullscreen) {

                    viewer.requestFullscreen();

                }

            } else {

                if (document.exitFullscreen) {

                    document.exitFullscreen();

                }

            }

        }
    );

}


// =====================================================
// PILIHAN 2 PETA
// =====================================================

const mapTabs =
    document.querySelectorAll(".map-tab");


mapTabs.forEach(
    (tab) => {

        tab.addEventListener(
            "click",
            () => {

                // -----------------------------------------
                // Ambil nomor peta
                // -----------------------------------------

                const mapIndex =
                    parseInt(
                        tab.getAttribute("data-map")
                    );


                console.log(
                    "Peta dipilih:",
                    mapIndex
                );


                // -----------------------------------------
                // Pastikan nomor peta valid
                // -----------------------------------------

                if (
                    isNaN(mapIndex) ||
                    !maps[mapIndex]
                ) {

                    console.error(
                        "Data peta tidak ditemukan:",
                        mapIndex
                    );

                    return;

                }


                const selectedMap =
                    maps[mapIndex];


                // -----------------------------------------
                // Ganti gambar
                // -----------------------------------------

                mapImage.src =
                    selectedMap.image;


                mapImage.alt =
                    selectedMap.alt;


                // -----------------------------------------
                // Ganti judul
                // -----------------------------------------

                mapTitle.textContent =
                    selectedMap.title;


                // -----------------------------------------
                // Ganti tombol aktif
                // -----------------------------------------

                mapTabs.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                // -----------------------------------------
                // Reset zoom dan posisi
                // -----------------------------------------

                resetMap();

            }
        );

    }
);


// =====================================================
// CEK GAMBAR
// =====================================================

mapImage.addEventListener(
    "error",
    () => {

        console.error(
            "Gambar peta tidak ditemukan:",
            mapImage.src
        );

        mapImage.alt =
            "Gambar peta tidak dapat ditemukan";

    }
);


// =====================================================
// MOUSE / TOUCH DRAG
// =====================================================

let dragging = false;

let startX = 0;
let startY = 0;

let startTranslateX = 0;
let startTranslateY = 0;


// -----------------------------------------
// MULAI DRAG
// -----------------------------------------

viewer.addEventListener(
    "pointerdown",
    (event) => {

        // Jangan mengganggu tombol
        if (
            event.target.closest(".map-tab") ||
            event.target.closest("button")
        ) {

            return;

        }


        dragging = true;

        viewer.classList.add(
            "dragging"
        );


        startX =
            event.clientX;

        startY =
            event.clientY;


        startTranslateX =
            translateX;

        startTranslateY =
            translateY;


        try {

            viewer.setPointerCapture(
                event.pointerId
            );

        } catch (error) {

            // Tidak melakukan apa-apa

        }

    }
);


// -----------------------------------------
// SAAT DRAG
// -----------------------------------------

viewer.addEventListener(
    "pointermove",
    (event) => {

        if (!dragging) {

            return;

        }


        translateX =
            startTranslateX +
            (
                event.clientX -
                startX
            );


        translateY =
            startTranslateY +
            (
                event.clientY -
                startY
            );


        updateMap();

    }
);


// -----------------------------------------
// SELESAI DRAG
// -----------------------------------------

viewer.addEventListener(
    "pointerup",
    (event) => {

        dragging = false;

        viewer.classList.remove(
            "dragging"
        );


        try {

            viewer.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {

            // Tidak melakukan apa-apa

        }

    }
);


// -----------------------------------------
// BATAL DRAG
// -----------------------------------------

viewer.addEventListener(
    "pointercancel",
    () => {

        dragging = false;

        viewer.classList.remove(
            "dragging"
        );

    }
);


// =====================================================
// MOUSE WHEEL ZOOM
// =====================================================

viewer.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();


        if (
            event.deltaY < 0
        ) {

            zoomIn();

        } else {

            zoomOut();

        }

    },
    {
        passive: false
    }
);


// =====================================================
// KONDISI AWAL
// =====================================================

updateMap();
