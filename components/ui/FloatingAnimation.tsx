'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

// TNCC Official Brand Colors
const TNCC_DARK_COLORS = [
  '#2AC8D1', // Cyan
  '#FA4618', // Orange
  '#1C5BA0', // Radiant Navy for dark contrast
  '#FDB81B', // Yellow
];

const TNCC_LIGHT_COLORS = [
  '#2AC8D1', // Cyan
  '#FA4618', // Orange
  '#0D457F', // Deep Navy
  '#FDB81B', // Yellow
];

const VERT = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[4];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uAlphaMultiplier;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );

  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

vec3 getColor(float factor) {
  float scaled = clamp(factor, 0.0, 1.0) * 3.0;
  int index = min(int(floor(scaled)), 2);
  float localFactor = fract(scaled);

  return mix(
    uColorStops[index],
    uColorStops[index + 1],
    localFactor
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 rampColor = getColor(uv.x);

  float height = snoise(
    vec2(
      uv.x * 2.0 + uTime * 0.08,
      uTime * 0.20
    )
  ) * 0.5 * uAmplitude;

  height = exp(height);
  height = uv.y * 2.0 - height + 0.2;

  float intensity = 0.6 * height;
  float midPoint = 0.20;

  float animationAlpha = smoothstep(
    midPoint - uBlend * 0.5,
    midPoint + uBlend * 0.5,
    intensity
  ) * uAlphaMultiplier;

  fragColor = vec4(
    rampColor * animationAlpha,
    animationAlpha
  );
}
`;

function parseColor(color: string): [number, number, number] {
  if (typeof color !== 'string') return [0, 0, 0];
  let hex = color.trim();
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ];
    }
  }
  return [0, 0, 0];
}

interface FloatingAnimationProps {
  amplitude?: number;
  blend?: number;
  speed?: number;
  height?: string;
  maxFPS?: number;
  lightAlpha?: number;
  darkAlpha?: number;
}

export default function FloatingAnimation({
  amplitude = 1,
  blend = 0.5,
  speed = 0.9,
  height = '100%',
  maxFPS = 30,
  lightAlpha = 0.15,
  darkAlpha = 0.65,
}: FloatingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const propsRef = useRef({ amplitude, blend, speed, maxFPS, isDark, lightAlpha, darkAlpha });
  propsRef.current = { amplitude, blend, speed, maxFPS, isDark, lightAlpha, darkAlpha };

  // Detect and track theme changes without reinitializing WebGL
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let program: Program | null = null;
    let mesh: Mesh | null = null;
    let animationId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let destroyed = false;
    let visible = true;
    let contextLost = false;
    let lastFrame = 0;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25);

    const getColors = (dark: boolean) => (dark ? TNCC_DARK_COLORS : TNCC_LIGHT_COLORS).map(parseColor);

    const fallback = () => {
      if (!container) return;
      container.style.background = `
        radial-gradient(ellipse at 20% 40%, rgba(42, 200, 209, 0.18), transparent 55%),
        radial-gradient(ellipse at 80% 50%, rgba(250, 70, 24, 0.16), transparent 55%),
        radial-gradient(ellipse at 50% 100%, rgba(13, 69, 127, 0.22), transparent 60%)
      `;
    };

    function stopAnimation() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function renderOnce() {
      if (renderer && program && mesh && !contextLost) {
        renderer.render({ scene: mesh });
      }
    }

    function startAnimation() {
      if (
        destroyed ||
        contextLost ||
        document.hidden ||
        !visible ||
        reducedMotion.matches ||
        animationId !== null
      ) {
        return;
      }
      animationId = requestAnimationFrame(update);
    }

    function update(timestamp: number) {
      animationId = null;

      if (destroyed || contextLost || document.hidden || !visible) {
        return;
      }

      const current = propsRef.current;
      const frameInterval = 1000 / Math.max(1, current.maxFPS || 30);

      if (timestamp - lastFrame >= frameInterval) {
        lastFrame = timestamp;
        const elapsed = timestamp * 0.001 * current.speed;

        if (program && container) {
          program.uniforms.uTime.value = elapsed;
          program.uniforms.uBlend.value = current.blend;

          // Theme adaptation in real time
          program.uniforms.uColorStops.value = getColors(current.isDark);
          program.uniforms.uAlphaMultiplier.value = current.isDark
            ? (current.darkAlpha ?? 0.65)
            : (current.lightAlpha ?? 0.15);

          const baseHeight = 800;
          const currentHeight = container.offsetHeight || 1;
          program.uniforms.uAmplitude.value =
            current.amplitude * Math.min(2, baseHeight / currentHeight);

          renderOnce();
        }
      }

      animationId = requestAnimationFrame(update);
    }

    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: pixelRatio,
      });

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block';
      gl.canvas.style.background = 'transparent';

      const geometry = new Triangle(gl);
      if ((geometry.attributes as any).uv) {
        delete (geometry.attributes as any).uv;
      }

      const initialAlpha = propsRef.current.isDark
        ? (propsRef.current.darkAlpha ?? 0.65)
        : (propsRef.current.lightAlpha ?? 0.15);

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: getColors(propsRef.current.isDark) },
          uResolution: { value: [1, 1] },
          uBlend: { value: blend },
          uAlphaMultiplier: { value: initialAlpha },
        },
      });

      mesh = new Mesh(gl, { geometry, program });
      container.appendChild(gl.canvas);

      gl.canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        contextLost = true;
        stopAnimation();
        fallback();
      });

      function resize() {
        if (destroyed || !renderer || !container || !program) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;

        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width * pixelRatio, height * pixelRatio];
        renderOnce();
      }

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // Stop computation completely when user scrolls past the hero section
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible) {
            startAnimation();
          } else {
            stopAnimation();
          }
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(container);

      const onVisibilityChange = () => {
        if (document.hidden) {
          stopAnimation();
        } else {
          startAnimation();
        }
      };

      const onMotionChange = () => {
        if (reducedMotion.matches) {
          stopAnimation();
          renderOnce();
        } else {
          startAnimation();
        }
      };

      document.addEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.addEventListener('change', onMotionChange);

      resize();

      if (reducedMotion.matches) {
        renderOnce();
      } else {
        startAnimation();
      }

      return () => {
        destroyed = true;
        stopAnimation();

        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();

        document.removeEventListener('visibilitychange', onVisibilityChange);
        reducedMotion.removeEventListener('change', onMotionChange);

        if (gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }

        try {
          (geometry as any)?.remove?.();
          (program as any)?.remove?.();
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        } catch (_) {}
      };
    } catch (error) {
      console.warn('TNCC Floating Animation WebGL fallback:', error);
      fallback();
    }

    return () => {
      destroyed = true;
      stopAnimation();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: isDark ? 1 : 0.75,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
