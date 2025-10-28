// 单词学习页面组件

import { WordData, SubcategoryData } from '../types/CommonTypes'
import { LearningDataManager } from '../utils/LearningDataManager'
import { SpeechManager } from '../utils/SpeechManager'
import { AudioRecorderManager } from '../utils/AudioRecorderManager'

interface TouchPoint {
  x: number
  y: number
}

@Component
export struct WordLearningPage {
  subcategoryId: string = ''
  onBack?: () => void
  
  @State currentWordIndex: number = 0
  @State words: WordData[] = []
  @State subcategory: SubcategoryData | undefined = undefined
  @State isFlipped: boolean = false
  @State isPlaying: boolean = false
  
  // 听说读写模式状态
  @State currentMode: 'listen' | 'speak' | 'read' | 'write' | 'normal' = 'normal'
  @State cardScale: number = 1  // 卡片缩放状态
  @State imageError: boolean = false  // 图片加载失败状态
  @State micIconScale: number = 1  // 麦克风图标缩放状态
  @State showHearGif: boolean = false  // 是否显示听音GIF
  @State testOptions: WordData[] = []  // 测试选项（3个单词）
  @State selectedTestOption: number = -1  // 选中的选项索引
  @State testCorrectAnswerShown: boolean = false  // 是否正确答案已显示
  @State drawingPaths: string = ''  // 绘制的路径数据
  
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
    this.imageError = false  // 重置图片加载错误状态
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
      this.completedModes = []  // 清空已完成状态
      this.currentMode = 'normal'  // 回到正常模式
    }
  }

  // 上一个单词
  private prevWord() {
    if (this.currentWordIndex > 0) {
      this.currentWordIndex--
      this.isFlipped = false
      this.completedModes = []  // 清空已完成状态
      this.currentMode = 'normal'  // 回到正常模式
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
    
    // 显示hearWord.gif，持续2秒
    this.showHearGif = true
    // 2秒后标记完成
    setTimeout(() => {
      if (!this.completedModes.includes('listen')) {
        this.completedModes.push('listen')
      }
    }, 2000)
    setTimeout(() => {
      this.showHearGif = false
    }, 2000)
    
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
    
    // 开始麦克风图标动画
    this.startMicIconAnimation()
    
    const word = this.getCurrentWord()
    if (!word) {
      console.error('没有当前单词')
      return
    }
    
    // 1. 先播放一遍单词读音
    console.log('播放单词读音')
    // await this.playPronunciation()
    
    // 2. 播放"XX用英语怎么说？"
    const question = `${word.chinese}用英语怎么说？`
    console.log('播放问题:', question)
    await SpeechManager.speak(question)
    
    // 3. 开启麦克风录制
    await this.startRecording(word)
    
    // 录音结束后标记完成
    setTimeout(() => {
      if (!this.completedModes.includes('speak')) {
        this.completedModes.push('speak')
      }
    }, 5000)  // 录音5秒后完成
  }

  // 开始麦克风图标动画
  private startMicIconAnimation() {
    // 创建循环动画：从1.0缩放到1.3，再回到1.0
    const animation = () => {
      this.micIconScale = 1.2
      setTimeout(() => {
        this.micIconScale = 1.0
      }, 500)
    }
    
    // 立即执行一次
    animation()
    
    // 每1秒重复一次
    const intervalId = setInterval(() => {
      if (this.currentMode === 'speak') {
        animation()
      } else {
        clearInterval(intervalId)
      }
    }, 1000)
  }

  // 开始录音
  private async startRecording(word: WordData) {
    console.log('开始录音，单词:', word.english)
    console.log('当前模式:', this.currentMode)
    
    try {
      console.log('准备调用AudioRecorderManager.startRecord')
      // 开始录音
      const result = await AudioRecorderManager.startRecord(word.english)
      console.log('录音已开始，单词:', word.english, '返回结果:', result)
      
      // 5秒后自动停止录音
      setTimeout(async () => {
        console.log('录音超时（5秒），停止录音')
        await this.stopRecording(word)
      }, 5000)
      
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
      
      // 恢复界面
      this.currentMode = 'normal'
      console.log('说话模式已结束，恢复界面')
    } catch (error) {
      console.error('停止录音失败:', error)
    }
  }

  // 进入测试模式
  private async enterReadMode() {
    this.currentMode = 'read'
    console.log('进入测试模式')
    
    const correctWord = this.getCurrentWord()
    if (!correctWord) {
      console.error('没有当前单词')
      return
    }
    
    // 生成3个选项：1个正确 + 2个错误
    this.generateTestOptions(correctWord)
    
    // 播放问题："哪个是沙发Sofa？"
    const question = `哪个是${correctWord.chinese}${correctWord.english}？`
    await SpeechManager.speak(question)
  }
  
  // 生成测试选项
  private generateTestOptions(correctWord: WordData) {
    const options: WordData[] = [correctWord]
    
    // 从其他单词中随机选择2个作为干扰项
    const otherWords = this.words.filter(w => w.english !== correctWord.english)
    
    // 随机打乱
    const shuffled = otherWords.sort(() => Math.random() - 0.5)
    
    // 添加2个干扰项
    for (let i = 0; i < 2 && i < shuffled.length; i++) {
      options.push(shuffled[i])
    }
    
    // 随机打乱选项顺序
    const shuffledOptions = options.sort(() => Math.random() - 0.5)
    this.testOptions = shuffledOptions
    this.selectedTestOption = -1
    this.testCorrectAnswerShown = false
    console.log('测试选项生成:', shuffledOptions.map(w => w.english))
  }

  // 选择测试选项
  private async selectTestOption(index: number) {
    if (this.testCorrectAnswerShown) {
      return // 正确答案已显示，不允许再选择
    }
    
    this.selectedTestOption = index
    console.log('选择了选项:', index)
    
    const correctWord = this.getCurrentWord()
    const isCorrect = index === this.testOptions.findIndex(w => w.english === correctWord?.english)
    
    // 等待一小段时间后播放声音
    setTimeout(async () => {
      if (isCorrect) {
        // 选择正确 - 播放欢呼声
        console.log('✅ 选择正确！')
        this.testCorrectAnswerShown = true
        await SpeechManager.speak('答对了，你真棒！')
        
        // 标记测试完成
        if (!this.completedModes.includes('read')) {
          this.completedModes.push('read')
        }
        
        // 自动返回学习页面
        setTimeout(() => {
          this.currentMode = 'normal'
        }, 1000)
      } else {
        // 选择错误 - 清除选择，允许重新选择
        console.log('❌ 选择错误！')
        await SpeechManager.speak('再试试吧')
        // 清空选择，让用户可以重选
        this.selectedTestOption = -1
      }
    }, 300)
  }

  // 进入书写模式
  private enterWriteMode() {
    this.currentMode = 'write'
    this.draggedLetters = []  // 清空已拖拽的字母
    this.isWriteCorrect = false
    console.log('进入书写模式')
  }

  // 检查拼写结果
  private checkWriteResult() {
    if (!this.getCurrentWord()) {
      return
    }
    
    const currentWord = this.getCurrentWord()!.english
    const userInput = this.draggedLetters.join('')
    
    // 检查是否输入完成
    if (this.draggedLetters.length === currentWord.length) {
      // 判断拼写是否正确
      if (userInput === currentWord) {
        this.isWriteCorrect = true
        // 播放正确提示音
        SpeechManager.speak('答对了，你真棒！').catch((err: Error) => {
          console.error('拼写成功提示失败:', err)
        })
        // 标记书写完成
        if (!this.completedModes.includes('write')) {
          this.completedModes.push('write')
        }
        
        // 1秒后返回学习页面
        setTimeout(() => {
          this.currentMode = 'normal'
        }, 1000)
      } else {
        this.isWriteCorrect = false
        // 播放错误提示音
        SpeechManager.speak('再试试吧').catch((err: Error) => {
          console.error('拼写错误提示失败:', err)
        })
        // 2秒后清空书写区域，让用户重新开始
        setTimeout(() => {
          this.draggedLetters = []
          this.isWriteCorrect = false
        }, 2000)
      }
    }
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
      if (this.currentMode === 'read') {
        // 测试模式显示
        this.buildTestMode()
      } else if (this.currentMode === 'write') {
        // 书写模式显示
        this.buildWriteMode()
      } else {
        // 常规模式显示
        this.buildNormalMode()
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  buildTestMode() {
    Column() {
      Text('听音选择正确的图片')
        .fontSize(24)
        .fontColor('#333333')
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 30 })
      
      // 3个选项
      Row() {
        ForEach(this.testOptions, (option: WordData, index: number) => {
          Column() {
            Image($rawfile(option.image))
              .width(150)
              .height(150)
              .borderRadius(15)
              .objectFit(ImageFit.Cover)
              .border({
                width: this.selectedTestOption === index ? 5 : 0,
                color: this.selectedTestOption === index 
                  ? (index === this.testOptions.findIndex(w => w.english === this.getCurrentWord()?.english) ? '#00FF00' : '#FF0000')
                  : '#000000',
                style: BorderStyle.Solid
              })
              .onClick(() => {
                this.selectTestOption(index)
              })
          }
          .margin({ right: 10 })
        })
      }
      .justifyContent(FlexAlign.Center)
      .width('100%')
      .flexGrow(1)
    }
    .width('100%')
    .height('90%')
    .padding(20)
  }

  @State draggedLetters: string[] = []
  @State isWriteCorrect: boolean = false  // 是否拼写正确
  @State completedModes: string[] = []  // 已完成的功能模式（听、说、测、写）

  @Builder
  buildWriteMode() {
    if (this.getCurrentWord()) {
      Row() {
        // 左侧：标题
        Column() {
          Text('✨')
            .fontSize(40)
            .fontColor('#FF6B6B')
            .margin({ bottom: 10 })
          Text('拼')
            .fontSize(50)
            .fontColor('#FF6B6B')
            .fontWeight(FontWeight.Bold)
          Text('一')
            .fontSize(50)
            .fontColor('#FF6B6B')
            .fontWeight(FontWeight.Bold)
          Text('拼')
            .fontSize(50)
            .fontColor('#FF6B6B')
            .fontWeight(FontWeight.Bold)
          Text('✨')
            .fontSize(40)
            .fontColor('#FF6B6B')
            .margin({ top: 10 })
        }
        .width('15%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .margin({ left: 20 })
        
        // 右侧：滚动内容区域
        Column() {
          // 可选字母区域
          Column() {
            Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Center }) {
              ForEach(Array.from(this.getCurrentWord()!.english), (letter: string, index: number) => {
                Text(letter)
                  .fontSize(50)
                  .fontColor('#FFFFFF')
                  .fontWeight(FontWeight.Bold)
                  .width(85)
                  .height(85)
                  .textAlign(TextAlign.Center)
                  .backgroundColor('#4ECDC4')
                  .borderRadius(18)
                  .margin(6)
                  .onClick(() => {
                    if (this.draggedLetters.filter(l => l === letter).length < this.getCurrentWord()!.english.split('').filter(l => l === letter).length) {
                      this.draggedLetters.push(letter)
                      this.checkWriteResult()
                    }
                  })
              })
            }
            .width('100%')
            .padding(10)
          }
          .width('100%')
          .backgroundColor('#E8F8F5')
          .borderRadius(25)
          .padding(15)
          .margin({ bottom: 20 })
        
          // 书写区域
          Column() {
            Flex({ wrap: FlexWrap.NoWrap, justifyContent: FlexAlign.Center }) {
              ForEach(this.draggedLetters, (letter: string, index: number) => {
                Text(letter)
                  .fontSize(50)
                  .fontColor('#FFFFFF')
                  .fontWeight(FontWeight.Bold)
                  .width(100)
                  .height(100)
                  .textAlign(TextAlign.Center)
                  .backgroundColor(this.isWriteCorrect ? '#95E1D3' : '#FF9A9A')
                  .borderRadius(20)
                  .margin(8)
                  .onClick(() => {
                    if (!this.isWriteCorrect) {
                      this.draggedLetters.splice(index, 1)
                    }
                  })
              })
              
              if (this.draggedLetters.length === 0) {
                Text('👆 点击字母拼写')
                  .fontSize(35)
                  .fontColor('#A9A9A9')
                  .margin(20)
              }
            }
            .width('100%')
            // .height(100)
          }
          .width('100%')
          .backgroundColor('#FFF8E7')
          .borderRadius(25)
          .padding(20)
          .border({
            width: 4,
            color: this.isWriteCorrect ? '#95E1D3' : '#FFB6C1',
            style: BorderStyle.Solid
          })
          .shadow({
            radius: 10,
            color: '#00000010',
            offsetX: 0,
            offsetY: 3
          })
          .margin({ bottom: 10 })
        }
        .width('90%')
        .layoutWeight(1)
      }
      .width('100%')
      .height('90%')
      .backgroundColor('#FAFAFA')
      .margin({ top: 20, bottom: 20 })
    }
  }

  @Builder
  buildNormalMode() {
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
            // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
            Image(this.imageError ? $rawfile('CardOriginal/DefaultImg.png') : $rawfile(this.getCurrentWord()!.image))
              .width(250)
              .height(250)
              .borderRadius(20)
              .objectFit(ImageFit.Cover)
              .onError(() => {
                console.log(`图片加载失败: ${this.getCurrentWord()!.image}`)
                console.log('使用DefaultImg.png作为占位图')
                this.imageError = true
              })
              .onComplete(() => {
                console.log(`图片加载成功: ${this.getCurrentWord()!.image}`)
                this.imageError = false
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
            this.playPronunciation()
          })
          
          // 右侧：英文和中文显示区域 + 听说读写按钮
          Column() {
            // 单词信息区域
            Column() {
              Text(this.getCurrentWord()!.english)
                .fontSize(35)
                .fontColor('#333333')
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 30 })

              Text(this.getCurrentWord()!.chinese)
                .fontSize(35)
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
              // 录音图标（仅在说话模式下显示）
              if (this.currentMode === 'speak') {
                Image($rawfile('CardOriginal/Wave.png'))
                  .width(60)
                  .height(40)
                  .objectFit(ImageFit.Fill)
                  .margin({ bottom: 10 })
                  .scale({ x: this.micIconScale, y: this.micIconScale })
                  .animation({ duration: 500, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal })
              }
              
              // 听音图标（仅在听力模式下显示）
              if (this.showHearGif) {
                Image($rawfile('hearWord.gif'))
                  .width(60)
                  .height(40)
                  .objectFit(ImageFit.Fill)
                  .margin({ bottom: 10 })
              }
              
              Row() {
                Stack() {
                  Button('听')
                    .fontSize(18)
                    .fontColor('#FFFFFF')
                    .backgroundColor(this.currentMode === 'listen' ? '#FF0000' : '#FF6B6B')
                    .borderRadius(20)
                    .width(60)
                    .height(50)
                    .onClick(() => {
                      this.enterListenMode()
                    })
                  
                  if (this.completedModes.includes('listen')) {
                    Text('✓')
                      .fontSize(20)
                      .fontColor('#52C41A')
                      .fontWeight(FontWeight.Bold)
                      .position({ x: 45, y: 0 })
                  }
                }
                .margin({ right: 10 })

                Stack() {
                  Button('说')
                    .fontSize(18)
                    .fontColor('#FFFFFF')
                    .backgroundColor(this.currentMode === 'speak' ? '#00BFA5' : '#4ECDC4')
                    .borderRadius(20)
                    .width(60)
                    .height(50)
                    .onClick(() => {
                      this.enterSpeakMode()
                    })
                  
                  if (this.completedModes.includes('speak')) {
                    Text('✓')
                      .fontSize(20)
                      .fontColor('#52C41A')
                      .fontWeight(FontWeight.Bold)
                      .position({ x: 45, y: 0 })
                  }
                }
                .margin({ right: 10 })

                Stack() {
                  Button('测')
                    .fontSize(18)
                    .fontColor('#FFFFFF')
                    .backgroundColor(this.currentMode === 'read' ? '#0277BD' : '#45B7D1')
                    .borderRadius(20)
                    .width(60)
                    .height(50)
                    .onClick(() => {
                      this.enterReadMode()
                    })
                  
                  if (this.completedModes.includes('read')) {
                    Text('✓')
                      .fontSize(20)
                      .fontColor('#52C41A')
                      .fontWeight(FontWeight.Bold)
                      .position({ x: 45, y: 0 })
                  }
                }
                .margin({ right: 10 })

                Stack() {
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
                  
                  if (this.completedModes.includes('write')) {
                    Text('✓')
                      .fontSize(20)
                      .fontColor('#52C41A')
                      .fontWeight(FontWeight.Bold)
                      .position({ x: 45, y: 0 })
                  }
                }
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
  }
}