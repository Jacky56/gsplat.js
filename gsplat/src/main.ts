import * as SPLAT from "gsplat";

const renderer = new SPLAT.WebGLRenderer();
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, renderer.domElement);
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;

let loading = false;

async function selectFile(file: File) {
    if (loading) return;
    loading = true;
    // Check if .splat file
    if (file.name.endsWith(".splat")) {
        await SPLAT.Loader.LoadFromFileAsync(file, scene, loader);
    } else if (file.name.endsWith(".ply")) {
        const format = "";
        // const format = "polycam"; // Uncomment to load a Polycam PLY file
        await SPLAT.PLYLoader.LoadFromFileAsync(
            file,
            scene,
            loader,
            format,
        );
    }
    loading = false;
}

async function selectUrl(url: string) {
    if (loading) return;
    loading = true;
    // Check if .splat file
    if (url.endsWith(".splat")) {
        await SPLAT.Loader.LoadAsync(url, scene, loader);
    } else if (url.endsWith(".ply")) {
        const format = "";
        // const format = "polycam"; // Uncomment to load a Polycam PLY file
        await SPLAT.PLYLoader.LoadAsync(
            url,
            scene,
            loader,
            format,
        );
    }
    loading = false;
}

function loader(progress: number) {
    progressIndicator.value = progress * 100;
}

async function main() {
    // Load a placeholder scene
    const url = "https://raw.githubusercontent.com/jacky56/gsplat.js/main/point_clouds/boulder2.splat";
    await SPLAT.Loader.LoadAsync(url, scene, () => {});

    // Render loop
    const frame = () => {
        controls.update();
        renderer.render(scene, camera);

        requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);

    try {
    // Listen for file drops
    document.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer != null) {
            selectFile(e.dataTransfer.files[0]);
        }
    });
    
    document.addEventListener("paste", (e) => {
        e.preventDefault();
        e.stopPropagation();
        let url = e.clipboardData?.getData("text").trim();

        if ((url != null) && (url.endsWith(".ply") || url.endsWith(".splat"))) {
            selectUrl(url);
        }
    });
    } catch (error) {
        console.log(error);
    }
}

main();
