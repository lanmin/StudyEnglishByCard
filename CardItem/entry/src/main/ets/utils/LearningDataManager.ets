// 学习数据管理器

import { WordData, ThemeData, ThemeType } from '../types/CommonTypes'

export class LearningDataManager {
  private static instance: LearningDataManager
  private words: WordData[] = []

  private constructor() {}

  static getInstance(): LearningDataManager {
    if (!LearningDataManager.instance) {
      LearningDataManager.instance = new LearningDataManager()
    }
    return LearningDataManager.instance
  }

  // 初始化数据
  init(): void {
    this.words = this.loadWords()
  }

  // 加载单词数据
  private loadWords(): WordData[] {
    return [
      // 水果类
      {
        id: 'apple',
        english: 'Apple',
        chinese: '苹果',
        pronunciation: '/ˈæpəl/',
        image: '$rawfile/CardOriginal/Food/Fruit/apple.png',
        category: 'Food',
        subcategory: 'Fruit'
      },
      {
        id: 'banana',
        english: 'Banana',
        chinese: '香蕉',
        pronunciation: '/bəˈnɑːnə/',
        image: '$rawfile/CardOriginal/Food/Fruit/banana.png',
        category: 'Food',
        subcategory: 'Fruit'
      },
      {
        id: 'orange',
        english: 'Orange',
        chinese: '橙子',
        pronunciation: '/ˈɔːrɪndʒ/',
        image: '$rawfile/CardOriginal/Food/Fruit/orange.png',
        category: 'Food',
        subcategory: 'Fruit'
      },
      {
        id: 'grape',
        english: 'Grape',
        chinese: '葡萄',
        pronunciation: '/ɡreɪp/',
        image: '$rawfile/CardOriginal/Food/Fruit/grape.png',
        category: 'Food',
        subcategory: 'Fruit'
      },
      {
        id: 'strawberry',
        english: 'Strawberry',
        chinese: '草莓',
        pronunciation: '/ˈstrɔːberi/',
        image: '$rawfile/CardOriginal/Food/Fruit/strawberry.png',
        category: 'Food',
        subcategory: 'Fruit'
      },
      // 动物类
      {
        id: 'dog',
        english: 'Dog',
        chinese: '狗',
        pronunciation: '/dɔːɡ/',
        image: '$rawfile/CardOriginal/Animals/Pet/Dog.png',
        category: 'Animals',
        subcategory: 'Pet'
      },
      {
        id: 'cat',
        english: 'Cat',
        chinese: '猫',
        pronunciation: '/kæt/',
        image: '$rawfile/CardOriginal/Animals/Pet/Cat.png',
        category: 'Animals',
        subcategory: 'Pet'
      },
      {
        id: 'bird',
        english: 'Bird',
        chinese: '鸟',
        pronunciation: '/bɜːrd/',
        image: '$rawfile/CardOriginal/Animals/Pet/Bird.png',
        category: 'Animals',
        subcategory: 'Pet'
      },
      {
        id: 'fish',
        english: 'Fish',
        chinese: '鱼',
        pronunciation: '/fɪʃ/',
        image: '$rawfile/CardOriginal/Animals/Aquatic Animals/Fish.png',
        category: 'Animals',
        subcategory: 'Aquatic Animals'
      },
      {
        id: 'rabbit',
        english: 'Rabbit',
        chinese: '兔子',
        pronunciation: '/ˈræbɪt/',
        image: '$rawfile/CardOriginal/Animals/Pet/Rabbit.png',
        category: 'Animals',
        subcategory: 'Pet'
      }
    ]
  }

  // 获取主题数据
  getThemes(): ThemeData[] {
    return [
      {
        id: 'fruits',
        name: '水果',
        icon: '$rawfile/CardOriginal/Food/Fruit/apple.png',
        color: '#FF3366',
        totalWords: 5,
        completedWords: 0,
        isUnlocked: true
      },
      {
        id: 'animals',
        name: '动物',
        icon: '$rawfile/CardOriginal/Animals/Pet/Dog.png',
        color: '#3399FF',
        totalWords: 5,
        completedWords: 0,
        isUnlocked: true
      },
      {
        id: 'vehicles',
        name: '交通',
        icon: '$rawfile/CardOriginal/Vehicles/car.png',
        color: '#FF9900',
        totalWords: 5,
        completedWords: 0,
        isUnlocked: true
      },
      {
        id: 'body_parts',
        name: '身体',
        icon: '$rawfile/CardOriginal/Body/eye.png',
        color: '#33CC33',
        totalWords: 5,
        completedWords: 0,
        isUnlocked: true
      }
    ]
  }

  // 根据主题获取单词
  getWordsByTheme(theme: ThemeType): WordData[] {
    const themeMap: Record<ThemeType, string> = {
      'fruits': 'Food',
      'animals': 'Animals',
      'vehicles': 'Vehicles',
      'body_parts': 'Body'
    }
    
    const category = themeMap[theme]
    return this.words.filter(word => word.category === category)
  }

  // 获取图片资源
  getImageResource(imagePath: string): string {
    return imagePath
  }
}
