'use client';

import { useEffect, useRef } from 'react';

export default function KaleidoscopeBackground({ opacity = 0.8 }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // DNA粒子参数
    const dnaParticles = [];
    const particlesPerStrand = 80; // 减少粒子数量以提高性能
    
    // 初始化DNA粒子
    for (let i = 0; i < particlesPerStrand; i++) {
      dnaParticles.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01, // 降低速度
        size: 1 + Math.random() * 1.5 // 减小粒子大小
      });
    }

    // 星盘参数
    const starDiskPoints = [];
    const starDiskRings = 3; // 减少环数
    const starDiskPointsPerRing = 16; // 减少每环点数
    
    // 初始化星盘点
    for (let r = 0; r < starDiskRings; r++) {
      for (let i = 0; i < starDiskPointsPerRing; i++) {
        starDiskPoints.push({
          ring: r,
          angle: (i / starDiskPointsPerRing) * Math.PI * 2,
          size: 0.5 + Math.random() * 1, // 减小点大小
          speed: 0.002 + r * 0.001 // 降低旋转速度
        });
      }
    }

    let time = 0;
    let rotation = 0;
    let animationFrameId;

    function draw() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height) * 0.5; // 减小整体大小
      
      time += 0.005; // 降低动画速度
      rotation += 0.001; // 降低旋转速度
      
      // 清除画布，使用半透明背景
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * opacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制黑洞
      drawBlackHole(centerX, centerY, size);
      
      // 绘制星盘
      drawStarDisk(centerX, centerY, size);
      
      // 绘制DNA螺旋
      drawDNASpiral(centerX, centerY, size);
      
      animationFrameId = requestAnimationFrame(draw);
    }

    function drawBlackHole(x, y, size) {
      // 黑洞吸积盘
      const gradient = ctx.createRadialGradient(
        x, y, size * 0.05,
        x, y, size * 0.3
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(0.5, 'rgba(100, 100, 100, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 事件视界
      const horizonGradient = ctx.createRadialGradient(
        x, y, size * 0.02,
        x, y, size * 0.1
      );
      horizonGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      horizonGradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
      
      ctx.beginPath();
      ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = horizonGradient;
      ctx.fill();
      
      // 中心奇点
      ctx.beginPath();
      ctx.arc(x, y, size * 0.02, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
      
      // 添加引力场线条
      ctx.save();
      ctx.translate(x, y);
      
      // 绘制8条引力线（减少线条数量）
      const lines = 8;
      for(let i = 0; i < lines; i++) {
        const angle = (i / lines) * Math.PI * 2 + rotation * 0.5;
        const length = size * (0.3 + 0.05 * Math.sin(time * 2 + i));
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(angle) * length,
          Math.sin(angle) * length
        );
        
        // 创建渐变线条
        const lineGradient = ctx.createLinearGradient(0, 0, 
          Math.cos(angle) * length, 
          Math.sin(angle) * length);
        lineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        lineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      ctx.restore();
    }

    function drawStarDisk(x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * 0.8);
      
      // 星盘背景光晕
      const glowGradient = ctx.createRadialGradient(
        0, 0, size * 0.05,
        0, 0, size * 0.4
      );
      glowGradient.addColorStop(0, 'rgba(100, 100, 255, 0.1)');
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
      
      // 绘制星盘环
      starDiskPoints.forEach(point => {
        point.angle += point.speed;
        
        const radius = size * (0.15 + 0.15 * (point.ring / starDiskRings));
        const xPos = Math.cos(point.angle) * radius;
        const yPos = Math.sin(point.angle) * radius;
        
        // 绘制星点
        ctx.beginPath();
        ctx.arc(xPos, yPos, point.size * opacity, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      });
      
      ctx.restore();
    }

    function drawDNASpiral(x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const spiralRadius = size * 0.2;
      const spiralHeight = size * 1.2;
      const twist = Math.PI * 6;
      
      // 存储前一帧的粒子位置
      let prevX1, prevX2, prevY1, prevY2;
      
      dnaParticles.forEach((p, i) => {
        p.angle += p.speed;
        const t = i / particlesPerStrand;
        const angle = p.angle + t * twist + time;
        
        // 两条链的位置
        const x1 = Math.cos(angle) * spiralRadius;
        const x2 = -Math.cos(angle) * spiralRadius;
        const yPos = t * spiralHeight - spiralHeight / 2;
        
        // 绘制粒子
        const glow1 = ctx.createRadialGradient(x1, yPos, 0, x1, yPos, p.size);
        glow1.addColorStop(0, `rgba(100, 200, 255, ${0.6 * opacity})`);
        glow1.addColorStop(1, `rgba(100, 200, 255, ${0.1 * opacity})`);
        
        const glow2 = ctx.createRadialGradient(x2, yPos, 0, x2, yPos, p.size);
        glow2.addColorStop(0, `rgba(255, 100, 200, ${0.6 * opacity})`);
        glow2.addColorStop(1, `rgba(255, 100, 200, ${0.1 * opacity})`);
        
        // 第一条链
        ctx.beginPath();
        ctx.arc(x1, yPos, p.size, 0, Math.PI * 2);
        ctx.fillStyle = glow1;
        ctx.fill();
        
        // 第二条链
        ctx.beginPath();
        ctx.arc(x2, yPos, p.size, 0, Math.PI * 2);
        ctx.fillStyle = glow2;
        ctx.fill();
        
        // 保存当前点位置
        prevX1 = x1;
        prevX2 = x2;
        prevY1 = prevY2 = yPos;
      });
      
      ctx.restore();
    }

    // 开始动画
    draw();
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ opacity }}
    />
  );
}