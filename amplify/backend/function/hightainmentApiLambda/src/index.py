import os
import json
from aws_lambda_powertools.event_handler.api_gateway import ApiGatewayResolver, Response
from aws_lambda_powertools.middleware_factory import lambda_handler_decorator
from enum import Enum
from aws_lambda_powertools.event_handler.exceptions import BadRequestError

from data.data_gateway import DataGateway, jsonable_encoder
from data.models import TitleType
from data.tmdb_client import TMDBClient

app = ApiGatewayResolver()
dg = DataGateway()
tc = TMDBClient()

class RecommendationType(Enum):
    GENRES = 'GENRES'
    TAGS = 'TAGS'
    BASE = 'BASE'

@lambda_handler_decorator
def middleware_after(handler, event, context):
    response = handler(event, context)
    response["headers"] = {}
    response["headers"]["Access-Control-Allow-Origin"] = "*"
    response["headers"]["Access-Control-Allow-Headers"] = "Content-Type"
    response["headers"]["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT"

    return response

@app.get("/titles/<title_id>")
def get_title(title_id: str):
    locale = app.current_event.get_query_string_value(name="locale", default_value="US")
    title =  dg.get_title(title_id, locale)
    return jsonable_encoder(title)

@app.get("/titles/<title_id>/tracks/<track_id>")
def get_track(title_id: str, track_id: str):
    locale = app.current_event.get_query_string_value(name="locale", default_value="US")
    track = dg.get_track(track_id, locale)
    return track

@app.get("/tracks/<track_id>")
def get_track_by_track_id(track_id: str):
    locale = app.current_event.get_query_string_value(name="locale", default_value="US")
    track = dg.get_track(track_id, locale)
    return track

@app.get("/recommendations")
def get_recommendations():
    user_id = get_user_id(app.current_event.request_context)
    query_page = app.current_event.get_query_string_value(name="page", default_value="1")
    query_genres = app.current_event.get_query_string_value(name="genres", default_value="")
    query_tags = app.current_event.get_query_string_value(name="tags", default_value="")
    query_watch_providers = app.current_event.get_query_string_value(name="watch_providers", default_value="")
    min_release_date = app.current_event.get_query_string_value(name="min_release_date", default_value=None)
    max_release_date = app.current_event.get_query_string_value(name="max_release_date", default_value=None)
    query_title_types = app.current_event.get_query_string_value(name="title_types", default_value="")
    query_locale = app.current_event.get_query_string_value(name="locale", default_value="US")

    page = int(query_page)
    genre_ids = [int(i) for i in query_genres.split(',')] if query_genres != '' else []
    tag_ids = [int(i) for i in query_tags.split(',')] if query_tags != '' else []
    watch_provider_ids = [int(i) for i in query_watch_providers.split(',')] if query_watch_providers != '' else []
    title_types = query_title_types.split(',') if query_title_types != '' else [TitleType.MOVIE, TitleType.TV_SERIES]
    print("TITLE_TYPES", title_types)
    
    dg = DataGateway()

    if len(genre_ids) == 0 and len(tag_ids) == 0:
        return {
            'type': RecommendationType.GENRES.value,
            'headers': [1, 4], # Action, Comedy
            'recommendations': [
                dg.get_titles(user_id,
                    watch_provider_ids, 
                    [header], 
                    [], 
                    min_release_date,
                    max_release_date,
                    title_types,
                    query_locale, 
                    page)
                for header in [1,4]
            ]
        }

    if len(genre_ids) > 0 and len(tag_ids) == 0:
        return {
            'type': RecommendationType.TAGS.value,
            'headers': [16, 9], # Visually Stunning, Auditary Stunning
            'recommendations': [
                dg.get_titles(user_id,
                    watch_provider_ids, 
                    genre_ids, 
                    [header],
                    min_release_date,
                    max_release_date,
                    title_types,
                    query_locale, 
                    page)
                for header in [16,9]
            ]
        }

    if len(tag_ids) > 0 and len(genre_ids) == 0:
        return {
            'type': RecommendationType.BASE.value,
            'headers': [None], # Visually Stunning, Auditary Stunning
            'recommendations': [
                dg.get_titles(user_id,
                    watch_provider_ids, 
                    [], 
                    tag_ids,
                    min_release_date,
                    max_release_date,
                    title_types,
                    query_locale, 
                    page)
                for header in [None]
            ]
        }
    return {
        'type': RecommendationType.BASE.value,
        'headers': [None], # Visually Stunning, Auditary Stunning
        'recommendations': [
            dg.get_titles(user_id,
                watch_provider_ids, 
                genre_ids, 
                tag_ids,
                min_release_date,
                max_release_date,
                title_types,
                query_locale, 
                page)
            for header in [None]
        ]
    }

@app.get("/genres")
def get_genres():
    return dg.get_genres()

@app.get("/tags")
def get_tags():
    tags = dg.get_tags()
    return tags

@app.get("/watch_providers")
def get_watch_providers():
    return dg.get_watch_providers()

@app.post("/titles/<title_id>/tracks/<track_id>/reviews")
def add_review(title_id: int, track_id: int):
    user_id = get_user_id(app.current_event.request_context)
    body = app.current_event.json_body
    review = dg.add_review(user_id, track_id, body['content'], body['rating'], body['tag_id_to_ratings'])
    return review

@app.post("/titles/<title_id>/tracks/<track_id>/watched")
def add_track_to_watched_list(title_id: int, track_id: int):
    user_id = get_user_id(app.current_event.request_context)
    track = dg.add_to_watched_list(user_id, track_id)
    return track

@app.delete("/titles/<title_id>/tracks/<track_id>/watched")
def delete_from_watched(title_id: int, track_id: int):
    user_id = get_user_id(app.current_event.request_context)
    return dg.delete_from_watched(user_id, track_id)

@app.post("/titles/<title_id>/tracks/<track_id>/watch_later")
def add_track_to_watch_later_list(title_id: int, track_id: int):
    user_id = get_user_id(app.current_event.request_context)
    body = app.current_event.json_body
    track = dg.add_to_watch_later_list(user_id, track_id)
    return track

@app.delete("/titles/<title_id>/tracks/<track_id>/watch_later")
def delete_from_watch_later(title_id: int, track_id: int):
    user_id = get_user_id(app.current_event.request_context)
    return dg.delete_from_watch_later(user_id, track_id)

@app.put("/reviews/<review_id>")
def update_review(review_id: int):
    user_id = get_user_id(app.current_event.request_context)
    body = app.current_event.json_body
    review = dg.update_review(review_id, body['content'], body['rating'], body['tag_id_to_ratings'])
    return review

@app.get("/titles/<title_id>/tracks/<track_id>/reviews")
def get_track_reviews(title_id: int, track_id: int):
    reviews = dg.get_track_reviews(track_id)
    return reviews

@app.get("/auras")
def get_auras():
    user_id = get_user_id(app.current_event.request_context)
    return dg.get_auras(user_id)

@app.get("/auras/<aura_id>")
def get_auras(aura_id: int):
    return dg.get_aura(aura_id)

@app.post("/auras")
def add_aura():
    user_id = get_user_id(app.current_event.request_context)
    body = app.current_event.json_body
    if body is None:
        raise BadRequestError("JSON body needs to be provided")
    name = body.get("name")
    if name is None:
        raise BadRequestError("Name is mandatory") 
    genre_ids = body.get("genre_ids", [])
    tag_ids = body.get("tag_ids", [])
    watch_provider_ids = body.get("watch_provider_ids", [])
    min_release_date = body.get("min_release_date", None)
    max_release_date = body.get("max_release_date", None)
    media_type = body.get("media_type", None)
    if len(genre_ids) == 0  and len(tag_ids) == 0 and len(watch_provider_ids) == 0:
        raise BadRequestError("Genres or tags or watch providers need to be provided")
    return dg.add_aura(user_id=user_id, aura_name=name, genre_ids=genre_ids, tag_ids=tag_ids, watch_provider_ids=watch_provider_ids, min_release_date=min_release_date, max_release_date=max_release_date, media_type=media_type)

@app.delete("/auras/<aura_id>")
def delete_aura(aura_id: int):
    user_id = get_user_id(app.current_event.request_context)
    aura = dg.get_aura(aura_id)
    if aura["user_id"] != user_id:
        raise BadRequestError("Cannot delete other user's aura")
    return jsonable_encoder(dg.delete_aura(aura_id))

@app.put("/auras/<aura_id>")
def update_aura(aura_id: int):
    user_id = get_user_id(app.current_event.request_context)
    body = app.current_event.json_body
    if body is None:
        raise BadRequestError("JSON body needs to be provided")
    aura_name = body.get("name")
    if aura_name is None:
        raise BadRequestError("Name is mandatory") 
    dg.update_aura(aura_id, aura_name)
    return dg.get_aura(aura_id)
    

@app.get("/users/<user_id>")
def get_user(user_id: str):
    return dg.get_user(user_id)

@app.post("/users/<user_id>/watch_providers")
def add_watch_provider_to_user(user_id: str):
    requester_user_id = get_user_id(app.current_event.request_context)
    if (user_id != requester_user_id):
        raise BadRequestError("Cannot change other user's info")

    body = app.current_event.json_body
    return dg.add_watch_provider_to_user(user_id, body.get("id"))

@app.delete("/users/<user_id>/watch_providers/<parent_watch_provider_id>")
def delete_watch_provider_from_user(user_id: str, parent_watch_provider_id: int):
    requester_user_id = get_user_id(app.current_event.request_context)
    if (user_id != requester_user_id):
        raise BadRequestError("Cannot change other user's info")

    return dg.delete_watch_provider_from_user(user_id, parent_watch_provider_id)

@app.get("/users/<user_id>/reviews")
def get_user_reviews(user_id: str):
    return dg.get_user_reviews(user_id)

@app.put("/users/<user_id>")
def update_user(user_id: str):
    requester_user_id = get_user_id(app.current_event.request_context)
    if (user_id != requester_user_id):
        raise BadRequestError("Cannot change other user's info")

    body = app.current_event.json_body
    return jsonable_encoder(dg.update_user(user_id, body.get("username"), body.get("email")))

@app.get("/search")
def search():
    query = app.current_event.get_query_string_value(name="query", default_value=None)
    return {'movies': tc.search_movies(query), 'tv_series': [item for sublist in tc.search_tv_series(query) for item in sublist]}

@middleware_after
def handler(event, context):
    return app.resolve(event, context)

def get_user_id(request_context):
    request_context = app.current_event.request_context

    # If using Cognito, extract the 'sub' claim for user ID
    if (not request_context.authorizer) or not ("claims" in request_context.authorizer):
        raise BadRequestError("User Not Found") 
    
    return request_context.authorizer["claims"].get("sub")
    

if __name__ == '__main__':
    KEVIN = '240874c8-e0e1-7062-067f-fc8d418eb28c'
    KY = '24c80468-a091-70bc-f50a-c466a7645c7f'
    MINHO = '341824b8-f0f1-70fe-e16a-aa668302f5cf'
    SETH = '84c844a8-c021-70cb-c13f-ceb763be46ac'
    VISUALLY_STUNNING_TAG_ID = 16
    HILARIOUS_TAG_ID = 7
    MUSIC = 9
    SUSPENSEFUL = 14
    dg = DataGateway()
    #print(dg.add_to_watched_list(MINHO, 678))

    #print(handler({
    #    'path': '/titles/1067/tracks/678/watch_later',
    #    'httpMethod': 'DELETE',
    #    'requestContext': {
    #        'authorizer': {
    #            'claims': {
    #                'sub': '341824b8-f0f1-70fe-e16a-aa668302f5cf'
    #            }
    #        }
    #    }
    #}, {
    #}))
    #dg.add_to_watched_list(MINHO, 678)
    #print(handler({
    #    'path': '/watch_providers',
    #    'httpMethod': 'GET',
    #}, {}))
    print(handler({
        'path': '/auras',
        'httpMethod': 'POST',
        'body': json.dumps({'name': 'Minho Test', 'genre_ids': [1], 'tag_ids': [16], 'watch_provider_ids': [1150], 'min_release_date': '2020-01-01', 'max_release_date': '2021-01-01', 'media_type': 'MOVIE'}),
        'requestContext': {
            'authorizer': {
                'claims': {
                    'sub': '341824b8-f0f1-70fe-e16a-aa668302f5cf'
                }
            }
        }
    }, {
    }))
    #print(handler({
    #    'path': '/auras',
    #    'httpMethod': 'GET',
    #    'requestContext': {
    #        'authorizer': {
    #            'claims': {
    #                'sub': '341824b8-f0f1-70fe-e16a-aa668302f5cf'
    #            }
    #        }
    #    }
    #}, {
    #}))
    #print(handler({
    #    'path': '/auras/2',
    #    'httpMethod': 'DELETE',
    #    'requestContext': {
    #        'authorizer': {
    #            'claims': {
    #                'sub': '341824b8-f0f1-70fe-e16a-aa668302f5cf'
    #            }
    #        }
    #    }
    #}, {
    #}))
    #print(handler({
    #    'path': '/titles/1019',
    #    'httpMethod': 'GET',
    #}, {}))
    #print(handler({
    #    #'path': '/titles/1026/tracks/637',
    #    'path': f'/users/{MINHO}/watch_providers',
    #    'httpMethod': 'POST',
    #    'body': json.dumps({'id': 1}),
    #    'requestContext': {
    #        'authorizer': {
    #            'claims': {
    #                'sub': MINHO
    #            }
    #        }
    #    }
    #}, {}))
    #print(handler({
    #    'path': '/genres',
    #    'httpMethod': 'GET',
    #}, {}))
    #print(handler({
    #    'path': '/recommendations',
    #    'httpMethod': 'GET',
    #    'queryStringParameters': {'page': '1', 'min_release_date': '2020-01-01', 'max_release_date': '2021-01-01', 'genre_ids': None, 'tag_ids': 16},
    #    #'queryStringParameters': {'page': '2'}
    #    'requestContext': {
    #        'authorizer': {
    #            'claims': {
    #                'sub': MINHO
    #            }
    #        }
    #    }
    #}, {}))
    #print(handler({
    #    'path': f'/users/{MINHO}',
    #    'httpMethod': 'GET',
    #}, {}))
    #print(handler({
    #    'path': '/titles/1067/tracks/678/reviews/51',
    #    'httpMethod': 'PUT',
    #    'body': json.dumps({'content': 'This movie is top-notch. Five stars all around', 'rating': 10, 'tag_id_to_ratings': {VISUALLY_STUNNING_TAG_ID: 10, MUSIC: 8, SUSPENSEFUL: 10}}),
    #    'requestContext': {
    #        'authorizer': {
    #            'claims': {
    #                'sub': MINHO
    #            }
    #        }
    #    }
    #}, {}))
    #print(handler({
    #    'path': '/titles/1026/tracks/637/reviews',
    #    'httpMethod': 'POST',
    #    'body': json.dumps({'user_id': '341824b8-f0f1-70fe-e16a-aa668302f5cf', 'content': "Christopher Nolan’s The Dark Knight is more than just a superhero film—it’s a gripping crime thriller that delves into themes of chaos, morality, and heroism. Released in 2008, this second entry in Nolan’s Dark Knight trilogy elevated the comic book movie genre to new heights with its thought-provoking narrative and complex characters.", 'rating': 8, 'tag_id_to_ratings': {15: 8, 19: 8}})
    #}, {}))
