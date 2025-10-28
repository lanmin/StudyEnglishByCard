// 学习进度管理器

import { preferences } from '@kit.ArkData'
import { ThemeType, LearningProgress, StickerData } from '../types/CommonTypes'

// 单词完成状态
interface WordCompletion {
  wordId: string
  completedModes: string[] // ['listen', 'speak', 'read', 'write']
  isCompleted: boolean
}

// 子分类完成状态
interface SubcategoryCompletion {
  subcategoryId: string
  completedWords: string[]
  isCompleted: boolean
}

// 主题完成状态
interface ThemeCompletion {
  themeId: string
  completedSubcategories: string[]
  isCompleted: boolean
}

export class LearningProgressManager {
  private static instance: LearningProgressManager
  private currentProgress: LearningProgress
  private wordCompletions: Map<string, WordCompletion> = new Map()
  private subcategoryCompletions: Map<string, SubcategoryCompletion> = new Map()
  private themeCompletions: Map<string, ThemeCompletion> = new Map()

  private constructor() {
    this.currentProgress = {
      currentTheme: 'food',
      currentWordIndex: 0,
      totalLearningTime: 0,
      sessionStartTime: 0,
      stickers: [],
      completedThemes: []
    }
    this.loadProgress()
  }

  static getInstance(): LearningProgressManager {
    if (!LearningProgressManager.instance) {
      LearningProgressManager.instance = new LearningProgressManager()
    }
    return LearningProgressManager.instance
  }

  // 加载进度
  private async loadProgress(): Promise<void> {
    try {
      const dataPreferences = await preferences.getPreferences(getContext(), 'learning_progress')
      
      // 加载单词完成状态
      const wordCompletionsStr = await dataPreferences.get('wordCompletions', '{}') as string
      const wordCompletionsData = JSON.parse(wordCompletionsStr) as Record<string, WordCompletion>
      this.wordCompletions = new Map(Object.entries(wordCompletionsData))
      
      // 加载子分类完成状态
      const subcategoryCompletionsStr = await dataPreferences.get('subcategoryCompletions', '{}') as string
      const subcategoryCompletionsData = JSON.parse(subcategoryCompletionsStr) as Record<string, SubcategoryCompletion>
      this.subcategoryCompletions = new Map(Object.entries(subcategoryCompletionsData))
      
      // 加载主题完成状态
      const themeCompletionsStr = await dataPreferences.get('themeCompletions', '{}') as string
      const themeCompletionsData = JSON.parse(themeCompletionsStr) as Record<string, ThemeCompletion>
      this.themeCompletions = new Map(Object.entries(themeCompletionsData))
      
      console.log('学习进度加载完成')
    } catch (error) {
      console.error('加载学习进度失败:', error)
    }
  }

  // 保存进度
  private async saveProgress(): Promise<void> {
    try {
      const dataPreferences = await preferences.getPreferences(getContext(), 'learning_progress')
      
      // 保存单词完成状态
      const wordCompletionsData: Record<string, WordCompletion> = {}
      this.wordCompletions.forEach((value, key) => {
        wordCompletionsData[key] = value
      })
      await dataPreferences.put('wordCompletions', JSON.stringify(wordCompletionsData))
      
      // 保存子分类完成状态
      const subcategoryCompletionsData: Record<string, SubcategoryCompletion> = {}
      this.subcategoryCompletions.forEach((value, key) => {
        subcategoryCompletionsData[key] = value
      })
      await dataPreferences.put('subcategoryCompletions', JSON.stringify(subcategoryCompletionsData))
      
      // 保存主题完成状态
      const themeCompletionsData: Record<string, ThemeCompletion> = {}
      this.themeCompletions.forEach((value, key) => {
        themeCompletionsData[key] = value
      })
      await dataPreferences.put('themeCompletions', JSON.stringify(themeCompletionsData))
      
      await dataPreferences.flush()
      console.log('学习进度保存完成')
    } catch (error) {
      console.error('保存学习进度失败:', error)
    }
  }

  // 更新单词完成状态
  updateWordCompletion(wordId: string, completedModes: string[]): void {
    const isCompleted = completedModes.length === 4 // 4个模式都完成
    
    this.wordCompletions.set(wordId, {
      wordId,
      completedModes,
      isCompleted
    })
    
    this.saveProgress()
    console.log(`单词 ${wordId} 完成状态更新:`, completedModes)
  }

  // 获取单词完成状态
  getWordCompletion(wordId: string): WordCompletion | undefined {
    return this.wordCompletions.get(wordId)
  }

  // 检查子分类是否完成
  checkSubcategoryCompletion(subcategoryId: string, allWordIds: string[]): boolean {
    const completedWords = allWordIds.filter(wordId => {
      const completion = this.wordCompletions.get(wordId)
      return completion?.isCompleted === true
    })
    
    const isCompleted = completedWords.length === allWordIds.length
    
    this.subcategoryCompletions.set(subcategoryId, {
      subcategoryId,
      completedWords,
      isCompleted
    })
    
    this.saveProgress()
    return isCompleted
  }

  // 获取子分类完成状态
  getSubcategoryCompletion(subcategoryId: string): SubcategoryCompletion | undefined {
    return this.subcategoryCompletions.get(subcategoryId)
  }

  // 检查主题是否完成
  checkThemeCompletion(themeId: string, allSubcategoryIds: string[]): boolean {
    const completedSubcategories = allSubcategoryIds.filter(subcategoryId => {
      const completion = this.subcategoryCompletions.get(subcategoryId)
      return completion?.isCompleted === true
    })
    
    const isCompleted = completedSubcategories.length === allSubcategoryIds.length
    
    this.themeCompletions.set(themeId, {
      themeId,
      completedSubcategories,
      isCompleted
    })
    
    this.saveProgress()
    return isCompleted
  }

  // 获取主题完成状态
  getThemeCompletion(themeId: string): ThemeCompletion | undefined {
    return this.themeCompletions.get(themeId)
  }

  // 开始主题学习
  startThemeLearning(theme: ThemeType): void {
    this.currentProgress.currentTheme = theme
    this.currentProgress.currentWordIndex = 0
    this.currentProgress.sessionStartTime = Date.now()
    this.saveProgress()
  }

  // 获取当前进度
  getCurrentProgress(): LearningProgress {
    return this.currentProgress
  }

  // 更新单词索引
  updateWordIndex(index: number): void {
    this.currentProgress.currentWordIndex = index
    this.saveProgress()
  }

  // 添加贴纸
  addSticker(stickerId: string): void {
    const sticker: StickerData = {
      id: stickerId,
      name: `Sticker ${stickerId}`,
      image: `$rawfile/stickers/${stickerId}.png`,
      theme: this.currentProgress.currentTheme,
      isUnlocked: true
    }
    
    if (!this.currentProgress.stickers.find(s => s.id === stickerId)) {
      this.currentProgress.stickers.push(sticker)
      this.saveProgress()
    }
  }

  // 完成主题
  completeTheme(theme: ThemeType): void {
    if (!this.currentProgress.completedThemes.includes(theme)) {
      this.currentProgress.completedThemes.push(theme)
      this.saveProgress()
    }
  }
}
