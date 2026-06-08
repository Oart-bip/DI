'use client';

import { useState } from 'react';
import CampoForm from '@/components/ui/CampoForm';
import { validarFormProduto, temErros, type ProdutoFormErrors } from '@/lib/validations';
import type { Produto, CreateProdutoPayload, UpdateProdutoPayload } from '@/types/produto';

interface FormProdutoProps {
  produtoInicial?: Produto;
  onSubmit: (dados: CreateProdutoPayload | UpdateProdutoPayload) => Promise<void>;
  onCancelar: () => void;
  carregando?: boolean;
  modoEdicao?: boolean;
}

export default function FormProduto({
  produtoInicial,
  onSubmit,
  onCancelar,
  carregando = false,
  modoEdicao = false,
}: FormProdutoProps) {
  const [valores, setValores] = useState({
    nome: produtoInicial?.nome ?? '',
    preco: produtoInicial?.preco != null ? String(produtoInicial.preco) : '',
    estoque: produtoInicial?.estoque != null ? String(produtoInicial.estoque) : '',
    categoria: produtoInicial?.categoria ?? '',
  });

  const [erros, setErros] = useState<ProdutoFormErrors>({});
  const [tocado, setTocado] = useState<Record<string, boolean>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const novosValores = { ...valores, [name]: value };
    setValores(novosValores);

    if (tocado[name]) {
      const novosErros = validarFormProduto(novosValores);
      setErros((prev) => ({
        ...prev,
        [name]: novosErros[name as keyof ProdutoFormErrors],
      }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTocado((prev) => ({ ...prev, [name]: true }));
    const novosErros = validarFormProduto(valores);
    setErros((prev) => ({
      ...prev,
      [name]: novosErros[name as keyof ProdutoFormErrors],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const novosErros = validarFormProduto(valores);
    if (temErros(novosErros)) {
      setErros(novosErros);
      setTocado({ nome: true, preco: true, estoque: true, categoria: true });
      return;
    }

    const payload: CreateProdutoPayload = {
      nome: valores.nome.trim(),
      preco: parseFloat(valores.preco.replace(',', '.')),
      estoque: parseInt(valores.estoque, 10),
      // envia categoria apenas se preenchida
      ...(valores.categoria.trim() && { categoria: valores.categoria.trim() }),
    };

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <CampoForm
        label="Nome do produto"
        name="nome"
        value={valores.nome}
        onChange={handleChange}
        onBlur={handleBlur}
        erro={erros.nome}
        placeholder="Ex: Cadeira Ergonômica"
        required
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <CampoForm
          label="Preço (R$)"
          name="preco"
          type="text"
          value={valores.preco}
          onChange={handleChange}
          onBlur={handleBlur}
          erro={erros.preco}
          placeholder="Ex: 299.90"
          required
        />

        <CampoForm
          label="Estoque (un.)"
          name="estoque"
          type="text"
          value={valores.estoque}
          onChange={handleChange}
          onBlur={handleBlur}
          erro={erros.estoque}
          placeholder="Ex: 50"
          required
        />
      </div>

      <div style={{
        height: '1px',
        backgroundColor: '#D4D0C8',
        margin: '8px 0 20px',
      }} />

      <div style={{
        fontFamily: 'var(--fonte-mono)',
        fontSize: '9px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#6B6B65',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        Categoria
        <span style={{
          backgroundColor: '#EDE9E2',
          padding: '2px 7px',
          fontSize: '8px',
          letterSpacing: '0.08em',
        }}>
          opcional
        </span>
      </div>

      <CampoForm
        label="Categoria"
        name="categoria"
        value={valores.categoria}
        onChange={handleChange}
        onBlur={handleBlur}
        erro={erros.categoria}
        placeholder="Ex: Móveis, Eletrônicos, Papelaria..."
      />

      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #D4D0C8',
      }}>
        <button
          type="button"
          onClick={onCancelar}
          disabled={carregando}
          style={{
            flex: 1,
            padding: '11px',
            background: 'transparent',
            border: '1.5px solid #D4D0C8',
            fontFamily: 'var(--fonte-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            color: '#1A1A18',
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={carregando}
          style={{
            flex: 2,
            padding: '11px',
            background: carregando ? '#6B6B65' : '#1A1A18',
            border: 'none',
            fontFamily: 'var(--fonte-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: carregando ? 'not-allowed' : 'pointer',
            color: '#F5F2ED',
            transition: 'background 0.15s ease',
          }}
        >
          {carregando
            ? 'Salvando...'
            : modoEdicao
              ? 'Salvar alterações'
              : 'Cadastrar produto'
          }
        </button>
      </div>
    </form>
  );
}
