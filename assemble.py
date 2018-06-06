#!/usr/bin/env python3
import argparse
import re
import sys
from datetime import datetime

# global set of all imported files
imported_files = set()


# remove all assertions and test functions from the output file
def remove_debug_code(text):
    # remove test functions
    res = re.sub(re.compile(r'\n*( *)function test\S*\(\) \{\n.*?\n\1\}', re.DOTALL), '', text)
    # remove asserts
    res = re.sub(r'\n *console\.assert\(.*\);', '', res)
    return res


# find import statements and replace them with the content of the imported file (ignoring files already imported)
def process_imports(text, debug):
    def import_callback(m):
        global imported_files
        indentation = m.group(1)
        filename = m.group(2)

        if filename in imported_files:
            print('{} already imported'.format(filename))
            return ''
        imported_files.add(filename)

        with open('scripts/' + filename) as f:
            filecontent = f.read()
        # process imports recursively
        res = process_imports(filecontent, debug)

        # indent
        res = re.sub(r'(.*?\n)', indentation + r'\1', res)
        # if last line doesn't have final '\n'
        res = re.sub(r'\n(.*?)$', r'\n' + indentation + r'\1', res)
        res = '\n' + res
        return res

    if not debug:
        text = remove_debug_code(text)

    # search for import statement and replace it with the content of the file to import
    return re.sub(r'\n( *)// __import__ (.*)', import_callback, text)


def strip_empty_line_spaces(text):
    return re.sub(r' *\n', '\n', text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', action='store_true', default=False, help='keep debug functions and asserts')
    args = parser.parse_args()

    with open('scripts/kappanoid.js', 'w') as f:
        f.write('/* Generated: {} */\n\n'.format(datetime.now().strftime('%Y/%m/%d %H:%M:%S')))
        with open('scripts/main.js') as fmain:
            f.write(strip_empty_line_spaces(process_imports(fmain.read(), args.debug)))


if __name__ == '__main__':
    main()
