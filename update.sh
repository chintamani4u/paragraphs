#!/bin/bash
# This bash script will update the project. For production environment use update-prod.sh instead!
git pull && composer install && cd web && drush updb -y && drush cim -y && drush cr
