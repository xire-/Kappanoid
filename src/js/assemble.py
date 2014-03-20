#!/usr/bin/python
from __future__ import with_statement
import sys
import re
from datetime import datetime

def is_assert_line(line):
    m = re.match(r'^\s*console\.assert\(.*\);\s*$', line)
    return m is not None

def is_empty_line(line):
    return re.match(r'^\s*$', line) is not None

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

    # read /js/parts/main.js
    with open(js_path + 'parts/main.js') as fmain, open(js_path + output_file, 'w') as fris:
        # print timestamp on top
        fris.write('/* Generated: {} */\n\n'. format(datetime.now().strftime('%Y/%m/%d %H:%M:%S')))
        for line in fmain:
            m = re.match(r'^(\s*)// __import__ (.*)$', line)
            if m is not None:
                # if it's an import directive
                indent = m.group(1)
                import_path = m.group(2)
                # put the content of the indicated file in the final file
                with open(js_path + 'parts/' + import_path, 'r') as fimp:
                    for l in fimp:
                        if not debug_flag and is_assert_line(l):
                            # skip this assert if not in debug
                            continue
                        
                        if is_empty_line(l):
                            fris.write('\n')
                        else:
                            fris.write(indent + l)
                continue

            if not debug_flag and is_assert_line(line):
                # skip this assert if not in debug
                continue

            # if it's not a special statement, don't modify
            fris.write(line)


if __name__ == '__main__':
    main()