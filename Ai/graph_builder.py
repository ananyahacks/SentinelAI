
import numpy as np
import torch
from sklearn.neighbors import kneighbors_graph
from torch_geometric.data import Data

K_NEIGHBORS = 10  


def build_graph(X_scaled: np.ndarray) -> Data:
    n = X_scaled.shape[0]
    k = min(K_NEIGHBORS, max(n - 1, 1))

    if n <= 1:
        edge_index = torch.zeros((2, 0), dtype=torch.long)
    else:
        adjacency = kneighbors_graph(
            X_scaled,
            n_neighbors=k,
            mode="connectivity",
            include_self=False,
        )
        row, col = adjacency.nonzero()
        edge_index = torch.tensor(np.vstack((row, col)), dtype=torch.long)

    x = torch.tensor(X_scaled, dtype=torch.float)
    return Data(x=x, edge_index=edge_index)