const viewer = document.getElementById("mapViewer");
const stage = document.getElementById("mapStage");

let scale = 1;
let translateX = 0;
let translateY = 0;

const MIN_SCALE = 0.6;
const MAX_SCALE = 4;

function updateMap() {
    stage.style.transform =
        `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scale})`;

    document.getElementById("resetZoom").textContent =
        `${Math.round(scale * 100)}%`;
}

function zoomIn() {
    scale = Math.min(MAX_SCALE, scale + 0.2);
    updateMap();
}

function zoomOut() {
    scale = Math.max(MIN_SCALE, scale - 0.2);
    updateMap();
}

function resetMap() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateMap();
}

document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
document.getElementById("resetZoom").addEventListener("click", resetMap);

document.getElementById("fullscreenBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        viewer.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
});

/* Mouse / touch drag */
let dragging = false;
let startX = 0;
let startY = 0;
let startTranslateX = 0;
let startTranslateY = 0;

viewer.addEventListener("pointerdown", (event) => {
    dragging = true;
    viewer.classList.add("dragging");

    startX = event.clientX;
    startY = event.clientY;

    startTranslateX = translateX;
    startTranslateY = translateY;

    viewer.setPointerCapture(event.pointerId);
});

viewer.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    translateX = startTranslateX + (event.clientX - startX);
    translateY = startTranslateY + (event.clientY - startY);

    updateMap();
});

viewer.addEventListener("pointerup", (event) => {
    dragging = false;
    viewer.classList.remove("dragging");

    try {
        viewer.releasePointerCapture(event.pointerId);
    } catch (error) {}
});

viewer.addEventListener("pointercancel", () => {
    dragging = false;
    viewer.classList.remove("dragging");
});

/* Mouse wheel zoom */
viewer.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
        zoomIn();
    } else {
        zoomOut();
    }
}, { passive: false });

updateMap();
