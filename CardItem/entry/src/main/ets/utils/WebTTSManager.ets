/**
 * WebTTSManager - 使用Web Speech API实现英文单词TTS
 * 适用于HarmonyOS，支持英文语音合成
 */

export class WebTTSManager {
  private static synth: any | null = null
  private static isAvailable: boolean = false

  /**
   * 初始化Web TTS
   */
  static init(): void {
    try {
      // 在HarmonyOS环境中，尝试使用全局的speechSynthesis或window.speechSynthesis
      if (typeof globalThis !== 'undefined' && globalThis.speechSynthesis) {
        WebTTSManager.synth = globalThis.speechSynthesis
        WebTTSManager.isAvailable = true
        console.info('Web TTS初始化成功')
      } else if (typeof window !== 'undefined' && window.speechSynthesis) {
        WebTTSManager.synth = window.speechSynthesis
        WebTTSManager.isAvailable = true
        console.info('Web TTS初始化成功')
      } else {
        console.warn('Web TTS不可用，使用降级方案')
        WebTTSManager.isAvailable = false
      }
    } catch (error) {
      console.error('Web TTS初始化失败:', error)
      WebTTSManager.isAvailable = false
    }
  }

  /**
   * 朗读英文单词
   * @param text 要朗读的英文单词
   * @param lang 语言代码，默认为'en-US'
   */
  static speak(text: string, lang: string = 'en-US'): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.info(`WebTTSManager.speak 被调用，文本: ${text}, 语言: ${lang}`)

      if (!WebTTSManager.isAvailable || !WebTTSManager.synth) {
        console.warn('Web TTS不可用，使用降级方案')
        WebTTSManager.fallbackSpeak(text)
        resolve()
        return
      }

      // 停止之前的播放
      try {
        WebTTSManager.synth.cancel()
      } catch (e) {
        console.warn('停止之前的TTS失败:', e)
      }

      // 创建SpeechSynthesisUtterance对象
      try {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        utterance.rate = 0.8  // 语速稍慢，适合学习
        utterance.pitch = 1.0
        utterance.volume = 1.0

        // 设置回调
        utterance.onend = () => {
          console.info('Web TTS播放完成')
          resolve()
        }

        utterance.onerror = (event: any) => {
          console.error('Web TTS播放错误:', event)
          WebTTSManager.fallbackSpeak(text)
          reject(event)
        }

        // 开始播放
        console.info('开始播放Web TTS...')
        WebTTSManager.synth.speak(utterance)

      } catch (error) {
        console.error('创建或播放TTS失败:', error)
        WebTTSManager.fallbackSpeak(text)
        reject(error)
      }
    })
  }

  /**
   * 降级方案：使用简单的拼音或提示
   */
  private static fallbackSpeak(text: string): void {
    console.info(`降级方案: 无法播放 "${text}"，请在设置中检查TTS配置`)
    // 可以在这里添加其他降级方案，比如显示音标等
  }

  /**
   * 停止TTS播放
   */
  static stop(): void {
    if (WebTTSManager.synth) {
      try {
        WebTTSManager.synth.cancel()
        console.info('Web TTS已停止')
      } catch (error) {
        console.warn('停止Web TTS失败:', error)
      }
    }
  }

  /**
   * 检查TTS是否可用
   */
  static isTTSAvailable(): boolean {
    return WebTTSManager.isAvailable
  }
}

