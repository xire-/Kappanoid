#!/usr/bin/python
from __future__ import with_statement
import sys
import re
from datetime import datetime

def main():
    #legge il path di parts da arg
    if len(sys.argv) < 2:
        print 'usage: {} js_path'.format(sys.argv[0])
        exit(1)
    js_path = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'assembled.js'

    # legge /js/parts/main.js
    with open(js_path + 'parts/main.js') as fmain, open(js_path + output_file, 'w') as fris:
        fris.write('/* Generated: {} */\n\n'. format(datetime.now().strftime('%Y/%m/%d %H:%M:%S')))
        # fris.write(fmain.read())
        for line in fmain:
            m = re.match(r'^(\s*)// __import__ (.*)$', line)
            if m is not None:
                # se trova direttive di import
                indent = m.group(1)
                import_path = m.group(2)
                # legge file indicato e sostituisce il contenuto alla riga di import
                with open(js_path + 'parts/' + import_path, 'r') as fimp:
                    for l in fimp:
                        if re.match(r'^\s*$', l):
                            fris.write('\n')
                        else:
                            fris.write(indent + l)
            else:
                # non e' uno statement di import
                fris.write(line)


if __name__ == '__main__':
    main()