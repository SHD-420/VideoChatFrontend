set -e

npm run build

cd dist

git init
git add -A
git commit -m "Deploy"

git push -f https://github.com/SHD-420/VideoChatFrontend.git main:deploy

cd ..
rm -rf dist