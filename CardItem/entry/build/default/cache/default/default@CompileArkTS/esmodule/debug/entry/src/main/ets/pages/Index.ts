if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentPage?: PageType;
    currentTheme?: ThemeType;
    currentWordIndex?: number;
    learningProgress?: LearningProgress;
    isImageHidden?: boolean;
    volumeVisible?: boolean;
    currentVolume?: number;
    learningDataManager?: LearningDataManager;
    soundEffectManager?: SoundEffectManager;
    ttsManager?: TTSManager;
    learningProgressManager?: LearningProgressManager;
    themes?: ThemeData[];
}
import type { PageType, ThemeType, ThemeData, WordData, LearningProgress } from '../types/CommonTypes';
import { GlobalStyles } from "@normalized:N&&&entry/src/main/ets/styles/GlobalStyles&";
import { LearningDataManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningDataManager&";
import { SoundEffectManager } from "@normalized:N&&&entry/src/main/ets/managers/SoundEffectManager&";
import { TTSManager } from "@normalized:N&&&entry/src/main/ets/utils/TTSManager&";
import { LearningProgressManager } from "@normalized:N&&&entry/src/main/ets/managers/LearningProgressManager&";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentPage = new ObservedPropertySimplePU('theme_select' // 直接进入主题选择页
        , this, "currentPage");
        this.__currentTheme = new ObservedPropertySimplePU('fruits', this, "currentTheme");
        this.__currentWordIndex = new ObservedPropertySimplePU(0, this, "currentWordIndex");
        this.__learningProgress = new ObservedPropertyObjectPU({
            currentTheme: 'fruits',
            currentWordIndex: 0,
            totalLearningTime: 0,
            sessionStartTime: 0,
            stickers: [],
            completedThemes: []
        }, this, "learningProgress");
        this.__isImageHidden = new ObservedPropertySimplePU(false, this, "isImageHidden");
        this.__volumeVisible = new ObservedPropertySimplePU(false, this, "volumeVisible");
        this.__currentVolume = new ObservedPropertySimplePU(50
        // 管理器实例
        , this, "currentVolume");
        this.learningDataManager = LearningDataManager.getInstance();
        this.soundEffectManager = SoundEffectManager.getInstance();
        this.ttsManager = TTSManager.getInstance();
        this.learningProgressManager = LearningProgressManager.getInstance();
        this.themes = [];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentPage !== undefined) {
            this.currentPage = params.currentPage;
        }
        if (params.currentTheme !== undefined) {
            this.currentTheme = params.currentTheme;
        }
        if (params.currentWordIndex !== undefined) {
            this.currentWordIndex = params.currentWordIndex;
        }
        if (params.learningProgress !== undefined) {
            this.learningProgress = params.learningProgress;
        }
        if (params.isImageHidden !== undefined) {
            this.isImageHidden = params.isImageHidden;
        }
        if (params.volumeVisible !== undefined) {
            this.volumeVisible = params.volumeVisible;
        }
        if (params.currentVolume !== undefined) {
            this.currentVolume = params.currentVolume;
        }
        if (params.learningDataManager !== undefined) {
            this.learningDataManager = params.learningDataManager;
        }
        if (params.soundEffectManager !== undefined) {
            this.soundEffectManager = params.soundEffectManager;
        }
        if (params.ttsManager !== undefined) {
            this.ttsManager = params.ttsManager;
        }
        if (params.learningProgressManager !== undefined) {
            this.learningProgressManager = params.learningProgressManager;
        }
        if (params.themes !== undefined) {
            this.themes = params.themes;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentPage.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTheme.purgeDependencyOnElmtId(rmElmtId);
        this.__currentWordIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__learningProgress.purgeDependencyOnElmtId(rmElmtId);
        this.__isImageHidden.purgeDependencyOnElmtId(rmElmtId);
        this.__volumeVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__currentVolume.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentPage.aboutToBeDeleted();
        this.__currentTheme.aboutToBeDeleted();
        this.__currentWordIndex.aboutToBeDeleted();
        this.__learningProgress.aboutToBeDeleted();
        this.__isImageHidden.aboutToBeDeleted();
        this.__volumeVisible.aboutToBeDeleted();
        this.__currentVolume.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentPage: ObservedPropertySimplePU<PageType>; // 直接进入主题选择页
    get currentPage() {
        return this.__currentPage.get();
    }
    set currentPage(newValue: PageType) {
        this.__currentPage.set(newValue);
    }
    private __currentTheme: ObservedPropertySimplePU<ThemeType>;
    get currentTheme() {
        return this.__currentTheme.get();
    }
    set currentTheme(newValue: ThemeType) {
        this.__currentTheme.set(newValue);
    }
    private __currentWordIndex: ObservedPropertySimplePU<number>;
    get currentWordIndex() {
        return this.__currentWordIndex.get();
    }
    set currentWordIndex(newValue: number) {
        this.__currentWordIndex.set(newValue);
    }
    private __learningProgress: ObservedPropertyObjectPU<LearningProgress>;
    get learningProgress() {
        return this.__learningProgress.get();
    }
    set learningProgress(newValue: LearningProgress) {
        this.__learningProgress.set(newValue);
    }
    private __isImageHidden: ObservedPropertySimplePU<boolean>;
    get isImageHidden() {
        return this.__isImageHidden.get();
    }
    set isImageHidden(newValue: boolean) {
        this.__isImageHidden.set(newValue);
    }
    private __volumeVisible: ObservedPropertySimplePU<boolean>;
    get volumeVisible() {
        return this.__volumeVisible.get();
    }
    set volumeVisible(newValue: boolean) {
        this.__volumeVisible.set(newValue);
    }
    private __currentVolume: ObservedPropertySimplePU<number>;
    get currentVolume() {
        return this.__currentVolume.get();
    }
    set currentVolume(newValue: number) {
        this.__currentVolume.set(newValue);
    }
    // 管理器实例
    private learningDataManager: LearningDataManager;
    private soundEffectManager: SoundEffectManager;
    private ttsManager: TTSManager;
    private learningProgressManager: LearningProgressManager;
    // 主题数据
    private themes: ThemeData[];
    aboutToAppear() {
        this.learningDataManager.init();
        this.themes = this.learningDataManager.getThemes();
    }
    // 初始化应用
    async initializeApp() {
        try {
            // 初始化TTS
            await this.ttsManager.init();
            // 初始化学习进度管理器
            await this.learningProgressManager.init();
            // 初始化音效管理器
            await this.soundEffectManager.init();
            // 加载学习进度
            this.loadLearningProgress();
            // 播放欢迎音效
            await this.soundEffectManager.playWelcome();
            console.log('应用初始化完成');
        }
        catch (error) {
            console.error('应用初始化失败:', error);
        }
    }
    // 加载学习进度
    loadLearningProgress() {
        this.learningProgress = this.learningProgressManager.loadProgress();
    }
    // 保存学习进度
    saveLearningProgress() {
        this.learningProgressManager.saveProgress();
    }
    // 开始主题学习
    async startThemeLearning(theme: ThemeType) {
        this.currentTheme = theme;
        this.currentWordIndex = 0;
        this.learningProgressManager.startThemeLearning(theme);
        await this.soundEffectManager.playLearningStart();
        this.currentPage = 'word_card';
    }
    // 返回上一页
    goBack() {
        if (this.currentPage === 'parent_helper') {
            this.currentPage = 'theme_select';
        }
        else if (this.currentPage === 'word_card') {
            this.currentPage = 'theme_select';
        }
        else if (this.currentPage === 'speaking_practice' ||
            this.currentPage === 'writing_practice') {
            this.currentPage = 'word_card';
        }
        else if (this.currentPage === 'progress_reward' ||
            this.currentPage === 'sticker_collection' ||
            this.currentPage === 'rest_break') {
            this.currentPage = 'theme_select';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
            Column.onAppear(() => {
                this.initializeApp();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentPage === 'theme_select') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.ThemeSelectPage.bind(this)();
                });
            }
            else if (this.currentPage === 'parent_helper') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.ParentHelperPage.bind(this)();
                });
            }
            else if (this.currentPage === 'word_card') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.WordCardPage.bind(this)();
                });
            }
            else if (this.currentPage === 'speaking_practice') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.SpeakingPracticePage.bind(this)();
                });
            }
            else if (this.currentPage === 'writing_practice') {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.WritingPracticePage.bind(this)();
                });
            }
            else if (this.currentPage === 'progress_reward') {
                this.ifElseBranchUpdateFunction(5, () => {
                    this.ProgressRewardPage.bind(this)();
                });
            }
            else if (this.currentPage === 'sticker_collection') {
                this.ifElseBranchUpdateFunction(6, () => {
                    this.StickerCollectionPage.bind(this)();
                });
            }
            else if (this.currentPage === 'rest_break') {
                this.ifElseBranchUpdateFunction(7, () => {
                    this.RestBreakPage.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(8, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // 主题选择页（横屏布局，左右滑动）
    ThemeSelectPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height('100%');
            Row.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧区域 - 主题卡片展示
            Column.create();
            // 左侧区域 - 主题卡片展示
            Column.width('75%');
            // 左侧区域 - 主题卡片展示
            Column.height('100%');
            // 左侧区域 - 主题卡片展示
            Column.justifyContent(FlexAlign.Center);
            // 左侧区域 - 主题卡片展示
            Column.padding(GlobalStyles.SIZES.SPACING_LARGE);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('选择学习主题');
            // 标题
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_LARGE);
            // 标题
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            // 标题
            Text.fontWeight(FontWeight.Bold);
            // 标题
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题卡片容器 - 支持左右滑动
            Scroll.create();
            // 主题卡片容器 - 支持左右滑动
            Scroll.width('100%');
            // 主题卡片容器 - 支持左右滑动
            Scroll.height('100%');
            // 主题卡片容器 - 支持左右滑动
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 主题卡片容器 - 支持左右滑动
            Scroll.scrollBar(BarState.Auto);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceEvenly);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const theme = _item;
                this.ThemeCard.bind(this)(theme, index);
            };
            this.forEachUpdateFunction(elmtId, this.themes, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 主题卡片容器 - 支持左右滑动
        Scroll.pop();
        // 左侧区域 - 主题卡片展示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧区域 - 功能按钮
            Column.create();
            // 右侧区域 - 功能按钮
            Column.width('25%');
            // 右侧区域 - 功能按钮
            Column.height('100%');
            // 右侧区域 - 功能按钮
            Column.justifyContent(FlexAlign.Center);
            // 右侧区域 - 功能按钮
            Column.padding(GlobalStyles.SIZES.SPACING_LARGE);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 家长助手按钮
            Button.createWithLabel('家长助手');
            // 家长助手按钮
            Button.width(GlobalStyles.SIZES.BUTTON_LARGE.width);
            // 家长助手按钮
            Button.height(GlobalStyles.SIZES.BUTTON_LARGE.height);
            // 家长助手按钮
            Button.backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY);
            // 家长助手按钮
            Button.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            // 家长助手按钮
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            // 家长助手按钮
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 家长助手按钮
            Button.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
            // 家长助手按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.currentPage = 'parent_helper';
            });
        }, Button);
        // 家长助手按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 音量控制
            Column.create();
            // 音量控制
            Column.margin({ top: GlobalStyles.SIZES.SPACING_LARGE });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('音量');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_TINY });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🔊');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.margin({ right: GlobalStyles.SIZES.SPACING_TINY });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.currentVolume,
                min: 0,
                max: 100,
                step: 1
            });
            Slider.width(120);
            Slider.onChange((value: number) => {
                this.currentVolume = value;
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🔊');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.margin({ left: GlobalStyles.SIZES.SPACING_TINY });
        }, Text);
        Text.pop();
        Row.pop();
        // 音量控制
        Column.pop();
        // 右侧区域 - 功能按钮
        Column.pop();
        Row.pop();
    }
    // 主题卡片
    ThemeCard(theme: ThemeData, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation(GlobalStyles.ANIMATIONS.BUTTON_PRESS);
            Column.width(220);
            Column.height(280);
            Column.backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND);
            Column.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Column.padding(GlobalStyles.SIZES.SPACING_MEDIUM);
            Column.justifyContent(FlexAlign.Center);
            Column.shadow(GlobalStyles.SHADOWS.MEDIUM);
            Column.margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM });
            Column.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.startThemeLearning(theme.id);
            });
            Context.animation(null);
            Column.scale({ x: 1, y: 1 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题图标
            Image.create(theme.icon);
            // 主题图标
            Image.width(180);
            // 主题图标
            Image.height(180);
            // 主题图标
            Image.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 主题图标
            Image.backgroundColor(theme.color);
            // 主题图标
            Image.padding(GlobalStyles.SIZES.SPACING_SMALL);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题名称
            Text.create(theme.name);
            // 主题名称
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            // 主题名称
            Text.fontColor(theme.color);
            // 主题名称
            Text.fontWeight(FontWeight.Bold);
            // 主题名称
            Text.margin({ top: GlobalStyles.SIZES.SPACING_SMALL });
        }, Text);
        // 主题名称
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 进度信息
            Text.create(`${theme.completedWords}/${theme.totalWords}`);
            // 进度信息
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            // 进度信息
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            // 进度信息
            Text.margin({ top: GlobalStyles.SIZES.SPACING_TINY });
        }, Text);
        // 进度信息
        Text.pop();
        Column.pop();
    }
    // 家长助手页面
    ParentHelperPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding(GlobalStyles.SIZES.SPACING_LARGE);
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('家长指导小手册');
            // 标题
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            // 标题
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            // 标题
            Text.fontWeight(FontWeight.Bold);
            // 标题
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 指导内容
            Column.create();
            // 指导内容
            Column.width('100%');
            // 指导内容
            Column.padding(GlobalStyles.SIZES.SPACING_MEDIUM);
            // 指导内容
            Column.backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND);
            // 指导内容
            Column.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 指导内容
            Column.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('1. 听一听：点击喇叭图标，让孩子听单词发音');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('2. 说一说：点击星星图标，让孩子跟读练习');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('3. 写一写：点击画笔图标，让孩子练习书写');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('4. 每天学习15-20分钟，效果最佳');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
        }, Text);
        Text.pop();
        // 指导内容
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Button.createWithLabel('返回首页');
            // 返回按钮
            Button.width(GlobalStyles.SIZES.BUTTON_LARGE.width);
            // 返回按钮
            Button.height(GlobalStyles.SIZES.BUTTON_LARGE.height);
            // 返回按钮
            Button.backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY);
            // 返回按钮
            Button.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            // 返回按钮
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            // 返回按钮
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 返回按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        // 返回按钮
        Button.pop();
        Column.pop();
    }
    // 单词卡片页面
    WordCardPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部进度信息
            Row.create();
            // 顶部进度信息
            Row.width('100%');
            // 顶部进度信息
            Row.padding({ left: GlobalStyles.SIZES.SPACING_MEDIUM, right: GlobalStyles.SIZES.SPACING_MEDIUM });
            // 顶部进度信息
            Row.margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getThemeName()} ${this.currentWordIndex + 1}/${this.getThemeWords().length}`);
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('贴纸：2/5');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_ORANGE);
        }, Text);
        Text.pop();
        // 顶部进度信息
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主要内容区域
            Column.create();
            // 主要内容区域
            Column.layoutWeight(1);
            // 主要内容区域
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片区域
            Image.create(this.getCurrentWordImage());
            // 图片区域
            Image.width(GlobalStyles.SIZES.CORE_IMAGE_WIDTH);
            // 图片区域
            Image.height(GlobalStyles.SIZES.CORE_IMAGE_HEIGHT);
            // 图片区域
            Image.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 图片区域
            Image.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 文字区域
            Column.create();
            // 文字区域
            Column.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCurrentWord());
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_TINY });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCurrentPronunciation());
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_TINY });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCurrentChineseMeaning());
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_PINK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 文字区域
        Column.pop();
        // 主要内容区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部功能按钮
            Row.create();
            // 底部功能按钮
            Row.width('100%');
            // 底部功能按钮
            Row.padding(GlobalStyles.SIZES.SPACING_MEDIUM);
            // 底部功能按钮
            Row.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 听一听按钮
            Button.createWithLabel('听一听');
            // 听一听按钮
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            // 听一听按钮
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            // 听一听按钮
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            // 听一听按钮
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            // 听一听按钮
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            // 听一听按钮
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 听一听按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.playWordSound();
            });
        }, Button);
        // 听一听按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 说一说按钮
            Button.createWithLabel('说一说');
            // 说一说按钮
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            // 说一说按钮
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            // 说一说按钮
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_YELLOW);
            // 说一说按钮
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            // 说一说按钮
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            // 说一说按钮
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 说一说按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.startSpeakingPractice();
            });
        }, Button);
        // 说一说按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 写一写按钮
            Button.createWithLabel('写一写');
            // 写一写按钮
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            // 写一写按钮
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            // 写一写按钮
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN);
            // 写一写按钮
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            // 写一写按钮
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            // 写一写按钮
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 写一写按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.startWritingPractice();
            });
        }, Button);
        // 写一写按钮
        Button.pop();
        // 底部功能按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Button.createWithLabel('返回主题选择');
            // 返回按钮
            Button.width(GlobalStyles.SIZES.BUTTON_LARGE.width);
            // 返回按钮
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            // 返回按钮
            Button.backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY);
            // 返回按钮
            Button.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            // 返回按钮
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            // 返回按钮
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            // 返回按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        // 返回按钮
        Button.pop();
        Column.pop();
    }
    // 说功能页面
    SpeakingPracticePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部信息
            Row.create();
            // 顶部信息
            Row.width('100%');
            // 顶部信息
            Row.justifyContent(FlexAlign.Center);
            // 顶部信息
            Row.margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCurrentWord());
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.getCurrentWordImage());
            Image.width(60);
            Image.height(60);
            Image.borderRadius(GlobalStyles.BORDER_RADIUS.SMALL);
        }, Image);
        // 顶部信息
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 麦克风区域
            Column.create();
            // 麦克风区域
            Column.layoutWeight(1);
            // 麦克风区域
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🎤');
            Text.fontSize(120);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('请跟读单词');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_PINK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 麦克风区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部按钮
            Row.create();
            // 底部按钮
            Row.width('100%');
            // 底部按钮
            Row.padding(GlobalStyles.SIZES.SPACING_MEDIUM);
            // 底部按钮
            Row.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('再试一次');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_YELLOW);
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.startSpeakingPractice();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回卡片');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        Button.pop();
        // 底部按钮
        Row.pop();
        Column.pop();
    }
    // 写功能页面
    WritingPracticePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部信息
            Row.create();
            // 顶部信息
            Row.width('100%');
            // 顶部信息
            Row.justifyContent(FlexAlign.Center);
            // 顶部信息
            Row.margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCurrentWord());
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCurrentPronunciation());
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 顶部信息
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 描红区域
            Column.create();
            // 描红区域
            Column.layoutWeight(1);
            // 描红区域
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('描红练习');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_GREEN);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('请按照轨迹描红');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 描红区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部按钮
            Row.create();
            // 底部按钮
            Row.width('100%');
            // 底部按钮
            Row.padding(GlobalStyles.SIZES.SPACING_MEDIUM);
            // 底部按钮
            Row.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('单个字母练习');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN);
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.startSingleLetterPractice();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('完成');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_PINK);
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.completeWriting();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回卡片');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY);
            Button.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        Button.pop();
        // 底部按钮
        Row.pop();
        Column.pop();
    }
    // 进度奖励页面
    ProgressRewardPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding(GlobalStyles.SIZES.SPACING_LARGE);
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('恭喜解锁新贴纸！');
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_ORANGE);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('继续学习更多单词');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(GlobalStyles.SIZES.SPACING_MEDIUM);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('查看全部贴纸');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.currentPage = 'sticker_collection';
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('继续学习');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN);
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.continueLearning();
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    // 贴纸收集页面
    StickerCollectionPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding(GlobalStyles.SIZES.SPACING_LARGE);
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回');
            Button.width(GlobalStyles.SIZES.BUTTON_MEDIUM.width);
            Button.height(GlobalStyles.SIZES.BUTTON_MEDIUM.height);
            Button.backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY);
            Button.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的贴纸收集册');
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: GlobalStyles.SIZES.SPACING_MEDIUM, bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已收集 2/20 个贴纸');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate('1fr 1fr');
            Grid.width('100%');
            Grid.height(200);
        }, Grid);
        {
            const itemCreation2 = (elmtId, isInitialRender) => {
                GridItem.create(() => { }, false);
            };
            const observedDeepRender = () => {
                this.observeComponentCreation2(itemCreation2, GridItem);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('🎉');
                    Text.fontSize(60);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('水果贴纸');
                    Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
                    Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
                }, Text);
                Text.pop();
                Column.pop();
                GridItem.pop();
            };
            observedDeepRender();
        }
        {
            const itemCreation2 = (elmtId, isInitialRender) => {
                GridItem.create(() => { }, false);
            };
            const observedDeepRender = () => {
                this.observeComponentCreation2(itemCreation2, GridItem);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('🎉');
                    Text.fontSize(60);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('动物贴纸');
                    Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
                    Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
                }, Text);
                Text.pop();
                Column.pop();
                GridItem.pop();
            };
            observedDeepRender();
        }
        Grid.pop();
        Column.pop();
    }
    // 休息页面
    RestBreakPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding(GlobalStyles.SIZES.SPACING_LARGE);
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('休息一下');
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_LARGE);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('保护小眼睛～');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_LARGE);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('继续学习');
            Button.width(GlobalStyles.SIZES.BUTTON_LARGE.width);
            Button.height(GlobalStyles.SIZES.BUTTON_LARGE.height);
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_GREEN);
            Button.fontColor(GlobalStyles.COLORS.TEXT_WHITE);
            Button.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    // 辅助方法
    getThemeName(): string {
        const theme = this.themes.find(t => t.id === this.currentTheme);
        return theme ? theme.name : '未知主题';
    }
    getThemeWords(): WordData[] {
        return this.learningDataManager.getWordsByTheme(this.currentTheme);
    }
    getCurrentWord(): string {
        const words = this.getThemeWords();
        return words[this.currentWordIndex]?.english || 'Apple';
    }
    getCurrentWordImage(): string {
        const words = this.getThemeWords();
        return words[this.currentWordIndex]?.image || '$rawfile/CardOriginal/Food/Fruit/apple.png';
    }
    getCurrentPronunciation(): string {
        const words = this.getThemeWords();
        return words[this.currentWordIndex]?.pronunciation || '/ˈæpəl/';
    }
    getCurrentChineseMeaning(): string {
        const words = this.getThemeWords();
        return words[this.currentWordIndex]?.chinese || '苹果';
    }
    // 功能方法
    async playWordSound(): Promise<void> {
        await this.soundEffectManager.playWordSound(this.getCurrentWord());
    }
    async playSentence(): Promise<void> {
        await this.soundEffectManager.playSentence(`This is a ${this.getCurrentWord()}`);
    }
    async startSpeakingPractice(): Promise<void> {
        await this.soundEffectManager.playSpeakingStart();
        this.currentPage = 'speaking_practice';
    }
    async startWritingPractice(): Promise<void> {
        await this.soundEffectManager.playWritingStart();
        this.currentPage = 'writing_practice';
    }
    async startSingleLetterPractice(): Promise<void> {
        console.log('开始单个字母练习');
    }
    async completeWriting(): Promise<void> {
        await this.soundEffectManager.playWritingComplete();
        this.currentPage = 'progress_reward';
    }
    async continueLearning(): Promise<void> {
        this.currentWordIndex++;
        if (this.currentWordIndex >= this.getThemeWords().length) {
            this.currentWordIndex = 0;
            this.currentPage = 'theme_select';
        }
        else {
            this.currentPage = 'word_card';
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.studyenglishbycard", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
