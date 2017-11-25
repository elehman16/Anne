# Anne
Anne is an annotation collector that can be used to build datasets. It was built to be easily modifiable from the beginning, since each annotation project will require a slightly different interface and backend.

### Usage
This project is built to use an implementation of a [`Reader`](https://github.com/Derrreks/Anne/blob/master/reader.py) and of a [`Writer`](https://github.com/Derrreks/Anne/blob/master/writer.py) to control the input and output. Some default implementations are provided, but each of the classes can be inherited from to create your own version. `application.py` needs to then be updated with the new classes that you plan to use.
