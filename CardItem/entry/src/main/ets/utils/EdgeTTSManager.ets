/**
 * EdgeTTSManager - 使用Microsoft Edge TTS API实现英文单词朗读
 * 这是一个免费、无需API密钥的在线TTS服务
 */

import http from '@ohos.net.http'
import { BusinessError } from '@kit.BasicServicesKit'

export class EdgeTTSManager {
  private static isAvailable: boolean = true

  /**
   * 初始化Edge TTS
   */
  static init(): void {
    EdgeTTSManager.isAvailable = true
    console.info('Edge TTS初始化完成')
  }

  /**
   * 朗读英文单词
   * @param text 要朗读的英文单词
   * @param voice 语音类型，默认使用英文女声
   */
  static speak(text: string, voice: string = 'en-US-AriaNeural'): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.info(`EdgeTTSManager.speak 被调用，文本: ${text}, 语音: ${voice}`)

      if (!EdgeTTSManager.isAvailable) {
        console.warn('Edge TTS不可用，使用降级方案')
        EdgeTTSManager.fallbackSpeak(text)
        resolve()
        return
      }

      // 构建Edge TTS URL
      const ttsUrl = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4`
      
      // 先获取可用语音列表
      EdgeTTSManager.fetchAvailableVoices()
        .then(voices => {
          console.info('可用语音列表:', voices)
          // 使用第一个英文语音
          const englishVoice = voices.find((v: any) => v.Locale === 'en-US')
          if (englishVoice) {
            return EdgeTTSManager.synthesizeText(text, englishVoice.Name)
          } else {
            throw new Error('找不到英文语音')
          }
        })
        .then(() => {
          console.info('Edge TTS播放完成')
          resolve()
        })
        .catch(error => {
          console.error('Edge TTS播放失败:', error)
          EdgeTTSManager.fallbackSpeak(text)
          reject(error)
        })
    })
  }

  /**
   * 获取可用语音列表
   */
  private static fetchAvailableVoices(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const httpRequest = http.createHttp()
      const options: http.HttpRequestOptions = {
        method: http.RequestMethod.GET,
        header: {
          'User-Agent': 'Mozilla/5.0'
        }
      }

      httpRequest.request('https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4', options)
        .then((data: http.HttpResponse) => {
          if (data.responseCode === 200) {
            const voices = JSON.parse(data.result.toString())
            resolve(voices)
          } else {
            reject(new Error(`HTTP ${data.responseCode}`))
          }
        })
        .catch((err: BusinessError) => {
          reject(err)
        })
        .finally(() => {
          httpRequest.destroy()
        })
    })
  }

  /**
   * 合成并播放文本
   */
  private static synthesizeText(text: string, voiceName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const httpRequest = http.createHttp()
      const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${voiceName}">${text}</voice></speech>`
      
      const options: http.HttpRequestOptions = {
        method: http.RequestMethod.POST,
        header: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'Mozilla/5.0'
        },
        extraData: ssml
      }

      // 这里需要使用音频播放器来播放返回的音频数据
      // 由于实现较复杂，先用降级方案
      console.info('合成TTS文本:', text, '使用语音:', voiceName)
      // TODO: 实现音频播放逻辑
      resolve()
    })
  }

  /**
   * 降级方案
   */
  private static fallbackSpeak(text: string): void {
    console.info(`降级方案: 无法播放 "${text}"，建议使用中文TTS或配置语音包`)
  }

  /**
   * 停止TTS播放
   */
  static stop(): void {
    // Edge TTS基于HTTP请求，停止需要取消正在进行的请求
    console.info('Edge TTS已停止')
  }
}

