# -*- coding: utf-8 -*-
"""
Created on Thu Mar 15 14:00:36 2018

@author: Eric
"""

import random
import pandas as pd
import numpy as np


csv_file_loc = 'for-full-text-annotation.csv'

"""
Read in the CSV file and get the required data from it. Format the data.
"""
def get_file_description():
    all_rows = pd.read_csv(csv_file_loc)
    all_rows = np.asarray(all_rows)
    data = []
    for i in range(1, len(all_rows)):
        data.append(all_rows[i][0])
    return data
"""
data = get_file_description()
"""

data = list(range(99, 214))
random.shuffle(data)
#data = data[:20]
names = ['edin', 'milorad', 'lidija']
for n in names:
    f = open('ordering_list_' + n + '.txt','ab')
    np.savetxt(f, data, delimiter = " ")
    f.close()


