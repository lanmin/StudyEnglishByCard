/**
 * AudioRecorderManager - 录音管理类
 * 用于在口语模式中录制和保存用户的发音
 */

import audio from '@ohos.multimedia.audio'
import fileIO from '@ohos.file.fs'
import { BusinessError } from '@kit.BasicServicesKit'

export class AudioRecorderManager {
  private static audioRecorder: audio.AudioCapturer | null = null
  private static isRecording: boolean = false
  private static recordUri: string = ''

  /**
   * 开始录音
   * @param fileName 录音文件名（不含扩展名）
   * @returns 录音文件URI
   */
  static async startRecord(fileName: string): Promise<string> {
    console.info('AudioRecorderManager: 开始录音，文件名:', fileName)

    try {
      // 创建AudioCapturer实例
      const streamInfo: audio.AudioStreamInfo = {
        samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_44100,
        channels: audio.AudioChannel.CHANNEL_2,
        sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
        encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW
      }
      
      const audioCapturerInfo: audio.AudioCapturerInfo = {
        source: audio.SourceType.SOURCE_TYPE_MIC,
        capturerFlags: 0
      }
      
      const audioCapturerOptions: audio.AudioCapturerOptions = {
        streamInfo: streamInfo,
        capturerInfo: audioCapturerInfo
      }
      
      console.info('AudioRecorderManager: 创建AudioCapturer')
      const audioCapturer = await audio.createAudioCapturer(audioCapturerOptions)
      AudioRecorderManager.audioRecorder = audioCapturer
      
      console.info('AudioRecorderManager: 开始录音')
      if (AudioRecorderManager.audioRecorder) {
        await AudioRecorderManager.audioRecorder.start()
      }
      
      AudioRecorderManager.isRecording = true
      AudioRecorderManager.recordUri = `file:///data/storage/el2/base/haps/entry/files/${fileName}.wav`
      
      console.info('AudioRecorderManager: 录音开始成功，URI:', AudioRecorderManager.recordUri)
      return AudioRecorderManager.recordUri
      
    } catch (error) {
      console.error('AudioRecorderManager: 录音开始失败:', error)
      // 不throw，返回空字符串
      return ''
    }
  }

  /**
   * 停止录音
   * @returns 录音文件URI
   */
  static async stopRecord(): Promise<string> {
    console.info('AudioRecorderManager: 停止录音')
    
    if (!AudioRecorderManager.audioRecorder || !AudioRecorderManager.isRecording) {
      console.warn('AudioRecorderManager: 没有正在进行的录音')
      return ''
    }

    try {
      await AudioRecorderManager.audioRecorder.stop()
      await AudioRecorderManager.audioRecorder.release()
      
      AudioRecorderManager.audioRecorder = null
      AudioRecorderManager.isRecording = false
      
      const uri = AudioRecorderManager.recordUri
      AudioRecorderManager.recordUri = ''
      
      console.info('AudioRecorderManager: 录音停止成功，文件:', uri)
      return uri
      
    } catch (error) {
      console.error('AudioRecorderManager: 录音停止失败:', error)
      return ''
    }
  }

  /**
   * 检查是否正在录音
   */
  static isRecordingNow(): boolean {
    return AudioRecorderManager.isRecording
  }

  /**
   * 获取录音文件URI
   */
  static getRecordUri(): string {
    return AudioRecorderManager.recordUri
  }
}

