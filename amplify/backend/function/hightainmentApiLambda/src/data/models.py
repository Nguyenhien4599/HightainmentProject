from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Date, Enum, Table, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import pycountry
import enum

Base = declarative_base()

class TitleType(enum.Enum):
    MOVIE = 'MOVIE'
    TV_SERIES = 'TV_SERIES'

class AgeRating(enum.Enum):
    R = 'R'

class UserType(enum.Enum):
    ADMIN = 'ADMIN'
    MEMBER = 'MEMBER'

class CountryISO(enum.Enum):
    AFGHANISTAN = "AF"
    ALBANIA = "AL"
    ALGERIA = "DZ"
    ANDORRA = "AD"
    ANGOLA = "AO"
    ANTIGUA_AND_BARBUDA = "AG"
    ARGENTINA = "AR"
    ARMENIA = "AM"
    AUSTRALIA = "AU"
    AUSTRIA = "AT"
    AZERBAIJAN = "AZ"
    BAHAMAS = "BS"
    BAHRAIN = "BH"
    BANGLADESH = "BD"
    BARBADOS = "BB"
    BELARUS = "BY"
    BELGIUM = "BE"
    BELIZE = "BZ"
    BENIN = "BJ"
    BHUTAN = "BT"
    BOLIVIA = "BO"
    BOSNIA_AND_HERZEGOVINA = "BA"
    BOTSWANA = "BW"
    BRAZIL = "BR"
    BRUNEI = "BN"
    BULGARIA = "BG"
    BURKINA_FASO = "BF"
    BURUNDI = "BI"
    CABO_VERDE = "CV"
    CAMBODIA = "KH"
    CAMEROON = "CM"
    CANADA = "CA"
    CENTRAL_AFRICAN_REPUBLIC = "CF"
    CHAD = "TD"
    CHILE = "CL"
    CHINA = "CN"
    COLOMBIA = "CO"
    COMOROS = "KM"
    CONGO_DEMOCRATIC_REPUBLIC = "CD"
    CONGO_REPUBLIC = "CG"
    COSTA_RICA = "CR"
    CROATIA = "HR"
    CUBA = "CU"
    CYPRUS = "CY"
    CZECH_REPUBLIC = "CZ"
    DENMARK = "DK"
    DJIBOUTI = "DJ"
    DOMINICA = "DM"
    DOMINICAN_REPUBLIC = "DO"
    ECUADOR = "EC"
    EGYPT = "EG"
    EL_SALVADOR = "SV"
    EQUATORIAL_GUINEA = "GQ"
    ERITREA = "ER"
    ESTONIA = "EE"
    ESWATINI = "SZ"
    ETHIOPIA = "ET"
    FIJI = "FJ"
    FINLAND = "FI"
    FRANCE = "FR"
    GABON = "GA"
    GAMBIA = "GM"
    GEORGIA = "GE"
    GERMANY = "DE"
    GHANA = "GH"
    GREECE = "GR"
    GRENADA = "GD"
    GUATEMALA = "GT"
    GUINEA = "GN"
    GUINEA_BISSAU = "GW"
    GUYANA = "GY"
    HAITI = "HT"
    HONDURAS = "HN"
    HUNGARY = "HU"
    HONG_KONG = "HK"
    ICELAND = "IS"
    INDIA = "IN"
    INDONESIA = "ID"
    IRAN = "IR"
    IRAQ = "IQ"
    IRELAND = "IE"
    ISRAEL = "IL"
    ITALY = "IT"
    JAMAICA = "JM"
    JAPAN = "JP"
    JORDAN = "JO"
    KAZAKHSTAN = "KZ"
    KENYA = "KE"
    KIRIBATI = "KI"
    KOREA_NORTH = "KP"
    KOREA_SOUTH = "KR"
    KUWAIT = "KW"
    KYRGYZSTAN = "KG"
    LAOS = "LA"
    LATVIA = "LV"
    LEBANON = "LB"
    LESOTHO = "LS"
    LIBERIA = "LR"
    LIBYA = "LY"
    LIECHTENSTEIN = "LI"
    LITHUANIA = "LT"
    LUXEMBOURG = "LU"
    MADAGASCAR = "MG"
    MALAWI = "MW"
    MALAYSIA = "MY"
    MALDIVES = "MV"
    MALI = "ML"
    MALTA = "MT"
    MARSHALL_ISLANDS = "MH"
    MAURITANIA = "MR"
    MAURITIUS = "MU"
    MEXICO = "MX"
    MICRONESIA = "FM"
    MOLDOVA = "MD"
    MONACO = "MC"
    MONGOLIA = "MN"
    MONTENEGRO = "ME"
    MOROCCO = "MA"
    MOZAMBIQUE = "MZ"
    MYANMAR = "MM"
    NAMIBIA = "NA"
    NAURU = "NR"
    NEPAL = "NP"
    NETHERLANDS = "NL"
    NEW_ZEALAND = "NZ"
    NICARAGUA = "NI"
    NIGER = "NE"
    NIGERIA = "NG"
    NORTH_MACEDONIA = "MK"
    NORWAY = "NO"
    OMAN = "OM"
    PAKISTAN = "PK"
    PALAU = "PW"
    PANAMA = "PA"
    PAPUA_NEW_GUINEA = "PG"
    PARAGUAY = "PY"
    PERU = "PE"
    PHILIPPINES = "PH"
    POLAND = "PL"
    PORTUGAL = "PT"
    QATAR = "QA"
    ROMANIA = "RO"
    RUSSIA = "RU"
    RWANDA = "RW"
    SAINT_KITTS_AND_NEVIS = "KN"
    SAINT_LUCIA = "LC"
    SAINT_VINCENT_AND_THE_GRENADINES = "VC"
    SAMOA = "WS"
    SAN_MARINO = "SM"
    SAO_TOME_AND_PRINCIPE = "ST"
    SAUDI_ARABIA = "SA"
    SENEGAL = "SN"
    SERBIA = "RS"
    SEYCHELLES = "SC"
    SIERRA_LEONE = "SL"
    SINGAPORE = "SG"
    SLOVAKIA = "SK"
    SLOVENIA = "SI"
    SOLOMON_ISLANDS = "SB"
    SOMALIA = "SO"
    SOUTH_AFRICA = "ZA"
    SOUTH_SUDAN = "SS"
    SPAIN = "ES"
    SRI_LANKA = "LK"
    SUDAN = "SD"
    SURINAME = "SR"
    SWEDEN = "SE"
    SOVIET_UNION = "SU"
    SWITZERLAND = "CH"
    SYRIA = "SY"
    TAIWAN = "TW"
    TAJIKISTAN = "TJ"
    TANZANIA = "TZ"
    THAILAND = "TH"
    TIMOR_LESTE = "TL"
    TOGO = "TG"
    TONGA = "TO"
    TRINIDAD_AND_TOBAGO = "TT"
    TUNISIA = "TN"
    TURKEY = "TR"
    TURKMENISTAN = "TM"
    TUVALU = "TV"
    UGANDA = "UG"
    UKRAINE = "UA"
    UNITED_ARAB_EMIRATES = "AE"
    UNITED_KINGDOM = "GB"
    UNITED_STATES = "US"
    URUGUAY = "UY"
    UZBEKISTAN = "UZ"
    VANUATU = "VU"
    VATICAN_CITY = "VA"
    VENEZUELA = "VE"
    VIETNAM = "VN"
    YEMEN = "YE"
    ZAMBIA = "ZM"
    ZIMBABWE = "ZW"

    @classmethod
    def from_value(cls, value):
        for member in cls:
            if member.value == value:
                return member
        raise ValueError(f"{value} is not a valid {cls.__name__}")

tracks_to_genres = Table(
    'tracks_to_genres', Base.metadata,
    Column('track_id', Integer, ForeignKey('tracks.id'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id'), primary_key=True)
)

auras_to_tags = Table(
    'auras_to_tags', Base.metadata,
    Column('aura_id', Integer, ForeignKey('auras.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

auras_to_genres = Table(
    'auras_to_genres', Base.metadata,
    Column('aura_id', Integer, ForeignKey('auras.id'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id'), primary_key=True)
)

auras_to_watch_providers = Table(
    'auras_to_watch_providers', Base.metadata,
    Column('aura_id', Integer, ForeignKey('auras.id'), primary_key=True),
    Column('watch_provider_id', Integer, ForeignKey('watch_providers.id'), primary_key=True),
)

users_to_watch_providers = Table(
    'users_to_watch_providers', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('parent_watch_provider_id', Integer, ForeignKey('parent_watch_providers.id'), primary_key=True),
)

users_to_tracks_watched = Table(
    'watched_tracks', Base.metadata,
    Column('user_id', String, ForeignKey('users.id'), primary_key=True),
    Column('track_id', Integer, ForeignKey('tracks.id'), primary_key=True),
    Column('created_at', Date, nullable=False, default=func.now()),
    Column('updated_at', Date, nullable=False, default=func.now(), onupdate=func.now())
)

users_to_tracks_watch_later = Table(
    'watch_later_tracks', Base.metadata,
    Column('user_id', String, ForeignKey('users.id'), primary_key=True),
    Column('track_id', Integer, ForeignKey('tracks.id'), primary_key=True),
    Column('created_at', Date, nullable=False, default=func.now()),
    Column('updated_at', Date, nullable=False, default=func.now(), onupdate=func.now())
)

class Title(Base):
    __tablename__ = 'titles'
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    local_name = Column(String)
    english_name = Column(String)
    type = Column(Enum(TitleType), nullable=False)
    age_rating = Column(Enum(AgeRating))
    country_of_origin = Column(Enum(CountryISO))
    original_language = Column(String)
    summary = Column(String)
    main_trailer_url = Column(String)
    main_photo_url = Column(String)
    tracks = relationship('Track', backref='title', cascade='all, delete, delete-orphan')

class Track(Base):
    __tablename__ = 'tracks'
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    name = Column(String)
    season = Column(Integer)
    episode_count = Column(Integer)
    release_date = Column(Date)
    duration_in_seconds = Column(Integer)
    title_id = Column(Integer, ForeignKey('titles.id'))
    main_trailer_url = Column(String)
    main_photo_url = Column(String)
    backdrop_photo_url = Column(String)
    user_score = Column(Integer)
    user_score_count = Column(Integer)
    hightainment_score = Column(Integer)
    summary = Column(String)
    track_to_tags = relationship("TrackToTag", back_populates="track")
    genres = relationship('Genre', secondary=tracks_to_genres, back_populates='tracks')
    track_to_watch_providers = relationship("TrackToWatchProvider", back_populates="track")
    reviews = relationship('Review', backref='track', cascade='all, delete, delete-orphan')
    users_watched = relationship('User', secondary=users_to_tracks_watched, back_populates='watched_tracks')
    users_watch_later = relationship('User', secondary=users_to_tracks_watch_later, back_populates='watch_later_tracks')

class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    display_priority = Column(Integer)
    tag_to_tracks = relationship('TrackToTag', back_populates='tag')
    tag_to_reviews = relationship("ReviewToTag", back_populates='tag')
    auras = relationship('Aura', secondary=auras_to_tags, back_populates='tags')

class Genre(Base):
    __tablename__ = 'genres'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    display_priority = Column(Integer)
    tracks = relationship('Track', secondary=tracks_to_genres, back_populates='genres')
    auras = relationship('Aura', secondary=auras_to_genres, back_populates='genres')

class ParentWatchProvider(Base):
    __tablename__ = 'parent_watch_providers'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    logo_url = Column(String)
    display_priority = Column(Integer)
    watch_providers = relationship('WatchProvider', backref='parent_watch_provider', cascade='all, delete, delete-orphan')
    users_watch_provider = relationship('User', secondary=users_to_watch_providers, back_populates='parent_watch_providers')

class WatchProvider(Base):
    __tablename__ = 'watch_providers'
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    name = Column(String)
    logo_url = Column(String)
    display_priority = Column(Integer)
    watch_provider_to_tracks = relationship('TrackToWatchProvider', back_populates='watch_provider')
    auras = relationship('Aura', secondary=auras_to_watch_providers, back_populates='watch_providers')
    parent_watch_provider_id = Column(Integer, ForeignKey('parent_watch_providers.id'))

class TrackToWatchProvider(Base):
    __tablename__ = 'tracks_to_watch_providers'
    id = Column(Integer, primary_key=True)
    track_id = Column(Integer, ForeignKey('tracks.id'), nullable=False)
    watch_provider_id = Column(Integer, ForeignKey('watch_providers.id'), nullable=False)
    track = relationship('Track', back_populates='track_to_watch_providers')
    watch_provider = relationship('WatchProvider', back_populates='watch_provider_to_tracks')

    watch_provider_link = Column('watch_provider_link', String)
    watch_provider_locale = Column('watch_provider_locale', String)
    watch_provider_type = Column('watch_provider_type', String)

class TrackToTag(Base):
    __tablename__ = 'tracks_to_tags'
    id = Column(Integer, primary_key=True)
    track_id = Column(Integer, ForeignKey('tracks.id'), nullable=False)
    tag_id = Column(Integer, ForeignKey('tags.id'), nullable=False)
    track = relationship('Track', back_populates='track_to_tags')
    tag = relationship('Tag', back_populates='tag_to_tracks')
    average_rating = Column(Integer)
    rating_count = Column(Integer)

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    username = Column(String, nullable=False)
    type = Column(Enum(UserType), nullable=False, default=UserType.MEMBER)
    email = Column(String)
    profile_photo_url = Column(String)
    reviews = relationship('Review', backref='user', cascade='all, delete, delete-orphan')
    watched_tracks = relationship('Track', secondary=users_to_tracks_watched, back_populates='users_watched')
    watch_later_tracks = relationship('Track', secondary=users_to_tracks_watch_later, back_populates='users_watch_later')
    parent_watch_providers = relationship('ParentWatchProvider', secondary=users_to_watch_providers, back_populates='users_watch_provider')

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True, autoincrement=True)
    track_id = Column(Integer, ForeignKey('tracks.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    content = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    review_to_tags = relationship('ReviewToTag', back_populates='review')
    created_at = Column(Date, nullable=False, default=func.now())
    updated_at = Column(Date, nullable=False, default=func.now(), onupdate=func.now())
    

class ReviewToTag(Base):
    __tablename__ = 'reviews_to_tags'
    id = Column(Integer, primary_key=True, autoincrement=True)
    review_id = Column(Integer, ForeignKey('reviews.id'), nullable=False)
    tag_id = Column(Integer, ForeignKey('tags.id'), nullable=False)

    review = relationship('Review', back_populates='review_to_tags')
    tag = relationship('Tag', back_populates='tag_to_reviews')

    rating = Column(Integer, nullable=False)
    rating_denominator = Column(Integer, nullable=False)

class Aura(Base):
    __tablename__ = 'auras'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    min_release_date = Column(Date)
    max_release_date = Column(Date)
    media_type = Column(String)
    created_at = Column(Date, nullable=False, default=func.now())
    updated_at = Column(Date, nullable=False, default=func.now(), onupdate=func.now())
    tags = relationship('Tag', secondary=auras_to_tags, back_populates='auras')
    genres = relationship('Genre', secondary=auras_to_genres, back_populates='auras')
    watch_providers = relationship('WatchProvider', secondary=auras_to_watch_providers, back_populates='auras')

