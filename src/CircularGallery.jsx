import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';
import './CircularGallery.css';

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

class Media {
  constructor({ geometry, gl, image, index, length, scene, screen, viewport, bend, borderRadius, data }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.borderRadius = borderRadius;
    this.data = data;
    this.extra = 0;
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.08 + uSpeed * 0.38);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uTextureReady;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha * uTextureReady);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uTextureReady: { value: 0 },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      const textureSource = this.createTextureSource(img);
      texture.image = textureSource;
      this.program.uniforms.uImageSizes.value = [textureSource.width, textureSource.height];
      this.program.uniforms.uTextureReady.value = 1;
    };
  }

  createTextureSource(img) {
    const maxTextureSize = Math.min(this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE) || 4096, 4096);
    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;
    const longestSide = Math.max(sourceWidth, sourceHeight);

    if (longestSide <= maxTextureSize) {
      return img;
    }

    const scale = maxTextureSize / longestSide;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext('2d', { alpha: false });
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const halfViewport = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const bendAbs = Math.abs(this.bend);
      const radius = (halfViewport * halfViewport + bendAbs * bendAbs) / (2 * bendAbs);
      const effectiveX = Math.min(Math.abs(x), halfViewport);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = Math.abs(this.speed);

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = ((this.viewport.height * (900 * this.scale)) / this.screen.height) * 1.1;
    this.plane.scale.x = this.plane.scale.y * 0.75;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 1.2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  containsPoint(x, y) {
    const centerX = (this.plane.position.x / this.viewport.width + 0.5) * this.screen.width;
    const centerY = (0.5 - this.plane.position.y / this.viewport.height) * this.screen.height;
    const width = (this.plane.scale.x / this.viewport.width) * this.screen.width;
    const height = (this.plane.scale.y / this.viewport.height) * this.screen.height;
    return x >= centerX - width / 2 && x <= centerX + width / 2 && y >= centerY - height / 2 && y <= centerY + height / 2;
  }
}

class GalleryApp {
  constructor(container, { items, bend, borderRadius, scrollSpeed, scrollEase, autoSpeed, onItemClick }) {
    this.container = container;
    this.items = items;
    this.bend = bend;
    this.borderRadius = borderRadius;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.autoSpeed = autoSpeed;
    this.onItemClick = onItemClick;
    this.isPaused = false;
    this.isDown = false;
    this.start = 0;
    this.dragDistance = 0;
    this.createRenderer();
    this.createCamera();
    this.scene = new Transform();
    this.createGeometry();
    this.onResize();
    this.createMedias();
    this.fillInitialViewport();
    this.addEventListeners();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias() {
    const medias = this.items.concat(this.items);
    this.medias = medias.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: medias.length,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        bend: this.bend,
        borderRadius: this.borderRadius,
        data,
      });
    });
  }

  fillInitialViewport() {
    if (!this.medias?.[0]) return;
    const firstWidth = this.medias[0].width || 1;
    const visibleCount = Math.ceil(this.viewport.width / firstWidth);
    const initialOffset = Math.max(0, Math.floor(visibleCount / 2) * firstWidth);
    this.scroll.current = initialOffset;
    this.scroll.target = initialOffset;
    this.scroll.last = initialOffset;
    this.medias.forEach((media) => media.update(this.scroll, 'right'));
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
      this.fillInitialViewport();
    }
  };

  onPointerDown = (event) => {
    this.isDown = true;
    this.dragDistance = 0;
    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientX : event.clientX;
  };

  onPointerMove = (event) => {
    if (!this.isDown) return;
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.dragDistance = Math.max(this.dragDistance, Math.abs(x - this.start));
    this.scroll.target = this.scroll.position + distance;
  };

  onPointerUp = (event) => {
    if (!this.isDown) return;
    this.isDown = false;
    if (this.dragDistance > 8) return;
    const rect = this.container.getBoundingClientRect();
    const point = event.changedTouches ? event.changedTouches[0] : event;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    const hit = [...this.medias].reverse().find((media) => media.containsPoint(x, y));
    if (hit) this.onItemClick?.(hit.data);
  };

  onWheel = (event) => {
    this.scroll.target += (event.deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
  };

  onMouseEnter = () => {
    this.isPaused = true;
  };

  onMouseLeave = () => {
    this.isPaused = false;
  };

  update = () => {
    if (!this.isPaused && !this.isDown) {
      this.scroll.target += this.autoSpeed;
    }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    this.medias?.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    this.container.addEventListener('wheel', this.onWheel, { passive: true });
    this.container.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    this.container.addEventListener('touchstart', this.onPointerDown, { passive: true });
    window.addEventListener('touchmove', this.onPointerMove, { passive: true });
    window.addEventListener('touchend', this.onPointerUp);
    this.container.addEventListener('mouseenter', this.onMouseEnter);
    this.container.addEventListener('mouseleave', this.onMouseLeave);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('wheel', this.onWheel);
    this.container.removeEventListener('mousedown', this.onPointerDown);
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    this.container.removeEventListener('touchstart', this.onPointerDown);
    window.removeEventListener('touchmove', this.onPointerMove);
    window.removeEventListener('touchend', this.onPointerUp);
    this.container.removeEventListener('mouseenter', this.onMouseEnter);
    this.container.removeEventListener('mouseleave', this.onMouseLeave);
    if (this.gl?.canvas?.parentNode) {
      this.gl.canvas.parentNode.removeChild(this.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 2,
  borderRadius = 0.08,
  scrollSpeed = 3,
  scrollEase = 0.08,
  autoSpeed = 0.018,
  onItemClick,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const app = new GalleryApp(containerRef.current, {
      items,
      bend,
      borderRadius,
      scrollSpeed,
      scrollEase,
      autoSpeed,
      onItemClick,
    });
    return () => app.destroy();
  }, [items, bend, borderRadius, scrollSpeed, scrollEase, autoSpeed, onItemClick]);

  return <div className="circular-gallery" ref={containerRef} aria-label="作品图片循环画廊" />;
}
