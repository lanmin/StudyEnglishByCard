if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WordLearningPage_Params {
    subcategoryId?: string;
    onBack?: () => void;
    currentWordIndex?: number;
    words?: WordData[];
    subcategory?: SubcategoryData | undefined;
    isFlipped?: boolean;
    isPlaying?: boolean;
    currentMode?: 'listen' | 'speak' | 'read' | 'write' | 'normal';
    cardScale?: number;
    imageError?: boolean;
    micIconScale?: number;
    showHearGif?: boolean;
    testOptions?: WordData[];
    selectedTestOption?: number;
    testCorrectAnswerShown?: boolean;
    learningDataManager?;
}
import type { WordData, SubcategoryData } from '../types/CommonTypes';
import { LearningDataManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningDataManager&";
import { SpeechManager } from "@normalized:N&&&entry/src/main/ets/utils/SpeechManager&";
import { AudioRecorderManager } from "@normalized:N&&&entry/src/main/ets/utils/AudioRecorderManager&";
export class WordLearningPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.subcategoryId = '';
        this.onBack = undefined;
        this.__currentWordIndex = new ObservedPropertySimplePU(0, this, "currentWordIndex");
        this.__words = new ObservedPropertyObjectPU([], this, "words");
        this.__subcategory = new ObservedPropertyObjectPU(undefined, this, "subcategory");
        this.__isFlipped = new ObservedPropertySimplePU(false, this, "isFlipped");
        this.__isPlaying = new ObservedPropertySimplePU(false
        // 听说读写模式状态
        , this, "isPlaying");
        this.__currentMode = new ObservedPropertySimplePU('normal', this, "currentMode");
        this.__cardScale = new ObservedPropertySimplePU(1 // 卡片缩放状态
        , this, "cardScale");
        this.__imageError = new ObservedPropertySimplePU(false // 图片加载失败状态
        , this, "imageError");
        this.__micIconScale = new ObservedPropertySimplePU(1 // 麦克风图标缩放状态
        , this, "micIconScale");
        this.__showHearGif = new ObservedPropertySimplePU(false // 是否显示听音GIF
        , this, "showHearGif");
        this.__testOptions = new ObservedPropertyObjectPU([] // 测试选项（3个单词）
        , this, "testOptions");
        this.__selectedTestOption = new ObservedPropertySimplePU(-1 // 选中的选项索引
        , this, "selectedTestOption");
        this.__testCorrectAnswerShown = new ObservedPropertySimplePU(false // 是否正确答案已显示
        , this, "testCorrectAnswerShown");
        this.learningDataManager = LearningDataManager.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WordLearningPage_Params) {
        if (params.subcategoryId !== undefined) {
            this.subcategoryId = params.subcategoryId;
        }
        if (params.onBack !== undefined) {
            this.onBack = params.onBack;
        }
        if (params.currentWordIndex !== undefined) {
            this.currentWordIndex = params.currentWordIndex;
        }
        if (params.words !== undefined) {
            this.words = params.words;
        }
        if (params.subcategory !== undefined) {
            this.subcategory = params.subcategory;
        }
        if (params.isFlipped !== undefined) {
            this.isFlipped = params.isFlipped;
        }
        if (params.isPlaying !== undefined) {
            this.isPlaying = params.isPlaying;
        }
        if (params.currentMode !== undefined) {
            this.currentMode = params.currentMode;
        }
        if (params.cardScale !== undefined) {
            this.cardScale = params.cardScale;
        }
        if (params.imageError !== undefined) {
            this.imageError = params.imageError;
        }
        if (params.micIconScale !== undefined) {
            this.micIconScale = params.micIconScale;
        }
        if (params.showHearGif !== undefined) {
            this.showHearGif = params.showHearGif;
        }
        if (params.testOptions !== undefined) {
            this.testOptions = params.testOptions;
        }
        if (params.selectedTestOption !== undefined) {
            this.selectedTestOption = params.selectedTestOption;
        }
        if (params.testCorrectAnswerShown !== undefined) {
            this.testCorrectAnswerShown = params.testCorrectAnswerShown;
        }
        if (params.learningDataManager !== undefined) {
            this.learningDataManager = params.learningDataManager;
        }
    }
    updateStateVars(params: WordLearningPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentWordIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__words.purgeDependencyOnElmtId(rmElmtId);
        this.__subcategory.purgeDependencyOnElmtId(rmElmtId);
        this.__isFlipped.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlaying.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__cardScale.purgeDependencyOnElmtId(rmElmtId);
        this.__imageError.purgeDependencyOnElmtId(rmElmtId);
        this.__micIconScale.purgeDependencyOnElmtId(rmElmtId);
        this.__showHearGif.purgeDependencyOnElmtId(rmElmtId);
        this.__testOptions.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedTestOption.purgeDependencyOnElmtId(rmElmtId);
        this.__testCorrectAnswerShown.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentWordIndex.aboutToBeDeleted();
        this.__words.aboutToBeDeleted();
        this.__subcategory.aboutToBeDeleted();
        this.__isFlipped.aboutToBeDeleted();
        this.__isPlaying.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__cardScale.aboutToBeDeleted();
        this.__imageError.aboutToBeDeleted();
        this.__micIconScale.aboutToBeDeleted();
        this.__showHearGif.aboutToBeDeleted();
        this.__testOptions.aboutToBeDeleted();
        this.__selectedTestOption.aboutToBeDeleted();
        this.__testCorrectAnswerShown.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private subcategoryId: string;
    private onBack?: () => void;
    private __currentWordIndex: ObservedPropertySimplePU<number>;
    get currentWordIndex() {
        return this.__currentWordIndex.get();
    }
    set currentWordIndex(newValue: number) {
        this.__currentWordIndex.set(newValue);
    }
    private __words: ObservedPropertyObjectPU<WordData[]>;
    get words() {
        return this.__words.get();
    }
    set words(newValue: WordData[]) {
        this.__words.set(newValue);
    }
    private __subcategory: ObservedPropertyObjectPU<SubcategoryData | undefined>;
    get subcategory() {
        return this.__subcategory.get();
    }
    set subcategory(newValue: SubcategoryData | undefined) {
        this.__subcategory.set(newValue);
    }
    private __isFlipped: ObservedPropertySimplePU<boolean>;
    get isFlipped() {
        return this.__isFlipped.get();
    }
    set isFlipped(newValue: boolean) {
        this.__isFlipped.set(newValue);
    }
    private __isPlaying: ObservedPropertySimplePU<boolean>;
    get isPlaying() {
        return this.__isPlaying.get();
    }
    set isPlaying(newValue: boolean) {
        this.__isPlaying.set(newValue);
    }
    // 听说读写模式状态
    private __currentMode: ObservedPropertySimplePU<'listen' | 'speak' | 'read' | 'write' | 'normal'>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: 'listen' | 'speak' | 'read' | 'write' | 'normal') {
        this.__currentMode.set(newValue);
    }
    private __cardScale: ObservedPropertySimplePU<number>; // 卡片缩放状态
    get cardScale() {
        return this.__cardScale.get();
    }
    set cardScale(newValue: number) {
        this.__cardScale.set(newValue);
    }
    private __imageError: ObservedPropertySimplePU<boolean>; // 图片加载失败状态
    get imageError() {
        return this.__imageError.get();
    }
    set imageError(newValue: boolean) {
        this.__imageError.set(newValue);
    }
    private __micIconScale: ObservedPropertySimplePU<number>; // 麦克风图标缩放状态
    get micIconScale() {
        return this.__micIconScale.get();
    }
    set micIconScale(newValue: number) {
        this.__micIconScale.set(newValue);
    }
    private __showHearGif: ObservedPropertySimplePU<boolean>; // 是否显示听音GIF
    get showHearGif() {
        return this.__showHearGif.get();
    }
    set showHearGif(newValue: boolean) {
        this.__showHearGif.set(newValue);
    }
    private __testOptions: ObservedPropertyObjectPU<WordData[]>; // 测试选项（3个单词）
    get testOptions() {
        return this.__testOptions.get();
    }
    set testOptions(newValue: WordData[]) {
        this.__testOptions.set(newValue);
    }
    private __selectedTestOption: ObservedPropertySimplePU<number>; // 选中的选项索引
    get selectedTestOption() {
        return this.__selectedTestOption.get();
    }
    set selectedTestOption(newValue: number) {
        this.__selectedTestOption.set(newValue);
    }
    private __testCorrectAnswerShown: ObservedPropertySimplePU<boolean>; // 是否正确答案已显示
    get testCorrectAnswerShown() {
        return this.__testCorrectAnswerShown.get();
    }
    set testCorrectAnswerShown(newValue: boolean) {
        this.__testCorrectAnswerShown.set(newValue);
    }
    private learningDataManager;
    aboutToAppear() {
        // 初始化TTS
        SpeechManager.init();
        this.loadWords();
    }
    aboutToDisappear() {
        // 清理TTS资源
        SpeechManager.destroy();
    }
    // 加载单词数据
    private loadWords() {
        console.log(`WordLearningPage: 开始加载子分类 ${this.subcategoryId}`);
        this.subcategory = this.learningDataManager.getSubcategoryById(this.subcategoryId);
        this.words = this.learningDataManager.getWordsBySubcategory(this.subcategoryId);
        this.currentWordIndex = 0;
        this.isFlipped = false;
        this.imageError = false; // 重置图片加载错误状态
        console.log(`WordLearningPage: 加载完成，子分类: ${this.subcategory?.name}, 单词数量: ${this.words.length}`);
        if (this.words.length > 0) {
            const firstWord = this.words[0];
            console.log(`WordLearningPage: 第一个单词: ${firstWord.english} - ${firstWord.chinese}`);
            console.log(`WordLearningPage: 第一个单词图片路径: ${firstWord.image}`);
        }
        else {
            console.log(`WordLearningPage: 警告 - 没有找到单词数据！`);
        }
    }
    // 获取当前单词
    private getCurrentWord(): WordData | undefined {
        return this.words[this.currentWordIndex];
    }
    // 获取子分类的英文名称
    private getSubcategoryEnglishName(): string {
        return this.learningDataManager.getSubcategoryEnglishName(this.subcategoryId);
    }
    // 播放单词发音
    private async playPronunciation() {
        console.info('🎵 playPronunciation被调用');
        const word = this.getCurrentWord();
        console.info('当前单词:', word ? word.english : '无');
        console.info('isPlaying状态:', this.isPlaying);
        if (!word || this.isPlaying) {
            console.warn('跳过播放 - word为空或正在播放');
            return;
        }
        this.isPlaying = true;
        console.info('准备调用SpeechManager.speak, 单词:', word.english);
        try {
            await SpeechManager.speak(word.english);
            console.info('✅ SpeechManager.speak完成');
        }
        finally {
            this.isPlaying = false;
            console.info('isPlaying已重置为false');
        }
    }
    // 翻转卡片
    private flipCard() {
        this.isFlipped = !this.isFlipped;
        console.log(`卡片翻转状态: ${this.isFlipped}`);
        if (this.getCurrentWord()) {
            console.log(`当前单词: ${this.getCurrentWord()!.english} - ${this.getCurrentWord()!.chinese}`);
        }
    }
    // 下一个单词
    private nextWord() {
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++;
            this.isFlipped = false;
        }
    }
    // 上一个单词
    private prevWord() {
        if (this.currentWordIndex > 0) {
            this.currentWordIndex--;
            this.isFlipped = false;
        }
    }
    // 处理点击事件：翻转卡片并播放发音
    private handleTap() {
        this.flipCard();
        this.playPronunciation();
    }
    // 进入听力模式
    private enterListenMode() {
        this.currentMode = 'listen';
        console.log('进入听力模式');
        // 显示hearWord.gif，持续2秒
        this.showHearGif = true;
        setTimeout(() => {
            this.showHearGif = false;
        }, 2000);
        // 卡片缩放动画：缩小再放大
        this.animateCardScale();
        // 自动播放当前单词的发音
        this.playPronunciation();
    }
    // 卡片缩放动画
    private animateCardScale() {
        // 缩小到0.8
        this.cardScale = 0.8;
        // 延迟后恢复到1
        setTimeout(() => {
            this.cardScale = 1;
        }, 200);
    }
    // 进入口语模式
    private async enterSpeakMode() {
        this.currentMode = 'speak';
        console.log('进入口语模式');
        // 开始麦克风图标动画
        this.startMicIconAnimation();
        const word = this.getCurrentWord();
        if (!word) {
            console.error('没有当前单词');
            return;
        }
        // 1. 先播放一遍单词读音
        console.log('播放单词读音');
        // await this.playPronunciation()
        // 2. 播放"XX用英语怎么说？"
        const question = `${word.chinese}用英语怎么说？`;
        console.log('播放问题:', question);
        await SpeechManager.speak(question);
        // 3. 开启麦克风录制
        await this.startRecording(word);
    }
    // 开始麦克风图标动画
    private startMicIconAnimation() {
        // 创建循环动画：从1.0缩放到1.3，再回到1.0
        const animation = () => {
            this.micIconScale = 1.2;
            setTimeout(() => {
                this.micIconScale = 1.0;
            }, 500);
        };
        // 立即执行一次
        animation();
        // 每1秒重复一次
        const intervalId = setInterval(() => {
            if (this.currentMode === 'speak') {
                animation();
            }
            else {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    // 开始录音
    private async startRecording(word: WordData) {
        console.log('开始录音，单词:', word.english);
        console.log('当前模式:', this.currentMode);
        try {
            console.log('准备调用AudioRecorderManager.startRecord');
            // 开始录音
            const result = await AudioRecorderManager.startRecord(word.english);
            console.log('录音已开始，单词:', word.english, '返回结果:', result);
            // 5秒后自动停止录音
            setTimeout(async () => {
                console.log('录音超时（5秒），停止录音');
                await this.stopRecording(word);
            }, 5000);
        }
        catch (error) {
            console.error('录音失败:', error);
        }
    }
    // 停止录音
    private async stopRecording(word: WordData) {
        try {
            // 停止录音
            const uri = await AudioRecorderManager.stopRecord();
            console.log('录音已停止，文件URI:', uri);
            if (uri) {
                console.log(`录音文件已保存: ${word.english}.wav`);
            }
            // 恢复界面
            this.currentMode = 'normal';
            console.log('说话模式已结束，恢复界面');
        }
        catch (error) {
            console.error('停止录音失败:', error);
        }
    }
    // 进入测试模式
    private async enterReadMode() {
        this.currentMode = 'read';
        console.log('进入测试模式');
        const correctWord = this.getCurrentWord();
        if (!correctWord) {
            console.error('没有当前单词');
            return;
        }
        // 生成3个选项：1个正确 + 2个错误
        this.generateTestOptions(correctWord);
        // 播放问题："哪个是沙发Sofa？"
        const question = `哪个是${correctWord.chinese}${correctWord.english}？`;
        await SpeechManager.speak(question);
    }
    // 生成测试选项
    private generateTestOptions(correctWord: WordData) {
        const options: WordData[] = [correctWord];
        // 从其他单词中随机选择2个作为干扰项
        const otherWords = this.words.filter(w => w.english !== correctWord.english);
        // 随机打乱
        const shuffled = otherWords.sort(() => Math.random() - 0.5);
        // 添加2个干扰项
        for (let i = 0; i < 2 && i < shuffled.length; i++) {
            options.push(shuffled[i]);
        }
        // 随机打乱选项顺序
        const shuffledOptions = options.sort(() => Math.random() - 0.5);
        this.testOptions = shuffledOptions;
        this.selectedTestOption = -1;
        this.testCorrectAnswerShown = false;
        console.log('测试选项生成:', shuffledOptions.map(w => w.english));
    }
    // 选择测试选项
    private async selectTestOption(index: number) {
        if (this.testCorrectAnswerShown) {
            return; // 正确答案已显示，不允许再选择
        }
        this.selectedTestOption = index;
        console.log('选择了选项:', index);
        const correctWord = this.getCurrentWord();
        const isCorrect = index === this.testOptions.findIndex(w => w.english === correctWord?.english);
        // 等待一小段时间后播放声音
        setTimeout(async () => {
            if (isCorrect) {
                // 选择正确 - 播放欢呼声
                console.log('✅ 选择正确！');
                this.testCorrectAnswerShown = true;
                await SpeechManager.speak('答对了，你真棒！');
                // 自动返回学习页面
                setTimeout(() => {
                    this.currentMode = 'normal';
                }, 1000);
            }
            else {
                // 选择错误 - 清除选择，允许重新选择
                console.log('❌ 选择错误！');
                await SpeechManager.speak('再试试吧');
                // 清空选择，让用户可以重选
                this.selectedTestOption = -1;
            }
        }, 300);
    }
    // 进入书写模式
    private enterWriteMode() {
        this.currentMode = 'write';
        console.log('进入书写模式');
        // TODO: 实现拼写练习功能
    }
    // 退出学习模式
    private exitMode() {
        this.currentMode = 'normal';
    }
    // 获取模式文本
    private getModeText(): string {
        switch (this.currentMode) {
            case 'listen':
                return '听力模式';
            case 'speak':
                return '口语模式';
            case 'read':
                return '阅读模式';
            case 'write':
                return '书写模式';
            default:
                return '';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height('10%');
            // 顶部导航栏
            Row.padding({ left: 20, right: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.fontSize(24);
            Button.fontColor('#333333');
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                console.log('返回按钮被点击 - 返回子分类选择页面');
                if (this.onBack) {
                    this.onBack();
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 显示当前模式
            if (this.currentMode !== 'normal') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getModeText());
                        Text.fontSize(18);
                        Text.fontColor('#333333');
                        Text.margin({ left: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('×');
                        Button.fontSize(20);
                        Button.fontColor('#333333');
                        Button.backgroundColor(Color.Transparent);
                        Button.width(50);
                        Button.height(40);
                        Button.onClick(() => {
                            this.exitMode();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 主要内容区域
            if (this.currentMode === 'read') {
                this.ifElseBranchUpdateFunction(0, () => {
                    // 测试模式显示
                    this.buildTestMode.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    // 常规模式显示
                    this.buildNormalMode.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    buildTestMode(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('90%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('听音选择正确的图片');
            Text.fontSize(24);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 30 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 3个选项
            Row.create();
            // 3个选项
            Row.justifyContent(FlexAlign.Center);
            // 3个选项
            Row.width('100%');
            // 3个选项
            Row.flexGrow(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const option = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.margin({ right: 10 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": -1, "type": 30000, params: [option.image], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                    Image.width(150);
                    Image.height(150);
                    Image.borderRadius(15);
                    Image.objectFit(ImageFit.Cover);
                    Image.border({
                        width: this.selectedTestOption === index ? 5 : 0,
                        color: this.selectedTestOption === index
                            ? (index === this.testOptions.findIndex(w => w.english === this.getCurrentWord()?.english) ? '#00FF00' : '#FF0000')
                            : '#000000',
                        style: BorderStyle.Solid
                    });
                    Image.onClick(() => {
                        this.selectTestOption(index);
                    });
                }, Image);
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.testOptions, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 3个选项
        Row.pop();
        Column.pop();
    }
    buildNormalMode(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.flexGrow(1);
            Row.padding({ left: 50, right: 50 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getCurrentWord()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 左侧：上一个按钮
                        Button.createWithLabel('←');
                        // 左侧：上一个按钮
                        Button.fontSize(40);
                        // 左侧：上一个按钮
                        Button.fontColor('#FFFFFF');
                        // 左侧：上一个按钮
                        Button.backgroundColor('#FF0000');
                        // 左侧：上一个按钮
                        Button.borderRadius(15);
                        // 左侧：上一个按钮
                        Button.width(60);
                        // 左侧：上一个按钮
                        Button.height(60);
                        // 左侧：上一个按钮
                        Button.enabled(this.currentWordIndex > 0);
                        // 左侧：上一个按钮
                        Button.onClick(() => {
                            this.prevWord();
                        });
                        // 左侧：上一个按钮
                        Button.alignSelf(ItemAlign.Center);
                    }, Button);
                    // 左侧：上一个按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 中间：单词卡片
                        Column.create();
                        Context.animation({ duration: 600, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal });
                        // 中间：单词卡片
                        Column.rotate({ angle: this.isFlipped ? 180 : 0, x: 0, y: 1, z: 0 });
                        Context.animation(null);
                        Context.animation({ duration: 300, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal });
                        // 中间：单词卡片
                        Column.scale({ x: this.cardScale, y: this.cardScale });
                        Context.animation(null);
                        // 中间：单词卡片
                        Column.width(350);
                        // 中间：单词卡片
                        Column.padding({ bottom: 0 });
                        // 中间：单词卡片
                        Column.height('90%');
                        // 中间：单词卡片
                        Column.justifyContent(FlexAlign.Center);
                        // 中间：单词卡片
                        Column.borderRadius(25);
                        // 中间：单词卡片
                        Column.shadow({
                            radius: 10,
                            color: '#00000020',
                            offsetX: 0,
                            offsetY: 5
                        });
                        // 中间：单词卡片
                        Column.onClick(() => {
                            this.flipCard();
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.create(this.imageError ? { "id": 0, "type": 30000, params: ['CardOriginal/DefaultImg.png'], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" } : { "id": -1, "type": 30000, params: [this.getCurrentWord()!.image], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.width(250);
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.height(250);
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.borderRadius(20);
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.objectFit(ImageFit.Cover);
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.onError(() => {
                            console.log(`图片加载失败: ${this.getCurrentWord()!.image}`);
                            console.log('使用DefaultImg.png作为占位图');
                            this.imageError = true;
                        });
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.onComplete(() => {
                            console.log(`图片加载成功: ${this.getCurrentWord()!.image}`);
                            this.imageError = false;
                        });
                        // 使用rawfile资源引用，如果图片加载失败则使用DefaultImg.png
                        Image.onClick(() => {
                            this.handleTap();
                        });
                        Gesture.create(GesturePriority.Low);
                        LongPressGesture.create({ repeat: true });
                        LongPressGesture.onAction(() => {
                            this.flipCard();
                        });
                        LongPressGesture.pop();
                        Gesture.pop();
                    }, Image);
                    // 中间：单词卡片
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 右侧：英文和中文显示区域 + 听说读写按钮
                        Column.create();
                        // 右侧：英文和中文显示区域 + 听说读写按钮
                        Column.justifyContent(FlexAlign.Center);
                        // 右侧：英文和中文显示区域 + 听说读写按钮
                        Column.flexGrow(1);
                        // 右侧：英文和中文显示区域 + 听说读写按钮
                        Column.padding({ left: 30 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 单词信息区域
                        Column.create();
                        // 单词信息区域
                        Column.justifyContent(FlexAlign.Center);
                        // 单词信息区域
                        Column.flexGrow(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentWord()!.english);
                        Text.fontSize(48);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 30 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentWord()!.chinese);
                        Text.fontSize(36);
                        Text.fontColor('#FF6B6B');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentWord()!.pronunciation);
                        Text.fontSize(24);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    // 单词信息区域
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 听说读写按钮区域
                        Column.create();
                        // 听说读写按钮区域
                        Column.margin({ top: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 录音图标（仅在说话模式下显示）
                        if (this.currentMode === 'speak') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 0, "type": 30000, params: ['CardOriginal/Wave.png'], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                                    Context.animation({ duration: 500, curve: Curve.EaseInOut, iterations: 1, playMode: PlayMode.Normal });
                                    Image.width(60);
                                    Image.height(40);
                                    Image.objectFit(ImageFit.Fill);
                                    Image.margin({ bottom: 10 });
                                    Image.scale({ x: this.micIconScale, y: this.micIconScale });
                                    Context.animation(null);
                                }, Image);
                            });
                        }
                        // 听音图标（仅在听力模式下显示）
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 听音图标（仅在听力模式下显示）
                        if (this.showHearGif) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 0, "type": 30000, params: ['hearWord.gif'], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                                    Image.width(60);
                                    Image.height(40);
                                    Image.objectFit(ImageFit.Fill);
                                    Image.margin({ bottom: 10 });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.justifyContent(FlexAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('听');
                        Button.fontSize(18);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(this.currentMode === 'listen' ? '#FF0000' : '#FF6B6B');
                        Button.borderRadius(20);
                        Button.width(60);
                        Button.height(50);
                        Button.margin({ right: 10 });
                        Button.onClick(() => {
                            this.enterListenMode();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('说');
                        Button.fontSize(18);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(this.currentMode === 'speak' ? '#00BFA5' : '#4ECDC4');
                        Button.borderRadius(20);
                        Button.width(60);
                        Button.height(50);
                        Button.margin({ right: 10 });
                        Button.onClick(() => {
                            this.enterSpeakMode();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('测');
                        Button.fontSize(18);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(this.currentMode === 'read' ? '#0277BD' : '#45B7D1');
                        Button.borderRadius(20);
                        Button.width(60);
                        Button.height(50);
                        Button.margin({ right: 10 });
                        Button.onClick(() => {
                            this.enterReadMode();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('写');
                        Button.fontSize(18);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(this.currentMode === 'write' ? '#009688' : '#96CEB4');
                        Button.borderRadius(20);
                        Button.width(60);
                        Button.height(50);
                        Button.onClick(() => {
                            this.enterWriteMode();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    // 听说读写按钮区域
                    Column.pop();
                    // 右侧：英文和中文显示区域 + 听说读写按钮
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 最右侧：下一个按钮
                        Button.createWithLabel('→');
                        // 最右侧：下一个按钮
                        Button.fontSize(40);
                        // 最右侧：下一个按钮
                        Button.fontColor('#FFFFFF');
                        // 最右侧：下一个按钮
                        Button.backgroundColor('#FF0000');
                        // 最右侧：下一个按钮
                        Button.borderRadius(15);
                        // 最右侧：下一个按钮
                        Button.width(60);
                        // 最右侧：下一个按钮
                        Button.height(60);
                        // 最右侧：下一个按钮
                        Button.enabled(this.currentWordIndex < this.words.length - 1);
                        // 最右侧：下一个按钮
                        Button.onClick(() => {
                            this.nextWord();
                        });
                        // 最右侧：下一个按钮
                        Button.alignSelf(ItemAlign.Center);
                    }, Button);
                    // 最右侧：下一个按钮
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 没有单词时的提示
                        Column.create();
                        // 没有单词时的提示
                        Column.justifyContent(FlexAlign.Center);
                        // 没有单词时的提示
                        Column.height(450);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777218, "type": 20000, params: [], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                        Image.width(200);
                        Image.height(200);
                        Image.opacity(0.5);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无单词数据');
                        Text.fontSize(24);
                        Text.fontColor('#999999');
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
                    // 没有单词时的提示
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
