'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Produto } from '@/types/produto';
import { produtosService } from '@/services/produtosService';
import TabelaProdutos from '@/components/produtos/TabelaProdutos';
import FormProduto from '@/components/produtos/FormProduto';
import Modal from '@/components/ui/Modal';
import ConfirmacaoExclusao from '@/components/ui/ConfirmacaoExclusao';
import Toast from '@/components/ui/Toast';

type EstadoModal = 'fechado' | 'criando' | 'editando';

interface ToastState {
  mensagem: string;
  tipo: 'sucesso' | 'erro';
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState<string | null>(null);

  const [estadoModal, setEstadoModal] = useState<EstadoModal>('fechado');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      setErroLista(null);
      const dados = await produtosService.listarTodos();
      setProdutos(dados);
    } catch (err) {
      setErroLista(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarProdutos(); }, [carregarProdutos]);

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro') {
    setToast({ mensagem, tipo });
  }

  async function handleCriar(dados: object) {
    try {
      setSalvando(true);
      const criado = await produtosService.criar(dados as Parameters<typeof produtosService.criar>[0]);
      setProdutos((prev) => [criado, ...prev]);
      setEstadoModal('fechado');
      mostrarToast(`Produto "${criado.nome}" cadastrado com sucesso!`, 'sucesso');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Erro ao cadastrar produto', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  function abrirEdicao(produto: Produto) {
    setProdutoSelecionado(produto);
    setEstadoModal('editando');
  }

  async function handleAtualizar(dados: object) {
    if (!produtoSelecionado) return;
    try {
      setSalvando(true);
      const atualizado = await produtosService.atualizar(
        produtoSelecionado.id,
        dados as Parameters<typeof produtosService.atualizar>[1],
      );
      setProdutos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)));
      setEstadoModal('fechado');
      setProdutoSelecionado(null);
      mostrarToast(`Produto "${atualizado.nome}" atualizado com sucesso!`, 'sucesso');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Erro ao atualizar produto', 'erro');
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir() {
    if (!produtoParaExcluir) return;
    try {
      setExcluindo(true);
      await produtosService.remover(produtoParaExcluir.id);
      setProdutos((prev) => prev.filter((p) => p.id !== produtoParaExcluir.id));
      mostrarToast(`Produto "${produtoParaExcluir.nome}" excluído.`, 'sucesso');
      setProdutoParaExcluir(null);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Erro ao excluir produto', 'erro');
    } finally {
      setExcluindo(false);
    }
  }

  function fecharModal() {
    if (salvando) return;
    setEstadoModal('fechado');
    setProdutoSelecionado(null);
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              fontFamily: 'var(--fonte-mono)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C8401A',
              marginBottom: '12px',
            }}>
              Módulo 03 — Estoque
            </div>
            <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
            <h1 style={{
              fontFamily: 'var(--fonte-serif)',
              fontSize: '42px',
              color: '#1A1A18',
              margin: 0,
              lineHeight: 1.05,
            }}>
              Produtos
            </h1>
          </div>

          <button
            onClick={() => setEstadoModal('criando')}
            style={{
              padding: '11px 22px',
              backgroundColor: '#1A1A18',
              color: '#F5F2ED',
              border: 'none',
              fontFamily: 'var(--fonte-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8401A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A18';
            }}
          >
            + Novo produto
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #D4D0C8',
        }}>
          <span style={{
            fontFamily: 'var(--fonte-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#6B6B65',
          }}>
            {carregando
              ? 'Carregando...'
              : `${produtos.length} ${produtos.length === 1 ? 'registro' : 'registros'}`
            }
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      {carregando ? (
        <div style={{ padding: '80px 40px', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--fonte-mono)',
            fontSize: '11px',
            color: '#BBBAB4',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Carregando dados...
          </span>
        </div>
      ) : erroLista ? (
        <div style={{ padding: '40px', border: '1.5px solid #C8401A', backgroundColor: '#FDF0ED' }}>
          <p style={{ fontFamily: 'var(--fonte-mono)', fontSize: '12px', color: '#C8401A', margin: '0 0 16px' }}>
            Erro ao carregar produtos: {erroLista}
          </p>
          <button
            onClick={carregarProdutos}
            style={{
              padding: '8px 16px',
              background: '#1A1A18',
              border: 'none',
              fontFamily: 'var(--fonte-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              color: '#F5F2ED',
            }}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <TabelaProdutos
          produtos={produtos}
          onEditar={abrirEdicao}
          onExcluir={setProdutoParaExcluir}
        />
      )}

      {estadoModal === 'criando' && (
        <Modal titulo="Novo produto" subtitulo="Cadastro" onFechar={fecharModal}>
          <FormProduto onSubmit={handleCriar} onCancelar={fecharModal} carregando={salvando} />
        </Modal>
      )}

      {estadoModal === 'editando' && produtoSelecionado && (
        <Modal titulo="Editar produto" subtitulo="Atualização" onFechar={fecharModal}>
          <FormProduto
            produtoInicial={produtoSelecionado}
            onSubmit={handleAtualizar}
            onCancelar={fecharModal}
            carregando={salvando}
            modoEdicao
          />
        </Modal>
      )}

      {produtoParaExcluir && (
        <ConfirmacaoExclusao
          nomeCliente={produtoParaExcluir.nome}
          carregando={excluindo}
          onConfirmar={handleExcluir}
          onCancelar={() => setProdutoParaExcluir(null)}
        />
      )}

      {toast && (
        <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={() => setToast(null)} />
      )}
    </div>
  );
}
