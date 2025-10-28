if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentPage?: PageType;
    currentTheme?: ThemeType;
    currentWordIndex?: number;
    selectedMode?: LearningMode;
    score?: number;
    level?: number;
    showProgress?: boolean;
    showDetailPage?: boolean;
    selectedWord?: WordData | null;
    isImageHidden?: boolean;
    volumeVisible?: boolean;
    currentVolume?: number;
    learningDataManager?: LearningDataManager;
    soundEffectManager?: SoundEffectManager;
    ttsManager?: TTSManager;
    learningProgressManager?: LearningProgressManager;
    themes?: ThemeData[];
    subcategories?: SubcategoryData[];
    currentSubcategory?: SubcategoryData | null;
    currentSubcategoryId?: string;
}
import { LearningDataManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningDataManager&";
import { SoundEffectManager } from "@normalized:N&&&entry/src/main/ets/utils/SoundEffectManager&";
import { TTSManager } from "@normalized:N&&&entry/src/main/ets/utils/TTSManager&";
import { LearningProgressManager } from "@normalized:N&&&entry/src/main/ets/utils/LearningProgressManager&";
import { GlobalStyles } from "@normalized:N&&&entry/src/main/ets/styles/GlobalStyles&";
import { WordLearningPage } from "@normalized:N&&&entry/src/main/ets/components/WordLearningPage&";
import type { PageType, ThemeType, ThemeData, SubcategoryData, WordData, LearningMode } from '../types/CommonTypes';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentPage = new ObservedPropertySimplePU('theme_select', this, "currentPage");
        this.__currentTheme = new ObservedPropertySimplePU('food', this, "currentTheme");
        this.__currentWordIndex = new ObservedPropertySimplePU(0, this, "currentWordIndex");
        this.__selectedMode = new ObservedPropertySimplePU('listen', this, "selectedMode");
        this.__score = new ObservedPropertySimplePU(0, this, "score");
        this.__level = new ObservedPropertySimplePU(1, this, "level");
        this.__showProgress = new ObservedPropertySimplePU(false, this, "showProgress");
        this.__showDetailPage = new ObservedPropertySimplePU(false, this, "showDetailPage");
        this.__selectedWord = new ObservedPropertyObjectPU(null, this, "selectedWord");
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
        this.subcategories = [];
        this.currentSubcategory = null;
        this.currentSubcategoryId = '';
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
        if (params.selectedMode !== undefined) {
            this.selectedMode = params.selectedMode;
        }
        if (params.score !== undefined) {
            this.score = params.score;
        }
        if (params.level !== undefined) {
            this.level = params.level;
        }
        if (params.showProgress !== undefined) {
            this.showProgress = params.showProgress;
        }
        if (params.showDetailPage !== undefined) {
            this.showDetailPage = params.showDetailPage;
        }
        if (params.selectedWord !== undefined) {
            this.selectedWord = params.selectedWord;
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
        if (params.subcategories !== undefined) {
            this.subcategories = params.subcategories;
        }
        if (params.currentSubcategory !== undefined) {
            this.currentSubcategory = params.currentSubcategory;
        }
        if (params.currentSubcategoryId !== undefined) {
            this.currentSubcategoryId = params.currentSubcategoryId;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentPage.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTheme.purgeDependencyOnElmtId(rmElmtId);
        this.__currentWordIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMode.purgeDependencyOnElmtId(rmElmtId);
        this.__score.purgeDependencyOnElmtId(rmElmtId);
        this.__level.purgeDependencyOnElmtId(rmElmtId);
        this.__showProgress.purgeDependencyOnElmtId(rmElmtId);
        this.__showDetailPage.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedWord.purgeDependencyOnElmtId(rmElmtId);
        this.__isImageHidden.purgeDependencyOnElmtId(rmElmtId);
        this.__volumeVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__currentVolume.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentPage.aboutToBeDeleted();
        this.__currentTheme.aboutToBeDeleted();
        this.__currentWordIndex.aboutToBeDeleted();
        this.__selectedMode.aboutToBeDeleted();
        this.__score.aboutToBeDeleted();
        this.__level.aboutToBeDeleted();
        this.__showProgress.aboutToBeDeleted();
        this.__showDetailPage.aboutToBeDeleted();
        this.__selectedWord.aboutToBeDeleted();
        this.__isImageHidden.aboutToBeDeleted();
        this.__volumeVisible.aboutToBeDeleted();
        this.__currentVolume.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentPage: ObservedPropertySimplePU<PageType>;
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
    private __selectedMode: ObservedPropertySimplePU<LearningMode>;
    get selectedMode() {
        return this.__selectedMode.get();
    }
    set selectedMode(newValue: LearningMode) {
        this.__selectedMode.set(newValue);
    }
    private __score: ObservedPropertySimplePU<number>;
    get score() {
        return this.__score.get();
    }
    set score(newValue: number) {
        this.__score.set(newValue);
    }
    private __level: ObservedPropertySimplePU<number>;
    get level() {
        return this.__level.get();
    }
    set level(newValue: number) {
        this.__level.set(newValue);
    }
    private __showProgress: ObservedPropertySimplePU<boolean>;
    get showProgress() {
        return this.__showProgress.get();
    }
    set showProgress(newValue: boolean) {
        this.__showProgress.set(newValue);
    }
    private __showDetailPage: ObservedPropertySimplePU<boolean>;
    get showDetailPage() {
        return this.__showDetailPage.get();
    }
    set showDetailPage(newValue: boolean) {
        this.__showDetailPage.set(newValue);
    }
    private __selectedWord: ObservedPropertyObjectPU<WordData | null>;
    get selectedWord() {
        return this.__selectedWord.get();
    }
    set selectedWord(newValue: WordData | null) {
        this.__selectedWord.set(newValue);
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
    private subcategories: SubcategoryData[];
    private currentSubcategory: SubcategoryData | null;
    private currentSubcategoryId: string;
    aboutToAppear() {
        this.learningDataManager.init();
        this.themes = this.learningDataManager.getThemes();
    }
    // 保存学习进度
    saveLearningProgress() {
        // 学习进度会自动保存，无需手动调用
        console.log('学习进度已自动保存');
    }
    // 开始主题学习
    async startThemeLearning(theme: ThemeType) {
        this.currentTheme = theme;
        this.currentWordIndex = 0;
        this.learningProgressManager.startThemeLearning(theme);
        await this.soundEffectManager.playLearningStart();
        this.currentPage = 'word_card';
    }
    // 进入子分类选择页面
    enterSubcategorySelect(theme: ThemeType) {
        this.currentTheme = theme;
        this.subcategories = this.learningDataManager.getSubcategoriesByTheme(theme);
        this.currentPage = 'subcategory_select';
    }
    // 开始子分类学习
    startSubcategoryLearning(subcategoryId: string) {
        this.currentSubcategoryId = subcategoryId;
        const subcategory = this.subcategories.find(s => s.id === subcategoryId);
        if (subcategory) {
            this.currentSubcategory = subcategory;
            this.currentWordIndex = 0;
            this.currentPage = 'word_card';
            console.log('开始学习子分类:', subcategoryId);
        }
    }
    // 返回上一页
    goBack() {
        console.log(`goBack called, current page: ${this.currentPage}`);
        if (this.currentPage === 'parent_helper') {
            this.currentPage = 'theme_select';
            console.log('Returning to theme_select from parent_helper');
        }
        else if (this.currentPage === 'subcategory_select') {
            this.currentPage = 'theme_select';
            console.log('Returning to theme_select from subcategory_select');
        }
        else if (this.currentPage === 'word_card') {
            if (this.currentSubcategory) {
                this.currentPage = 'subcategory_select';
                console.log('Returning to subcategory_select from word_card');
            }
            else {
                this.currentPage = 'theme_select';
                console.log('Returning to theme_select from word_card');
            }
        }
        else {
            this.currentPage = 'theme_select';
            console.log('Default return to theme_select');
        }
    }
    // 获取主题名称
    getThemeName(theme: ThemeType): string {
        const themeData = this.themes.find(t => t.id === theme);
        return themeData ? themeData.name : theme;
    }
    // 获取随机边框颜色
    getRandomBorderColor(index: number): string {
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
    // 检查子分类是否完成
    isSubcategoryCompleted(subcategoryId: string): boolean {
        const completion = this.learningProgressManager.getSubcategoryCompletion(subcategoryId);
        return completion?.isCompleted === true;
    }
    // 检查主题是否完成
    isThemeCompleted(themeId: string): boolean {
        const completion = this.learningProgressManager.getThemeCompletion(themeId);
        return completion?.isCompleted === true;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentPage === 'theme_select') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.ThemeSelectPage.bind(this)();
                });
            }
            else if (this.currentPage === 'subcategory_select') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.SubcategorySelectPage.bind(this)();
                });
            }
            else if (this.currentPage === 'parent_helper') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.ParentHelperPage.bind(this)();
                });
            }
            else if (this.currentPage === 'word_card') {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new WordLearningPage(this, {
                                    subcategoryId: this.currentSubcategoryId,
                                    onBack: () => {
                                        this.currentPage = 'subcategory_select';
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 157, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        subcategoryId: this.currentSubcategoryId,
                                        onBack: () => {
                                            this.currentPage = 'subcategory_select';
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "WordLearningPage" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // 主题选择页（横屏布局，左右滑动）
    ThemeSelectPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
            Column.expandSafeArea();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部区域 - 标题和功能按钮
            Row.create();
            // 顶部区域 - 标题和功能按钮
            Row.width('100%');
            // 顶部区域 - 标题和功能按钮
            Row.padding({ left: GlobalStyles.SIZES.SPACING_LARGE, right: GlobalStyles.SIZES.SPACING_LARGE, top: GlobalStyles.SIZES.SPACING_MEDIUM });
            // 顶部区域 - 标题和功能按钮
            Row.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择学习主题');
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.createWithLabel('挑战模式');
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.width(100);
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.height(50);
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_ORANGE);
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.fontSize(18);
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.fontColor(Color.White);
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.fontWeight(FontWeight.Bold);
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.borderRadius(25);
            // 复习按钮
            // Button('复习')
            //   .width(60)
            //   .height(30)
            //   .backgroundColor('#52C41A')
            //   .fontSize(12)
            //   .fontColor(Color.White)
            //   .fontWeight(FontWeight.Bold)
            //   .borderRadius(25)
            //   .margin({ right: 15 })
            //   .onClick(() => {
            //     this.soundEffectManager.playButtonClick()
            //     // TODO: 实现复习功能
            //     console.log('复习按钮点击')
            //   })
            // 跳过学习按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                // TODO: 实现跳过学习功能
                console.log('跳过学习按钮点击');
            });
        }, Button);
        // 复习按钮
        // Button('复习')
        //   .width(60)
        //   .height(30)
        //   .backgroundColor('#52C41A')
        //   .fontSize(12)
        //   .fontColor(Color.White)
        //   .fontWeight(FontWeight.Bold)
        //   .borderRadius(25)
        //   .margin({ right: 15 })
        //   .onClick(() => {
        //     this.soundEffectManager.playButtonClick()
        //     // TODO: 实现复习功能
        //     console.log('复习按钮点击')
        //   })
        // 跳过学习按钮
        Button.pop();
        // 顶部区域 - 标题和功能按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题卡片容器 - 支持左右滑动
            Scroll.create();
            // 主题卡片容器 - 支持左右滑动
            Scroll.width('100%');
            // 主题卡片容器 - 支持左右滑动
            Scroll.layoutWeight(1);
            // 主题卡片容器 - 支持左右滑动
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 主题卡片容器 - 支持左右滑动
            Scroll.scrollBar(BarState.Auto);
            // 主题卡片容器 - 支持左右滑动
            Scroll.padding({ left: GlobalStyles.SIZES.SPACING_LARGE + 10, right: GlobalStyles.SIZES.SPACING_LARGE });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.Start);
            Row.padding({ top: GlobalStyles.SIZES.SPACING_MEDIUM, bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
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
        Column.pop();
    }
    // 主题卡片
    ThemeCard(theme: ThemeData, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation(GlobalStyles.ANIMATIONS.BUTTON_PRESS);
            Column.width(200);
            Column.height(190);
            Column.backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND);
            Column.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Column.border({
                width: 2,
                color: this.getRandomBorderColor(index),
                style: BorderStyle.Solid
            });
            Column.padding({ top: 10, bottom: 10, left: 10, right: 10 });
            Column.justifyContent(FlexAlign.Center);
            Column.shadow(GlobalStyles.SHADOWS.MEDIUM);
            Column.margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM });
            Column.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.enterSubcategorySelect(theme.id);
            });
            Context.animation(null);
            Column.scale({ x: 1, y: 1 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题图标
            Image.create({ "id": -1, "type": 30000, params: [theme.icon], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
            // 主题图标
            Image.width(100);
            // 主题图标
            Image.height(100);
            // 主题图标
            Image.borderRadius(GlobalStyles.BORDER_RADIUS.SMALL);
            // 主题图标
            Image.backgroundColor('#FFFFFF');
            // 主题图标
            Image.objectFit(ImageFit.Contain);
            // 主题图标
            Image.padding(5);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题名称（包含进度信息）
            Text.create(`${theme.name}（${theme.completedWords}/${theme.totalWords}）`);
            // 主题名称（包含进度信息）
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
            // 主题名称（包含进度信息）
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            // 主题名称（包含进度信息）
            Text.fontWeight(FontWeight.Bold);
            // 主题名称（包含进度信息）
            Text.margin({ top: 8 });
            // 主题名称（包含进度信息）
            Text.textAlign(TextAlign.Center);
            // 主题名称（包含进度信息）
            Text.maxLines(2);
            // 主题名称（包含进度信息）
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 主题名称（包含进度信息）
            Text.width('100%');
        }, Text);
        // 主题名称（包含进度信息）
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 完成状态对勾
            if (this.isThemeCompleted(theme.id)) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✓');
                        Text.fontSize(30);
                        Text.fontColor('#52C41A');
                        Text.fontWeight(FontWeight.Bold);
                        Text.backgroundColor('#FFFFFF');
                        Text.borderRadius(20);
                        Text.width(40);
                        Text.height(40);
                        Text.textAlign(TextAlign.Center);
                        Text.position({ x: 160, y: 10 });
                        Text.shadow({
                            radius: 5,
                            color: '#00000020',
                            offsetX: 0,
                            offsetY: 2
                        });
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
    }
    // 子分类选择页面
    SubcategorySelectPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
            Column.expandSafeArea();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部区域 - 标题和返回按钮
            Row.create();
            // 顶部区域 - 标题和返回按钮
            Row.width('100%');
            // 顶部区域 - 标题和返回按钮
            Row.padding({ left: GlobalStyles.SIZES.SPACING_LARGE, right: GlobalStyles.SIZES.SPACING_LARGE, top: GlobalStyles.SIZES.SPACING_MEDIUM });
            // 顶部区域 - 标题和返回按钮
            Row.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.fontSize(22);
            Button.fontColor(Color.Black);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getThemeName(this.currentTheme)} - 选择子分类`);
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        // 顶部区域 - 标题和返回按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 子分类卡片容器 - 支持左右滑动
            Scroll.create();
            // 子分类卡片容器 - 支持左右滑动
            Scroll.width('100%');
            // 子分类卡片容器 - 支持左右滑动
            Scroll.layoutWeight(1);
            // 子分类卡片容器 - 支持左右滑动
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 子分类卡片容器 - 支持左右滑动
            Scroll.scrollBar(BarState.Auto);
            // 子分类卡片容器 - 支持左右滑动
            Scroll.padding({ left: GlobalStyles.SIZES.SPACING_LARGE + 10, right: GlobalStyles.SIZES.SPACING_LARGE });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.Start);
            Row.padding({ top: GlobalStyles.SIZES.SPACING_MEDIUM, bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const subcategory = _item;
                this.SubcategoryCard.bind(this)(subcategory, index);
            };
            this.forEachUpdateFunction(elmtId, this.subcategories, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 子分类卡片容器 - 支持左右滑动
        Scroll.pop();
        Column.pop();
    }
    // 子分类卡片
    SubcategoryCard(subcategory: SubcategoryData, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation(GlobalStyles.ANIMATIONS.BUTTON_PRESS);
            Column.width(200);
            Column.height(190);
            Column.backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND);
            Column.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Column.border({
                width: 2,
                color: this.getRandomBorderColor(index),
                style: BorderStyle.Solid
            });
            Column.padding({ top: 10, bottom: 10, left: 10, right: 10 });
            Column.justifyContent(FlexAlign.Center);
            Column.shadow(GlobalStyles.SHADOWS.MEDIUM);
            Column.margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM });
            Column.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.startSubcategoryLearning(subcategory.id);
            });
            Context.animation(null);
            Column.scale({ x: 1, y: 1 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 子分类图标
            Image.create({ "id": -1, "type": 30000, params: [subcategory.icon], "bundleName": "com.example.studyenglishbycard", "moduleName": "entry" });
            // 子分类图标
            Image.width(100);
            // 子分类图标
            Image.height(100);
            // 子分类图标
            Image.borderRadius(GlobalStyles.BORDER_RADIUS.SMALL);
            // 子分类图标
            Image.backgroundColor('#FFFFFF');
            // 子分类图标
            Image.objectFit(ImageFit.Contain);
            // 子分类图标
            Image.padding(5);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 子分类名称（包含进度信息）
            Text.create(`${subcategory.name}（${subcategory.completedWords}/${subcategory.totalWords}）`);
            // 子分类名称（包含进度信息）
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
            // 子分类名称（包含进度信息）
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            // 子分类名称（包含进度信息）
            Text.fontWeight(FontWeight.Bold);
            // 子分类名称（包含进度信息）
            Text.margin({ top: 8 });
            // 子分类名称（包含进度信息）
            Text.textAlign(TextAlign.Center);
            // 子分类名称（包含进度信息）
            Text.maxLines(2);
            // 子分类名称（包含进度信息）
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 子分类名称（包含进度信息）
            Text.width('100%');
        }, Text);
        // 子分类名称（包含进度信息）
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 完成状态对勾
            if (this.isSubcategoryCompleted(subcategory.id)) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✓');
                        Text.fontSize(30);
                        Text.fontColor('#52C41A');
                        Text.fontWeight(FontWeight.Bold);
                        Text.backgroundColor('#FFFFFF');
                        Text.borderRadius(20);
                        Text.width(40);
                        Text.height(40);
                        Text.textAlign(TextAlign.Center);
                        Text.position({ x: 160, y: 10 });
                        Text.shadow({
                            radius: 5,
                            color: '#00000020',
                            offsetX: 0,
                            offsetY: 2
                        });
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
    }
    // 设置页面
    ParentHelperPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('设置');
            // 标题
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            // 标题
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            // 标题
            Text.fontWeight(FontWeight.Bold);
            // 标题
            Text.margin({ top: GlobalStyles.SIZES.SPACING_LARGE, bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 音量控制
            Row.create();
            // 音量控制
            Row.justifyContent(FlexAlign.Center);
            // 音量控制
            Row.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('音量');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.currentVolume,
                min: 0,
                max: 100,
                step: 1
            });
            Slider.width(200);
            Slider.onChange((value: number) => {
                this.currentVolume = value;
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.currentVolume}%`);
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
            Text.margin({ left: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Text);
        Text.pop();
        // 音量控制
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Button.createWithLabel('返回首页');
            // 返回按钮
            Button.width(200);
            // 返回按钮
            Button.height(50);
            // 返回按钮
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            // 返回按钮
            Button.fontColor(Color.White);
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
    // 单词卡片页面（简化版本）
    WordCardPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(GlobalStyles.COLORS.BACKGROUND);
            Column.expandSafeArea();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部区域
            Row.create();
            // 顶部区域
            Row.width('100%');
            // 顶部区域
            Row.padding({ left: GlobalStyles.SIZES.SPACING_LARGE, right: GlobalStyles.SIZES.SPACING_LARGE, top: GlobalStyles.SIZES.SPACING_MEDIUM });
            // 顶部区域
            Row.margin({ bottom: GlobalStyles.SIZES.SPACING_MEDIUM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.width(60);
            Button.height(60);
            Button.backgroundColor(GlobalStyles.COLORS.LIGHT_GRAY);
            Button.fontSize(24);
            Button.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.goBack();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentSubcategory ? this.currentSubcategory.name : this.getThemeName(this.currentTheme));
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        // 顶部区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Column.create();
            // 内容区域
            Column.layoutWeight(1);
            // 内容区域
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('单词学习页面');
            Text.fontSize(GlobalStyles.FONT_SIZES.TITLE_LARGE);
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            Text.margin({ bottom: GlobalStyles.SIZES.SPACING_LARGE });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('这里将显示单词卡片内容');
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_MEDIUM);
            Text.fontColor(GlobalStyles.COLORS.TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 内容区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.studyenglishbycard", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
