"use client";
import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const classes = ['reveal','reveal-3d','reveal-scale','reveal-left','reveal-right'];
    const selector = classes.map(c => `.${c}`).join(',');
    const els = document.querySelectorAll(selector);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function use3DTilt(selector: string) {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(selector);

    const handleMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleLeave = (card: HTMLElement) => {
      card.style.transform =
        `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    cards.forEach(card => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      card.addEventListener('mousemove', (e) => handleMove(e as MouseEvent, card));
      card.addEventListener('mouseleave', () => handleLeave(card));
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);
}
