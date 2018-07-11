from flask import Flask
from flask import request
from flask import jsonify
import json
import executor_utils as eu
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/build_and_run", methods=["POST"])
def build_and_run():
    print request.data
    data = json.loads(request.data)

    if 'code' not in data or 'lang' not in data:
        return "You should provide both 'code' and 'lang'"
    code = data['code']
    lang = data['lang']

    print "API got called with code: %s in %s" %(code, lang)

    result = eu.build_and_run(code, lang)
    return jsonify(result)


if __name__ == "__main__":
    eu.load_image()
    app.run(debug=True, threaded=True)
