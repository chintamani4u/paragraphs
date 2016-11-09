#!/usr/bin/env bash
# You can edit this as you want, recommended tasks:
#     Stop any services using required ports (80, 443, 53, etc; see the amazee.io page for more, or trial-and-error it).
#     Start docker, if it's not set up to run automatically.

if pgrep "docker" > /dev/null
then
    echo "Docker already running."
else
    sudo service docker start || exit 1
fi

# Stop apache so it doesn't interfere with the docker containers.
if pgrep "apache2" > /dev/null
then
    sudo service apache2 stop || exit 1
else
    echo "Apache2 already stopped."
fi

# Start amazee dependencies.
pygmy up || exit 1
# Start our drupal instance, ps to check if it started and open it.
# docker-compose tart and up -d behave differently only initially. Every additional use is basically equivalent.
docker-compose up -d || exit 1
docker ps || exit 1
docker-compose exec --user drupal drupal bash || exit 1