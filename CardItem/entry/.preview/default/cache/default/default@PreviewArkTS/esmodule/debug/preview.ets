struct preview{build(){Row() {
        Button('←')
          .fontSize(24)
          .fontColor('#333333')
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            console.log('返回按钮被点击 - 暂时禁用返回功能')
          })

        Blank()

        // 显示当前模式
        if (this.currentMode !== 'normal') {
          Text(this.getModeText())
            .fontSize(18)
            .fontColor('#333333')
            .margin({ left: 10 })
          
          Button('×')
            .fontSize(20)
            .fontColor('#333333')
            .backgroundColor(Color.Transparent)
            .width(40)
            .height(40)
            .onClick(() => {
              this.exitMode()
            })
        }
      }
      .width('100%')
      .height('10%')
      .padding({ left: 20, right: 20 })}}