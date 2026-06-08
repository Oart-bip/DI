
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

from preprocessamento import (
    remover_duplicatas,
    tratar_outliers_iqr,
    normalizar_zscore,
    preparar_features,
)
from modelo import treinar_e_classificar, COLUNAS_FEATURES

app = FastAPI(title="DataViz ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class ItemPedido(BaseModel):
    produtoId: str
    nomeProduto: str
    precoProduto: float
    quantidade: int
    subtotal: float

class Pedido(BaseModel):
    id: str
    clienteId: str
    nomeCliente: str
    itens: list[ItemPedido]
    categoria: str | None
    total: float
    status: str
    criadoEm: str
    atualizadoEm: str

class Cliente(BaseModel):
    id: str
    nome: str
    email: str
    cidade: str
    estado: str
    pais: str
    criadoEm: str
    atualizadoEm: str

class AnaliseRequest(BaseModel):
    clientes: list[Cliente]
    pedidos: list[Pedido]

@app.get("/health")
def health():
    return {"status": "ok", "servico": "ml"}

@app.post("/analisar")
def analisar(payload: AnaliseRequest) -> dict[str, Any]:
    if not payload.clientes:
        raise HTTPException(status_code=422, detail="nenhum cliente enviado")

    pedidos_dict = [p.model_dump() for p in payload.pedidos]
    clientes_dict = [c.model_dump() for c in payload.clientes]

    df = preparar_features(pedidos_dict, clientes_dict)

    if df.empty:
        raise HTTPException(status_code=422, detail="nao foi possivel construir features com os dados enviados")

    df = remover_duplicatas(df, subset=["clienteId"])

    df = tratar_outliers_iqr(df, colunas=COLUNAS_FEATURES)

    df_original = df.copy()
    df_norm, _ = normalizar_zscore(df, colunas=COLUNAS_FEATURES)

    resultados = treinar_e_classificar(df_norm)

    for res in resultados:
        cid = res["clienteId"]
        linha = df_original[df_original["clienteId"] == cid]
        if not linha.empty:
            r = linha.iloc[0]
            res["features"] = {
                "total_pedidos": int(r["total_pedidos"]),
                "total_cancelados": int(r["total_cancelados"]),
                "total_confirmados": int(r["total_confirmados"]),
                "taxa_cancelamento": round(float(r["taxa_cancelamento"]), 4),
                "receita_total": round(float(r["receita_total"]), 2),
                "ticket_medio": round(float(r["ticket_medio"]), 2),
                "recencia_dias": int(r["recencia_dias"]),
                "itens_por_pedido": round(float(r["itens_por_pedido"]), 2),
            }

    return {
        "total_clientes_analisados": len(resultados),
        "resultados": resultados,
    }
