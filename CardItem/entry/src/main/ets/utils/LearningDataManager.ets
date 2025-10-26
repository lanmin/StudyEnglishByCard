// 学习数据管理器

import { WordData, ThemeData, ThemeType, SubcategoryData } from '../types/CommonTypes'

export class LearningDataManager {
  private static instance: LearningDataManager
  private words: WordData[] = []
  private themes: ThemeData[] = []

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
    this.parseCardInfo()
  }

  // 读取cardInfo.txt文件内容
  private readCardInfoFile(): string {
    // 在HarmonyOS中，我们需要使用resourceManager来读取rawfile中的文件
    // 这里先返回硬编码的数据，模拟从cardInfo.txt读取
    return `### 一、食物类（100个）｜Food（100）｜食べ物（たべもの）
#### 水果｜Fruit｜果物（くだもの）
Apple｜苹果｜りんご（ringo）  
Banana｜香蕉｜バナナ（banana）  
Orange｜橙子｜オレンジ（orenji）  
Pear｜梨｜梨（なし，nashi）  
Grape｜葡萄｜ぶどう（budou）  
Watermelon｜西瓜｜スイカ（suika）  
Strawberry｜草莓｜いちご（ichigo）  
Mango｜芒果｜マンゴー（mangou）  
Pineapple｜菠萝｜パイナップル（painappuru）  
Peach｜桃子｜桃（もも，momo）  
Cherry｜樱桃｜さくらんぼ（sakuranbo）  
Lemon｜柠檬｜レモン（remon）  
Kiwi｜猕猴桃｜キウイ（kiui）  
Blueberry｜蓝莓｜ブルーベリー（burū berī）  
Raspberry｜树莓｜ラズベリー（razuberī）  
Apricot｜杏｜アンズ（anzu）  
Plum｜李子｜梅（うめ，ume）  
Pomegranate｜石榴｜ザクロ（zakuro）  
Coconut｜椰子｜ココナッツ（kokonattsu）  
Lychee｜荔枝｜ライチ（raichi）  

#### 蔬菜｜Vegetables｜野菜（やさい）
Carrot｜胡萝卜｜人参（にんじん，ninjin）  
Tomato｜番茄｜トマト（tomato）  
Onion｜洋葱｜玉ねぎ（たまねぎ，tamanegi）  
Potato｜土豆｜ジャガイモ（jagaimo）  
Cabbage｜卷心菜｜キャベツ（kyabetsu）  
Spinach｜菠菜｜ほうれん草（ほうれんそう，hourensou）  
Broccoli｜西兰花｜ブロッコリー（brokkorī）  
Cauliflower｜花椰菜｜カリフラワー（karifuraawaa）  
Cucumber｜黄瓜｜キュウリ（kyuuri）  
Pumpkin｜南瓜｜カボチャ（kabochya）  
Corn｜玉米｜トウモロコシ（toumoro kosi）  
Peas｜豌豆｜エンドウ豆（えんどうまめ，endou mame）  
Beans｜豆角｜四季豆（しきさいどう，shikisai dou）  
Lettuce｜生菜｜レタス（retasu）  
Eggplant｜茄子｜ナス（nasu）  
Pepper｜辣椒｜唐辛子（とうがらし，togarashi）  
Garlic｜大蒜｜大蒜（にんにく，ninniku）  
Ginger｜姜｜生姜（しょうが，shouga）  
Radish｜萝卜｜大根（だいこん，daikon）  
Celery｜芹菜｜セロリー（serorī）  

### 二、动物类（100个）｜Animals（100）｜動物（どうぶつ）
#### 宠物｜Pets｜ペット（petto）
Dog｜狗｜犬（いぬ，inu）  
Cat｜猫｜猫（ねこ，neko）  
Bird｜鸟｜鳥（とり，tori）  
Fish｜鱼｜魚（さかな，sakana）  
Rabbit｜兔子｜うさぎ（usagi）  
Hamster｜仓鼠｜ハムスター（hamusutaa）  
Guinea Pig｜豚鼠｜モルモット（morumotto）  
Turtle｜乌龟｜亀（かめ，kame）  
Parrot｜鹦鹉｜オウム（oumu）  
Goldfish｜金鱼｜金魚（きんぎょ，kingyo）  

#### 农场动物｜Farm Animals｜農場の動物（のうじょうのどうぶつ）
Cow｜奶牛｜牛（うし，ushi）  
Pig｜猪｜豚（ぶた，buta）  
Sheep｜羊｜羊（ひつじ，hitsuji）  
Goat｜山羊｜ヤギ（yagi）  
Horse｜马｜馬（うま，uma）  
Donkey｜驴｜ロバ（roba）  
Chicken｜鸡｜鶏（にわとり，niwatori）  
Duck｜鸭子｜アヒル（ahiru）  
Goose｜鹅｜ガチョウ（gachou）  
Turkey｜火鸡｜七面鳥（しちめんちょう，shichimenchou）  

### 三、日常物品类（100个）｜Daily Items（100）｜日常用品（にちじょうようひん）
#### 厨房用品｜Kitchen Supplies｜キッチン用品（kitchin youhin）
Spoon｜勺子｜スプーン（supuun）  
Fork｜叉子｜フォーク（fooku）  
Knife｜刀｜ナイフ（naifu）  
Plate｜盘子｜皿（さら，sara）  
Bowl｜碗｜ボウル（bouru）  
Cup｜杯子｜カップ（kappu）  
Glass｜玻璃杯｜グラス（gurasu）  
Pot｜锅｜鍋（なべ，nabe）  
Pan｜平底锅｜フライパン（furaipan）  
Kettle｜水壶｜やかん（yakan）  

### 四、身体部位类（50个）｜Body Parts（50）｜身体の部位（しんたいのぶい，shintai no bui）
#### 头部｜Head｜頭部（ずつぶ，zutsubu）
Head｜头｜頭（あたま，atama）  
Face｜脸｜顔（かお，kao）  
Eye｜眼睛｜目（め，me）  
Nose｜鼻子｜鼻（はな，hana）  
Mouth｜嘴巴｜口（くち，kuchi）  
Ear｜耳朵｜耳（みみ，mimi）  
Hair｜头发｜髪（かみ，kami）  
Forehead｜额头｜額（ひたい，hitai）  
Cheek｜脸颊｜頬（ほお，hoo）  
Chin｜下巴｜顎（あご，ago）  

### 五、颜色&形状类（50个）｜Colors & Shapes（50）｜色＆形（しょく＆かたち，shoku＆katachi）
#### 颜色｜Colors｜色（しょく，shoku）
Red｜红色｜赤（あか，aka）  
Blue｜蓝色｜青（あお，ao）  
Green｜绿色｜緑（みどり，midori）  
Yellow｜黄色｜黄（き，ki）  
Orange｜橙色｜オレンジ（orenji）  
Purple｜紫色｜紫（むらさき，murasaki）  
Pink｜粉色｜ピンク（pinku）  
Black｜黑色｜黒（くろ，kuro）  
White｜白色｜白（しろ，shiro）  
Gray｜灰色｜灰（はいいろ，haiiro）  

### 六、交通工具类（30个）｜Transportation（30）｜交通機関（こうつうきかん，koutsuu kikan）
#### 陆地｜Land｜陸上（りくじょう，rikujou）
Car｜汽车｜車（くるま，kuruma）  
Bus｜公交车｜バス（basu）  
Truck｜卡车｜トラック（torakku）  
Motorcycle｜摩托车｜バイク（baiku）  
Bicycle｜自行车｜自転車（じてんしゃ，jitensha）  
Train｜火车｜電車（でんしゃ，densha）  
Taxi｜出租车｜タクシー（takushii）  
Van｜面包车｜バン（ban）  
Scooter｜滑板车｜スクーター（sukuutaa）  
Tractor｜拖拉机｜トラクター（torakutaa）  

#### 水上｜Water｜水上（すいじょう，suijou）
Boat｜船｜ボート（booto）  
Ship｜轮船｜船（ふね，fune）  
Yacht｜游艇｜ヨット（yotto）  
Canoe｜独木舟｜カヌー（kanuu）  

#### 空中｜Air｜空中（くうちゅう，kuuchuu）
Airplane｜飞机｜飛行機（ひこうき，hikouki）  
Helicopter｜直升机｜ヘリコプター（herikoputaa）  
Balloon｜热气球｜気球（ききゅう，kikyuu）  
Rocket｜火箭｜ロケット（roketto）  

### 七、家庭成员&称呼类（20个）｜Family Members & Titles（20）｜家族メンバー＆呼び方（かぞくめんばー＆よびかた，kazoku menbaa＆yobikata）
Father｜父亲｜父（ちち，chichi）  
Mother｜母亲｜母（はは，haha）  
Son｜儿子｜息子（むすこ，musuko）  
Daughter｜女儿｜娘（むすめ，musume）  
Brother｜兄弟｜兄弟（きょうだい，kyoudai）  
Sister｜姐妹｜姉妹（しまい，shimai）  
Grandfather｜爷爷｜おじいさん（ojiisan）  
Grandmother｜奶奶｜おばあさん（obaasan）  
Uncle｜叔叔｜おじさん（ojisan）  
Aunt｜阿姨｜おばさん（obasan）  

### 八、动作类（50个）｜Actions（50）｜動作（どうさ，dousa）
#### 日常动作｜Daily Actions｜日常の動作（にちじょうのどうさ，nichijou no dousa）
Walk｜走路｜歩く（あるく，aruku）  
Run｜跑步｜走る（はしる，hashiru）  
Jump｜跳跃｜跳ぶ（とぶ，tobu）  
Sit｜坐下｜座る（すわる，suwaru）  
Stand｜站立｜立つ（たつ，tatsu）  
Sleep｜睡觉｜寝る（ねる，neru）  
Eat｜吃饭｜食べる（たべる，taberu）  
Drink｜喝水｜飲む（のむ，nomu）  
Read｜阅读｜読む（よむ，yomu）  
Write｜写字｜書く（かく，kaku）  

### 九、场所类（20个）｜Places（20）｜場所（ばしょ，basho）
Home｜家｜家（いえ，ie）  
School｜学校｜学校（がっこう，gakkou）  
Hospital｜医院｜病院（びょういん，byouin）  
Park｜公园｜公園（こうえん，kouen）  
Store｜商店｜店（みせ，mise）  
Restaurant｜餐厅｜レストラン（resutoran）  
Library｜图书馆｜図書館（としょかん，toshokan）  
Bank｜银行｜銀行（ぎんこう，ginkou）  
Post Office｜邮局｜郵便局（ゆうびんきょく，yuubinkyoku）  
Police Station｜警察局｜警察署（けいさつしょ，keisatsusho）  

### 十、自然事物类（20个）｜Natural Things（20）｜自然のもの（しぜんのもの，shizen no mono）
Sun｜太阳｜太陽（たいよう，taiyou）  
Moon｜月亮｜月（つき，tsuki）  
Star｜星星｜星（ほし，hoshi）  
Cloud｜云朵｜雲（くも，kumo）  
Rain｜雨｜雨（あめ，ame）  
Snow｜雪｜雪（ゆき，yuki）  
Wind｜风｜風（かぜ，kaze）  
Tree｜树｜木（き，ki）  
Flower｜花｜花（はな，hana）  
Grass｜草｜草（くさ，kusa）  

### 十一、服饰类（20个）｜Clothing（20）｜服装（ふくそう，fukusou）
Shirt｜衬衫｜シャツ（shatsu）  
Pants｜裤子｜ズボン（zubon）  
Dress｜裙子｜ドレス（doresu）  
Shoes｜鞋子｜靴（くつ，kutsu）  
Hat｜帽子｜帽子（ぼうし，boushi）  
Coat｜外套｜コート（kooto）  
Socks｜袜子｜靴下（くつした，kutsushita）  
Gloves｜手套｜手袋（てぶくろ，tebukuro）  
Scarf｜围巾｜スカーフ（sukaafu）  
Belt｜腰带｜ベルト（beruto）  

### 十二、玩具类（10个）｜Toys（10）｜おもちゃ（omochya）
Ball｜球｜ボール（booru）  
Doll｜娃娃｜人形（にんぎょう，ningyou）  
Toy Car｜玩具车｜おもちゃの車（omochya no kuruma）  
Puzzle｜拼图｜パズル（pazuru）  
Blocks｜积木｜ブロック（burokku）  
Teddy Bear｜泰迪熊｜テディベア（tedibeaa）  
Kite｜风筝｜凧（たこ，tako）  
Yo-yo｜溜溜球｜ヨーヨー（yooyoo）  
Jump Rope｜跳绳｜縄跳び（なわとび，nawatobi）  
Hula Hoop｜呼啦圈｜フラフープ（furahuupu）`
  }

  // 解析cardInfo.txt文件
  private parseCardInfo(): void {
    const cardInfoContent = this.readCardInfoFile()
    const lines = cardInfoContent.split('\n')
    
    const themeMap = new Map<string, ThemeData>()
    let themeIndex = 0
    
    lines.forEach((line: string) => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('### ')) {
        // 解析###开头的分类行
        // 格式：### 一、食物类（100个）｜Food（100）｜食べ物（たべもの）
        const parts = trimmedLine.substring(4).split('｜') // 使用中文的｜分隔符
        if (parts.length >= 2) {
          const chinesePart = parts[0].trim()
          const englishPart = parts[1].trim()
          
          // 提取中文名称（去掉序号和括号）
          const chineseName = chinesePart.replace(/^[一二三四五六七八九十]+、/, '').replace(/（\d+个）/, '')
          
          // 提取英文名称（去掉括号）
          const englishName = englishPart.replace(/（\d+）/, '')
          
          // 生成主题ID
          const themeId = this.generateThemeId(chineseName, themeIndex)
          
          // 生成图标路径（使用第一个单词的图片）
          const iconPath = this.generateIconPath(themeId)
          
          // 生成颜色
          const color = this.generateThemeColor(themeIndex)
          
          themeMap.set(themeId, {
            id: themeId as ThemeType,
            name: chineseName,
            icon: iconPath,
            color: color,
            totalWords: 0, // 暂时设为0，后续可以统计
            completedWords: 0,
            isUnlocked: true
          })
          
          themeIndex++
        }
      }
    })
    
    this.themes = Array.from(themeMap.values())
  }

  // 生成主题ID
  private generateThemeId(chineseName: string, index: number): string {
    const themeIdMap: Record<string, string> = {
      '食物类': 'fruits',
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
    
    return themeIdMap[chineseName] || `theme_${index}`
  }

  // 生成图标路径
  private generateIconPath(themeId: string): string {
    const iconMap: Record<string, string> = {
      'fruits': '$rawfile/CardOriginal/Food/Fruit/apple.png',
      'animals': '$rawfile/CardOriginal/Animals/Pet/Dog.png',
      'daily_items': '$rawfile/CardOriginal/Daily Items/Spoon.png',
      'body_parts': '$rawfile/CardOriginal/Body/Head/head.png',
      'colors_shapes': '$rawfile/CardOriginal/Colors/red.png',
      'vehicles': '$rawfile/CardOriginal/Vehicles/Car/car.png',
      'family': '$rawfile/CardOriginal/Family/father.png',
      'actions': '$rawfile/CardOriginal/Actions/walk.png',
      'places': '$rawfile/CardOriginal/Places/home.png',
      'nature': '$rawfile/CardOriginal/Nature/sun.png',
      'clothing': '$rawfile/CardOriginal/Clothing/shirt.png',
      'toys': '$rawfile/CardOriginal/Toys/ball.png'
    }
    
    return iconMap[themeId] || '$rawfile/CardOriginal/Food/Fruit/apple.png'
  }

  // 生成主题颜色
  private generateThemeColor(index: number): string {
    const colors = [
      '#FF3366', // 食物类 - 红色
      '#3399FF', // 动物类 - 蓝色
      '#FF9900', // 日常物品类 - 橙色
      '#33CC33', // 身体部位类 - 绿色
      '#9966CC', // 颜色&形状类 - 紫色
      '#FF6600', // 交通工具类 - 橙红色
      '#FF99CC', // 家庭成员类 - 粉色
      '#66CC99', // 动作类 - 青绿色
      '#CC9966', // 场所类 - 棕色
      '#99CCFF', // 自然事物类 - 浅蓝色
      '#FFCC99', // 服饰类 - 浅橙色
      '#CC99FF'  // 玩具类 - 浅紫色
    ]
    
    return colors[index % colors.length]
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
    return this.themes
  }

  // 根据主题获取单词
  getWordsByTheme(theme: ThemeType): WordData[] {
    const themeMap: Record<ThemeType, string> = {
      'fruits': 'Food',
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
    
    const category = themeMap[theme]
    return this.words.filter(word => word.category === category)
  }

  // 根据主题获取子分类
  getSubcategoriesByTheme(theme: ThemeType): SubcategoryData[] {
    // 暂时返回空数组，后续可以实现子分类解析
    return []
  }
}
