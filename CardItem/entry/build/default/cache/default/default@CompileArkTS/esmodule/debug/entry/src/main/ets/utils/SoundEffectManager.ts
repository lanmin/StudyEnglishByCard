// 音效管理器
export class SoundEffectManager {
    private static instance: SoundEffectManager;
    private constructor() { }
    static getInstance(): SoundEffectManager {
        if (!SoundEffectManager.instance) {
            SoundEffectManager.instance = new SoundEffectManager();
        }
        return SoundEffectManager.instance;
    }
    // 播放按钮点击音效
    playButtonClick(): void {
        console.log('Playing button click sound');
    }
    // 播放学习开始音效
    async playLearningStart(): Promise<void> {
        console.log('Playing learning start sound');
        return new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
    // 播放正确音效
    playCorrect(): void {
        console.log('Playing correct sound');
    }
    // 播放错误音效
    playError(): void {
        console.log('Playing error sound');
    }
    // 播放完成音效
    playComplete(): void {
        console.log('Playing complete sound');
    }
}
