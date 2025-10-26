#!/bin/bash

# 设置环境变量
export DEVECO_SDK_HOME=/Applications/DevEco-Studio.app/Contents/sdk/default
export OHOS_SDK_HOME=/Applications/DevEco-Studio.app/Contents/sdk/default
export OHOS_SDK_NATIVE=/Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/native
export OHOS_SDK_ETS=/Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/ets

# 清理缓存
rm -rf .hvigor/cache/*
rm -rf .hvigor/dependencyMap/*
rm -rf .hvigor/outputs/*
rm -rf .hvigor/report/*

# 构建项目
/Applications/DevEco-Studio.app/Contents/tools/node/bin/node /Applications/DevEco-Studio.app/Contents/tools/hvigor/bin/hvigorw.js --mode module -p module=entry@default -p product=default -p requiredDeviceType=phone assembleHap --analyze=normal --parallel --incremental --daemon

echo "构建完成！"
