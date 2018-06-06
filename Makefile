all: production

debug:
	./assemble.py --debug
	@echo Done

production:
	./assemble.py
	@echo Done

clean:
	rm -f scripts/kappanoid.js
