// 主页面 - 横屏布局，支持子分类选择

import { LearningDataManager } from '../utils/LearningDataManager'
import { SoundEffectManager } from '../utils/SoundEffectManager'
import { TTSManager } from '../utils/TTSManager'
import { LearningProgressManager } from '../utils/LearningProgressManager'
import { GlobalStyles } from '../styles/GlobalStyles'
import { WordLearningPage } from '../components/WordLearningPage'
import { ChallengePage } from '../components/ChallengePage'
import { 
  PageType, 
  ThemeType, 
  ThemeData, 
  SubcategoryData, 
  WordData,
  LearningMode 
} from '../types/CommonTypes'
import promptAction from '@ohos.promptAction'

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
  @State showChallenge: boolean = false
  @State showSettingsDialog: boolean = false
  @State showPrivacyPage: boolean = false
  @State showReportDialog: boolean = false
  @State selectedWord: WordData | null = null
  @State isImageHidden: boolean = false
  @State volumeVisible: boolean = false
  @State currentVolume: number = 50
  
  // 卡片点击效果状态
  @State clickedThemeIndex: number = -1
  @State clickedSubcategoryIndex: number = -1
  @State cardScale: number = 1
  @State cardOpacity: number = 1

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
    // 学习进度会自动保存，无需手动调用
    console.log('学习进度已自动保存')
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

  // 获取随机边框颜色
  getRandomBorderColor(index: number): string {
    const colors = [
      '#FF6B6B', // 红色
      '#4ECDC4', // 青色
      '#45B7D1', // 蓝色
      '#96CEB4', // 绿色
      '#FFEAA7', // 黄色
      '#DDA0DD', // 紫色
      '#FFB347', // 橙色
      '#87CEEB', // 天蓝色
      '#F0E68C', // 卡其色
      '#FFA07A', // 浅鲑鱼色
      '#98FB98', // 浅绿色
      '#F5DEB3', // 小麦色
      '#D8BFD8', // 蓟色
      '#FFE4E1', // 雾玫瑰色
      '#E0FFFF'  // 浅青色
    ]
    return colors[index % colors.length]
  }

  // 显示链接提示
  private showUrlPrompt(url: string) {
    promptAction.showToast({
      message: `请在浏览器中输入：${url}`,
      duration: 3000
    })
  }

  // 检查子分类是否完成
  isSubcategoryCompleted(subcategoryId: string): boolean {
    const completion = this.learningProgressManager.getSubcategoryCompletion(subcategoryId)
    return completion?.isCompleted === true
  }

  // 检查主题是否完成
  isThemeCompleted(themeId: string): boolean {
    const completion = this.learningProgressManager.getThemeCompletion(themeId)
    return completion?.isCompleted === true
  }

  // 卡片点击效果
  private async playCardClickEffect(cardType: 'theme' | 'subcategory', index: number) {
    if (cardType === 'theme') {
      this.clickedThemeIndex = index
    } else {
      this.clickedSubcategoryIndex = index
    }
    
    // 变大效果
    this.cardScale = 1.15
    this.cardOpacity = 0.6
    
    // 增强闪动效果 - 更明显的闪烁
    setTimeout(() => {
      this.cardOpacity = 1
    }, 80)
    
    setTimeout(() => {
      this.cardOpacity = 0.5
    }, 160)
    
    setTimeout(() => {
      this.cardOpacity = 1
    }, 240)
    
    setTimeout(() => {
      this.cardOpacity = 0.7
    }, 320)
    
    setTimeout(() => {
      this.cardOpacity = 1
    }, 400)
    
    // 恢复原始大小
    setTimeout(() => {
      this.cardScale = 1
      if (cardType === 'theme') {
        this.clickedThemeIndex = -1
      } else {
        this.clickedSubcategoryIndex = -1
      }
    }, 600)
  }

  build() {
    Column() {
      if (this.showChallenge) {
        ChallengePage({
          theme: this.currentTheme,
          onBack: () => {
            this.showChallenge = false
          }
        })
      } else if (this.currentPage === 'theme_select') {
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
  }

  // 主题选择页（横屏布局，左右滑动）
  @Builder ThemeSelectPage() {
    Stack() {
      // 背景图片
      Image($rawfile('bg1.png'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .opacity(0.6)
        .expandSafeArea()
      
      // 主内容
      Column() {
        // 顶部区域 - 标题和功能按钮
        Row() {
          Text('选择学习主题')
            .fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM)
            .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
            .fontWeight(FontWeight.Bold)
            .layoutWeight(1)
          
          // 挑战模式按钮（按当前选择的主题进入挑战页面）
          Button('挑战模式')
            .width(120)
            .height(40)
            .backgroundColor(GlobalStyles.COLORS.PRIMARY_ORANGE)
            .fontSize(18)
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bold)
            .borderRadius(25)
            .onClick(() => {
              this.soundEffectManager.playButtonClick()
              console.log('挑战模式按钮点击，进入挑战页面，主题:', this.currentTheme)
              this.showChallenge = true
            })

          // 设置按钮
          Button('设置')
            .width(100)
            .height(40)
            .backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE)
            .fontSize(18)
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bold)
            .borderRadius(25)
            .margin({ left: 10 })
            .onClick(() => {
              this.soundEffectManager.playButtonClick()
              this.showSettingsDialog = true
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
        .scrollBar(BarState.Off)
        .padding({ left: GlobalStyles.SIZES.SPACING_LARGE + 10, right: GlobalStyles.SIZES.SPACING_LARGE })
      }
      .width('100%')
      .height('100%')

      // 设置页面（全屏）
      if (this.showSettingsDialog) {
        Column() {
          // 顶部导航栏
          Row() {
            Button('←')
              .width(50)
              .height(50)
              .fontSize(24)
              .fontColor('#FFFFFF')
              .backgroundColor(Color.Transparent)
              .onClick(() => {
                this.soundEffectManager.playButtonClick()
                this.showSettingsDialog = false
              })
            
            Text('设置')
              .fontSize(22)
              .fontColor('#FFFFFF')
              .fontWeight(FontWeight.Bold)
              .layoutWeight(1)
              .textAlign(TextAlign.Center)
            
            Blank().width(50)
          }
          .width('100%')
          .padding({ left: 20, right: 20, top: 10, bottom: 10 })
          .backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE)

          // 功能按钮区域（两枚方块按钮，左右排列）
          Column() {
            Blank().height(40)

            Row() {
              // 儿童隐私协议 方块按钮（正方形）
              Column() {
                Text('📄')
                  .fontSize(34)
                  .margin({ bottom: 8 })
                Text('儿童隐私协议')
                  .fontSize(16)
                  .fontColor('#333333')
                  .textAlign(TextAlign.Center)
              }
              .width(150)
              .height(150)
              .backgroundColor('#E3F2FD')
              .borderRadius(16)
              .border({ width: 2, color: GlobalStyles.COLORS.PRIMARY_BLUE, style: BorderStyle.Solid })
              .justifyContent(FlexAlign.Center)
              .onClick(() => {
                this.soundEffectManager.playButtonClick()
                this.showPrivacyPage = true
                this.showSettingsDialog = false
              })

              Blank().width(40)

              // 举报与投诉 方块按钮（正方形）
              Column() {
                Text('📮')
                  .fontSize(34)
                  .margin({ bottom: 8 })
                Text('举报与投诉')
                  .fontSize(16)
                  .fontColor('#333333')
                  .textAlign(TextAlign.Center)
              }
              .width(150)
              .height(150)
              .backgroundColor('#FFEBEE')
              .borderRadius(16)
              .border({ width: 2, color: '#FF6B6B', style: BorderStyle.Solid })
              .justifyContent(FlexAlign.Center)
              .onClick(() => {
                this.soundEffectManager.playButtonClick()
                this.showReportDialog = true
                this.showSettingsDialog = false
              })
            }
            .width('100%')
            .padding({ left: 60, right: 20 })

            Blank().height(40)
          }
          .width('100%')
          .layoutWeight(1)
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#F5F5F5')
        .expandSafeArea()
      }

      // 隐私协议页面（全屏）
      if (this.showPrivacyPage) {
        Stack() {
          Column() {
            // 顶部导航栏
            Row() {
              Button('←')
                .width(50)
                .height(50)
                .fontSize(24)
                .fontColor('#333333')
                .backgroundColor(Color.Transparent)
                .onClick(() => {
                  this.soundEffectManager.playButtonClick()
                  this.showPrivacyPage = false
                  this.showSettingsDialog = true
                })
              
              Text('儿童隐私协议')
                .fontSize(20)
                .fontColor('#333333')
                .fontWeight(FontWeight.Bold)
                .layoutWeight(1)
                .textAlign(TextAlign.Center)
              
              Blank().width(50)
            }
            .width('100%')
            .padding({ left: 30, right: 20, top: 10, bottom: 10 })
            .backgroundColor('#FFFFFF')

            Divider()
              .color('#E0E0E0')
              .strokeWidth(1)

            // 内容区域
            Scroll() {
              Column() {
                Text('儿童隐私保护声明')
                  .fontSize(24)
                  .fontColor('#333333')
                  .fontWeight(FontWeight.Bold)
                  .margin({ top: 20, bottom: 20 })

                Text('我们高度重视未成年人个人信息保护。为了帮助您了解我们如何收集、使用和保护儿童的个人信息，请您仔细阅读本隐私保护声明。')
                  .fontSize(16)
                  .fontColor('#555555')
                  .lineHeight(24)
                  .margin({ bottom: 20 })
                  .width('100%')

                Text('查看完整隐私协议')
                  .fontSize(18)
                  .fontColor('#666666')
                  .margin({ bottom: 10 })
                  .width('100%')

                // 链接区域
                Row() {
                  Text('🔗')
                    .fontSize(20)
                    .margin({ right: 8 })
                  
                  Text('https://lanmin.github.io/BabyStudyEnglishPrivacy.html')
                    .fontSize(16)
                    .fontColor(GlobalStyles.COLORS.PRIMARY_BLUE)
                    .decoration({ type: TextDecorationType.Underline })
                    .layoutWeight(1)
                }
                .width('100%')
                .padding({ left: 16, right: 16, top: 12, bottom: 12 })
                .backgroundColor('#F0F8FF')
                .borderRadius(8)
                .border({
                  width: 1,
                  color: GlobalStyles.COLORS.PRIMARY_BLUE,
                  style: BorderStyle.Solid
                })
                .margin({ bottom: 20 })
                .onClick(() => {
                  this.soundEffectManager.playButtonClick()
                  this.showUrlPrompt('https://lanmin.github.io/BabyStudyEnglishPrivacy.html')
                })

                Text('您可以通过点击上方链接在浏览器中查看完整的《儿童隐私保护声明》，了解我们如何处理儿童的个人信息、您的权利以及如何联系我们。')
                  .fontSize(16)
                  .fontColor('#555555')
                  .lineHeight(24)
                  .margin({ bottom: 20 })
                  .width('100%')

                Text('如有任何疑问或需要帮助，请发送邮件至：394743521@qq.com')
                  .fontSize(16)
                  .fontColor('#555555')
                  .lineHeight(24)
                  .margin({ bottom: 40 })
                  .width('100%')
              }
              .width('100%')
            .padding({ left: 40, right: 30, bottom: 20 })
            }
            .layoutWeight(1)
            .scrollBar(BarState.Auto)
          }
          .width('100%')
          .height('100%')
          .backgroundColor('#FFFFFF')
          .expandSafeArea()
        }
        .width('100%')
        .height('100%')
        .expandSafeArea()
      }

      // 举报与投诉页面（全屏）
      if (this.showReportDialog) {
        Column() {
          // 顶部导航栏
          Row() {
            Button('←')
              .width(50)
              .height(50)
              .fontSize(24)
              .fontColor('#FFFFFF')
              .backgroundColor(Color.Transparent)
              .onClick(() => {
                this.soundEffectManager.playButtonClick()
                this.showReportDialog = false
                this.showSettingsDialog = true
              })
            
            Text('举报与投诉')
              .fontSize(22)
              .fontColor('#FFFFFF')
              .fontWeight(FontWeight.Bold)
              .layoutWeight(1)
              .textAlign(TextAlign.Center)
            
            Blank().width(50)
          }
          .width('100%')
          .padding({ left: 20, right: 20, top: 10, bottom: 10 })
          .backgroundColor('#FF6B6B')

          // 内容区域
          Scroll() {
            Column() {
              Blank().height(40)

              // 说明卡片
              Column() {
                Text('📢')
                  .fontSize(48)
                  .margin({ bottom: 16 })

                Text('举报与投诉')
                  .fontSize(24)
                  .fontColor('#333333')
                  .fontWeight(FontWeight.Bold)
                  .margin({ bottom: 12 })

                Text('我们高度重视未成年人保护。')
                  .fontSize(18)
                  .fontColor('#666666')
                  .fontWeight(FontWeight.Medium)
                  .margin({ bottom: 8 })

                Text('若您认为应用内容或功能不当，或涉及未成年人权益受侵害，欢迎通过以下方式与我们联系：')
                  .fontSize(16)
                  .fontColor('#555555')
                  .lineHeight(24)
                  .margin({ bottom: 20 })
              }
              .width('100%')
              .padding(24)
              .backgroundColor('#FFFFFF')
              .borderRadius(16)
              .margin({ left: 30, right: 30, bottom: 20 })
              .shadow({ radius: 8, color: '#00000010', offsetX: 0, offsetY: 2 })

              // 联系方式卡片
              Column() {
                Text('📧')
                  .fontSize(40)
                  .margin({ bottom: 12 })

                Text('联系方式')
                  .fontSize(20)
                  .fontColor('#333333')
                  .fontWeight(FontWeight.Bold)
                  .margin({ bottom: 16 })

                Row() {
                  Text('邮箱：')
                    .fontSize(18)
                    .fontColor('#555555')
                  
                  Text('394743521@qq.com')
                    .fontSize(18)
                    .fontColor('#FF6B6B')
                    .fontWeight(FontWeight.Bold)
                }
                .width('100%')
                .justifyContent(FlexAlign.Center)
                .padding(16)
                .backgroundColor('#FFEBEE')
                .borderRadius(12)
                .margin({ bottom: 12 })

                Text('我们将及时受理并处理您的投诉与举报，尽快予以反馈。')
                  .fontSize(16)
                  .fontColor('#666666')
                  .lineHeight(22)
                  .margin({ bottom: 8 })

                Text('依据相关规范（8.14），我们提供便捷、合理、有效的投诉和举报渠道。')
                  .fontSize(16)
                  .fontColor('#666666')
                  .lineHeight(22)
              }
              .width('100%')
              .padding(24)
              .backgroundColor('#FFFFFF')
              .borderRadius(16)
              .margin({ left: 30, right: 30, bottom: 20 })
              .shadow({ radius: 8, color: '#00000010', offsetX: 0, offsetY: 2 })

              // 返回按钮
              Button('返回')
                .width('90%')
                .height(50)
                .backgroundColor('#FF6B6B')
                .fontSize(18)
                .fontColor(Color.White)
                .fontWeight(FontWeight.Bold)
                .borderRadius(25)
                .margin({ left: 30, right: 30, bottom: 20 })
                .onClick(() => {
                  this.soundEffectManager.playButtonClick()
                  this.showReportDialog = false
                  this.showSettingsDialog = true
                })
            }
            .width('100%')
            .padding({ top: 10 })
          }
          .layoutWeight(1)
          .scrollBar(BarState.Auto)
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#FFF5F5')
        .expandSafeArea()
      }
    }
    .width('100%')
    .height('100%')
    .expandSafeArea()
  }

  // 主题卡片
  @Builder ThemeCard(theme: ThemeData, index: number) {
    Stack() {
      Column() {
        // 主题图标
        Image($rawfile(theme.icon))
          .width(100)
          .height(100)
          .borderRadius(GlobalStyles.BORDER_RADIUS.SMALL)
          .backgroundColor('#FFFFFF')
          .objectFit(ImageFit.Contain)
          .padding(5)
        
        // 主题名称
        Text(theme.name)
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
      .border({
        width: this.clickedThemeIndex === index ? 8 : 4,
        color: this.clickedThemeIndex === index ? '#FF6B6B' : this.getRandomBorderColor(index),
        style: BorderStyle.Solid
      })
      .padding({ top: 10, bottom: 10, left: 10, right: 10 })
      .justifyContent(FlexAlign.Center)
      .shadow(GlobalStyles.SHADOWS.MEDIUM)
      .margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM })
      .onClick(() => {
        this.soundEffectManager.playButtonClick()
        this.playCardClickEffect('theme', index)
        // 延迟执行导航，让动画先播放
        setTimeout(() => {
          this.enterSubcategorySelect(theme.id)
        }, 300)
      })
      .scale({ 
        x: this.clickedThemeIndex === index ? this.cardScale : 1, 
        y: this.clickedThemeIndex === index ? this.cardScale : 1 
      })
      .opacity(this.clickedThemeIndex === index ? this.cardOpacity : 1)
      .animation({ duration: 200, curve: Curve.EaseInOut })

      // 完成状态对勾 - 已隐藏
      // if (this.isThemeCompleted(theme.id)) {
      //   Text('✓')
      //     .fontSize(30)
      //     .fontColor('#52C41A')
      //     .fontWeight(FontWeight.Bold)
      //     .backgroundColor('#FFFFFF')
      //     .borderRadius(20)
      //     .width(40)
      //     .height(40)
      //     .textAlign(TextAlign.Center)
      //     .position({ x: 160, y: 10 })
      //     .shadow({
      //       radius: 5,
      //       color: '#00000020',
      //       offsetX: 0,
      //       offsetY: 2
      //     })
      // }
    }
  }

  // 子分类选择页面
  @Builder SubcategorySelectPage() {
    Stack() {
      // 背景图片
      Image($rawfile('bg2.png'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .opacity(0.6)
        .expandSafeArea()
      
      // 主内容
      Column() {
        // 顶部区域 - 标题和返回按钮
        Row() {
          Button('←')
            .fontSize(22)
            .fontColor(Color.Black)
            .backgroundColor(Color.Transparent)
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
        .scrollBar(BarState.Off)
        .padding({ left: GlobalStyles.SIZES.SPACING_LARGE + 10, right: GlobalStyles.SIZES.SPACING_LARGE })
      }
      .width('100%')
      .height('100%')
    }
    .width('100%')
    .height('100%')
    .expandSafeArea()
  }

  // 子分类卡片
  @Builder SubcategoryCard(subcategory: SubcategoryData, index: number) {
    Stack() {
      Column() {
        // 子分类图标
        Image($rawfile(subcategory.icon))
          .width(100)
          .height(100)
          .borderRadius(GlobalStyles.BORDER_RADIUS.SMALL)
          .backgroundColor('#FFFFFF')
          .objectFit(ImageFit.Contain)
          .padding(5)
        
        // 子分类名称
        Text(subcategory.name)
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
      .border({
        width: this.clickedSubcategoryIndex === index ? 6 : 2,
        color: this.clickedSubcategoryIndex === index ? '#FF6B6B' : this.getRandomBorderColor(index),
        style: BorderStyle.Solid
      })
      .padding({ top: 10, bottom: 10, left: 10, right: 10 })
      .justifyContent(FlexAlign.Center)
      .shadow(GlobalStyles.SHADOWS.MEDIUM)
      .margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM })
      .onClick(() => {
        this.soundEffectManager.playButtonClick()
        this.playCardClickEffect('subcategory', index)
        // 延迟执行导航，让动画先播放
        setTimeout(() => {
          this.startSubcategoryLearning(subcategory.id)
        }, 300)
      })
      .scale({ 
        x: this.clickedSubcategoryIndex === index ? this.cardScale : 1, 
        y: this.clickedSubcategoryIndex === index ? this.cardScale : 1 
      })
      .opacity(this.clickedSubcategoryIndex === index ? this.cardOpacity : 1)
      .animation({ duration: 200, curve: Curve.EaseInOut })

      // 完成状态对勾 - 已隐藏
      // if (this.isSubcategoryCompleted(subcategory.id)) {
      //   Text('✓')
      //     .fontSize(30)
      //     .fontColor('#52C41A')
      //     .fontWeight(FontWeight.Bold)
      //     .backgroundColor('#FFFFFF')
      //     .borderRadius(20)
      //     .width(40)
      //     .height(40)
      //     .textAlign(TextAlign.Center)
      //     .position({ x: 160, y: 10 })
      //     .shadow({
      //       radius: 5,
      //       color: '#00000020',
      //       offsetX: 0,
      //       offsetY: 2
      //     })
      // }
    }
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
    .expandSafeArea()
  }
}
