// 全局样式定义

// 颜色接口定义
interface ColorConfig {
  BACKGROUND: string
  PRIMARY_BLUE: string
  PRIMARY_PINK: string
  PRIMARY_ORANGE: string
  PRIMARY_GREEN: string
  PRIMARY_YELLOW: string
  TEXT_PRIMARY: string
  TEXT_SECONDARY: string
  TEXT_WHITE: string
  LIGHT_GRAY: string
  CARD_BACKGROUND: string
}

// 字体大小接口定义
interface FontSizeConfig {
  TITLE_LARGE: number
  TITLE_MEDIUM: number
  TEXT_LARGE: number
  TEXT_MEDIUM: number
  TEXT_SMALL: number
  TEXT_TINY: number
}

// 按钮尺寸接口定义
interface ButtonSizeConfig {
  width: number
  height: number
}

// 尺寸接口定义
interface SizeConfig {
  BUTTON_LARGE: ButtonSizeConfig
  BUTTON_MEDIUM: ButtonSizeConfig
  BUTTON_SMALL: ButtonSizeConfig
  THEME_ICON: number
  CORE_IMAGE_WIDTH: number
  CORE_IMAGE_HEIGHT: number
  SPACING_LARGE: number
  SPACING_MEDIUM: number
  SPACING_SMALL: number
  SPACING_TINY: number
}

// 边框半径接口定义
interface BorderRadiusConfig {
  LARGE: number
  MEDIUM: number
  SMALL: number
}

// 阴影配置接口定义
interface ShadowConfigItem {
  radius: number
  color: string
  offsetX: number
  offsetY: number
}

// 阴影接口定义
interface ShadowConfig {
  SMALL: ShadowConfigItem
  MEDIUM: ShadowConfigItem
  LARGE: ShadowConfigItem
}

// 动画配置接口定义
interface AnimationConfigItem {
  duration: number
  curve: Curve
}

// 动画接口定义
interface AnimationConfig {
  BUTTON_PRESS: AnimationConfigItem
  CARD_HOVER: AnimationConfigItem
}

export class GlobalStyles {
  // 颜色定义
  static readonly COLORS: ColorConfig = {
    BACKGROUND: '#FFF8F0',
    PRIMARY_BLUE: '#3399FF',
    PRIMARY_PINK: '#FF3366',
    PRIMARY_ORANGE: '#FF9900',
    PRIMARY_GREEN: '#33CC33',
    PRIMARY_YELLOW: '#FFCC00',
    TEXT_PRIMARY: '#333333',
    TEXT_SECONDARY: '#999999',
    TEXT_WHITE: '#FFFFFF',
    LIGHT_GRAY: '#E0E0E0',
    CARD_BACKGROUND: '#FFFFFF'
  }

  // 字体大小定义
  static readonly FONT_SIZES: FontSizeConfig = {
    TITLE_LARGE: 48,
    TITLE_MEDIUM: 36,
    TEXT_LARGE: 32,
    TEXT_MEDIUM: 28,
    TEXT_SMALL: 24,
    TEXT_TINY: 20
  }

  // 尺寸定义
  static readonly SIZES: SizeConfig = {
    BUTTON_LARGE: { width: 150, height: 60 },
    BUTTON_MEDIUM: { width: 120, height: 50 },
    BUTTON_SMALL: { width: 100, height: 40 },
    THEME_ICON: 180,
    CORE_IMAGE_WIDTH: 380,
    CORE_IMAGE_HEIGHT: 280,
    SPACING_LARGE: 30,
    SPACING_MEDIUM: 20,
    SPACING_SMALL: 15,
    SPACING_TINY: 10
  }

  // 边框半径定义
  static readonly BORDER_RADIUS: BorderRadiusConfig = {
    LARGE: 20,
    MEDIUM: 15,
    SMALL: 10
  }

  // 阴影定义
  static readonly SHADOWS: ShadowConfig = {
    SMALL: { radius: 4, color: '#00000020', offsetX: 0, offsetY: 2 },
    MEDIUM: { radius: 8, color: '#00000030', offsetX: 0, offsetY: 4 },
    LARGE: { radius: 12, color: '#00000040', offsetX: 0, offsetY: 6 }
  }

  // 动画定义
  static readonly ANIMATIONS: AnimationConfig = {
    BUTTON_PRESS: { duration: 200, curve: Curve.EaseInOut },
    CARD_HOVER: { duration: 300, curve: Curve.EaseInOut }
  }
}