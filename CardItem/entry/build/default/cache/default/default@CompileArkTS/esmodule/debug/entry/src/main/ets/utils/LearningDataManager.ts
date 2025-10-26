import type { ThemeType, WordData, SubcategoryData, ThemeData } from '../types/CommonTypes';
export class LearningDataManager {
    private static instance: LearningDataManager;
    private words: WordData[] = [];
    private themes: ThemeData[] = [];
    private subcategories: SubcategoryData[] = [];
    private constructor() {
        this.words = this.loadWords();
        this.parseCardInfo();
        this.parseSubcategories();
    }
    static getInstance(): LearningDataManager {
        if (!LearningDataManager.instance) {
            LearningDataManager.instance = new LearningDataManager();
        }
        return LearningDataManager.instance;
    }
    // 初始化数据
    init(): void {
        this.parseCardInfo();
        this.parseSubcategories();
    }
    // 读取cardInfo.txt文件内容
    private readCardInfoFile(): string {
        // 返回完整的cardInfo.txt内容，包含所有主题和子分类
        return `### 一、食物类（100个）｜Food（100）｜食べ物（たべもの）
#### 水果｜Fruit｜果物（くだもの）
#### 蔬菜｜Vegetables｜野菜（やさい）
#### 主食｜Staple Foods｜主食（しゅしょく）
#### 零食&其他食物｜Snacks & Other Foods｜スナック＆その他の食べ物（すなっく＆そのたののたべもの）

### 二、动物类（100个）｜Animals（100）｜動物（どうぶつ）
#### 宠物｜Pets｜ペット（petto）
#### 农场动物｜Farm Animals｜農場の動物（のうじょうのどうぶつ）
#### 动物园动物｜Zoo Animals｜動物園の動物（どうぶつえんのどうぶつ）
#### 水生动物｜Aquatic Animals｜水生動物（すいせいどうぶつ）
#### 昆虫&小型动物｜Insects & Small Animals｜昆虫＆小型動物（こんちゅう＆こがたどうぶつ）

### 三、日常物品类（100个）｜Daily Items（100）｜日常用品（にちじょうようひん）
#### 厨房用品｜Kitchen Supplies｜キッチン用品（kitchin youhin）
#### 卧室用品｜Bedroom Supplies｜寝室用品（しんしつようひん）
#### 客厅用品｜Living Room Supplies｜リビング用品（ribingu youhin）
#### 洗漱用品｜Toiletries｜トイレタリー（toiretarī）
#### 其他日常物品｜Other Daily Items｜その他の日常用品（そのたのにちじょうようひん）

### 四、身体部位类（100个）｜Body Parts（100）｜体の部分（からだのぶぶん）
#### 头部｜Head｜頭部（ずつぶ，zutsubu）
#### 四肢｜Limbs｜四肢（しし，shishi）
#### 躯干｜Torso｜胴体（どうたい，doutai）
#### 其他｜Others｜その他（そのた，sonota）

### 五、颜色&形状类（100个）｜Colors & Shapes（100）｜色と形（いろとかたち）
#### 颜色｜Colors｜色（しょく，shoku）
#### 形状｜Shapes｜形（かたち，katachi）

### 六、交通工具类（100个）｜Vehicles（100）｜乗り物（のりもの）
#### 陆地｜Land｜陸上（りくじょう，rikujou）
#### 水上｜Water｜水上（すいじょう，suijou）
#### 空中｜Air｜空中（くうちゅう，kuuchuu）

### 七、家庭成员&称呼类（100个）｜Family & Titles（100）｜家族と敬称（かぞくとけいしょう）
#### 家庭成员｜Family Members｜家族（かぞく，kazoku）

### 八、动作类（100个）｜Actions（100）｜動作（どうさ）
#### 日常动作｜Daily Actions｜日常の動作（にちじょうのどうさ，nichijou no dousa）
#### 感官动作｜Sensory Actions｜感覚の動作（かんかくのどうさ，kankaku no dousa）
#### 互动动作｜Interactive Actions｜インタラクティブな動作（intarakutibu na dousa）
#### 生活动作｜Life Actions｜生活の動作（せいかつのどうさ，seikatsu no dousa）
#### 其他动作｜Other Actions｜その他の動作（そのたのどうさ，sonota no dousa）

### 九、场所类（100个）｜Places（100）｜場所（ばしょ）
#### 室内场所｜Indoor Places｜屋内（おくない）

### 十、自然事物类（100个）｜Natural Things（100）｜自然（しぜん）
#### 天气｜Weather｜天気（てんき）

### 十一、服饰类（100个）｜Clothing（100）｜服（ふく）
#### 上衣｜Tops｜上着（うわぎ）

### 十二、玩具类（100个）｜Toys（100）｜おもちゃ
#### 传统玩具｜Traditional Toys｜伝統的なおもちゃ（でんとうてきなおもちゃ）
#### 现代玩具｜Modern Toys｜現代のおもちゃ（げんだいのおもちゃ）
#### 户外玩具｜Outdoor Toys｜屋外のおもちゃ（おくがいのおもちゃ）
#### 益智玩具｜Educational Toys｜知育玩具（ちいくがんぐ）
#### 运动玩具｜Sports Toys｜スポーツ玩具（スポーツがんぐ）
#### 创意玩具｜Creative Toys｜創造的なおもちゃ（そうぞうてきなおもちゃ）
#### 电子玩具｜Electronic Toys｜電子玩具（でんしがんぐ）
#### 角色扮演玩具｜Role Play Toys｜ごっこ遊び（ごっこあそび）
#### 其他玩具｜Other Toys｜その他のおもちゃ（そのたのおもちゃ）`;
    }
    // 解析cardInfo.txt文件
    private parseCardInfo(): void {
        const cardInfoContent = this.readCardInfoFile();
        const lines = cardInfoContent.split('\n');
        const themeMap = new Map<string, ThemeData>();
        let themeIndex = 0;
        lines.forEach((line: string) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('### ')) {
                const parts = trimmedLine.substring(4).split('｜');
                if (parts.length >= 2) {
                    const chinesePart = parts[0].trim();
                    const chineseName = chinesePart.replace(/^[一二三四五六七八九十]+、/, '').replace(/（\d+个）/, '');
                    const themeId = this.generateThemeId(chineseName, themeIndex);
                    // 生成图标路径（使用第一个单词的图片）
                    const iconPath = this.generateIconPath(themeId);
                    // 生成颜色
                    const color = this.generateThemeColor(themeIndex);
                    themeMap.set(themeId, {
                        id: themeId as ThemeType,
                        name: chineseName,
                        icon: iconPath,
                        color: color,
                        totalWords: 0,
                        completedWords: 0,
                        isUnlocked: true
                    });
                    themeIndex++;
                }
            }
        });
        this.themes = Array.from(themeMap.values());
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
        };
        return themeIdMap[chineseName] || `theme_${index}`;
    }
    // 生成图标路径
    private generateIconPath(themeId: string): string {
        const iconMap: Record<string, string> = {
            'fruits': '$rawfile/CardOriginal/Food/Fruit/apple.png',
            'animals': '$rawfile/CardOriginal/Animals/Pets/dog.png',
            'daily_items': '$rawfile/CardOriginal/DailyItems/Kitchen/spoon.png',
            'body_parts': '$rawfile/CardOriginal/BodyParts/Head/eye.png',
            'colors_shapes': '$rawfile/CardOriginal/ColorsShapes/Colors/red.png',
            'vehicles': '$rawfile/CardOriginal/Vehicles/Land/car.png',
            'family': '$rawfile/CardOriginal/Family/FamilyMembers/father.png',
            'actions': '$rawfile/CardOriginal/Actions/DailyActions/walk.png',
            'places': '$rawfile/CardOriginal/Places/IndoorPlaces/home.png',
            'nature': '$rawfile/CardOriginal/Nature/Weather/sun.png',
            'clothing': '$rawfile/CardOriginal/Clothing/Tops/shirt.png',
            'toys': '$rawfile/CardOriginal/Toys/TraditionalToys/ball.png'
        };
        return iconMap[themeId] || '$rawfile/CardOriginal/Food/Fruit/apple.png';
    }
    // 解析子分类（####开头的行）
    private parseSubcategories(): void {
        const cardInfoContent = this.readCardInfoFile();
        const lines = cardInfoContent.split('\n');
        const subcategoryList: SubcategoryData[] = [];
        let currentTheme: string = '';
        let themeIndex: number = 0;
        lines.forEach((line: string) => {
            const trimmedLine = line.trim();
            // 记录当前主题
            if (trimmedLine.startsWith('### ')) {
                const parts = trimmedLine.substring(4).split('｜');
                if (parts.length >= 2) {
                    const chinesePart = parts[0].trim();
                    const chineseName = chinesePart.replace(/^[一二三四五六七八九十]+、/, '').replace(/（\d+个）/, '');
                    currentTheme = this.generateThemeId(chineseName, themeIndex);
                    themeIndex++;
                }
            }
            // 解析子分类
            if (trimmedLine.startsWith('#### ')) {
                const parts = trimmedLine.substring(5).split('｜');
                if (parts.length >= 2) {
                    const chinesePart = parts[0].trim();
                    const englishPart = parts[1].trim();
                    // 提取中文名称
                    const chineseName = chinesePart;
                    // 生成子分类ID
                    const subcategoryId = `${currentTheme}_${chineseName.toLowerCase().replace(/[&、]/g, '_')}`;
                    // 生成图标路径
                    const iconPath = this.generateSubcategoryIconPath(currentTheme, chineseName);
                    // 生成颜色
                    const color = this.generateSubcategoryColor(currentTheme);
                    subcategoryList.push({
                        id: subcategoryId,
                        name: chineseName,
                        icon: iconPath,
                        color: color,
                        themeId: currentTheme as ThemeType,
                        totalWords: 0,
                        completedWords: 0,
                        isUnlocked: true
                    });
                }
            }
        });
        this.subcategories = subcategoryList;
        console.log('Parsed subcategories:', this.subcategories.length);
    }
    // 加载单词数据
    private loadWords(): WordData[] {
        return [
            // 水果类
            { id: 'apple', english: 'Apple', chinese: '苹果', category: 'fruits', subcategory: '水果', image: '$rawfile/CardOriginal/Food/Fruit/apple.png', pronunciation: 'ˈæpəl' },
            { id: 'banana', english: 'Banana', chinese: '香蕉', category: 'fruits', subcategory: '水果', image: '$rawfile/CardOriginal/Food/Fruit/banana.png', pronunciation: 'bəˈnɑːnə' },
            { id: 'orange', english: 'Orange', chinese: '橙子', category: 'fruits', subcategory: '水果', image: '$rawfile/CardOriginal/Food/Fruit/orange.png', pronunciation: 'ˈɔːrɪndʒ' },
            // 动物类
            { id: 'dog', english: 'Dog', chinese: '狗', category: 'animals', subcategory: '宠物', image: '$rawfile/CardOriginal/Animals/Pets/dog.png', pronunciation: 'dɔːɡ' },
            { id: 'cat', english: 'Cat', chinese: '猫', category: 'animals', subcategory: '宠物', image: '$rawfile/CardOriginal/Animals/Pets/cat.png', pronunciation: 'kæt' },
            { id: 'bird', english: 'Bird', chinese: '鸟', category: 'animals', subcategory: '宠物', image: '$rawfile/CardOriginal/Animals/Pets/bird.png', pronunciation: 'bɜːrd' },
            // 日常物品类
            { id: 'book', english: 'Book', chinese: '书', category: 'daily_items', subcategory: '其他日常物品', image: '$rawfile/CardOriginal/DailyItems/OtherDailyItems/book.png', pronunciation: 'bʊk' },
            { id: 'pen', english: 'Pen', chinese: '笔', category: 'daily_items', subcategory: '其他日常物品', image: '$rawfile/CardOriginal/DailyItems/OtherDailyItems/pen.png', pronunciation: 'pen' },
            { id: 'phone', english: 'Phone', chinese: '电话', category: 'daily_items', subcategory: '其他日常物品', image: '$rawfile/CardOriginal/DailyItems/OtherDailyItems/phone.png', pronunciation: 'foʊn' },
            // 身体部位类
            { id: 'eye', english: 'Eye', chinese: '眼睛', category: 'body_parts', subcategory: '头部', image: '$rawfile/CardOriginal/BodyParts/Head/eye.png', pronunciation: 'aɪ' },
            { id: 'hand', english: 'Hand', chinese: '手', category: 'body_parts', subcategory: '四肢', image: '$rawfile/CardOriginal/BodyParts/Limbs/hand.png', pronunciation: 'hænd' },
            { id: 'foot', english: 'Foot', chinese: '脚', category: 'body_parts', subcategory: '四肢', image: '$rawfile/CardOriginal/BodyParts/Limbs/foot.png', pronunciation: 'fʊt' }
        ];
    }
    // 获取主题数据
    getThemes(): ThemeData[] {
        return this.themes;
    }
    // 根据主题获取单词
    getWordsByTheme(theme: ThemeType): WordData[] {
        const themeMap: Record<ThemeType, string> = {
            'fruits': 'fruits',
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
        };
        const category = themeMap[theme];
        return this.words.filter(word => word.category === category);
    }
    // 生成主题颜色
    generateThemeColor(index: number): string {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA'
        ];
        return colors[index % colors.length];
    }
    // 生成子分类图标路径
    private generateSubcategoryIconPath(themeId: string, subcategoryName: string): string {
        const iconMap: Record<string, string> = {
            'fruits': '$rawfile/CardOriginal/Food/Fruit/apple.png',
            'animals': '$rawfile/CardOriginal/Animals/Pets/dog.png',
            'daily_items': '$rawfile/CardOriginal/DailyItems/Kitchen/spoon.png',
            'body_parts': '$rawfile/CardOriginal/BodyParts/Head/eye.png',
            'colors_shapes': '$rawfile/CardOriginal/ColorsShapes/Colors/red.png',
            'vehicles': '$rawfile/CardOriginal/Vehicles/Land/car.png',
            'family': '$rawfile/CardOriginal/Family/FamilyMembers/father.png',
            'actions': '$rawfile/CardOriginal/Actions/DailyActions/walk.png',
            'places': '$rawfile/CardOriginal/Places/IndoorPlaces/home.png',
            'nature': '$rawfile/CardOriginal/Nature/Weather/sun.png',
            'clothing': '$rawfile/CardOriginal/Clothing/Tops/shirt.png',
            'toys': '$rawfile/CardOriginal/Toys/TraditionalToys/ball.png'
        };
        return iconMap[themeId] || '$rawfile/CardOriginal/Food/Fruit/apple.png';
    }
    // 生成子分类颜色
    private generateSubcategoryColor(themeId: string): string {
        const colorMap: Record<string, string> = {
            'fruits': '#FF6B6B',
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
        };
        return colorMap[themeId] || '#E0E0E0';
    }
    // 根据主题获取子分类
    getSubcategoriesByTheme(theme: ThemeType): SubcategoryData[] {
        const result = this.subcategories.filter(subcategory => subcategory.themeId === theme);
        console.log(`Subcategories for theme ${theme}:`, result.length, result.map(s => s.name));
        return result;
    }
}
