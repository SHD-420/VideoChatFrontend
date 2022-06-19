set -e

npm run build

cd dist

git init
git add -A
git commit -m "Deploy"

git push -f git@github.com:SHD-420/VideoChatFrontend master:deploy

cd ..
rm -rf dist