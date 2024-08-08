# flask app to test run website

from flask import Flask, render_template, send_from_directory

app = Flask(__name__, template_folder="../minesweeper")
app.config["TEMPLATES_AUTO_RELOAD"] = True

# main route
@app.route('/')
def index():
    return render_template('index.html')


# sends files
@app.route("/<path:name>")
def download_file(name):
    return send_from_directory(
        "../minesweeper", name, as_attachment=True
    )


if __name__ == '__main__':
    app.run(debug=True)