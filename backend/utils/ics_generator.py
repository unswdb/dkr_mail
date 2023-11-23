import os
import pytz
from datetime import datetime
from icalendar import Calendar, Event, vCalAddress, vText

HOMEPATH = os.getcwd()


def ics_gener(attendees, start_date, end_date, filename):
    """
    date format: mm/dd/yyyy
    @param attendees: email list
    @param start_date: start date string format
    @param end_date: end date string format
    @param filename: the generated file name
    @return:
    """
    cal = Calendar()
    for attendee in attendees:
        cal.add('attendee', 'MAILTO:{}'.format(attendee))

    event = Event()
    event.add('summary', 'Group Meeting Presentation')

    sds = start_date.split('/')
    eds = end_date.split('/')

    event.add('dtstart', datetime(int(sds[2]), int(sds[0]), int(sds[1]), 13, 0, 0, tzinfo=pytz.timezone('Australia/Sydney')))
    event.add('dtend', datetime(int(eds[2]), int(eds[0]), int(eds[1]), 15, 0, 0, tzinfo=pytz.timezone('Australia/Sydney')))
    event.add('dtstamp', datetime(int(sds[2]), int(sds[0]), int(sds[1]), 13, 0, 0, tzinfo=pytz.timezone('Australia/Sydney')))

    organizer = vCalAddress('MAILTO:yangzhengyi188@gmail.com')
    organizer.params['cn'] = vText('DKR')
    event['organizer'] = organizer
    event['location'] = vText('Voov Online Meetings')

    cal.add_component(event)

    directory = os.path.join(HOMEPATH + '/static/{}.ics'.format(filename))
    f = open(directory, 'wb')
    f.write(cal.to_ical())
    f.close()


def ics_gener_upload(attendees, start_date, end_date, filename):
    """
    generate ics file for mails
    date format: mm/dd/yyyy
    """
    cal = Calendar()
    for attendee in attendees:
        cal.add('attendee', 'MAILTO:{}'.format(attendee))

    event = Event()
    event.add('summary', 'Upload Slides To WeChat Group')

    sds = start_date.split('/')
    eds = end_date.split('/')

    event.add('dtstart', datetime(int(sds[2]), int(sds[0]), int(sds[1]), 19, 0, 0, tzinfo=pytz.timezone('Australia/Sydney')))
    event.add('dtend', datetime(int(eds[2]), int(eds[0]), int(eds[1]), 20, 0, 0, tzinfo=pytz.timezone('Australia/Sydney')))
    event.add('dtstamp', datetime(int(sds[2]), int(sds[0]), int(sds[1]), 19, 0, 0, tzinfo=pytz.timezone('Australia/Sydney')))

    organizer = vCalAddress('MAILTO:yangzhengyi188@gmail.com')
    organizer.params['cn'] = vText('DKR')
    event['organizer'] = organizer
    event['location'] = vText('WeChat Group')

    cal.add_component(event)

    directory = os.path.join(HOMEPATH + '/static/{}.ics'.format(filename))
    f = open(directory, 'wb')
    f.write(cal.to_ical())
    f.close()
