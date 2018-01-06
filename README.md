# Anne
Anne is an annotation collector that can be used to build datasets. It was built to be easily modifiable from the beginning, since each annotation project will require a slightly different interface and backend.

This tool is currently being used at [Northeastern University](https://www.ccis.northeastern.edu/) to support ongoing research projects.

### Usage
This project is built to use an implementation of a [`Reader`](https://github.com/Derrreks/Anne/blob/master/reader.py) and of a [`Writer`](https://github.com/Derrreks/Anne/blob/master/writer.py) to control the input and output. Some default implementations are provided, but each of the classes can be inherited from to create your own version. To select an implementation, just edit [`config.py`](https://github.com/Derrreks/Anne/blob/master/config.py), an example of which can be found at [`config.py.example`](https://github.com/Derrreks/Anne/blob/master/config.py.example).

### Contact
For any questions about Anne, feel free to send me an email: <schuster.d@husky.neu.edu>.
