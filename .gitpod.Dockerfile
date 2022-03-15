FROM gitpod/workspace-full

RUN python3 -m pip install --upgrade ipykernel \
    && npm_config_yes=true npx playwright install-deps \
    && npm_config_yes=true npx playwright install