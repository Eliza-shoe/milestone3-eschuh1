# pylint: disable=E0401
"""
This file does the interfacing with tmdb. In the first
function it takes a random imdb id with identifier i (passed from the main app) and
returns the movie's general data.
The second function takes the genre ids from the output of get_tmdb and
converts them into a list of genres.
"""

import os
from dotenv import load_dotenv, find_dotenv
import requests

load_dotenv(find_dotenv())


def get_tmdb(i):
    """This gets the json for the desired movie and then parses out and returns the movie details"""
    movies = {1: ["tt0250494"], 2: ["tt0071853"], 3: ["tt3464902"]}

    api_key = os.getenv("TMDB_KEY")

    url = (
        f"https://api.themoviedb.org/3/find/{movies[i][0]}?api_key={api_key}"
        + "&language=en-US&external_source=imdb_id"
    )

    response = requests.get(url)

    resp = response.json()
    data = resp["movie_results"][0]

    return data


def get_genre(my_ids):
    """this gets the genre from the id"""

    api_key = os.getenv("TMDB_KEY")
    url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={api_key}&language=en-US"
    response = requests.get(url)
    data = response.json()

    genre_list = []

    for item in my_ids:
        for genre in data["genres"]:
            if genre["id"] == item:
                genre_list.append(genre["name"])
                break

    genres = "Genres: " + " ".join(genre_list)
    return genres
