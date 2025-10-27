// 主页面 - 横屏布局，支持子分类选择

import { LearningDataManager } from '../utils/LearningDataManager'
import { SoundEffectManager } from '../utils/SoundEffectManager'
import { TTSManager } from '../utils/TTSManager'
import { LearningProgressManager } from '../utils/LearningProgressManager'
import { GlobalStyles } from '../styles/GlobalStyles'
import { WordLearningPage } from '../components/WordLearningPage'
import { 
  PageType, 
  ThemeType, 
  ThemeData, 
  SubcategoryData, 
  WordData,
  LearningMode 
} from '../types/CommonTypes'

@Entry
@Component
struct Index {
  @State currentPage: PageType = 'theme_select'
  @State currentTheme: ThemeType = 'food'
  @State currentWordIndex: number = 0
  @State selectedMode: LearningMode = 'listen'
  @State score: number = 0
  @State level: number = 1
  @State showProgress: boolean = false
  @State showDetailPage: boolean = false
  @State selectedWord: WordData | null = null
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
  private subcategories: SubcategoryData[] = []
  private currentSubcategory: SubcategoryData | null = null
  private currentSubcategoryId: string = ''

  aboutToAppear() {
    this.learningDataManager.init()
    this.themes = this.learningDataManager.getThemes()
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

  // 进入子分类选择页面
  enterSubcategorySelect(theme: ThemeType) {
    this.currentTheme = theme
    this.subcategories = this.learningDataManager.getSubcategoriesByTheme(theme)
    this.currentPage = 'subcategory_select'
  }

  // 开始子分类学习
  startSubcategoryLearning(subcategoryId: string) {
    this.currentSubcategoryId = subcategoryId
    const subcategory = this.subcategories.find(s => s.id === subcategoryId)
    if (subcategory) {
      this.currentSubcategory = subcategory
      this.currentWordIndex = 0
      this.currentPage = 'word_card'
      console.log('开始学习子分类:', subcategoryId)
    }
  }

  // 返回上一页
  goBack() {
    console.log(`goBack called, current page: ${this.currentPage}`)
    if (this.currentPage === 'parent_helper') {
      this.currentPage = 'theme_select'
      console.log('Returning to theme_select from parent_helper')
    } else if (this.currentPage === 'subcategory_select') {
      this.currentPage = 'theme_select'
      console.log('Returning to theme_select from subcategory_select')
    } else if (this.currentPage === 'word_card') {
      if (this.currentSubcategory) {
        this.currentPage = 'subcategory_select'
        console.log('Returning to subcategory_select from word_card')
      } else {
        this.currentPage = 'theme_select'
        console.log('Returning to theme_select from word_card')
      }
    } else {
      this.currentPage = 'theme_select'
      console.log('Default return to theme_select')
    }
  }

  // 获取主题名称
  getThemeName(theme: ThemeType): string {
    const themeData = this.themes.find(t => t.id === theme)
    return themeData ? themeData.name : theme
  }

  build() {
    Column() {
      if (this.currentPage === 'theme_select') {
        this.ThemeSelectPage()
      } else if (this.currentPage === 'subcategory_select') {
        this.SubcategorySelectPage()
      } else if (this.currentPage === 'parent_helper') {
        this.ParentHelperPage()
      } else if (this.currentPage === 'word_card') {
        WordLearningPage({
          subcategoryId: this.currentSubcategoryId,
          onBack: () => {
            this.currentPage = 'subcategory_select'
          }
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
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
            this.currentPage = 'parent_helper'
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
      Image($rawfile(theme.icon))
        .width(100)
        .height(100)
        .borderRadius(GlobalStyles.BORDER_RADIUS.SMALL)
        .backgroundColor('#FFFFFF')
        .objectFit(ImageFit.Contain)
        .padding(5)
      
      // 主题名称（包含进度信息）
      Text(`${theme.name}（${theme.completedWords}/${theme.totalWords}）`)
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL)
        .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 8 })
        .textAlign(TextAlign.Center)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .width('100%')
    }
    .width(200)
    .height(190)
    .backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND)
    .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
    .padding({ top: 10, bottom: 10, left: 10, right: 10 })
    .justifyContent(FlexAlign.Center)
    .shadow(GlobalStyles.SHADOWS.MEDIUM)
    .margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM })
    .onClick(() => {
      this.soundEffectManager.playButtonClick()
      this.enterSubcategorySelect(theme.id)
    })
    .animation(GlobalStyles.ANIMATIONS.BUTTON_PRESS)
    .scale({ x: 1, y: 1 })
  }

  // 子分类选择页面
  @Builder SubcategorySelectPage() {
    Column() {
      // 顶部区域 - 标题和返回按钮
      Row() {
        Button('←')
          .width(60)
          .height(60)
          .backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY)
          .fontSize(24)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.goBack()
          })
        
        Text(`${this.getThemeName(this.currentTheme)} - 选择子分类`)
          .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
          .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
          .fontWeight(FontWeight.Bold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .padding({ left: GlobalStyles.SIZES.SPACING_LARGE, right: GlobalStyles.SIZES.SPACING_LARGE, top: GlobalStyles.SIZES.SPACING_MEDIUM })
      .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
      
      // 子分类卡片容器 - 支持左右滑动
      Scroll() {
        Row() {
          ForEach(this.subcategories, (subcategory: SubcategoryData, index: number) => {
            this.SubcategoryCard(subcategory, index)
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

  // 子分类卡片
  @Builder SubcategoryCard(subcategory: SubcategoryData, index: number) {
    Column() {
      // 子分类图标
      Image($rawfile(subcategory.icon))
        .width(100)
        .height(100)
        .borderRadius(GlobalStyles.BORDER_RADIUS.SMALL)
        .backgroundColor('#FFFFFF')
        .objectFit(ImageFit.Contain)
        .padding(5)
      
      // 子分类名称（包含进度信息）
      Text(`${subcategory.name}（${subcategory.completedWords}/${subcategory.totalWords}）`)
        .fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL)
        .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 8 })
        .textAlign(TextAlign.Center)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .width('100%')
    }
    .width(200)
    .height(190)
    .backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND)
    .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
    .padding({ top: 10, bottom: 10, left: 10, right: 10 })
    .justifyContent(FlexAlign.Center)
    .shadow(GlobalStyles.SHADOWS.MEDIUM)
    .margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM })
    .onClick(() => {
      this.soundEffectManager.playButtonClick()
      this.startSubcategoryLearning(subcategory.id)
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
        .margin({ top: GlobalStyles.SIZES.SPACING_LARGE, bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      // 音量控制
      Row() {
        Text('音量')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
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
        
        Text(`${this.currentVolume}%`)
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL)
          .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
          .margin({ left: GlobalStyles.SIZES.SPACING_MEDIUM })
      }
      .justifyContent(FlexAlign.Center)
      .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
      
      // 返回按钮
      Button('返回首页')
        .width(200)
        .height(50)
        .backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE)
        .fontColor(Color.White)
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
    .justifyContent(FlexAlign.Center)
  }

  // 单词卡片页面（简化版本）
  @Builder WordCardPage() {
    Column() {
      // 顶部区域
      Row() {
        Button('←')
          .width(60)
          .height(60)
          .backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY)
          .fontSize(24)
          .borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM)
          .onClick(() => {
            this.soundEffectManager.playButtonClick()
            this.goBack()
          })
        
        Text(this.currentSubcategory ? this.currentSubcategory.name : this.getThemeName(this.currentTheme))
          .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
          .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
          .fontWeight(FontWeight.Bold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .padding({ left: GlobalStyles.SIZES.SPACING_LARGE, right: GlobalStyles.SIZES.SPACING_LARGE, top: GlobalStyles.SIZES.SPACING_MEDIUM })
      .margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM })
      
      // 内容区域
      Column() {
        Text('单词学习页面')
          .fontSize(GlobalStyles.FONT_SIZES.TITLE_LARGE)
          .fontColor(GlobalStyles.COLORS.TEXT_PRIMARY)
          .margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE })
        
        Text('这里将显示单词卡片内容')
          .fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM)
          .fontColor(GlobalStyles.COLORS.TEXT_SECONDARY)
      }
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(GlobalStyles.COLORS.BACKGROUND)
  }
}
