"""This function packages all the data into one nice dictionary"""

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


def pretty_data(movie, i, genres, wiki):
    """This does all the packaging and has image links"""

    imgs = {
        1: "https://i.jeded.com/i/legally-blonde.10525.jpg",
        2: "https://www.themoviedb.org/t/p/w1280/8AVb7tyxZRsbKJNOTJHQZl7JYWO.jpg",
        3: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/oe3XoAL0he16IWLHFzdg32q5ty6.jpg",
    }

    data = {
        "title": movie["title"],
        "overview": movie["overview"],
        "id": movie["id"],
        "pic": imgs[i],
        "genres": genres,
        "wiki": wiki,
    }

    return data
