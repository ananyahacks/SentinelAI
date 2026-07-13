
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import SAGEConv


class GraphSAGE(nn.Module):
    def __init__(self, input_dim: int):
        super(GraphSAGE, self).__init__()
        self.conv1 = SAGEConv(input_dim, 128)
        self.conv2 = SAGEConv(128, 64)
        self.dropout = nn.Dropout(0.30)
        self.fc = nn.Linear(64, 2)  

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.dropout(x)
        x = self.conv2(x, edge_index)
        x = F.relu(x)
        x = self.dropout(x)
        x = self.fc(x)
        return x