"use client"

import { useEffect, useRef } from 'react';

const SnowAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    class Snowflake {
      x: number;
      y: number;
      radius: number;
      speed: number;
      wind: number;
      opacity: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h - h;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.4;
      }

      update(w: number, h: number) {
        this.y += this.speed;
        this.x += this.wind;

        if (this.y > h) {
          this.y = -10;
          this.x = Math.random() * w;
        }
        if (this.x > w) this.x = 0;
        else if (this.x < 0) this.x = w;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    let snowflakes: Snowflake[] = [];
    let animationFrameId: number;

    const initSnowflakes = () => {
      const w = canvas.width;
      const h = canvas.height;
      const count = Math.min(Math.floor((w * h) / 10000), 150);
      snowflakes = Array.from({ length: count }, () => new Snowflake(w, h));
    };

    initSnowflakes();

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      snowflakes.forEach(sf => {
        sf.update(w, h);
        sf.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
      initSnowflakes();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default SnowAnimation;
