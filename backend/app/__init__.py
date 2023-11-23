from flask import Flask
from flask_restplus import Api
from flask_cors import CORS


app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.config['SECRET_KEY'] = 'hard to guess what is the key'

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'TODO'
app.config['MAIL_PASSWORD'] = 'TODO'
app.config['MAIL_DEFAULT_SENDER'] = 'TODO'
# api = Api(app)
api = Api()
api.init_app(app, add_specs=False)
CORS(app)
