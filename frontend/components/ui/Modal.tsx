'use client';

import { useEffect } from 'react';

interface ModalProps {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  onFechar: () => void;
}

export default function Modal({ titulo, subtitulo, children, onFechar }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onFechar]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Overlay */}
      <div
        onClick={onFechar}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(26,26,24,0.5)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Painel deslizante */}
      <div
        className="animar-entrada"
        style={{
          position: 'relative',
          width: '480px',
          height: '100vh',
          backgroundColor: '#FAFAF7',
          overflowY: 'auto',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Faixa superior colorida */}
        <div style={{ height: '4px', backgroundColor: '#C8401A' }} />

        {/* Header do modal */}
        <div style={{
          padding: '32px 36px 24px',
          borderBottom: '1px solid #D4D0C8',
        }}>
          <div style={{
            fontFamily: 'var(--fonte-mono)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C8401A',
            marginBottom: '8px',
          }}>
            {subtitulo || 'Formulário'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h2 style={{
              fontFamily: 'var(--fonte-serif)',
              fontSize: '26px',
              color: '#1A1A18',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {titulo}
            </h2>
            <button
              onClick={onFechar}
              style={{
                background: 'none',
                border: '1.5px solid #D4D0C8',
                cursor: 'pointer',
                color: '#6B6B65',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              title="Fechar (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '32px 36px', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
