cd chrome/app/javascripts

echo "building/uglifying JS...."
rm -r build

r.js -o app.build.js

# echo "building/ugliying CSS..."
# rm -r build
# r.js -o app.build.js

cd ../

echo "compiling jade views and copying...."
clientjade index.jade > javascripts/jade.js
