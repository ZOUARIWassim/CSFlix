import torch
from Train.ModelArchitecture import Model
import numpy as np
import pickle
import pandas as pd
import psycopg2
import os
import dotenv
from decimal import Decimal

dotenv.load_dotenv()

MovieGenres = ["Adventure","Animation","Children","Comedy","Fantasy","Romance","Drama","Action","Crime","Thriller",
               "Horror","Mystery","Sci-Fi","IMAX","Documentary","War","Musical","Western","Film-Noir","(no genres listed)"]

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
    
    movies = pd.read_csv('Train/Data/Large_Data/movies_vecs.csv')
    
    userVecs = np.tile(user, (movies.shape[0], 1))
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
    
    moviesIds = list(sortedMovies.iloc[:10,0].values)
    tmdbids = [gettmdbid(movieId) for movieId in moviesIds] 
    
    return {"tmdbIds": tmdbids}

def connectToDB():
    connection = psycopg2.connect(
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT"),
        database=os.getenv("POSTGRES_DB")
    )
    connection.set_client_encoding('UTF8')
    return connection

def gettmdbid(movieId):
    connection = connectToDB()
    cursor = connection.cursor()
    cursor.execute(f"SELECT tmdbid FROM movie_tmdb_link WHERE movieid = {movieId}")
    tmdbid = cursor.fetchone()[0]
    cursor.close()
    connection.close()
    return tmdbid

def getMovieGenres(tmdbid):
    connection = connectToDB()
    cursor = connection.cursor()
    cursor.execute(f"SELECT movieID FROM movie_tmdb_link WHERE tmdbid = {tmdbid}")
    movieId = cursor.fetchone()[0]
    cursor.execute(f"SELECT * FROM movies WHERE movieID = {movieId}")
    movieVec = cursor.fetchone()[3:]
    genres_dict = {MovieGenres[i]: 1 if movieVec[i] != Decimal('0.00') else 0 for i in range(len(MovieGenres))}
    cursor.close()
    connection.close()
    return genres_dict

def getuserData(userID):
    connection = connectToDB()
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM ratings WHERE userid = {userID}")
    user = cursor.fetchall()
    userVector = {genre: 0 for genre in MovieGenres}
    numberOfRatingsPerGenre = {genre: 0 for genre in MovieGenres}
    for movie in user:
        movieGenres_dict = getMovieGenres(movie[1])
        for genre in movieGenres_dict:
            if movieGenres_dict[genre] == 1:
                numberOfRatingsPerGenre[genre] += 1
                userVector[genre] += movie[2]
    for genre in userVector:
        if numberOfRatingsPerGenre[genre] != 0:
            userVector[genre] /= numberOfRatingsPerGenre[genre]
    
    userVec = [float(userVector[genre]) for genre in MovieGenres]
                
    cursor.close()
    connection.close()
    return pd.DataFrame([userVec])

if __name__ == "__main__":
    ## Test the function
    # user = pd.DataFrame([[2.0,22.0,4.0,0,0,0,0,0,0,0,0,0,0,0,0,5.0,0]])
    # output = Recommend(user)
    # print(output)
    user = getuserData(1)
    print(Recommend(user))
    