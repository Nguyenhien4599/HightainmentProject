import requests

class JustWatchClient:
  def __init__(self):
    self.token = '7R2ZrUogbawMTTyl7GrNS2jfjeE2CqUJ'
    self.root_url = 'https://apis.justwatch.com/contentpartner/v2/content'

  def get_url(self, url_part):
    if url_part.startswith('/'):
        url_part = url_part[1:]
    if '?' in url_part:
        return f"{self.root_url}/{url_part}&token={self.token}"
    return f"{self.root_url}/{url_part}?token={self.token}"

  def get_all_providers(self, locale='en_US'):
    url = self.get_url(f"providers/all/locale/{locale}")
    print(url)
    response = requests.get(url).json()
    return response

  def get_all_genres(self, locale='en_US'):
    url = self.get_url(f"genres/all/locale/{locale}")
    response = requests.get(url).json()
    return response

  def get_active_countries(self):
    url = self.get_url("countries")
    response = requests.get(url).json()
    return response

  def get_watch_providers(self, title_type, tmdb_id, locale='en_US'):
    url = self.get_url(f"offers/object_type/{title_type}/id_type/tmdb/locale/{locale}?id={tmdb_id}")
    response = requests.get(url).json()
    return response

  def get_titles(self, query, release_year, locale='en_US'):
    #url = self.get_url(f"titles/object_type/all/locale/{locale}?query={query}&release_year={release_year}")
    url = self.get_url(f"titles/object_type/all/locale/{locale}?release_year={release_year}")
    response = requests.get(url).json()['items']
    return response

if __name__ == '__main__':
    jw_client = JustWatchClient()
    print(len(jw_client.get_all_providers()))
    print(len(jw_client.get_all_genres()))
    print(len(jw_client.get_active_countries()))
    print(jw_client.get_watch_providers('movie', 573435))
    print(len(jw_client.get_titles('', 2018)))
