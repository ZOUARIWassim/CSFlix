import numpy as np
import pandas as pd
import os
import tqdm

MovieTypes = ['Adventure', 'Animation', 'Children', 'Comedy', 'Fantasy', 'Romance', 'Drama', 'Action', 'Crime', 'Thriller', 'Horror', 'Mystery', 'Sci-Fi', 'IMAX', 'Documentary', 'War', 'Musical', 'Western', 'Film-Noir', '(no genres listed)']

def extract_year(title):
    return title.split('(')[-1].split(')')[0]

def clean_data():
    if not os.path.exists("movies.csv") or not os.path.exists("ratings.csv"):
        print("Error: Data files not found.")
        return
        
    print("Reading data...")
    movies = pd.read_csv("movies.csv")   
    ratings = pd.read_csv("ratings.csv").iloc[:500000,:]
    print("Data read successfully.")
    
    users_avg_rates = {userID : {genre: 0 for genre in MovieTypes} for userID in ratings['userId'].unique()}
    movies_avg_rates = {movieID : 0 for movieID in movies['movieId']}
    number_of_ratings_per_genre = {userID : {genre: 0 for genre in MovieTypes} for userID in ratings['userId'].unique()}
    number_of_ratings_per_movie = {movieID : 0 for movieID in movies['movieId']}
    
    print("Cleaning data...")    
    print("Retrieving Ratings...")
    for index, rating in tqdm.tqdm(ratings.iterrows(), total=ratings.shape[0]):
        
        movieID = rating["movieId"]
        rate = rating["rating"]
        userID = rating["userId"]

        movies_avg_rates[movieID] += rate
        number_of_ratings_per_movie[movieID] += 1
        
        movie_genres = movies[movies['movieId'] == movieID]['genres'].values[0].split('|')
        for genre in movie_genres:
            if genre in MovieTypes:
                users_avg_rates[userID][genre] += rate
                number_of_ratings_per_genre[userID][genre] += 1
    print("Ratings retrieved successfully.")
    
    for movieID in movies_avg_rates:
        if number_of_ratings_per_movie[movieID] != 0:
            movies_avg_rates[movieID] /= number_of_ratings_per_movie[movieID]
            
    for userID in users_avg_rates:
        for genre in users_avg_rates[userID]:
            if number_of_ratings_per_genre[userID][genre] != 0:
                users_avg_rates[userID][genre] /= number_of_ratings_per_genre[userID][genre]
    
    movies_vecs = []
    for index, movie in tqdm.tqdm(movies.iterrows(), total=movies.shape[0]):
        movie_ID = movie["movieId"]
        movie_year = extract_year(movie["title"])
        movieAvgRate = movies_avg_rates[movie_ID]

        movie_genres = movie["genres"].split('|')
        movie_vector = [0] * len(MovieTypes)
        for genre in movie_genres:
            if genre in MovieTypes:
                movie_vector[MovieTypes.index(genre)] = 1
            
        movie_vector = [movie_ID, movie_year, movieAvgRate] + movie_vector
        movies_vecs.append(movie_vector)   
        
    print("movies_train data retrieved successfully.")
    movies_vecs = pd.DataFrame(movies_vecs, columns=['movieId', 'year', 'avg_ratings'] + MovieTypes)        

                
    users_train = []
    movies_train = []
    targets = []
    print("Retieving users_train data...")
    
    for index, rating in tqdm.tqdm(ratings.iterrows(), total=ratings.shape[0]):
        userID = rating["userId"]
        userTotalNumRating = len(ratings[ratings['userId'] == userID])
        userAvgRating = ratings[ratings['userId'] == userID]['rating'].mean()
        
        userAvgRatingGenres = [0] * len(MovieTypes)
        for genre in MovieTypes:
            userAvgRatingGenres[MovieTypes.index(genre)] = users_avg_rates[userID][genre]
            
        userVector = [userID, userTotalNumRating, userAvgRating] + userAvgRatingGenres
        
        movieVector = movies_vecs[movies_vecs['movieId'] == rating['movieId']].values[0]
        
        movies_train.append(movieVector)
        users_train.append(userVector)
        targets.append(rating['rating'])
    
    print("users_train data retrieved successfully.")
    
    movies_train = pd.DataFrame(movies_train, columns=['movieId', 'year', 'avg_ratings'] + MovieTypes)
    users_train = pd.DataFrame(users_train, columns=['userId', 'totalRatings', 'avgRating'] + MovieTypes)
    targets = pd.DataFrame(targets, columns=['rating'])
    
    print("Retrieving movies_train data...")
    
            
    users_train.to_csv("users_train.csv", index=False)
    movies_vecs.to_csv("movies_vecs.csv", index=False)  
    movies_train.to_csv("movies_train.csv", index=False)  
    targets.to_csv("y_train.csv", index=False)
    
    print("Data cleaned successfully.")    
    
if __name__ == "__main__":
    clean_data()