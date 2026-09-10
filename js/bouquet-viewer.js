// Live 3D "Top 3" slider — loads one of assets/3d/kwiaty{1,2,3}.glb into the
// .viewer-block__canvas container, with drag-to-orbit, a gentle idle spin,
// and prev/next/dot controls that swap the model + info panel.
//
// Asset paths are resolved relative to THIS SCRIPT's own URL (via import.meta.url),
// not the page's URL — this file is shared by the root site and by the
// warianty/<name>/ variant pages, which live at a different folder depth, so a
// plain "assets/3d/..." or a root-absolute "/assets/3d/..." path would only be
// correct for one of the two. Resolving from the script itself works from any depth.
const ASSET_BASE = new URL("../assets/3d/", import.meta.url);

const SLIDES = [
  {
    file: new URL("kwiaty1.glb", ASSET_BASE).href,
    rank: "Top 1",
    okaz: "Duży bukiet · wiosna",
    title: "Wiosenna obfitość",
    latin: "Tulipa — ponad 30 tulipanów",
    desc: "Ponad trzydzieści tulipanów w donicy. Bukiet, który sam wypełnia stół — bez dodatkowego wazonu.",
    price: "140 zł",
  },
  {
    file: new URL("kwiaty2.glb", ASSET_BASE).href,
    rank: "Top 2",
    okaz: "Owijany · cały rok",
    title: "Klasyczny tuzin",
    latin: "Rosa — 12 róż, papier rzemieślniczy",
    desc: "Dwanaście czerwonych róż owiniętych w papier rzemieślniczy i spiętych sznurkiem. Prosty wybór, który nigdy nie zawodzi.",
    price: "180 zł",
  },
  {
    file: new URL("kwiaty3.glb", ASSET_BASE).href,
    rank: "Top 3",
    okaz: "Okaz nr 017 · cały rok",
    title: "Czerwień, która nie prosi o pozwolenie",
    latin: "Rosa — ok. 30 róż, paproć",
    desc: "Trzydzieści czerwonych róż związanych w gęstą kopułę, otulonych paprocią. Bukiet, który nie potrzebuje okazji — sam nią jest.",
    price: "320 zł",
  },
];

const container = document.getElementById("bouquet-viewer");
if (container) {
  initViewer(container).catch(function (err) {
    console.error("[bouquet-viewer]", err);
    showFallback(container, "Nie udało się wczytać podglądu 3D. Odśwież stronę lub zobacz katalog poniżej.");
  });
}

function showFallback(container, message) {
  container.innerHTML = "";
  var p = document.createElement("p");
  p.className = "viewer-block__loading mono";
  p.textContent = message;
  container.appendChild(p);
}

function supportsWebGL() {
  try {
    var canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch (e) {
    return false;
  }
}

function disposeObject(root) {
  root.traverse(function (node) {
    if (node.isMesh) {
      if (node.geometry) node.geometry.dispose();
      var materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach(function (mat) {
        if (!mat) return;
        Object.keys(mat).forEach(function (key) {
          var value = mat[key];
          if (value && value.isTexture) value.dispose();
        });
        mat.dispose();
      });
    }
  });
}

async function initViewer(container) {
  if (!supportsWebGL()) {
    showFallback(container, "Twoja przeglądarka nie obsługuje podglądu 3D. Zobacz katalog poniżej.");
    return;
  }

  const [THREE, { OrbitControls }, { GLTFLoader }] = await Promise.all([
    import("three"),
    import("three/addons/controls/OrbitControls.js"),
    import("three/addons/loaders/GLTFLoader.js"),
  ]);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);

  const hemi = new THREE.HemisphereLight(0xf6ecd2, 0x1a2117, 1.1);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe9bd, 2.0);
  key.position.set(2.4, 3.2, 2.6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.55);
  fill.position.set(-2.6, 1.2, -1.8);
  scene.add(fill);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.7;
  controls.rotateSpeed = 0.6;

  const loading = container.querySelector(".viewer-block__loading");
  container.appendChild(renderer.domElement);

  function sizeToContainer() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  sizeToContainer();

  // ---- info panel + controls (may not exist on every page that reuses this script) ----
  const frame = container.closest(".viewer-block__frame") || document;
  const elTitle = frame.querySelector("[data-slide-title]");
  const elLatin = frame.querySelector("[data-slide-latin]");
  const elDesc = frame.querySelector("[data-slide-desc]");
  const elPrice = frame.querySelector("[data-slide-price]");
  const elOkaz = frame.querySelector("[data-slide-okaz]");
  const elRank = frame.querySelector("[data-slide-rank]");
  const dots = Array.from(frame.querySelectorAll(".viewer-block__dot"));
  const prevBtn = frame.querySelector(".viewer-block__arrow--prev");
  const nextBtn = frame.querySelector(".viewer-block__arrow--next");

  function renderInfo(index) {
    const s = SLIDES[index];
    if (elTitle) elTitle.textContent = s.title;
    if (elLatin) elLatin.textContent = s.latin;
    if (elDesc) elDesc.textContent = s.desc;
    if (elPrice) elPrice.textContent = s.price;
    if (elOkaz) elOkaz.textContent = s.okaz;
    if (elRank) elRank.textContent = s.rank;
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
    container.setAttribute(
      "aria-label",
      "Obrotowy podgląd 3D — " + s.title + " — przeciągnij, aby obrócić, przewiń, aby przybliżyć"
    );
  }

  let currentModel = null;
  let currentIndex = -1;
  let loadToken = 0;
  const loader = new GLTFLoader();

  function frameModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    model.position.sub(center);
    model.position.y += size.y * 0.06;

    const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1;
    const dist = radius / Math.sin((camera.fov * Math.PI) / 360) * 1.35;
    camera.position.set(dist * 0.55, dist * 0.42, dist * 0.78);
    camera.near = dist / 100;
    camera.far = dist * 20;
    camera.updateProjectionMatrix();
    controls.target.set(0, size.y * 0.02, 0);
    controls.minDistance = dist * 0.5;
    controls.maxDistance = dist * 1.8;
    controls.update();
  }

  function loadModel(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    const token = ++loadToken;
    const slide = SLIDES[index];

    renderInfo(index);
    renderer.domElement.classList.remove("is-ready");

    loader.load(
      slide.file,
      function (gltf) {
        if (token !== loadToken) return; // a newer slide was requested meanwhile
        if (currentModel) {
          scene.remove(currentModel);
          disposeObject(currentModel);
        }
        currentModel = gltf.scene;
        frameModel(currentModel);
        scene.add(currentModel);
        if (loading) loading.remove();
        renderer.domElement.classList.add("is-ready");
      },
      undefined,
      function (err) {
        console.error("[bouquet-viewer] load error", slide.file, err);
        if (token === loadToken) {
          showFallback(container, "Nie udało się wczytać podglądu 3D. Zobacz katalog poniżej.");
        }
      }
    );
  }

  function goTo(index) {
    const total = SLIDES.length;
    loadModel(((index % total) + total) % total);
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(currentIndex + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () { goTo(i); });
  });

  loadModel(0);

  let running = true;
  document.addEventListener("visibilitychange", function () {
    running = document.visibilityState === "visible";
  });

  function tick() {
    if (running) {
      controls.update();
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  }
  tick();

  if ("ResizeObserver" in window) {
    new ResizeObserver(sizeToContainer).observe(container);
  } else {
    window.addEventListener("resize", sizeToContainer);
  }

  controls.addEventListener("start", function () { controls.autoRotate = false; });
  controls.addEventListener("end", function () {
    if (!reduceMotion) controls.autoRotate = true;
  });
}
