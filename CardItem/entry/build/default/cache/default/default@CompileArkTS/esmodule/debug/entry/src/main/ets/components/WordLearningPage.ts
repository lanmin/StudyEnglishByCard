if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WordLearningPage_Params {
    subcategoryId?: string;
    onBack?: () => void;
    // 允许外部指定初始模式（从主题页进入挑战）
    initialMode?: 'normal' | 'challenge';
    currentWordIndex?: number;
    words?: WordData[];
    subcategory?: SubcategoryData | undefined;
    isFlipped?: boolean;
    isPlaying?: boolean;
    currentMode?: 'listen' | 'speak' | 'read' | 'write' | 'challenge' | 'normal';
    cardScale?: number;
    imageError?: boolean;
    micIconScale?: number;
    showHearGif?: boolean;
    testOptions?: WordData[];
    selectedTestOption?: number;
    testCorrectAnswerShown?: boolean;
    drawingPaths?: string;
    testImageScales?: number[];
    challengeOptions?: WordData[];
    challengeSelectedIndex?: number;
    challengeCorrectCount?: number;
    challengeAnswerShown?: boolean;
    learningDataManager?;
    learningProgressManager?;
    draggedLetters?: string[];
    isWriteCorrect?: boolean;
    completedModes?: string[];
    _challengeCurrentWord?: WordData;
}
import type { WordData, SubcategoryData, ThemeType } from '../types/CommonTypes';
import { LearningDataManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningDataManager&";
import { SpeechManager } from "@normalized:N&&&entry/src/main/ets/utils/SpeechManager&";
import { AudioRecorderManager } from "@normalized:N&&&entry/src/main/ets/utils/AudioRecorderManager&";
import { LearningProgressManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningProgressManager&";
interface TouchPoint {
    x: number;
    y: number;
}
export class WordLearningPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.subcategoryId = '';
        this.onBack = undefined;
        this.initialMode = 'normal';
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
        this.__drawingPaths = new ObservedPropertySimplePU('' // 绘制的路径数据
        , this, "drawingPaths");
        this.__testImageScales = new ObservedPropertyObjectPU([1, 1, 1] // 测试模式三个选项的缩放状态
        // 挑战模式状态
        , this, "testImageScales");
        this.__challengeOptions = new ObservedPropertyObjectPU([] // 当前题目的3个选项
        , this, "challengeOptions");
        this.__challengeSelectedIndex = new ObservedPropertySimplePU(-1 // 选中项
        , this, "challengeSelectedIndex");
        this.__challengeCorrectCount = new ObservedPropertySimplePU(0 // 累计答对题数
        , this, "challengeCorrectCount");
        this.__challengeAnswerShown = new ObservedPropertySimplePU(false // 是否已揭示答案
        , this, "challengeAnswerShown");
        this.learningDataManager = LearningDataManager.getInstance();
        this.learningProgressManager = LearningProgressManager.getInstance();
        this.__draggedLetters = new ObservedPropertyObjectPU([], this, "draggedLetters");
        this.__isWriteCorrect = new ObservedPropertySimplePU(false // 是否拼写正确
        , this, "isWriteCorrect");
        this.__completedModes = new ObservedPropertyObjectPU([] // 已完成的功能模式（听、说、测、写）
        , this, "completedModes");
        this._challengeCurrentWord = undefined;
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
        if (params.initialMode !== undefined) {
            this.initialMode = params.initialMode;
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
        if (params.drawingPaths !== undefined) {
            this.drawingPaths = params.drawingPaths;
        }
        if (params.testImageScales !== undefined) {
            this.testImageScales = params.testImageScales;
        }
        if (params.challengeOptions !== undefined) {
            this.challengeOptions = params.challengeOptions;
        }
        if (params.challengeSelectedIndex !== undefined) {
            this.challengeSelectedIndex = params.challengeSelectedIndex;
        }
        if (params.challengeCorrectCount !== undefined) {
            this.challengeCorrectCount = params.challengeCorrectCount;
        }
        if (params.challengeAnswerShown !== undefined) {
            this.challengeAnswerShown = params.challengeAnswerShown;
        }
        if (params.learningDataManager !== undefined) {
            this.learningDataManager = params.learningDataManager;
        }
        if (params.learningProgressManager !== undefined) {
            this.learningProgressManager = params.learningProgressManager;
        }
        if (params.draggedLetters !== undefined) {
            this.draggedLetters = params.draggedLetters;
        }
        if (params.isWriteCorrect !== undefined) {
            this.isWriteCorrect = params.isWriteCorrect;
        }
        if (params.completedModes !== undefined) {
            this.completedModes = params.completedModes;
        }
        if (params._challengeCurrentWord !== undefined) {
            this._challengeCurrentWord = params._challengeCurrentWord;
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
        this.__drawingPaths.purgeDependencyOnElmtId(rmElmtId);
        this.__testImageScales.purgeDependencyOnElmtId(rmElmtId);
        this.__challengeOptions.purgeDependencyOnElmtId(rmElmtId);
        this.__challengeSelectedIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__challengeCorrectCount.purgeDependencyOnElmtId(rmElmtId);
        this.__challengeAnswerShown.purgeDependencyOnElmtId(rmElmtId);
        this.__draggedLetters.purgeDependencyOnElmtId(rmElmtId);
        this.__isWriteCorrect.purgeDependencyOnElmtId(rmElmtId);
        this.__completedModes.purgeDependencyOnElmtId(rmElmtId);
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
        this.__drawingPaths.aboutToBeDeleted();
        this.__testImageScales.aboutToBeDeleted();
        this.__challengeOptions.aboutToBeDeleted();
        this.__challengeSelectedIndex.aboutToBeDeleted();
        this.__challengeCorrectCount.aboutToBeDeleted();
        this.__challengeAnswerShown.aboutToBeDeleted();
        this.__draggedLetters.aboutToBeDeleted();
        this.__isWriteCorrect.aboutToBeDeleted();
        this.__completedModes.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private subcategoryId: string;
    private onBack?: () => void;
    // 允许外部指定初始模式（从主题页进入挑战）
    private initialMode: 'normal' | 'challenge';
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
    private __currentMode: ObservedPropertySimplePU<'listen' | 'speak' | 'read' | 'write' | 'challenge' | 'normal'>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: 'listen' | 'speak' | 'read' | 'write' | 'challenge' | 'normal') {
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
    private __drawingPaths: ObservedPropertySimplePU<string>; // 绘制的路径数据
    get drawingPaths() {
        return this.__drawingPaths.get();
    }
    set drawingPaths(newValue: string) {
        this.__drawingPaths.set(newValue);
    }
    private __testImageScales: ObservedPropertyObjectPU<number[]>; // 测试模式三个选项的缩放状态
    get testImageScales() {
        return this.__testImageScales.get();
    }
    set testImageScales(newValue: number[]) {
        this.__testImageScales.set(newValue);
    }
    // 挑战模式状态
    private __challengeOptions: ObservedPropertyObjectPU<WordData[]>; // 当前题目的3个选项
    get challengeOptions() {
        return this.__challengeOptions.get();
    }
    set challengeOptions(newValue: WordData[]) {
        this.__challengeOptions.set(newValue);
    }
    private __challengeSelectedIndex: ObservedPropertySimplePU<number>; // 选中项
    get challengeSelectedIndex() {
        return this.__challengeSelectedIndex.get();
    }
    set challengeSelectedIndex(newValue: number) {
        this.__challengeSelectedIndex.set(newValue);
    }
    private __challengeCorrectCount: ObservedPropertySimplePU<number>; // 累计答对题数
    get challengeCorrectCount() {
        return this.__challengeCorrectCount.get();
    }
    set challengeCorrectCount(newValue: number) {
        this.__challengeCorrectCount.set(newValue);
    }
    private __challengeAnswerShown: ObservedPropertySimplePU<boolean>; // 是否已揭示答案
    get challengeAnswerShown() {
        return this.__challengeAnswerShown.get();
    }
    set challengeAnswerShown(newValue: boolean) {
        this.__challengeAnswerShown.set(newValue);
    }
    private learningDataManager;
    private learningProgressManager;
    aboutToAppear() {
        // 初始化TTS
        SpeechManager.init();
        this.loadWords();
        // 延迟播放当前单词，确保数据已加载
        setTimeout(() => {
            this.playPronunciation();
        }, 500);
        // 如果从外部要求以挑战模式进入，加载后直接进入挑战
        if (this.initialMode === 'challenge') {
            // 异步进入，确保words已准备
            setTimeout(() => {
                this.enterChallengeMode().catch((err: Error) => console.error('进入挑战模式失败:', err));
            }, 0);
        }
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
    // 获取随机边框颜色
    private getRandomBorderColor(index: number): string {
        const colors = [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#DDA0DD',
            '#FFB347',
            '#87CEEB',
            '#F0E68C',
            '#FFA07A',
            '#98FB98',
            '#F5DEB3',
            '#D8BFD8',
            '#FFE4E1',
            '#E0FFFF' // 浅青色
        ];
        return colors[index % colors.length];
    }
    // 根据单词获取随机边框颜色
    private getRandomBorderColorByWord(word: string): string {
        const colors = [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#DDA0DD',
            '#FFB347',
            '#87CEEB',
            '#F0E68C',
            '#FFA07A',
            '#98FB98',
            '#F5DEB3',
            '#D8BFD8',
            '#FFE4E1',
            '#E0FFFF' // 浅青色
        ];
        // 将单词字符的ASCII码相加，然后取模，确保相同的单词总是得到相同的颜色
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = ((hash << 5) - hash) + word.charCodeAt(i);
            hash = hash & hash; // 转换为32位整数
        }
        return colors[Math.abs(hash) % colors.length];
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
            this.completedModes = []; // 清空已完成状态
            this.currentMode = 'normal'; // 回到正常模式
            // 延迟播放新单词的发音
            setTimeout(() => {
                this.playPronunciation();
            }, 300);
        }
    }
    // 上一个单词
    private prevWord() {
        if (this.currentWordIndex > 0) {
            this.currentWordIndex--;
            this.isFlipped = false;
            this.completedModes = []; // 清空已完成状态
            this.currentMode = 'normal'; // 回到正常模式
            // 延迟播放新单词的发音
            setTimeout(() => {
                this.playPronunciation();
            }, 300);
        }
    }
    // 检查单词是否完成
    private checkWordCompletion() {
        const currentWord = this.getCurrentWord();
        if (!currentWord)
            return;
        // 更新单词完成状态
        this.learningProgressManager.updateWordCompletion(currentWord.english, this.completedModes);
        // 检查子分类是否完成
        const allWordIds = this.words.map(w => w.english);
        const isSubcategoryCompleted = this.learningProgressManager.checkSubcategoryCompletion(this.subcategoryId, allWordIds);
        if (isSubcategoryCompleted) {
            console.log(`子分类 ${this.subcategoryId} 已完成！`);
            // 检查主题是否完成
            const subcategories = this.learningDataManager.getSubcategoriesByTheme(this.learningDataManager.getThemeBySubcategoryId(this.subcategoryId) as ThemeType);
            const allSubcategoryIds = subcategories.map(s => s.id);
            const isThemeCompleted = this.learningProgressManager.checkThemeCompletion(this.learningDataManager.getThemeBySubcategoryId(this.subcategoryId), allSubcategoryIds);
            if (isThemeCompleted) {
                console.log(`主题 ${this.learningDataManager.getThemeBySubcategoryId(this.subcategoryId)} 已完成！`);
            }
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
        // 2秒后标记完成
        setTimeout(() => {
            if (!this.completedModes.includes('listen')) {
                this.completedModes.push('listen');
                this.checkWordCompletion();
            }
        }, 2000);
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
        // 录音结束后标记完成
        setTimeout(() => {
            if (!this.completedModes.includes('speak')) {
                this.completedModes.push('speak');
                this.checkWordCompletion();
            }
        }, 5000); // 录音5秒后完成
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
        // 重置图片缩放状态
        this.testImageScales = [1, 1, 1];
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
        // 立即放大选中的图片
        this.testImageScales[index] = 1.2;
        // 等待一小段时间后播放声音
        setTimeout(async () => {
            if (isCorrect) {
                // 选择正确 - 播放欢呼声
                console.log('✅ 选择正确！');
                this.testCorrectAnswerShown = true;
                await SpeechManager.speak('答对了，你真棒！');
                // 标记测试完成
                if (!this.completedModes.includes('read')) {
                    this.completedModes.push('read');
                    this.checkWordCompletion();
                }
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
                // 重置图片缩放
                this.testImageScales[index] = 1;
            }
        }, 300);
    }
    // 重新播放测试问题
    private async replayTestQuestion() {
        const correctWord = this.getCurrentWord();
        if (!correctWord) {
            console.error('没有当前单词');
            return;
        }
        // 播放问题："哪个是沙发Sofa？"
        const question = `哪个是${correctWord.chinese}${correctWord.english}？`;
        await SpeechManager.speak(question);
    }
    // 进入书写模式
    private enterWriteMode() {
        this.currentMode = 'write';
        this.draggedLetters = []; // 清空已拖拽的字母
        this.isWriteCorrect = false;
        console.log('进入书写模式');
    }
    // 检查拼写结果
    private checkWriteResult() {
        if (!this.getCurrentWord()) {
            return;
        }
        const currentWord = this.getCurrentWord()!.english;
        const userInput = this.draggedLetters.join('');
        // 检查是否输入完成
        if (this.draggedLetters.length === currentWord.length) {
            // 判断拼写是否正确
            if (userInput === currentWord) {
                this.isWriteCorrect = true;
                // 播放正确提示音
                SpeechManager.speak('答对了，你真棒！').catch((err: Error) => {
                    console.error('拼写成功提示失败:', err);
                });
                // 标记书写完成
                if (!this.completedModes.includes('write')) {
                    this.completedModes.push('write');
                    this.checkWordCompletion();
                }
                // 1秒后返回学习页面
                setTimeout(() => {
                    this.currentMode = 'normal';
                }, 1000);
            }
            else {
                this.isWriteCorrect = false;
                // 播放错误提示音
                SpeechManager.speak('再试试吧').catch((err: Error) => {
                    console.error('拼写错误提示失败:', err);
                });
                // 2秒后清空书写区域，让用户重新开始
                setTimeout(() => {
                    this.draggedLetters = [];
                    this.isWriteCorrect = false;
                }, 2000);
            }
        }
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
                return '测试模式';
            case 'write':
                return '书写模式';
            case 'challenge':
                return '挑战模式';
            default:
                return '';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.expandSafeArea();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 背景图片
            Image.create({ "id": 0, "type": 30000, params: ['bg3.png'], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
            // 背景图片
            Image.width('100%');
            // 背景图片
            Image.height('100%');
            // 背景图片
            Image.objectFit(ImageFit.Cover);
            // 背景图片
            Image.opacity(0.3);
            // 背景图片
            Image.expandSafeArea();
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主内容
            Column.create();
            // 主内容
            Column.width('100%');
            // 主内容
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height('15%');
            // 顶部导航栏
            Row.padding({ left: 20, right: 20 });
            // 顶部导航栏
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Button.createWithLabel('←');
            // 返回按钮
            Button.fontSize(22);
            // 返回按钮
            Button.fontColor(Color.Black);
            // 返回按钮
            Button.backgroundColor(Color.Transparent);
            // 返回按钮
            Button.margin({ top: 20 });
            // 返回按钮
            Button.onClick(() => {
                if (this.currentMode !== 'normal') {
                    // 如果在学习模式（听、说、读、写），返回到单词学习页面
                    console.log('返回按钮被点击 - 返回到单词学习页面');
                    this.currentMode = 'normal';
                }
                else {
                    // 如果在正常模式，返回到子分类选择页面
                    console.log('返回按钮被点击 - 返回子分类选择页面');
                    if (this.onBack) {
                        this.onBack();
                    }
                }
            });
        }, Button);
        // 返回按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 显示当前模式（右上角）
            if (this.currentMode !== 'normal') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getModeText());
                        Text.fontSize(18);
                        Text.fontColor('#333333');
                        Text.margin({ right: 10, top: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('×');
                        Button.fontSize(20);
                        Button.fontColor('#333333');
                        Button.backgroundColor(Color.Transparent);
                        Button.width(50);
                        Button.height(40);
                        Button.margin({ top: 20 });
                        Button.onClick(() => {
                            this.exitMode();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            // 挑战模式右上角答对计数
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 挑战模式右上角答对计数
            if (this.currentMode === 'challenge') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`已答对 ${this.challengeCorrectCount}`);
                        Text.fontSize(16);
                        Text.fontColor('#52C41A');
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
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
            else if (this.currentMode === 'write') {
                this.ifElseBranchUpdateFunction(1, () => {
                    // 书写模式显示
                    this.buildWriteMode.bind(this)();
                });
            }
            else if (this.currentMode === 'challenge') {
                this.ifElseBranchUpdateFunction(2, () => {
                    // 挑战模式显示
                    this.buildChallengeMode.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    // 常规模式显示
                    this.buildNormalMode.bind(this)();
                });
            }
        }, If);
        If.pop();
        // 主内容
        Column.pop();
        Stack.pop();
    }
    buildTestMode(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('90%');
            Column.padding(20);
            Column.onClick(() => {
                // 点击空白处重新播放问题
                this.replayTestQuestion();
            });
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
                    Context.animation({ duration: 200, curve: Curve.EaseInOut });
                    Image.width(150);
                    Image.height(150);
                    Image.borderRadius(15);
                    Image.objectFit(ImageFit.Cover);
                    Image.scale({ x: this.testImageScales[index], y: this.testImageScales[index] });
                    Context.animation(null);
                    Image.border({
                        width: this.selectedTestOption === index ? 5 : 4,
                        color: this.selectedTestOption === index
                            ? (index === this.testOptions.findIndex(w => w.english === this.getCurrentWord()?.english) ? '#00FF00' : '#FF0000')
                            : this.getRandomBorderColorByWord(option.english),
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
    private __draggedLetters: ObservedPropertyObjectPU<string[]>;
    get draggedLetters() {
        return this.__draggedLetters.get();
    }
    set draggedLetters(newValue: string[]) {
        this.__draggedLetters.set(newValue);
    }
    private __isWriteCorrect: ObservedPropertySimplePU<boolean>; // 是否拼写正确
    get isWriteCorrect() {
        return this.__isWriteCorrect.get();
    }
    set isWriteCorrect(newValue: boolean) {
        this.__isWriteCorrect.set(newValue);
    }
    private __completedModes: ObservedPropertyObjectPU<string[]>; // 已完成的功能模式（听、说、测、写）
    get completedModes() {
        return this.__completedModes.get();
    }
    set completedModes(newValue: string[]) {
        this.__completedModes.set(newValue);
    }
    buildWriteMode(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getCurrentWord()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height('90%');
                        Row.backgroundColor('#FAFAFA');
                        Row.margin({ top: 20, bottom: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 左侧：标题
                        Column.create();
                        // 左侧：标题
                        Column.width('15%');
                        // 左侧：标题
                        Column.height('100%');
                        // 左侧：标题
                        Column.justifyContent(FlexAlign.Center);
                        // 左侧：标题
                        Column.margin({ left: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✨');
                        Text.fontSize(40);
                        Text.fontColor('#FF6B6B');
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('拼');
                        Text.fontSize(50);
                        Text.fontColor('#FF6B6B');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('一');
                        Text.fontSize(50);
                        Text.fontColor('#FF6B6B');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('拼');
                        Text.fontSize(50);
                        Text.fontColor('#FF6B6B');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✨');
                        Text.fontSize(40);
                        Text.fontColor('#FF6B6B');
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    // 左侧：标题
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 右侧：滚动内容区域
                        Column.create();
                        // 右侧：滚动内容区域
                        Column.width('90%');
                        // 右侧：滚动内容区域
                        Column.layoutWeight(1);
                        // 右侧：滚动内容区域
                        Column.padding({ right: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 可选字母区域（单行，横向滚动）
                        Column.create();
                        // 可选字母区域（单行，横向滚动）
                        Column.width('100%');
                        // 可选字母区域（单行，横向滚动）
                        Column.backgroundColor('#FFE4E1');
                        // 可选字母区域（单行，横向滚动）
                        Column.borderRadius(25);
                        // 可选字母区域（单行，横向滚动）
                        Column.padding(15);
                        // 可选字母区域（单行，横向滚动）
                        Column.margin({ bottom: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollable(ScrollDirection.Horizontal);
                        Scroll.scrollBar(BarState.On);
                        Scroll.width('100%');
                        Scroll.padding(10);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Flex.create({ wrap: FlexWrap.NoWrap, justifyContent: FlexAlign.Center });
                        Flex.width('100%');
                    }, Flex);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const letter = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(letter);
                                Text.fontSize(50);
                                Text.fontColor('#FFFFFF');
                                Text.fontWeight(FontWeight.Bold);
                                Text.width(65);
                                Text.height(65);
                                Text.textAlign(TextAlign.Center);
                                Text.backgroundColor('#FFA07A');
                                Text.borderRadius(18);
                                Text.margin(6);
                                Text.onClick(() => {
                                    if (this.draggedLetters.filter(l => l === letter).length < this.getCurrentWord()!.english.split('').filter(l => l === letter).length) {
                                        this.draggedLetters.push(letter);
                                        this.checkWriteResult();
                                    }
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, Array.from(this.getCurrentWord()!.english), forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Flex.pop();
                    Scroll.pop();
                    // 可选字母区域（单行，横向滚动）
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 书写区域（单行，横向滚动）
                        Column.create();
                        // 书写区域（单行，横向滚动）
                        Column.width('100%');
                        // 书写区域（单行，横向滚动）
                        Column.backgroundColor('#FFF8E7');
                        // 书写区域（单行，横向滚动）
                        Column.borderRadius(25);
                        // 书写区域（单行，横向滚动）
                        Column.padding(20);
                        // 书写区域（单行，横向滚动）
                        Column.border({
                            width: 4,
                            color: this.isWriteCorrect ? '#95E1D3' : '#FFB6C1',
                            style: BorderStyle.Solid
                        });
                        // 书写区域（单行，横向滚动）
                        Column.shadow({
                            radius: 10,
                            color: '#00000010',
                            offsetX: 0,
                            offsetY: 3
                        });
                        // 书写区域（单行，横向滚动）
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollable(ScrollDirection.Horizontal);
                        Scroll.scrollBar(BarState.On);
                        Scroll.width('100%');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Flex.create({ wrap: FlexWrap.NoWrap, justifyContent: FlexAlign.Center });
                        Flex.width('100%');
                    }, Flex);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const letter = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(letter);
                                Text.fontSize(50);
                                Text.fontColor('#FFFFFF');
                                Text.fontWeight(FontWeight.Bold);
                                Text.width(65);
                                Text.height(65);
                                Text.textAlign(TextAlign.Center);
                                Text.backgroundColor(this.isWriteCorrect ? '#95E1D3' : '#FF9A9A');
                                Text.borderRadius(20);
                                Text.margin(8);
                                Text.onClick(() => {
                                    if (!this.isWriteCorrect) {
                                        this.draggedLetters.splice(index, 1);
                                    }
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.draggedLetters, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.draggedLetters.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('👆 点击字母拼写');
                                    Text.fontSize(35);
                                    Text.fontColor('#A9A9A9');
                                    Text.margin(20);
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Flex.pop();
                    Scroll.pop();
                    // 书写区域（单行，横向滚动）
                    Column.pop();
                    // 右侧：滚动内容区域
                    Column.pop();
                    Row.pop();
                });
            }
            else // 挑战模式：连续答题，答对自动进入下一题
             {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    // 挑战模式：连续答题，答对自动进入下一题
    buildChallengeMode(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('90%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('挑战：选择正确的图片');
            Text.fontSize(24);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 30 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.Center);
            Row.width('100%');
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
                        width: this.challengeSelectedIndex === index ? 5 : 4,
                        color: this.challengeSelectedIndex === index
                            ? (this.isChallengeCorrectIndex(index) ? '#00BB00' : '#FF5555')
                            : this.getRandomBorderColorByWord(option.english),
                        style: BorderStyle.Solid
                    });
                    Image.onClick(() => {
                        this.selectChallengeOption(index);
                    });
                }, Image);
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.challengeOptions, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Column.pop();
    }
    private isChallengeCorrectIndex(index: number): boolean {
        const correct = this.challengeOptions.findIndex(w => w.english === this.challengeCurrentWordEnglish());
        return index === correct;
    }
    private challengeCurrentWordEnglish(): string | undefined {
        const w = this._challengeCurrentWord;
        return w ? w.english : undefined;
    }
    private _challengeCurrentWord?: WordData;
    private async enterChallengeMode() {
        console.log('进入挑战模式：准备初始化题目');
        this.currentMode = 'challenge';
        this.challengeCorrectCount = 0;
        await this.generateChallengeQuestion();
        console.log('进入挑战模式：题目已生成，当前选项数量:', this.challengeOptions.length);
    }
    private async generateChallengeQuestion() {
        console.log('生成挑战题目：开始');
        // 随机选择一个单词作为正确答案
        if (this.words.length === 0) {
            console.warn('生成挑战题目：words为空');
            this.challengeOptions = [];
            this._challengeCurrentWord = undefined;
            return;
        }
        const correctWord = this.words[Math.floor(Math.random() * this.words.length)];
        this._challengeCurrentWord = correctWord;
        console.log('生成挑战题目：正确答案为', correctWord.english);
        // 生成两个干扰项
        const others = this.words.filter(w => w.english !== correctWord.english);
        const shuffledOthers = others.sort(() => Math.random() - 0.5);
        const options: WordData[] = [correctWord];
        for (let i = 0; i < 2 && i < shuffledOthers.length; i++) {
            options.push(shuffledOthers[i]);
        }
        // 打乱
        this.challengeOptions = options.sort(() => Math.random() - 0.5);
        this.challengeSelectedIndex = -1;
        this.challengeAnswerShown = false;
        console.log('生成挑战题目：选项为', this.challengeOptions.map(o => o.english).join(','));
        // 朗读题目
        const question = `哪个是${correctWord.chinese}${correctWord.english}？`;
        await SpeechManager.speak(question);
    }
    private async selectChallengeOption(index: number) {
        if (this.challengeAnswerShown) {
            return;
        }
        console.log('挑战模式：选择了选项', index);
        this.challengeSelectedIndex = index;
        const correctIndex = this.challengeOptions.findIndex(w => w.english === this.challengeCurrentWordEnglish());
        const isCorrect = index === correctIndex;
        setTimeout(async () => {
            if (isCorrect) {
                console.log('挑战模式：回答正确，累计+1');
                this.challengeAnswerShown = true;
                this.challengeCorrectCount += 1;
                await SpeechManager.speak('答对了，你真棒！');
                // 短暂停顿后进入下一题
                setTimeout(async () => {
                    await this.generateChallengeQuestion();
                }, 600);
            }
            else {
                console.log('挑战模式：回答错误，可重选');
                await SpeechManager.speak('再试试吧');
                this.challengeSelectedIndex = -1;
            }
        }, 200);
    }
    buildNormalMode(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.flexGrow(1);
            Row.padding({ left: 50, right: 50 });
            Gesture.create(GesturePriority.Low);
            PanGesture.create({ fingers: 1 });
            PanGesture.onActionEnd((event: GestureEvent) => {
                // 向左滑动：下一张；向右滑动：上一张
                const dx = event.offsetX;
                if (dx <= -50 && this.currentWordIndex < this.words.length - 1) {
                    this.nextWord();
                }
                else if (dx >= 50 && this.currentWordIndex > 0) {
                    this.prevWord();
                }
            });
            PanGesture.pop();
            Gesture.pop();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getCurrentWord()) {
                this.ifElseBranchUpdateFunction(0, () => {
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
                            this.playPronunciation();
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
                        Image.border({
                            width: 4,
                            color: this.getRandomBorderColorByWord(this.getCurrentWord()?.english || ''),
                            style: BorderStyle.Solid
                        });
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
                        Column.padding({ left: 30, right: 20 });
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
                        Text.fontSize(35);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 30 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCurrentWord()!.chinese);
                        Text.fontSize(35);
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
                        Stack.create();
                        Stack.margin({ right: 10 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('听');
                        Button.fontSize(18);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(this.currentMode === 'listen' ? '#FF0000' : '#FF6B6B');
                        Button.borderRadius(20);
                        Button.width(60);
                        Button.height(50);
                        Button.onClick(() => {
                            this.enterListenMode();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.completedModes.includes('listen')) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✓');
                                    Text.fontSize(20);
                                    Text.fontColor('#52C41A');
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.position({ x: 45, y: 0 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.margin({ right: 10 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('说');
                        Button.fontSize(18);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(this.currentMode === 'speak' ? '#00BFA5' : '#4ECDC4');
                        Button.borderRadius(20);
                        Button.width(60);
                        Button.height(50);
                        Button.onClick(() => {
                            this.enterSpeakMode();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.completedModes.includes('speak')) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✓');
                                    Text.fontSize(20);
                                    Text.fontColor('#52C41A');
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.position({ x: 45, y: 0 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.margin({ right: 10 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('测');
                        Button.fontSize(18);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(this.currentMode === 'read' ? '#0277BD' : '#45B7D1');
                        Button.borderRadius(20);
                        Button.width(60);
                        Button.height(50);
                        Button.onClick(() => {
                            this.enterReadMode();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.completedModes.includes('read')) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✓');
                                    Text.fontSize(20);
                                    Text.fontColor('#52C41A');
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.position({ x: 45, y: 0 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.margin({ right: 10 });
                    }, Stack);
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.completedModes.includes('write')) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✓');
                                    Text.fontSize(20);
                                    Text.fontColor('#52C41A');
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.position({ x: 45, y: 0 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                    Row.pop();
                    // 听说读写按钮区域
                    Column.pop();
                    // 右侧：英文和中文显示区域 + 听说读写按钮
                    Column.pop();
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
