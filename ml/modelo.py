
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

COLUNAS_FEATURES = [
    "total_pedidos",
    "total_cancelados",
    "total_confirmados",
    "taxa_cancelamento",
    "receita_total",
    "ticket_medio",
    "recencia_dias",
    "itens_por_pedido",
]

LIMIAR_CHURN_TAXA = 0.40
LIMIAR_CHURN_RECENCIA = 60

def _gerar_labels(df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
    churn = (
        (df["taxa_cancelamento"] >= LIMIAR_CHURN_TAXA) |
        ((df["recencia_dias"] >= LIMIAR_CHURN_RECENCIA) & (df["total_confirmados"] == 0))
    ).astype(int).values

    mediana_ticket = df["ticket_medio"].median() if df["ticket_medio"].median() > 0 else 1
    mediana_recencia = df["recencia_dias"].median() if df["recencia_dias"].median() > 0 else 30

    propensao = (
        (df["ticket_medio"] >= mediana_ticket) &
        (df["recencia_dias"] <= mediana_recencia) &
        (df["taxa_cancelamento"] < 0.2)
    ).astype(int).values

    return churn, propensao

def treinar_e_classificar(df_features: pd.DataFrame) -> list[dict]:
    if df_features.empty or len(df_features) < 2:
        return _classificacao_simples(df_features)

    X = df_features[COLUNAS_FEATURES].values
    labels_churn, labels_propensao = _gerar_labels(df_features)

    resultados = []

    rf_churn = RandomForestClassifier(
        n_estimators=100,
        max_depth=4,
        min_samples_leaf=1,
        random_state=42,
        class_weight="balanced",
    )
    if len(np.unique(labels_churn)) > 1:
        rf_churn.fit(X, labels_churn)
        prob_churn = rf_churn.predict_proba(X)[:, 1]
    else:
        prob_churn = df_features["taxa_cancelamento"].values

    rf_propensao = RandomForestClassifier(
        n_estimators=100,
        max_depth=4,
        min_samples_leaf=1,
        random_state=42,
        class_weight="balanced",
    )
    if len(np.unique(labels_propensao)) > 1:
        rf_propensao.fit(X, labels_propensao)
        prob_propensao = rf_propensao.predict_proba(X)[:, 1]
    else:
        ticket = df_features["ticket_medio"].values
        vmax = ticket.max()
        prob_propensao = ticket / vmax if vmax > 0 else np.zeros(len(ticket))

    for i, row in df_features.iterrows():
        idx = df_features.index.get_loc(i)
        pc = float(prob_churn[idx])
        pp = float(prob_propensao[idx])

        resultados.append({
            "clienteId": row["clienteId"],
            "nome": row["nome"],
            "score_propensao": round(pp, 4),
            "risco_churn": round(pc, 4),
            "classificacao_churn": _classificar_risco(pc),
            "classificacao_propensao": _classificar_propensao(pp),
            "features": {
                "total_pedidos": int(row["total_pedidos"]),
                "total_cancelados": int(row["total_cancelados"]),
                "total_confirmados": int(row["total_confirmados"]),
                "taxa_cancelamento": round(float(row["taxa_cancelamento"]), 4),
                "receita_total": round(float(row["receita_total"]), 2),
                "ticket_medio": round(float(row["ticket_medio"]), 2),
                "recencia_dias": int(row["recencia_dias"]),
                "itens_por_pedido": round(float(row["itens_por_pedido"]), 2),
            },
        })

    resultados.sort(key=lambda x: x["risco_churn"], reverse=True)
    return resultados

def _classificar_risco(prob: float) -> str:
    if prob >= 0.60:
        return "alto"
    if prob >= 0.30:
        return "medio"
    return "baixo"

def _classificar_propensao(prob: float) -> str:
    if prob >= 0.65:
        return "alta"
    if prob >= 0.35:
        return "media"
    return "baixa"

def _classificacao_simples(df: pd.DataFrame) -> list[dict]:
    resultados = []
    for _, row in df.iterrows():
        pc = float(row.get("taxa_cancelamento", 0))
        ticket = float(row.get("ticket_medio", 0))
        resultados.append({
            "clienteId": row["clienteId"],
            "nome": row["nome"],
            "score_propensao": round(min(ticket / 1000, 1.0), 4),
            "risco_churn": round(pc, 4),
            "classificacao_churn": _classificar_risco(pc),
            "classificacao_propensao": _classificar_propensao(min(ticket / 1000, 1.0)),
            "features": {
                "total_pedidos": int(row.get("total_pedidos", 0)),
                "total_cancelados": int(row.get("total_cancelados", 0)),
                "total_confirmados": int(row.get("total_confirmados", 0)),
                "taxa_cancelamento": round(pc, 4),
                "receita_total": round(float(row.get("receita_total", 0)), 2),
                "ticket_medio": round(ticket, 2),
                "recencia_dias": int(row.get("recencia_dias", 0)),
                "itens_por_pedido": round(float(row.get("itens_por_pedido", 0)), 2),
            },
        })
    return resultados
