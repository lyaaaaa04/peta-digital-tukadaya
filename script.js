// =====================================================
// MAP VIEWER
// =====================================================

const viewer = document.getElementById("mapViewer");
const stage = document.getElementById("mapStage");
const mapImage = document.getElementById("mapImage");
const mapTitle = document.getElementById("mapTitle");


// =====================================================
// DAFTAR 3 PETA
// =====================================================

const maps = [
    {
        title: "Peta 1 — Fasilitas Umum Desa Tukadaya",
        image: "assets/peta.jpg",
        alt: "Peta Fasilitas Umum Desa Tukadaya"
    },

    {
        title: "Peta 2 — Penggunaan Lahan Desa Tukadaya",
        image: "assets/peta2.jpg",
        alt: "Peta Penggunaan Lahan Desa Tukadaya"
    },

    {
        title: "Peta 3 — Peta Desa Tukadaya",
        image: "assets/peta3.jpg",
        alt: "Peta Desa Tukadaya"
    }
];


// =====================================================
// ZOOM
// =====================================================

let scale = 1;
let translateX = 0;
let translateY = 0;

const MIN_SCALE = 0.6;
const MAX_SCALE = 4;


// =====================================================
// UPDATE MAP
// =====================================================

function updateMap() {

    stage.style.transform =
        `translate(-50%, -50%) 
         translate(${translateX}px, ${translateY}px) 
         scale(${scale})`;

    document.getElementById("resetZoom").textContent =
        `${Math.round(scale * 100)}%`;
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
// RESET ZOOM
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

document
    .getElementById("zoomIn")
    .addEventListener("click", zoomIn);


document
    .getElementById("zoomOut")
    .addEventListener("click", zoomOut);


document
    .getElementById("resetZoom")
    .addEventListener("click", resetMap);


// =====================================================
// FULLSCREEN
// =====================================================

document
    .getElementById("fullscreenBtn")
    .addEventListener("click", () => {

        if (!document.fullscreenElement) {

            viewer.requestFullscreen?.();

        } else {

            document.exitFullscreen?.();

        }

    });


// =====================================================
// PILIHAN 3 PETA
// =====================================================

const mapTabs = document.querySelectorAll(".map-tab");


mapTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        // Ambil nomor peta
        const mapIndex = Number(
            tab.dataset.map
        );

        // Ambil data peta
        const selectedMap = maps[mapIndex];

        // Jika data tidak ditemukan
        if (!selectedMap) return;


        // =============================================
        // GANTI GAMBAR
        // =============================================

        mapImage.src = selectedMap.image;

        mapImage.alt = selectedMap.alt;


        // =============================================
        // GANTI JUDUL
        // =============================================

        mapTitle.textContent =
            selectedMap.title;


        // =============================================
        // UBAH TAB AKTIF
        // =============================================

        mapTabs.forEach((item) => {

            item.classList.remove("active");

        });

        tab.classList.add("active");


        // =============================================
        // RESET POSISI & ZOOM
        // =============================================

        resetMap();

    });

});


// =====================================================
// MOUSE / TOUCH DRAG
// =====================================================

let dragging = false;

let startX = 0;
let startY = 0;

let startTranslateX = 0;
let startTranslateY = 0;


viewer.addEventListener(
    "pointerdown",
    (event) => {

        dragging = true;

        viewer.classList.add("dragging");


        startX = event.clientX;
        startY = event.clientY;


        startTranslateX =
            translateX;

        startTranslateY =
            translateY;


        viewer.setPointerCapture(
            event.pointerId
        );

    }
);


viewer.addEventListener(
    "pointermove",
    (event) => {

        if (!dragging) return;


        translateX =
            startTranslateX +
            (event.clientX - startX);


        translateY =
            startTranslateY +
            (event.clientY - startY);


        updateMap();

    }
);


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


        if (event.deltaY < 0) {

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
