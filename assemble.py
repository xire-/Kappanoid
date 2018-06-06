#!/usr/bin/env python3
import argparse
import re
import sys
from datetime import datetime

# global set of all imported files
imported_files = set()


# remove all assertions and test functions from the output file
# return the processed text
def remove_debug_code(text):
    # remove test functions
    res = re.sub(re.compile(r'\n*( *)function test\S*\(\) \{\n.*?\n\1\}', re.DOTALL), '', text)
    # remove asserts
    res = re.sub(r'\n *console\.assert\(.*\);', '', res)
    return res


# find import statements and replace them with the content of the imported file (ignoring files already imported)
# return the processed text
def process_import(text, js_path, debug):
    def import_callback(m):
        global imported_files
        indentation = m.group(1)
        file_name = m.group(2)

        if file_name in imported_files:
            print('{} already imported'.format(file_name))
            return ''
        imported_files.add(file_name)

        with open(js_path + 'parts/' + file_name, 'r') as f:
            file_content = f.read()

        res = process_import(file_content, js_path, debug)

        # add correct indentation
        res = re.sub(r'(.*?\n)', indentation + r'\1', res)
        # if last line doesn't have final '\n'
        res = re.sub(r'\n(.*?)$', r'\n' + indentation + r'\1', res)
        res = '\n' + res
        return res

    if not debug:
        text = remove_debug_code(text)

    # search for import statement and replace content
    return re.sub(r'\n( *)// __import__ (.*)', import_callback, text)


def strip_empty_line_spaces(text):
    return re.sub(r' *\n', '\n', text)


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        '-d',
        '--debug',
        action='store_true',
        default=False,
        help='leave debug functions and asserts in the output file',
    )

    parser.add_argument(
        'js_path',
        action='store',
        help='path to the "js" folder, which must contain a "parts" folder',
    )

    parser.add_argument(
        '-o',
        '--outputFile',
        action='store',
        dest='outputFile',
        type=argparse.FileType('w'),
        help='output file',
    )
    args = parser.parse_args()

    js_path = args.js_path
    fres = args.outputFile
    debug = args.debug

    with open(js_path + 'parts/main.js', 'r') as fmain:
        # print timestamp on top
        fres.write('/* Generated: {} */\n\n'.format(datetime.now().strftime('%Y/%m/%d %H:%M:%S')))
        res = process_import(fmain.read(), js_path, debug)
        fres.write(strip_empty_line_spaces(res))


if __name__ == '__main__':
    main()
