// 单词学习页面组件

import { WordData, SubcategoryData } from '../types/CommonTypes'
import { LearningDataManager } from '../utils/LearningDataManager'
import { SpeechManager } from '../utils/SpeechManager'
import { AudioRecorderManager } from '../utils/AudioRecorderManager'
@Entry
@Component
export struct WordLearningPage {
  @State subcategoryId: string = ''
  
  @State currentWordIndex: number = 0
  @State words: WordData[] = []
  @State subcategory: SubcategoryData | undefined = undefined
  @State isFlipped: boolean = false
  @State isPlaying: boolean = false
  
  // 听说读写模式状态
  @State currentMode: 'listen' | 'speak' | 'read' | 'write' | 'normal' = 'normal'
  @State cardScale: number = 1  // 卡片缩放状态
  
  private learningDataManager = LearningDataManager.getInstance()

  aboutToAppear() {
    // 初始化TTS
    SpeechManager.init()
    this.loadWords()
  }

  aboutToDisappear() {
    // 清理TTS资源
    SpeechManager.destroy()
  }

  // 加载单词数据
  private loadWords() {
    console.log(`WordLearningPage: 开始加载子分类 ${this.subcategoryId}`)
    this.subcategory = this.learningDataManager.getSubcategoryById(this.subcategoryId)
    this.words = this.learningDataManager.getWordsBySubcategory(this.subcategoryId)
    this.currentWordIndex = 0
    this.isFlipped = false
    console.log(`WordLearningPage: 加载完成，子分类: ${this.subcategory?.name}, 单词数量: ${this.words.length}`)
    if (this.words.length > 0) {
      const firstWord = this.words[0]
      console.log(`WordLearningPage: 第一个单词: ${firstWord.english} - ${firstWord.chinese}`)
      console.log(`WordLearningPage: 第一个单词图片路径: ${firstWord.image}`)
    } else {
      console.log(`WordLearningPage: 警告 - 没有找到单词数据！`)
    }
  }

  // 获取当前单词
  private getCurrentWord(): WordData | undefined {
    return this.words[this.currentWordIndex]
  }

  // 获取子分类的英文名称
  private getSubcategoryEnglishName(): string {
    return this.learningDataManager.getSubcategoryEnglishName(this.subcategoryId)
  }

  // 播放单词发音
  private async playPronunciation() {
    console.info('🎵 playPronunciation被调用')
    const word = this.getCurrentWord()
    console.info('当前单词:', word ? word.english : '无')
    console.info('isPlaying状态:', this.isPlaying)
    
    if (!word || this.isPlaying) {
      console.warn('跳过播放 - word为空或正在播放')
      return
    }
    
    this.isPlaying = true
    console.info('准备调用SpeechManager.speak, 单词:', word.english)
    try {
      await SpeechManager.speak(word.english)
      console.info('✅ SpeechManager.speak完成')
    } finally {
      this.isPlaying = false
      console.info('isPlaying已重置为false')
    }
  }

  // 翻转卡片
  private flipCard() {
    this.isFlipped = !this.isFlipped
    console.log(`卡片翻转状态: ${this.isFlipped}`)
    if (this.getCurrentWord()) {
      console.log(`当前单词: ${this.getCurrentWord()!.english} - ${this.getCurrentWord()!.chinese}`)
    }
  }

  // 下一个单词
  private nextWord() {
    if (this.currentWordIndex < this.words.length - 1) {
      this.currentWordIndex++
      this.isFlipped = false
    }
  }

  // 上一个单词
  private prevWord() {
    if (this.currentWordIndex > 0) {
      this.currentWordIndex--
      this.isFlipped = false
    }
  }

  // 处理点击事件：翻转卡片并播放发音
  private handleTap() {
    this.flipCard()
    this.playPronunciation()
  }

  // 进入听力模式
  private enterListenMode() {
    this.currentMode = 'listen'
    console.log('进入听力模式')
    
    // 卡片缩放动画：缩小再放大
    this.animateCardScale()
    
    // 自动播放当前单词的发音
    this.playPronunciation()
  }

  // 卡片缩放动画
  private animateCardScale() {
    // 缩小到0.8
    this.cardScale = 0.8
    
    // 延迟后恢复到1
    setTimeout(() => {
      this.cardScale = 1
    }, 200)
  }

  // 进入口语模式
  private async enterSpeakMode() {
    this.currentMode = 'speak'
    console.log('进入口语模式')
    
    const word = this.getCurrentWord()
    if (!word) {
      console.error('没有当前单词')
      return
    }
    
    // 1. 先播放一遍单词读音
    console.log('播放单词读音')
    await this.playPronunciation()
    
    // 2. 播放"XX用英语怎么说？"
    const question = `${word.chinese}用英语怎么说？`
    console.log('播放问题:', question)
    await SpeechManager.speak(question)
    
    // 3. 开启麦克风录制
    await this.startRecording(word)
  }

  // 开始录音
  private async startRecording(word: WordData) {
    console.log('开始录音，单词:', word.english)
    
    try {
      // 开始录音
      await AudioRecorderManager.startRecord(word.english)
      console.log('录音已开始，单词:', word.english)
      
      // 10秒后自动停止录音
      setTimeout(async () => {
        console.log('录音超时（10秒），停止录音')
        await this.stopRecording(word)
      }, 10000)
      
    } catch (error) {
      console.error('录音失败:', error)
    }
  }

  // 停止录音
  private async stopRecording(word: WordData) {
    try {
      // 停止录音
      const uri = await AudioRecorderManager.stopRecord()
      console.log('录音已停止，文件URI:', uri)
      
      if (uri) {
        console.log(`录音文件已保存: ${word.english}.wav`)
      }
    } catch (error) {
      console.error('停止录音失败:', error)
    }
  }

  // 进入阅读模式
  private enterReadMode() {
    this.currentMode = 'read'
    console.log('进入阅读模式')
    // 阅读模式：自动朗读单词
    this.playPronunciation()
  }

  // 进入书写模式
  private enterWriteMode() {
    this.currentMode = 'write'
    console.log('进入书写模式')
    // TODO: 实现拼写练习功能
  }

  // 退出学习模式
  private exitMode() {
    this.currentMode = 'normal'
  }

  // 获取模式文本
  private getModeText(): string {
    switch (this.currentMode) {
      case 'listen':
        return '听力模式'
      case 'speak':
        return '口语模式'
      case 'read':
        return '阅读模式'
      case 'write':
        return '书写模式'
      default:
        return ''
    }
  }

  @Builder
  build() {
    Column() {
      // 顶部导航栏
      Row() {
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
            .width(50)
            .height(40)
            .onClick(() => {
              this.exitMode()
            })
        }
      }
      .width('100%')
      .height('10%')
      .padding({ left: 20, right: 20 })

      // 主要内容区域
      Row() {
        if (this.getCurrentWord()) {
          // 左侧：上一个按钮
          Button('←')
            .fontSize(40)
            .fontColor('#FFFFFF')
            .backgroundColor('#FF0000')
            .borderRadius(15)
            .width(60)
            .height(60)
            .enabled(this.currentWordIndex > 0)
            .onClick(() => {
              this.prevWord()
            })
            .alignSelf(ItemAlign.Center)
          
          // 中间：单词卡片
          Column() {
            // 使用rawfile资源引用
            Image($rawfile(this.getCurrentWord()!.image))
              .width(250)
              .height(250)
              .borderRadius(20)
              .objectFit(ImageFit.Cover)
              .alt($r('app.media.foreground')) // 备用图片
              .onError(() => {
                console.log(`图片加载失败: ${this.getCurrentWord()!.image}`)
                // 尝试备用路径
                console.log('尝试使用备用图片路径...')
              })
              .onComplete(() => {
                console.log(`图片加载成功: ${this.getCurrentWord()!.image}`)
              })
              .onClick(() => {
                this.handleTap()
              })
              .gesture(
                LongPressGesture({ repeat: true })
                  .onAction(() => {
                    this.flipCard()
                  })
              )
          }
          .rotate({ angle: this.isFlipped ? 180 : 0, x: 0, y: 1, z: 0 })
          .animation({ duration: 600, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal })
          .scale({ x: this.cardScale, y: this.cardScale })
          .animation({ duration: 300, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal })
          .width(350)
          .padding({bottom:0})
          .height('90%')
          .justifyContent(FlexAlign.Center)
          .borderRadius(25)
          .shadow({
            radius: 10,
            color: '#00000020',
            offsetX: 0,
            offsetY: 5
          })
          .onClick(() => {
            this.flipCard()
          })
          
          // 右侧：英文和中文显示区域 + 听说读写按钮
          Column() {
            // 单词信息区域
            Column() {
              Text(this.getCurrentWord()!.english)
                .fontSize(48)
                .fontColor('#333333')
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 30 })

              Text(this.getCurrentWord()!.chinese)
                .fontSize(36)
                .fontColor('#FF6B6B')
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 20 })

              Text(this.getCurrentWord()!.pronunciation)
                .fontSize(24)
                .fontColor('#666666')
                .margin({ bottom: 20 })
            }
            .justifyContent(FlexAlign.Center)
            .flexGrow(1)

            // 听说读写按钮区域
            Column() {
              Row() {
                Button('听')
                  .fontSize(18)
                  .fontColor('#FFFFFF')
                  .backgroundColor(this.currentMode === 'listen' ? '#FF0000' : '#FF6B6B')
                  .borderRadius(20)
                  .width(60)
                  .height(50)
                  .margin({ right: 10 })
                  .onClick(() => {
                    this.enterListenMode()
                  })

                Button('说')
                  .fontSize(18)
                  .fontColor('#FFFFFF')
                  .backgroundColor(this.currentMode === 'speak' ? '#00BFA5' : '#4ECDC4')
                  .borderRadius(20)
                  .width(60)
                  .height(50)
                  .margin({ right: 10 })
                  .onClick(() => {
                    this.enterSpeakMode()
                  })

                Button('读')
                  .fontSize(18)
                  .fontColor('#FFFFFF')
                  .backgroundColor(this.currentMode === 'read' ? '#0277BD' : '#45B7D1')
                  .borderRadius(20)
                  .width(60)
                  .height(50)
                  .margin({ right: 10 })
                  .onClick(() => {
                    this.enterReadMode()
                  })

                Button('写')
                  .fontSize(18)
                  .fontColor('#FFFFFF')
                  .backgroundColor(this.currentMode === 'write' ? '#009688' : '#96CEB4')
                  .borderRadius(20)
                  .width(60)
                  .height(50)
                  .onClick(() => {
                    this.enterWriteMode()
                  })
              }
              .justifyContent(FlexAlign.Center)
            }
            .margin({ top: 20 })
          }
          .justifyContent(FlexAlign.Center)
          .flexGrow(1)
          .padding({ left: 30 })
          
          // 最右侧：下一个按钮
          Button('→')
            .fontSize(40)
            .fontColor('#FFFFFF')
            .backgroundColor('#FF0000')
            .borderRadius(15)
            .width(60)
            .height(60)
            .enabled(this.currentWordIndex < this.words.length - 1)
            .onClick(() => {
              this.nextWord()
            })
            .alignSelf(ItemAlign.Center)
        } else {
          // 没有单词时的提示
          Column() {
            Image($r('app.media.foreground'))
              .width(200)
              .height(200)
              .opacity(0.5)
            
            Text('暂无单词数据')
              .fontSize(24)
              .fontColor('#999999')
              .margin({ top: 20 })
          }
          .justifyContent(FlexAlign.Center)
          .height(450)
        }
      }
      .flexGrow(1)
      .padding({ left: 50, right: 50 })
      .onClick(() => {
        this.handleTap()
      })
    }
    .width('100%')
    .height('100%')
  }
}