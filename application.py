import flask
import json

import annotator
import article
import config
import reader
import writer


application = flask.Flask(__name__)

anne = annotator.Annotator(reader.get_reader(config.reader)(**config.reader_params),
                           writer.get_writer(config.writer)(**config.writer_params))


@application.route('/', methods=['GET'])
def index():
    return flask.render_template('index.html')

@application.route('/start/', methods=['GET', 'POST'])
def start():
    userid = flask.request.form['userid']
    return flask.redirect(flask.url_for('annotate', userid=userid))

@application.route('/annotate/<userid>', methods=['GET'])
def annotate(userid):
    art = anne.get_next_article()
    if not art:
        return flask.redirect(flask.url_for('finish'))
    return flask.render_template('article.html',
                                 userid=userid,
                                 id=art.id_,
                                 title=art.title,
                                 text=art.text,
                                 options=config.options)

@application.route('/submit/', methods=['POST'])
def submit():
    userid = flask.request.form['userid']
    id_ = flask.request.form['id']
    annotations = flask.request.form['annotations']
    annotations = json.loads(annotations)
    anne.submit_annotation(id_, annotations)
    return flask.redirect(flask.url_for('annotate', userid=userid))

@application.route('/finish/', methods=['GET'])
def finish():
    return flask.render_template('finish.html')

@application.route('/results/', methods=['GET'])
def results():
    return anne.get_results()


if __name__ == '__main__':
    application.run()
