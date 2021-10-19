echo 'starting braindump build'

# init env variables
if [ -n "$1" ]; then
  echo 'local build'
  export CSC_LINK=$2
  export CSC_KEY_PASSWORD=$3
  export APPLEID=$4
  export APPLEIDPASS=$5
fi

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