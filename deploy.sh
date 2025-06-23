#!/bin/bash

set -e 

echo "Cleaning Angular cache"
npx ng cache clean

echo "Removing existing dist folder"
rm -rf dist/

ng build --configuration production --output-path dist/orderapp

echo "Deploying to /var/www/html"
sudo rm -rf /var/www/html/*
sudo cp -r dist/orderapp/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;

echo "Reloading Nginx"
sudo systemctl reload nginx
sudo systemctl restart nginx

echo "Deployment complete."
