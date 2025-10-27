// 学习进度管理器

import { LearningProgress, ThemeType, StickerData } from '../types/CommonTypes'

// 主题进度接口定义
interface ThemeProgress {
  completedWords: number
  totalWords: number
}

export class LearningProgressManager {
  private static instance: LearningProgressManager
  private currentProgress: LearningProgress = {
    currentTheme: 'food',
    currentWordIndex: 0,
    totalLearningTime: 0,
    sessionStartTime: 0,
    stickers: [],
    completedThemes: []
  }

  private constructor() {}

  static getInstance(): LearningProgressManager {
    if (!LearningProgressManager.instance) {
      LearningProgressManager.instance = new LearningProgressManager()
    }
    return LearningProgressManager.instance
  }

  // 初始化
  async init(): Promise<void> {
    console.log('学习进度管理器初始化完成')
  }

  // 加载进度
  loadProgress(): LearningProgress {
    return this.currentProgress
  }

  // 保存进度
  saveProgress(): void {
    console.log('保存学习进度')
  }

  // 开始主题学习
  startThemeLearning(theme: ThemeType): void {
    this.currentProgress.currentTheme = theme
    this.currentProgress.currentWordIndex = 0
    this.currentProgress.sessionStartTime = Date.now()
    console.log(`开始学习主题: ${theme}`)
  }

  // 完成单词学习
  completeWord(): void {
    this.currentProgress.currentWordIndex++
    console.log(`完成单词学习，当前进度: ${this.currentProgress.currentWordIndex}`)
  }

  // 解锁贴纸
  unlockSticker(stickerId: string): void {
    const sticker: StickerData = {
      id: stickerId,
      name: '新贴纸',
      image: '$rawfile/CardOriginal/stickers/sticker.png',
      theme: this.currentProgress.currentTheme,
      isUnlocked: true
    }
    this.currentProgress.stickers.push(sticker)
    console.log(`解锁贴纸: ${stickerId}`)
  }

  // 获取主题进度
  getThemeProgress(theme: ThemeType): ThemeProgress {
    return {
      completedWords: this.currentProgress.currentWordIndex,
      totalWords: 5
    }
  }

  // 获取用户等级
  getUserLevel(): number {
    return Math.floor(this.currentProgress.totalLearningTime / 3600000) + 1 // 每小时1级
  }

  // 获取用户等级名称
  getUserLevelName(): string {
    const level = this.getUserLevel()
    const levelNames = ['初学者', '小达人', '英语高手', '学习之星', '英语大师']
    return levelNames[Math.min(level - 1, levelNames.length - 1)]
  }

  // 获取已解锁贴纸数量
  getUnlockedStickersCount(): number {
    return this.currentProgress.stickers.length
  }

  // 获取总贴纸数量
  getTotalStickersCount(): number {
    return 20 // 假设总共有20个贴纸
  }
}