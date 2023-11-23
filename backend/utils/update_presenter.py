from utils.db_handling import query_db
from utils.ics_generator import ics_gener
from utils.mail_handling import send_mail


def generate_params(is_current, email):
    n1 = ""
    n2 = ""
    current_date = ""
    upload_date = ""
    next_date = ""

    cas = query_db("select * from current ")
    for index, user in enumerate(cas):
        if index == len(cas) - 1:
            n1 += "and {} ({})".format(user["name"], user["institution"])
        else:
            n1 += "{} ({}), ".format(user["name"], user["institution"])
        current_date = user["present"]
        upload_date = user["upload"]

    nas = query_db("select * from next ")
    for index, user in enumerate(nas):
        if index == len(nas) - 1:
            n2 += "and {} ({})".format(user["name"], user["institution"])
        else:
            n2 += "{} ({}), ".format(user["name"], user["institution"])
        next_date = user["present"]

    if is_current:
        ics_gener(email, current_date, current_date, "Event")
    else:
        ics_gener(email, next_date, next_date, "FutureEvent")

    return n1, n2, upload_date, current_date, next_date


def update_presenter(email, is_current):
    n1, n2, upload_date, current_date, next_date = generate_params(is_current, email)

    mails = [email, "yangzhengyi188@gmail.com"]
    if is_current:
        send_mail(mails, "Group Meeting Presentation", "notice", "Event",
                  n1=n1, n2=n2, current_date=current_date,
                  upload_date=upload_date, next_date=next_date)
    else:
        send_mail(mails, "Group Meeting Presentation", "notice", "FutureEvent",
                  n1=n1, n2=n2, current_date=current_date,
                  upload_date=upload_date, next_date=next_date)