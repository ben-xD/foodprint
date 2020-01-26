from flask import Flask, request, make_response
from vision_script import get_carbon

# TODO need pandas, google-cloud-vision in requirements.txt to successfully run, please add it with correct versions you need

application = Flask(__name__)

text = """<html> Upload your image! </html>"""
application.add_url_rule('/', 'index', (lambda: text))


@application.route("/upload/", methods=["POST"])
def post_file():
    print(request.files)
    image = request.files['image'].read()
    carbon = get_carbon(image)
    return """received"""


if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
