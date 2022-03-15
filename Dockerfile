FROM gitpod/workspace-full

# Create a new image and publish it to dockerhub, then use it directly in .gitpod.yml
# as prebuils for integration test makes no sense because a new environment is created
# every time
RUN cd /tmp \
    && git clone https://github.com/gitpod-io/python-test-workspace --depth=1 --single-branch --branch=master \
    && cd python-test-workspace \
    && yarn \
    && mkdir -p /home/gitpod/.cache/workspace \
    && cp -r ./node_modules /home/gitpod/.cache/workspace \
    && python3 -m pip install --upgrade ipykernel \
    && npm_config_yes=true npx playwright install-deps \
    && npm_config_yes=true npx playwright install