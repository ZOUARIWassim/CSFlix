import torch
from Train.ModelArchitecture import Model
import numpy as np
import pickle
import pandas as pd

def LoadModel():
    ModelInfo = torch.load('Model/ModelInfo.pth')
    numMoviesFeatures = ModelInfo['numMoviesFeatures']
    numUsersFeatures = ModelInfo['numUsersFeatures']
    numOutputs = ModelInfo['numOutputs']

    MyModel = Model(numMoviesFeatures, numUsersFeatures, numOutputs)
    MyModel.load_state_dict(torch.load('Model/Model.pth'))
    
    with open('Model/scalerMovies.pkl', 'rb') as f:
        scalerMovies = pickle.load(f)
    
    with open('Model/scalerUsers.pkl', 'rb') as f:
        scalerUsers = pickle.load(f)
    
    with open('Model/scalerY.pkl', 'rb') as f:
        scalerY = pickle.load(f)
        
    return MyModel, scalerMovies, scalerUsers, scalerY

def Recommend(user):
    print("Loading Model")
    MyModel, scalerMovies, scalerUsers, scalerY = LoadModel()
    print("Model Loaded")
    
    movies = pd.read_csv('Train/Data/Small_Data/movies_vecs.csv')
    
    userVecs = np.tile(user.iloc[:, 3:], (movies.shape[0], 1)) 
    userVecsScaled = scalerUsers.transform(userVecs)
    
    moviesScaled = scalerMovies.transform(movies.iloc[:,1:])
    
    if torch.cuda.is_available():
        device = torch.device('cuda')
    else:
        device = torch.device('cpu')
    
    MyModel.to(device)
    userVecsScaled = torch.tensor(userVecsScaled, dtype=torch.float32).to(device)
    moviesScaled = torch.tensor(moviesScaled, dtype=torch.float32).to(device)
    output = MyModel(moviesScaled, userVecsScaled)  
    
    outputUnscaled = scalerY.inverse_transform(output.cpu().detach().numpy())
    sortedIndices = np.argsort(outputUnscaled, axis=0)[::-1]
    sortedMovies = movies.iloc[sortedIndices.flatten()]
    
    return sortedMovies.iloc[:10,0].values

if __name__ == "__main__":
    ## Test the function
    user = pd.DataFrame([[2.0,22.0,4.0,0,0,0,0,0,0,0,0,0,0,0,0,5.0,0]])
    output = Recommend(user)
    print(output)