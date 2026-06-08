'use client';

import { useState } from 'react';
import type { Cliente } from '@/types/cliente';
import type { Produto } from '@/types/produto';
import type { CreatePedidoPayload, ItemPedidoPayload } from '@/types/pedido';

interface ItemRascunho {
  produtoId: string;
  quantidade: string;
}

interface FormPedidoProps {
  clientes: Cliente[];
  produtos: Produto[];
  onSubmit: (dados: CreatePedidoPayload) => Promise<void>;
  onCancelar: () => void;
  carregando?: boolean;
}

interface FormErros {
  clienteId?: string;
  itens?: string;
  categoria?: string;
}

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function FormPedido({
  clientes,
  produtos,
  onSubmit,
  onCancelar,
  carregando = false,
}: FormPedidoProps) {
  const [clienteId, setClienteId] = useState('');
  const [categoria, setCategoria] = useState('');
  const [itens, setItens] = useState<ItemRascunho[]>([{ produtoId: '', quantidade: '1' }]);
  const [erros, setErros] = useState<FormErros>({});

  function adicionarItem() {
    setItens((prev) => [...prev, { produtoId: '', quantidade: '1' }]);
  }

  function removerItem(index: number) {
    setItens((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarItem(index: number, campo: keyof ItemRascunho, valor: string) {
    setItens((prev) => prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)));
  }

  // filtra produtos ja selecionados em outros itens
  function produtosDisponiveis(indexAtual: number) {
    const selecionados = itens
      .map((item, i) => (i !== indexAtual ? item.produtoId : null))
      .filter(Boolean);
    return produtos.filter((p) => !selecionados.includes(p.id));
  }

  function calcularSubtotal(item: ItemRascunho): number {
    const produto = produtos.find((p) => p.id === item.produtoId);
    const qtd = parseInt(item.quantidade) || 0;
    if (!produto || qtd <= 0) return 0;
    return produto.preco * qtd;
  }

  function calcularTotal(): number {
    return itens.reduce((acc, item) => acc + calcularSubtotal(item), 0);
  }

  function validar(): boolean {
    const novosErros: FormErros = {};

    if (!clienteId) novosErros.clienteId = 'selecione um cliente';

    const itensValidos = itens.filter((i) => i.produtoId);
    if (itensValidos.length === 0) {
      novosErros.itens = 'adicione pelo menos 1 produto';
    } else {
      for (const item of itensValidos) {
        const qtd = parseInt(item.quantidade);
        if (isNaN(qtd) || qtd < 1) {
          novosErros.itens = 'quantidade deve ser pelo menos 1';
          break;
        }
        const produto = produtos.find((p) => p.id === item.produtoId);
        if (produto && qtd > produto.estoque) {
          novosErros.itens = `estoque insuficiente para "${produto.nome}" (disponivel: ${produto.estoque})`;
          break;
        }
      }
    }

    if (categoria.trim().length > 100) {
      novosErros.categoria = 'categoria deve ter no maximo 100 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    const itensPayload: ItemPedidoPayload[] = itens
      .filter((i) => i.produtoId)
      .map((i) => ({ produtoId: i.produtoId, quantidade: parseInt(i.quantidade) }));

    const payload: CreatePedidoPayload = {
      clienteId,
      itens: itensPayload,
      ...(categoria.trim() && { categoria: categoria.trim() }),
    };

    await onSubmit(payload);
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    backgroundColor: '#FAFAF7',
    border: '1.5px solid #D4D0C8',
    borderRadius: 0,
    fontFamily: 'var(--fonte-sans)',
    fontSize: '14px',
    color: '#1A1A18',
    outline: 'none',
    WebkitAppearance: 'none' as const,
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--fonte-mono)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#6B6B65',
    marginBottom: '7px',
  };

  const erroStyle = {
    fontFamily: 'var(--fonte-mono)',
    fontSize: '10px',
    color: '#C8401A',
    marginTop: '5px',
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* cliente */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ ...labelStyle, color: erros.clienteId ? '#C8401A' : '#6B6B65' }}>
          cliente <span style={{ color: '#C8401A' }}>*</span>
        </label>
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          style={{
            ...inputStyle,
            border: `1.5px solid ${erros.clienteId ? '#C8401A' : '#D4D0C8'}`,
            backgroundColor: erros.clienteId ? '#FDF0ED' : '#FAFAF7',
            cursor: 'pointer',
          }}
        >
          <option value="">selecione um cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} — {c.email}
            </option>
          ))}
        </select>
        {erros.clienteId && <p style={erroStyle}>✕ {erros.clienteId}</p>}
      </div>

      {/* itens */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ ...labelStyle, marginBottom: 0, color: erros.itens ? '#C8401A' : '#6B6B65' }}>
            produtos <span style={{ color: '#C8401A' }}>*</span>
          </label>
          <button
            type="button"
            onClick={adicionarItem}
            style={{
              fontFamily: 'var(--fonte-mono)', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              background: 'none', border: '1.5px solid #D4D0C8',
              padding: '4px 10px', cursor: 'pointer', color: '#1A1A18',
            }}
          >
            + adicionar
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {itens.map((item, index) => {
            const produtoSel = produtos.find((p) => p.id === item.produtoId);
            const subtotal = calcularSubtotal(item);

            return (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px auto',
                gap: '8px',
                alignItems: 'start',
                padding: '12px',
                backgroundColor: '#F5F2ED',
                borderLeft: '3px solid #D4D0C8',
              }}>
                <div>
                  <select
                    value={item.produtoId}
                    onChange={(e) => atualizarItem(index, 'produtoId', e.target.value)}
                    style={{ ...inputStyle, fontSize: '13px' }}
                  >
                    <option value="">selecionar produto...</option>
                    {produtosDisponiveis(index).map((p) => (
                      <option key={p.id} value={p.id} disabled={p.estoque === 0}>
                        {p.nome} — {formatarPreco(p.preco)} (estoque: {p.estoque})
                      </option>
                    ))}
                  </select>
                  {produtoSel && (
                    <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#6B6B65', marginTop: '4px' }}>
                      subtotal: {formatarPreco(subtotal)}
                    </div>
                  )}
                </div>

                <input
                  type="number"
                  min={1}
                  max={produtoSel?.estoque}
                  value={item.quantidade}
                  onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
                  placeholder="qtd"
                  style={{ ...inputStyle, fontSize: '13px' }}
                />

                {itens.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerItem(index)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#C8401A', fontFamily: 'var(--fonte-mono)',
                      fontSize: '14px', padding: '9px 4px', lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {erros.itens && <p style={erroStyle}>✕ {erros.itens}</p>}

        {/* total */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #D4D0C8',
        }}>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#6B6B65', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            total do pedido
          </span>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '16px', fontWeight: 700, color: '#1A1A18' }}>
            {formatarPreco(calcularTotal())}
          </span>
        </div>
      </div>

      {/* categoria opcional */}
      <div style={{ height: '1px', backgroundColor: '#D4D0C8', margin: '8px 0 20px' }} />
      <div style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        categoria
        <span style={{ backgroundColor: '#EDE9E2', padding: '2px 7px', fontSize: '8px', letterSpacing: '0.08em' }}>
          opcional
        </span>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="ex: atacado, varejo, corporativo..."
          style={{ ...inputStyle, border: `1.5px solid ${erros.categoria ? '#C8401A' : '#D4D0C8'}` }}
        />
        {erros.categoria && <p style={erroStyle}>✕ {erros.categoria}</p>}
      </div>

      {/* botoes */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #D4D0C8' }}>
        <button
          type="button"
          onClick={onCancelar}
          disabled={carregando}
          style={{
            flex: 1, padding: '11px', background: 'transparent', border: '1.5px solid #D4D0C8',
            fontFamily: 'var(--fonte-mono)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#1A1A18',
          }}
        >
          cancelar
        </button>
        <button
          type="submit"
          disabled={carregando}
          style={{
            flex: 2, padding: '11px', background: carregando ? '#6B6B65' : '#1A1A18', border: 'none',
            fontFamily: 'var(--fonte-mono)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: carregando ? 'not-allowed' : 'pointer', color: '#F5F2ED',
            transition: 'background 0.15s ease',
          }}
        >
          {carregando ? 'salvando...' : 'criar pedido'}
        </button>
      </div>
    </form>
  );
}
