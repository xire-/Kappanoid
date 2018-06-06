all: production

debug:
	./assemble.py ./scripts/ -o ./scripts/kappanoid.js --debug
	@echo Done

production:
	./assemble.py ./scripts/ -o ./scripts/kappanoid.js
	@echo Done

clean:
	rm ./scripts/kappanoid.js
