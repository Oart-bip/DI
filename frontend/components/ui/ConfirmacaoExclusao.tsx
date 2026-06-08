'use client';

interface ConfirmacaoExclusaoProps {
  nomeCliente: string;
  carregando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmacaoExclusao({
  nomeCliente,
  carregando,
  onConfirmar,
  onCancelar,
}: ConfirmacaoExclusaoProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={onCancelar}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(26,26,24,0.6)',
        }}
      />
      <div
        className="animar-entrada"
        style={{
          position: 'relative',
          backgroundColor: '#FAFAF7',
          width: '400px',
          padding: '0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ height: '4px', backgroundColor: '#C8401A' }} />
        <div style={{ padding: '32px' }}>
          <div style={{
            fontFamily: 'var(--fonte-mono)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C8401A',
            marginBottom: '12px',
          }}>
            Ação irreversível
          </div>
          <h3 style={{
            fontFamily: 'var(--fonte-serif)',
            fontSize: '22px',
            margin: '0 0 12px',
            color: '#1A1A18',
          }}>
            Excluir cliente
          </h3>
          <p style={{
            fontFamily: 'var(--fonte-sans)',
            fontSize: '14px',
            color: '#6B6B65',
            lineHeight: 1.5,
            margin: '0 0 28px',
          }}>
            Tem certeza que deseja excluir{' '}
            <strong style={{ color: '#1A1A18' }}>{nomeCliente}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onCancelar}
              disabled={carregando}
              style={{
                flex: 1,
                padding: '10px',
                background: 'transparent',
                border: '1.5px solid #D4D0C8',
                fontFamily: 'var(--fonte-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: '#1A1A18',
                transition: 'all 0.15s ease',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={carregando}
              style={{
                flex: 1,
                padding: '10px',
                background: '#C8401A',
                border: 'none',
                fontFamily: 'var(--fonte-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: carregando ? 'not-allowed' : 'pointer',
                color: 'white',
                opacity: carregando ? 0.7 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {carregando ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
