from app import app
import api.mail_handling
from utils.schedule_work import scheduler

scheduler.init_app(app)
scheduler.start()

if __name__ == '__main__':
    # scheduler.init_app(app)
    # scheduler.start()
    app.run(debug=False, host='0.0.0.0', port=5000)
