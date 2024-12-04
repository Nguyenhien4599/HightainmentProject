import requests
from data.data_gateway import DataGateway
import os

TMDB_PAGE_LIMIT = 500

class TMDBClient:
  def __init__(self):
    self.auth = f"Bearer {os.getenv('TMDB_API_KEY')}"
    self.dg = DataGateway()

  def _get_headers(self):
    return {
        "accept": "application/json",
        "Authorization": self.auth
    }

  def search_movies(self, query):
    url = f"https://api.themoviedb.org/3/search/movie?query={query}&include_adult=false&language=en-US&page=1"
    response = requests.get(url, headers=self._get_headers()).json()
    return list(filter(None, [self.dg.get_track_by_tmdb_id(movie["id"]) for movie in response["results"]]))

  def search_tv_series(self, query):
    url = f"https://api.themoviedb.org/3/search/tv?query={query}&include_adult=false&language=en-US&page=1"
    response = requests.get(url, headers=self._get_headers()).json()
    return list(filter(None, [self.dg.get_tracks_by_title_tmdb_id(movie["id"]) for movie in response["results"]]))
