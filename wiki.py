# pylint: disable=E0401
"""This file is for wikipedia API calls. Get_wiki takes the movie title and returns the page url"""

import wikipediaapi


def get_wiki(movie):
    """Imports wikipedia url"""
    wiki = wikipediaapi.Wikipedia("en")
    page = wiki.page(movie)
    url = page.fullurl
    return url
