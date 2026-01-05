#!/bin/bash

# Script to copy the correct GoogleService-Info.plist based on build configuration
# Can be used in two ways:
# 1. Called manually: bash copy-firebase-config.sh [Debug|Release]
# 2. Called from Xcode Build Phase (uses CONFIGURATION env var)

# Use parameter if provided, otherwise use Xcode env var
if [ -n "$1" ]; then
    CONFIGURATION="$1"
fi

# Set paths based on context (manual call vs Xcode build phase)
if [ -n "$BUILT_PRODUCTS_DIR" ] && [ -n "$PRODUCT_NAME" ]; then
    # Called from Xcode Build Phase
    PLIST_DESTINATION="${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
    PLIST_SOURCE_DIR="${SRCROOT}/App"
else
    # Called manually - copy to App directory
    PLIST_DESTINATION="./GoogleService-Info.plist"
    PLIST_SOURCE_DIR="."
fi

if [ "${CONFIGURATION}" == "Debug" ]; then
    # Use staging for debug builds
    PLIST_SOURCE="${PLIST_SOURCE_DIR}/GoogleService-Info-Staging.plist"
    echo "Using Firebase Staging config for Debug build"
elif [ "${CONFIGURATION}" == "Release" ]; then
    # Use production for release builds
    PLIST_SOURCE="${PLIST_SOURCE_DIR}/GoogleService-Info-Production.plist"
    echo "Using Firebase Production config for Release build"
else
    # Default to staging
    PLIST_SOURCE="${PLIST_SOURCE_DIR}/GoogleService-Info-Staging.plist"
    echo "Using Firebase Staging config (default)"
fi

if [ ! -f "$PLIST_SOURCE" ]; then
    echo "error: Firebase config file not found at $PLIST_SOURCE"
    exit 1
fi

cp "$PLIST_SOURCE" "$PLIST_DESTINATION"
echo "Copied $PLIST_SOURCE to $PLIST_DESTINATION"
