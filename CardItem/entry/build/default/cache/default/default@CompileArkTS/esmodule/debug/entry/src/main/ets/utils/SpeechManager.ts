import promptAction from "@ohos:promptAction";
import textToSpeech from "@hms:ai.textToSpeech";
import type { BusinessError as BusinessError } from "@ohos:base";
export class SpeechManager {
    private static currentSpeakingWord: string = '';
    private static ttsEngine: textToSpeech.TextToSpeechEngine | null = null;
    private static isInitialized: boolean = false;
    private static isMuted: boolean = false;
    // 初始化
    static init(): void {
        if (SpeechManager.isInitialized) {
            console.info('TTS已经初始化过了');
            return;
        }
        console.info('开始初始化TTS...');
        // 尝试不同的配置方式
        try {
            // 设置创建引擎参数 - 使用中文TTS（系统只支持zh-CN）
            let initParamsInfo: textToSpeech.CreateEngineParams = {
                language: 'zh-CN',
                person: 0,
                online: 1
            };
            console.info('开始创建TTS引擎，参数:', JSON.stringify(initParamsInfo));
            textToSpeech.createEngine(initParamsInfo, (err: BusinessError, textToSpeechEngine: textToSpeech.TextToSpeechEngine) => {
                console.info('🔔 createEngine回调被触发');
                console.info('err参数:', err ? `错误存在，code: ${err.code}, message: ${err.message}` : 'err为null');
                console.info('textToSpeechEngine参数:', textToSpeechEngine ? '引擎对象存在' : '引擎对象为null');
                if (!err) {
                    console.info('✅ TTS引擎创建成功！');
                    SpeechManager.ttsEngine = textToSpeechEngine;
                    console.info('准备调用setupListener...');
                    SpeechManager.setupListener();
                    SpeechManager.isInitialized = true;
                    console.info('TTS引擎初始化完成，isInitialized:', SpeechManager.isInitialized);
                    console.info('TTS引擎对象:', !!textToSpeechEngine);
                }
                else {
                    console.error(`❌ TTS引擎创建失败. Code: ${err.code}, message: ${err.message}.`);
                    console.info('尝试备用TTS配置...');
                    // 尝试备用配置
                    SpeechManager.tryAlternativeTTS();
                }
            });
        }
        catch (error) {
            console.error('TTS初始化异常:', error);
            SpeechManager.isInitialized = false;
        }
    }
    // 备用TTS配置方法
    private static tryAlternativeTTS(): void {
        console.info('尝试备用TTS配置...');
        // 尝试中文TTS在线模式
        let alternativeParams: textToSpeech.CreateEngineParams = {
            language: 'zh-CN',
            person: 0,
            online: 1
        };
        console.info('尝试英文TTS在线模式，参数:', JSON.stringify(alternativeParams));
        textToSpeech.createEngine(alternativeParams, (err: BusinessError, textToSpeechEngine: textToSpeech.TextToSpeechEngine) => {
            if (!err) {
                console.info('英文TTS引擎创建成功');
                SpeechManager.ttsEngine = textToSpeechEngine;
                SpeechManager.setupListener();
                SpeechManager.isInitialized = true;
                console.info('英文TTS引擎初始化完成');
            }
            else {
                console.error(`英文TTS引擎创建失败. Code: ${err.code}, message: ${err.message}.`);
                console.info('尝试最简单的配置...');
                SpeechManager.trySimplestTTS();
            }
        });
    }
    // 最简单的TTS配置
    private static trySimplestTTS(): void {
        console.info('尝试最简单的TTS配置...');
        // 只设置语言，其他参数使用默认值
        let simplestParams: textToSpeech.CreateEngineParams = {
            language: 'zh-CN',
            person: 0,
            online: 0
        };
        console.info('尝试最简单配置，参数:', JSON.stringify(simplestParams));
        textToSpeech.createEngine(simplestParams, (err: BusinessError, textToSpeechEngine: textToSpeech.TextToSpeechEngine) => {
            if (!err) {
                console.info('最简单TTS引擎创建成功');
                SpeechManager.ttsEngine = textToSpeechEngine;
                SpeechManager.setupListener();
                SpeechManager.isInitialized = true;
                console.info('最简单TTS引擎初始化完成');
            }
            else {
                console.error(`最简单TTS引擎创建失败. Code: ${err.code}, message: ${err.message}.`);
                console.warn('所有TTS配置都失败，将使用Toast模式作为降级方案');
                SpeechManager.isInitialized = false;
            }
        });
    }
    // 设置TTS监听器
    private static setupListener(): void {
        console.info('setupListener被调用');
        if (!SpeechManager.ttsEngine) {
            console.error('setupListener: ttsEngine为null');
            return;
        }
        console.info('开始设置监听器...');
        // 设置speak的回调信息
        let speakListener: textToSpeech.SpeakListener = {
            // 开始播报回调
            onStart(requestId: string, response: textToSpeech.StartResponse) {
                console.info(`🎉 onStart被触发！requestId: ${requestId} response: ${JSON.stringify(response)}`);
            },
            // 合成完成及播报完成回调
            onComplete(requestId: string, response: textToSpeech.CompleteResponse) {
                console.info(`🎉 onComplete被触发！requestId: ${requestId} response: ${JSON.stringify(response)}`);
                console.info('✅ TTS播放应该已经完成，现在应该能听到声音了');
            },
            // 停止播报回调
            onStop(requestId: string, response: textToSpeech.StopResponse) {
                console.info(`onStop, requestId: ${requestId} response: ${JSON.stringify(response)}`);
            },
            // 返回音频流
            onData(requestId: string, audio: ArrayBuffer, response: textToSpeech.SynthesisResponse) {
                console.info(`🎵 onData被触发！requestId: ${requestId} audio size: ${audio.byteLength} bytes`);
                console.info(`audioType: ${response.audioType}`);
                console.info(`sequence: ${JSON.stringify(response)}`);
                if (audio.byteLength > 0) {
                    console.info('✅ 收到音频数据！应该有声音播放了');
                }
                else {
                    console.warn('⚠️ 音频数据为空！');
                }
            },
            // 错误回调
            onError(requestId: string, errorCode: number, errorMessage: string) {
                console.error(`❌ onError被触发！requestId: ${requestId} errorCode: ${errorCode} errorMessage: ${errorMessage}`);
                // 降级到Toast模式
                SpeechManager.performFallbackSpeech(SpeechManager.currentSpeakingWord);
            }
        };
        // 设置回调
        try {
            SpeechManager.ttsEngine.setListener(speakListener);
            console.info('✅ 监听器设置成功！');
        }
        catch (e) {
            console.error('❌ 监听器设置失败:', e);
        }
    }
    // 设置静音状态
    static setMuted(muted: boolean): void {
        SpeechManager.isMuted = muted;
    }
    // 获取静音状态
    static getMuted(): boolean {
        return SpeechManager.isMuted;
    }
    // 获取当前正在发音的单词
    static getCurrentSpeakingWord(): string {
        return SpeechManager.currentSpeakingWord;
    }
    // 发音方法
    static async speak(text: string): Promise<void> {
        console.info('SpeechManager.speak 被调用，文本:', text);
        console.info('静音状态:', SpeechManager.isMuted);
        if (SpeechManager.isMuted || !text) {
            console.info('发音被跳过 - 静音或文本为空');
            return;
        }
        try {
            SpeechManager.currentSpeakingWord = text;
            // 确保TTS已初始化
            if (!SpeechManager.isInitialized) {
                console.info('TTS未初始化，开始初始化...');
                SpeechManager.init();
                // 等待初始化完成
                await new Promise<void>(resolve => {
                    const checkInit = () => {
                        if (SpeechManager.isInitialized) {
                            console.info('TTS初始化完成，isInitialized:', SpeechManager.isInitialized, 'ttsEngine:', !!SpeechManager.ttsEngine);
                            resolve();
                        }
                        else {
                            setTimeout(checkInit, 100);
                        }
                    };
                    checkInit();
                });
            }
            else {
                console.info('TTS已初始化');
            }
            if (SpeechManager.ttsEngine && SpeechManager.isInitialized) {
                try {
                    console.info('开始TTS播放:', text);
                    console.info('TTS引擎状态:', !!SpeechManager.ttsEngine);
                    // 先停止之前的播放
                    try {
                        SpeechManager.ttsEngine.stop();
                        console.info('已停止之前的TTS播放');
                    }
                    catch (e) {
                        console.info('停止之前的TTS失败或无播放中:', e);
                    }
                    // 调用播报方法，使用requestId
                    const requestId = new Date().getTime().toString();
                    console.info('发送TTS播放请求，requestId:', requestId, 'text:', text);
                    // 先尝试停止当前播放，避免重叠
                    try {
                        SpeechManager.ttsEngine.stop();
                        console.info('已停止当前TTS播放');
                        // 等待一小段时间确保停止完成
                        await new Promise<void>(resolve => setTimeout(resolve, 100));
                    }
                    catch (stopErr) {
                        console.warn('停止TTS失败（可能是没有正在播放的）:', stopErr);
                    }
                    // 调用speak方法，增加音量参数
                    try {
                        console.info('准备调用speak方法，text:', text, 'requestId:', requestId);
                        // speak方法的正确调用方式：speak(text, { requestId: requestId, volume: 1.5 })
                        // 注意：音量参数可能需要根据实际情况调整
                        SpeechManager.ttsEngine.speak(text, {
                            requestId: requestId,
                            // volume: 1.5  // 尝试增加音量（如果API支持）
                        });
                        console.info('TTS播放命令已发送，等待onStart回调...');
                    }
                    catch (speakErr) {
                        console.error('调用speak方法失败:', speakErr);
                        // 降级到Toast模式
                        await SpeechManager.performFallbackSpeech(text);
                    }
                    // 设置单词高亮持续时间
                    setTimeout(() => {
                        SpeechManager.currentSpeakingWord = '';
                    }, 3000);
                }
                catch (speakError) {
                    console.error('TTS播放失败:', speakError);
                    // 降级到Toast模式
                    await SpeechManager.performFallbackSpeech(text);
                }
            }
            else {
                console.warn('TTS引擎未初始化，使用降级模式');
                console.info('TTS引擎状态 - isInitialized:', SpeechManager.isInitialized, 'ttsEngine:', !!SpeechManager.ttsEngine);
                // 降级到Toast模式
                await SpeechManager.performFallbackSpeech(text);
            }
        }
        catch (error) {
            console.error('发音失败:', error);
            // 降级到Toast模式
            await SpeechManager.performFallbackSpeech(text);
        }
    }
    // 降级发音（Toast模式）
    private static async performFallbackSpeech(text: string): Promise<void> {
        try {
            const phonetic = SpeechManager.getPhonetic(text);
            const message = phonetic ? `🔊 ${text} [${phonetic}]` : `🔊 ${text}`;
            console.info('使用Toast模式显示发音:', message);
            await promptAction.showToast({
                message: message,
                duration: 3000 // 延长显示时间
            });
            // 设置单词高亮持续时间
            setTimeout(() => {
                SpeechManager.currentSpeakingWord = '';
            }, 3000);
        }
        catch (error) {
            console.error('降级发音失败:', error);
        }
    }
    // 获取单词音标
    private static getPhonetic(word: string): string {
        const phoneticMap: Record<string, string> = {
            'hello': '/həˈloʊ/',
            'world': '/wɜːrld/',
            'apple': '/ˈæpəl/',
            'banana': '/bəˈnænə/',
            'orange': '/ˈɔːrɪndʒ/',
            'water': '/ˈwɔːtər/',
            'food': '/fuːd/',
            'book': '/bʊk/',
            'school': '/skuːl/',
            'house': '/haʊs/',
            'car': '/kɑːr/',
            'dog': '/dɔːɡ/',
            'cat': '/kæt/',
            'bird': '/bɜːrd/',
            'fish': '/fɪʃ/',
            'tree': '/triː/',
            'flower': '/ˈflaʊər/',
            'sun': '/sʌn/',
            'moon': '/muːn/',
            'star': '/stɑːr/',
            'happy': '/ˈhæpi/',
            'sad': '/sæd/',
            'big': '/bɪɡ/',
            'small': '/smɔːl/',
            'good': '/ɡʊd/',
            'bad': '/bæd/',
            'new': '/nuː/',
            'old': '/oʊld/',
            'hot': '/hɑːt/',
            'cold': '/koʊld/',
            'fast': '/fæst/',
            'slow': '/sloʊ/',
            'high': '/haɪ/',
            'low': '/loʊ/',
            'up': '/ʌp/',
            'down': '/daʊn/',
            'left': '/left/',
            'right': '/raɪt/',
            'yes': '/jes/',
            'no': '/noʊ/',
            'please': '/pliːz/',
            'thank': '/θæŋk/',
            'you': '/juː/',
            'me': '/miː/',
            'we': '/wiː/',
            'they': '/ðeɪ/',
            'he': '/hiː/',
            'she': '/ʃiː/',
            'it': '/ɪt/',
            'this': '/ðɪs/',
            'that': '/ðæt/',
            'here': '/hɪr/',
            'there': '/ðer/',
            'where': '/wer/',
            'when': '/wen/',
            'what': '/wʌt/',
            'who': '/huː/',
            'why': '/waɪ/',
            'how': '/haʊ/'
        };
        return phoneticMap[word.toLowerCase()] || '';
    }
    // 停止发音
    static async stop(): Promise<void> {
        try {
            if (SpeechManager.ttsEngine && SpeechManager.isInitialized) {
                SpeechManager.ttsEngine.stop();
            }
        }
        catch (error) {
            console.error('停止TTS失败:', error);
        }
        SpeechManager.currentSpeakingWord = '';
    }
    // 销毁
    static async destroy(): Promise<void> {
        try {
            if (SpeechManager.ttsEngine && SpeechManager.isInitialized) {
                SpeechManager.ttsEngine.stop();
            }
        }
        catch (error) {
            console.error('销毁TTS失败:', error);
        }
        SpeechManager.ttsEngine = null;
        SpeechManager.isInitialized = false;
        SpeechManager.currentSpeakingWord = '';
    }
}
