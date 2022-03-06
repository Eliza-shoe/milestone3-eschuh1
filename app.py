"""Main file"""

# pylint: disable=E0401
# disabled because of imports

# pylint: disable=R1705
# disabled because it was angry at my necessary else statements
# after if statements with return functions

# pylint: disable=R0903
# disabled because it didn't like that the db classes have no methods

# pylint: disable=W0702
# disabled because my bare except does what I want it to

import os
from random import randint
import flask as f
from werkzeug.security import generate_password_hash, check_password_hash
import flask_login as fl
import flask_sqlalchemy as f_sql
from tmdb import get_tmdb, get_genre
from pretty_data import pretty_data
from wiki import get_wiki


# Set up globals


app = f.Flask(__name__)
app.secret_key = "I am a secret key for milestone2!"
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

db = f_sql.SQLAlchemy(app)  # help from trien hong on discord
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("HEROKU_POSTGRESQL_JADE_URL")
if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
    app.config["SQLALCHEMY_DATABASE_URI"] = app.config[
        "SQLALCHEMY_DATABASE_URI"
    ].replace("postgres://", "postgresql://")


db = f_sql.SQLAlchemy(app)
login_manager = fl.LoginManager(app)
login_manager.login_view = "app.login"
login_manager.init_app(app)


# Set up database


reviews_table = db.Table(
    # Table combining many to many relationship with reviews table
    "reviews_table",
    db.Column("review_id", db.Integer, db.ForeignKey("review.id"), primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("movie_id", db.Integer, db.ForeignKey("movie.id"), primary_key=True),
    db.Column("comment_id", db.Integer, db.ForeignKey("comment.id"), primary_key=True),
)


class User(fl.UserMixin, db.Model):
    """Defines each user of program, connects to Comments"""

    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(300), nullable=False)
    comments = db.relationship("Comment", backref="users", lazy=True)
    reviews_table = db.relationship(  # defines one-to-many relationship to comment
        "Review", secondary="reviews_table", backref=db.backref("users", lazy=True)
    )

    def __repr__(self):
        return f"<User !{self.id}!>"


class Movie(db.Model):
    """defines each movie in database, connects to Comments"""

    __tablename__ = "movie"
    id = db.Column(db.Integer, primary_key=True.__format__)
    my_id = db.Column(db.Integer, unique=True)
    rating = db.Column(db.Float, default=0)
    comments = db.relationship("Comment", backref="movies", lazy=True)
    reviews_table = db.relationship(  # defines one-to-many relationship to comment
        "Review", secondary="reviews_table", backref=db.backref("movies", lazy=True)
    )

    def __repr__(self):
        return f"<Movie !{self.id}!>"


class Comment(db.Model):
    """defines Comment class, has one-to-many relationship connecting to User and Movie"""

    __tablename__ = "comment"
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Float, nullable=False)
    com = db.Column(db.String(140))
    user_name = db.Column(db.String(120), db.ForeignKey("user.name"), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey("movie.id"), nullable=False)
    reviews_table = db.relationship(
        "Review", secondary="reviews_table", backref=db.backref("comments", lazy=True)
    )


class Review(db.Model):
    """defines review table"""

    id = db.Column(db.Integer, primary_key=True)


db.create_all()

# link_login(app)

# Functions for Login Page


@app.route("/", methods=["GET", "POST"])
def login():
    """Landing page"""
    return f.render_template("index.html")


@login_manager.user_loader
def load_user(user_id):
    """Load user for login manager"""
    return User.query.get(int(user_id))


@app.route("/handle_login", methods=["GET", "POST"])
def handle_login():
    """handles login form and authenticates user"""
    username = f.request.form.get("username")
    password = f.request.form.get("password")
    user = User.query.filter_by(name=username).first()  # authenticating user

    if not user:
        f.flash("User not found.")
        return f.redirect(f.url_for("login"))
    else:
        if check_password_hash(user.password, password):
            fl.login_user(user)
            return f.redirect(f.url_for("home"))
        else:
            f.flash("Password incorrect")
            return f.redirect(f.url_for("login"))


# Functions for sign up page


@app.route("/sign_up", methods=["GET", "POST"])
def sign_up():
    """sign up page landing"""
    return f.render_template("signup.html")


@app.route("/add_user", methods=["GET", "POST"])
def add_user():
    """add user to database, handles sign up form"""
    if f.request.method == "POST":
        username = f.request.form.get("username")
        password = f.request.form.get("password")
    if len(username) == 0 or len(password) == 0:
        f.flash("Credentials Invalid.")
        return f.redirect(f.url_for("sign_up"))
    if len(User.query.filter_by(name=username).all()) == 0:
        new_user = User(
            name=username, password=generate_password_hash(password, method="sha256")
        )

        db.session.add(new_user)
        db.session.commit()
        return f.redirect(f.url_for("login"))
    else:
        f.flash("User already exists.")
        return f.redirect(f.url_for("sign_up"))


# Functions for Home Page


@app.route("/home")
@fl.login_required
def home():
    """Returns home HTML"""
    i = randint(1, 3)
    try:
        my_movie = get_tmdb(i)
        genres = get_genre(my_movie["genre_ids"])  # sends list of genre ids
        wiki = get_wiki(my_movie["title"])
        data = pretty_data(my_movie, i, genres, wiki)

        if Movie.query.filter_by(my_id=data["id"]).first() is None:
            new_movie = Movie(my_id=data["id"])
            db.session.add(new_movie)
            db.session.commit()

        mov = Movie.query.filter_by(my_id=data["id"]).first()
        comments = mov.comments
        if len(comments) != 0:
            plz = comments[0].user_name
            print(plz)
        rated = mov.rating
        if rated != 0:
            rating = str(rated)
        else:
            rating = "Not Yet Rated"

        return f.render_template(
            "home.html",
            name=fl.current_user.name,
            len=len(data),
            movie=data,
            comments=comments,
            len_com=len(comments),
            rating=rating,
        )

    except:
        lost_data = {
            "title": "Uh Oh!",
            "overview": "Looks like you're LOST",
            "pic": (
                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvigne"
                + "tte2.wikia.nocookie.net%2Flostpedia%2Fimages%2F4%2F4f%2FLOST_season_4"
                + "_cover_art.jpg%2Frevision%2Flatest%3Fcb%3D20080111020615&f=1&nofb=1"
            ),
            "genres": "Genres: Disappointment Sadness",
            "wiki": "https://en.wikipedia.org/wiki/Error",
        }

        return f.render_template(
            "home.html", len=len(lost_data), movie=lost_data, name=fl.current_user.name
        )


@app.route("/handle_review", methods=["GET", "POST"])
def handle_review():
    """Handle comment form and rating drop down"""
    if f.request.method == "POST":
        data = f.request.form
        mov = Movie.query.filter_by(my_id=data["cur_id"]).first()

        new_comment = Comment(
            com=data["com"],
            rating=data["rating"],
            user_name=fl.current_user.name,
            movie_id=mov.id,
        )
        if mov.rating == 0:
            mov.rating = data["rating"]
        else:
            mov.rating = (mov.rating + int(data["rating"])) / 2
        db.session.add(new_comment)
        db.session.commit()

    print(data)
    return f.redirect(f.url_for("home"))


@app.route("/logout", methods=["GET", "POST"])
@fl.login_required
def logout():
    """ends user session"""
    fl.logout_user()
    return f.redirect(f.url_for("login"))


app.run(host=os.getenv("IP", "0.0.0.0"), port=os.getenv("PORT", "8080"), debug=True)
