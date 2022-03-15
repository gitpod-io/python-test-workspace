FROM gitpod/workspace-full

RUN python3 -m pip install --upgrade ipykernel \
    && npm_config_yes=true npx playwright install-deps \
    && npm_config_yes=true npx playwright install

RUN cd /tmp \
    && git clone https://github.com/gitpod-io/python-test-workspace --depth=1 --single-branch --branch=master \
    && cd python-test-workspace \
    && yarn \
    && mkdir -p /home/gitpod/.cache/workspace \
    && cp -r ./node_modules /home/gitpod/.cache/workspace