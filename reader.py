import abc
import csv
import sqlite3

import article


class Reader(object, metaclass=abc.ABCMeta):
    """Read article information.

    A base class for providing article information
    to be annotated by the user.
    """

    @abc.abstractmethod
    def get_next_article(self):
        """Gets the next article to be annotated."""
        raise NotImplementedError('Method `get_next_article` must be defined')


class CSVReader(Reader):
    """Read from CSV files.

    A `Reader` implementation to support reading article data
    from a CSV file. Uses a buffer to preload a preset number
    of articles to speed up accessing the next article.
    """

    def __init__(self, read_file, buffer_size=None):
        self.read_file = read_file

        self.buffer = []
        self.current_pos = 0
        if not buffer_size:
            with open(self.read_file, 'r') as csvfile:
                lines = csv.DictReader(csvfile)
                file_length = sum(1 for line in lines)
                buffer_size = max(file_length // 10, 100)
        self.buffer_size = buffer_size
        self._add_to_buffer()
        import pprint; pprint.pprint(self.buffer)

    def _add_to_buffer(self):
        with open(self.read_file, 'r') as csvfile:
            lines = csv.DictReader(csvfile)
            for i, line in enumerate(lines):
                if i < self.current_pos:
                    continue
                self.current_pos += 1
                self.buffer.append(line)

    def get_next_article(self):
        if not self.buffer:
            self._add_to_buffer()
        try:
            entry = self.buffer.pop(0)
        except IndexError:
            # we have gone through the entire file
            return None
        return article.Article(id_=entry['id'],
                               title=entry['title'],
                               text=entry['text'])


class SQLiteReader(Reader):
    """Read from a SQLite database.

    A `Reader` implementation to read articles from
    a SQLite database. Requires that there exist columns
    titled 'title' and 'text' and that the rows are
    uniquely id'd beginning at 0.
    """

    def __init__(self, db_file, table):
        self.db_file = db_file
        self.table = table
        self.conn = sqlite3.connect(self.db_file)
        self.conn.text_factory = str
        self.cursor = self.conn.cursor()
        self.current_pos = 0

    def get_next_article(self):
        self.cursor.execute('SELECT title, text FROM {0} WHERE id={1}' \
                            .format(self.table, self.current_pos))
        articles = self.cursor.fetchall()
        if not articles or len(articles) != 1:
            return None
        art = article.Article(id_=self.current_pos,
                              title=articles[0][0],
                              text=articles[0][1])
        self.current_pos += 1
        return art
