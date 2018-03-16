import flask
import json

import annotator
import article
import config
import reader
import writer
import numpy as np

global last_path
application = flask.Flask(__name__)

anne = annotator.Annotator(reader.get_reader(config.reader)(**config.reader_params),
                           writer.get_writer(config.writer)(**config.writer_params))

valid_users = np.loadtxt('usernames.txt', delimiter = ',', dtype = 'str')

"""
Display the main page.
"""
@application.route('/', methods=['GET'])
def index():
    return flask.render_template('index.html')

"""
Start the program.
"""
@application.route('/start/', methods=['GET', 'POST'])
def start():
    userid = flask.request.form['userid']
    if not(userid in valid_users):
        return flask.render_template('index_invalid_user.html')
        
    id_ = anne.get_next_file(userid)
    if not id_:
        return flask.redirect(flask.url_for('finish'))
    else:
        return flask.redirect(flask.url_for('annotate_abstract', 
                                            userid = userid, 
                                            id_ = id_))
                
"""
Start the program, but show the error to the user first.
"""
@application.route('/invalid_user/', methods=['GET', 'POST'])
def invalid_user():
    userid = flask.request.form['userid']
    if not(userid in valid_users):
        return flask.render_template('index_invalid_user.html', should_show = "true")
    
    id_ = anne.get_next_file(userid)
    if not id_:
        return flask.redirect(flask.url_for('finish'))
    else:
        return flask.redirect(flask.url_for('annotate_abstract', 
                                            userid = userid, 
                                            id_ = id_))

"""
Display just the abstract.
"""    
@application.route('/annotate_abstract/<userid>/<id_>/', methods=['GET'])
def annotate_abstract(userid, id_ = None):
    if id_ is None:
        art = anne.get_next_article(userid)
    else:
        art = anne.get_next_article(userid, id_)
    
   
    if not art:
        return flask.redirect(flask.url_for('finish'))
    else:
        global last_path
        last_path = art.get_extra()['path']
        return flask.render_template('article.html',
                                     userid = userid,
                                     id = art.id_,
                                     tabs = art.text,
                                     xml_file = last_path,
                                     outcome = art.get_extra()['outcome'],
                                     intervention = art.get_extra()['intervention'],
                                     comparator = art.get_extra()['comparator'],
                                     options = config.options_full)

"""
Grabs a specified article and displays the full text.
"""                             
@application.route('/annotate_full/<userid>/<id_>/', methods=['GET'])
def annotate_full(userid, id_ = None):
    try:
        if id_ is None:
            art = anne.get_next_article(userid)
        else:
            art = anne.get_next_article(userid, id_)
    except:
        return annotate_abstract(userid, id_)
    
    if not art:
        return flask.redirect(flask.url_for('finish'))
    else:
        global last_path
        return flask.render_template('full_article.html',
                                     userid = userid,
                                     id = art.id_,
                                     tabs = art.text,
                                     xml_file = last_path,
                                     outcome = art.get_extra()['outcome'],
                                     intervention = art.get_extra()['intervention'],
                                     comparator = art.get_extra()['comparator'],
                                     options = config.options_full)
                                 

"""
Submits the article id with all annotations.
"""
@application.route('/submit/', methods=['POST'])
def submit(): 
    selected = flask.request.form['selection']
    userid = flask.request.form['userid']
    anne.submit_annotation(flask.request.form)

    # if the person can't tell just based off the abstract
    if (selected == 'Cannot tell based on the abstract'):
        global last_path
        return flask.redirect(flask.url_for('annotate_full', 
                                            userid=userid,
                                            id_= last_path))
                                            
    elif (selected == ''): # if they haven't selected anything, do nothing
        return None
    # otherwise go to the next abstract
    id_ = anne.get_next_file(userid)
    if not id_:
        return flask.redirect(flask.url_for('finish'))
    else:
        return flask.redirect(flask.url_for('annotate_abstract', 
                                            userid=userid,
                                            id_ = id_))

"""
Only go to this if there are no more articles to be annotated.
"""
@application.route('/finish/', methods=['GET'])
def finish():
    return flask.render_template('finish.html')

"""
Call the get results funciton.
"""
@application.route('/results/', methods=['GET'])
def results():
    return anne.get_results()

"""
Run the application.
"""
if __name__ == '__main__':
    application.run()
