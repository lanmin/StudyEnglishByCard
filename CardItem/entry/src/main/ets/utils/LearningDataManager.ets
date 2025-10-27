// 学习数据管理器

import { ThemeType, WordData, SubcategoryData, ThemeData } from '../types/CommonTypes'

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

  private constructor() {
    this.parseCardInfoFile()
    this.convertToCompatibilityData()
    this.debugPrintAllSubcategories()
  }

  // 解析cardInfo.txt文件到12个主题数组
  private parseCardInfoFile(): void {
    // 先清空所有主题的子分类数组
    this.clearAllSubcategories()
    
    const content = this.readCardInfoFile()
    const lines = content.split('\n')
    
    let currentTheme: ThemeDataStructure | null = null
    let currentSubcategory: SubcategoryDataStructure | null = null
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // 解析主题 (### 开头)
      if (trimmedLine.startsWith('### ')) {
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
      else if (trimmedLine.startsWith('@@@ ')) {
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
        }
      }
      // 解析单词 (普通行)
      else if (trimmedLine && !trimmedLine.startsWith('#') && currentSubcategory) {
        const wordInfo = this.parseWordLine(trimmedLine)
        if (wordInfo) {
          const wordId = wordInfo.languages.english.toLowerCase()
          const wordData: WordDataStructure = {
            id: wordId,
            languages: wordInfo.languages,
            subcategory: currentSubcategory.languages.chinese,
            image: this.getImagePath(currentTheme!.id, currentSubcategory.languages.chinese, wordId),
            pronunciation: this.generatePronunciation(wordInfo.languages.english)
          }
          currentSubcategory.words.push(wordData)
          console.log(`添加单词: ${wordInfo.languages.english} -> 图片路径: ${wordData.image}`)
        }
      }
    }
  }

  // 解析主题行
  private parseThemeLine(line: string): ThemeParseResult | null {
    const content = line.substring(4) // 移除 "### "
    const parts = content.split('｜')
    
    if (parts.length >= 3) {
      const chinesePart = parts[0].trim()
      const englishPart = parts[1].trim()
      const japanesePart = parts[2].trim()
      
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
    const content = line.substring(4) // 移除 "@@@ "
    const parts = content.split('｜')
    
    if (parts.length >= 3) {
      const result: SubcategoryParseResult = {
        languages: {
          english: parts[1].trim(),
          chinese: parts[0].trim(),
          japanese: parts[2].trim()
        }
      }
      return result
    }
    return null
  }

  // 解析单词行
  private parseWordLine(line: string): WordParseResult | null {
    const parts = line.split('｜')
    
    if (parts.length >= 3) {
      const result: WordParseResult = {
        languages: {
          english: parts[0].trim(),
          chinese: parts[1].trim(),
          japanese: parts[2].trim()
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
      const themeData: ThemeData = {
        id: theme.id as ThemeType,
        name: theme.languages.chinese,
        icon: this.generateIconPath(theme.id),
        color: this.generateThemeColor(this.getThemeIndex(theme.id)),
        totalWords: this.getTotalWordsForTheme(theme),
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
        console.log(`Converting subcategory: ${subcategory.languages.chinese}`)
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
    // 这里应该从实际文件读取，但为了演示，我们返回完整的cardInfo.txt内容
    // 实际项目中应该使用文件系统API读取
    return `### 一、食物类（100个）｜Food（100）｜食べ物（たべもの）
@@@ 水果｜Fruit｜果物（くだもの）
Apple｜苹果｜りんご（ringo）
Banana｜香蕉｜バナナ（banana）
Orange｜橙子｜オレンジ（orenji）
Grape｜葡萄｜ぶどう（budou）
Strawberry｜草莓｜いちご（ichigo）
@@@ 蔬菜｜Vegetables｜野菜（やさい）
Carrot｜胡萝卜｜人参（にんじん，ninjin）
Tomato｜番茄｜トマト（tomato）
Potato｜土豆｜じゃがいも（jagaimo）
Onion｜洋葱｜たまねぎ（tamanegi）
Cabbage｜卷心菜｜キャベツ（kyabetsu）
@@@ 主食｜Staple Foods｜主食（しゅしょく）
Rice｜米饭｜ご飯（ごはん，gohan）
Bread｜面包｜パン（pan）
Noodle｜面条｜麺（めん，men）
Pasta｜意大利面｜パスタ（pasuta）
Pizza｜披萨｜ピザ（piza）
@@@ 零食&其他食物｜Snacks & Other Foods｜スナック＆その他の食べ物（すなっく＆そのたののたべもの）
Cookie｜饼干｜クッキー（kukkī）
Cake｜蛋糕｜ケーキ（kēki）
Ice cream｜冰淇淋｜アイスクリーム（aisukuriimu）
Chocolate｜巧克力｜チョコレート（chokorēto）

### 二、动物类（100个）｜Animals（100）｜動物（どうぶつ）
@@@ 宠物｜Pets｜ペット（petto）
Dog｜狗｜犬（いぬ，inu）
Cat｜猫｜猫（ねこ，neko）
Bird｜鸟｜鳥（とり，tori）
Rabbit｜兔子｜うさぎ（usagi）
Fish｜鱼｜魚（さかな，sakana）
@@@ 农场动物｜Farm Animals｜農場の動物（のうじょうのどうぶつ）
Cow｜奶牛｜牛（うし，ushi）
Pig｜猪｜豚（ぶた，buta）
Sheep｜羊｜羊（ひつじ，hitsuji）
Chicken｜鸡｜鶏（にわとり，niwatori）
Duck｜鸭子｜アヒル（ahiru）
@@@ 动物园动物｜Zoo Animals｜動物園の動物（どうぶつえんのどうぶつ）
Lion｜狮子｜ライオン（raion）
Tiger｜老虎｜虎（とら，tora）
Elephant｜大象｜象（ぞう，zou）
Monkey｜猴子｜猿（さる，saru）
Giraffe｜长颈鹿｜キリン（kirin）
@@@ 水生动物｜Aquatic Animals｜水生動物（すいせいどうぶつ）
Whale｜鲸鱼｜鯨（くじら，kujira）
Dolphin｜海豚｜イルカ（iruka）
Shark｜鲨鱼｜サメ（same）
Octopus｜章鱼｜タコ（tako）
@@@ 昆虫&小型动物｜Insects & Small Animals｜昆虫＆小型動物（こんちゅう＆こがたどうぶつ）
Butterfly｜蝴蝶｜蝶（ちょう，chou）
Bee｜蜜蜂｜蜂（はち，hachi）
Ant｜蚂蚁｜蟻（あり，ari）
Spider｜蜘蛛｜蜘蛛（くも，kumo）

### 三、日常物品类（100个）｜Daily Items（100）｜日常用品（にちじょうようひん）
@@@ 厨房用品｜Kitchen Supplies｜キッチン用品（kitchin youhin）
Plate｜盘子｜お皿（おざら，ozara）
Bowl｜碗｜お椀（おわん，owan）
Spoon｜勺子｜スプーン（supūn）
Fork｜叉子｜フォーク（fōku）
Knife｜刀子｜ナイフ（naifu）
@@@ 卧室用品｜Bedroom Supplies｜寝室用品（しんしつようひん）
Bed｜床｜ベッド（beddo）
Pillow｜枕头｜枕（まくら，makura）
Blanket｜毯子｜毛布（もうふ，moufu）
Lamp｜台灯｜ランプ（ranpu）
@@@ 客厅用品｜Living Room Supplies｜リビング用品（ribingu youhin）
Sofa｜沙发｜ソファ（sofa）
Table｜桌子｜テーブル（tēburu）
Chair｜椅子｜椅子（いす，isu）
TV｜电视｜テレビ（terebi）
@@@ 洗漱用品｜Toiletries｜トイレタリー（toiretarī）
Toothbrush｜牙刷｜歯ブラシ（haburashi）
Toothpaste｜牙膏｜歯磨き粉（はみがきこ，hamigakiko）
Soap｜肥皂｜石鹸（せっけん，sekken）
Towel｜毛巾｜タオル（taoru）
@@@ 其他日常物品｜Other Daily Items｜その他の日常用品（そのたのにちじょうようひん）
Book｜书｜本（ほん，hon）
Pen｜笔｜ペン（pen）
Phone｜电话｜電話（でんわ，denwa）
Clock｜时钟｜時計（とけい，tokei）

### 四、身体部位类（100个）｜Body Parts（100）｜体の部分（からだのぶぶん）
@@@ 头部｜Head｜頭部（ずつぶ，zutsubu）
Eye｜眼睛｜目（め，me）
Nose｜鼻子｜鼻（はな，hana）
Mouth｜嘴巴｜口（くち，kuchi）
Ear｜耳朵｜耳（みみ，mimi）
Head｜头｜頭（あたま，atama）
@@@ 四肢｜Limbs｜四肢（しし，shishi）
Hand｜手｜手（て，te）
Foot｜脚｜足（あし，ashi）
Arm｜胳膊｜腕（うで，ude）
Leg｜腿｜脚（あし，ashi）
@@@ 躯干｜Torso｜胴体（どうたい，doutai）
Body｜身体｜体（からだ，karada）
Chest｜胸部｜胸（むね，mune）
Back｜背部｜背中（せなか，senaka）
@@@ 其他｜Others｜その他（そのた，sonota）
Finger｜手指｜指（ゆび，yubi）
Toe｜脚趾｜足の指（あしのゆび，ashi no yubi）

### 五、颜色&形状类（100个）｜Colors & Shapes（100）｜色と形（いろとかたち）
@@@ 颜色｜Colors｜色（しょく，shoku）
Red｜红色｜赤（あか，aka）
Blue｜蓝色｜青（あお，ao）
Green｜绿色｜緑（みどり，midori）
Yellow｜黄色｜黄（き，ki）
Black｜黑色｜黒（くろ，kuro）
White｜白色｜白（しろ，shiro）
@@@ 形状｜Shapes｜形（かたち，katachi）
Circle｜圆形｜円（えん，en）
Square｜方形｜四角（しかく，shikaku）
Triangle｜三角形｜三角（さんかく，sankaku）
Rectangle｜长方形｜長方形（ちょうほうけい，chouhoukei）

### 六、交通工具类（100个）｜Vehicles（100）｜乗り物（のりもの）
@@@ 陆地｜Land｜陸上（りくじょう，rikujou）
Car｜汽车｜車（くるま，kuruma）
Bus｜公交车｜バス（basu）
Train｜火车｜電車（でんしゃ，densha）
Bicycle｜自行车｜自転車（じてんしゃ，jitensha）
Motorcycle｜摩托车｜バイク（baiku）
@@@ 水上｜Water｜水上（すいじょう，suijou）
Boat｜船｜船（ふね，fune）
Ship｜轮船｜船（ふね，fune）
@@@ 空中｜Air｜空中（くうちゅう，kuuchuu）
Airplane｜飞机｜飛行機（ひこうき，hikouki）
Helicopter｜直升机｜ヘリコプター（herikoputā）

### 七、家庭成员&称呼类（100个）｜Family & Titles（100）｜家族と敬称（かぞくとけいしょう）
@@@ 家庭成员｜Family Members｜家族（かぞく，kazoku）
Father｜父亲｜父（ちち，chichi）
Mother｜母亲｜母（はは，haha）
Brother｜兄弟｜兄弟（きょうだい，kyoudai）
Sister｜姐妹｜姉妹（しまい，shimai）
Grandfather｜爷爷｜おじいさん（ojiisan）
Grandmother｜奶奶｜おばあさん（obaasan）

### 八、动作类（100个）｜Actions（100）｜動作（どうさ）
@@@ 日常动作｜Daily Actions｜日常の動作（にちじょうのどうさ，nichijou no dousa）
Walk｜走路｜歩く（あるく，aruku）
Run｜跑步｜走る（はしる，hashiru）
Jump｜跳跃｜跳ぶ（とぶ，tobu）
Sit｜坐下｜座る（すわる，suwaru）
Stand｜站立｜立つ（たつ，tatsu）
@@@ 感官动作｜Sensory Actions｜感覚の動作（かんかくのどうさ，kankaku no dousa）
See｜看见｜見る（みる，miru）
Hear｜听见｜聞く（きく，kiku）
Smell｜闻｜嗅ぐ（かぐ，kagu）
Taste｜品尝｜味わう（あじわう，ajiwau）
Touch｜触摸｜触る（さわる，sawaru）
@@@ 互动动作｜Interactive Actions｜インタラクティブな動作（intarakutibu na dousa）
Talk｜说话｜話す（はなす，hanasu）
Listen｜听｜聞く（きく，kiku）
Play｜玩耍｜遊ぶ（あそぶ，asobu）
@@@ 生活动作｜Life Actions｜生活の動作（せいかつのどうさ，seikatsu no dousa）
Eat｜吃｜食べる（たべる，taberu）
Drink｜喝｜飲む（のむ，nomu）
Sleep｜睡觉｜寝る（ねる，neru）
Wake up｜醒来｜起きる（おきる，okiru）
@@@ 其他动作｜Other Actions｜その他の動作（そのたのどうさ，sonota no dousa）
Read｜阅读｜読む（よむ，yomu）
Write｜写字｜書く（かく，kaku）
Draw｜画画｜描く（かく，kaku）

### 九、场所类（100个）｜Places（100）｜場所（ばしょ）
@@@ 室内场所｜Indoor Places｜屋内（おくない）
Home｜家｜家（いえ，ie）
School｜学校｜学校（がっこう，gakkou）
Hospital｜医院｜病院（びょういん，byouin）
Library｜图书馆｜図書館（としょかん，toshokan）
Store｜商店｜店（みせ，mise）
Restaurant｜餐厅｜レストラン（resutoran）

### 十、自然事物类（100个）｜Natural Things（100）｜自然（しぜん）
@@@ 天气｜Weather｜天気（てんき）
Sun｜太阳｜太陽（たいよう，taiyou）
Moon｜月亮｜月（つき，tsuki）
Star｜星星｜星（ほし，hoshi）
Cloud｜云｜雲（くも，kumo）
Rain｜雨｜雨（あめ，ame）
Snow｜雪｜雪（ゆき，yuki）
Wind｜风｜風（かぜ，kaze）

### 十一、服饰类（100个）｜Clothing（100）｜服（ふく）
@@@ 上衣｜Tops｜上着（うわぎ）
Shirt｜衬衫｜シャツ（shatsu）
T-shirt｜T恤｜Tシャツ（tīshatsu）
Dress｜连衣裙｜ドレス（doresu）
Jacket｜夹克｜ジャケット（jaketto）
Coat｜外套｜コート（kōto）

### 十二、玩具类（100个）｜Toys（100）｜おもちゃ
@@@ 传统玩具｜Traditional Toys｜伝統的なおもちゃ（でんとうてきなおもちゃ）
Ball｜球｜ボール（bōru）
Doll｜娃娃｜人形（にんぎょう，ningyou）
Teddy bear｜泰迪熊｜テディベア（tedibea）
@@@ 现代玩具｜Modern Toys｜現代のおもちゃ（げんだいのおもちゃ）
Robot｜机器人｜ロボット（robotto）
@@@ 户外玩具｜Outdoor Toys｜屋外のおもちゃ（おくがいのおもちゃ）
Kite｜风筝｜凧（たこ，tako）
@@@ 益智玩具｜Educational Toys｜知育玩具（ちいくがんぐ）
Puzzle｜拼图｜パズル（pazuru）
@@@ 运动玩具｜Sports Toys｜スポーツ玩具（スポーツがんぐ）
Soccer ball｜足球｜サッカーボール（sakkābōru）
Basketball｜篮球｜バスケットボール（basukettobōru）
@@@ 创意玩具｜Creative Toys｜創造的なおもちゃ（そうぞうてきなおもちゃ）
Blocks｜积木｜ブロック（burokku）
@@@ 电子玩具｜Electronic Toys｜電子玩具（でんしがんぐ）
Game console｜游戏机｜ゲーム機（gēmuki）
@@@ 角色扮演玩具｜Role Play Toys｜ごっこ遊び（ごっこあそび）
Toy kitchen｜玩具厨房｜おもちゃのキッチン（omocha no kitchin）
@@@ 其他玩具｜Other Toys｜その他のおもちゃ（そのたのおもちゃ）
Yo-yo｜溜溜球｜ヨーヨー（yōyō）`
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
      'family': 'CardOriginal/Theme/Family Members & Titles.png',
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
      'family': 'Family Members & Titles',
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
      '零食&其他食物': 'Snacks & Other Foods',
      
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
    const subcategoryFolder = subcategoryFolderMap[subcategoryName] || 'Fruit'
    
    // 图片文件名处理：尝试小写和首字母大写
    const fileNameLower = `${wordId.toLowerCase()}.png`
    const fileNameCapitalized = `${wordId.charAt(0).toUpperCase() + wordId.slice(1)}.png`
    
    // 使用简单的字符串路径，在Image组件中处理
    // 优先尝试首字母大写的文件名（因为实际文件名都是首字母大写）
    const imagePath = `CardOriginal/${themeFolder}/${subcategoryFolder}/${fileNameCapitalized}`
    console.log(`生成图片路径: ${wordId} -> ${imagePath}`)
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

  // 生成子分类图标路径 - 使用Theme目录下的图片
  private generateSubcategoryIconPath(themeId: string, subcategoryName: string): string {
    // 返回主题图标，因为实际目录结构中子分类没有对应的图标文件
    return this.generateIconPath(themeId)
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