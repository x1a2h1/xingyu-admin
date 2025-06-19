/* eslint-disable class-methods-use-this */
import type { WatermarkProps } from 'antd';

import { localStg } from './utils/storage';

class GlobalConfig {
  private _defaultDarkMode = localStg.get('darkMode') || false;

  private _defaultLang = localStg.get('lang') || 'zh-CN';

  private _defaultLangOptions: App.I18n.LangOption[] = [
    {
      key: 'zh-CN',
      label: '中文'
    },
    {
      key: 'en-US',
      label: 'English'
    }
  ];

  private _homePath = import.meta.env.VITE_ROUTE_HOME;

  private _defaultThemeColor = localStg.get('themeColor') || '#646cff';

  private _isDev = import.meta.env.DEV;

  private _noop = () => {};

  private _watermarkText = 'Soybean';

  private _watermarkConfig = {
    font: {
      fontSize: 16
    },
    height: 128,
    offset: [12, 60],
    rotate: -15,
    width: 240,
    zIndex: 9999
  } satisfies WatermarkProps;

  get defaultDarkMode() {
    return this._defaultDarkMode;
  }

  get defaultLang() {
    return this._defaultLang;
  }

  get defaultLangOptions() {
    return this._defaultLangOptions;
  }

  get defaultThemeColor() {
    return this._defaultThemeColor;
  }

  get isDev() {
    return this._isDev;
  }

  get noop() {
    return this._noop;
  }

  get watermarkConfig() {
    return this._watermarkConfig;
  }

  get watermarkText() {
    return this._watermarkText;
  }

  get homePath() {
    return this._homePath;
  }
}

export const globalConfig = new GlobalConfig();
