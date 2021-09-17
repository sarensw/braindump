echo 'starting braindump build'

# init env variables
export CSC_LINK=$1
export CSC_KEY_PASSWORD=$2
export APPLEID=$3
export APPLEIDPASS=$4

# print the env
printenv

# install dependencies
#npm install

# clean
npm run clean

# build
npm run build
npm run dist

# print files
find ./dist

codesign -vvv --deep --strict ./dist/mac/braindump.app
codesign -dvv ./dist/mac/braindump.app
spctl -a -vv ./dist/mac/braindump.app
xcrun altool --list-providers -u $APPLEID -p $APPLEIDPASS