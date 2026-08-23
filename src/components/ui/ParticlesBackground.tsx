"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "@/lib/themeContext";

export function ParticlesBackground() {
  const [init, setInit] = useState(false);
  const { config, theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      key={theme}
      id="tsparticles"
      className="absolute inset-0 -z-10 pointer-events-none"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: config.particleColors,
          },
          links: {
            color: config.primaryAccent,
            distance: 150,
            enable: true,
            opacity: 0.18,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.6,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 45,
          },
          opacity: {
            value: 0.45,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3.5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
