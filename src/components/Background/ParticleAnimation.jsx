import PropTypes from "prop-types";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Circle from "./circle";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

function ParticleAnimation({
  numParticles = 400,
  lineWidth = 1.0,
  particleRadius = 1.0,
  particleSpeed = 1.0,
  interactive = true,
  color = { r: 158, g: 217, b: 249, a: 255 },
  background = { r: 255, g: 255, b: 255, a: 255 },
  style = {},
}) {
  const [width, height] = useWindowSize();
  const [oldWidth, setOldWidth] = useState(window.innerWidth);
  const [oldHeight, setOldHeight] = useState(window.innerHeight);
  const [particles, setParticles] = useState([]);

  const canvasRef = useRef(null);

  useEffect(() => {
    // update particles location
    if (particles.length !== 0) {
      const newParticles = [];

      for (let i = 0; i < particles.length; ++i) {
        const p = particles[i];
        p.x = (p.x / oldWidth) * width;
        p.y = (p.y / oldHeight) * height;
        p.radius =
          (p.radius / Math.min(oldWidth, oldHeight)) * Math.min(width, height);
        // p.radiusSquared = p.radius * p.radius;
        // p.width = width;
        // p.height = height;
        // p.dX = (p.dX * particleSpeed) / particleSpeed;
        // p.dY = (p.dY * particleSpeed) / particleSpeed;
        newParticles.push(p);
      }

      setOldHeight(height);
      setOldWidth(width);

      setParticles(newParticles);
    }
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // draw particles
    ctx.clearRect(0, 0, width, height);
    if (particles.length !== 0) {
      for (let i = 0; i < particles.length; ++i) {
        const pi = particles[i];

        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${
          (color.a / 255.0) * 0.1
        })`;
        ctx.beginPath();
        ctx.ellipse(
          pi.x,
          pi.y,
          pi.radius / 10,
          pi.radius / 10,
          0,
          0,
          2 * Math.PI
        );
        ctx.fill();

        for (let j = i + 1; j < particles.length; ++j) {
          const pj = particles[j];

          if (pi.intersects(pj)) {
            const dist = Math.sqrt(
              (pi.x - pj.x) * (pi.x - pj.x) + (pi.y - pj.y) * (pi.y - pj.y)
            );
            const d = Math.max(0, Math.min(1, dist / 100.0));
            const a = 20 * d + 150 * (1.0 - d);

            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${
              (color.a * a) / (255.0 * 255.0)
            })`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }
    }

    const timer = setTimeout(() => {
      if (particles.length === 0) {
        // fill up array of particles
        const createParticle = () =>
          new Circle({
            x: Math.random() * width,
            y: Math.random() * height,
            radius:
              ((10 + Math.random() * 60) *
                particleRadius *
                Math.min(height, width)) /
              1500,
            width: width,
            height: height,
            speed: (0.3 * particleSpeed * Math.min(height, width)) / 1500,
          });

        const createdParticles = [];
        for (let i = 0; i < numParticles; i++) {
          createdParticles.push(createParticle());
        }
        setParticles(createdParticles);
      } else {
        // perform move on particles
        const movedParticles = [...particles];
        for (let i = 0; i < movedParticles.length; i++) {
          movedParticles[i].update();
        }
        setParticles(movedParticles);
      }
    }, 32);
    return () => clearTimeout(timer);
  });

  return <canvas ref={canvasRef} width={width} height={height} />;
}

ParticleAnimation.propTypes = {
  numParticles: PropTypes.number,
  lineWidth: PropTypes.number,
  particleRadius: PropTypes.number,
  particleSpeed: PropTypes.number,
  interactive: PropTypes.bool,
  color: PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number,
    a: PropTypes.number,
  }),
  background: PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number,
    a: PropTypes.number,
  }),
  style: PropTypes.object,
};

export default ParticleAnimation;
