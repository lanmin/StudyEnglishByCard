// 学习数据管理器

import { ThemeType, WordData, SubcategoryData, ThemeData } from '../types/CommonTypes'

// 资源管理器同步读取类型（避免在断言中直接使用对象字面量类型）
interface ResourceManagerSync {
  getRawFileContentSync(path: string): Uint8Array | ArrayBuffer
}

// 多语言结构体
interface MultiLanguageText {
  english: string
  chinese: string
  japanese: string
}

// 单词数据结构
interface WordDataStructure {
  id: string
  languages: MultiLanguageText
  subcategory: string
  image: string
  pronunciation: string
}

// 子分类数据结构
interface SubcategoryDataStructure {
  id: string
  languages: MultiLanguageText
  themeId: string
  words: WordDataStructure[]
}

// 主题数据结构
interface ThemeDataStructure {
  id: string
  languages: MultiLanguageText
  subcategories: SubcategoryDataStructure[]
}

// 解析结果接口
interface ThemeParseResult {
  id: string
  languages: MultiLanguageText
}

interface SubcategoryParseResult {
  languages: MultiLanguageText
}

interface WordParseResult {
  languages: MultiLanguageText
}

export class LearningDataManager {
  private static instance: LearningDataManager
  
  // 12个主题的数据数组
  private foodData: ThemeDataStructure = { id: 'food', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private animalsData: ThemeDataStructure = { id: 'animals', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private dailyItemsData: ThemeDataStructure = { id: 'daily_items', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private bodyPartsData: ThemeDataStructure = { id: 'body_parts', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private colorsShapesData: ThemeDataStructure = { id: 'colors_shapes', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private vehiclesData: ThemeDataStructure = { id: 'vehicles', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private familyData: ThemeDataStructure = { id: 'family', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private actionsData: ThemeDataStructure = { id: 'actions', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private placesData: ThemeDataStructure = { id: 'places', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private natureData: ThemeDataStructure = { id: 'nature', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private clothingData: ThemeDataStructure = { id: 'clothing', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  private toysData: ThemeDataStructure = { id: 'toys', languages: { english: '', chinese: '', japanese: '' }, subcategories: [] }
  
  // 兼容性数据
  private words: WordData[] = []
  private themes: ThemeData[] = []
  private subcategories: SubcategoryData[] = []
  
  // 外部提供的 cardInfo 文本（从 rawfile 读取后注入）
  private externalCardInfo: string = ''

  private constructor() {
    this.parseCardInfoFile()
    this.convertToCompatibilityData()
    this.debugPrintAllSubcategories()
  }

  // 允许外部传入最新的 cardInfo 文本后立即重新解析（不生成虚拟子类）
  public reloadWithExternalCardInfo(content: string): void {
    this.externalCardInfo = content
    this.parseCardInfoFile()
    this.convertToCompatibilityData()
  }

  // 解析cardInfo.txt文件到12个主题数组（严格依赖 @@@ 子类，不生成虚拟子类）
  private parseCardInfoFile(): void {
    // 先清空所有主题的子分类数组
    this.clearAllSubcategories()
    
    // 优先使用外部注入的内容，否则使用内置字符串
    let content = this.externalCardInfo && this.externalCardInfo.length > 0
      ? this.externalCardInfo
      : this.readCardInfoFile()
    // 移除 BOM，兼容不同换行符
    content = content.replace(/^\uFEFF/, '')
    const lines = content.split(/\r?\n/)
    
    let currentTheme: ThemeDataStructure | null = null
    let currentSubcategory: SubcategoryDataStructure | null = null
    
    let subcategoryLineCount: number = 0
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // 解析主题 (### 开头)
      if (/^###/.test(trimmedLine)) {
        const themeInfo = this.parseThemeLine(trimmedLine)
        if (themeInfo) {
          currentTheme = this.getThemeDataById(themeInfo.id)
          if (currentTheme) {
            currentTheme.languages = themeInfo.languages
            // 清空当前主题的子分类数组
            currentTheme.subcategories = []
          }
        }
        currentSubcategory = null
      }
      // 解析子分类 (@@@ 开头)
      else if (/^@@@/.test(trimmedLine)) {
        const subcategoryInfo = this.parseSubcategoryLine(trimmedLine)
        if (subcategoryInfo && currentTheme) {
          currentSubcategory = {
            id: `${currentTheme.id}_${subcategoryInfo.languages.chinese.toLowerCase().replace(/[&、]/g, '_')}`,
            languages: subcategoryInfo.languages,
            themeId: currentTheme.id,
            words: []
          }
          currentTheme.subcategories.push(currentSubcategory)
          console.log(`Added subcategory: ${subcategoryInfo.languages.chinese} to theme: ${currentTheme.id}`)
          subcategoryLineCount++
        }
      }
      // 解析单词 (普通行) - 必须已经有子分类才能添加单词
      else if (trimmedLine && !trimmedLine.startsWith('#') && currentSubcategory && currentTheme) {
        const wordInfo = this.parseWordLine(trimmedLine)
        if (wordInfo) {
          const wordId = wordInfo.languages.english.toLowerCase()
          const wordData: WordDataStructure = {
            id: wordId,
            languages: wordInfo.languages,
            subcategory: currentSubcategory.languages.chinese,
            image: this.getImagePath(currentTheme.id, currentSubcategory.languages.chinese, wordId),
            pronunciation: this.generatePronunciation(wordInfo.languages.english)
          }
          currentSubcategory.words.push(wordData)
          console.log(`添加单词: ${wordInfo.languages.english} -> 图片路径: ${wordData.image}`)
        }
      }
    }

    // 解析结束后打印概要，便于核对
    console.log(`本次解析检测到子分类行数(以@@@开头)：${subcategoryLineCount}`)
    this.debugPrintParsedSummary()
  }

  // 调试输出：打印解析到的主题与子分类摘要
  private debugPrintParsedSummary(): void {
    const allThemes: ThemeDataStructure[] = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]

    console.log('=== 解析结果概览 ===')
    allThemes.forEach((theme: ThemeDataStructure) => {
      const themeNameCn: string = theme.languages.chinese
      const subCount: number = theme.subcategories.length
      console.log(`[主题] ${theme.id} | ${themeNameCn} | 子分类数=${subCount}`)
      theme.subcategories.forEach((sub: SubcategoryDataStructure) => {
        console.log(`  - [子类] ${sub.languages.chinese} (${sub.languages.english}) | 单词数=${sub.words.length}`)
      })
    })
    console.log('=== 解析结果结束 ===')
  }

  // 解析主题行
  private parseThemeLine(line: string): ThemeParseResult | null {
    const content = line.startsWith('###') ? line.replace(/^###\s*/, '') : line
    const parts = content.split(/｜|\|/)
    
    if (parts.length >= 2) {
      const chinesePart = parts[0].trim()
      const englishPart = parts[1].trim()
      const japanesePart = parts.length >= 3 ? parts[2].trim() : ''
      
      // 提取中文名称（移除序号和数量）
      const chineseName = chinesePart.replace(/^[一二三四五六七八九十]+、/, '').replace(/（\d+个）/, '')
      
      // 生成主题ID
      const themeId = this.generateThemeId(chineseName)
      
      const result: ThemeParseResult = {
        id: themeId,
        languages: {
          english: englishPart.replace(/（\d+）/, ''),
          chinese: chineseName,
          japanese: japanesePart.replace(/（\d+）/, '')
        }
      }
      return result
    }
    return null
  }

  // 解析子分类行
  private parseSubcategoryLine(line: string): SubcategoryParseResult | null {
    const content = line.startsWith('@@@') ? line.replace(/^@@@\s*/, '') : line
    const parts = content.split(/｜|\|/)
    
    if (parts.length >= 2) {
      const result: SubcategoryParseResult = {
        languages: {
          english: parts[1].trim(),
          chinese: parts[0].trim(),
          japanese: parts.length >= 3 ? parts[2].trim() : ''
        }
      }
      return result
    }
    return null
  }

  // 解析单词行
  private parseWordLine(line: string): WordParseResult | null {
    const parts = line.split(/｜|\|/)
    
    if (parts.length >= 2) {
      const result: WordParseResult = {
        languages: {
          english: parts[0].trim(),
          chinese: parts[1].trim(),
          japanese: parts.length >= 3 ? parts[2].trim() : ''
        }
      }
      return result
    }
    return null
  }

  // 根据ID获取主题数据
  private getThemeDataById(id: string): ThemeDataStructure | null {
    const themeMap: Record<string, ThemeDataStructure> = {
      'food': this.foodData,
      'animals': this.animalsData,
      'daily_items': this.dailyItemsData,
      'body_parts': this.bodyPartsData,
      'colors_shapes': this.colorsShapesData,
      'vehicles': this.vehiclesData,
      'family': this.familyData,
      'actions': this.actionsData,
      'places': this.placesData,
      'nature': this.natureData,
      'clothing': this.clothingData,
      'toys': this.toysData
    }
    
    return themeMap[id] || null
  }

  // 生成主题ID
  private generateThemeId(chineseName: string): string {
    const themeIdMap: Record<string, string> = {
      '食物类': 'food',
      '动物类': 'animals',
      '日常物品类': 'daily_items',
      '身体部位类': 'body_parts',
      '颜色&形状类': 'colors_shapes',
      '交通工具类': 'vehicles',
      '家庭成员&称呼类': 'family',
      '动作类': 'actions',
      '场所类': 'places',
      '自然事物类': 'nature',
      '服饰类': 'clothing',
      '玩具类': 'toys'
    }
    
    return themeIdMap[chineseName] || 'unknown'
  }

  // 生成发音
  private generatePronunciation(english: string): string {
    // 简单的发音生成，实际项目中可以使用更复杂的算法
    return english.toLowerCase()
  }

  // 清空所有主题的子分类数组
  private clearAllSubcategories(): void {
    const allThemes = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]
    
    allThemes.forEach(theme => {
      theme.subcategories = []
    })
  }

  static getInstance(): LearningDataManager {
    if (!LearningDataManager.instance) {
      LearningDataManager.instance = new LearningDataManager()
    }
    return LearningDataManager.instance
  }

  // 初始化数据
  init(): void {
    this.parseCardInfoFile()
    this.convertToCompatibilityData()
  }

  // 转换为兼容性数据格式
  private convertToCompatibilityData(): void {
    this.convertThemes()
    this.convertSubcategories()
    this.convertWords()
  }

  // 转换主题数据
  private convertThemes(): void {
    const allThemes = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]

    this.themes = allThemes.map(theme => {
      let totalWords: number
      
      if (theme.subcategories.length > 1) {
        // 如果有多个子分类，totalWords显示子分类的数量
        totalWords = theme.subcategories.length
        console.log(`主题 ${theme.languages.chinese}: 子分类数=${totalWords}`)
      } else {
        // 如果只有1个子分类或没有子分类，totalWords显示单词数量
        totalWords = this.getTotalWordsForTheme(theme)
        if (theme.subcategories.length === 1) {
          console.log(`主题 ${theme.languages.chinese}: 1个子分类，单词数=${totalWords}`)
        } else {
          console.log(`主题 ${theme.languages.chinese}: 无子分类，单词数=${totalWords}`)
        }
      }
      
      const themeData: ThemeData = {
        id: theme.id as ThemeType,
        name: theme.languages.chinese,
        icon: this.generateIconPath(theme.id),
        color: this.generateThemeColor(this.getThemeIndex(theme.id)),
        totalWords: totalWords,
        completedWords: 0,
        isUnlocked: true
      }
      return themeData
    })
  }

  // 转换子分类数据
  private convertSubcategories(): void {
    const allThemes = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]

    this.subcategories = []
    allThemes.forEach(theme => {
      console.log(`Converting theme: ${theme.id}, subcategories count: ${theme.subcategories.length}`)
      theme.subcategories.forEach(subcategory => {
        console.log(`Converting subcategory: ${subcategory.languages.chinese}, 单词数: ${subcategory.words.length}`)
        this.subcategories.push({
          id: subcategory.id,
          name: subcategory.languages.chinese,
          icon: this.generateSubcategoryIconPath(theme.id, subcategory.languages.chinese),
          color: this.generateSubcategoryColor(theme.id),
          themeId: theme.id as ThemeType,
          totalWords: subcategory.words.length,
          completedWords: 0,
          isUnlocked: true
        })
      })
    })
    console.log(`Total subcategories converted: ${this.subcategories.length}`)
  }

  // 转换单词数据
  private convertWords(): void {
    const allThemes = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]

    this.words = []
    allThemes.forEach(theme => {
      theme.subcategories.forEach(subcategory => {
        subcategory.words.forEach(word => {
          const wordData: WordData = {
            id: word.id,
            english: word.languages.english,
            chinese: word.languages.chinese,
            category: theme.id,
            subcategory: subcategory.languages.chinese,
            image: word.image,
            pronunciation: word.pronunciation
          }
          this.words.push(wordData)
          console.log(`转换单词: ${word.languages.english} -> 图片: ${word.image}`)
        })
      })
    })
  }

  // 获取主题索引
  private getThemeIndex(themeId: string): number {
    const themeOrder = ['food', 'animals', 'daily_items', 'body_parts', 'colors_shapes', 
                       'vehicles', 'family', 'actions', 'places', 'nature', 'clothing', 'toys']
    return themeOrder.indexOf(themeId)
  }

  // 获取主题总单词数
  private getTotalWordsForTheme(theme: ThemeDataStructure): number {
    return theme.subcategories.reduce((total, subcategory) => total + subcategory.words.length, 0)
  }

  // 读取cardInfo.txt文件内容
  private readCardInfoFile(): string {
    // 优先从 rawfile 读取（以 txt 为准）；失败时回退内置
    try {
      const rm = getContext().resourceManager as ResourceManagerSync
      const content = rm.getRawFileContentSync('words/cardInfo.txt') as Uint8Array | ArrayBuffer
      const bytes = content instanceof Uint8Array ? content : new Uint8Array(content)
      const text = this.utf8Decode(bytes)
      if (text && text.length > 0) {
        return text
      }
    } catch (e) {
      console.warn('读取 rawfile/words/cardInfo.txt 失败，使用内置内容')
    }
    // TODO: 改为从实际文件读取，目前使用硬编码
    return `### 一、食物类（100个）｜Food（100）｜食べ物（たべもの）
@@@ 水果｜Fruit｜果物（くだもの）
Apple｜苹果｜りんご（ringo）
Banana｜香蕉｜バナナ（banana）
Orange｜橙子｜オレンジ（orenji）
Pear｜梨｜梨（なし）
Grape｜葡萄｜ぶどう（budou）
Watermelon｜西瓜｜スイカ（suika）
Strawberry｜草莓｜いちご（ichigo）
Mango｜芒果｜マンゴー（mangou）
Pineapple｜菠萝｜パイナップル（painappuru）
Peach｜桃子｜桃（もも）
Cherry｜樱桃｜さくらんぼ（sakuranbo）
Lemon｜柠檬｜レモン（remon）
Kiwi｜猕猴桃｜キウイ（kiui）
Blueberry｜蓝莓｜ブルーベリー
Raspberry｜树莓｜ラズベリー
Apricot｜杏｜アンズ
Plum｜李子｜梅（うめ）
Pomegranate｜石榴｜ザクロ
Coconut｜椰子｜ココナッツ
Lychee｜荔枝｜ライチ
@@@ 蔬菜｜Vegetables｜野菜（やさい）
Carrot｜胡萝卜｜人参（にんじん，ninjin）
Tomato｜番茄｜トマト（tomato）
Onion｜洋葱｜玉ねぎ（たまねぎ，tamanegi）
Potato｜土豆｜ジャガイモ（jagaimo）
Cabbage｜卷心菜｜キャベツ（kyabetsu）
Spinach｜菠菜｜ほうれん草
Broccoli｜西兰花｜ブロッコリー
Cauliflower｜花椰菜｜カリフラワー
Cucumber｜黄瓜｜キュウリ
Pumpkin｜南瓜｜カボチャ
Corn｜玉米｜トウモロコシ
Peas｜豌豆｜エンドウ豆
Beans｜豆角｜四季豆
Lettuce｜生菜｜レタス
Eggplant｜茄子｜ナス
Pepper｜辣椒｜唐辛子
Garlic｜大蒜｜にんにく
Ginger｜姜｜しょうが
Radish｜萝卜｜大根
Celery｜芹菜｜セロリー
@@@ 主食｜Staple Foods｜主食（しゅしょく）
Rice｜米饭｜ご飯（ごはん，gohan）
Bread｜面包｜パン（pan）
Noodle｜面条｜うどん
Pasta｜意面｜パスタ
Cake｜蛋糕｜ケーキ
Biscuit｜饼干｜ビスケット
Cookie｜曲奇｜クッキー
Pie｜派｜パイ
Pancake｜煎饼｜パンケーキ
Oatmeal｜燕麦｜オートミール
Porridge｜粥｜おかゆ
Sandwich｜三明治｜サンドイッチ
Hamburger｜汉堡｜ハンバーガー
Pizza｜披萨｜ピザ
Dumpling｜饺子｜餃子
Bun｜包子｜饅頭
Rice cake｜米糕｜お餅
Toast｜吐司｜トースト
Waffle｜华夫饼｜ワッフル
Muffin｜玛芬｜マフィン
@@@ 零食和其他食物｜Snacks_Other Foods｜スナック＆その他の食べ物
Candy｜糖果｜キャンディー
Chocolate｜巧克力｜チョコレート
Cheese｜奶酪｜チーズ
Milk｜牛奶｜牛乳
Yogurt｜酸奶｜ヨーグルト
Juice｜果汁｜ジュース
Soda｜汽水｜サイダー
Ice cream｜冰淇淋｜アイスクリーム
Popcorn｜爆米花｜ポップコーン
Chips｜薯片｜チップス
Nut｜坚果｜ナッツ
Jam｜果酱｜ジャム
Honey｜蜂蜜｜はちみつ
Butter｜黄油｜バター
Egg｜鸡蛋｜卵
Chicken｜鸡肉｜鶏肉
Beef｜牛肉｜牛肉
Pork｜猪肉｜豚肉
Fish｜鱼肉｜魚肉
Shrimp｜虾｜エビ

### 二、动物类（100个）｜Animals（100）｜動物（どうぶつ）
@@@ 宠物｜Pets｜ペット（petto）
Dog｜狗｜犬
Cat｜猫｜猫
Rabbit｜兔子｜ウサギ
Hamster｜仓鼠｜ハムスター
Guinea pig｜豚鼠｜モルモット
Parrot｜鹦鹉｜オウム
Goldfish｜金鱼｜金魚
Turtle｜乌龟｜カメ
Bird｜鸟｜鳥
Kitten｜小猫｜子猫
Puppy｜小狗｜子犬
@@@ 农场动物｜Farm Animals｜農場の動物
Cow｜奶牛｜牛
Horse｜马｜馬
Pig｜猪｜豚
Sheep｜绵羊｜羊
Goat｜山羊｜山羊
Chicken｜鸡｜鶏
Duck｜鸭｜アヒル
Goose｜鹅｜ガチョウ
Turkey｜火鸡｜七面鳥
Donkey｜驴｜ロバ
Mule｜骡子｜ラバ
Rooster｜公鸡｜雄鶏
Hen｜母鸡｜雌鶏
Lamb｜小羊｜子羊
Calf｜小牛｜子牛
Foal｜小马｜子馬
Piglet｜小猪｜子豚
Duckling｜小鸭｜アヒルの子
Gosling｜小鹅｜ガチョウの子
Chick｜小鸡｜ひよこ
@@@ 动物园动物｜Zoo Animals｜動物園の動物
Tiger｜老虎｜虎
Lion｜狮子｜ライオン
Elephant｜大象｜象
Giraffe｜长颈鹿｜キリン
Monkey｜猴子｜猿
Panda｜熊猫｜パンダ
Bear｜熊｜熊
Zebra｜斑马｜シマウマ
Hippo｜河马｜カバ
Rhino｜犀牛｜サイ
Crocodile｜鳄鱼｜ワニ
Snake｜蛇｜ヘビ
Kangaroo｜袋鼠｜カンガルー
Koala｜考拉｜コアラ
Penguin｜企鹅｜ペンギン
Owl｜猫头鹰｜フクロウ
Fox｜狐狸｜キツネ
Wolf｜狼｜オオカミ
Deer｜鹿｜シカ
Leopard｜豹子｜ヒョウ
@@@ 水生动物｜Aquatic Animals｜水生動物
Fish｜鱼｜魚
Shark｜鲨鱼｜サメ
Dolphin｜海豚｜イルカ
Whale｜鲸鱼｜クジラ
Turtle｜海龟｜海亀
Octopus｜章鱼｜タコ
Crab｜螃蟹｜カニ
Shrimp｜虾｜エビ
Starfish｜海星｜ヒトデ
Clam｜蛤蜊｜蛤
Oyster｜牡蛎｜カキ
Jellyfish｜水母｜クラゲ
Seahorse｜海马｜タツノオトシゴ
Lobster｜龙虾｜ロブスター
Eel｜鳗鱼｜ウナギ
Seal｜海豹｜アザラシ
Walrus｜海象｜セイウチ
Otter｜水獭｜カワウソ
Ray｜鳐鱼｜エイ
Minnow｜小鱼｜メダカ
@@@ 昆虫&小型动物｜Insects & Small Animals｜昆虫＆小型動物
Ant｜蚂蚁｜アリ
Bee｜蜜蜂｜ミツバチ
Butterfly｜蝴蝶｜チョウ
Dragonfly｜蜻蜓｜トンボ
Ladybug｜瓢虫｜テントウムシ
Spider｜蜘蛛｜クモ
Worm｜虫子｜ミミズ
Snail｜蜗牛｜カタツムリ
Cricket｜蟋蟀｜コオロギ
Grasshopper｜蚂蚱｜バッタ
Mosquito｜蚊子｜モスキート
Fly｜苍蝇｜ハエ
Moth｜飞蛾｜ガ
Caterpillar｜毛毛虫｜イモムシ
Beetle｜甲虫｜カブトムシ
Centipede｜蜈蚣｜ムカデ
Millipede｜千足虫｜ヤナギムシ
Louse｜虱子｜ハジラミ
Tick｜蜱虫｜ダニ
Flea｜跳蚤｜ノミ

### 三、日常物品类（100个）｜Daily Items（100）｜日常用品（にちじょうようひん）
@@@ 厨房用品｜Kitchen Supplies｜キッチン用品
Plate｜盘子｜お皿
Bowl｜碗｜お椀
Spoon｜勺子｜スプーン
Fork｜叉子｜フォーク
Knife｜刀｜ナイフ
Cup｜杯子｜コップ
Glass｜玻璃杯｜グラス
Mug｜马克杯｜マグカップ
Pot｜锅｜鍋
Pan｜平底锅｜フライパン
Kettle｜水壶｜ケトル
Spatula｜锅铲｜ヘラ
Ladle｜汤勺｜おたま
Cutting board｜砧板｜まな板
Dish｜餐具｜食器
Tray｜托盘｜トレイ
Jar｜罐子｜ジャー
Can｜罐头｜缶
Container｜容器｜容器
Napkin｜餐巾纸｜ナプキン
@@@ 卧室用品｜Bedroom Supplies｜寝室用品
Bed｜床｜ベッド
Pillow｜枕头｜枕
Blanket｜毯子｜毛布
Quilt｜被子｜布団
Sheet｜床单｜シーツ
Pillowcase｜枕套｜枕カバー
Mattress｜床垫｜マットレス
Bedside table｜床头柜｜ベッドサイドテーブル
Lamp｜台灯｜卓上ランプ
Alarm clock｜闹钟｜目覚まし時計
Teddy bear｜泰迪熊｜テディベア
Doll｜玩偶｜人形
Pajamas｜睡衣｜パジャマ
Slippers｜拖鞋｜スリッパ
Comb｜梳子｜櫛
Brush｜刷子｜ブラシ
Mirror｜镜子｜鏡
Towel｜毛巾｜タオル
Soap｜肥皂｜石鹸
Toothbrush｜牙刷｜歯ブラシ
@@@ 客厅用品｜Living Room Supplies｜リビング用品
Sofa｜沙发｜ソファ
Chair｜椅子｜椅子
Table｜桌子｜テーブル
Carpet｜地毯｜カーペット
Rug｜小地毯｜ラグ
Curtain｜窗帘｜カーテン
Lamp｜落地灯｜スタンドランプ
TV｜电视｜テレビ
Remote｜遥控器｜リモコン
Cushion｜靠垫｜クッション
Book｜书｜本
Magazine｜杂志｜雑誌
Newspaper｜报纸｜新聞
Vase｜花瓶｜花瓶
Picture frame｜相框｜額縁
Clock｜时钟｜時計
Fan｜风扇｜扇風機
Air conditioner｜空调｜エアコン
Phone｜手机｜携帯電話
Speaker｜音箱｜スピーカー
@@@ 洗漱用品｜Toiletries｜トイレタリー
Toothpaste｜牙膏｜歯磨き粉
Toothbrush｜牙刷｜歯ブラシ
Soap｜香皂｜石鹸
Shampoo｜洗发水｜シャンプー
Conditioner｜护发素｜コンディショナー
Towel｜毛巾｜タオル
Washcloth｜洗脸巾｜洗顔タオル
Comb｜梳子｜櫛
Brush｜刷子｜ブラシ
Mirror｜镜子｜鏡
Razor｜剃须刀｜カミソリ
Lotion｜乳液｜化粧水
Cream｜面霜｜クリーム
Perfume｜香水｜香水
Tissue｜纸巾｜ティッシュ
Cotton swab｜棉签｜綿棒
Bath tub｜浴缸｜バスタブ
Shower｜淋浴｜シャワー
Soap dish｜肥皂盒｜石鹸皿
Toothcup｜牙杯｜歯みがきカップ
@@@ 其他日常物品｜Other Daily Items｜その他の日常用品
Bag｜包｜バッグ
Backpack｜书包｜リュックサック
Wallet｜钱包｜財布
Key｜钥匙｜鍵
Umbrella｜雨伞｜傘
Hat｜帽子｜帽子
Scarf｜围巾｜マフラー
Gloves｜手套｜手袋
Watch｜手表｜時計
Pen｜钢笔｜ペン
Pencil｜铅笔｜鉛筆
Eraser｜橡皮｜消しゴム
Ruler｜尺子｜定規
Notebook｜笔记本｜ノート
Paper｜纸｜紙
Crayon｜蜡笔｜クレヨン
Marker｜马克笔｜マーカー
Scissors｜剪刀｜ハサミ
Tape｜胶带｜テープ
Stapler｜订书机｜ホッチキス

### 四、身体部位类（50个）｜Body Parts（50）｜体の部分
@@@ 头部｜Head｜頭部
Head｜头｜頭
Hair｜头发｜髪
Face｜脸｜顔
Eye｜眼睛｜目
Ear｜耳朵｜耳
Nose｜鼻子｜鼻
Mouth｜嘴｜口
Lip｜嘴唇｜唇
Tooth｜牙齿｜歯
Tongue｜舌头｜舌
Cheek｜脸颊｜頬
Chin｜下巴｜顎
Forehead｜额头｜額
Eyebrow｜眉毛｜眉
Eyelash｜睫毛｜まつ毛
Eyelid｜眼皮｜まぶた
@@@ 四肢｜Limbs｜四肢
Arm｜胳膊｜腕
Hand｜手｜手
Finger｜手指｜指
Thumb｜拇指｜親指
Wrist｜手腕｜手首
Elbow｜手肘｜肘
Shoulder｜肩膀｜肩
Leg｜腿｜脚
Foot｜脚｜足
Toe｜脚趾｜足の指
Knee｜膝盖｜膝
Ankle｜脚踝｜足首
Hip｜臀部｜腰
@@@ 躯干｜Torso｜胴体
Body｜身体｜体
Chest｜胸部｜胸
Back｜背部｜背中
Stomach｜肚子｜お腹
Waist｜腰｜腰
Neck｜脖子｜首
Skin｜皮肤｜皮膚
Bone｜骨头｜骨
@@@ 其他｜Others｜その他
Nail｜指甲｜爪
Muscle｜肌肉｜筋肉
Blood｜血液｜血液
Heart｜心脏｜心臓
Lung｜肺｜肺
Brain｜大脑｜脳
Teeth｜牙齿（复数）｜歯
Throat｜喉咙｜喉

### 五、颜色&形状类（50个）｜Colors & Shapes（50）｜色と形
@@@ 颜色｜Colors｜色
Red｜红色｜赤
Blue｜蓝色｜青
Yellow｜黄色｜黄色
Green｜绿色｜緑
Orange｜橙色｜オレンジ色
Purple｜紫色｜紫
Pink｜粉色｜ピンク
Black｜黑色｜黒
White｜白色｜白
Gray｜灰色｜灰色
Brown｜棕色｜茶色
Beige｜米色｜ベージュ
Gold｜金色｜金色
Silver｜银色｜銀色
Indigo｜靛蓝｜藍色
Violet｜紫罗兰色｜バイオレット
Cyan｜青色｜シアン
Magenta｜品红｜マゼンタ
Lavender｜淡紫｜ラベンダー色
Turquoise｜青绿色｜ターコイズ
Maroon｜深红｜栗色
Navy｜藏青｜紺色
Olive｜橄榄绿｜オリーブ色
Teal｜蓝绿｜ティール
Coral｜珊瑚色｜サンゴ色
Peach｜桃色｜桃色
Lemon｜柠檬黄｜レモン色
Lime｜酸橙绿｜ライム色
Sky blue｜天蓝｜空色
Forest green｜森林绿｜森の緑
@@@ 形状｜Shapes｜形
Circle｜圆形｜円
Square｜正方形｜四角形
Triangle｜三角形｜三角形
Rectangle｜长方形｜長方形
Oval｜椭圆形｜楕円形
Star｜星形｜星型
Heart｜心形｜ハート形
Diamond｜菱形｜菱形
Pentagon｜五边形｜五角形
Hexagon｜六边形｜六角形
Octagon｜八边形｜八角形
Sphere｜球体｜球体
Cube｜立方体｜立方体
Cylinder｜圆柱体｜円柱
Cone｜圆锥体｜円錐
Pyramid｜金字塔形｜角錐
Semicircle｜半圆｜半円
Crescent｜月牙形｜三日月形
Cross｜十字形｜十字形
Line｜直线｜直線

### 六、交通工具类（31个）｜Transportation（31）｜交通機関
@@@ 陆地｜Land｜陸上
Car｜汽车｜車
Bus｜公交车｜バス
Truck｜卡车｜トラック
Taxi｜出租车｜タクシー
Bike｜自行车｜自転車
Motorcycle｜摩托车｜バイク
Scooter｜滑板车｜スクーター
Train｜火车｜電車
Subway｜地铁｜地下鉄
Tram｜电车｜路面電車
Van｜厢式车｜バン
Jeep｜吉普车｜ジープ
Tractor｜拖拉机｜トラクター
Roller skates｜轮滑鞋｜ローラースケート
Skateboard｜滑板｜スケートボード
Wheelchair｜轮椅｜車椅子
Stroller｜婴儿车｜ベビーカー
Cart｜手推车｜カート
Bicycle｜自行车｜自転車
Scooter｜踏板车｜スクーター
@@@ 水上｜Water｜水上
Boat｜小船｜ボート
Ship｜轮船｜船
Yacht｜游艇｜ヨット
Canoe｜独木舟｜カヌー
Kayak｜皮划艇｜カヤック
Ferry｜渡轮｜フェリー
Submarine｜潜艇｜潜水艦
@@@ 空中｜Air｜空中
Plane｜飞机｜飛行機
Helicopter｜直升机｜ヘリコプター
Hot air balloon｜热气球｜熱気球
Drone｜无人机｜ドローン

### 七、家庭成员&称呼类（20个）｜Family Members and Titles（20）｜家族
@@@ 家庭成员｜Family Members｜家族
Mom｜妈妈｜母
Dad｜爸爸｜父
Brother｜哥哥/弟弟｜兄弟
Sister｜姐姐/妹妹｜姉妹
Baby｜宝宝｜赤ちゃん
Grandpa｜爷爷/外公｜お爺さん
Grandma｜奶奶/外婆｜お婆さん
Uncle｜叔叔/舅舅｜おじさん
Aunt｜阿姨/姑姑｜おばさん
Cousin｜堂/表兄弟姐妹｜いとこ
Son｜儿子｜息子
Daughter｜女儿｜娘
Nephew｜侄子｜甥
Niece｜侄女｜姪
Husband｜丈夫｜夫
Wife｜妻子｜妻
Mommy｜妈咪｜マミー
Daddy｜爹地｜ダディー
Grandpa｜祖父｜祖父
Grandma｜祖母｜祖母

### 八、动作类（50个）｜Actions（50）｜動作
@@@ 日常动作｜Daily Actions｜日常の動作
Eat｜吃｜食べる
Drink｜喝｜飲む
Sleep｜睡｜寝る
Walk｜走｜歩く
Run｜跑｜走る
Jump｜跳｜跳ぶ
Hop｜单脚跳｜跳ねる
Skip｜蹦跳｜跳び跳ねる
Climb｜爬｜登る
Crawl｜爬｜這う
Sit｜坐｜座る
Stand｜站｜立つ
Lie｜躺｜横たわる
Kneel｜跪｜跪く
Bend｜弯腰｜曲げる
@@@ 感官动作｜Sensory Actions｜感覚の動作
See｜看｜見る
Hear｜听｜聞く
Smell｜闻｜嗅ぐ
Taste｜尝｜味わう
Touch｜摸｜触る
@@@ 互动动作｜Interactive Actions｜インタラクティブな動作
Talk｜说｜話す
Sing｜唱｜歌う
Dance｜跳｜踊る
Play｜玩｜遊ぶ
Laugh｜笑｜笑う
Cry｜哭｜泣く
Hug｜抱｜抱きしめる
Kiss｜亲｜キスする
Share｜分享｜分ける
Help｜帮助｜助ける
@@@ 生活动作｜Life Actions｜生活の動作
Wash｜洗｜洗う
Brush｜刷｜ブラッシュする
Dress｜穿衣服｜着る
Undress｜脱衣服｜脱ぐ
Cook｜做饭｜料理する
Clean｜打扫｜掃除する
Write｜写｜書く
Draw｜画｜描く
Read｜读｜読む
Count｜数｜数える
@@@ 其他动作｜Other Actions｜その他の動作
Open｜开｜開ける
Close｜关｜閉める
Take｜拿｜取る
Give｜给｜与える
Push｜推｜押す
Pull｜拉｜引く
Throw｜扔｜投げる
Catch｜接｜捕まえる
Carry｜搬｜運ぶ
Hold｜拿｜持つ

### 九、场所类（20个）｜Places（20）｜場所
@@@ 场所｜Places｜場所
Home｜家｜家
Park｜公园｜公園
School｜学校｜学校
Classroom｜教室｜教室
Playground｜操场｜運動場
Library｜图书馆｜図書館
Hospital｜医院｜病院
Doctor's office｜医生办公室｜医者のオフィス
Supermarket｜超市｜スーパー
Store｜商店｜店
Restaurant｜餐厅｜レストラン
Café｜咖啡馆｜カフェ
Zoo｜动物园｜動物園
Farm｜农场｜農場
Garden｜花园｜庭
Beach｜沙滩｜ビーチ
Pool｜泳池｜プール
Museum｜博物馆｜美術館
Cinema｜电影院｜映画館
Shop｜商店｜ショップ

### 十、自然事物类（20个）｜Natural Things（20）｜自然
@@@ 自然｜Natural Things｜自然
Sun｜太阳｜太陽
Moon｜月亮｜月
Star｜星星｜星
Cloud｜云｜雲
Rain｜雨｜雨
Snow｜雪｜雪
Wind｜风｜風
Thunder｜雷｜雷
Lightning｜闪电｜稲妻
Sky｜天空｜空
Earth｜地球｜地球
Mountain｜山｜山
River｜河｜川
Lake｜湖｜湖
Sea｜海｜海
Tree｜树｜木
Flower｜花｜花
Grass｜草｜草
Leaf｜叶子｜葉
Rock｜石头｜石

### 十一、服饰类（20个）｜Clothing（20）｜服装
@@@ 服饰｜Clothing｜服装
Shirt｜衬衫｜シャツ
T-shirt｜T恤｜Tシャツ
Pants｜裤子｜ズボン
Shorts｜短裤｜ショートパンツ
Skirt｜裙子｜スカート
Dress｜连衣裙｜ワンピース
Coat｜外套｜コート
Jacket｜夹克｜ジャケット
Sweater｜毛衣｜セーター
Hoodie｜连帽衫｜フーディー
Socks｜袜子｜靴下
Shoes｜鞋子｜靴
Boots｜靴子｜ブーツ
Sandals｜凉鞋｜サンダル
Hat｜帽子｜帽子
Cap｜棒球帽｜キャップ
Scarf｜围巾｜マフラー
Gloves｜手套｜手袋
Tie｜领带｜ネクタイ
Belt｜腰带｜ベルト

### 十二、玩具类（10个）｜Toys（10）｜おもちゃ
@@@ 玩具｜Toys｜おもちゃ
Ball｜球｜ボール
Doll｜玩偶｜人形
Car｜玩具车｜おもちゃの車
Train｜玩具火车｜おもちゃの電車
Puzzle｜拼图｜パズル
Block｜积木｜積み木
Teddy bear｜泰迪熊｜テディベア
Robot｜机器人｜ロボット
Dollhouse｜娃娃屋｜ドールハウス
Toy plane｜玩具飞机｜おもちゃの飛行機`
  }

  // UTF-8 解码，避免中文/日文乱码
  private utf8Decode(bytes: Uint8Array): string {
    let out = ''
    let i = 0
    while (i < bytes.length) {
      const c = bytes[i++]
      if (c < 0x80) {
        out += String.fromCharCode(c)
      } else if ((c & 0xE0) === 0xC0) {
        const c2 = bytes[i++]
        out += String.fromCharCode(((c & 0x1F) << 6) | (c2 & 0x3F))
      } else if ((c & 0xF0) === 0xE0) {
        const c2 = bytes[i++]
        const c3 = bytes[i++]
        out += String.fromCharCode(((c & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F))
      } else {
        const c2 = bytes[i++]
        const c3 = bytes[i++]
        const c4 = bytes[i++]
        let code = ((c & 0x07) << 18) | ((c2 & 0x3F) << 12) | ((c3 & 0x3F) << 6) | (c4 & 0x3F)
        code -= 0x10000
        out += String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF))
      }
    }
    return out
  }

  // 生成图标路径
  private generateIconPath(themeId: string): string {
    const iconMap: Record<string, string> = {
      'food': 'CardOriginal/Theme/Food.png',
      'animals': 'CardOriginal/Theme/Animals.png',
      'daily_items': 'CardOriginal/Theme/Daily Items.png',
      'body_parts': 'CardOriginal/Theme/Body Parts.png',
      'colors_shapes': 'CardOriginal/Theme/Colors & Shapes.png',
      'vehicles': 'CardOriginal/Theme/Transportation.png',
      'family': 'CardOriginal/Theme/Family Members and Titles.png',
      'actions': 'CardOriginal/Theme/Actions.png',
      'places': 'CardOriginal/Theme/Places.png',
      'nature': 'CardOriginal/Theme/Natural Things.png',
      'clothing': 'CardOriginal/Theme/Clothing.png',
      'toys': 'CardOriginal/Theme/Toys.png'
    }
    
    return iconMap[themeId] || 'CardOriginal/Theme/Food.png'
  }


  // 根据主题、子分类和单词名称生成图片路径
  private getImagePath(themeId: string, subcategoryName: string, wordId: string): string {
    // 主题到文件夹的映射（根据实际目录结构）
    const themeFolderMap: Record<string, string> = {
      'food': 'Food',
      'animals': 'Animals',
      'daily_items': 'Daily Items',
      'body_parts': 'Body Parts',
      'colors_shapes': 'Colors & Shapes',
      'vehicles': 'Transportation',
      'family': 'Family Members and Titles',
      'actions': 'Actions',
      'places': 'Places',
      'nature': 'Natural Things',
      'clothing': 'Clothing',
      'toys': 'Toys'
    }

    // 子分类到文件夹的映射（根据实际目录结构）
    const subcategoryFolderMap: Record<string, string> = {
      // 食物类
      '水果': 'Fruit',
      '蔬菜': 'Vegetable',
      '主食': 'Staple Foods',
      '零食和其他食物': 'Snacks_Other Foods',
      
      // 动物类
      '宠物': 'Pet',
      '农场动物': 'Farm Animals',
      '动物园动物': 'Zoo Animals',
      '水生动物': 'Aquatic Animals',
      '昆虫&小型动物': 'Insects & Small Animals',
      
      // 日常物品类
      '厨房用品': 'Kitchen Supplies',
      '卧室用品': 'Bedroom Supplies',
      '客厅用品': 'Living Room Supplies',
      '洗漱用品': 'Toiletries',
      '其他日常物品': 'Other Daily Items',
      
      // 身体部位类
      '头部': 'Head',
      '四肢': 'Limbs',
      '躯干': 'Torso',
      '其他': 'Others',
      
      // 颜色&形状类
      '颜色': 'Colors',
      '形状': 'Shapes',
      
      // 交通工具类
      '陆地': 'Land',
      '水上': 'Water',
      '空中': 'Air',
      
      // 家庭成员类
      '家庭成员': 'Family Members',
      
      // 动作类
      '日常动作': 'Daily Actions',
      '感官动作': 'Sensory Actions',
      '互动动作': 'Interactive Actions',
      '生活动作': 'Life Actions',
      '其他动作': 'Other Actions',
      
      // 场所类（所有场所都在Places目录下，没有子目录）
      '室内场所': 'Places',
      
      // 自然事物类（所有自然事物都在Natural Things目录下，没有子目录）
      '天气': 'Natural Things',
      
      // 服饰类（所有服饰都在Clothing目录下，没有子目录）
      '上衣': 'Clothing',
      
      // 玩具类（所有玩具都在Toys目录下，没有子目录）
      '玩具': 'Toys',
      '传统玩具': 'Toys',
      '现代玩具': 'Toys',
      '户外玩具': 'Toys',
      '益智玩具': 'Toys',
      '运动玩具': 'Toys',
      '创意玩具': 'Toys',
      '电子玩具': 'Toys',
      '角色扮演玩具': 'Toys',
      '其他玩具': 'Toys'
    }

    const themeFolder = themeFolderMap[themeId] || 'Food'
    const subcategoryFolder = subcategoryFolderMap[subcategoryName]
    
    // 图片文件名处理：统一使用首字母大写格式
    const fileName = `${wordId.charAt(0).toUpperCase() + wordId.slice(1).toLowerCase()}.png`
    
    // 当某些主题（如Toys/Clothing/Places/Natural Things）将图片直接放在主题目录下时，避免重复子目录
    let imagePath: string
    if (!subcategoryFolder || subcategoryFolder === themeFolder) {
      imagePath = `CardOriginal/${themeFolder}/${fileName}`
    } else {
      imagePath = `CardOriginal/${themeFolder}/${subcategoryFolder}/${fileName}`
    }
    console.log(`生成图片路径: ${wordId} -> ${imagePath}`)
    
    // 注意：实际使用时需要在Image组件中添加onError回调来处理图片加载失败
    // 如果图片不存在，使用DefaultImg.png作为占位图
    return imagePath
  }

  // 获取主题数据
  getThemes(): ThemeData[] {
    return this.themes
  }

  // 获取子分类的英文名称
  getSubcategoryEnglishName(subcategoryId: string): string {
    const allThemes = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]
    
    for (const theme of allThemes) {
      const subcategory = theme.subcategories.find(sub => sub.id === subcategoryId)
      if (subcategory) {
        return subcategory.languages.english
      }
    }
    
    // 如果找不到，返回中文名称作为备用
    const subcategory = this.subcategories.find(sub => sub.id === subcategoryId)
    return subcategory?.name || ''
  }

  // 根据子分类ID获取主题ID
  getThemeBySubcategoryId(subcategoryId: string): string {
    const allThemes = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]
    
    for (const theme of allThemes) {
      const subcategory = theme.subcategories.find(sub => sub.id === subcategoryId)
      if (subcategory) {
        return theme.id
      }
    }
    return ''
  }

  // 根据主题获取单词
  getWordsByTheme(theme: ThemeType): WordData[] {
    const themeMap: Record<ThemeType, string> = {
      'food': 'food',
      'animals': 'animals',
      'daily_items': 'daily_items',
      'body_parts': 'body_parts',
      'colors_shapes': 'colors_shapes',
      'vehicles': 'vehicles',
      'family': 'family',
      'actions': 'actions',
      'places': 'places',
      'nature': 'nature',
      'clothing': 'clothing',
      'toys': 'toys'
    }
    
    const category = themeMap[theme]
    return this.words.filter(word => word.category === category)
  }

  // 生成主题颜色
  generateThemeColor(index: number): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA'
    ]
    
    return colors[index % colors.length]
  }

  // 生成子分类图标路径 - 使用子分类文件夹内的第一张图片
  private generateSubcategoryIconPath(themeId: string, subcategoryName: string): string {
    // 主题到文件夹的映射
    const themeFolderMap: Record<string, string> = {
      'food': 'Food',
      'animals': 'Animals',
      'daily_items': 'Daily Items',
      'body_parts': 'Body Parts',
      'colors_shapes': 'Colors & Shapes',
      'vehicles': 'Transportation',
      'family': 'Family Members and Titles',
      'actions': 'Actions',
      'places': 'Places',
      'nature': 'Natural Things',
      'clothing': 'Clothing',
      'toys': 'Toys'
    }

    // 子分类到文件夹的映射
    const subcategoryFolderMap: Record<string, string> = {
      // 食物类
      '水果': 'Fruit',
      '蔬菜': 'Vegetable',
      '主食': 'Staple Foods',
      '零食和其他食物': 'Snacks_Other Foods',

      // 动物类
      '宠物': 'Pet',
      '农场动物': 'Farm Animals',
      '动物园动物': 'Zoo Animals',
      '水生动物': 'Aquatic Animals',
      '昆虫&小型动物': 'Insects & Small Animals',

      // 日常物品类
      '厨房用品': 'Kitchen Supplies',
      '卧室用品': 'Bedroom Supplies',
      '客厅用品': 'Living Room Supplies',
      '洗漱用品': 'Toiletries',
      '其他日常物品': 'Other Daily Items',

      // 身体部位类
      '头部': 'Head',
      '四肢': 'Limbs',
      '躯干': 'Torso',
      '其他': 'Others',

      // 颜色&形状类
      '颜色': 'Colors',
      '形状': 'Shapes',

      // 交通工具类
      '陆地': 'Land',
      '水上': 'Water',
      '空中': 'Air',

      // 家庭成员类
      '家庭成员': 'Family Members',

      // 动作类
      '日常动作': 'Daily Actions',
      '感官动作': 'Sensory Actions',
      '互动动作': 'Interactive Actions',
      '生活动作': 'Life Actions',
      '其他动作': 'Other Actions',

      // 场所类（所有场所都在Places目录下，没有子目录）
      '室内场所': 'Places',

      // 自然事物类（所有自然事物都在Natural Things目录下，没有子目录）
      '天气': 'Natural Things',

      // 服饰类（所有服饰都在Clothing目录下，没有子目录）
      '上衣': 'Clothing',

      // 玩具类（严格按 @@@ 子类生成，不使用虚拟分类）
      '玩具': 'Toys'
    }

    const themeFolder = themeFolderMap[themeId] || 'Food'
    const subcategoryFolder = subcategoryFolderMap[subcategoryName]

    // 从对应的theme数据中获取该子分类的第一个单词
    const theme = this.getThemeDataById(themeId)
    console.log(`生成子分类图标: themeId=${themeId}, subcategoryName=${subcategoryName}, themeFolder=${themeFolder}, subcategoryFolder=${subcategoryFolder}`)
    
    if (theme) {
      console.log(`找到theme: ${theme.id}, 子分类数量: ${theme.subcategories.length}`)
      const subcategory = theme.subcategories.find(s => s.languages.chinese === subcategoryName)
      if (subcategory) {
        console.log(`找到子分类: ${subcategory.languages.chinese}, 单词数量: ${subcategory.words.length}`)
        if (subcategory.words.length > 0) {
          // 遍历所有单词，找到第一个存在于文件夹中的图片
          for (const word of subcategory.words) {
            const wordId = word.languages.english
            // 图片文件名处理：统一使用首字母大写格式
            const fileName = `${wordId.charAt(0).toUpperCase() + wordId.slice(1).toLowerCase()}.png`
            let iconPath: string
            if (!subcategoryFolder || subcategoryFolder === themeFolder) {
              iconPath = `CardOriginal/${themeFolder}/${fileName}`
            } else {
              iconPath = `CardOriginal/${themeFolder}/${subcategoryFolder}/${fileName}`
            }
            
            // 这里返回第一个单词的图片路径（实际检查由Image组件的onError处理）
            // 如果图片不存在，Image组件的onError会使用DefaultImg.png
            console.log(`生成子分类图标路径: ${subcategoryName} -> ${iconPath} (单词: ${wordId})`)
            return iconPath
          }
        } else {
          console.log(`子分类 ${subcategoryName} 没有单词数据`)
        }
      } else {
        console.log(`未找到子分类: ${subcategoryName}`)
      }
    } else {
      console.log(`未找到theme: ${themeId}`)
    }
    
    // 如果找不到，返回一个默认路径
    const defaultPath = `CardOriginal/${themeFolder}/${subcategoryFolder}/apple.png`
    console.log(`使用默认子分类图标路径: ${subcategoryName} -> ${defaultPath}`)
    return defaultPath
  }

  // 生成子分类颜色
  private generateSubcategoryColor(themeId: string): string {
    const colorMap: Record<string, string> = {
      'food': '#FF6B6B',
      'animals': '#4ECDC4',
      'daily_items': '#45B7D1',
      'body_parts': '#96CEB4',
      'colors_shapes': '#FFEAA7',
      'vehicles': '#DDA0DD',
      'family': '#98D8C8',
      'actions': '#F7DC6F',
      'places': '#BB8FCE',
      'nature': '#85C1E9',
      'clothing': '#F8C471',
      'toys': '#82E0AA'
    }
    
    return colorMap[themeId] || '#E0E0E0'
  }

  // 根据子分类获取单词
  getWordsBySubcategory(subcategoryId: string): WordData[] {
    const subcategory = this.subcategories.find(s => s.id === subcategoryId)
    if (!subcategory) {
      console.log(`未找到子分类: ${subcategoryId}`)
      return []
    }
    
    console.log(`查找子分类 "${subcategory.name}" 的单词`)
    
    // 根据子分类名称过滤单词
    const filteredWords = this.words.filter(word => word.subcategory === subcategory.name)
    console.log(`找到 ${filteredWords.length} 个单词:`, filteredWords.map(w => w.english))
    
    return filteredWords
  }

  // 获取子分类数据
  getSubcategoryById(subcategoryId: string): SubcategoryData | undefined {
    return this.subcategories.find(s => s.id === subcategoryId)
  }

  // 根据主题获取子分类
  getSubcategoriesByTheme(theme: ThemeType): SubcategoryData[] {
    const result = this.subcategories.filter(subcategory => subcategory.themeId === theme)
    console.log(`Subcategories for theme ${theme}:`, result.length, result.map(s => s.name))
    return result
  }

  // 调试方法：打印所有子分类信息
  debugPrintAllSubcategories(): void {
    console.log('=== 所有子分类调试信息 ===')
    this.subcategories.forEach((subcategory, index) => {
      console.log(`${index + 1}. ID: ${subcategory.id}, Name: ${subcategory.name}, Theme: ${subcategory.themeId}`)
    })
    console.log(`总计子分类数量: ${this.subcategories.length}`)
    
    // 检查重复
    const nameCount = new Map<string, number>()
    this.subcategories.forEach(subcategory => {
      const count = nameCount.get(subcategory.name) || 0
      nameCount.set(subcategory.name, count + 1)
    })
    
    console.log('=== 重复检查 ===')
    nameCount.forEach((count, name) => {
      if (count > 1) {
        console.log(`警告: "${name}" 出现了 ${count} 次`)
      }
    })
    
    // 检查每个主题的子分类
    console.log('=== 按主题分组检查 ===')
    const allThemes = [
      this.foodData, this.animalsData, this.dailyItemsData, this.bodyPartsData,
      this.colorsShapesData, this.vehiclesData, this.familyData, this.actionsData,
      this.placesData, this.natureData, this.clothingData, this.toysData
    ]
    
    allThemes.forEach(theme => {
      console.log(`主题 ${theme.id}: ${theme.subcategories.length} 个子分类`)
      theme.subcategories.forEach(subcategory => {
        console.log(`  - ${subcategory.languages.chinese}`)
      })
    })
  }
}