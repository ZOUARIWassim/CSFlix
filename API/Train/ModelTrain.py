from utils import *
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
from ModelArchitecture import Model
import pickle

DataFolder = 'Data/Small_Data'
batchSize = 32
numOutputs = 32
loss_fn = nn.MSELoss()
epochs = 20
if torch.cuda.is_available():
    device = torch.device('cuda')
else:
    device = torch.device('cpu')


class MovieUserDataset(Dataset):
    def __init__(self, movies, users, y):
        self.movies = torch.tensor(movies, dtype=torch.float32)
        self.users = torch.tensor(users, dtype=torch.float32)
        self.targets = torch.tensor(y, dtype=torch.float32)

    def __len__(self):
        return len(self.targets)

    def __getitem__(self, idx):
        return self.movies[idx], self.users[idx], self.targets[idx] 
    
def train(model, optimizer, loss_fn, train_loader, val_loader, epochs, device="cpu"):
    for epoch in range(1, epochs+1):
        trainLoss = 0
        valLoss = 0
        model.train()
        for batch in train_loader:
            movies, users, targets = batch
            movies = movies.to(device)
            users = users.to(device)
            targets = targets.to(device)
            optimizer.zero_grad()
            output = model(movies, users)
            loss = loss_fn(output, targets)
            loss.backward()
            optimizer.step()
            trainLoss += loss.item() * targets.size(0)
        trainLoss /= len(train_loader.dataset)
        
        model.eval()
        for batch in val_loader:
            movies, users, targets = batch
            movies = movies.to(device)
            users = users.to(device)
            targets = targets.to(device)
            output = model(movies, users)
            loss = loss_fn(output, targets)
            valLoss += loss.item() * targets.size(0)
        valLoss /= len(val_loader.dataset)
        
        print(f"Epoch: {epoch}, Training Loss: {trainLoss}, Validation Loss: {valLoss}")   
    
    
movies, users, moviesVecs, y = LoadData(DataFolder)

numMoviesFeatures = movies.shape[1] - 1
numUsersFeatures = users.shape[1] - 3

movies = movies.iloc[:, 1:]
users = users.iloc[:, 3:]

scalerMovies = StandardScaler()
scalerMovies.fit(movies)
moviesScaled = scalerMovies.transform(movies)

scalerUsers = StandardScaler()
scalerUsers.fit(users)
usersScaled = scalerUsers.transform(users)

scalerY = MinMaxScaler()
scalerY.fit(y)
yScaled = scalerY.transform(y)

moviesTrain, moviesTest, usersTrain, usersTest, yTrain, yTest = train_test_split(moviesScaled, usersScaled, yScaled, test_size=0.2, random_state=42)
moviesTrain, moviesVal, usersTrain, usersVal, yTrain, yVal = train_test_split(moviesTrain, usersTrain, yTrain, test_size=0.2, random_state=42)
    
trainDataset = MovieUserDataset(moviesTrain, usersTrain, yTrain)
valDataset = MovieUserDataset(moviesVal, usersVal, yVal)
testDataset = MovieUserDataset(moviesTest, usersTest, yTest)

trainLoader = DataLoader(trainDataset, batch_size=batchSize, shuffle=True)
valLoader = DataLoader(valDataset, batch_size=batchSize, shuffle=False)
testLoader = DataLoader(testDataset, batch_size=batchSize, shuffle=False)

Model = Model(numMoviesFeatures, numUsersFeatures, numOutputs)

optimizer = optim.Adam(Model.parameters(), lr=0.001)

Model.to(device)

train(Model, optimizer, loss_fn, trainLoader, valLoader, epochs, device)

ModelInfo = {
    'numMoviesFeatures': numMoviesFeatures,
    'numUsersFeatures': numUsersFeatures,
    'numOutputs': numOutputs,
}

with open('../Model/scalerMovies.pkl', 'wb') as f:
    pickle.dump(scalerMovies, f)

with open('../Model/scalerUsers.pkl', 'wb') as f:
    pickle.dump(scalerUsers, f)

with open('../Model/scalerY.pkl', 'wb') as f:
    pickle.dump(scalerY, f)

torch.save(ModelInfo, '../Model/ModelInfo.pth')
torch.save(Model.state_dict(), '../Model/Model.pth')