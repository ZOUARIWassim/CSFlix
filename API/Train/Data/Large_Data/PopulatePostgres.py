import psycopg2
import dotenv
import os
import pandas as pd
import tqdm


dotenv.load_dotenv()

def connect_to_postgres():
    try:
        connection = psycopg2.connect(
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT"),
            database=os.getenv("POSTGRES_DB")
        )
        connection.set_client_encoding('UTF8')
        return connection
    except Exception as e:
        print("Error while connecting to PostgreSQL:", e)
        return None

def insert_movie(connection, movie_id, year, avg_rating, genre_ratings):
    try:
        cursor = connection.cursor()
        insert_query = """
            INSERT INTO movies (
                movieId, year, avg_ratings, Adventure, Animation, Children, Comedy, Fantasy, Romance,
                Drama, Action, Crime, Thriller, Horror, Mystery, SciFi, IMAX, Documentary, War, Musical,
                Western, FilmNoir, noGenresListed
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        movie_data = (int(movie_id), int(year), avg_rating, *genre_ratings)
        cursor.execute(insert_query, movie_data)
        connection.commit()
    except Exception as e:
        print(f"Error inserting into movie: {e}")
    finally:
        cursor.close()
        
def insert_movie_tmdb_link(connection, movie_id, tmdb_id):
    try:
        cursor = connection.cursor()
        insert_query = """
            INSERT INTO movie_tmdb_link (movieId, tmdbId)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (int(movie_id), int(tmdb_id)))
        connection.commit()
    except Exception as e:
        print(f"Error inserting into movie_tmdb_links: {e}")
    finally:
        cursor.close()
        
def load_and_insert_data():

    movies = pd.read_csv("movies_vecs.csv")
    links = pd.read_csv("links.csv")

    connection = connect_to_postgres()
    if not connection:
        return
    
    print("Inserting movies ...")
    for _, movie_row in tqdm.tqdm(movies.iterrows(), total=movies.shape[0]):
        movie_id = movie_row['movieId']
        year = movie_row['year']
        avg_rating = movie_row['avg_ratings']
        genre_ratings = movie_row[['Adventure', 'Animation', 'Children', 'Comedy', 'Fantasy', 'Romance', 
                           'Drama', 'Action', 'Crime', 'Thriller', 'Horror', 'Mystery', 'Sci-Fi', 
                           'IMAX', 'Documentary', 'War', 'Musical', 'Western', 'Film-Noir', '(no genres listed)']].values.tolist()

        insert_movie(connection, movie_id, year, avg_rating, genre_ratings)
    print("Done inserting movies ...")
    
    print("Inserting movie links ...")
    i = 0
    for _, link_row in tqdm.tqdm(links.iterrows(), total=links.shape[0]):
        i+=1
        movie_id = link_row['movieId']
        tmdb_id = link_row['tmdbId']
        
        insert_movie_tmdb_link(connection, movie_id, tmdb_id)

        
    print("Done inserting movie links ...")
    connection.close()

if __name__ == "__main__":
    load_and_insert_data()
