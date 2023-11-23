import pytz
from utils.db_handling import query_db
from datetime import datetime, timedelta
from utils.mail_handling import send_mail
from flask_restplus import abort
from utils.ics_generator import ics_gener, ics_gener_upload

UPLOAD_DAYS = 1


def handle_next(next_students_name, next_date):
    """
    process the next week's presentation
    @param next_students_name: next week's presenter
    @param next_date: next week presentation date
    @return:
    """
    n1 = ""
    emails = []
    students = []
    for student in next_students_name:
        data = query_db("select * from contact where name = ?", (student,))
        if len(data) == 0:
            abort(401, "Can can find user: {}".format(student))

        students.append(data[0])
        emails.append(data[0]["email"])

    nds = next_date.split('/')
    present_date = datetime(int(nds[2]), int(nds[0]), int(nds[1]), 14, 0, 0,
                            tzinfo=pytz.timezone('Australia/Sydney'))

    # compute the upload slides date
    upload_date = present_date - timedelta(days=UPLOAD_DAYS)

    # made the current as history
    temp = query_db("select name, present from current where institution = 'SYD'")
    for d in temp:
        query_db("insert into past values(?,?)", (d["name"], d["present"],))

    # clear the current presenters
    query_db("delete from current")

    for index, user in enumerate(students):
        if index == len(students) - 1:
            n1 += "and {} ({})".format(user["name"], user["institution"])
        else:
            n1 += "{} ({}), ".format(user["name"], user["institution"])
        query_db("insert into current values(?,?,?,?,?)", (user["name"], user["email"], user["institution"],
                                                           upload_date.strftime("%m/%d/%Y"),
                                                           present_date.strftime("%m/%d/%Y"),))

    ics_gener(emails, next_date, next_date, "Event")

    return n1, emails, upload_date.strftime("%m/%d/%Y")


def handle_next_next(next_next_students_name, next_next_date):
    """
    used for handling next next week presentation
    @param next_next_students_name: next next week students
    @param next_next_date:
    @return:
    """
    n2 = ""
    emails = []
    students = []

    for student in next_next_students_name:
        data = query_db("select * from contact where name = ?", (student, ))
        if len(data) == 0:
            abort(401, "Can can find user: {}".format(student))
        students.append(data[0])
        emails.append(data[0]["email"])

    #  clean the next week's date
    query_db("delete from next")

    for index, user in enumerate(students):
        if index == len(students) - 1:
            n2 += "and {} ({})".format(user["name"], user["institution"])
        else:
            n2 += "{} ({}), ".format(user["name"], user["institution"])
        query_db("insert into next values(?,?,?,?)", (user["name"], user["email"], user["institution"],
                                                      next_next_date,))

    ics_gener(emails, next_next_date, next_next_date, "FutureEvent")

    return n2, emails


def handle_presenter(nstudents, nnstudents, ndate, nndate):
    """
    processing mail for next, and next next week presentation
    @param nstudents: next week students
    @param nnstudents: next next week students
    @param ndate: next week presentation date
    @param nndate: next next week presentation date
    @return:
    """
    n1, n_emails, upload_date = handle_next(nstudents, ndate)
    n2, nn_emails = handle_next_next (nnstudents, nndate)

    n_emails.append("jianwei.wang1@unsw.edu.au")

    send_mail(n_emails, "Group Meeting Presentation", "notice", "Event",
              n1=n1, n2=n2, current_date=ndate, upload_date=upload_date, next_date=nndate)

    send_mail(nn_emails, "Group Meeting Presentation", "notice", "FutureEvent",
              n1=n1, n2=n2, current_date=ndate, upload_date=upload_date, next_date=nndate)


def handle_upload(students):
    """
    send notice to students to upload their slides
    @param students: presenters
    @return:
    """
    n1 = ""
    users = []
    emails = []
    uploadDate = ""

    mails = {
        'ZJ': 'yanpingw.zjgsu@gmail.com',
        'SYD': 'jianwei.wang1@unsw.edu.au',
        'GZ': 'omicronwang@gmail.com',
        'SH': '2294622497@qq.com'
    }

    for student in students:
        user = query_db("select * from current where name = ?", (student,))
        users.append(user[0])
        emails.append(mails[user[0]["institution"]])

    for index, user in enumerate(users):
        emails.append(user["email"])
        uploadDate = user["upload"]
        if index == len(users) - 1:
            n1 += "and {} ({})".format(user["name"], user["institution"])
        else:
            n1 +="{} ({}), ".format(user["name"], user["institution"])
    
    ics_gener_upload(emails, uploadDate, uploadDate, "Upload")

    if "yangzhengyi188@gmail.com" not in emails:
        emails.append("yangzhengyi188@gmail.com")

    send_mail(emails, "Please upload your slides to the WeChat group", "upload", "Upload", n1=n1)
