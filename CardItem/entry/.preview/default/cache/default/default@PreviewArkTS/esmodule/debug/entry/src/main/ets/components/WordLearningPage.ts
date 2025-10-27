if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WordLearningPage_Params {
    subcategoryId?: string;
    currentWordIndex?: number;
    words?: WordData[];
    subcategory?: SubcategoryData | undefined;
    isFlipped?: boolean;
    isPlaying?: boolean;
    currentMode?: 'listen' | 'speak' | 'read' | 'write' | 'normal';
    cardScale?: number;
    learningDataManager?;
}
import type { WordData, SubcategoryData } from '../types/CommonTypes';
import { LearningDataManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningDataManager&";
import { SpeechManager } from "@normalized:N&&&entry/src/main/ets/utils/SpeechManager&";
export class WordLearningPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__subcategoryId = new ObservedPropertySimplePU('', this, "subcategoryId");
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
        this.learningDataManager = LearningDataManager.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WordLearningPage_Params) {
        if (params.subcategoryId !== undefined) {
            this.subcategoryId = params.subcategoryId;
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
        if (params.learningDataManager !== undefined) {
            this.learningDataManager = params.learningDataManager;
        }
    }
    updateStateVars(params: WordLearningPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__subcategoryId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentWordIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__words.purgeDependencyOnElmtId(rmElmtId);
        this.__subcategory.purgeDependencyOnElmtId(rmElmtId);
        this.__isFlipped.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlaying.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__cardScale.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__subcategoryId.aboutToBeDeleted();
        this.__currentWordIndex.aboutToBeDeleted();
        this.__words.aboutToBeDeleted();
        this.__subcategory.aboutToBeDeleted();
        this.__isFlipped.aboutToBeDeleted();
        this.__isPlaying.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__cardScale.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __subcategoryId: ObservedPropertySimplePU<string>;
    get subcategoryId() {
        return this.__subcategoryId.get();
    }
    set subcategoryId(newValue: string) {
        this.__subcategoryId.set(newValue);
    }
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
        const word = this.getCurrentWord();
        if (!word) {
            console.error('没有当前单词');
            return;
        }
        // 1. 先播放一遍单词读音
        console.log('播放单词读音');
        await this.playPronunciation();
        // 2. 播放"XX用英语怎么说？"
        const question = `${word.chinese}用英语怎么说？`;
        console.log('播放问题:', question);
        await SpeechManager.speak(question);
        // 3. 开启麦克风录制
        await this.startRecording(word);
    }
    // 开始录音
    private async startRecording(word: WordData) {
        console.log('开始录音，单词:', word.english);
        try {
            // 这里需要实现录音功能
            // 由于HarmonyOS的录音API比较复杂，这里先提供一个框架
            console.log('录音功能待实现，10秒超时');
            // 模拟10秒录音
            setTimeout(() => {
                console.log('录音超时，停止录音');
                this.saveRecording(word);
            }, 10000);
        }
        catch (error) {
            console.error('录音失败:', error);
        }
    }
    // 保存录音文件
    private async saveRecording(word: WordData) {
        try {
            console.log('保存录音文件，单词:', word.english);
            // 构造文件路径
            const fileName = `${word.english}.wav`;
            const filePath = `/data/storage/el2/base/haps/entry/files/${fileName}`;
            console.log('录音文件路径:', filePath);
            // TODO: 实现实际的录音保存功能
            // 这里需要用到HarmonyOS的AudioRecorder API
        }
        catch (error) {
            console.error('保存录音失败:', error);
        }
    }
    // 进入阅读模式
    private enterReadMode() {
        this.currentMode = 'read';
        console.log('进入阅读模式');
        // 阅读模式：自动朗读单词
        this.playPronunciation();
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
            Column.debugLine("entry/src/main/ets/components/WordLearningPage.ets(242:5)", "entry");
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/components/WordLearningPage.ets(244:7)", "entry");
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height('10%');
            // 顶部导航栏
            Row.padding({ left: 20, right: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(245:9)", "entry");
            Button.fontSize(24);
            Button.fontColor('#333333');
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                console.log('返回按钮被点击 - 暂时禁用返回功能');
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/WordLearningPage.ets(253:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 显示当前模式
            if (this.currentMode !== 'normal') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getModeText());
                        Text.debugLine("entry/src/main/ets/components/WordLearningPage.ets(257:11)", "entry");
                        Text.fontSize(18);
                        Text.fontColor('#333333');
                        Text.margin({ left: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('×');
                        Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(262:11)", "entry");
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
            // 主要内容区域
            Row.create();
            Row.debugLine("entry/src/main/ets/components/WordLearningPage.ets(278:7)", "entry");
            // 主要内容区域
            Row.flexGrow(1);
            // 主要内容区域
            Row.padding({ left: 50, right: 50 });
            // 主要内容区域
            Row.onClick(() => {
                this.handleTap();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getCurrentWord()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 左侧：上一个按钮
                        Button.createWithLabel('←');
                        Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(281:11)", "entry");
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
                        Column.debugLine("entry/src/main/ets/components/WordLearningPage.ets(295:11)", "entry");
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
                        // 使用rawfile资源引用
                        Image.create({ "id": -1, "type": 30000, params: [this.getCurrentWord()!.image], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/components/WordLearningPage.ets(297:13)", "entry");
                        // 使用rawfile资源引用
                        Image.width(250);
                        // 使用rawfile资源引用
                        Image.height(250);
                        // 使用rawfile资源引用
                        Image.borderRadius(20);
                        // 使用rawfile资源引用
                        Image.objectFit(ImageFit.Cover);
                        // 使用rawfile资源引用
                        Image.alt({ "id": 16777216, "type": 20000, params: [], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                        // 使用rawfile资源引用
                        Image.onError(() => {
                            console.log(`图片加载失败: ${this.getCurrentWord()!.image}`);
                            // 尝试备用路径
                            console.log('尝试使用备用图片路径...');
                        });
                        // 使用rawfile资源引用
                        Image.onComplete(() => {
                            console.log(`图片加载成功: ${this.getCurrentWord()!.image}`);
                        });
                        // 使用rawfile资源引用
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
                        Column.debugLine("entry/src/main/ets/components/WordLearningPage.ets(341:11)", "entry");
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
                        Column.debugLine("entry/src/main/ets/components/WordLearningPage.ets(343:13)", "entry");
                        // 单词信息区域
                        Column.justifyContent(FlexAlign.Center);
                        // 单词信息区域
                        Column.flexGrow(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentWord()!.english);
                        Text.debugLine("entry/src/main/ets/components/WordLearningPage.ets(344:15)", "entry");
                        Text.fontSize(48);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 30 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentWord()!.chinese);
                        Text.debugLine("entry/src/main/ets/components/WordLearningPage.ets(350:15)", "entry");
                        Text.fontSize(36);
                        Text.fontColor('#FF6B6B');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentWord()!.pronunciation);
                        Text.debugLine("entry/src/main/ets/components/WordLearningPage.ets(356:15)", "entry");
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
                        Column.debugLine("entry/src/main/ets/components/WordLearningPage.ets(365:13)", "entry");
                        // 听说读写按钮区域
                        Column.margin({ top: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/WordLearningPage.ets(366:15)", "entry");
                        Row.justifyContent(FlexAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('听');
                        Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(367:17)", "entry");
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
                        Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(379:17)", "entry");
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
                        Button.createWithLabel('读');
                        Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(391:17)", "entry");
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
                        Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(403:17)", "entry");
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
                        Button.debugLine("entry/src/main/ets/components/WordLearningPage.ets(423:11)", "entry");
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
                        Column.debugLine("entry/src/main/ets/components/WordLearningPage.ets(437:11)", "entry");
                        // 没有单词时的提示
                        Column.justifyContent(FlexAlign.Center);
                        // 没有单词时的提示
                        Column.height(450);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777216, "type": 20000, params: [], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/components/WordLearningPage.ets(438:13)", "entry");
                        Image.width(200);
                        Image.height(200);
                        Image.opacity(0.5);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无单词数据');
                        Text.debugLine("entry/src/main/ets/components/WordLearningPage.ets(443:13)", "entry");
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
        // 主要内容区域
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WordLearningPage";
    }
}
registerNamedRoute(() => new WordLearningPage(undefined, {}), "", { bundleName: "com.example.studyenglishbycard", moduleName: "entry", pagePath: "components/WordLearningPage", pageFullPath: "entry/src/main/ets/components/WordLearningPage", integratedHsp: "false", moduleType: "followWithHap" });
