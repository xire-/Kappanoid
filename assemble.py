#!/usr/bin/env python3
import argparse
import re
import sys
from datetime import datetime

# global set of all imported files
importedFiles = set()


# remove all assertions and test functions from the output file
# return the processed text
def remove_debug_code(text):
    # remove test functions
    ris = re.sub(re.compile(r'\n*( *)function test\S*\(\) \{\n.*?\n\1\}', re.DOTALL), '', text)

    # remove reamining asserts
    ris = re.sub(r'\n *console\.assert\(.*\);', '', ris)
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
            print('{} is already imported'.format(file_name))
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
    parser = argparse.ArgumentParser(description='Assemble parts of javascript into a single file.')

    parser.add_argument(
        '-d',
        '--debug',
        action="store_true",
        default=False,
        help='leave debug functions and asserts in the output file',
    )

    parser.add_argument(
        'js_path',
        action="store",
        help='path to the js folder, must contain a parts sub folder',
    )

    parser.add_argument(
        '-o',
        '--outputFile',
        action="store",
        dest="outputFile",
        type=argparse.FileType('w'),
        default=sys.stdout,
        help='output file. Default: stdout',
    )
    args = parser.parse_args()

    js_path = args.js_path
    fris = args.outputFile
    debug_flag = args.debug

    with open(js_path + 'parts/main.js', 'r') as fmain:
        # print timestamp on top
        fris.write('/* Generated: {} */\n\n'.format(datetime.now().strftime('%Y/%m/%d %H:%M:%S')))
        ris = process_import(fmain.read(), js_path, debug_flag)
        fris.write(strip_empty_line_spaces(ris))


if __name__ == '__main__':
    main()
