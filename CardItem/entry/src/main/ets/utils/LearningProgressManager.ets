// 学习进度管理器

import { preferences } from '@kit.ArkData'
import { ThemeType, LearningProgress, StickerData } from '../types/CommonTypes'

export class LearningProgressManager {
  private static instance: LearningProgressManager
  private currentProgress: LearningProgress

  private constructor() {
    this.currentProgress = {
      currentTheme: 'food',
      currentWordIndex: 0,
      totalLearningTime: 0,
      sessionStartTime: 0,
      stickers: [],
      completedThemes: []
    }
  }

  static getInstance(): LearningProgressManager {
    if (!LearningProgressManager.instance) {
      LearningProgressManager.instance = new LearningProgressManager()
    }
    return LearningProgressManager.instance
  }

  // 开始主题学习
  startThemeLearning(theme: ThemeType): void {
    this.currentProgress.currentTheme = theme
    this.currentProgress.currentWordIndex = 0
    this.currentProgress.sessionStartTime = Date.now()
    this.saveProgress()
  }

  // 保存进度
  saveProgress(): void {
    console.log('Saving learning progress:', this.currentProgress)
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
