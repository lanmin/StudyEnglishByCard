struct preview{build(){Button('←')
          .fontSize(24)
          .fontColor('#333333')
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            console.log('返回按钮被点击 - 暂时禁用返回功能')
          })}}