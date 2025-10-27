// 通用类型定义

// 主题类型
export type ThemeType = 
  | 'food' 
  | 'animals' 
  | 'daily_items'
  | 'body_parts'
  | 'colors_shapes'
  | 'vehicles'
  | 'family'
  | 'actions'
  | 'places'
  | 'nature'
  | 'clothing'
  | 'toys'

// 页面类型 - 重新规划，移除启动页
export type PageType = 
  | 'theme_select'     // 主题选择页（首页）
  | 'subcategory_select' // 子分类选择页
  | 'parent_helper'    // 家长助手页面
  | 'word_card'        // 单词卡片主页面
  | 'speaking_practice' // 跟读打分页面
  | 'writing_practice'  // 描红涂鸦页面
  | 'progress_reward'   // 进度奖励页面
  | 'sticker_collection' // 贴纸收集册页面
  | 'rest_break'        // 休息提示页面

// 学习模式
export type LearningMode = 'listen' | 'speak' | 'read' | 'write'

// 单词数据接口
export interface WordData {
  id: string
  english: string
  chinese: string
  pronunciation: string
  image: string
  category: string
  subcategory: string
}

// 主题数据接口
export interface ThemeData {
  id: ThemeType
  name: string
  icon: string
  color: string
  totalWords: number
  completedWords: number
  isUnlocked: boolean
}

// 子分类数据接口
export interface SubcategoryData {
  id: string
  name: string
  icon: string
  color: string
  themeId: ThemeType
  totalWords: number
  completedWords: number
  isUnlocked: boolean
}

// 学习进度接口
export interface LearningProgress {
  currentTheme: ThemeType
  currentWordIndex: number
  totalLearningTime: number
  sessionStartTime: number
  stickers: StickerData[]
  completedThemes: ThemeType[]
}

// 贴纸数据接口
export interface StickerData {
  id: string
  name: string
  image: string
  theme: ThemeType
  isUnlocked: boolean
}