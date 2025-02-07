import pandas as pd
import os

def LoadData(DataFolder):
    """
    Load the data from the specified folder
    """
    
    movies = pd.read_csv(os.path.join(DataFolder, 'movies_train.csv'))
    users = pd.read_csv(os.path.join(DataFolder, 'users_train.csv'))
    moviesVecs = pd.read_csv(os.path.join(DataFolder, 'movies_vecs.csv'))
    y = pd.read_csv(os.path.join(DataFolder, 'y_train.csv'))
    
    return movies, users, moviesVecs, y

