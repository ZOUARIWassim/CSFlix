import pandas as pd
import os

def LoadData(DataFolder):
    """
    Load the data from the specified folder
    """
    
    movies = pd.read_csv(os.path.join(DataFolder, 'movies_train.csv')).astype(float)
    users = pd.read_csv(os.path.join(DataFolder, 'users_train.csv')).astype(float)
    moviesVecs = pd.read_csv(os.path.join(DataFolder, 'movies_vecs.csv')).astype
    y = pd.read_csv(os.path.join(DataFolder, 'y_train.csv')).astype(float)
    
    return movies, users, moviesVecs, y

