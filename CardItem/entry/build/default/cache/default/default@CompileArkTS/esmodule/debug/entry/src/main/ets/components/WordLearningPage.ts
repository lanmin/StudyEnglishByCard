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
    learningDataManager?;
    ttsManager?;
}
import type { WordData, SubcategoryData } from '../types/CommonTypes';
import { LearningDataManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningDataManager&";
import { TTSManager } from "@normalized:N&&&entry/src/main/ets/utils/TTSManager&";
export class WordLearningPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__subcategoryId = new SynchedPropertySimpleOneWayPU(params.subcategoryId, this, "subcategoryId");
        this.__currentWordIndex = new ObservedPropertySimplePU(0, this, "currentWordIndex");
        this.__words = new ObservedPropertyObjectPU([], this, "words");
        this.__subcategory = new ObservedPropertyObjectPU(undefined, this, "subcategory");
        this.__isFlipped = new ObservedPropertySimplePU(false, this, "isFlipped");
        this.__isPlaying = new ObservedPropertySimplePU(false, this, "isPlaying");
        this.learningDataManager = LearningDataManager.getInstance();
        this.ttsManager = TTSManager.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WordLearningPage_Params) {
        if (params.subcategoryId === undefined) {
            this.__subcategoryId.set('');
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
        if (params.learningDataManager !== undefined) {
            this.learningDataManager = params.learningDataManager;
        }
        if (params.ttsManager !== undefined) {
            this.ttsManager = params.ttsManager;
        }
    }
    updateStateVars(params: WordLearningPage_Params) {
        this.__subcategoryId.reset(params.subcategoryId);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__subcategoryId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentWordIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__words.purgeDependencyOnElmtId(rmElmtId);
        this.__subcategory.purgeDependencyOnElmtId(rmElmtId);
        this.__isFlipped.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlaying.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__subcategoryId.aboutToBeDeleted();
        this.__currentWordIndex.aboutToBeDeleted();
        this.__words.aboutToBeDeleted();
        this.__subcategory.aboutToBeDeleted();
        this.__isFlipped.aboutToBeDeleted();
        this.__isPlaying.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __subcategoryId: SynchedPropertySimpleOneWayPU<string>;
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
    private learningDataManager;
    private ttsManager;
    aboutToAppear() {
        this.loadWords();
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
        const word = this.getCurrentWord();
        if (!word || this.isPlaying)
            return;
        this.isPlaying = true;
        try {
            await this.ttsManager.speakWord(word.english);
        }
        finally {
            this.isPlaying = false;
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
                console.log('返回按钮被点击 - 暂时禁用返回功能');
            });
        }, Button);
        Button.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主要内容区域
            Row.create();
            // 主要内容区域
            Row.flexGrow(1);
            // 主要内容区域
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
                        Button.alignSelf(ItemAlign.End);
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
                        // 使用rawfile资源引用
                        Image.width(250);
                        // 使用rawfile资源引用
                        Image.height(250);
                        // 使用rawfile资源引用
                        Image.borderRadius(20);
                        // 使用rawfile资源引用
                        Image.objectFit(ImageFit.Cover);
                        // 使用rawfile资源引用
                        Image.alt({ "id": 16777218, "type": 20000, params: [], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
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
                            this.playPronunciation();
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
                        // 右侧：英文和中文显示区域
                        Column.create();
                        // 右侧：英文和中文显示区域
                        Column.justifyContent(FlexAlign.Center);
                        // 右侧：英文和中文显示区域
                        Column.flexGrow(1);
                        // 右侧：英文和中文显示区域
                        Column.padding({ left: 30 });
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('播放发音');
                        Button.fontSize(20);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('#4ECDC4');
                        Button.borderRadius(25);
                        Button.width(120);
                        Button.height(50);
                        Button.onClick(() => {
                            this.playPronunciation();
                        });
                    }, Button);
                    Button.pop();
                    // 右侧：英文和中文显示区域
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 最右侧：下一个按钮
                        Button.createWithLabel('→');
                        // 最右侧：下一个按钮
                        Button.fontSize(40);
                        // 最右侧：下一个按钮
                        Button.fontColor('#FFFFFF');
                        // 最右侧：下一个按钮
                        Button.backgroundColor('#0000FF');
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
                        Button.alignSelf(ItemAlign.End);
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
