// 单词学习页面组件

import { WordData, SubcategoryData } from '../types/CommonTypes'
import { LearningDataManager } from '../utils/LearningDataManager'
import { TTSManager } from '../utils/TTSManager'

@Component
export struct WordLearningPage {
  @Prop subcategoryId: string = ''
  
  @State currentWordIndex: number = 0
  @State words: WordData[] = []
  @State subcategory: SubcategoryData | undefined = undefined
  @State isFlipped: boolean = false
  @State isPlaying: boolean = false
  
  private learningDataManager = LearningDataManager.getInstance()
  private ttsManager = TTSManager.getInstance()

  aboutToAppear() {
    this.loadWords()
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
    const word = this.getCurrentWord()
    if (!word || this.isPlaying) return
    
    this.isPlaying = true
    try {
      await this.ttsManager.speakWord(word.english)
    } finally {
      this.isPlaying = false
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
        
        Text(this.getCurrentWord()?.english || '')
          .fontSize(28)
          .fontColor('#333333')
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            this.flipCard()
          })
        
        Blank()
        
        Text(`${this.currentWordIndex + 1}/${this.words.length}`)
          .fontSize(20)
          .fontColor('#666666')
      }
      .width('100%')
      .height(60)
      .padding({ left: 20, right: 20 })
      .backgroundColor('#F5F5F5')

      // 主要内容区域
      Row() {
        if (this.getCurrentWord()) {
          // 左侧：单词卡片
          Stack() {
            // 正面 - 英文单词
            Column() {
              // 使用rawfile资源引用
              Image($rawfile(this.getCurrentWord()!.image))
                .width(300)
                .height(300)
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
                  this.playPronunciation()
                })
                .gesture(
                  LongPressGesture({ repeat: true })
                    .onAction(() => {
                      this.flipCard()
                    })
                )
              
              Text(this.getCurrentWord()!.english)
                .fontSize(36)
                .fontColor('#333333')
                .fontWeight(FontWeight.Bold)
                .margin({ top: 20 })
                .onClick(() => {
                  this.playPronunciation()
                })
              
              Text(this.getCurrentWord()!.pronunciation)
                .fontSize(20)
                .fontColor('#666666')
                .margin({ top: 10 })
            }
            .rotate({ angle: this.isFlipped ? 180 : 0, x: 0, y: 1, z: 0 })
            .animation({ duration: 600, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal })
            
            // 背面 - 中文意思
            Column() {
              Image($rawfile(this.getCurrentWord()!.image))
                .width(300)
                .height(300)
                .borderRadius(20)
                .objectFit(ImageFit.Cover)
                .opacity(0.3)
                .alt($r('app.media.foreground')) // 备用图片
              
              Text(this.getCurrentWord()!.chinese)
                .fontSize(48)
                .fontColor('#FF0000')
                .fontWeight(FontWeight.Bold)
                .margin({ top: 20 })
              
              Text('点击图片播放发音')
                .fontSize(16)
                .fontColor('#999999')
                .margin({ top: 10 })
            }
            .rotate({ angle: this.isFlipped ? 0 : -180, x: 0, y: 1, z: 0 })
            .animation({ duration: 600, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal })
          }
          .width(350)
          .height(450)
          .backgroundColor('#FFFFFF')
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
          
          // 右侧：英文和中文显示区域
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
            
            Button('播放发音')
              .fontSize(20)
              .fontColor('#FFFFFF')
              .backgroundColor('#4ECDC4')
              .borderRadius(25)
              .width(120)
              .height(50)
              .onClick(() => {
                this.playPronunciation()
              })
          }
          .justifyContent(FlexAlign.Center)
          .flexGrow(1)
          .padding({ left: 30 })
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
      .justifyContent(FlexAlign.Center)
      .padding({ left: 50, right: 50 })

      // 底部控制按钮
      Row() {
        Button('上一个')
          .fontSize(20)
          .fontColor('#FFFFFF')
          .backgroundColor('#4ECDC4')
          .borderRadius(25)
          .width(120)
          .height(50)
          .enabled(this.currentWordIndex > 0)
          .onClick(() => {
            this.prevWord()
          })
        
        Blank()
        
        Button(this.isFlipped ? '显示英文' : '显示中文')
          .fontSize(20)
          .fontColor('#FFFFFF')
          .backgroundColor('#FF6B6B')
          .borderRadius(25)
          .width(120)
          .height(50)
          .onClick(() => {
            this.flipCard()
          })
        
        Blank()
        
        Button('下一个')
          .fontSize(20)
          .fontColor('#FFFFFF')
          .backgroundColor('#4ECDC4')
          .borderRadius(25)
          .width(120)
          .height(50)
          .enabled(this.currentWordIndex < this.words.length - 1)
          .onClick(() => {
            this.nextWord()
          })
      }
      .width('100%')
      .height(80)
      .padding({ left: 30, right: 30 })
      .backgroundColor('#F5F5F5')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F8F9FA')
  }
}