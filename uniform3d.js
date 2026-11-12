/**
 * BBM Senior Section uniform and badge viewer.
 * Badge planner selections are rendered on the wearer's right and left armlets.
 */

(function () {
  'use strict';

  const FIT_ZOOM = 25;
  const ZOOM_STEP = 5;
  const SKIN_COLOR = 0xa97f65;

  // ── Global namespace for the 3D Viewer ──
  window.BBMUniform3D = {
    initialized: false,
    isOpen: false,
    state: {
      rank: null,
      gender: 'male', // 'male' (President's Man) | 'female' (President's Woman)
      capVisible: true,
      haversackVisible: true,
      tieVisible: false,
      beltVisible: true,
      nametagVisible: true,
      zoomPercent: FIT_ZOOM,
      currentView: 'front'
    },
    open: openViewer,
    close: closeViewer,
    syncFromPlanner: syncFromPlanner,
    setView: setCameraView,
    setRank: setRank,
    applyPresidentLoadout: applyPresidentLoadout
  };

  // ── Three.js core references ──
  let scene, camera, renderer;
  let viewAngle = 0, viewHeight = 0.94;
  let animFrameId = null;
  let mannequinGroup, uniformGroup;
  let rightArmlet, leftArmlet;
  let nametagMesh, nametagCanvas, nametagCtx, nametagTex;
  let capGroup, haversackGroup, tieGroup, beltGroup, lanyardGroup, sashGroup;
  let rolledCuffGroup, longSleeveGroup, dayCollarGroup, ceremonialCollarGroup;
  let sashMat; // shared sash cloth material (red = Sergeant, blue = Staff Sergeant)
  let zoomInput, zoomValue, zoomOutButton, zoomInButton;
  let femaleHairGroup;

  // Image cache
  const imageCache = {};

  const UNIFORM_BOTTOM = 0.05;
  const UNIFORM_TOP = 1.86;
  const CAMERA_PRESET_VIEWS = {
    front: { angle: 0, y: 0.94, offset: 0, height: 2.38, width: 0.88 },
    back: { angle: Math.PI, y: 0.94, offset: 0, height: 2.38, width: 0.88 },
    rightArm: { angle: -Math.PI / 2, y: 1.27, offset: 0.37, height: 0.49, width: 0.27 },
    leftArm: { angle: Math.PI / 2, y: 1.27, offset: 0.37, height: 0.49, width: 0.27 }
  };

  let badgeAssetsReady;
  function preloadBadgeAssets() {
    badgeAssetsReady ??= Promise.all(
      [...Object.values(RIGHT_IMAGES), ...Object.values(LEFT_IMAGES)].map(url => new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          imageCache[url] = img;
          resolve();
        };
        img.onerror = () => {
          console.warn('[3D Viewer] Could not load badge image:', url);
          resolve();
        };
        img.src = url;
      }))
    );
    return badgeAssetsReady;
  }

  /* ══════════════════════════════════════════════════════════
     INITIALIZATION & DOM EVENT BINDINGS
  ══════════════════════════════════════════════════════════ */
  function initDOM() {
    const openBtn = document.getElementById('arm-3d-btn');
    const closeBtn = document.getElementById('uniform-3d-close');
    const modal = document.getElementById('uniform-3d-modal');
    const syncBtn = document.getElementById('u3d-sync-btn');
    const fullscreenBtn = document.getElementById('u3d-fullscreen-btn');
    zoomInput = document.getElementById('u3d-zoom');
    zoomValue = document.getElementById('u3d-zoom-value');
    zoomOutButton = document.getElementById('u3d-zoom-out');
    zoomInButton = document.getElementById('u3d-zoom-in');
    zoomInput.addEventListener('input', () => setZoom(zoomInput.valueAsNumber));
    zoomOutButton.addEventListener('click', () => stepZoom(-1));
    zoomInButton.addEventListener('click', () => stepZoom(1));
    document.getElementById('u3d-fit').addEventListener('click', () => {
      setZoom(FIT_ZOOM);
      setCameraView(window.BBMUniform3D.state.currentView);
    });

    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openViewer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeViewer);
    }

    if (modal) {
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeViewer();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && window.BBMUniform3D.isOpen) {
        closeViewer();
      }
    });

    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        syncFromPlanner();
        flashFeedback(syncBtn, 'Synced!');
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // ── Three Specific Preset Angle Toggles (Instant snap) ──
    document.querySelectorAll('.u3d-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        setCameraView(view);
      });
    });

    // Rank selector pills in the side panel
    document.querySelectorAll('.u3d-rank-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const rank = btn.dataset.rank === 'none' ? null : btn.dataset.rank;
        setRank(rank, true);
      });
    });

    // Single preset: Example of a President's Badge Achiever
    const exampleBtn = document.getElementById('u3d-loadout-example');
    if (exampleBtn) {
      exampleBtn.addEventListener('click', () => {
        applyPresidentLoadout();
        flashFeedback(exampleBtn, 'Example loaded!');
      });
    }

    // Accessories toggles
    setupCheckboxToggle('u3d-tog-cap', (val) => {
      window.BBMUniform3D.state.capVisible = val;
      if (capGroup) capGroup.visible = val;
    });

    setupCheckboxToggle('u3d-tog-haversack', (val) => {
      window.BBMUniform3D.state.haversackVisible = val;
      if (haversackGroup) haversackGroup.visible = val;
    });

    setupCheckboxToggle('u3d-tog-tie', (val) => {
      window.BBMUniform3D.state.tieVisible = val;
      updateDressConfiguration();
    });

    setupCheckboxToggle('u3d-tog-belt', (val) => {
      window.BBMUniform3D.state.beltVisible = val;
      if (beltGroup) beltGroup.visible = val;
    });

    setupCheckboxToggle('u3d-tog-lanyard', (val) => {
      window.BBMUniform3D.state.lanyardVisible = val;
      lanyardToggleOn = val;
      refreshLanyardVisibility();
    });

    setupCheckboxToggle('u3d-tog-nametag', (val) => {
      window.BBMUniform3D.state.nametagVisible = val;
      if (nametagMesh) nametagMesh.visible = val;
      updateLinkBadgeVisibility();
    });

    const clearBadgesBtn = document.getElementById('u3d-clear-badges');
    if (clearBadgesBtn) {
      clearBadgesBtn.addEventListener('click', clearAllBadges);
    }

    // Auto-sync with BadgeState
    if (window.BadgeState && typeof window.BadgeState.subscribe === 'function') {
      window.BadgeState.subscribe(() => {
        if (window.BBMUniform3D.isOpen) {
          syncFromPlanner();
        }
      });
    }

    const plannerTag = document.getElementById('nametag');
    if (plannerTag) {
      new MutationObserver(syncNametagFromPlanner).observe(plannerTag, {
        attributes: true, attributeFilter: ['class'], childList: true,
        characterData: true, subtree: true
      });
      syncNametagFromPlanner();
    }

    const viewport = document.getElementById('u3d-canvas-container');
    if (viewport) new ResizeObserver(onWindowResize).observe(viewport);
  }

  function setupCheckboxToggle(id, callback) {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('change', () => callback(input.checked));
  }

  function flashFeedback(elem, text) {
    const origHTML = elem.innerHTML;
    elem.innerHTML = `<i class="fa-solid fa-check"></i> <span>${text}</span>`;
    elem.style.borderColor = 'var(--gold)';
    setTimeout(() => {
      elem.innerHTML = origHTML;
      elem.style.borderColor = '';
    }, 1400);
  }

  /* ══════════════════════════════════════════════════════════
     MODAL OPEN / CLOSE & FULLSCREEN
  ══════════════════════════════════════════════════════════ */
  function openViewer() {
    const modal = document.getElementById('uniform-3d-modal');
    if (!modal) return;

    if (window.BBMUniform3D.isOpen) return;
    modal.classList.add('open');
    document.getElementById('uniform-3d-close')?.focus();
    window.BBMUniform3D.isOpen = true;
    document.body.style.overflow = 'hidden';

    if (!window.BBMUniform3D.initialized) {
      preloadBadgeAssets().then(() => {
        if (!window.BBMUniform3D.isOpen || window.BBMUniform3D.initialized) return;
        initThreeScene();
        syncFromPlanner();
      });
    } else {
      onWindowResize();
      syncFromPlanner();
    }

    if (!animFrameId) {
      animate();
    }
  }

  function closeViewer() {
    const modal = document.getElementById('uniform-3d-modal');
    if (!modal) return;

    modal.classList.remove('open');
    document.getElementById('arm-3d-btn')?.focus();
    window.BBMUniform3D.isOpen = false;
    document.body.style.overflow = '';

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function toggleFullscreen() {
    const modal = document.getElementById('uniform-3d-modal');
    if (!modal) return;
    modal.classList.toggle('u3d-fullscreen');
  }

  /* ══════════════════════════════════════════════════════════
     THREE.JS SETUP & DAYLIGHT RENDERING
  ══════════════════════════════════════════════════════════ */
  function initThreeScene() {
    const container = document.getElementById('u3d-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.error('Three.js is not loaded.');
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, width / height, 0.05, 50);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Drag, rotate and zoom directly on the canvas.
    bindViewerGestures(renderer.domElement);

    // 5. Lighting
    setupLighting();

    // 6. Pedestal
    createPedestal();

    // 7. Groups
    mannequinGroup = new THREE.Group();
    uniformGroup = new THREE.Group();
    scene.add(mannequinGroup);
    scene.add(uniformGroup);

    // 8. Build the mannequin and dress it in the reference uniform
    buildMannequin();
    buildUniform();
    setCameraView(window.BBMUniform3D.state.currentView);
    setZoom(window.BBMUniform3D.state.zoomPercent);

    const loading = document.getElementById('u3d-loading');
    if (loading) loading.style.display = 'none';

    window.BBMUniform3D.initialized = true;
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaf2, 1.40);
    dirLight.position.set(2.5, 4.0, 3.0);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.camera.left = -1.25;
    dirLight.shadow.camera.right = 1.25;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -0.8;
    dirLight.shadow.bias = -0.00002;
    dirLight.shadow.normalBias = 0.001;
    dirLight.shadow.camera.updateProjectionMatrix();
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe8efff, 0.85);
    fillLight.position.set(-3.0, 2.5, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe8eefb, 0.45);
    rimLight.position.set(0, 3.0, -3.5);
    scene.add(rimLight);
  }

  function createPedestal() {
    const pedGroup = new THREE.Group();

    const podium = new THREE.Mesh(
      new THREE.CylinderGeometry(0.43, 0.45, 0.028, 64),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0x353d4b).convertSRGBToLinear(), roughness: 0.85 })
    );
    podium.position.y = 0.049;
    podium.receiveShadow = true;
    pedGroup.add(podium);

    scene.add(pedGroup);
  }

  /* ══════════════════════════════════════════════════════════
     BODY SHAPE HELPERS
     The torso is a smooth "super-ellipse" loft (flatter chest, rounded
     sides) so every garment detail can sit flush on the surface.
     NOTE: the wearer's RIGHT side is on the viewer's LEFT (-X) when
     looking at the front, exactly like the reference photo.
  ══════════════════════════════════════════════════════════ */
  const ARM_CENTER_X = 0.265;
  const SR = -1; // wearer's right side (rank / proficiency badges)
  const SL = 1;  // wearer's left side (awards, name tag, lanyard)
  const TORSO_P = 2.6;
  const TORSO_PROFILE = [
    [0.90, 0.176], [1.02, 0.178], [1.12, 0.184], [1.25, 0.192],
    [1.34, 0.202], [1.40, 0.208], [1.44, 0.198], [1.47, 0.160],
    [1.495, 0.098], [1.52, 0.074], [1.62, 0.072]
  ];

  function setAttr(geo, name, arr, size) {
    const attr = new THREE.Float32BufferAttribute(arr, size);
    if (geo.setAttribute) geo.setAttribute(name, attr); else geo.addAttribute(name, attr);
  }

  function torsoR(y) {
    const P = TORSO_PROFILE;
    if (y <= P[0][0]) return P[0][1];
    for (let i = 1; i < P.length; i++) {
      if (y <= P[i][0]) {
        let t = (y - P[i - 1][0]) / (P[i][0] - P[i - 1][0]);
        t = t * t * (3 - 2 * t);
        return P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t;
      }
    }
    return P[P.length - 1][1];
  }
  function torsoAB(y) { const r = torsoR(y); return { a: r * 1.22, b: r * 0.76 }; }
  function shirtAB(y) {
    const ab = torsoAB(y);
    const k = 1 + 0.012 * Math.exp(-Math.pow((y - 1.075) / 0.03, 2))
      + (y < 1.18 ? 0.002 * Math.sin(y * 75) : 0);
    return { a: ab.a * k, b: ab.b * k };
  }
  function torsoF(x, y, z) {
    const ab = torsoAB(y);
    return Math.pow(Math.abs(x) / ab.a, TORSO_P) + Math.pow(Math.abs(z) / ab.b, TORSO_P);
  }
  function torsoFrontZ(x, y) {
    const ab = torsoAB(y);
    const t = Math.min(Math.abs(x) / ab.a, 0.985);
    return ab.b * Math.pow(1 - Math.pow(t, TORSO_P), 1 / TORSO_P);
  }
  function torsoSurfaceY(x, z) {
    for (let y = 1.58; y > 0.95; y -= 0.002) {
      if (torsoF(x, y, z) <= 1) return y;
    }
    return 1.45;
  }
  function torsoNormal(x, y, z) {
    const e = 0.004;
    let nx = torsoF(x + e, y, z) - torsoF(x - e, y, z);
    let ny = torsoF(x, y + e, z) - torsoF(x, y - e, z);
    let nz = torsoF(x, y, z + e) - torsoF(x, y, z - e);
    const l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (l < 1e-9) return [0, 0, z >= 0 ? 1 : -1];
    return [nx / l, ny / l, nz / l];
  }
  // Slope of the torso front at x (used to tilt flat details so they lie flush)
  function torsoFrontAngle(x, y) {
    const e = 0.004;
    const dz = (torsoFrontZ(x + e, y) - torsoFrontZ(x - e, y)) / (2 * e);
    return Math.atan(-dz);
  }

  function fixLoftSeam(geo, rings, segs) {
    const n = geo.attributes.normal;
    if (!n) return;
    for (let i = 0; i <= rings; i++) {
      const a = i * (segs + 1), b = a + segs;
      const x = (n.getX(a) + n.getX(b)) / 2, y = (n.getY(a) + n.getY(b)) / 2, z = (n.getZ(a) + n.getZ(b)) / 2;
      n.setXYZ(a, x, y, z);
      n.setXYZ(b, x, y, z);
    }
    n.needsUpdate = true;
  }

  // Smooth loft of super-ellipse rings: fn(y) -> {a, b}
  function makeLoft(fn, y0, y1, rings, segs) {
    const pos = [], uv = [], idx = [];
    const e = 2 / TORSO_P;
    for (let i = 0; i <= rings; i++) {
      const v = i / rings, y = y0 + (y1 - y0) * v, ab = fn(y);
      for (let j = 0; j <= segs; j++) {
        const t = j / segs * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
        pos.push(ab.a * Math.sign(c) * Math.pow(Math.abs(c), e), y, ab.b * Math.sign(s) * Math.pow(Math.abs(s), e));
        uv.push(j / segs, v);
      }
    }
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segs; j++) {
        const a = i * (segs + 1) + j, b = a + segs + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    setAttr(geo, 'position', pos, 3);
    setAttr(geo, 'uv', uv, 2);
    geo.setIndex(idx);
    geo.computeVertexNormals();
    fixLoftSeam(geo, rings, segs);
    return geo;
  }

  // Flat ribbon that hugs the torso (haversack strap, sash, tie)
  function makeRibbonGeo(points, widths) {
    const n = points.length, pos = [], uv = [], idx = [];
    for (let i = 0; i < n; i++) {
      const p = points[i];
      const p0 = points[Math.max(0, i - 1)], p1 = points[Math.min(n - 1, i + 1)];
      let tx = p1[0] - p0[0], ty = p1[1] - p0[1], tz = p1[2] - p0[2];
      const tl = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
      tx /= tl; ty /= tl; tz /= tl;
      const nr = torsoNormal(p[0], p[1], p[2]);
      let wx = ty * nr[2] - tz * nr[1], wy = tz * nr[0] - tx * nr[2], wz = tx * nr[1] - ty * nr[0];
      const wl = Math.sqrt(wx * wx + wy * wy + wz * wz) || 1;
      const hw = widths[i] / 2 / wl;
      pos.push(p[0] - wx * hw, p[1] - wy * hw, p[2] - wz * hw);
      pos.push(p[0] + wx * hw, p[1] + wy * hw, p[2] + wz * hw);
      uv.push(0, i / (n - 1), 1, i / (n - 1));
    }
    for (let i = 0; i < n - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, c, b, b, c, d);
    }
    const geo = new THREE.BufferGeometry();
    setAttr(geo, 'position', pos, 3);
    setAttr(geo, 'uv', uv, 2);
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }

  // Path of a cross-strap: starts at the belt (front), over the RIGHT shoulder, down the back.
  // offFront(y) / offBack(y) give the height above the cloth.
  function crossStrapPoints(offFront, offBack) {
    const hipX = SL * 0.203, hipY = 1.0;
    const shX = SR * 0.187, shY = 1.455;
    const pts = [];
    const nF = 96;
    for (let i = 0; i <= nF; i++) {
      const t = i / nF;
      const x = hipX + (shX - hipX) * t, y = hipY + (shY - hipY) * t;
      pts.push([x, y, torsoFrontZ(x, y) + offFront(y)]);
    }
    const zs = torsoFrontZ(shX, shY);
    const nS = 16;
    for (let k = 1; k < nS; k++) {
      const ang = Math.PI * (k / nS);
      const cs = Math.cos(ang);
      const zc = zs * cs;
      const y = torsoSurfaceY(shX, zc * 0.995) + 0.010;
      pts.push([shX, y, zc + cs * (cs >= 0 ? offFront(shY) : offBack(shY))]);
    }
    for (let i = nF; i >= 0; i--) {
      const t = i / nF;
      const x = hipX + (shX - hipX) * t, y = hipY + (shY - hipY) * t;
      pts.push([x, y, -(torsoFrontZ(x, y) + offBack(y))]);
    }
    return pts;
  }

  function makeColorTexture(canvas) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return texture;
  }

  // All sleeve layers use the same arm centerline. Texture center faces outward.
  function makeArmSurface(side, halfAngle, top, bottom, radiusAt, rows = 18, cols = 32, tip = 0) {
    const positions = [], uvs = [], indices = [];
    for (let i = 0; i <= rows; i++) {
      const v = i / rows;
      for (let j = 0; j <= cols; j++) {
        const u = j / cols;
        const across = 2 * u - 1;
        const angle = across * halfAngle;
        const y = top + (bottom - top - tip * (1 - Math.abs(across))) * v;
        const radius = radiusAt(y);
        positions.push(side * (ARM_CENTER_X + radius * Math.cos(angle)), y, -side * radius * Math.sin(angle));
        uvs.push(u, 1 - v);
      }
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const a = i * (cols + 1) + j, b = a + cols + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    setAttr(geometry, 'position', positions, 3);
    setAttr(geometry, 'uv', uvs, 2);
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    if (halfAngle === Math.PI) fixLoftSeam(geometry, rows, cols);
    return geometry;
  }

  function radiusFromProfile(y, profile) {
    for (let i = 1; i < profile.length; i++) {
      const [top, topRadius] = profile[i - 1];
      const [bottom, bottomRadius] = profile[i];
      if (y >= bottom) {
        const blend = Math.min(1, (y - bottom) / (top - bottom));
        return bottomRadius + blend * (topRadius - bottomRadius);
      }
    }
    return profile[profile.length - 1][1];
  }

  /* ══════════════════════════════════════════════════════════
     MANNEQUIN BODY MODELING (attention stance)
  ══════════════════════════════════════════════════════════ */
  function buildMannequin() {
    const skinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(SKIN_COLOR).convertSRGBToLinear(),
      roughness: 0.84,
      metalness: 0.01,
      side: THREE.DoubleSide
    });
    const faceProfile = [
      [-0.128, 0.003, 0.026, -0.003],
      [-0.114, 0.035, 0.052, 0.01],
      [-0.092, 0.062, 0.066, 0.009],
      [-0.061, 0.079, 0.079, 0.004],
      [-0.024, 0.089, 0.09, 0.0],
      [0.014, 0.094, 0.095, -0.002],
      [0.048, 0.095, 0.098, -0.004],
      [0.078, 0.08, 0.087, -0.006],
      [0.103, 0.052, 0.063, -0.006],
      [0.117, 0.001, 0.001, -0.006]
    ];
    const faceAt = (y) => {
      for (let i = 1; i < faceProfile.length; i++) {
        if (y <= faceProfile[i][0]) {
          const previous = faceProfile[i - 1],
            next = faceProfile[i];
          const t = Math.max(0, (y - previous[0]) / (next[0] - previous[0]));
          return previous.slice(1).map((value, j) => value + (next[j + 1] - value) * t);
        }
      }
      return faceProfile[faceProfile.length - 1].slice(1);
    };
    const faceZ = (x, y) => {
      const [width, depth, offset] = faceAt(y);
      return offset + depth * Math.sqrt(Math.max(0, 1 - Math.pow(x / width, 2)));
    };
    const headGeo = makeLoft(
      (y) => {
        const [width, depth] = faceAt(y);
        return { a: width, b: depth };
      },
      -0.128,
      0.117,
      36,
      40
    );
    const headVertices = headGeo.attributes.position;
    // Round the temples and jaw independently of the uniform's broader torso loft.
    for (let i = 0; i < headVertices.count; i++) {
      const y = headVertices.getY(i),
        [width, depth, offset] = faceAt(y);
      const angle = ((i % 41) / 40) * Math.PI * 2;
      headVertices.setXYZ(i, width * Math.cos(angle), y, depth * Math.sin(angle) + offset);
    }
    headGeo.computeVertexNormals();
    fixLoftSeam(headGeo, 36, 40);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.name = 'attentionHead';
    head.position.set(0, 1.68, 0.004);
    head.castShadow = true;
    mannequinGroup.add(head);

    const featureMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x33251f).convertSRGBToLinear(),
      roughness: 0.94
    });
    const lipMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x775349).convertSRGBToLinear(),
      roughness: 0.92
    });
    const scleraMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xbcb4a5).convertSRGBToLinear(),
      roughness: 0.76
    });
    const eyeGeo = new THREE.SphereGeometry(1, 14, 8);
    const irisGeo = new THREE.SphereGeometry(1, 10, 8);
    for (const side of [SR, SL]) {
      const x = side * 0.033,
        y = 0.015,
        z = faceZ(x, y);
      const eye = new THREE.Mesh(eyeGeo, scleraMat);
      eye.scale.set(0.0112, 0.0033, 0.0026);
      eye.position.set(x, y, z + 0.0005);
      eye.rotation.y = side * 0.34;
      head.add(eye);
      const iris = new THREE.Mesh(irisGeo, featureMat);
      iris.scale.set(0.0032, 0.003, 0.001);
      iris.position.set(x + side * 0.0009, y, z + 0.0045);
      iris.rotation.y = side * 0.34;
      head.add(iris);
      const upperLid = [
        [x - 0.011, y, faceZ(x - 0.011, y) + 0.0015],
        [x, y + 0.003, z + 0.0025],
        [x + 0.011, y, faceZ(x + 0.011, y) + 0.0015]
      ];
      head.add(makeSeam(upperLid, skinMat, 0.0013));
      const brow = [];
      for (let i = 0; i < 5; i++) {
        const bx = x + (i / 4 - 0.5) * 0.024;
        const by = 0.029 + 0.0025 * Math.sin((i / 4) * Math.PI);
        brow.push([bx, by, faceZ(bx, by) + 0.0012]);
      }
      head.add(makeSeam(brow, featureMat, 0.0014));
    }

    // A small bridge and rounded tip read as a nose without exaggerating the face.
    const bridgeGeo = new THREE.SphereGeometry(1, 14, 10);
    bridgeGeo.scale(0.0073, 0.023, 0.01);
    const bridge = new THREE.Mesh(bridgeGeo, skinMat);
    bridge.position.set(0, 0.001, 0.094);
    bridge.rotation.x = -0.16;
    head.add(bridge);
    const tipGeo = new THREE.SphereGeometry(1, 14, 10);
    tipGeo.scale(0.011, 0.008, 0.011);
    const tip = new THREE.Mesh(tipGeo, skinMat);
    tip.position.set(0, -0.019, 0.102);
    head.add(tip);
    const mouth = [];
    for (let i = 0; i < 9; i++) {
      const x = (i / 8 - 0.5) * 0.037;
      const y = -0.051 - 0.0012 * Math.cos((x / 0.0185) * Math.PI);
      mouth.push([x, y, faceZ(x, y) + 0.0011]);
    }
    head.add(makeSeam(mouth, lipMat, 0.0011));

    const earGeo = new THREE.SphereGeometry(1, 12, 10);
    earGeo.scale(0.01, 0.025, 0.016);
    for (const side of [SR, SL]) {
      const ear = new THREE.Mesh(earGeo, skinMat);
      ear.position.set(side * 0.092, -0.003, -0.004);
      ear.rotation.z = -side * 0.08;
      ear.castShadow = true;
      head.add(ear);
    }

    // Close-cropped hair follows the rear and temples beneath the cap's lower edge.
    const hairPositions = [],
      hairIndices = [];
    const hairRows = 20,
      hairSegments = 40;
    for (let row = 0; row <= hairRows; row++) {
      for (let column = 0; column <= hairSegments; column++) {
        const angle = 0.8 + (column / hairSegments) * (Math.PI * 2 - 1.6);
        const bottom = -0.015 + (0.048 * (Math.cos(angle) + 1)) / 2;
        const y = bottom + ((0.105 - bottom) * row) / hairRows;
        const [width, depth, offset] = faceAt(y);
        hairPositions.push((width + 0.003) * Math.sin(angle), y, (depth + 0.003) * Math.cos(angle) + offset);
      }
    }
    for (let row = 0; row < hairRows; row++) {
      for (let column = 0; column < hairSegments; column++) {
        const a = row * (hairSegments + 1) + column,
          b = a + hairSegments + 1;
        hairIndices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    const hairGeo = new THREE.BufferGeometry();
    setAttr(hairGeo, 'position', hairPositions, 3);
    hairGeo.setIndex(hairIndices);
    hairGeo.computeVertexNormals();
    const hair = new THREE.Mesh(hairGeo, featureMat);
    hair.name = 'croppedHair';
    head.add(hair);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.062, 0.13, 28), skinMat);
    neck.position.set(0, 1.545, -0.004);
    neck.castShadow = true;
    mannequinGroup.add(neck);

    // Preserve the shared arm centerline and forearm dimensions used by the sleeves.
    const armProfile = [
      [1.16, 0.049],
      [1.11, 0.052],
      [1.065, 0.049],
      [1.01, 0.044],
      [0.94, 0.034],
      [0.88, 0.024],
      [0.86, 0.023]
    ];
    for (const side of [SR, SL]) {
      const forearm = new THREE.Mesh(
        makeArmSurface(side, Math.PI, 1.16, 0.86, (y) => radiusFromProfile(y, armProfile)),
        skinMat
      );
      forearm.castShadow = true;
      mannequinGroup.add(forearm);
      buildHand(side, skinMat);
    }
  }

  function buildHand(side, skinMat) {
    const fist = new THREE.Group();
    fist.name = side === SR ? 'rightFist' : 'leftFist';
    fist.position.set(side * ARM_CENTER_X, 0.833, 0);
    const palmProfile = [
      [0.03, 0.018, 0.022],
      [0.018, 0.021, 0.027],
      [-0.008, 0.0205, 0.027],
      [-0.028, 0.017, 0.023],
      [-0.039, 0.009, 0.013],
      [-0.043, 0.001, 0.001]
    ];
    const sectionAt = (y) => {
      for (let i = 1; i < palmProfile.length; i++) {
        if (y >= palmProfile[i][0]) {
          const a = palmProfile[i - 1],
            b = palmProfile[i];
          const t = Math.max(0, Math.min(1, (a[0] - y) / (a[0] - b[0])));
          return { a: a[1] + (b[1] - a[1]) * t, b: a[2] + (b[2] - a[2]) * t };
        }
      }
      return { a: 0.001, b: 0.001 };
    };
    // The palm is a tapered, flattened volume continuous with the sleeve's wrist.
    const palm = new THREE.Mesh(makeLoft(sectionAt, -0.043, 0.03, 20, 24), skinMat);
    palm.castShadow = true;
    fist.add(palm);

    // Closely folded fingers sit against the palm instead of reading as separate balls.
    const fingerGeo = new THREE.SphereGeometry(1, 12, 10);
    for (let finger = 0; finger < 4; finger++) {
      const curl = new THREE.Mesh(fingerGeo, skinMat);
      curl.name = ['indexFinger', 'middleFinger', 'ringFinger', 'littleFinger'][finger];
      const length = [0.021, 0.022, 0.02, 0.017][finger];
      curl.scale.set(0.0071, length, 0.0078);
      curl.position.set(side * 0.0185, -0.013 + finger * 0.0013, 0.021 - finger * 0.0134);
      curl.rotation.z = side * 0.035;
      curl.castShadow = true;
      fist.add(curl);
    }

    // The straight thumb lies down the inside/front edge, parallel to the trouser seam.
    const thumbGeo = makeLoft(
      (y) => {
        const u = (y + 0.028) / 0.052;
        const radius =
          0.0002 + 0.0071 * Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.55) + 0.003 * Math.pow(u, 5);
        return { a: radius, b: radius * 1.18 };
      },
      -0.028,
      0.024,
      14,
      16
    );
    const thumb = new THREE.Mesh(thumbGeo, skinMat);
    thumb.name = 'thumb';
    thumb.position.set(-side * 0.02, -0.004, 0.02);
    thumb.rotation.z = side * 0.035;
    thumb.castShadow = true;
    fist.add(thumb);
    mannequinGroup.add(fist);
  }

  function makeTwillBump() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const pixels = ctx.createImageData(128, 128);
    for (let y = 0; y < 128; y++) {
      for (let x = 0; x < 128; x++) {
        const offset = (y * 128 + x) * 4;
        const thread = (x + y) % 4 < 2 ? 138 : 118;
        pixels.data.set([thread, thread, thread, 255], offset);
      }
    }
    ctx.putImageData(pixels, 0, 0);
    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(48, 28);
    map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return map;
  }

  function makeDaylightReflections() {
    const faces = Array.from({ length: 6 }, (_, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const sky = ctx.createLinearGradient(0, 0, 0, 128);
      sky.addColorStop(0, '#d6e3f0');
      sky.addColorStop(0.46, '#f4f2e9');
      sky.addColorStop(0.52, '#89958f');
      sky.addColorStop(1, '#3b4547');
      ctx.fillStyle = index === 2 ? '#e5edf5' : index === 3 ? '#42494a' : sky;
      ctx.fillRect(0, 0, 128, 128);
      if (index !== 3) {
        const light = ctx.createLinearGradient(14, 0, 44, 0);
        light.addColorStop(0, 'rgba(255,255,255,0)');
        light.addColorStop(0.5, 'rgba(255,255,255,0.9)');
        light.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = light;
        ctx.fillRect(14, 8, 30, 102);
      }
      return canvas;
    });
    const map = new THREE.CubeTexture(faces);
    map.encoding = THREE.sRGBEncoding;
    map.needsUpdate = true;
    return map;
  }

  function makeButtonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#b4bdc9';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(64, 64, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#05080d';
    for (const x of [50, 78]) {
      for (const y of [50, 78]) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = '#818b9a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(78, 78);
    ctx.moveTo(78, 50);
    ctx.lineTo(50, 78);
    ctx.stroke();
    return makeColorTexture(canvas);
  }

  function makeSeam(points, material, radius = 0.0004, closed = false) {
    const vectors = points.map(point => new THREE.Vector3(...point));
    const curve = new THREE.CurvePath();
    const segments = closed ? vectors.length : vectors.length - 1;
    for (let i = 0; i < segments; i++) {
      curve.add(new THREE.LineCurve3(vectors[i], vectors[(i + 1) % vectors.length]));
    }
    return new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(16, points.length * 5), radius, 5, closed), material);
  }

  function roundedRectangle(width, height, radius) {
    const shape = new THREE.Shape();
    const x = width / 2, y = height / 2;
    shape.moveTo(-x + radius, -y);
    shape.lineTo(x - radius, -y);
    shape.quadraticCurveTo(x, -y, x, -y + radius);
    shape.lineTo(x, y - radius);
    shape.quadraticCurveTo(x, y, x - radius, y);
    shape.lineTo(-x + radius, y);
    shape.quadraticCurveTo(-x, y, -x, y - radius);
    shape.lineTo(-x, -y + radius);
    shape.quadraticCurveTo(-x, -y, -x + radius, -y);
    return shape;
  }

  function makeMetalFrame(width, height, wire, radius, material) {
    const outline = roundedRectangle(width, height, radius);
    const hole = roundedRectangle(width - wire * 2, height - wire * 2, Math.max(radius - wire, 0.001));
    outline.holes.push(new THREE.Path(hole.getPoints(8).reverse()));
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth: 0.002, steps: 1, bevelEnabled: true,
      bevelThickness: 0.0005, bevelSize: 0.0005, bevelSegments: 2, curveSegments: 8
    });
    return new THREE.Mesh(geometry, material);
  }

  /* ══════════════════════════════════════════════════════════
     UNIFORM MODELING (SENIOR SECTION PHOTO REFERENCES)
  ══════════════════════════════════════════════════════════ */
  function buildUniform() {
    const clothBump = makeTwillBump();
    const metalEnvironment = makeDaylightReflections();
    const shirtNavyMat = new THREE.MeshStandardMaterial({
      name: 'navyShirtCloth',
      color: new THREE.Color(0x151f32).convertSRGBToLinear(),
      roughness: 0.86,
      bumpMap: clothBump,
      bumpScale: 0.00012,
      side: THREE.DoubleSide
    });

    const trousersNavyMat = new THREE.MeshStandardMaterial({
      name: 'navyTrouserCloth',
      color: new THREE.Color(0x141d2d).convertSRGBToLinear(),
      roughness: 0.88,
      bumpMap: clothBump,
      bumpScale: 0.00010
    });

    const navyBtnMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x131c2b).convertSRGBToLinear(),
      map: makeButtonTexture(),
      roughness: 0.42
    });

    const brassMat = new THREE.MeshStandardMaterial({
      name: 'polishedBrass',
      color: new THREE.Color(0xc6a35f).convertSRGBToLinear(),
      roughness: 0.25,
      metalness: 0.82,
      envMap: metalEnvironment,
      envMapIntensity: 0.85
    });

    buildTrousersAndShoes(trousersNavyMat);
    buildShirt(shirtNavyMat, navyBtnMat);
    buildRolledSleeves(shirtNavyMat);
    buildBelt(brassMat, shirtNavyMat, metalEnvironment);
    buildTie();
    buildFieldServiceCap(shirtNavyMat);
    buildHaversack(brassMat);
    buildNametagAndLinkBadge();
    updateDressConfiguration();
  }

  /* ── 1. Trousers & Shoes (straight cut, no pleats, front crease) ── */
  function buildTrousersAndShoes(trousersMat) {
    const legsGroup = new THREE.Group();
    const shoesMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x15161a).convertSRGBToLinear(),
      roughness: 0.22,
      metalness: 0.06,
      envMap: makeDaylightReflections(),
      envMapIntensity: 0.82
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x111214).convertSRGBToLinear(),
      roughness: 0.87
    });
    const laceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x24252a).convertSRGBToLinear(),
      roughness: 0.75
    });
    const pelvisGeo = makeLoft(
      (y) => {
        const t = (y - 0.73) / 0.32;
        return { a: 0.18 + 0.034 * Math.sin(t * Math.PI * 0.78), b: 0.073 + 0.066 * t };
      },
      0.73,
      1.05,
      16,
      56
    );
    const pelvis = new THREE.Mesh(pelvisGeo, trousersMat);
    pelvis.castShadow = true;
    legsGroup.add(pelvis);

    const outline = new THREE.Shape();
    outline.moveTo(0, -0.082);
    outline.bezierCurveTo(0.033, -0.082, 0.044, -0.075, 0.044, -0.05);
    outline.bezierCurveTo(0.043, -0.011, 0.046, 0.035, 0.052, 0.087);
    outline.bezierCurveTo(0.059, 0.145, 0.046, 0.178, 0, 0.181);
    outline.bezierCurveTo(-0.046, 0.178, -0.059, 0.145, -0.052, 0.087);
    outline.bezierCurveTo(-0.046, 0.035, -0.043, -0.011, -0.044, -0.05);
    outline.bezierCurveTo(-0.044, -0.075, -0.033, -0.082, 0, -0.082);
    const footprint = outline.getPoints(6);
    footprint.pop();
    const solePositions = [],
      soleIndices = [];
    const soleRings = [
      [0, 0.95],
      [0.003, 1],
      [0.015, 1],
      [0.019, 0.96]
    ];
    for (const [y, scale] of soleRings) {
      for (const point of footprint) solePositions.push(point.x * scale, y, 0.045 + (point.y - 0.045) * scale);
    }
    const count = footprint.length;
    for (let ring = 0; ring < soleRings.length - 1; ring++) {
      for (let i = 0; i < count; i++) {
        const a = ring * count + i,
          b = ring * count + ((i + 1) % count);
        soleIndices.push(a, b, a + count, b, b + count, a + count);
      }
    }
    const triangles = THREE.ShapeUtils.triangulateShape(footprint, []);
    for (const triangle of triangles) {
      soleIndices.push(triangle[2], triangle[1], triangle[0]);
      soleIndices.push(...triangle.map((index) => index + 3 * count));
    }
    for (let i = 0; i < soleIndices.length; i += 3) {
      [soleIndices[i + 1], soleIndices[i + 2]] = [soleIndices[i + 2], soleIndices[i + 1]];
    }
    const soleGeo = new THREE.BufferGeometry();
    setAttr(soleGeo, 'position', solePositions, 3);
    soleGeo.setIndex(soleIndices);
    soleGeo.computeVertexNormals();

    const toeAngle = THREE.MathUtils.degToRad(15);
    let heelOffset = 0;
    for (const point of footprint) {
      heelOffset = Math.max(heelOffset, -(point.x * Math.cos(toeAngle) + point.y * Math.sin(toeAngle)));
    }

    const bootSections = [
      [-0.08, 0.02, 0.063],
      [-0.067, 0.037, 0.104],
      [-0.04, 0.042, 0.132],
      [-0.014, 0.043, 0.126],
      [0.02, 0.044, 0.096],
      [0.06, 0.048, 0.071],
      [0.106, 0.05, 0.06],
      [0.146, 0.039, 0.054],
      [0.173, 0.018, 0.037],
      [0.177, 0.001, 0.022]
    ];
    const upperPositions = [],
      upperIndices = [];
    const across = 20;
    for (const [z, width, top] of bootSections) {
      for (let j = 0; j <= across; j++) {
        const angle = -Math.PI / 2 + (Math.PI * j) / across;
        upperPositions.push(
          width * Math.sin(angle),
          0.017 + (top - 0.017) * Math.pow(Math.max(0, Math.cos(angle)), 0.74),
          z
        );
      }
    }
    for (let row = 0; row < bootSections.length - 1; row++) {
      for (let j = 0; j < across; j++) {
        const a = row * (across + 1) + j,
          b = a + across + 1;
        upperIndices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    const upperGeo = new THREE.BufferGeometry();
    setAttr(upperGeo, 'position', upperPositions, 3);
    upperGeo.setIndex(upperIndices);
    upperGeo.computeVertexNormals();
    const upperHeight = (z) => {
      for (let i = 1; i < bootSections.length; i++) {
        if (z <= bootSections[i][0]) {
          const a = bootSections[i - 1],
            b = bootSections[i];
          return a[2] + ((b[2] - a[2]) * (z - a[0])) / (b[0] - a[0]);
        }
      }
      return bootSections[bootSections.length - 1][2];
    };

    // Put every lace segment into one mesh per boot.
    const lacePositions = [],
      laceIndices = [];
    const appendLace = (start, end) => {
      const axis = end.clone().sub(start).normalize();
      const perpendicular = new THREE.Vector3(0, 1, 0).cross(axis).normalize();
      const other = axis.clone().cross(perpendicular).normalize();
      const base = lacePositions.length / 3;
      for (const center of [start, end]) {
        for (let j = 0; j < 6; j++) {
          const angle = (j / 6) * Math.PI * 2;
          const point = center
            .clone()
            .addScaledVector(perpendicular, Math.cos(angle) * 0.00135)
            .addScaledVector(other, Math.sin(angle) * 0.00135);
          lacePositions.push(point.x, point.y, point.z);
        }
      }
      for (let j = 0; j < 6; j++) {
        const a = base + j,
          b = base + ((j + 1) % 6);
        laceIndices.push(a, b, a + 6, b, b + 6, a + 6);
      }
    };
    for (let row = 0; row < 4; row++) {
      const z = -0.005 + row * 0.019;
      for (const direction of [-1, 1]) {
        const front = z + 0.012;
        const start = new THREE.Vector3(-direction * 0.014, upperHeight(z) - 0.0035, z);
        const end = new THREE.Vector3(direction * 0.014, upperHeight(front) - 0.0035, front);
        const middle = new THREE.Vector3(0, upperHeight((z + front) / 2) + 0.001, (z + front) / 2);
        appendLace(start, middle);
        appendLace(middle, end);
      }
    }
    const lacesGeo = new THREE.BufferGeometry();
    setAttr(lacesGeo, 'position', lacePositions, 3);
    lacesGeo.setIndex(laceIndices);
    lacesGeo.computeVertexNormals();

    for (const side of [SR, SL]) {
      const legHeight = 0.77,
        hipOffset = 0.1;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.106, 0.049, legHeight, 36, 1, true), trousersMat);
      leg.name = side === SR ? 'rightTrouserLeg' : 'leftTrouserLeg';
      leg.scale.z = 0.95;
      leg.position.set((side * (hipOffset + heelOffset)) / 2, 0.495, 0);
      leg.rotation.z = -side * Math.atan2(hipOffset - heelOffset, legHeight);
      leg.castShadow = true;
      legsGroup.add(leg);

      const shoe = new THREE.Group();
      shoe.name = side === SR ? 'rightShoe' : 'leftShoe';
      shoe.position.set(side * heelOffset, 0.05, 0);
      shoe.rotation.y = side * toeAngle;
      const sole = new THREE.Mesh(soleGeo, soleMat);
      sole.name = 'sole';
      sole.castShadow = true;
      shoe.add(sole);
      const upper = new THREE.Mesh(upperGeo, shoesMat);
      upper.name = 'polishedBootUpper';
      upper.castShadow = true;
      shoe.add(upper);
      const heel = new THREE.Mesh(new THREE.BoxGeometry(0.077, 0.015, 0.054), soleMat);
      heel.name = 'heel';
      heel.position.set(0, 0.0075, -0.049);
      shoe.add(heel);
      const laces = new THREE.Mesh(lacesGeo, laceMat);
      laces.name = 'bootLaces';
      shoe.add(laces);
      const toeSeam = [];
      for (let j = 0; j <= 14; j++) {
        const angle = -1.35 + (2.7 * j) / 14;
        toeSeam.push([
          0.0504 * Math.sin(angle),
          0.017 + (0.06 - 0.017) * Math.pow(Math.cos(angle), 0.74) + 0.0004,
          0.106
        ]);
      }
      shoe.add(makeSeam(toeSeam, laceMat, 0.00055));
      legsGroup.add(shoe);
    }
    uniformGroup.add(legsGroup);
  }

  /* ── 2. Navy Blue Shirt (tailored torso, selvage strip, collar, epaulettes, pockets) ── */
  const BREAST_POCKET = { x: 0.115, y: 1.235, flapTop: 0.060 };

  function garmentFrontZ(x, y) {
    let z = torsoFrontZ(x, y);
    const pocketX = (x < 0 ? SR : SL) * BREAST_POCKET.x;
    const localY = y - BREAST_POCKET.y;
    if (Math.abs(x - pocketX) <= 0.057 && localY >= -0.067 && localY <= BREAST_POCKET.flapTop) {
      const angle = torsoFrontAngle(pocketX, BREAST_POCKET.y);
      const pocketZ = torsoFrontZ(pocketX, BREAST_POCKET.y) + 0.002
        - Math.tan(angle) * (x - pocketX) + 0.010 / Math.cos(angle);
      z = Math.max(z, pocketZ);
    }
    return z;
  }

  function buildShirt(shirtMat, navyBtnMat) {
    const shirtGroup = new THREE.Group();

    // Smooth tailored torso, tucked in, smooth back with NO pleats
    const torso = new THREE.Mesh(makeLoft(shirtAB, 1.0, 1.525, 48, 64), shirtMat);
    torso.castShadow = true;
    shirtGroup.add(torso);

    const btnGeo = new THREE.CylinderGeometry(0.0075, 0.0075, 0.004, 14);
    btnGeo.rotateX(Math.PI / 2);

    // Front selvage strip (1 1/4") with navy buttons (Section 4.2.1a/c)
    const placketPts = [],
      placketW = [];
    for (let y = 1.424; y >= 1.06; y -= 0.02) {
      placketPts.push([0, y, torsoFrontZ(0, y) + 0.005]);
      placketW.push(0.032);
    }
    const placket = new THREE.Mesh(makeRibbonGeo(placketPts, placketW), shirtMat);
    shirtGroup.add(placket);

    [1.402, 1.33, 1.257, 1.184, 1.111].forEach((y) => {
      const btn = new THREE.Mesh(btnGeo, navyBtnMat);
      btn.position.set(0, y, torsoFrontZ(0, y) + 0.008);
      shirtGroup.add(btn);
    });

    dayCollarGroup = new THREE.Group();
    dayCollarGroup.name = 'dayDressCollar';
    shirtGroup.add(dayCollarGroup);

    // Open collar over a small section of the neck and upper chest.
    const bandGeo = new THREE.CylinderGeometry(0.07, 0.081, 0.036, 32, 1, true, 0.92, 2 * Math.PI - 1.84);
    const band = new THREE.Mesh(bandGeo, shirtMat);
    band.position.set(0, 1.514, -0.005);
    dayCollarGroup.add(band);

    const chestMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(SKIN_COLOR).convertSRGBToLinear(),
      roughness: 0.85,
      side: THREE.DoubleSide
    });
    const chestPoints = [],
      chestWidths = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const y = 1.418 + 0.109 * t;
      chestPoints.push([0, y, torsoFrontZ(0, y) + 0.006]);
      chestWidths.push(0.003 + 0.086 * t);
    }
    dayCollarGroup.add(new THREE.Mesh(makeRibbonGeo(chestPoints, chestWidths), chestMat));

    const collarMat = shirtMat.clone();
    collarMat.color.setHex(0x19263b).convertSRGBToLinear();
    for (const side of [SR, SL]) {
      const points = [
        [0.039, 1.528],
        [0.081, 1.5],
        [0.105, 1.455],
        [0.044, 1.475],
        [0.008, 1.425]
      ];
      const vertices = points.flatMap(([x, y]) => [side * x, y, torsoFrontZ(x, y) + 0.009]);
      const geo = new THREE.BufferGeometry();
      setAttr(geo, 'position', vertices, 3);
      geo.setIndex(side === SR ? [0, 1, 3, 1, 2, 3, 0, 3, 4] : [0, 3, 1, 1, 3, 2, 0, 4, 3]);
      geo.computeVertexNormals();
      dayCollarGroup.add(new THREE.Mesh(geo, collarMat));
    }

    ceremonialCollarGroup = new THREE.Group();
    ceremonialCollarGroup.name = 'ceremonialDressCollar';
    const closedBand = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.08, 0.036, 32, 1, true), shirtMat);
    closedBand.position.set(0, 1.515, -0.004);
    ceremonialCollarGroup.add(closedBand);
    for (const side of [SR, SL]) {
      const points = [
        [0.006, 1.525],
        [0.071, 1.509],
        [0.088, 1.463],
        [0.022, 1.484]
      ];
      const geometry = new THREE.BufferGeometry();
      setAttr(
        geometry,
        'position',
        points.flatMap(([x, y]) => [side * x, y, torsoFrontZ(x, y) + 0.012]),
        3
      );
      geometry.setIndex(side === SR ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
      geometry.computeVertexNormals();
      ceremonialCollarGroup.add(new THREE.Mesh(geometry, collarMat));
    }
    shirtGroup.add(ceremonialCollarGroup);

    // Tapered epaulettes: 2" at the shoulder seam to 1 1/2" at the collar, navy button (Section 4.2.1d)
    [SR, SL].forEach((sx) => {
      const s = new THREE.Shape();
      s.moveTo(-0.06, 0.0);
      s.lineTo(-0.05, 0.019);
      s.lineTo(0.05, 0.025);
      s.lineTo(0.05, -0.025);
      s.lineTo(-0.05, -0.019);
      s.lineTo(-0.06, 0.0);
      const epGeo = new THREE.ExtrudeGeometry(s, { depth: 0.004, bevelEnabled: false });
      epGeo.rotateX(-Math.PI / 2);
      const ep = new THREE.Mesh(epGeo, shirtMat);
      const ex = 0.175;
      const ey = torsoSurfaceY(ex, 0) + 0.004;
      ep.position.set(sx * ex, ey, 0);
      ep.rotation.z = -sx * 0.41;
      ep.scale.x = sx;
      ep.castShadow = true;
      shirtGroup.add(ep);

      const epb = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.004, 14), navyBtnMat);
      epb.position.set(-0.04, 0.006, 0);
      ep.add(epb);
    });

    const seamMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x29374b).convertSRGBToLinear(),
      roughness: 0.93
    });
    const pocketMat = shirtMat.clone();
    pocketMat.color.setHex(0x172337).convertSRGBToLinear();

    for (const side of [SR, SL]) {
      const px = side * BREAST_POCKET.x,
        py = BREAST_POCKET.y;
      const pocketGroup = new THREE.Group();
      pocketGroup.name = side === SR ? 'rightChestPocket' : 'leftChestPocket';
      pocketGroup.position.set(px, py, torsoFrontZ(px, py) + 0.002);
      pocketGroup.rotation.y = torsoFrontAngle(px, py);

      const body = new THREE.Shape();
      body.moveTo(-0.053, 0.058);
      body.lineTo(0.053, 0.058);
      body.lineTo(0.053, -0.05);
      body.quadraticCurveTo(0.053, -0.062, 0.043, -0.065);
      body.quadraticCurveTo(0, -0.07, -0.043, -0.065);
      body.quadraticCurveTo(-0.053, -0.062, -0.053, -0.05);
      body.closePath();
      const pocket = new THREE.Mesh(
        new THREE.ExtrudeGeometry(body, {
          depth: 0.003,
          bevelEnabled: true,
          bevelSize: 0.0007,
          bevelThickness: 0.0006,
          bevelSegments: 2
        }),
        pocketMat
      );
      pocket.name = 'pocketBody';
      pocket.castShadow = true;
      pocketGroup.add(pocket);

      pocketGroup.add(
        makeSeam(
          [
            [-0.049, 0.052, 0.004],
            [-0.049, -0.046, 0.004],
            [-0.041, -0.061, 0.004],
            [0, -0.065, 0.004],
            [0.041, -0.061, 0.004],
            [0.049, -0.046, 0.004],
            [0.049, 0.052, 0.004]
          ],
          seamMat
        )
      );

      // Raised box pleat, with two folded edges running down to the rounded base.
      const pleat = new THREE.Mesh(new THREE.BoxGeometry(0.027, 0.094, 0.0025), pocketMat);
      pleat.name = 'boxPleat';
      pleat.position.set(0, -0.016, 0.005);
      pocketGroup.add(pleat);
      for (const x of [-0.0135, 0.0135]) {
        pocketGroup.add(
          makeSeam(
            [
              [x, 0.026, 0.0065],
              [x, -0.058, 0.0065]
            ],
            seamMat,
            0.00035
          )
        );
      }

      const flapShape = new THREE.Shape();
      flapShape.moveTo(-0.055, BREAST_POCKET.flapTop);
      flapShape.lineTo(0.055, BREAST_POCKET.flapTop);
      flapShape.lineTo(0.055, 0.028);
      flapShape.quadraticCurveTo(0.03, 0.016, 0, 0.011);
      flapShape.quadraticCurveTo(-0.03, 0.016, -0.055, 0.028);
      flapShape.closePath();
      const flap = new THREE.Mesh(
        new THREE.ExtrudeGeometry(flapShape, {
          depth: 0.002,
          bevelEnabled: false,
          curveSegments: 12
        }),
        pocketMat
      );
      flap.name = 'pocketFlap';
      flap.position.z = 0.007;
      flap.castShadow = true;
      pocketGroup.add(flap);
      pocketGroup.add(
        makeSeam(
          [
            [-0.052, 0.056, 0.0095],
            [0.052, 0.056, 0.0095],
            [0.052, 0.03, 0.0095],
            [0.026, 0.0185, 0.0095],
            [0, 0.014, 0.0095],
            [-0.026, 0.0185, 0.0095],
            [-0.052, 0.03, 0.0095]
          ],
          seamMat,
          0.00035,
          true
        )
      );

      const flapButton = new THREE.Mesh(btnGeo, navyBtnMat);
      flapButton.position.set(0, 0.026, 0.013);
      pocketGroup.add(flapButton);
      if (side === SL) {
        const eyelet = new THREE.Group();
        eyelet.name = 'lanyardEyelet';
        eyelet.position.set(-0.05, BREAST_POCKET.flapTop - 0.01905, 0.01);
        const edgeMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x222b37).convertSRGBToLinear(),
          roughness: 0.55,
          metalness: 0.2
        });
        eyelet.add(new THREE.Mesh(new THREE.TorusGeometry(0.0021, 0.00045, 6, 16), edgeMat));
        const hole = new THREE.Mesh(
          new THREE.CircleGeometry(0.00165, 16),
          new THREE.MeshStandardMaterial({ color: 0x020304, roughness: 1 })
        );
        hole.position.z = -0.00015;
        eyelet.add(hole);
        pocketGroup.add(eyelet);
      }
      shirtGroup.add(pocketGroup);
    }

    uniformGroup.add(shirtGroup);
    buildNCOLanyard();
  }

  /* Braided shoulder loop and a single loose cord returning to the pocket eyelet. */
  function buildNCOLanyard() {
    lanyardGroup = new THREE.Group();
    lanyardGroup.name = 'lanyardGroup';
    const ropeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe6e5dc).convertSRGBToLinear(),
      roughness: 0.88,
      bumpMap: makeTwillBump(),
      bumpScale: 0.00008
    });
    const front = (x, y, lift = 0.018) => new THREE.Vector3(x, y, torsoFrontZ(x, y) + lift);
    const shoulderY = torsoSurfaceY(0.199, 0.015) + 0.003;
    const frontCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.199, shoulderY, 0.015),
        front(0.212, 1.444, 0.017),
        front(0.222, 1.388),
        front(0.227, 1.315),
        front(0.224, 1.24),
        front(0.218, 1.174)
      ],
      false,
      'centripetal'
    );
    const rearCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.199, shoulderY, -0.015),
        new THREE.Vector3(0.214, 1.423, -0.085),
        new THREE.Vector3(0.234, 1.35, -0.097),
        new THREE.Vector3(0.242, 1.267, -0.086),
        new THREE.Vector3(0.218, 1.18, -0.075),
        new THREE.Vector3(0.202, 1.169, -0.03),
        new THREE.Vector3(0.202, 1.169, 0.06),
        front(0.218, 1.174)
      ],
      false,
      'centripetal'
    );

    function addBraid(curve, name, turns) {
      const segments = 220;
      const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.0043, 8, false), ropeMat);
      core.name = name + 'Core';
      lanyardGroup.add(core);
      const frames = curve.computeFrenetFrames(segments, false);
      for (let strand = 0; strand < 3; strand++) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
          const t = i / segments,
            phase = t * Math.PI * 2 * turns + (strand * Math.PI * 2) / 3;
          const point = curve.getPointAt(t);
          point.addScaledVector(frames.normals[i], Math.sin(phase) * 0.0056);
          point.addScaledVector(frames.binormals[i], Math.sin(phase * 2) * 0.005);
          points.push(point);
        }
        const braid = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, 0.0028, 6, false),
          ropeMat
        );
        braid.name = name + 'Strand' + strand;
        lanyardGroup.add(braid);
      }
    }
    addBraid(frontCurve, 'frontBraid', 24);
    addBraid(rearCurve, 'rearBraid', 22);

    const eyelet = uniformGroup.getObjectByName('lanyardEyelet');
    const anchor = eyelet.getWorldPosition(new THREE.Vector3());
    anchor.z += 0.001;
    const curve = new THREE.CatmullRomCurve3(
      [
        front(0.218, 1.174),
        front(0.207, 1.151, 0.028),
        front(0.148, 1.140, 0.030),
        front(0.094, 1.153, 0.025),
        front(0.061, 1.190, 0.020),
        front(0.061, 1.245, 0.016),
        anchor
      ],
      false,
      'centripetal'
    );
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100,
        point = curve.getPointAt(t);
      const clearance = 0.005 + 0.025 * Math.sin(Math.PI * t);
      point.z = Math.max(point.z, garmentFrontZ(point.x, point.y) + clearance);
      if (i === 100) point.copy(anchor);
      points.push(point);
    }
    const cord = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, false, 'centripetal'), 100, 0.00135, 8, false),
      ropeMat
    );
    cord.name = 'singleLanyardCord';
    lanyardGroup.add(cord);
    uniformGroup.add(lanyardGroup);
    refreshLanyardVisibility();
  }

  const ARMLET_WIDTH = 640;
  const ARMLET_HEIGHT = 768;

  function buildRolledSleeves(shirtMat) {
    const sleeveProfile = [
      [1.47, 0.001],
      [1.462, 0.036],
      [1.445, 0.06],
      [1.414, 0.074],
      [1.375, 0.078],
      [1.31, 0.076],
      [1.22, 0.07],
      [1.125, 0.067]
    ];
    const sleeveRadius = (y) => radiusFromProfile(y, sleeveProfile);
    const cuffMat = shirtMat.clone();
    cuffMat.color.setHex(0x162237).convertSRGBToLinear();

    rolledCuffGroup = new THREE.Group();
    rolledCuffGroup.name = 'rolledSleeveCuffs';
    longSleeveGroup = new THREE.Group();
    longSleeveGroup.name = 'ceremonialLongSleeves';
    uniformGroup.add(rolledCuffGroup, longSleeveGroup);
    const lowerProfile = [
      [1.17, 0.066],
      [1.12, 0.063],
      [1.04, 0.057],
      [0.96, 0.045],
      [0.895, 0.032],
      [0.855, 0.028]
    ];
    const lowerRadius = (y) => radiusFromProfile(y, lowerProfile);

    for (const side of [SR, SL]) {
      const sleeve = new THREE.Mesh(makeArmSurface(side, Math.PI, 1.47, 1.125, sleeveRadius), shirtMat);
      sleeve.castShadow = true;
      uniformGroup.add(sleeve);

      const cuff = new THREE.Mesh(
        makeArmSurface(side, Math.PI, 1.164, 1.122, (y) => sleeveRadius(y) + 0.005, 4),
        cuffMat
      );
      rolledCuffGroup.add(cuff);
      const lowerSleeve = new THREE.Mesh(
        makeArmSurface(side, Math.PI, 1.17, 0.855, lowerRadius, 24, 40),
        shirtMat
      );
      lowerSleeve.name = side === SR ? 'rightLongSleeve' : 'leftLongSleeve';
      lowerSleeve.castShadow = true;
      longSleeveGroup.add(lowerSleeve);
      const closedCuff = new THREE.Mesh(
        makeArmSurface(side, Math.PI, 0.898, 0.854, (y) => lowerRadius(y) + 0.002, 4, 40),
        cuffMat
      );
      closedCuff.name = 'buttonedCuff';
      longSleeveGroup.add(closedCuff);
      const cuffButton = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0038, 0.0038, 0.002, 16),
        new THREE.MeshStandardMaterial({ color: 0x080c14, roughness: 0.45 })
      );
      cuffButton.rotation.z = (-side * Math.PI) / 2;
      cuffButton.position.set(side * (ARM_CENTER_X + lowerRadius(0.876) + 0.003), 0.876, 0);
      longSleeveGroup.add(cuffButton);

      const flashCanvas = document.createElement('canvas');
      flashCanvas.width = 384;
      flashCanvas.height = 152;
      drawShoulderFlash(flashCanvas.getContext('2d'));
      const flash = new THREE.Mesh(
        makeArmSurface(side, 0.64, 1.41, 1.37, (y) => sleeveRadius(y) + 0.0015, 6, 24),
        new THREE.MeshStandardMaterial({ map: makeColorTexture(flashCanvas), alphaTest: 0.35, roughness: 0.95 })
      );
      uniformGroup.add(flash);

      const armlet = buildArmlet(side, sleeveRadius);
      if (side === SR) rightArmlet = armlet;
      else leftArmlet = armlet;
    }
  }

  function buildArmlet(side, sleeveRadius) {
    const canvas = document.createElement('canvas');
    canvas.width = ARMLET_WIDTH;
    canvas.height = ARMLET_HEIGHT;
    const texture = makeColorTexture(canvas);
    const halfAngle = 1.04, top = 1.343, bottom = 1.178;
    const radiusAt = y => sleeveRadius(y) + 0.0035;
    const surfaceWidth = 2 * halfAngle * radiusAt((top + bottom) / 2);
    const artworkScaleX = (top - bottom) * ARMLET_WIDTH / (surfaceWidth * ARMLET_HEIGHT);
    const mesh = new THREE.Mesh(
      makeArmSurface(side, halfAngle, top, bottom, radiusAt, 16, 40, side === SR ? 0.011 : 0),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.96 })
    );
    mesh.name = side === SR ? 'rightArmlet' : 'leftArmlet';
    mesh.visible = false;
    uniformGroup.add(mesh);
    return { ctx: canvas.getContext('2d'), texture, mesh, artworkScaleX };
  }

  function buildBelt(brassMat, clothMat, metalEnvironment) {
    beltGroup = new THREE.Group();
    beltGroup.name = 'beltGroup';

    const leatherMat = new THREE.MeshPhysicalMaterial({
      name: 'glossyBlackLeather',
      color: new THREE.Color(0x111617).convertSRGBToLinear(),
      roughness: 0.22, metalness: 0.04,
      clearcoat: 0.75, clearcoatRoughness: 0.16,
      envMap: metalEnvironment, envMapIntensity: 0.45
    });
    const beltA = 0.224, beltB = 0.145, beltY = 1.021;
    const surfaceZ = x => beltB * Math.pow(1 - Math.pow(Math.abs(x) / beltA, TORSO_P), 1 / TORSO_P);
    const band = new THREE.Mesh(makeLoft(() => ({ a: beltA, b: beltB }), 1.000, 1.042, 3, 80), leatherMat);
    band.name = 'leatherBelt';
    band.castShadow = true;
    beltGroup.add(band);

    const stitchMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x30373b).convertSRGBToLinear(), roughness: 0.88
    });
    for (const y of [1.004, 1.038]) {
      const points = [];
      for (let i = 0; i < 80; i++) {
        const angle = i * Math.PI * 2 / 80;
        const c = Math.cos(angle), t = Math.sin(angle), exponent = 2 / TORSO_P;
        points.push([
          (beltA + 0.0006) * Math.sign(c) * Math.pow(Math.abs(c), exponent), y,
          (beltB + 0.0006) * Math.sign(t) * Math.pow(Math.abs(t), exponent)
        ]);
      }
      beltGroup.add(makeSeam(points, stitchMat, 0.00035, true));
    }

    // Navy trouser loops hold the belt. The two slim black keepers sit beside the brass fittings.
    for (const x of [-0.099, 0.099]) {
      const loop = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.064, 0.005), clothMat);
      loop.name = 'trouserBeltLoop';
      loop.position.set(x, beltY, surfaceZ(x) + 0.0035);
      loop.rotation.y = x > 0 ? 0.12 : -0.12;
      uniformGroup.add(loop);
    }
    for (const x of [-0.079, -0.070]) {
      const keeper = new THREE.Mesh(new THREE.BoxGeometry(0.0055, 0.046, 0.004), leatherMat);
      keeper.position.set(x, beltY, surfaceZ(x) + 0.004);
      beltGroup.add(keeper);
    }

    const buckle = new THREE.Group();
    buckle.name = 'brassBuckle';
    buckle.position.set(0, beltY, beltB + 0.004);
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.079, 0.031, 0.003), brassMat);
    buckle.add(bridge);

    for (const side of [-1, 1]) {
      const frame = makeMetalFrame(0.026, 0.051, 0.004, 0.0035, brassMat);
      frame.name = 'buckleSideFrame';
      frame.position.set(side * 0.0435, 0, -0.0005);
      frame.rotation.y = side * 0.12;
      buckle.add(frame);

      const insert = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.039, 0.005), leatherMat);
      insert.position.set(side * 0.047, 0, 0.002);
      buckle.add(insert);
    }

    const pinGeometry = new THREE.CylinderGeometry(0.0012, 0.0012, 0.016, 10);
    pinGeometry.rotateZ(Math.PI / 2);
    const pin = new THREE.Mesh(pinGeometry, brassMat);
    pin.name = 'buckleTongue';
    pin.position.set(-0.0435, 0, 0.0055);
    buckle.add(pin);

    const plateGeo = new THREE.CylinderGeometry(0.0275, 0.0275, 0.0035, 64);
    plateGeo.rotateX(Math.PI / 2);
    const plate = new THREE.Mesh(plateGeo, brassMat);
    plate.position.z = 0.002;
    buckle.add(plate);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.0265, 0.0009, 8, 64), brassMat);
    rim.position.z = 0.0041;
    buckle.add(rim);
    const innerRim = new THREE.Mesh(new THREE.TorusGeometry(0.0182, 0.0007, 8, 64), brassMat);
    innerRim.position.z = 0.0045;
    buckle.add(innerRim);

    const emboss = document.createElement('canvas');
    emboss.width = emboss.height = 512;
    const ctx = emboss.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#c6c6c6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 31px Georgia, serif';
    const arcText = (text, middle, sweep, direction) => {
      for (let i = 0; i < text.length; i++) {
        const angle = middle + direction * sweep * (i / (text.length - 1) - 0.5);
        ctx.save();
        ctx.translate(256 + Math.cos(angle) * 211, 256 + Math.sin(angle) * 211);
        ctx.rotate(angle + direction * Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
      }
    };
    arcText("THE BOYS' BRIGADE", -Math.PI / 2, 2.25, 1);
    arcText('SURE & STEDFAST', Math.PI / 2, 1.95, -1);
    ctx.strokeStyle = '#c4c4c4';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(256, 256, 174, 0, Math.PI * 2);
    ctx.stroke();

    // The anchor and BB monogram are pressed into the central brass medallion.
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(256, 168, 17, 0, Math.PI * 2);
    ctx.moveTo(256, 185);
    ctx.lineTo(256, 340);
    ctx.moveTo(208, 216);
    ctx.lineTo(304, 216);
    ctx.moveTo(195, 289);
    ctx.quadraticCurveTo(206, 344, 256, 342);
    ctx.quadraticCurveTo(306, 344, 317, 289);
    ctx.stroke();
    ctx.font = 'bold 77px Georgia, serif';
    ctx.fillText('B', 210, 272);
    ctx.fillText('B', 302, 272);

    const embossMat = brassMat.clone();
    embossMat.bumpMap = new THREE.CanvasTexture(emboss);
    embossMat.bumpScale = 0.00065;
    const face = new THREE.Mesh(new THREE.RingGeometry(0.0178, 0.0257, 64), embossMat);
    face.name = 'embossedBuckleFace';
    face.position.z = 0.0046;
    buckle.add(face);

    // A raised domed center catches the light like the pressed brass crest in the reference.
    const crest = document.createElement('canvas');
    crest.width = crest.height = 256;
    const stamp = crest.getContext('2d');
    stamp.fillStyle = '#808080';
    stamp.fillRect(0, 0, 256, 256);
    stamp.strokeStyle = '#d1d1d1';
    stamp.fillStyle = '#d1d1d1';
    stamp.lineWidth = 8;
    stamp.beginPath();
    stamp.arc(128, 43, 12, 0, Math.PI * 2);
    stamp.moveTo(128, 55);
    stamp.lineTo(128, 203);
    stamp.moveTo(89, 81);
    stamp.lineTo(167, 81);
    stamp.moveTo(70, 155);
    stamp.quadraticCurveTo(81, 202, 128, 207);
    stamp.quadraticCurveTo(175, 202, 186, 155);
    stamp.stroke();
    stamp.textAlign = 'center';
    stamp.textBaseline = 'middle';
    stamp.font = 'bold 66px Georgia, serif';
    stamp.fillText('B', 85, 128);
    stamp.fillText('B', 171, 128);

    const positions = [0, 0, 0.003], uvs = [0.5, 0.5], indices = [];
    const rings = 8, segments = 64, radius = 0.0176;
    for (let ring = 1; ring <= rings; ring++) {
      const r = ring / rings;
      for (let j = 0; j <= segments; j++) {
        const angle = j * Math.PI * 2 / segments;
        const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
        positions.push(x * radius, y * radius, 0.003 * (1 - r * r));
        uvs.push(0.5 + x / 2, 0.5 + y / 2);
      }
    }
    for (let j = 0; j < segments; j++) indices.push(0, 1 + j, 2 + j);
    for (let ring = 0; ring < rings - 1; ring++) {
      for (let j = 0; j < segments; j++) {
        const a = 1 + ring * (segments + 1) + j, b = a + segments + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    const domeGeometry = new THREE.BufferGeometry();
    setAttr(domeGeometry, 'position', positions, 3);
    setAttr(domeGeometry, 'uv', uvs, 2);
    domeGeometry.setIndex(indices);
    domeGeometry.computeVertexNormals();
    const domeMat = brassMat.clone();
    domeMat.bumpMap = new THREE.CanvasTexture(crest);
    domeMat.bumpScale = 0.00055;
    const dome = new THREE.Mesh(domeGeometry, domeMat);
    dome.name = 'raisedBuckleCrest';
    dome.position.z = 0.0046;
    buckle.add(dome);
    buckle.castShadow = true;
    beltGroup.add(buckle);

    beltGroup.visible = window.BBMUniform3D.state.beltVisible;
    uniformGroup.add(beltGroup);
  }

  function updateDressConfiguration() {
    const ceremonial = window.BBMUniform3D.state.tieVisible;
    if (tieGroup) tieGroup.visible = ceremonial;
    if (longSleeveGroup) longSleeveGroup.visible = ceremonial;
    if (rolledCuffGroup) rolledCuffGroup.visible = !ceremonial;
    if (dayCollarGroup) dayCollarGroup.visible = !ceremonial;
    if (ceremonialCollarGroup) ceremonialCollarGroup.visible = ceremonial;
  }

  function buildTie() {
    tieGroup = new THREE.Group();
    tieGroup.name = 'tieGroup';
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x4786bd).convertSRGBToLinear(),
      roughness: 0.68,
      side: THREE.DoubleSide
    });
    const points = [],
      widths = [];
    const top = 1.477,
      tip = 1.058,
      segments = 60;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments,
        y = top + (tip - top) * t;
      points.push([0, y, torsoFrontZ(0, y) + 0.017]);
      widths.push(t < 0.86 ? 0.029 + 0.04 * (t / 0.86) : (0.069 * (1 - t)) / 0.14 + 0.0005);
    }
    const blade = new THREE.Mesh(makeRibbonGeo(points, widths), material);
    blade.name = 'skyBlueTieBlade';
    tieGroup.add(blade);

    const knotShape = new THREE.Shape();
    knotShape.moveTo(-0.015, 0.02);
    knotShape.lineTo(0.015, 0.02);
    knotShape.lineTo(0.02, 0.005);
    knotShape.lineTo(0.01, -0.021);
    knotShape.lineTo(-0.01, -0.021);
    knotShape.lineTo(-0.02, 0.005);
    knotShape.closePath();
    const geometry = new THREE.ExtrudeGeometry(knotShape, {
      depth: 0.003,
      bevelEnabled: true,
      bevelSize: 0.001,
      bevelThickness: 0.001,
      bevelSegments: 2
    });
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        y = positions.getY(i) + 1.49;
      positions.setXYZ(i, x, y, torsoFrontZ(x, y) + 0.015 + positions.getZ(i));
    }
    geometry.computeVertexNormals();
    const knot = new THREE.Mesh(geometry, material);
    knot.name = 'tieKnot';
    tieGroup.add(knot);
    uniformGroup.add(tieGroup);
  }

  /* ── 6. Field Service Cap tilted to the right, white piping, BB cap badge ── */
  function buildFieldServiceCap(capNavyMat) {
    capGroup = new THREE.Group();
    capGroup.name = 'capGroup';
    capGroup.position.set(SR * 0.006, 1.728, 0);
    capGroup.rotation.z = 0.075;
    const profile = [
      [0, 0.108, 0.121],
      [0.28, 0.109, 0.123],
      [0.6, 0.094, 0.119],
      [0.84, 0.055, 0.112],
      [1, 0.012, 0.103]
    ];
    const dimensionsAt = (u) => {
      for (let i = 1; i < profile.length; i++) {
        if (u <= profile[i][0]) {
          const a = profile[i - 1],
            b = profile[i],
            t = (u - a[0]) / (b[0] - a[0]);
          return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
        }
      }
      return profile[profile.length - 1].slice(1);
    };
    const crownHeight = (angle) => 0.108 - 0.026 * Math.pow(Math.sin(angle), 2);
    const surface = (angle, u) => {
      const [width, depth] = dimensionsAt(u),
        c = Math.cos(angle),
        s = Math.sin(angle);
      return new THREE.Vector3(
        width * Math.sign(c) * Math.pow(Math.abs(c), 0.83),
        crownHeight(angle) * u,
        depth * Math.sign(s) * Math.pow(Math.abs(s), 0.83) - 0.003
      );
    };
    const surfaceNormal = (angle, u) => {
      const tangent = surface(angle + 0.001, u).sub(surface(angle - 0.001, u));
      const rise = surface(angle, Math.min(1, u + 0.001)).sub(surface(angle, Math.max(0, u - 0.001)));
      return rise.cross(tangent).normalize();
    };
    // The ends remain high, while the long side-panel crown bows gently at its middle.
    const positions = [],
      indices = [],
      rows = 24,
      segments = 64;
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= segments; column++) {
        const point = surface((column / segments) * Math.PI * 2, row / rows);
        positions.push(point.x, point.y, point.z);
      }
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < segments; column++) {
        const a = row * (segments + 1) + column,
          b = a + segments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const center = positions.length / 3;
    positions.push(0, 0.11, -0.003);
    for (let column = 0; column < segments; column++) {
      const a = rows * (segments + 1) + column;
      indices.push(a, center, a + 1);
    }
    const capGeo = new THREE.BufferGeometry();
    setAttr(capGeo, 'position', positions, 3);
    capGeo.setIndex(indices);
    capGeo.computeVertexNormals();
    fixLoftSeam(capGeo, rows, segments);
    const cap = new THREE.Mesh(capGeo, capNavyMat);
    cap.name = 'foldedFieldServiceCap';
    cap.castShadow = true;
    capGroup.add(cap);

    const pipingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd0d1ce).convertSRGBToLinear(),
      roughness: 0.82
    });
    for (const upper of [false, true]) {
      const points = [];
      for (let i = 0; i < 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        // The lower cord follows the straight hem. The upper cord has a soft side upturn.
        const height = upper ? 0.034 + 0.02 * Math.pow(Math.abs(Math.cos(angle)), 3.5) : 0.008;
        const u = height / crownHeight(angle);
        points.push(surface(angle, u).addScaledVector(surfaceNormal(angle, u), 0.0011));
      }
      const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal');
      const cord = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.001, 5, true), pipingMat);
      cord.name = upper ? 'upperCapPiping' : 'lowerCapPiping';
      capGroup.add(cord);
    }

    const silverMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xb9c3c9).convertSRGBToLinear(),
      roughness: 0.36,
      metalness: 0.84,
      envMap: makeDaylightReflections(),
      envMapIntensity: 0.8
    });
    const starShape = new THREE.Shape(),
      outline = [];
    for (let i = 0; i < 32; i++) {
      const angle = Math.PI / 2 + (i / 32) * Math.PI * 2;
      const radius = [0.015, 0.0127, 0.011, 0.0127][i % 4];
      const x = Math.cos(angle) * radius,
        y = Math.sin(angle) * radius;
      outline.push([x, y]);
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const badge = new THREE.Group();
    badge.name = 'silverCapBadge';
    const badgeAngle = 1.02,
      badgeHeight = 0.78;
    const normal = surfaceNormal(badgeAngle, badgeHeight);
    badge.position.copy(surface(badgeAngle, badgeHeight).addScaledVector(normal, 0.0019));
    badge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const star = new THREE.Mesh(
      new THREE.ExtrudeGeometry(starShape, {
        depth: 0.0012,
        bevelEnabled: true,
        bevelThickness: 0.0002,
        bevelSize: 0.0002,
        bevelSegments: 1,
        steps: 1
      }),
      silverMat
    );
    badge.add(star);

    // Radial engraving and the reference's BB monogram sit on the physical silver pin.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const g = canvas.getContext('2d');
    g.beginPath();
    outline.forEach(([x, y], i) => {
      const px = 128 + (x / 0.032) * 256,
        py = 128 - (y / 0.032) * 256;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    });
    g.closePath();
    g.save();
    g.clip();
    g.fillStyle = '#a8b7bf';
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 176; i++) {
      const angle = (i / 176) * Math.PI * 2;
      g.strokeStyle = i % 2 ? '#d9e0e3' : '#50616b';
      g.lineWidth = i % 2 ? 1.0 : 1.3;
      g.beginPath();
      g.moveTo(128 + Math.cos(angle) * 63, 128 + Math.sin(angle) * 63);
      g.lineTo(128 + Math.cos(angle) * 129, 128 + Math.sin(angle) * 129);
      g.stroke();
    }
    g.restore();
    g.fillStyle = '#d3dde1';
    g.beginPath();
    g.arc(128, 128, 66, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#485e6c';
    g.beginPath();
    g.arc(128, 128, 61, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#182a39';
    g.beginPath();
    g.arc(128, 128, 55, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#8195a0';
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(128, 128, 51, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = '#a4b7c3';
    g.font = 'italic bold 76px Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('BB', 125, 131);
    const engraving = new THREE.Mesh(
      new THREE.PlaneGeometry(0.032, 0.032),
      new THREE.MeshStandardMaterial({
        map: makeColorTexture(canvas),
        transparent: true,
        alphaTest: 0.2,
        roughness: 0.48,
        metalness: 0.5
      })
    );
    engraving.name = 'engravedBBMonogram';
    engraving.position.z = 0.0015;
    badge.add(engraving);
    capGroup.add(badge);
    uniformGroup.add(capGroup);
  }

  function buildHaversack(brassMat) {
    haversackGroup = new THREE.Group();
    haversackGroup.name = 'haversackGroup';

    const webbingCanvas = document.createElement('canvas');
    webbingCanvas.width = webbingCanvas.height = 128;
    const ctx = webbingCanvas.getContext('2d');
    ctx.fillStyle = '#f0f2f4';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#bdcbdc';
    for (let y = 0; y < 128; y += 4) ctx.fillRect(0, y, 128, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let x = 0; x < 128; x += 3) ctx.fillRect(x, 0, 1, 128);
    const webbingMap = makeColorTexture(webbingCanvas);
    webbingMap.wrapS = webbingMap.wrapT = THREE.RepeatWrapping;
    webbingMap.repeat.set(1, 64);
    const webbingMat = new THREE.MeshStandardMaterial({
      name: 'whiteRibbedWebbing', map: webbingMap,
      roughness: 0.88, metalness: 0,
      bumpMap: webbingMap, bumpScale: 0.00015, side: THREE.DoubleSide
    });
    const whiteMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe7ebed).convertSRGBToLinear(), roughness: 0.92, side: THREE.DoubleSide
    });
    const seamMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd2d7dc).convertSRGBToLinear(), roughness: 0.93
    });
    const frontLift = y => y < 1.040 ? -0.008 : 0.022;
    const points = crossStrapPoints(frontLift, y => y < 1.040 ? -0.008 : 0.008);
    const width = 0.055;
    const geometry = makeRibbonGeo(points, points.map(() => width));
    const clothVertices = geometry.attributes.position;
    for (let i = 0; i < clothVertices.count; i++) {
      const x = clothVertices.getX(i), y = clothVertices.getY(i), z = clothVertices.getZ(i);
      if (z > 0 && y >= 1.043) {
        clothVertices.setZ(i, Math.max(z, garmentFrontZ(x, y) + 0.006));
      }
    }
    geometry.computeVertexNormals();
    const strap = new THREE.Mesh(geometry, webbingMat);
    strap.name = 'haversackWebbing';
    strap.castShadow = true;
    haversackGroup.add(strap);

    // Narrow stitched selvedges run the length of the webbing.
    const positions = geometry.attributes.position;
    for (const mix of [0.035, 0.965]) {
      const edge = [];
      for (let i = 0; i < points.length; i++) {
        const left = new THREE.Vector3().fromBufferAttribute(positions, i * 2);
        const right = new THREE.Vector3().fromBufferAttribute(positions, i * 2 + 1);
        const point = left.lerp(right, mix);
        const normal = torsoNormal(point.x, point.y, point.z);
        edge.push([point.x + normal[0] * 0.0004, point.y + normal[1] * 0.0004, point.z + normal[2] * 0.0004]);
      }
      haversackGroup.add(makeSeam(edge, seamMat, 0.00035));
    }

    const shoulderX = SR * 0.187, hipX = SL * 0.203;
    const strapAngle = Math.atan2(hipX - shoulderX, 1.455 - 1.0);
    for (const y of [1.275, 1.108]) {
      const t = (y - 1.0) / (1.455 - 1.0);
      const x = hipX + (shoulderX - hipX) * t;
      const adjuster = makeMetalFrame(0.058, 0.025, 0.0018, 0.008, brassMat);
      adjuster.name = 'haversackAdjuster';
      adjuster.position.set(x, y, garmentFrontZ(x, y) + 0.028);
      adjuster.rotation.set(0, torsoFrontAngle(x, y), strapAngle);
      haversackGroup.add(adjuster);
    }

    const pouch = new THREE.Group();
    pouch.name = 'haversackPouch';
    pouch.position.set(SL * 0.231, 0.931, -0.005);
    pouch.rotation.y = Math.PI / 2;
    const pouchShape = roundedRectangle(0.156, 0.122, 0.003);
    const body = new THREE.Mesh(new THREE.ExtrudeGeometry(pouchShape, {
      depth: 0.007, bevelEnabled: true, bevelSize: 0.001, bevelThickness: 0.0008, bevelSegments: 2
    }), whiteMat);
    body.position.z = -0.0035;
    body.castShadow = true;
    pouch.add(body);

    const flap = new THREE.Shape();
    flap.moveTo(-0.078, 0.060);
    flap.lineTo(0.078, 0.060);
    flap.lineTo(0.076, 0.028);
    flap.lineTo(0, -0.007);
    flap.lineTo(-0.076, 0.028);
    flap.closePath();
    const foldedFlap = new THREE.Mesh(new THREE.ExtrudeGeometry(flap, { depth: 0.0015, bevelEnabled: false }), whiteMat);
    foldedFlap.position.z = 0.0045;
    pouch.add(foldedFlap);
    pouch.add(makeSeam([
      [-0.073, 0.026, 0.0063], [0, -0.003, 0.0063], [0.073, 0.026, 0.0063]
    ], seamMat, 0.00045));
    haversackGroup.add(pouch);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.052, 0.047), whiteMat);
    tail.position.set(0.226, 0.988, 0.005);
    haversackGroup.add(tail);
    haversackGroup.visible = window.BBMUniform3D.state.haversackVisible;
    uniformGroup.add(haversackGroup);
    buildSash();
  }

  /* ── 7b. NCO Sash (Section 4.5.2) ──
     Sergeant        -> RED sash crossing the white haversack
     Staff Sergeant  -> BLUE sash crossing the white haversack
     Worn from the left shoulder to the right hip, under the front belt and over the rear belt. */
  function buildSash() {
    sashGroup = new THREE.Group();
    sashGroup.name = 'sashGroup';
    sashMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xc82029).convertSRGBToLinear(),
      roughness: 0.83,
      metalness: 0,
      side: THREE.DoubleSide
    });

    const smooth = (a, b, value) => {
      const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const beltZ = (x) => 0.145 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x) / 0.224, TORSO_P)), 1 / TORSO_P);
    const frontLift = (y) => 0.003 + 0.027 * smooth(1.05, 1.085, y);
    const rearLift = () => 0.027;
    // The sash uses the opposite diagonal to the independently modelled white strap.
    const points = crossStrapPoints(frontLift, rearLift).map(([x, y, z]) => {
      const mirroredX = -x;
      if (z <= 0 || y >= 1.455) return [mirroredX, y, z];
      // Ease the front sash toward the sternum below the left shoulder so its
      // outer edge clears the name tag, then return to the original hip route.
      const frontRun = Math.max(0, Math.min(1, (y - 1.0) / 0.455));
      const shoulderEase = 1 - smooth(1.345, 1.455, y);
      const routedX = mirroredX - 0.062 * frontRun * shoulderEase;
      return [routedX, y, torsoFrontZ(routedX, y) + frontLift(y)];
    });
    const knotPoint = [-0.236, 0.952, 0.074];
    points.unshift(knotPoint.slice(), [-0.218, 0.977, 0.084]);
    // Continue the rear band around the right hip into the same front knot.
    const backHip = points[points.length - 1];
    const hipCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(...backHip),
        new THREE.Vector3(-0.233, 0.977, -0.07),
        new THREE.Vector3(-0.246, 0.957, 0),
        new THREE.Vector3(...knotPoint)
      ],
      false,
      'centripetal'
    );
    for (let i = 1; i <= 28; i++) points.push(hipCurve.getPoint(i / 28).toArray());

    // Subdivide across the cloth as well as along it so belt edges do not cut
    // through a large diagonal triangle whose corner vertices are clear.
    const widths = points.map(([, y, z]) => {
      const chestTaper = z > 0 ? smooth(1.235, 1.275, y) * (1 - smooth(1.335, 1.405, y)) : 0;
      return 0.078 - 0.014 * chestTaper;
    });
    const guide = makeRibbonGeo(points, widths);
    const guideVertices = guide.attributes.position;
    const clothPositions = [],
      clothUvs = [],
      clothIndices = [],
      across = 12;
    for (let row = 0; row < points.length; row++) {
      const left = new THREE.Vector3().fromBufferAttribute(guideVertices, row * 2);
      const right = new THREE.Vector3().fromBufferAttribute(guideVertices, row * 2 + 1);
      for (let column = 0; column <= across; column++) {
        const u = column / across,
          point = left.clone().lerp(right, u);
        clothPositions.push(point.x, point.y, point.z);
        clothUvs.push(u, row / (points.length - 1));
      }
    }
    for (let row = 0; row < points.length - 1; row++)
      for (let column = 0; column < across; column++) {
        const a = row * (across + 1) + column,
          b = a + across + 1;
        clothIndices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    guide.dispose();
    const geometry = new THREE.BufferGeometry();
    setAttr(geometry, 'position', clothPositions, 3);
    setAttr(geometry, 'uv', clothUvs, 2);
    geometry.setIndex(clothIndices);
    const crossingAdjuster = uniformGroup.getObjectByName('haversackAdjuster');
    const hardwareBounds = crossingAdjuster ? new THREE.Box3().setFromObject(crossingAdjuster) : null;
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i),
        y = vertices.getY(i),
        z = vertices.getZ(i);
      if (y < 0.995 || Math.abs(z) < 0.008) continue;
      if (z > 0) {
        const upperBlend = smooth(1.05, 1.085, y);
        let target = Math.max(z, garmentFrontZ(x, y) + 0.006 + 0.014 * upperBlend);
        if (hardwareBounds) {
          // Ease the cloth over the whole brass frame, with a soft drape outside
          // its footprint. This also clears the frame's tilted front edge.
          const outsideX = Math.max(hardwareBounds.min.x - x, 0, x - hardwareBounds.max.x);
          const outsideY = Math.max(hardwareBounds.min.y - y, 0, y - hardwareBounds.max.y);
          const drape = (1 - smooth(0, 0.03, outsideX)) * (1 - smooth(0, 0.03, outsideY));
          target += Math.max(0, hardwareBounds.max.z + 0.003 - target) * drape;
        }
        // The black belt physically occludes the front sash.
        if (y <= 1.05 && Math.abs(x) < 0.224) {
          target = Math.min(target, beltZ(x) - 0.003);
        }
        vertices.setZ(i, target);
      } else {
        let target = Math.min(z, -torsoFrontZ(x, y) - 0.017);
        // The back sash lies outside the rear leather band.
        if (y <= 1.055 && Math.abs(x) < 0.224) {
          const blend = 1 - smooth(1.042, 1.055, y);
          const overBelt = -beltZ(x) - 0.005;
          target = Math.min(target, target + (overBelt - target) * blend);
        }
        vertices.setZ(i, target);
      }
    }
    geometry.computeVertexNormals();
    const sash = new THREE.Mesh(geometry, sashMat);
    sash.name = 'oppositeDiagonalRankSash';
    sash.castShadow = true;
    sashGroup.add(sash);

    const knot = new THREE.Group();
    knot.name = 'rightHipSashKnot';
    knot.position.set(...knotPoint);
    knot.rotation.y = -0.4;
    const knotGeometry = new THREE.SphereGeometry(1, 24, 16);
    knotGeometry.scale(0.034, 0.024, 0.014);
    const knotMesh = new THREE.Mesh(knotGeometry, sashMat);
    knotMesh.rotation.z = -0.25;
    knot.add(knotMesh);
    const keeper = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.045, 0.008), sashMat);
    keeper.position.z = 0.012;
    keeper.rotation.z = -0.25;
    knot.add(keeper);
    sashGroup.add(knot);

    // Two broad hanging ends finish in short strands, rather than a solid comb.
    const makeTail = (offsetX, endY, width, frontOffset, lean) => {
      const positions = [],
        uvs = [],
        indices = [];
      const rows = 32,
        columns = 6;
      for (let row = 0; row <= rows; row++) {
        const t = row / rows;
        const centerX = knotPoint[0] + offsetX + lean * t;
        const y = 0.943 + (endY - 0.943) * t;
        const z = knotPoint[2] + frontOffset + 0.008 * Math.sin(t * Math.PI);
        for (let column = 0; column <= columns; column++) {
          const u = column / columns;
          positions.push(
            centerX + (u - 0.5) * width,
            y + 0.006 * (u - 0.5) * t,
            z + 0.0018 * Math.sin(u * Math.PI * 4) * Math.sin(t * Math.PI)
          );
          uvs.push(u, t);
        }
      }
      for (let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++) {
          const a = row * (columns + 1) + column,
            b = a + columns + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      const tailGeometry = new THREE.BufferGeometry();
      setAttr(tailGeometry, 'position', positions, 3);
      setAttr(tailGeometry, 'uv', uvs, 2);
      tailGeometry.setIndex(indices);
      tailGeometry.computeVertexNormals();
      const tail = new THREE.Mesh(tailGeometry, sashMat);
      tail.name = 'hangingSashEnd';
      tail.castShadow = true;
      sashGroup.add(tail);
      for (let strand = 0; strand < 16; strand++) {
        const u = strand / 15;
        const x = knotPoint[0] + offsetX + lean + (u - 0.5) * width;
        const y = endY + 0.006 * (u - 0.5);
        const length = 0.034 + 0.004 * Math.cos(strand * 1.7);
        const fringe = new THREE.Mesh(new THREE.CylinderGeometry(0.00105, 0.0008, length, 5), sashMat);
        fringe.position.set(x, y - length / 2, knotPoint[2] + frontOffset);
        fringe.rotation.z = 0.045 * Math.sin(strand * 1.3);
        fringe.name = 'sashFringe';
        sashGroup.add(fringe);
      }
    };
    makeTail(-0.008, 0.69, 0.06, -0.007, -0.006);
    makeTail(0.012, 0.653, 0.064, 0.007, -0.004);

    uniformGroup.add(sashGroup);
    updateSashForRank(window.BBMUniform3D.state.rank);
  }

  // Sergeant = red sash, Staff Sergeant = blue sash, other ranks = no sash
  function updateSashForRank(rank) {
    if (!sashGroup || !sashMat) return;
    sashGroup.visible = rank === 'Sergeant' || rank === 'Staff Sergeant';
    if (rank === 'Sergeant') sashMat.color.setHex(0xc82029).convertSRGBToLinear();
    else if (rank === 'Staff Sergeant') sashMat.color.setHex(0x244fc6).convertSRGBToLinear();
  }

  // NCO lanyard is only worn by NCOs (Lance Corporal and above) - Section 4.2.6a
  let lanyardToggleOn = true;
  function refreshLanyardVisibility() {
    if (!lanyardGroup) return;
    lanyardGroup.visible = lanyardToggleOn && !!window.BBMUniform3D.state.rank;
  }

  /* ── 8. Name Tag on LEFT Chest & Link Badge (Section 4.2.5 & 4.4.3) ── */
  function buildNametagAndLinkBadge() {
    // Regulation 4.2.5a: "Name tags shall be on the left side, just above the breast pocket."
    nametagCanvas = document.createElement('canvas');
    nametagCanvas.width = 512;
    nametagCanvas.height = 148;
    nametagCtx = nametagCanvas.getContext('2d');
    nametagTex = makeColorTexture(nametagCanvas);

    updateNametagTexture();

    const nametagMat = new THREE.MeshStandardMaterial({
      map: nametagTex,
      roughness: 0.65,
      metalness: 0
    });

    const x = SL * BREAST_POCKET.x;
    const tagHeight = 0.022;
    // Model dimensions are in meters. Measure the gap from the top of the flap.
    const tagBottom = BREAST_POCKET.y + BREAST_POCKET.flapTop + 0.005;
    const tagY = tagBottom + tagHeight / 2;
    nametagMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.075, tagHeight), nametagMat);
    nametagMesh.name = 'nametag';
    nametagMesh.position.set(x, tagY, torsoFrontZ(x, tagY) + 0.006);
    nametagMesh.rotation.y = torsoFrontAngle(x, tagY);
    uniformGroup.add(nametagMesh);

    const image = imageCache[LEFT_IMAGES.link];
    if (!image) return;
    const map = new THREE.Texture(image);
    map.encoding = THREE.sRGBEncoding;
    map.needsUpdate = true;
    const linkHeight = 0.030;
    // Link Badge.png has 126 transparent rows beneath the artwork in a 623 px image.
    const linkBottomInset = linkHeight * (126 / 623);
    const linkY = tagBottom + tagHeight + 0.010 + linkHeight / 2 - linkBottomInset;
    const linkBadge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.040, linkHeight),
      new THREE.MeshStandardMaterial({ map, alphaTest: 0.35, roughness: 0.64 })
    );
    linkBadge.visible = false;
    linkBadge.name = 'linkBadge';
    linkBadge.position.set(x, linkY, torsoFrontZ(x, linkY) + 0.005);
    linkBadge.rotation.y = torsoFrontAngle(x, linkY);
    uniformGroup.add(linkBadge);
  }

  function syncNametagFromPlanner() {
    const tag = document.getElementById('nametag');
    window.BBMUniform3D.state.gender = tag?.classList.contains('nametag-blue') ? 'female' : 'male';
    updateAvatarPresentation();
    updateNametagTexture();
  }

  function updateAvatarPresentation() {
    const head = mannequinGroup?.getObjectByName('attentionHead');
    if (!head || !uniformGroup) return;
    const girl = window.BBMUniform3D.state.gender === 'female';
    if (!femaleHairGroup) {
      femaleHairGroup = new THREE.Group();
      femaleHairGroup.name = 'femaleHair';
      const material = head.getObjectByName('croppedHair').material;
      const shape = new THREE.SphereGeometry(1, 24, 18);
      const back = new THREE.Mesh(shape, material);
      back.scale.set(0.074, 0.066, 0.03);
      back.position.set(0, -0.03, -0.064);
      femaleHairGroup.add(back);
      const bun = new THREE.Mesh(shape, material);
      bun.name = 'tiedHairBun';
      bun.scale.set(0.03, 0.028, 0.023);
      bun.position.set(0, -0.07, -0.11);
      femaleHairGroup.add(bun);
      for (const side of [SR, SL]) {
        const sideHair = new THREE.Mesh(shape, material);
        sideHair.scale.set(0.01, 0.03, 0.017);
        sideHair.position.set(side * 0.083, -0.001, -0.017);
        femaleHairGroup.add(sideHair);
      }
      head.add(femaleHairGroup);
    }
    femaleHairGroup.visible = girl;
    head.scale.set(girl ? 0.93 : 1, girl ? 0.98 : 1, girl ? 0.97 : 1);
    mannequinGroup.scale.x = girl ? 0.96 : 1;
    uniformGroup.scale.x = girl ? 0.96 : 1;
  }

  function updateNametagTexture() {
    if (!nametagCtx) return;
    const ctx = nametagCtx;
    const w = nametagCanvas.width,
      h = nametagCanvas.height;
    const girl = window.BBMUniform3D.state.gender === 'female';
    ctx.fillStyle = girl ? '#198fc5' : '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = girl ? '#087bad' : '#17202c';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    ctx.fillStyle = girl ? '#ffffff' : '#111111';

    const name = document.getElementById('nametag-name')?.innerText.trim().toUpperCase() || 'NAME';
    const company = document.getElementById('nametag-company')?.innerText.trim().toUpperCase() || 'COMPANY';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 40px "DM Sans", Arial, sans-serif';
    ctx.fillText(name, w / 2, 53, w - 26);
    ctx.font = '500 27px "DM Sans", Arial, sans-serif';
    ctx.fillText(company, w / 2, 107, w - 26);
    nametagTex.needsUpdate = true;
  }

  function drawShoulderFlash(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(width / 384, height / 152);

    // A shallow cloth arc follows the sleeve; its edge stays navy, as in the uniform.
    const tracePatch = (inset = 0) => {
      ctx.beginPath();
      ctx.moveTo(24 + inset, 39 + inset);
      ctx.quadraticCurveTo(192, 4 + inset, 360 - inset, 39 + inset);
      ctx.quadraticCurveTo(373 - inset, 42 + inset, 371 - inset, 57 + inset);
      ctx.lineTo(363 - inset, 124 - inset);
      ctx.quadraticCurveTo(362 - inset, 137 - inset, 348 - inset, 134 - inset);
      ctx.quadraticCurveTo(192, 108 - inset, 36 + inset, 134 - inset);
      ctx.quadraticCurveTo(22 + inset, 137 - inset, 21 + inset, 124 - inset);
      ctx.lineTo(13 + inset, 57 + inset);
      ctx.quadraticCurveTo(11 + inset, 42 + inset, 24 + inset, 39 + inset);
      ctx.closePath();
    };

    tracePatch();
    ctx.fillStyle = '#111c2d';
    ctx.fill();
    ctx.strokeStyle = '#0b1422';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Sparse, low-contrast weave remains quieter than the embroidered lettering.
    ctx.save();
    ctx.clip();
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = 'rgba(142, 158, 180, 0.055)';
    ctx.beginPath();
    for (let y = 17; y < 145; y += 4) {
      ctx.moveTo(8, y);
      ctx.lineTo(376, y);
    }
    for (let x = 12; x < 376; x += 5) {
      ctx.moveTo(x, 15);
      ctx.lineTo(x - 6, 145);
    }
    ctx.stroke();
    ctx.restore();

    tracePatch(5);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#344155';
    ctx.setLineDash([2, 3.5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Place letters individually so the first line arches without bending the type.
    const embroiderLine = (text, y, fontSize, tracking, maxWidth, rise) => {
      ctx.font = `900 ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const letters = Array.from(text);
      const advances = letters.map((letter) => ctx.measureText(letter).width);
      const naturalWidth =
        advances.reduce((sum, advance) => sum + advance, 0) + tracking * (letters.length - 1);
      const fit = Math.min(1, maxWidth / naturalWidth);
      const lineWidth = naturalWidth * fit;
      let cursor = -lineWidth / 2;

      letters.forEach((letter, index) => {
        const advance = advances[index] * fit;
        const x = cursor + advance / 2;
        const t = x / (lineWidth / 2);
        const letterY = y - rise * (1 - t * t);
        const tangent = Math.atan((4 * rise * t) / lineWidth);
        if (letter !== ' ') {
          ctx.save();
          ctx.translate(192 + x, letterY);
          ctx.rotate(tangent);
          ctx.scale(fit, 1);
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#b9c2ca';
          ctx.lineWidth = 0.9;
          ctx.strokeText(letter, 0, 0.35);
          ctx.fillStyle = '#f5f5ed';
          ctx.fillText(letter, 0, 0);
          ctx.restore();
        }
        cursor += advance + tracking * fit;
      });
    };

    embroiderLine('BRIGED PUTERA', 69, 33, 1.3, 310, 14);
    embroiderLine('MALAYSIA', 96, 30, 2.8, 202, 0);
    ctx.restore();
  }

  function paintArmletCloth(ctx) {
    ctx.fillStyle = '#22242a';
    ctx.fillRect(0, 0, ARMLET_WIDTH, ARMLET_HEIGHT);
    ctx.strokeStyle = '#15171b';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, ARMLET_WIDTH - 16, ARMLET_HEIGHT - 16);
    ctx.strokeStyle = '#42444b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 6]);
    ctx.strokeRect(20, 20, ARMLET_WIDTH - 40, ARMLET_HEIGHT - 40);
    ctx.setLineDash([]);
  }

  function paintBadge(ctx, url, x, y, size, advanced = false) {
    const img = imageCache[url];
    if (!img || !img.naturalWidth) return;

    if (advanced) {
      ctx.fillStyle = '#aa101b';
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    const scale = size * (advanced ? 0.80 : 1) / Math.max(img.naturalWidth, img.naturalHeight);
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
  }

  function renderRightArmlet(state) {
    if (!rightArmlet) return;
    const { ctx, texture, mesh } = rightArmlet;
    const badges = ALL_PROF.filter(({ id }) => state.badges[id]?.basic || state.badges[id]?.advanced);
    badges.sort((a, b) => (b.id === 'target') - (a.id === 'target') || a.name.localeCompare(b.name));
    const rankCounts = { 'Lance Corporal': 1, 'Corporal': 2, 'Sergeant': 3, 'Staff Sergeant': 4 };
    const stripes = rankCounts[window.BBMUniform3D.state.rank] || 0;
    mesh.visible = badges.length > 0 || stripes > 0;
    if (!mesh.visible) return;

    paintArmletCloth(ctx);

    const margin = 48, gap = 12, columns = 5;
    const stripeDepth = 24, stripeThickness = 10, stripeSpacing = 21;
    const chevronHeight = stripes ? stripeDepth + stripeThickness + (stripes - 1) * stripeSpacing : 0;
    const chevronTop = ARMLET_HEIGHT - margin - chevronHeight;
    const badgeBottom = stripes ? chevronTop - gap * 2 : ARMLET_HEIGHT - margin;
    const rows = Math.ceil(badges.length / columns);
    const size = Math.min(90, (badgeBottom - margin - gap * (rows - 1)) / Math.max(rows, 1));
    const pitch = (ARMLET_WIDTH - 2 * margin - size) / (columns - 1);

    badges.forEach(({ id }, index) => {
      const row = Math.floor(index / columns);
      const start = row * columns;
      const items = Math.min(columns, badges.length - start);
      const startX = row === 0 ? margin + size / 2 : (ARMLET_WIDTH - (items - 1) * pitch) / 2;
      paintBadge(ctx, RIGHT_IMAGES[id],
        startX + (index - start) * pitch, margin + row * (size + gap) + size / 2,
        size, state.badges[id].advanced);
    });

    ctx.strokeStyle = '#f2efe4';
    ctx.lineWidth = stripeThickness;
    const center = ARMLET_WIDTH / 2;
    for (let i = 0; i < stripes; i++) {
      const y = chevronTop + stripeThickness / 2 + i * stripeSpacing;
      ctx.beginPath();
      ctx.moveTo(center - 164, y);
      ctx.lineTo(center, y + stripeDepth);
      ctx.lineTo(center + 164, y);
      ctx.stroke();
    }
    texture.needsUpdate = true;
  }

  function renderLeftArmlet(state) {
    if (!leftArmlet) return;
    const { ctx, texture, mesh, artworkScaleX } = leftArmlet;
    const { service, special } = state;
    const rows = [
      [special.founders_award && 'founders_award'],
      [special.presidents_award && 'presidents_award', special.gold_award && 'gold_award', special.dofe && 'dofe_' + special.dofe],
      [special.gold_scholastic && 'gold_scholastic', special.silver_scholastic && 'silver_scholastic', special.bronze_scholastic && 'bronze_scholastic'],
      [service.long_year && 'long_year', special.nco_proficiency && 'nco_proficiency', service.three_year && 'three_year'],
      [service.junior_section && 'junior_section', ...Array.from({ length: service.one_year_count }, () => 'one_year')]
    ].flatMap((row, index) => {
      const ids = row.filter(Boolean);
      if (!ids.length) return [];

      const serviceStars = index === 4;
      const baseSize = serviceStars ? Math.min(66, (ARMLET_WIDTH - 96) / ids.length - 7) : 112;
      const badges = ids.map(id => {
        const award = LEFT_AWARD_STYLE[id];
        // Convert extra planner pixels from the 64 px baseline to armlet texture units.
        const size = baseSize * ((award?.size ?? 1) + (award?.extraPixels ?? 0) / 64);
        return { id, size };
      });
      const height = Math.max(...badges.map(badge => badge.size));
      return [{ badges, height, pitch: serviceStars ? baseSize + 7 : 150 }];
    });

    mesh.visible = rows.length > 0;
    if (!mesh.visible) return;

    paintArmletCloth(ctx);
    const rowGap = 22;
    const stackHeight = rows.reduce((height, row) => height + row.height, (rows.length - 1) * rowGap);
    let top = (ARMLET_HEIGHT - stackHeight) / 2;
    for (const { badges, height, pitch } of rows) {
      const y = top + height / 2;
      badges.forEach(({ id, size }, column) => {
        const x = (ARMLET_WIDTH + (2 * column - badges.length + 1) * pitch) / 2;
        const award = LEFT_AWARD_STYLE[id];
        if (award) {
          // Keep award proportions on the curved cloth, whose texels are wider than they are tall.
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(artworkScaleX, 1);
          paintBadge(ctx, LEFT_IMAGES[id], 0, 0, size * award.artScale);
          ctx.restore();
        } else {
          paintBadge(ctx, LEFT_IMAGES[id], x, y, size);
        }
      });
      top += height + rowGap;
    }
    texture.needsUpdate = true;
  }

  function updateLinkBadgeVisibility(state = window.BadgeState?.getState()) {
    const link = uniformGroup?.getObjectByName('linkBadge');
    if (link) link.visible = !!state?.service.link && window.BBMUniform3D.state.nametagVisible;
  }

  /* ══════════════════════════════════════════════════════════
     STATE SYNCHRONIZATION WITH BADGESTATE
  ══════════════════════════════════════════════════════════ */
  function syncFromPlanner() {
    if (!window.BadgeState) return;
    const state = window.BadgeState.getState();
    updateRank(state.rank);
    renderRightArmlet(state);
    renderLeftArmlet(state);
    syncNametagFromPlanner();
    updateLinkBadgeVisibility(state);
    updateBadgeCountDisplay(state);
  }

  function updateRank(rank) {
    window.BBMUniform3D.state.rank = rank;
    updateSashForRank(rank);
    refreshLanyardVisibility();

    document.querySelectorAll('.u3d-rank-pill').forEach(btn => {
      const active = btn.dataset.rank === (rank || 'none');
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function setRank(rank, notifyPlanner = true) {
    if (notifyPlanner && window.BadgeState) {
      if (window.BadgeState.getState().rank !== rank) window.BadgeState.setRank(rank);
      if (!window.BBMUniform3D.isOpen) syncFromPlanner();
      return;
    }
    updateRank(rank);
    if (window.BadgeState) renderRightArmlet(window.BadgeState.getState());
  }

  function updateBadgeCountDisplay(state) {
    let count = 0;
    if (state.badges) {
      Object.keys(state.badges).forEach(k => {
        if (state.badges[k].basic || state.badges[k].advanced) count++;
      });
    }
    if (state.service) {
      if (state.service.link) count++;
      if (state.service.junior_section) count++;
      if (state.service.three_year) count++;
      if (state.service.long_year) count++;
      count += (state.service.one_year_count || 0);
    }
    if (state.special) {
      if (state.special.nco_proficiency) count++;
      if (state.special.bronze_scholastic) count++;
      if (state.special.silver_scholastic) count++;
      if (state.special.gold_scholastic) count++;
      if (state.special.gold_award) count++;
      if (state.special.dofe) count++;
      if (state.special.presidents_award) count++;
      if (state.special.founders_award) count++;
    }

    const pill = document.getElementById('u3d-active-count');
    if (pill) pill.textContent = count;

    const summary = document.getElementById('u3d-badge-summary');
    if (summary) {
      const rankText = state.rank ? state.rank : 'Private';
      summary.innerHTML = `Rank: <strong>${rankText}</strong> · Displaying <strong>${count}</strong> selected badges on the uniform.`;
    }
  }

  /* ══════════════════════════════════════════════════════════
     EXAMPLE OF A PRESIDENT'S BADGE ACHIEVER (one-click preset)
  ══════════════════════════════════════════════════════════ */
  function applyPresidentLoadout() {
    if (!window.BadgeState) return;
    const bs = window.BadgeState;

    // 1. Reset state
    bs.reset();

    // 2. Rank: Lance Corporal
    bs.setRank('Lance Corporal');

    // 3. Service badges: Three Year Service + One Year Service
    bs.setServiceYears(3);

    // 4. Highest award: President's Award & NCO Proficiency Star
    bs.setPresidentsAwardUnlocked(true);
    const cur = bs.getState();
    if (!cur.special.nco_proficiency) bs.toggleSpecial('nco_proficiency');
    if (!cur.special.presidents_award) bs.toggleSpecial('presidents_award');

    // 5. 10 proficiency badges (Target first, then alphabetical)
    bs.toggleBadgeLevel('target', 'basic');
    bs.toggleBadgeLevel('christian_ed', 'advanced');
    bs.toggleBadgeLevel('drill', 'advanced');
    bs.toggleBadgeLevel('environmental_conservation', 'advanced');
    bs.toggleBadgeLevel('expedition', 'basic');
    bs.toggleBadgeLevel('fire_and_rescue', 'advanced');
    bs.toggleBadgeLevel('first_aid', 'advanced');
    bs.toggleBadgeLevel('international_relations', 'advanced');
    bs.toggleBadgeLevel('recruitment', 'basic');
    bs.toggleBadgeLevel('sports', 'basic');

    // 6. Name tag text; preserve the selected boy/girl design.
    const nameEl = document.getElementById('nametag-name');
    const compEl = document.getElementById('nametag-company');
    const tagBox = document.getElementById('nametag');
    if (nameEl) nameEl.innerText = 'NG YUAN XIN';
    if (compEl) compEl.innerText = '1ST KUALA LUMPUR COMPANY';
    if (tagBox) {
      tagBox.style.removeProperty('background');
      tagBox.style.removeProperty('color');
    }

    // 7. Update textures and UI
    syncFromPlanner();
    setCameraView('front');
  }

  function clearAllBadges() {
    if (window.BadgeState) {
      window.BadgeState.reset();
      syncFromPlanner();
    }
  }

  /* ══════════════════════════════════════════════════════════
     CAMERA PRESET FOCUS (Instantly Snaps Viewport)
  ══════════════════════════════════════════════════════════ */
  function setCameraView(viewName) {
    const preset = CAMERA_PRESET_VIEWS[viewName];
    if (!preset || !camera) return;

    window.BBMUniform3D.state.currentView = viewName;

    document.querySelectorAll('.u3d-preset-btn').forEach(btn => {
      const active = btn.dataset.view === viewName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    viewAngle = preset.angle;
    viewHeight = preset.y;
    updateCameraPose();
  }

  function setZoom(percent) {
    const level = THREE.MathUtils.clamp(Math.round(percent / ZOOM_STEP) * ZOOM_STEP, FIT_ZOOM, 100);
    window.BBMUniform3D.state.zoomPercent = level;
    zoomInput.value = level;
    zoomValue.value = level + '%';
    zoomInput.setAttribute('aria-valuetext', zoomValue.value);
    zoomOutButton.disabled = level === FIT_ZOOM;
    zoomInButton.disabled = level === 100;
    if (camera) {
      camera.zoom = level / FIT_ZOOM;
      camera.updateProjectionMatrix();
      updateCameraPose();
    }
  }

  function stepZoom(steps) {
    setZoom(window.BBMUniform3D.state.zoomPercent + steps * ZOOM_STEP);
  }

  function bindViewerGestures(canvas) {
    const pointers = new Map();
    const dragThreshold = 5;
    const pinchStepRatio = 1.10;
    let dragAxis = null, pinchStart = 0;

    function distanceBetweenPointers() {
      const [first, second] = pointers.values();
      return Math.hypot(first.x - second.x, first.y - second.y);
    }

    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragAxis = null;
      pinchStart = pointers.size === 2 ? distanceBetweenPointers() : 0;
    });

    canvas.addEventListener('pointermove', event => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const point = { x: event.clientX, y: event.clientY };

      if (pointers.size > 1) {
        pointers.set(event.pointerId, point);
        if (pointers.size !== 2 || !pinchStart) return;
        const distance = distanceBetweenPointers();
        if (!distance) return;
        const steps = Math.trunc(Math.log(distance / pinchStart) / Math.log(pinchStepRatio));
        if (steps) {
          stepZoom(steps);
          pinchStart *= pinchStepRatio ** steps;
        }
        return;
      }

      const dx = point.x - previous.x, dy = point.y - previous.y;
      if (!dragAxis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < dragThreshold) return;
        dragAxis = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
      }
      pointers.set(event.pointerId, point);

      if (dragAxis === 'horizontal') {
        viewAngle = (viewAngle - dx * 2 * Math.PI / canvas.clientWidth) % (2 * Math.PI);
      } else {
        viewHeight += dy * fittedHeight() / (canvas.clientHeight * camera.zoom);
      }
      updateCameraPose();
    });

    function endPointer(event) {
      if (!pointers.delete(event.pointerId)) return;
      dragAxis = null;
      pinchStart = pointers.size === 2 ? distanceBetweenPointers() : 0;
    }
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      canvas.addEventListener(type, endPointer);
    }

    let wheelPixels = 0, lastWheelTime = 0;
    const pixelsPerStep = 80;
    canvas.addEventListener('wheel', event => {
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? canvas.clientHeight : 1);
      if (event.timeStamp - lastWheelTime > 200 || Math.sign(delta) !== Math.sign(wheelPixels)) {
        wheelPixels = 0;
      }
      lastWheelTime = event.timeStamp;
      wheelPixels += delta;
      const steps = Math.trunc(wheelPixels / pixelsPerStep);
      wheelPixels -= steps * pixelsPerStep;
      if (steps) stepZoom(-steps);
    }, { passive: false });

  }

  function fittedHeight(preset = CAMERA_PRESET_VIEWS[window.BBMUniform3D.state.currentView]) {
    return Math.max(preset.height, preset.width / camera.aspect);
  }

  function updateCameraPose() {
    const preset = CAMERA_PRESET_VIEWS[window.BBMUniform3D.state.currentView];
    const height = fittedHeight(preset);
    const distance = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    // Allow a little room around the head and shoes, without panning past the uniform.
    const inset = 0.4 * height / camera.zoom;
    viewHeight = THREE.MathUtils.clamp(viewHeight,
      Math.min(preset.y, UNIFORM_BOTTOM + inset), Math.max(preset.y, UNIFORM_TOP - inset));

    const x = Math.sin(viewAngle), z = Math.cos(viewAngle);
    const radius = distance + preset.offset;
    camera.position.set(x * radius, viewHeight, z * radius);
    camera.lookAt(x * preset.offset, viewHeight, z * preset.offset);
  }

  /* ══════════════════════════════════════════════════════════
     MAIN RENDER LOOP & RESIZE
  ══════════════════════════════════════════════════════════ */
  function animate() {
    animFrameId = requestAnimationFrame(animate);

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    const container = document.getElementById('u3d-canvas-container');
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    updateCameraPose();
    renderer.setSize(width, height, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOM);
  } else {
    initDOM();
  }

})();