all: production

debug:
	./assemble.py ./src/js/ -o ./src/js/kappanoid.js --debug
	@echo Done

production:
	./assemble.py ./src/js/ -o ./src/js/kappanoid.js
	@echo Done

clean:
	rm ./src/js/kappanoid.js
