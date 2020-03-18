PROJECT_DIR=$(shell pwd)
DIAGRAMS_DIR="$(PROJECT_DIR)/diagrams"
DOCS_DIR="$(PROJECT_DIR)/docs"

.PHONY: docs
docs:
	@printf "%s\n" "Generating PNG diagrams"
	@plantuml -Tpng -o $(DOCS_DIR)/images $(DIAGRAMS_DIR)/*.puml
	@printf "%s\n" "DONE"

.PHONY: deploy
	@printf "%s\n" "Deploy"
	@printf "%s\n" "TODO"
	@printf "%s\n" "DONE"