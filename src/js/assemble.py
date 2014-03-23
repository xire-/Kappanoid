#!/usr/bin/python
from __future__ import with_statement
import sys
import re
from datetime import datetime

# global set of all imported files
importedFiles = set()

# remove all assertions and test functions from the output file
# return the processed text
def remove_debug_code(text):
    # remove test functions
    ris = re.sub(re.compile(r'\n*( *)function test\S*\(\) \{\n.*?\n\1\}', re.DOTALL),'', text)
    
    # remove reamining asserts
    ris = re.sub(r'\n *console\.assert\(.*\);','', ris)
    return ris

# find import statement and replace them with the content of the indicated file
# if a file has already been imported it will be ignored
# return the processed text
def process_import(text, js_path, debug_flag):
    # search for import statement and replace content
    def import_callback(m):
        global importedFiles
        indentation = m.group(1)
        file_name = m.group(2)

        if file_name in importedFiles:
            print '{} is already imported'.format(file_name)
            return ''
        importedFiles.add(file_name)

        with open(js_path + 'parts/' + file_name, 'r') as f:
            file_content = f.read()

        ris = process_import(file_content, js_path, debug_flag)

        # add correct indentation
        ris = re.sub(r'(.*?\n)', indentation + r'\1', ris)
        # if last line doesn't have final \n
        ris = re.sub(r'\n(.*?)$', r'\n' + indentation + r'\1', ris)

        return '\n' + ris


    if not debug_flag:
        text = remove_debug_code(text)

    return re.sub(r'\n( *)// __import__ (.*)', import_callback, text) 

def strip_empty_line_spaces(text):
    return re.sub(r' *\n', '\n', text)

def main():
    # read options from argv
    if len(sys.argv) < 3:
        print (
            'usage: {0} js_path output_file [-d | --debug]\n'
            'example: {0} src/js/ assembled.js -d\n'
            'optional debug flag leave assertions in the assembled file.'
            ).format(sys.argv[0])
        exit(1)

    js_path = sys.argv[1]
    output_file = sys.argv[2]
    debug_flag = (sys.argv[3] == '-d' or sys.argv[3] == '--debug') if len(sys.argv) > 3 else False

    with open(js_path + 'parts/main.js') as fmain, open(js_path + output_file, 'w') as fris:
        # print timestamp on top
        fris.write('/* Generated: {} */\n\n'. format(datetime.now().strftime('%Y/%m/%d %H:%M:%S')))
        ris = process_import(fmain.read(), js_path, debug_flag)
        fris.write(strip_empty_line_spaces(ris))

if __name__ == '__main__':
    main()
    