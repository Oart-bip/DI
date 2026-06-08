'use client';

import { useEffect } from 'react';

interface ToastProps {
  mensagem: string;
  tipo: 'sucesso' | 'erro';
  onFechar: () => void;
}

export default function Toast({ mensagem, tipo, onFechar }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onFechar, 4000);
    return () => clearTimeout(timer);
  }, [onFechar]);

  const isSucesso = tipo === 'sucesso';

  return (
    <div
      className="animar-entrada"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        backgroundColor: isSucesso ? '#1A1A18' : '#C8401A',
        color: '#F5F2ED',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '280px',
        maxWidth: '400px',
        zIndex: 9999,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <span style={{ fontSize: '16px' }}>
        {isSucesso ? '✓' : '✕'}
      </span>
      <span style={{
        fontFamily: 'var(--fonte-sans)',
        fontSize: '13px',
        flex: 1,
        lineHeight: 1.4,
      }}>
        {mensagem}
      </span>
      <button
        onClick={onFechar}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(245,242,237,0.6)',
          cursor: 'pointer',
          fontSize: '14px',
          padding: '2px',
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
