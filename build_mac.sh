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

# build
npm run build

# print files
find ./dist

codesign -vvv --deep --strict ./dist/mac/Braindump.app
codesign -dvv ./dist/mac/Braindump.app
spctl -a -vv ./dist/mac/Braindump.app
xcrun altool --list-providers -u $APPLEID -p $APPLEIDPASS