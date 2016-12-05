#!/bin/bash
# This bash script will update the project without installing the development modules, that's why it's "prod"
git pull && composer install --no-dev && cd web && drush updb -y && drush cim -y && drush cr
