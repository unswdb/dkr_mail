import os
import pytz
import time
from app import api
from utils.auth import get_token
from utils.db_handling import query_db
from datetime import datetime, timedelta
from flask_restplus import abort, Resource
from flask import make_response, jsonify, request
from utils.update_presenter import update_presenter
from utils.presenter_handling import handle_presenter, handle_upload
from utils.marking_handling import marking_handling


from utils.request_handling import get_request_args, get_header, get_request_file
mails = api.namespace('user', description="Get all the user names")
HOME = os.getcwd()
FILEDIR = os.path.join(HOME, 'static')

def check_login(token):
    """
    according to the token, check whether correct
    :param token: the param token
    :return:
    """
    user = query_db("SELECT * FROM User WHERE token = ?", (token, ))
    if len(user) == 0:
        abort(401, 'Incorrect token, please login')


@mails.route('/login')
class Login(Resource):

    @mails.response(200, 'Success')
    @mails.param("username", "Username")
    @mails.param("password", "Password")
    @mails.response(400, 'Missing args')
    @mails.doc(description="Login")
    def post(self):
        username = get_request_args("username", str)
        password = get_request_args("password", str)

        res = query_db("select * from user where username = ? and password = ?", (username, password, ))
        if len(res) == 0:
            abort(403, "Username or password incorrect")

        user = res[0]
        token = get_token()
        query_db("UPDATE User SET token = ? WHERE username = ?", (token, user["username"], ))

        return make_response(jsonify({"message": "success", "token": token}), 200)


@mails.route('/get-user')
@mails.expect(mails.parser().add_argument('Authorization', "Your Authorization Token in the form 'Token <AUTH_TOKEN>'",
                                        location='headers'))
class GetUser(Resource):

    @mails.response(200, 'Success')
    @mails.doc(description="Return all the users with their username")
    def get(self):
        check_login(get_header(request))
        names = []
        data = query_db("select name from contact")
        for user in data:
            names.append(user["name"])

        return make_response(jsonify({"message": "success", "names": names}), 200)


@mails.route('/send')
class Send(Resource):

    @mails.response(200, 'Success')
    @mails.response(400, 'Missing args')
    @mails.doc(description="Three presenters and their present date")
    def post(self):
        check_login(get_header(request))

        nstudents = get_request_args("nstudents", str)
        nnstudents = get_request_args("nnstudents", str)

        ndate = get_request_args("ndate", str)
        nndate = get_request_args("nndate", str)

        nstudents = nstudents.split(',')
        nnstudents = nnstudents.split(',')

        if len(nstudents) < 1 or len(nnstudents) < 1:
            abort(403, message="Not enough students")
        handle_presenter(nstudents, nnstudents, ndate, nndate)
        return make_response(jsonify({"message": "send success"}), 200)


@mails.route('/notice')
class Notice(Resource):
    @mails.response(200, 'Success')
    @mails.response(400, 'Missing args')
    @mails.doc(description="Three presenters and their present date")
    def post(self):
        check_login(get_header(request))

        students = get_request_args("student", str)
        students = students.split(',')
        handle_upload(students)
        return make_response(jsonify({"message": "send success"}), 200)


@mails.route('/history')
class History(Resource):
    @mails.response(200, 'Success')
    @mails.response(400, 'Missing args')
    @mails.doc(description="Three presenters and their present date")
    def get(self):
        check_login(get_header(request))

        data = query_db("select name, count(name) as number from past group by name")

        return make_response(jsonify({"message": "success", "data": data}), 200)


@mails.route('/current')
class Current(Resource):
    @mails.response(200, 'Success')
    def get(self):
        check_login(get_header(request))

        names = []
        data = query_db("select name from current")
        for d in data:
            names.append(d["name"])
        return make_response(jsonify({"message": "success", "names": names}), 200)


@mails.route('/get-user-info')
class GetUserInfo(Resource):

    @mails.response(200, 'Success')
    @mails.doc(description="Return all the users with their username")
    def get(self):
        check_login(get_header(request))

        users = query_db("select * from contact")
        for index, user in enumerate(users):
            user["key"] = index + 1
        return make_response(jsonify({"message": "success", "users": users}), 200)


@mails.route('/edit')
class GetUserInfo(Resource):

    @mails.response(200, 'Success')
    @mails.response(400, 'Missing args')
    @mails.param("name", "Student name")
    @mails.param("email", "Student email")
    @mails.param("institution", "Student institution")
    @mails.doc(description="Add new student")
    def post(self):
        check_login(get_header(request))

        name = get_request_args("name", str)
        email = get_request_args("email", str)
        institution = get_request_args("institution", str)

        query_db("insert into contact values(?,?,?)", (name, email, institution, ))
        return make_response(jsonify({"message": "success"}), 200)

    @mails.response(200, 'Success')
    @mails.param("name", "Student name")
    @mails.param("email", "Student email")
    @mails.response(400, 'Missing args')
    @mails.doc(description="Update student information")
    def put(self):
        check_login(get_header(request))

        name = get_request_args("name", str)
        email = get_request_args("email", str)

        query_db("update contact set email = ? where name = ?", (email, name, ))
        return make_response(jsonify({"message": "success"}), 200)


@mails.route('/delete')
class DeleteUserInfo(Resource):
    @mails.response(200, 'Success')
    @mails.param("name", "Student name")
    @mails.response(400, 'Missing args')
    @mails.doc(description="delete student information")
    def post(self):
        check_login(get_header(request))

        name = get_request_args("name", str)
        print(name)

        query_db("delete from contact where name = ?", (name,))
        return make_response(jsonify({"message": "success"}), 200)


@mails.route('/next')
class NextWeekP(Resource):
    @mails.response(200, 'Success')
    @mails.doc(description="return next week's presenters")
    def get(self):
        check_login(get_header(request))

        data = query_db("select name, email, institution, present from current ")
        for index, d in enumerate(data):
            d["key"] = index + 1

        return make_response(jsonify({"message": "success", "data": data}), 200)

    @mails.response(400, 'Missing args')
    def put(self):
        check_login(get_header(request))

        name = get_request_args("name", str)
        email = get_request_args("email", str)
        institution = get_request_args("institution", str)

        query_db("update current set name = ?, email = ? where institution = ?", (name, email, institution))
        update_presenter(email, True)

        return make_response(jsonify({"message": "success"}), 200)


@mails.route('/nnext')
class NNextWeekP(Resource):
    @mails.response(200, 'Success')
    @mails.doc(description="return next next week's presenters")
    def get(self):
        check_login(get_header(request))

        data = query_db("select name, email, institution, present from next ")
        for index, d in enumerate(data):
            d["key"] = index + 1

        date = data[0]["present"].split('/')
        current_date = datetime(int(date[2]), int(date[0]), int(date[1]), 14, 0, 0,
                                tzinfo=pytz.timezone('Australia/Sydney'))
        next_date = current_date - timedelta(days=7)
        return make_response(jsonify({"message": "success", "data": data, "next": next_date.strftime("%m/%d/%Y")}), 200)

    @mails.response(400, 'Missing args')
    def put(self):
        check_login(get_header(request))

        name = get_request_args("name", str)
        email = get_request_args("email", str)
        institution = get_request_args("institution", str)

        query_db("update next set name = ?, email = ? where institution = ?", (name, email, institution))
        update_presenter(email, False)
        return make_response(jsonify({"message": "success"}), 200)


@mails.route('/marking')
class Marking(Resource):
    @mails.response(200, 'Success')
    @mails.doc(description="upload marking file")
    def post(self):
        check_login(get_header(request))

        name = get_request_args("name", str)
        files = get_request_file('file')

        for file in files:
            filename = str(int(time.time())) + '.' + file.filename.split('.')[-1]
            filepath = os.path.join(FILEDIR, filename)
            file.save(filepath)
            marking_handling(filepath, name)

        return make_response(jsonify({"message": "success"}), 200)

    @mails.response(200, 'Success')
    @mails.doc(description="get all the marking for all students")
    def get(self):
        check_login(get_header(request))

        data = query_db("select name, max(score) as score from marking group by name order by max(score)")
        # print(data)

        return make_response(jsonify({"message": "success", "data": data}), 200)

