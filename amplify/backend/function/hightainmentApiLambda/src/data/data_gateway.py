import os
from sqlalchemy import create_engine, desc, delete, extract
from sqlalchemy.orm import sessionmaker, contains_eager
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm import scoped_session
from sqlalchemy.inspection import inspect
from sqlalchemy.orm import DeclarativeMeta, joinedload
from sqlalchemy.orm import class_mapper
from typing import Any, Dict, Union, List
from enum import Enum
from datetime import datetime, date, time, timedelta
from uuid import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import or_, func, desc, distinct, and_
import boto3
import json
import urllib.parse

from functools import wraps

Base = declarative_base()

from data.models import Title, TitleType, CountryISO, Track, Genre, Tag, TrackToWatchProvider, WatchProvider, tracks_to_genres, Review, ReviewToTag, User, Aura, TrackToTag, users_to_tracks_watch_later, users_to_tracks_watched, ParentWatchProvider,users_to_watch_providers

DEFAULT_RATING_DENOMINATOR = 10
def jsonable_encoder(
    obj: Any,
    include: Union[Dict[str, Any], List[str], None] = None,
    exclude: Union[Dict[str, Any], List[str], None] = None,
    by_alias: bool = False,
    skip_defaults: bool = False,
    exclude_unset: bool = False,
    exclude_defaults: bool = False,
    exclude_none: bool = False,
) -> Any:
    if isinstance(obj.__class__, DeclarativeMeta):
        # Convert SQLAlchemy ORM models to dictionaries
        return {
            key: jsonable_encoder(value)
            for key, value in obj.__dict__.items()
            if not key.startswith("_sa_instance_state")
        }
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, time):
        if obj.utcoffset() is not None:
            raise ValueError("JSON can't represent timezone-aware times.")
        return obj.isoformat()
    if isinstance(obj, timedelta):
        return obj.total_seconds()
    if isinstance(obj, Enum):
        return obj.value
    if isinstance(obj, bytes):
        return obj.decode()
    if isinstance(obj, UUID):
        return str(obj)
    if isinstance(obj, set):
        return list(obj)
    if isinstance(obj, list):
        return [jsonable_encoder(item) for item in obj]
    if isinstance(obj, tuple):
        return tuple(jsonable_encoder(item) for item in obj)
    if isinstance(obj, dict):
        return {
            jsonable_encoder(key): jsonable_encoder(value)
            for key, value in obj.items()
        }
    return obj

#client = boto3.client('secretsmanager', 'us-east-1')
#secret = client.get_secret_value(SecretId="rdsproxy")

#db_credentials = json.loads(secret['SecretString'])
#print("db credentials", db_credentials)
host = 'hightainmentrdsproxy.proxy-c1uwo48uiuvj.us-east-1.rds.amazonaws.com'
encoded_password = urllib.parse.quote_plus(os.getenv('RDS_PASSWORD'))
DATABASE_URL = f"mysql+pymysql://{os.getenv('RDS_USERNAME')}:{encoded_password}@{os.getenv('RDS_HOST')}/{os.getenv('DATABASE_NAME')}"
#encoded_password = urllib.parse.quote_plus(db_credentials['password'])
#DATABASE_URL = f"mysql+pymysql://{db_credentials['username']}:{encoded_password}@{host}/{os.getenv('DATABASE_NAME')}"
#print(DATBASE_URL)
PAGE_SIZE = 10
engine = create_engine(DATABASE_URL)
Session = scoped_session(sessionmaker(bind=engine))

def transactional(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        try:
            result = func(self, *args, **kwargs)
            self.session.commit()
            return result
        except Exception as e:
            self.session.rollback()
            raise e
        finally:
            self.session.close()
    return wrapper

class DataGateway():
  def __init__(self):
    self.session = Session()

  @transactional
  def get_genres(self):
    genres = self.session.query(Genre).all()
    return jsonable_encoder(genres)

  @transactional
  def get_tags(self):
    tags = self.session.query(Tag).all()
    return jsonable_encoder(tags)

  @transactional
  def get_watch_providers(self):
    watch_providers = self.session.query(
        ParentWatchProvider,
    ).options(joinedload(ParentWatchProvider.watch_providers)).all()
    return jsonable_encoder(watch_providers)

  @transactional
  def add_watch_provider_to_user(self, user_id, parent_watch_provider_id):
    user = self.session.query(User).get(user_id)
    parent_watch_provider = self.session.query(ParentWatchProvider).get(parent_watch_provider_id)
    user.parent_watch_providers.append(parent_watch_provider)
    self.session.commit()
    return self.get_user(user_id)

  @transactional
  def delete_watch_provider_from_user(self, user_id, parent_watch_provider_id):
    stmt = delete(users_to_watch_providers).where(
        users_to_watch_providers.c.parent_watch_provider_id == parent_watch_provider_id,
        users_to_watch_providers.c.user_id == user_id
    )
    self.session.execute(stmt)
    self.session.commit()
    return True


  @transactional
  def get_titles(self, user_id, watch_provider_ids, genre_ids, tag_ids, min_release_date, max_release_date, title_types, locale, page):
    offset_value = (page - 1) * PAGE_SIZE
    query = self.session.query(
        Title,
        Track
    ).join(Track, Title.tracks)\
      .filter(Title.type.in_(title_types))\
      .join(TrackToWatchProvider, Track.id == TrackToWatchProvider.track_id)\
      .outerjoin(users_to_tracks_watched, and_(Track.id == users_to_tracks_watched.c.track_id, users_to_tracks_watched.c.user_id == user_id)) \
      .outerjoin(users_to_tracks_watch_later, and_(Track.id == users_to_tracks_watch_later.c.track_id, users_to_tracks_watch_later.c.user_id == user_id))\
      .filter(users_to_tracks_watched.c.track_id == None, users_to_tracks_watch_later.c.track_id == None)\
      .filter(Track.user_score_count > 5)\
      .filter(Track.user_score > 0)\
      .filter(Track.release_date <= func.current_date())\
      .filter(TrackToWatchProvider.watch_provider_locale == locale)

    if min_release_date is not None:
        query = query.filter(Track.release_date >= min_release_date)

    if max_release_date is not None:
        query = query.filter(Track.release_date < max_release_date)

    # Filter by watch_provider_ids
    if len(watch_provider_ids) > 0:
        query = query.filter(TrackToWatchProvider.watch_provider_id.in_(watch_provider_ids))

    # Filter by genre_ids and apply join conditionally
    if len(genre_ids) > 0 and genre_ids[0] is not None:
        query = query.join(tracks_to_genres, Track.id == tracks_to_genres.c.track_id)\
                     .join(Genre, Genre.id == tracks_to_genres.c.genre_id)\
                     .filter(Genre.id.in_(genre_ids))

    # Filter by tag_ids and apply join conditionally
    if len(tag_ids) > 0 and tag_ids[0] is not None:
        query = query.join(TrackToTag, Track.id == TrackToTag.track_id)\
                     .filter(TrackToTag.tag_id.in_(tag_ids))

    # Grouping and ordering by user_score
    if len(tag_ids) == 1:
        query = query.order_by(
            desc(extract('year', Track.release_date).label('release_year')),
            desc(extract('month', Track.release_date).label('release_month')),
            desc(TrackToTag.average_rating), 
            desc(Track.user_score))
    else:
        query = query.order_by(
            desc(extract('year', Track.release_date).label('release_year')),
            desc(extract('month', Track.release_date).label('release_month')),
            desc(Track.user_score))
    query = query.distinct(Track.id)\
                 .offset(offset_value)\
                 .limit(PAGE_SIZE)

    # Execute and fetch all results at once to avoid the loop overhead
    results = query.all()

    # Handle serialization outside of the loop
    serialized_results = [{
        'title': jsonable_encoder(title),
        **jsonable_encoder(track),
    } for title, track in results]

    return serialized_results
  

  @transactional
  def get_title(self, title_id, locale):
    title = (
        self.session.query(Title)
        .join(Title.tracks)
        .outerjoin(Track.track_to_watch_providers)
        .outerjoin(TrackToWatchProvider.watch_provider)
        .filter(Title.id == title_id)
        .filter(
            or_(
                TrackToWatchProvider.watch_provider_locale == locale,
                TrackToWatchProvider.id.is_(None)  # Ensure titles without watch providers are included
            )
        )
        .options(
            contains_eager(Title.tracks)
            .contains_eager(Track.track_to_watch_providers)
            .contains_eager(TrackToWatchProvider.watch_provider),
            joinedload(Title.tracks, Track.genres),
            joinedload(Title.tracks, Track.tags),
            joinedload(Title.tracks, Track.reviews)
        ).one()
    )
    return title

  @transactional
  def get_track(self, track_id, locale):
    track = (
        self.session.query(Track)
        .outerjoin(Track.track_to_watch_providers)
        .outerjoin(TrackToWatchProvider.watch_provider)
        .filter(Track.id == track_id)
        .filter(
            or_(
                TrackToWatchProvider.watch_provider_locale == locale,
                TrackToWatchProvider.id.is_(None)  # Ensure titles without watch providers are included
            )
        )
        .options(
            contains_eager(Track.track_to_watch_providers)
            .contains_eager(TrackToWatchProvider.watch_provider),
            joinedload(Track.genres),
            joinedload(Track.track_to_tags).joinedload(TrackToTag.tag),
            joinedload(Track.reviews)
        ).one()
    )
    return {
        'title': jsonable_encoder(self.session.query(Title).get(track.title_id)),
        **jsonable_encoder(track)
    }

  @transactional
  def get_track_by_tmdb_id(self, tmdb_id, locale='US'):
    try:
        track = (
            self.session.query(Track)
            .outerjoin(Track.track_to_watch_providers)
            .outerjoin(TrackToWatchProvider.watch_provider)
            .filter(Track.tmdb_id == tmdb_id)
            .filter(
                or_(
                    TrackToWatchProvider.watch_provider_locale == locale,
                    TrackToWatchProvider.id.is_(None)  # Ensure titles without watch providers are included
                )
            ).one()
        )
        
        return {
            'title': jsonable_encoder(self.session.query(Title).filter(Title.tmdb_id == tmdb_id).one()),
            **jsonable_encoder(track)
        }
    except NoResultFound:
        return None

  @transactional
  def get_tracks_by_title_tmdb_id(self, tmdb_id, locale='US'):
    try:
        tracks = (
            self.session.query(Track)
            .join(Title)
            .filter(Title.tmdb_id == tmdb_id)
            .outerjoin(Track.track_to_watch_providers)
            .outerjoin(TrackToWatchProvider.watch_provider)
            .filter(
                or_(
                    TrackToWatchProvider.watch_provider_locale == locale,
                    TrackToWatchProvider.id.is_(None)  # Ensure titles without watch providers are included
                )
            ).all()
        )
        
        return [{
            'title': jsonable_encoder(self.session.query(Title).filter(Title.tmdb_id == tmdb_id).one()),
            **jsonable_encoder(track)
        } for track in tracks] 
    except NoResultFound:
        return None

  @transactional
  def add_review(self, user_id, track_id, content, rating, tag_id_to_ratings):
    track = self.session.query(Track).options(joinedload(Track.track_to_tags).joinedload(TrackToTag.tag)).get(track_id)
    user = self.session.query(User).get(user_id)
    review = Review(user=user, track=track, content=content, rating=rating)
    self.session.add(review)
    track.user_score = (track.user_score * track.user_score_count + rating) / (track.user_score_count + 1)
    track.user_score_count += 1
    for tag_id, tag_rating in tag_id_to_ratings.items():
        if tag_rating is None:
            continue
        track_to_tag = self.session.query(TrackToTag).filter(TrackToTag.tag_id == tag_id, TrackToTag.track_id == track_id).first()
        if track_to_tag is None:
            new_track_to_tag = TrackToTag(track_id = track_id, tag_id = tag_id, average_rating = tag_rating, rating_count = 1)
            self.session.add(new_track_to_tag)
        else:
            track_to_tag.average_rating = (track_to_tag.average_rating * track_to_tag.rating_count + tag_rating) / (track_to_tag.rating_count + 1)
            track_to_tag.rating_count += 1
        review_to_tag = ReviewToTag(review=review, tag_id=tag_id, rating=tag_rating, rating_denominator=DEFAULT_RATING_DENOMINATOR)
        self.session.add(review_to_tag)
    self.session.commit()
    return self.get_review(review.id)

  def update_review(self, review_id, content, rating, tag_id_to_ratings):
    review = self.session.query(Review).get(review_id)
    track_id = review.track_id
    track = self.session.query(Track).get(track_id)
    if content:
        review.content = content

    if rating:
        track.user_score = (track.user_score * track.user_score_count - review.rating + rating) / track.user_score_count
    
    for tag_id, tag_rating in tag_id_to_ratings.items():
        if tag_rating is None:
            continue
        track_to_tag = self.session.query(TrackToTag).filter(TrackToTag.tag_id == tag_id, TrackToTag.track_id == track_id).first()
        review_to_tag = self.session.query(ReviewToTag).filter(ReviewToTag.review_id == review_id, ReviewToTag.tag_id == tag_id).first()
        if review_to_tag is None:
            review_to_tag = ReviewToTag(review=review, tag_id=tag_id, rating=tag_rating, rating_denominator=DEFAULT_RATING_DENOMINATOR)
            self.session.add(review_to_tag)

        if track_to_tag is None:
            new_track_to_tag = TrackToTag(track_id = track_id, tag_id = tag_id, average_rating = tag_rating, rating_count = 1)
            self.session.add(new_track_to_tag)
        else:
            track_to_tag.average_rating = (track_to_tag.average_rating * track_to_tag.rating_count - review_to_tag.rating + tag_rating) / (track_to_tag.rating_count)
        review_to_tag.rating = tag_rating
    self.session.commit()
    return self.get_review(review.id)

  @transactional
  def get_review(self, review_id):
    return jsonable_encoder(self.session.query(Review).options(
            joinedload(Review.user),
            joinedload(Review.review_to_tags).joinedload(ReviewToTag.tag)
        ).filter_by(id=review_id).first())

  @transactional
  def get_track_reviews(self, track_id):
    return jsonable_encoder(self.session.query(Review).filter(Review.track_id == track_id).options(
            joinedload(Review.user),
            joinedload(Review.review_to_tags).joinedload(ReviewToTag.tag)
        ).order_by(desc(Review.created_at)).all())

  @transactional
  def get_user_reviews(self, user_id):
    return jsonable_encoder(self.session.query(Review).filter(Review.user_id == user_id).options(
            joinedload(Review.user),
            joinedload(Review.review_to_tags).joinedload(ReviewToTag.tag),
            joinedload(Review.track),
        ).order_by(desc(Review.created_at)).all())

  @transactional
  def get_auras(self, user_id):
    return jsonable_encoder(self.session.query(Aura).filter(Aura.user_id == user_id).options(joinedload(Aura.tags), joinedload(Aura.genres), joinedload(Aura.watch_providers)).order_by(desc(Aura.updated_at)).all())

  @transactional
  def get_aura(self, aura_id):
    return jsonable_encoder(self.session.query(Aura).options(joinedload(Aura.tags), joinedload(Aura.genres), joinedload(Aura.watch_providers)).get(aura_id))

  @transactional
  def delete_aura(self, aura_id):
    aura = self.session.get(Aura, aura_id)
    
    if aura:
        self.session.delete(aura)
        self.session.commit()

    return aura

  @transactional
  def get_user(self, user_id):
    user = self.session.query(User).options(
        joinedload(User.parent_watch_providers), 
        joinedload(User.reviews).joinedload(Review.review_to_tags).joinedload(ReviewToTag.tag),
        joinedload(User.reviews).joinedload(Review.track),
        joinedload(User.watched_tracks), 
        joinedload(User.watch_later_tracks)).filter(User.id == user_id).one()
    return jsonable_encoder(user)

  @transactional
  def update_user(self, user_id, username, email):
    user = self.session.get(User, user_id)
    if username:
        user.username = username

    if email:
        user.email = email
    
    self.session.commit()
    return self.session.query(User).get(user_id)


  @transactional
  def add_aura(self, user_id, aura_name, genre_ids, tag_ids, watch_provider_ids, min_release_date, max_release_date, media_type):
    aura = Aura(name=aura_name, user_id=user_id)
    self.session.add(aura)
    for genre_id in genre_ids:
      genre = self.session.query(Genre).get(genre_id)
      aura.genres.append(genre)

    for tag_id in tag_ids:
      tag = self.session.query(Tag).get(tag_id)
      aura.tags.append(tag)

    for watch_provider_id in watch_provider_ids:
      watch_provider = self.session.query(WatchProvider).get(watch_provider_id)
      aura.watch_providers.append(watch_provider)

    if min_release_date is not None:
        aura.min_release_date = min_release_date
    if max_release_date is not None:
        aura.max_release_date = max_release_date

    if media_type is not None:
        aura.media_type = media_type 
    aura = jsonable_encoder(aura)
    self.session.commit()
    return aura

  @transactional
  def update_aura(self, aura_id, aura_name):
    aura = self.session.query(Aura).get(aura_id)
    aura.name = aura_name
    self.session.add(aura)
    self.session.commit()
    return jsonable_encoder(aura)

  @transactional
  def add_to_watched_list(self, user_id, track_id):
    user = self.session.query(User).get(user_id)
    track = self.session.query(Track).get(track_id)
    watch_later = self.session.query(users_to_tracks_watch_later).filter(users_to_tracks_watch_later.c.track_id == track_id, users_to_tracks_watch_later.c.user_id == user_id).first()
    if watch_later:
        stmt = delete(users_to_tracks_watch_later).where(
            users_to_tracks_watch_later.c.track_id == track_id,
            users_to_tracks_watch_later.c.user_id == user_id
        )
        self.session.execute(stmt)
    user.watched_tracks.append(track)
    self.session.commit()
    return jsonable_encoder(self.session.query(Track).get(track_id))

  @transactional
  def delete_from_watched(self, user_id, track_id):
    stmt = delete(users_to_tracks_watched).where(
        users_to_tracks_watched.c.track_id == track_id,
        users_to_tracks_watched.c.user_id == user_id
    )
    self.session.execute(stmt)
    self.session.commit()
    return True

  @transactional
  def add_to_watch_later_list(self, user_id, track_id):
    user = self.session.query(User).get(user_id)
    track = self.session.query(Track).get(track_id)
    user.watch_later_tracks.append(track)
    self.session.commit()
    return jsonable_encoder(self.session.query(Track).get(track_id))

  @transactional
  def delete_from_watch_later(self, user_id, track_id):
    stmt = delete(users_to_tracks_watch_later).where(
        users_to_tracks_watch_later.c.track_id == track_id,
        users_to_tracks_watch_later.c.user_id == user_id
    )
    self.session.execute(stmt)
    self.session.commit()
    return True

if __name__ == '__main__':
  dg = DataGateway()
  print(dg.get_titles(1))
