// 主页面 - 横屏布局，左右滑动选择主题

import { PageType, ThemeType, ThemeData, WordData, LearningProgress } from '../types/CommonTypes'
import { GlobalStyles } from '../styles/GlobalStyles'
import { LearningDataManager } from '../utils/LearningDataManager'
import { SoundEffectManager } from '../managers/SoundEffectManager'
import { TTSManager } from '../utils/TTSManager'
import { LearningProgressManager } from '../managers/LearningProgressManager'

@Entry
@Component
struct Index {
  @State currentPage: PageType = 'theme_select' // 直接进入主题选择页
  @State currentTheme: ThemeType = 'fruits'
  @State currentWordIndex: number = 0
  @State learningProgress: LearningProgress = {
    currentTheme: 'fruits',
    currentWordIndex: 0,
    totalLearningTime: 0,
    sessionStartTime: 0,
    stickers: [],
    completedThemes: []
  }
  @State isImageHidden: boolean = false
  @State volumeVisible: boolean = false
  @State currentVolume: number = 50

  // 管理器实例
  private learningDataManager: LearningDataManager = LearningDataManager.getInstance()
  private soundEffectManager: SoundEffectManager = SoundEffectManager.getInstance()
  private ttsManager: TTSManager = TTSManager.getInstance()
  private learningProgressManager: LearningProgressManager = LearningProgressManager.getInstance()

  // 主题数据
  private themes: ThemeData[] = []

  aboutToAppear() {
    this.learningDataManager.init()
    this.themes = this.learningDataManager.getThemes()
  }

  // 初始化应用
  async initializeApp() {
    try {
      // 初始化TTS
      await this.ttsManager.init()
      
      // 初始化学习进度管理器
      await this.learningProgressManager.init()
      
      // 初始化音效管理器
      await this.soundEffectManager.init()
      
      // 加载学习进度
      this.loadLearningProgress()
      
      // 播放欢迎音效
      await this.soundEffectManager.playWelcome()
      
      console.log('应用初始化完成')
    } catch (error) {
      console.error('应用初始化失败:', error)
    }
  }

  // 加载学习进度
  loadLearningProgress() {
    this.learningProgress = this.learningProgressManager.loadProgress()
  }

  // 保存学习进度
  saveLearningProgress() {
    this.learningProgressManager.saveProgress()
  }

  // 开始主题学习
  async startThemeLearning(theme: ThemeType) {
    this.currentTheme = theme
    this.currentWordIndex = 0
    this.learningProgressManager.startThemeLearning(theme)
    await this.soundEffectManager.playLearningStart()
    this.currentPage = 'word_card'
  }

  // 返回上一页
  goBack() {
    console.log(`goBack called, current page: ${this.currentPage}`)
    if (this.currentPage === 'parent_helper') {
      this.currentPage = 'theme_select'
      console.log('Returning to theme_select from parent_helper')
    } else if (this.currentPage === 'word_card') {
      this.currentPage = 'theme_select'
      console.log('Returning to theme_select from word_card')
    } else if (this.currentPage === 'speaking_practice' || 
               this.currentPage === 'writing_practice') {
      this.currentPage = 'word_card'
      console.log('Returning to word_card from practice page')
    } else if (this.currentPage === 'progress_reward' || 
               this.currentPage === 'sticker_collection' || 
               this.currentPage === 'rest_break') {
      this.currentPage = 'theme_select'
      console.log('Returning to theme_select from reward/collection/break page')
    }
  }

  build() {
    Column() {
      if (this.currentPage === 'theme_select') {
        this.ThemeSelectPage()
      } else if (this.currentPage === 'parent_helper') {
        this.ParentHelperPage()
      } else if (this.currentPage === 'word_card') {
        this.WordCardPage()
      } else if (this.currentPage === 'speaking_practice') {
        this.SpeakingPracticePage()
      } else if (this.currentPage === 'writing_practice') {
        this.WritingPracticePage()
      } else if (this.currentPage === 'progress_reward') {
        this.ProgressRewardPage()
      } else if (this.currentPage === 'sticker_collection') {
        this.StickerCollectionPage()
      } else if (this.currentPage === 'rest_break') {
        this.RestBreakPage()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
    .onAppear(() => {
      this.initializeApp()
    })
  }

  // 主题选择页（横屏布局，左右滑动）
  @Builder ThemeSelectPage() {
    Column() {
      // 顶部区域 - 标题和设置按钮
      Row() {
        Text('选择学习主题')
          .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
          .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
          .fontWeight(FontWeight.Bold)
          .layoutWeight(1)
        
        // 设置按钮
        Button('⚙️')
          .width(60)
          .height(60)
          .backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY)
          .fontSize(24)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            console.log('Settings button clicked, changing to parent_helper')
            this.currentPage = 'parent_helper' // 暂时使用家长助手页面作为设置页面
          })
      }
      .width('100%')
      .padding({ left: GlobalStyles.SIZES.SPACING_LARGE, right: GlobalStyles.SIZES.SPACING_LARGE, top: GlobalStyles.SIZES.SPACING_MEDIUM })
      .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
      
      // 主题卡片容器 - 支持左右滑动
      Scroll() {
        Row() {
          ForEach(this.themes, (theme: ThemeData, index: number) => {
            this.ThemeCard(theme, index)
          })
        }
        .justifyContent(FlexAlign.Start)
        .padding({ top: GlobalStyles.SIZES.SPACING_MEDIUM, bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
      }
      .width('100%')
      .layoutWeight(1)
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Auto)
      .padding({ left: GlobalStyles.SIZES.SPACING_LARGE, right: GlobalStyles.SIZES.SPACING_LARGE })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 主题卡片
  @Builder ThemeCard(theme: ThemeData, index: number) {
    Column() {
      // 主题图标
      Image(theme.icon)
        .width(140)
        .height(140)
        .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
        .backgroundColor(theme.color)
        .padding(GlobalStyles.SIZES.SPACING_SMALL)
      
      // 主题名称（包含进度信息）
      Text(`${theme.name}（${theme.completedWords}/${theme.totalWords}）`)
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL)
        .fontColor(theme.color)
        .fontWeight(FontWeight.Bold)
        .margin({ top: GlobalStyles.SIZES.SPACING_SMALL })
        .textAlign(TextAlign.Center)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.None })
        .width('100%')
    }
    .width(200)
    .height(220)
    .backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND)
    .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
    .padding({ top: GlobalStyles.SIZES.SPACING_SMALL, bottom: GlobalStyles.SIZES.SPACING_SMALL, left: GlobalStyles.SIZES.SPACING_SMALL, right: GlobalStyles.SIZES.SPACING_SMALL })
    .justifyContent(FlexAlign.Center)
    .shadow(GlobalStyles.SHADOWS.MEDIUM)
    .margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM })
    .onClick(() => {
      this.soundEffectManager.playButtonClick()
      this.startThemeLearning(theme.id)
    })
    .animation(GlobalStyles.ANIMATIONS.BUTTON_PRESS)
    .scale({ x: 1, y: 1 })
  }

  // 设置页面
  @Builder ParentHelperPage() {
    Column() {
      // 标题
      Text('设置')
        .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
        .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      // 音量控制
      Column() {
        Text('音量控制')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
        
        Row() {
          Text('🔊')
            .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
            .margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM })
          
          Slider({
            value: this.currentVolume,
            min: 0,
            max: 100,
            step: 1
          })
            .width(200)
            .onChange((value: number) => {
              this.currentVolume = value
            })
          
          Text('🔊')
            .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
            .margin({ left: GlobalStyles.SIZES.SPACING_MEDIUM })
        }
        .justifyContent(FlexAlign.Center)
        
        Text(`当前音量: ${this.currentVolume}%`)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
          .margin({ top: GlobalStyles.SIZES.SPACING_SMALL })
      }
      .width('100%')
      .padding(GlobalStyles.SIZES.SPACING_LARGE)
      .backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND)
      .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
      .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      // 家长指导
      Column() {
        Text('学习指导')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
        
        Text('1. 听一听：点击喇叭图标，让孩子听单词发音')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_SMALL })
        
        Text('2. 说一说：点击星星图标，让孩子跟读练习')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_SMALL })
        
        Text('3. 写一写：点击画笔图标，让孩子练习书写')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_SMALL })
        
        Text('4. 每天学习15-20分钟，效果最佳')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
      }
      .width('100%')
      .padding(GlobalStyles.SIZES.SPACING_LARGE)
      .backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND)
      .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
      .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      // 返回按钮
      Button('返回首页')
        .width(GlobalStyles.SIZES.BUTTON_LARGE.width)
        .height(GlobalStyles.SIZES.BUTTON_LARGE.height)
        .backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE)
        .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
        .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
        .onClick(() => {
          this.soundEffectManager.playButtonClick()
          console.log('Return button clicked in settings page')
          this.goBack()
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .padding(GlobalStyles.SIZES.SPACING_LARGE)
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 单词卡片页面
  @Builder WordCardPage() {
    Column() {
      // 顶部进度信息
      Row() {
        Text(`${this.getThemeName()} ${this.currentWordIndex + 1}/${this.getThemeWords().length}`)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
        
        Blank()
        
        Text('贴纸：2/5')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.PRIMARY_ORANGE)
      }
      .width('100%')
      .padding({ left: GlobalStyles.SIZES.SPACING_MEDIUM, right: GlobalStyles.SIZES.SPACING_MEDIUM })
      .margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM })
      
      // 主要内容区域
      Column() {
        // 图片区域
        Image(this.getCurrentWordImage())
          .width(GlobalStyles.SIZES.CORE_IMAGE_WIDTH)
          .height(GlobalStyles.SIZES.CORE_IMAGE_HEIGHT)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
        
        // 文字区域
        Column() {
          Text(this.getCurrentWord())
            .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
            .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
            .fontWeight(FontWeight.Bold)
            .margin({ bottom: GlobalStyles.SIZES.SPACING_TINY })
          
          Text(this.getCurrentPronunciation())
            .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
            .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
            .margin({ bottom: GlobalStyles.SIZES.SPACING_TINY })
          
          Text(this.getCurrentChineseMeaning())
            .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
            .fontColor(GlobalStyles.COLORS.PRIMARY_PINK)
            .fontWeight(FontWeight.Bold)
        }
        .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      }
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
      
      // 底部功能按钮
      Row() {
        // 听一听按钮
        Button('听一听')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.playWordSound()
          })
        
        Blank()
        
        // 说一说按钮
        Button('说一说')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_YELLOW)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.startSpeakingPractice()
          })
        
        Blank()
        
        // 写一写按钮
        Button('写一写')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.startWritingPractice()
          })
      }
      .width('100%')
      .padding(GlobalStyles.SIZES.SPACING_MEDIUM)
      .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
      
      // 返回按钮
      Button('返回主题选择')
        .width(GlobalStyles.SIZES.BUTTON_LARGE.width)
        .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
        .backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY)
        .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
        .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
        .onClick(() => {
          this.soundEffectManager.playButtonClick()
          this.goBack()
        })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 说功能页面
  @Builder SpeakingPracticePage() {
    Column() {
      // 顶部信息
      Row() {
        Text(this.getCurrentWord())
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
          .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
        
        Image(this.getCurrentWordImage())
          .width(60)
          .height(60)
          .borderRadius(GlobalStyles.BORDER_RADIUS.SMALL)
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM })
      
      // 麦克风区域
      Column() {
        Text('🎤')
          .fontSize(120)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
        
        Text('请跟读单词')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
          .fontColor(GlobalStyles.COLORS.PRIMARY_PINK)
          .fontWeight(FontWeight.Bold)
      }
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
      
      // 底部按钮
      Row() {
        Button('再试一次')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_YELLOW)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.startSpeakingPractice()
          })
        
        Blank()
        
        Button('返回卡片')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.goBack()
          })
      }
      .width('100%')
      .padding(GlobalStyles.SIZES.SPACING_MEDIUM)
      .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 写功能页面
  @Builder WritingPracticePage() {
    Column() {
      // 顶部信息
      Row() {
        Text(this.getCurrentWord())
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
          .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
        
        Text(this.getCurrentPronunciation())
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM })
      
      // 描红区域
      Column() {
        Text('描红练习')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
          .fontColor(GlobalStyles.COLORS.PRIMARY_GREEN)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
        
        Text('请按照轨迹描红')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
      }
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
      
      // 底部按钮
      Row() {
        Button('单个字母练习')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.startSingleLetterPractice()
          })
        
        Blank()
        
        Button('完成')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_PINK)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.completeWriting()
          })
        
        Blank()
        
        Button('返回卡片')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY)
          .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.goBack()
          })
      }
      .width('100%')
      .padding(GlobalStyles.SIZES.SPACING_MEDIUM)
      .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 进度奖励页面
  @Builder ProgressRewardPage() {
    Column() {
      Text('恭喜解锁新贴纸！')
        .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
        .fontColor(GlobalStyles.COLORS.PRIMARY_ORANGE)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      Text('继续学习更多单词')
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
        .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
        .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      Row() {
        Button('查看全部贴纸')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.currentPage = 'sticker_collection'
          })
        
        Blank()
        
        Button('继续学习')
          .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
          .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN)
          .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.continueLearning()
          })
      }
      .width('100%')
      .padding(GlobalStyles.SIZES.SPACING_MEDIUM)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .padding(GlobalStyles.SIZES.SPACING_LARGE)
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 贴纸收集页面
  @Builder StickerCollectionPage() {
    Column() {
      Button('返回')
        .width(GlobalStyles.SIZES.BUTTON_MEDIUM.width)
        .height(GlobalStyles.SIZES.BUTTON_MEDIUM.height)
        .backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY)
        .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
        .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
        .onClick(() => {
          this.soundEffectManager.playButtonClick()
          this.goBack()
        })
      
      Text('我的贴纸收集册')
        .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
        .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
        .fontWeight(FontWeight.Bold)
        .margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM, bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      Text('已收集 2/20 个贴纸')
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
        .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
        .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      Grid() {
        GridItem() {
          Column() {
            Text('🎉')
              .fontSize(60)
            Text('水果贴纸')
              .fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL)
              .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          }
        }
        
        GridItem() {
          Column() {
            Text('🎉')
              .fontSize(60)
            Text('动物贴纸')
              .fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL)
              .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          }
        }
      }
      .columnsTemplate('1fr 1fr')
      .width('100%')
      .height(200)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .padding(GlobalStyles.SIZES.SPACING_LARGE)
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 休息页面
  @Builder RestBreakPage() {
    Column() {
      Text('休息一下')
        .fontSize(GlobalStyles.FONT_SIZES.TITLE_LARGE)
        .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      Text('保护小眼睛～')
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE)
        .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
        .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      Button('继续学习')
        .width(GlobalStyles.SIZES.BUTTON_LARGE.width)
        .height(GlobalStyles.SIZES.BUTTON_LARGE.height)
        .backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN)
        .fontColor(GlobalStyles.COLORS.TEXT_WHITE)
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
        .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
        .onClick(() => {
          this.soundEffectManager.playButtonClick()
          this.goBack()
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .padding(GlobalStyles.SIZES.SPACING_LARGE)
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }

  // 辅助方法
  getThemeName(): string {
    const theme = this.themes.find(t => t.id === this.currentTheme)
    return theme ? theme.name : '未知主题'
  }

  getThemeWords(): WordData[] {
    return this.learningDataManager.getWordsByTheme(this.currentTheme)
  }

  getCurrentWord(): string {
    const words = this.getThemeWords()
    return words[this.currentWordIndex]?.english || 'Apple'
  }

  getCurrentWordImage(): string {
    const words = this.getThemeWords()
    return words[this.currentWordIndex]?.image || '$rawfile/CardOriginal/Food/Fruit/apple.png'
  }

  getCurrentPronunciation(): string {
    const words = this.getThemeWords()
    return words[this.currentWordIndex]?.pronunciation || '/ˈæpəl/'
  }

  getCurrentChineseMeaning(): string {
    const words = this.getThemeWords()
    return words[this.currentWordIndex]?.chinese || '苹果'
  }

  // 功能方法
  async playWordSound(): Promise<void> {
    await this.soundEffectManager.playWordSound(this.getCurrentWord())
  }

  async playSentence(): Promise<void> {
    await this.soundEffectManager.playSentence(`This is a ${this.getCurrentWord()}`)
  }

  async startSpeakingPractice(): Promise<void> {
    await this.soundEffectManager.playSpeakingStart()
    this.currentPage = 'speaking_practice'
  }

  async startWritingPractice(): Promise<void> {
    await this.soundEffectManager.playWritingStart()
    this.currentPage = 'writing_practice'
  }

  async startSingleLetterPractice(): Promise<void> {
    console.log('开始单个字母练习')
  }

  async completeWriting(): Promise<void> {
    await this.soundEffectManager.playWritingComplete()
    this.currentPage = 'progress_reward'
  }

  async continueLearning(): Promise<void> {
    this.currentWordIndex++
    if (this.currentWordIndex >= this.getThemeWords().length) {
      this.currentWordIndex = 0
      this.currentPage = 'theme_select'
    } else {
      this.currentPage = 'word_card'
    }
  }
}