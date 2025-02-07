import torch
import torch.nn as nn
import torch.nn.functional as F

class Model(nn.Module):
    def __init__(self, numMoviesFeatures, numUsersFeatures, numOutputs):
        super(Model, self).__init__()
        self.userNN = nn.Sequential(
            nn.Linear(numUsersFeatures, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, numOutputs),
        )
        self.movieNN = nn.Sequential(
            nn.Linear(numMoviesFeatures, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, numOutputs),
        )
        self.l2Norm = F.normalize
    def forward(self, movies, users):
        movieOut = self.movieNN(movies)
        userOut = self.userNN(users)
        moviesNorm = self.l2Norm(movieOut,p=2,dim=1)
        usersNorm = self.l2Norm(userOut,p=2,dim=1)
        similiarity = torch.sum(moviesNorm * usersNorm, dim=1)
        similiarity = similiarity.view(-1, 1)
        
        return similiarity