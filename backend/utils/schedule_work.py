"""
@File   :   schedule_work.py    
@Author :   sli
@Date   :   30/9/22
Debug model will execute twice
"""
from __future__ import print_function

import os.path
from app import app
from utils.db_handling import query_db
from flask_apscheduler import APScheduler
from utils.mail_handling import send_mail
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from utils.presenter_handling import handle_upload


class Config(object):
    SCHEDULER_API_ENABLED = True


app.config.from_object(Config())
scheduler = APScheduler()

TOKEN = os.path.join(os.path.dirname(os.path.abspath(__file__)), "token.json")


def fetch_google_sheet(r_date):
    """
    given a specific date, then get the presentation detail
    @param r_date: presentation date
    @return:
    """
    creds = None

    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    # The ID and range of a sample spreadsheet.
    SAMPLE_SPREADSHEET_ID = '18ffrZOqvPL7YS9pUcN18OIrEuIZ395yoTjPHWyFxjNI'
    SAMPLE_RANGE_NAME = 'present!A4:F12'

    if os.path.exists(TOKEN):
        creds = Credentials.from_authorized_user_file(TOKEN, SCOPES)
        # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(TOKEN, 'w') as token:
            token.write(creds.to_json())
    try:
        service = build('sheets', 'v4', credentials=creds)

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                    range=SAMPLE_RANGE_NAME).execute()
        values = result.get('values', [])

        if not values:
            print('No data found.')
            return None

        # Fetch the sheet values, then send it to zhengyi
        maik_info = ""
        for val in values:
            if len(val) < 3:
                continue

            date = []
            for ele in val[2].split('/'):
                if len(ele) == 1:
                    ele = "0{}".format(ele)
                date.append(ele)

            if r_date == "/".join(date):
                maik_info += "{}\n".format(", ".join(val))
        return maik_info
    except HttpError as err:
        print(err)

    return None


def reminder_students():
    """
    fetch google sheet
    @return: the presenter and their topics
    """
    students = query_db("select * from current")

    if len(students) == 0:
        return

    names = [student["name"] for student in students]
    r_date = students[0]["present"]

    with app.app_context():
        handle_upload(names)

    # then based on the current student, we fetch all the result from google sheet
    mail_info = fetch_google_sheet(r_date)
    if mail_info is not None:
        mail_info = mail_info.split('\n')
        while len(mail_info) < 3:
            mail_info.append("Not updated yet")

        with app.app_context():
            send_mail(["shunyangli0@gmail.com"], "Presentation Details", "info", ics_path=None,
                      p1=mail_info[0], p2=mail_info[1], p3=mail_info[2])


# execute the code every thu at 18:30
@scheduler.task('cron', id='do_job_3', week='*', day_of_week='thu', hour=11, minute=30)
def job3():
    reminder_students()

