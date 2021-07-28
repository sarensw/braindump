// source: https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter

import * as monaco from 'monaco-editor';

export interface IVSCodeTheme {
  "$schema": "vscode://schemas/color-theme",
  "type": 'dark' | 'light',
  colors: { [name: string]: string };
  tokenColors: {
      name?: string;
      "scope": string[] | string,
      "settings": {
          foreground?: string;
          background?: string;
          fontStyle?: string;
      }
  }[]
}

export type IMonacoThemeRule = monaco.editor.ITokenThemeRule[]

export function convertTheme(theme: IVSCodeTheme): monaco.editor.IStandaloneThemeData {

    const monacoThemeRule: IMonacoThemeRule = [];
    const returnTheme: monaco.editor.IStandaloneThemeData = {
        inherit: true,
        base: 'vs-dark',
        colors: theme.colors,
        rules: monacoThemeRule,
        encodedTokensColors: []
    };

    returnTheme.base = theme.type === 'dark' ? 'vs-dark' : 'vs'

    theme.tokenColors.map((color) => {

        if (typeof color.scope == 'string') {

            const split = color.scope.split(',');

            if (split.length > 1) {
                color.scope = split;
                evalAsArray();
                return;
            }

            monacoThemeRule.push(Object.assign({}, color.settings, {
                // token: color.scope.trim().replace(/\s/g, '')
                token: color.scope.trim()
            }));
            return;
        }

        evalAsArray();

        function evalAsArray() {
            (color.scope as string[])?.map((scope) => {
                monacoThemeRule.push(Object.assign({}, color.settings, {
                    token: scope.trim()
                }));
            });
        }
    });

    return returnTheme;
}