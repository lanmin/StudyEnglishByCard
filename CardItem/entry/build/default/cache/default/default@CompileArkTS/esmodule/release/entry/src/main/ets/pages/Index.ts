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
    showChallenge?: boolean;
    showSettingsDialog?: boolean;
    showPrivacyPage?: boolean;
    showReportDialog?: boolean;
    selectedWord?: WordData | null;
    isImageHidden?: boolean;
    volumeVisible?: boolean;
    currentVolume?: number;
    clickedThemeIndex?: number;
    clickedSubcategoryIndex?: number;
    cardScale?: number;
    cardOpacity?: number;
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
import { ChallengePage } from "@normalized:N&&&entry/src/main/ets/components/ChallengePage&";
import type { PageType, ThemeType, ThemeData, SubcategoryData, WordData, LearningMode } from '../types/CommonTypes';
import promptAction from "@ohos:promptAction";
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
        this.__showChallenge = new ObservedPropertySimplePU(false, this, "showChallenge");
        this.__showSettingsDialog = new ObservedPropertySimplePU(false, this, "showSettingsDialog");
        this.__showPrivacyPage = new ObservedPropertySimplePU(false, this, "showPrivacyPage");
        this.__showReportDialog = new ObservedPropertySimplePU(false, this, "showReportDialog");
        this.__selectedWord = new ObservedPropertyObjectPU(null, this, "selectedWord");
        this.__isImageHidden = new ObservedPropertySimplePU(false, this, "isImageHidden");
        this.__volumeVisible = new ObservedPropertySimplePU(false, this, "volumeVisible");
        this.__currentVolume = new ObservedPropertySimplePU(50
        // 卡片点击效果状态
        , this, "currentVolume");
        this.__clickedThemeIndex = new ObservedPropertySimplePU(-1, this, "clickedThemeIndex");
        this.__clickedSubcategoryIndex = new ObservedPropertySimplePU(-1, this, "clickedSubcategoryIndex");
        this.__cardScale = new ObservedPropertySimplePU(1, this, "cardScale");
        this.__cardOpacity = new ObservedPropertySimplePU(1
        // 管理器实例
        , this, "cardOpacity");
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
        if (params.showChallenge !== undefined) {
            this.showChallenge = params.showChallenge;
        }
        if (params.showSettingsDialog !== undefined) {
            this.showSettingsDialog = params.showSettingsDialog;
        }
        if (params.showPrivacyPage !== undefined) {
            this.showPrivacyPage = params.showPrivacyPage;
        }
        if (params.showReportDialog !== undefined) {
            this.showReportDialog = params.showReportDialog;
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
        if (params.clickedThemeIndex !== undefined) {
            this.clickedThemeIndex = params.clickedThemeIndex;
        }
        if (params.clickedSubcategoryIndex !== undefined) {
            this.clickedSubcategoryIndex = params.clickedSubcategoryIndex;
        }
        if (params.cardScale !== undefined) {
            this.cardScale = params.cardScale;
        }
        if (params.cardOpacity !== undefined) {
            this.cardOpacity = params.cardOpacity;
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
        this.__showChallenge.purgeDependencyOnElmtId(rmElmtId);
        this.__showSettingsDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__showPrivacyPage.purgeDependencyOnElmtId(rmElmtId);
        this.__showReportDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedWord.purgeDependencyOnElmtId(rmElmtId);
        this.__isImageHidden.purgeDependencyOnElmtId(rmElmtId);
        this.__volumeVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__currentVolume.purgeDependencyOnElmtId(rmElmtId);
        this.__clickedThemeIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__clickedSubcategoryIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__cardScale.purgeDependencyOnElmtId(rmElmtId);
        this.__cardOpacity.purgeDependencyOnElmtId(rmElmtId);
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
        this.__showChallenge.aboutToBeDeleted();
        this.__showSettingsDialog.aboutToBeDeleted();
        this.__showPrivacyPage.aboutToBeDeleted();
        this.__showReportDialog.aboutToBeDeleted();
        this.__selectedWord.aboutToBeDeleted();
        this.__isImageHidden.aboutToBeDeleted();
        this.__volumeVisible.aboutToBeDeleted();
        this.__currentVolume.aboutToBeDeleted();
        this.__clickedThemeIndex.aboutToBeDeleted();
        this.__clickedSubcategoryIndex.aboutToBeDeleted();
        this.__cardScale.aboutToBeDeleted();
        this.__cardOpacity.aboutToBeDeleted();
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
    private __showChallenge: ObservedPropertySimplePU<boolean>;
    get showChallenge() {
        return this.__showChallenge.get();
    }
    set showChallenge(newValue: boolean) {
        this.__showChallenge.set(newValue);
    }
    private __showSettingsDialog: ObservedPropertySimplePU<boolean>;
    get showSettingsDialog() {
        return this.__showSettingsDialog.get();
    }
    set showSettingsDialog(newValue: boolean) {
        this.__showSettingsDialog.set(newValue);
    }
    private __showPrivacyPage: ObservedPropertySimplePU<boolean>;
    get showPrivacyPage() {
        return this.__showPrivacyPage.get();
    }
    set showPrivacyPage(newValue: boolean) {
        this.__showPrivacyPage.set(newValue);
    }
    private __showReportDialog: ObservedPropertySimplePU<boolean>;
    get showReportDialog() {
        return this.__showReportDialog.get();
    }
    set showReportDialog(newValue: boolean) {
        this.__showReportDialog.set(newValue);
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
    // 卡片点击效果状态
    private __clickedThemeIndex: ObservedPropertySimplePU<number>;
    get clickedThemeIndex() {
        return this.__clickedThemeIndex.get();
    }
    set clickedThemeIndex(newValue: number) {
        this.__clickedThemeIndex.set(newValue);
    }
    private __clickedSubcategoryIndex: ObservedPropertySimplePU<number>;
    get clickedSubcategoryIndex() {
        return this.__clickedSubcategoryIndex.get();
    }
    set clickedSubcategoryIndex(newValue: number) {
        this.__clickedSubcategoryIndex.set(newValue);
    }
    private __cardScale: ObservedPropertySimplePU<number>;
    get cardScale() {
        return this.__cardScale.get();
    }
    set cardScale(newValue: number) {
        this.__cardScale.set(newValue);
    }
    private __cardOpacity: ObservedPropertySimplePU<number>;
    get cardOpacity() {
        return this.__cardOpacity.get();
    }
    set cardOpacity(newValue: number) {
        this.__cardOpacity.set(newValue);
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
    // 显示链接提示
    private showUrlPrompt(url: string) {
        promptAction.showToast({
            message: `请在浏览器中输入：${url}`,
            duration: 3000
        });
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
    // 卡片点击效果
    private async playCardClickEffect(cardType: 'theme' | 'subcategory', index: number) {
        if (cardType === 'theme') {
            this.clickedThemeIndex = index;
        }
        else {
            this.clickedSubcategoryIndex = index;
        }
        // 变大效果
        this.cardScale = 1.15;
        this.cardOpacity = 0.6;
        // 增强闪动效果 - 更明显的闪烁
        setTimeout(() => {
            this.cardOpacity = 1;
        }, 80);
        setTimeout(() => {
            this.cardOpacity = 0.5;
        }, 160);
        setTimeout(() => {
            this.cardOpacity = 1;
        }, 240);
        setTimeout(() => {
            this.cardOpacity = 0.7;
        }, 320);
        setTimeout(() => {
            this.cardOpacity = 1;
        }, 400);
        // 恢复原始大小
        setTimeout(() => {
            this.cardScale = 1;
            if (cardType === 'theme') {
                this.clickedThemeIndex = -1;
            }
            else {
                this.clickedSubcategoryIndex = -1;
            }
        }, 600);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showChallenge) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new ChallengePage(this, {
                                    theme: this.currentTheme,
                                    onBack: () => {
                                        this.showChallenge = false;
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 215, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        theme: this.currentTheme,
                                        onBack: () => {
                                            this.showChallenge = false;
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "ChallengePage" });
                    }
                });
            }
            else if (this.currentPage === 'theme_select') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.ThemeSelectPage.bind(this)();
                });
            }
            else if (this.currentPage === 'subcategory_select') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.SubcategorySelectPage.bind(this)();
                });
            }
            else if (this.currentPage === 'parent_helper') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.ParentHelperPage.bind(this)();
                });
            }
            else if (this.currentPage === 'word_card') {
                this.ifElseBranchUpdateFunction(4, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new WordLearningPage(this, {
                                    subcategoryId: this.currentSubcategoryId,
                                    onBack: () => {
                                        this.currentPage = 'subcategory_select';
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 228, col: 9 });
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
                this.ifElseBranchUpdateFunction(5, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // 主题选择页（横屏布局，左右滑动）
    ThemeSelectPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.expandSafeArea();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 背景图片
            Image.create({ "id": 0, "type": 30000, params: ['bg1.png'], "bundleName": "com.babyLearnEnglishi.huawei", "moduleName": "entry" });
            // 背景图片
            Image.width('100%');
            // 背景图片
            Image.height('100%');
            // 背景图片
            Image.objectFit(ImageFit.Cover);
            // 背景图片
            Image.opacity(0.6);
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
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.createWithLabel('挑战模式');
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.width(120);
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.height(40);
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_ORANGE);
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.fontSize(18);
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.fontColor(Color.White);
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.fontWeight(FontWeight.Bold);
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.borderRadius(25);
            // 挑战模式按钮（按当前选择的主题进入挑战页面）
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                console.log('挑战模式按钮点击，进入挑战页面，主题:', this.currentTheme);
                this.showChallenge = true;
            });
        }, Button);
        // 挑战模式按钮（按当前选择的主题进入挑战页面）
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 设置按钮
            Button.createWithLabel('设置');
            // 设置按钮
            Button.width(100);
            // 设置按钮
            Button.height(40);
            // 设置按钮
            Button.backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE);
            // 设置按钮
            Button.fontSize(18);
            // 设置按钮
            Button.fontColor(Color.White);
            // 设置按钮
            Button.fontWeight(FontWeight.Bold);
            // 设置按钮
            Button.borderRadius(25);
            // 设置按钮
            Button.margin({ left: 10 });
            // 设置按钮
            Button.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.showSettingsDialog = true;
            });
        }, Button);
        // 设置按钮
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
            Scroll.scrollBar(BarState.Off);
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
        // 主内容
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 设置页面（全屏）
            if (this.showSettingsDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#F5F5F5');
                        Column.expandSafeArea();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 顶部导航栏
                        Row.create();
                        // 顶部导航栏
                        Row.width('100%');
                        // 顶部导航栏
                        Row.padding({ left: 20, right: 20, top: 10, bottom: 10 });
                        // 顶部导航栏
                        Row.backgroundColor(GlobalStyles.COLORS.PRIMARY_BLUE);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('←');
                        Button.width(50);
                        Button.height(50);
                        Button.fontSize(24);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.soundEffectManager.playButtonClick();
                            this.showSettingsDialog = false;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('设置');
                        Text.fontSize(22);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                        Text.layoutWeight(1);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.width(50);
                    }, Blank);
                    Blank.pop();
                    // 顶部导航栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 功能按钮区域（两枚方块按钮，左右排列）
                        Column.create();
                        // 功能按钮区域（两枚方块按钮，左右排列）
                        Column.width('100%');
                        // 功能按钮区域（两枚方块按钮，左右排列）
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.height(40);
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding({ left: 60, right: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.create();
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.width(150);
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.height(150);
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.backgroundColor('#E3F2FD');
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.borderRadius(16);
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.border({ width: 2, color: GlobalStyles.COLORS.PRIMARY_BLUE, style: BorderStyle.Solid });
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.justifyContent(FlexAlign.Center);
                        // 儿童隐私协议 方块按钮（正方形）
                        Column.onClick(() => {
                            this.soundEffectManager.playButtonClick();
                            this.showPrivacyPage = true;
                            this.showSettingsDialog = false;
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📄');
                        Text.fontSize(34);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('儿童隐私协议');
                        Text.fontSize(16);
                        Text.fontColor('#333333');
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    // 儿童隐私协议 方块按钮（正方形）
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.width(40);
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 举报与投诉 方块按钮（正方形）
                        Column.create();
                        // 举报与投诉 方块按钮（正方形）
                        Column.width(150);
                        // 举报与投诉 方块按钮（正方形）
                        Column.height(150);
                        // 举报与投诉 方块按钮（正方形）
                        Column.backgroundColor('#FFEBEE');
                        // 举报与投诉 方块按钮（正方形）
                        Column.borderRadius(16);
                        // 举报与投诉 方块按钮（正方形）
                        Column.border({ width: 2, color: '#FF6B6B', style: BorderStyle.Solid });
                        // 举报与投诉 方块按钮（正方形）
                        Column.justifyContent(FlexAlign.Center);
                        // 举报与投诉 方块按钮（正方形）
                        Column.onClick(() => {
                            this.soundEffectManager.playButtonClick();
                            this.showReportDialog = true;
                            this.showSettingsDialog = false;
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📮');
                        Text.fontSize(34);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('举报与投诉');
                        Text.fontSize(16);
                        Text.fontColor('#333333');
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    // 举报与投诉 方块按钮（正方形）
                    Column.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.height(40);
                    }, Blank);
                    Blank.pop();
                    // 功能按钮区域（两枚方块按钮，左右排列）
                    Column.pop();
                    Column.pop();
                });
            }
            // 隐私协议页面（全屏）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 隐私协议页面（全屏）
            if (this.showPrivacyPage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width('100%');
                        Stack.height('100%');
                        Stack.expandSafeArea();
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#FFFFFF');
                        Column.expandSafeArea();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 顶部导航栏
                        Row.create();
                        // 顶部导航栏
                        Row.width('100%');
                        // 顶部导航栏
                        Row.padding({ left: 30, right: 20, top: 10, bottom: 10 });
                        // 顶部导航栏
                        Row.backgroundColor('#FFFFFF');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('←');
                        Button.width(50);
                        Button.height(50);
                        Button.fontSize(24);
                        Button.fontColor('#333333');
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.soundEffectManager.playButtonClick();
                            this.showPrivacyPage = false;
                            this.showSettingsDialog = true;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('儿童隐私协议');
                        Text.fontSize(20);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Bold);
                        Text.layoutWeight(1);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.width(50);
                    }, Blank);
                    Blank.pop();
                    // 顶部导航栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.color('#E0E0E0');
                        Divider.strokeWidth(1);
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 内容区域
                        Scroll.create();
                        // 内容区域
                        Scroll.layoutWeight(1);
                        // 内容区域
                        Scroll.scrollBar(BarState.Auto);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 40, right: 30, bottom: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('儿童隐私保护声明');
                        Text.fontSize(24);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ top: 20, bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('我们高度重视未成年人个人信息保护。为了帮助您了解我们如何收集、使用和保护儿童的个人信息，请您仔细阅读本隐私保护声明。');
                        Text.fontSize(16);
                        Text.fontColor('#555555');
                        Text.lineHeight(24);
                        Text.margin({ bottom: 20 });
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('查看完整隐私协议');
                        Text.fontSize(18);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 10 });
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 链接区域
                        Row.create();
                        // 链接区域
                        Row.width('100%');
                        // 链接区域
                        Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                        // 链接区域
                        Row.backgroundColor('#F0F8FF');
                        // 链接区域
                        Row.borderRadius(8);
                        // 链接区域
                        Row.border({
                            width: 1,
                            color: GlobalStyles.COLORS.PRIMARY_BLUE,
                            style: BorderStyle.Solid
                        });
                        // 链接区域
                        Row.margin({ bottom: 20 });
                        // 链接区域
                        Row.onClick(() => {
                            this.soundEffectManager.playButtonClick();
                            this.showUrlPrompt('https://lanmin.github.io/BabyStudyEnglishPrivacy.html');
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔗');
                        Text.fontSize(20);
                        Text.margin({ right: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('https://lanmin.github.io/BabyStudyEnglishPrivacy.html');
                        Text.fontSize(16);
                        Text.fontColor(GlobalStyles.COLORS.PRIMARY_BLUE);
                        Text.decoration({ type: TextDecorationType.Underline });
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    // 链接区域
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('您可以通过点击上方链接在浏览器中查看完整的《儿童隐私保护声明》，了解我们如何处理儿童的个人信息、您的权利以及如何联系我们。');
                        Text.fontSize(16);
                        Text.fontColor('#555555');
                        Text.lineHeight(24);
                        Text.margin({ bottom: 20 });
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('如有任何疑问或需要帮助，请发送邮件至：394743521@qq.com');
                        Text.fontSize(16);
                        Text.fontColor('#555555');
                        Text.lineHeight(24);
                        Text.margin({ bottom: 40 });
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    // 内容区域
                    Scroll.pop();
                    Column.pop();
                    Stack.pop();
                });
            }
            // 举报与投诉页面（全屏）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 举报与投诉页面（全屏）
            if (this.showReportDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#FFF5F5');
                        Column.expandSafeArea();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 顶部导航栏
                        Row.create();
                        // 顶部导航栏
                        Row.width('100%');
                        // 顶部导航栏
                        Row.padding({ left: 20, right: 20, top: 10, bottom: 10 });
                        // 顶部导航栏
                        Row.backgroundColor('#FF6B6B');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('←');
                        Button.width(50);
                        Button.height(50);
                        Button.fontSize(24);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.soundEffectManager.playButtonClick();
                            this.showReportDialog = false;
                            this.showSettingsDialog = true;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('举报与投诉');
                        Text.fontSize(22);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                        Text.layoutWeight(1);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.width(50);
                    }, Blank);
                    Blank.pop();
                    // 顶部导航栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 内容区域
                        Scroll.create();
                        // 内容区域
                        Scroll.layoutWeight(1);
                        // 内容区域
                        Scroll.scrollBar(BarState.Auto);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ top: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.height(40);
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 说明卡片
                        Column.create();
                        // 说明卡片
                        Column.width('100%');
                        // 说明卡片
                        Column.padding(24);
                        // 说明卡片
                        Column.backgroundColor('#FFFFFF');
                        // 说明卡片
                        Column.borderRadius(16);
                        // 说明卡片
                        Column.margin({ left: 30, right: 30, bottom: 20 });
                        // 说明卡片
                        Column.shadow({ radius: 8, color: '#00000010', offsetX: 0, offsetY: 2 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📢');
                        Text.fontSize(48);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('举报与投诉');
                        Text.fontSize(24);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('我们高度重视未成年人保护。');
                        Text.fontSize(18);
                        Text.fontColor('#666666');
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('若您认为应用内容或功能不当，或涉及未成年人权益受侵害，欢迎通过以下方式与我们联系：');
                        Text.fontSize(16);
                        Text.fontColor('#555555');
                        Text.lineHeight(24);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    // 说明卡片
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 联系方式卡片
                        Column.create();
                        // 联系方式卡片
                        Column.width('100%');
                        // 联系方式卡片
                        Column.padding(24);
                        // 联系方式卡片
                        Column.backgroundColor('#FFFFFF');
                        // 联系方式卡片
                        Column.borderRadius(16);
                        // 联系方式卡片
                        Column.margin({ left: 30, right: 30, bottom: 20 });
                        // 联系方式卡片
                        Column.shadow({ radius: 8, color: '#00000010', offsetX: 0, offsetY: 2 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📧');
                        Text.fontSize(40);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('联系方式');
                        Text.fontSize(20);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.padding(16);
                        Row.backgroundColor('#FFEBEE');
                        Row.borderRadius(12);
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('邮箱：');
                        Text.fontSize(18);
                        Text.fontColor('#555555');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('394743521@qq.com');
                        Text.fontSize(18);
                        Text.fontColor('#FF6B6B');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('我们将及时受理并处理您的投诉与举报，尽快予以反馈。');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        Text.lineHeight(22);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('依据相关规范（8.14），我们提供便捷、合理、有效的投诉和举报渠道。');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        Text.lineHeight(22);
                    }, Text);
                    Text.pop();
                    // 联系方式卡片
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 返回按钮
                        Button.createWithLabel('返回');
                        // 返回按钮
                        Button.width('90%');
                        // 返回按钮
                        Button.height(50);
                        // 返回按钮
                        Button.backgroundColor('#FF6B6B');
                        // 返回按钮
                        Button.fontSize(18);
                        // 返回按钮
                        Button.fontColor(Color.White);
                        // 返回按钮
                        Button.fontWeight(FontWeight.Bold);
                        // 返回按钮
                        Button.borderRadius(25);
                        // 返回按钮
                        Button.margin({ left: 30, right: 30, bottom: 20 });
                        // 返回按钮
                        Button.onClick(() => {
                            this.soundEffectManager.playButtonClick();
                            this.showReportDialog = false;
                            this.showSettingsDialog = true;
                        });
                    }, Button);
                    // 返回按钮
                    Button.pop();
                    Column.pop();
                    // 内容区域
                    Scroll.pop();
                    Column.pop();
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
    // 主题卡片
    ThemeCard(theme: ThemeData, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({ duration: 200, curve: Curve.EaseInOut });
            Column.width(200);
            Column.height(190);
            Column.backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND);
            Column.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Column.border({
                width: this.clickedThemeIndex === index ? 8 : 4,
                color: this.clickedThemeIndex === index ? '#FF6B6B' : this.getRandomBorderColor(index),
                style: BorderStyle.Solid
            });
            Column.padding({ top: 10, bottom: 10, left: 10, right: 10 });
            Column.justifyContent(FlexAlign.Center);
            Column.shadow(GlobalStyles.SHADOWS.MEDIUM);
            Column.margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM });
            Column.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.playCardClickEffect('theme', index);
                // 延迟执行导航，让动画先播放
                setTimeout(() => {
                    this.enterSubcategorySelect(theme.id);
                }, 300);
            });
            Column.scale({
                x: this.clickedThemeIndex === index ? this.cardScale : 1,
                y: this.clickedThemeIndex === index ? this.cardScale : 1
            });
            Column.opacity(this.clickedThemeIndex === index ? this.cardOpacity : 1);
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主题图标
            Image.create({ "id": -1, "type": 30000, params: [theme.icon], "bundleName": "com.babyLearnEnglishi.huawei", "moduleName": "entry" });
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
            // 主题名称
            Text.create(theme.name);
            // 主题名称
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
            // 主题名称
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            // 主题名称
            Text.fontWeight(FontWeight.Bold);
            // 主题名称
            Text.margin({ top: 8 });
            // 主题名称
            Text.textAlign(TextAlign.Center);
            // 主题名称
            Text.maxLines(2);
            // 主题名称
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 主题名称
            Text.width('100%');
        }, Text);
        // 主题名称
        Text.pop();
        Column.pop();
        Stack.pop();
    }
    // 子分类选择页面
    SubcategorySelectPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.expandSafeArea();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 背景图片
            Image.create({ "id": 0, "type": 30000, params: ['bg2.png'], "bundleName": "com.babyLearnEnglishi.huawei", "moduleName": "entry" });
            // 背景图片
            Image.width('100%');
            // 背景图片
            Image.height('100%');
            // 背景图片
            Image.objectFit(ImageFit.Cover);
            // 背景图片
            Image.opacity(0.6);
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
            Scroll.scrollBar(BarState.Off);
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
        // 主内容
        Column.pop();
        Stack.pop();
    }
    // 子分类卡片
    SubcategoryCard(subcategory: SubcategoryData, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({ duration: 200, curve: Curve.EaseInOut });
            Column.width(200);
            Column.height(190);
            Column.backgroundColor(GlobalStyles.COLORS.CARD_BACKGROUND);
            Column.borderRadius(GlobalStyles.BORDER_RADIUS.MEDIUM);
            Column.border({
                width: this.clickedSubcategoryIndex === index ? 6 : 2,
                color: this.clickedSubcategoryIndex === index ? '#FF6B6B' : this.getRandomBorderColor(index),
                style: BorderStyle.Solid
            });
            Column.padding({ top: 10, bottom: 10, left: 10, right: 10 });
            Column.justifyContent(FlexAlign.Center);
            Column.shadow(GlobalStyles.SHADOWS.MEDIUM);
            Column.margin({ right: GlobalStyles.SIZES.SPACING_MEDIUM });
            Column.onClick(() => {
                this.soundEffectManager.playButtonClick();
                this.playCardClickEffect('subcategory', index);
                // 延迟执行导航，让动画先播放
                setTimeout(() => {
                    this.startSubcategoryLearning(subcategory.id);
                }, 300);
            });
            Column.scale({
                x: this.clickedSubcategoryIndex === index ? this.cardScale : 1,
                y: this.clickedSubcategoryIndex === index ? this.cardScale : 1
            });
            Column.opacity(this.clickedSubcategoryIndex === index ? this.cardOpacity : 1);
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 子分类图标
            Image.create({ "id": -1, "type": 30000, params: [subcategory.icon], "bundleName": "com.babyLearnEnglishi.huawei", "moduleName": "entry" });
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
            // 子分类名称
            Text.create(subcategory.name);
            // 子分类名称
            Text.fontSize(GlobalStyles.FONT_SIZES.TEXT_SMALL);
            // 子分类名称
            Text.fontColor(GlobalStyles.COLORS.TEXT_PRIMARY);
            // 子分类名称
            Text.fontWeight(FontWeight.Bold);
            // 子分类名称
            Text.margin({ top: 8 });
            // 子分类名称
            Text.textAlign(TextAlign.Center);
            // 子分类名称
            Text.maxLines(2);
            // 子分类名称
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 子分类名称
            Text.width('100%');
        }, Text);
        // 子分类名称
        Text.pop();
        Column.pop();
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
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.babyLearnEnglishi.huawei", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
