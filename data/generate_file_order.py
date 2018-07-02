# -*- coding: utf-8 -*-
"""
Created on Thu Mar 15 14:00:36 2018

@author: Eric
"""

import random
import pandas as pd
import numpy as np

st = 621
end = 968

data = list(range(st, end))
random.shuffle(data)

names = ['edin', 'milorad', 'lidija']
new_data = []
last = 0
for i in range(len(names)):
    next_one = min(end, int(last + (end - st) / len(names)))
    new_data.append(data[last:next_one])
    last = next_one
    
    
i = 0
for n in names:
    f = open('ordering_list_' + n + '.txt','ab')
    np.savetxt(f, new_data[i], delimiter = " ")
    f.close()
    i += 1


