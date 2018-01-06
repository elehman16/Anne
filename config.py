
# The reader to use, along with the paramaters that
# it accepts in it's constructor
#
# Options: csv, sql, xml
reader = 'research'
reader_params = {
    'csv_file': 'for-full-text-annotation.csv',
    'path_to_xml_files': 'full-texts-for-annotation'
}

# The writer to use, along with the paramaters that
# it accepts in its constructor
#
# Options: csv, sql
writer = 'csv'
writer_params = {
    'write_file': 'output.csv'
}

# If an additional list of checkboxes should be added
# to the interface, the options to be provided
options = [
    'Significant Diff - Positive',
    'Significant Diff - Negative',
    'No Significant Diff'
]
