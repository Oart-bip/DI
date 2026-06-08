
import numpy as np
import pandas as pd
from typing import Tuple

def remover_duplicatas(df: pd.DataFrame, subset: list[str]) -> pd.DataFrame:
    antes = len(df)
    df = df.drop_duplicates(subset=subset, keep="first")
    removidos = antes - len(df)
    if removidos > 0:
        print(f"[preprocessamento] {removidos} duplicata(s) removida(s)")
    return df.reset_index(drop=True)

def tratar_outliers_iqr(df: pd.DataFrame, colunas: list[str]) -> pd.DataFrame:
    df = df.copy()
    for col in colunas:
        if col not in df.columns:
            continue
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        lim_inf = q1 - 1.5 * iqr
        lim_sup = q3 + 1.5 * iqr
        antes = df[col].copy()
        df[col] = df[col].clip(lower=lim_inf, upper=lim_sup)
        modificados = (df[col] != antes).sum()
        if modificados > 0:
            print(f"[preprocessamento] coluna '{col}': {modificados} outlier(s) tratado(s)")
    return df

def normalizar_zscore(df: pd.DataFrame, colunas: list[str]) -> Tuple[pd.DataFrame, dict]:
    df = df.copy()
    params = {}
    for col in colunas:
        if col not in df.columns:
            continue
        media = df[col].mean()
        std = df[col].std()
        if std == 0:
            df[col] = 0.0
        else:
            df[col] = (df[col] - media) / std
        params[col] = {"media": media, "std": std}
    return df, params

def normalizar_minmax(df: pd.DataFrame, colunas: list[str]) -> Tuple[pd.DataFrame, dict]:
    df = df.copy()
    params = {}
    for col in colunas:
        if col not in df.columns:
            continue
        vmin = df[col].min()
        vmax = df[col].max()
        if vmax == vmin:
            df[col] = 0.0
        else:
            df[col] = (df[col] - vmin) / (vmax - vmin)
        params[col] = {"min": vmin, "max": vmax}
    return df, params

def preparar_features(pedidos_raw: list[dict], clientes_raw: list[dict]) -> pd.DataFrame:
    if not pedidos_raw or not clientes_raw:
        return pd.DataFrame()

    pedidos = pd.DataFrame(pedidos_raw)
    clientes = pd.DataFrame(clientes_raw)

    pedidos["criadoEm"] = pd.to_datetime(pedidos["criadoEm"])
    pedidos["total"] = pd.to_numeric(pedidos["total"], errors="coerce").fillna(0)

    agora = pd.Timestamp.now(tz="UTC").tz_localize(None)
    if pedidos["criadoEm"].dt.tz is not None:
        pedidos["criadoEm"] = pedidos["criadoEm"].dt.tz_localize(None)

    grupos = pedidos.groupby("clienteId")

    total_pedidos = grupos.size().rename("total_pedidos")

    cancelados = (
        pedidos[pedidos["status"] == "cancelado"]
        .groupby("clienteId")
        .size()
        .rename("total_cancelados")
    )
    confirmados = (
        pedidos[pedidos["status"] == "confirmado"]
        .groupby("clienteId")
        .size()
        .rename("total_confirmados")
    )
    receita = (
        pedidos[pedidos["status"] != "cancelado"]
        .groupby("clienteId")["total"]
        .sum()
        .rename("receita_total")
    )
    recencia = (
        grupos["criadoEm"]
        .max()
        .apply(lambda d: (agora - d).days)
        .rename("recencia_dias")
    )
    itens_por_pedido = (
        pedidos.assign(n_itens=pedidos["itens"].apply(lambda x: len(x) if isinstance(x, list) else 1))
        .groupby("clienteId")["n_itens"]
        .mean()
        .rename("itens_por_pedido")
    )

    features = (
        clientes[["id", "nome"]]
        .set_index("id")
        .join(total_pedidos, how="left")
        .join(cancelados, how="left")
        .join(confirmados, how="left")
        .join(receita, how="left")
        .join(recencia, how="left")
        .join(itens_por_pedido, how="left")
        .fillna(0)
        .reset_index()
        .rename(columns={"id": "clienteId"})
    )

    features["taxa_cancelamento"] = np.where(
        features["total_pedidos"] > 0,
        features["total_cancelados"] / features["total_pedidos"],
        0.0,
    )
    features["ticket_medio"] = np.where(
        features["total_confirmados"] > 0,
        features["receita_total"] / features["total_confirmados"],
        0.0,
    )

    return features
