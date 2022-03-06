import flask as f
from tmdb import get_tmdb, get_genre
import flask_login as fl
from wiki import get_wiki
from pretty_data import pretty_data
from random import randint


def make_pretty():
    i = randint(1, 3)
    try:
        my_movie = get_tmdb(i)
        genres = get_genre(my_movie["genre_ids"])  # sends list of genre ids
        wiki = get_wiki(my_movie["title"])
        data = pretty_data(my_movie, i, genres, wiki)
        return pretty_data
    except:
        lost_data = {
            "title": "Uh Oh!",
            "overview": "Looks like you're LOST",
            "pic": (
                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette2.wikia.nocookie.net%2Fl"
                + "ostpedia%2Fimages%2F4%2F4f%2FLOST_season_4_cover_art.jpg%2Frevision%2Flatest%3Fcb%3D20080111020615&f=1&nofb=1"
            ),
            "genres": "Genres: Disappointment Sadness",
            "wiki": "https://en.wikipedia.org/wiki/Error",
        }
        return f.render_template(
            "home.html", len=len(lost_data), movie=lost_data, name=fl.current_user.name
        )
