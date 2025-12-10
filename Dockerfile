FROM gitpod/workspace-full

# Disable npm lifecycle scripts for security
RUN npm config set ignore-scripts true --location=user && \
    echo 'ignore-scripts true' >> ~/.yarnrc

# Create a new image and publish it to dockerhub, then use it directly in .gitpod.yml
# as prebuils for integration test makes no sense because a new environment is created
# every time
RUN cd /tmp \
    && git clone https://github.com/gitpod-io/python-test-workspace --depth=1 --single-branch --branch=master \
    && cd python-test-workspace \
    && yarn --ignore-scripts \
    && mkdir -p /home/gitpod/.cache/workspace \
    && cp -r ./node_modules /home/gitpod/.cache/workspace \
    && python3 -m pip install --upgrade ipykernel \
    && yarn playwright install-deps \
    && yarn playwright install