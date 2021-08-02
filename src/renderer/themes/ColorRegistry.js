
class RGBA {
  constructor (r, g, b, a) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }
}

class Color {
  constructor (value) {
    if (typeof value === 'string' && value.startsWith('#')) this.hex = value
    if (typeof value === 'function') this.hex = '#' + this.componentToHex(value.r) + this.componentToHex(value.g) + this.componentToHex(value.b) + this.componentToHex(value.a)
  }

  componentToHex (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  transparent (factor) {
    return this
  }

  /* eslint-disable */
  static white = new Color('#fff') // eslint-disable-line
  static black = new Color('#000') // eslint-disable-line
  /* eslint-enable */

  static fromHex (hex) {
    return new Color(hex)
  }

  toString() {
    return this.hex
  }
}

const nls = {
  localize: (id, text) => text
}

const localize = (id, text) => text

export const ColorTransformType = {
  Darken: 'Darken',
  Lighten: 'Ligthen',
  Transparent: 'Transparent',
  OneOf: 'OneOf',
  LessProminent: 'LessProminent',
  IfDefinedThenElse: 'IfDefinedThenElse'
}

class ColorRegistry {
  constructor () {
    this.defaultThemeDark = {}
    this.defaultThemeLight = {}
    this.defaultThemeContrast = {}
  }

  getColors (type) {
    if (type === 'contrast') return this.defaultThemeContrast
    if (type === 'dark') return this.defaultThemeDark
    return this.defaultThemeLight
  }

  registerColor (id, defaults, description, needsTransparency, deprecationMessage) {
    this.defaultThemeLight[id] = defaults.light
    this.defaultThemeDark[id] = defaults.dark
    this.defaultThemeContrast[id] = defaults.contrast
  }
}

const colorRegistry = new ColorRegistry()
export function registerColor (id, defaults, description, needsTransparency, deprecationMessage) {
  return colorRegistry.registerColor(id, defaults, description, needsTransparency, deprecationMessage)
}

// ----- color functions

export function darken (colorValue, factor) {
  return { op: ColorTransformType.Darken, value: colorValue, factor }
}

export function lighten (colorValue, factor) {
  return { op: ColorTransformType.Lighten, value: colorValue, factor }
}

export function transparent (colorValue, factor) {
  return { op: ColorTransformType.Transparent, value: colorValue, factor }
}

export function oneOf (...colorValues) {
  return { op: ColorTransformType.OneOf, values: colorValues }
}

export function ifDefinedThenElse (ifArg, thenArg, elseArg) {
  return { op: ColorTransformType.IfDefinedThenElse, if: ifArg, then: thenArg, else: elseArg }
}

function lessProminent (colorValue, backgroundColorValue, factor, transparency) {
  return { op: ColorTransformType.LessProminent, value: colorValue, background: backgroundColorValue, factor, transparency }
}

// ----- base colors

export const foreground = registerColor('foreground', { dark: '#CCCCCC', light: '#616161', hc: '#FFFFFF' }, nls.localize('foreground', 'Overall foreground color. This color is only used if not overridden by a component.'))
export const errorForeground = registerColor('errorForeground', { dark: '#F48771', light: '#A1260D', hc: '#F48771' }, nls.localize('errorForeground', 'Overall foreground color for error messages. This color is only used if not overridden by a component.'))
export const descriptionForeground = registerColor('descriptionForeground', { light: '#717171', dark: transparent(foreground, 0.7), hc: transparent(foreground, 0.7) }, nls.localize('descriptionForeground', 'Foreground color for description text providing additional information, for example for a label.'))
export const iconForeground = registerColor('icon.foreground', { dark: '#C5C5C5', light: '#424242', hc: '#FFFFFF' }, nls.localize('iconForeground', 'The default color for icons in the workbench.'))

export const focusBorder = registerColor('focusBorder', { dark: '#007FD4', light: '#0090F1', hc: '#F38518' }, nls.localize('focusBorder', 'Overall border color for focused elements. This color is only used if not overridden by a component.'))

export const contrastBorder = registerColor('contrastBorder', { light: null, dark: null, hc: '#6FC3DF' }, nls.localize('contrastBorder', 'An extra border around elements to separate them from others for greater contrast.'))
export const activeContrastBorder = registerColor('contrastActiveBorder', { light: null, dark: null, hc: focusBorder }, nls.localize('activeContrastBorder', 'An extra border around active elements to separate them from others for greater contrast.'))

export const selectionBackground = registerColor('selection.background', { light: null, dark: null, hc: null }, nls.localize('selectionBackground', 'The background color of text selections in the workbench (e.g. for input fields or text areas). Note that this does not apply to selections within the editor.'))

// ------ text colors

export const textSeparatorForeground = registerColor('textSeparator.foreground', { light: '#0000002e', dark: '#ffffff2e', hc: Color.black }, nls.localize('textSeparatorForeground', 'Color for text separators.'))
export const textLinkForeground = registerColor('textLink.foreground', { light: '#006AB1', dark: '#3794FF', hc: '#3794FF' }, nls.localize('textLinkForeground', 'Foreground color for links in text.'))
export const textLinkActiveForeground = registerColor('textLink.activeForeground', { light: '#006AB1', dark: '#3794FF', hc: '#3794FF' }, nls.localize('textLinkActiveForeground', 'Foreground color for links in text when clicked on and on mouse hover.'))
export const textPreformatForeground = registerColor('textPreformat.foreground', { light: '#A31515', dark: '#D7BA7D', hc: '#D7BA7D' }, nls.localize('textPreformatForeground', 'Foreground color for preformatted text segments.'))
export const textBlockQuoteBackground = registerColor('textBlockQuote.background', { light: '#7f7f7f1a', dark: '#7f7f7f1a', hc: null }, nls.localize('textBlockQuoteBackground', 'Background color for block quotes in text.'))
export const textBlockQuoteBorder = registerColor('textBlockQuote.border', { light: '#007acc80', dark: '#007acc80', hc: Color.white }, nls.localize('textBlockQuoteBorder', 'Border color for block quotes in text.'))
export const textCodeBlockBackground = registerColor('textCodeBlock.background', { light: '#dcdcdc66', dark: '#0a0a0a66', hc: Color.black }, nls.localize('textCodeBlockBackground', 'Background color for code blocks in text.'))

// ----- widgets
export const widgetShadow = registerColor('widget.shadow', { dark: transparent(Color.black, 0.36), light: transparent(Color.black, 0.16), hc: null }, nls.localize('widgetShadow', 'Shadow color of widgets such as find/replace inside the editor.'))

export const inputBackground = registerColor('input.background', { dark: '#3C3C3C', light: Color.white, hc: Color.black }, nls.localize('inputBoxBackground', 'Input box background.'))
export const inputForeground = registerColor('input.foreground', { dark: foreground, light: foreground, hc: foreground }, nls.localize('inputBoxForeground', 'Input box foreground.'))
export const inputBorder = registerColor('input.border', { dark: null, light: null, hc: contrastBorder }, nls.localize('inputBoxBorder', 'Input box border.'))
export const inputActiveOptionBorder = registerColor('inputOption.activeBorder', { dark: '#007ACC00', light: '#007ACC00', hc: contrastBorder }, nls.localize('inputBoxActiveOptionBorder', 'Border color of activated options in input fields.'))
export const inputActiveOptionBackground = registerColor('inputOption.activeBackground', { dark: transparent(focusBorder, 0.4), light: transparent(focusBorder, 0.2), hc: Color.transparent }, nls.localize('inputOption.activeBackground', 'Background color of activated options in input fields.'))
export const inputActiveOptionForeground = registerColor('inputOption.activeForeground', { dark: Color.white, light: Color.black, hc: null }, nls.localize('inputOption.activeForeground', 'Foreground color of activated options in input fields.'))
export const inputPlaceholderForeground = registerColor('input.placeholderForeground', { light: transparent(foreground, 0.5), dark: transparent(foreground, 0.5), hc: transparent(foreground, 0.7) }, nls.localize('inputPlaceholderForeground', 'Input box foreground color for placeholder text.'))

export const inputValidationInfoBackground = registerColor('inputValidation.infoBackground', { dark: '#063B49', light: '#D6ECF2', hc: Color.black }, nls.localize('inputValidationInfoBackground', 'Input validation background color for information severity.'))
export const inputValidationInfoForeground = registerColor('inputValidation.infoForeground', { dark: null, light: null, hc: null }, nls.localize('inputValidationInfoForeground', 'Input validation foreground color for information severity.'))
export const inputValidationInfoBorder = registerColor('inputValidation.infoBorder', { dark: '#007acc', light: '#007acc', hc: contrastBorder }, nls.localize('inputValidationInfoBorder', 'Input validation border color for information severity.'))
export const inputValidationWarningBackground = registerColor('inputValidation.warningBackground', { dark: '#352A05', light: '#F6F5D2', hc: Color.black }, nls.localize('inputValidationWarningBackground', 'Input validation background color for warning severity.'))
export const inputValidationWarningForeground = registerColor('inputValidation.warningForeground', { dark: null, light: null, hc: null }, nls.localize('inputValidationWarningForeground', 'Input validation foreground color for warning severity.'))
export const inputValidationWarningBorder = registerColor('inputValidation.warningBorder', { dark: '#B89500', light: '#B89500', hc: contrastBorder }, nls.localize('inputValidationWarningBorder', 'Input validation border color for warning severity.'))
export const inputValidationErrorBackground = registerColor('inputValidation.errorBackground', { dark: '#5A1D1D', light: '#F2DEDE', hc: Color.black }, nls.localize('inputValidationErrorBackground', 'Input validation background color for error severity.'))
export const inputValidationErrorForeground = registerColor('inputValidation.errorForeground', { dark: null, light: null, hc: null }, nls.localize('inputValidationErrorForeground', 'Input validation foreground color for error severity.'))
export const inputValidationErrorBorder = registerColor('inputValidation.errorBorder', { dark: '#BE1100', light: '#BE1100', hc: contrastBorder }, nls.localize('inputValidationErrorBorder', 'Input validation border color for error severity.'))

export const selectBackground = registerColor('dropdown.background', { dark: '#3C3C3C', light: Color.white, hc: Color.black }, nls.localize('dropdownBackground', 'Dropdown background.'))
export const selectListBackground = registerColor('dropdown.listBackground', { dark: null, light: null, hc: Color.black }, nls.localize('dropdownListBackground', 'Dropdown list background.'))
export const selectForeground = registerColor('dropdown.foreground', { dark: '#F0F0F0', light: null, hc: Color.white }, nls.localize('dropdownForeground', 'Dropdown foreground.'))
export const selectBorder = registerColor('dropdown.border', { dark: selectBackground, light: '#CECECE', hc: contrastBorder }, nls.localize('dropdownBorder', 'Dropdown border.'))

export const simpleCheckboxBackground = registerColor('checkbox.background', { dark: selectBackground, light: selectBackground, hc: selectBackground }, nls.localize('checkbox.background', 'Background color of checkbox widget.'))
export const simpleCheckboxForeground = registerColor('checkbox.foreground', { dark: selectForeground, light: selectForeground, hc: selectForeground }, nls.localize('checkbox.foreground', 'Foreground color of checkbox widget.'))
export const simpleCheckboxBorder = registerColor('checkbox.border', { dark: selectBorder, light: selectBorder, hc: selectBorder }, nls.localize('checkbox.border', 'Border color of checkbox widget.'))

export const buttonForeground = registerColor('button.foreground', { dark: Color.white, light: Color.white, hc: Color.white }, nls.localize('buttonForeground', 'Button foreground color.'))
export const buttonBackground = registerColor('button.background', { dark: '#0E639C', light: '#007ACC', hc: null }, nls.localize('buttonBackground', 'Button background color.'))
export const buttonHoverBackground = registerColor('button.hoverBackground', { dark: lighten(buttonBackground, 0.2), light: darken(buttonBackground, 0.2), hc: null }, nls.localize('buttonHoverBackground', 'Button background color when hovering.'))
export const buttonBorder = registerColor('button.border', { dark: contrastBorder, light: contrastBorder, hc: contrastBorder }, nls.localize('buttonBorder', 'Button border color.'))

export const buttonSecondaryForeground = registerColor('button.secondaryForeground', { dark: Color.white, light: Color.white, hc: Color.white }, nls.localize('buttonSecondaryForeground', 'Secondary button foreground color.'))
export const buttonSecondaryBackground = registerColor('button.secondaryBackground', { dark: '#3A3D41', light: '#5F6A79', hc: null }, nls.localize('buttonSecondaryBackground', 'Secondary button background color.'))
export const buttonSecondaryHoverBackground = registerColor('button.secondaryHoverBackground', { dark: lighten(buttonSecondaryBackground, 0.2), light: darken(buttonSecondaryBackground, 0.2), hc: null }, nls.localize('buttonSecondaryHoverBackground', 'Secondary button background color when hovering.'))

export const badgeBackground = registerColor('badge.background', { dark: '#4D4D4D', light: '#C4C4C4', hc: Color.black }, nls.localize('badgeBackground', 'Badge background color. Badges are small information labels, e.g. for search results count.'))
export const badgeForeground = registerColor('badge.foreground', { dark: Color.white, light: '#333', hc: Color.white }, nls.localize('badgeForeground', 'Badge foreground color. Badges are small information labels, e.g. for search results count.'))

export const scrollbarShadow = registerColor('scrollbar.shadow', { dark: '#000000', light: '#DDDDDD', hc: null }, nls.localize('scrollbarShadow', 'Scrollbar shadow to indicate that the view is scrolled.'))
export const scrollbarSliderBackground = registerColor('scrollbarSlider.background', { dark: Color.fromHex('#797979').transparent(0.4), light: Color.fromHex('#646464').transparent(0.4), hc: transparent(contrastBorder, 0.6) }, nls.localize('scrollbarSliderBackground', 'Scrollbar slider background color.'))
export const scrollbarSliderHoverBackground = registerColor('scrollbarSlider.hoverBackground', { dark: Color.fromHex('#646464').transparent(0.7), light: Color.fromHex('#646464').transparent(0.7), hc: transparent(contrastBorder, 0.8) }, nls.localize('scrollbarSliderHoverBackground', 'Scrollbar slider background color when hovering.'))
export const scrollbarSliderActiveBackground = registerColor('scrollbarSlider.activeBackground', { dark: Color.fromHex('#BFBFBF').transparent(0.4), light: Color.fromHex('#000000').transparent(0.6), hc: contrastBorder }, nls.localize('scrollbarSliderActiveBackground', 'Scrollbar slider background color when clicked on.'))

export const progressBarBackground = registerColor('progressBar.background', { dark: Color.fromHex('#0E70C0'), light: Color.fromHex('#0E70C0'), hc: contrastBorder }, nls.localize('progressBarBackground', 'Background color of the progress bar that can show for long running operations.'))

export const editorErrorBackground = registerColor('editorError.background', { dark: null, light: null, hc: null }, nls.localize('editorError.background', 'Background color of error text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorErrorForeground = registerColor('editorError.foreground', { dark: '#F48771', light: '#E51400', hc: null }, nls.localize('editorError.foreground', 'Foreground color of error squigglies in the editor.'))
export const editorErrorBorder = registerColor('editorError.border', { dark: null, light: null, hc: Color.fromHex('#E47777').transparent(0.8) }, nls.localize('errorBorder', 'Border color of error boxes in the editor.'))

export const editorWarningBackground = registerColor('editorWarning.background', { dark: null, light: null, hc: null }, nls.localize('editorWarning.background', 'Background color of warning text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorWarningForeground = registerColor('editorWarning.foreground', { dark: '#CCA700', light: '#BF8803', hc: null }, nls.localize('editorWarning.foreground', 'Foreground color of warning squigglies in the editor.'))
export const editorWarningBorder = registerColor('editorWarning.border', { dark: null, light: null, hc: Color.fromHex('#FFCC00').transparent(0.8) }, nls.localize('warningBorder', 'Border color of warning boxes in the editor.'))

export const editorInfoBackground = registerColor('editorInfo.background', { dark: null, light: null, hc: null }, nls.localize('editorInfo.background', 'Background color of info text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorInfoForeground = registerColor('editorInfo.foreground', { dark: '#75BEFF', light: '#75BEFF', hc: null }, nls.localize('editorInfo.foreground', 'Foreground color of info squigglies in the editor.'))
export const editorInfoBorder = registerColor('editorInfo.border', { dark: null, light: null, hc: Color.fromHex('#75BEFF').transparent(0.8) }, nls.localize('infoBorder', 'Border color of info boxes in the editor.'))

export const editorHintForeground = registerColor('editorHint.foreground', { dark: Color.fromHex('#eeeeee').transparent(0.7), light: '#6c6c6c', hc: null }, nls.localize('editorHint.foreground', 'Foreground color of hint squigglies in the editor.'))
export const editorHintBorder = registerColor('editorHint.border', { dark: null, light: null, hc: Color.fromHex('#eeeeee').transparent(0.8) }, nls.localize('hintBorder', 'Border color of hint boxes in the editor.'))

export const sashHoverBorder = registerColor('sash.hoverBorder', { dark: focusBorder, light: focusBorder, hc: focusBorder }, nls.localize('sashActiveBorder', 'Border color of active sashes.'))

/**
 * Editor background color.
 * Because of bug https://monacotools.visualstudio.com/DefaultCollection/Monaco/_workitems/edit/13254
 * we are *not* using the color white (or #ffffff, rgba(255,255,255)) but something very close to white.
 */
export const editorBackground = registerColor('editor.background', { light: '#fffffe', dark: '#1E1E1E', hc: Color.black }, nls.localize('editorBackground', 'Editor background color.'))

/**
 * Editor foreground color.
 */
export const editorForeground = registerColor('editor.foreground', { light: '#333333', dark: '#BBBBBB', hc: Color.white }, nls.localize('editorForeground', 'Editor default foreground color.'))

/**
 * Editor widgets
 */
export const editorWidgetBackground = registerColor('editorWidget.background', { dark: '#252526', light: '#F3F3F3', hc: '#0C141F' }, nls.localize('editorWidgetBackground', 'Background color of editor widgets, such as find/replace.'))
export const editorWidgetForeground = registerColor('editorWidget.foreground', { dark: foreground, light: foreground, hc: foreground }, nls.localize('editorWidgetForeground', 'Foreground color of editor widgets, such as find/replace.'))

export const editorWidgetBorder = registerColor('editorWidget.border', { dark: '#454545', light: '#C8C8C8', hc: contrastBorder }, nls.localize('editorWidgetBorder', 'Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.'))

export const editorWidgetResizeBorder = registerColor('editorWidget.resizeBorder', { light: null, dark: null, hc: null }, nls.localize('editorWidgetResizeBorder', 'Border color of the resize bar of editor widgets. The color is only used if the widget chooses to have a resize border and if the color is not overridden by a widget.'))

/**
 * Quick pick widget
 */
export const quickInputBackground = registerColor('quickInput.background', { dark: editorWidgetBackground, light: editorWidgetBackground, hc: editorWidgetBackground }, nls.localize('pickerBackground', 'Quick picker background color. The quick picker widget is the container for pickers like the command palette.'))
export const quickInputForeground = registerColor('quickInput.foreground', { dark: editorWidgetForeground, light: editorWidgetForeground, hc: editorWidgetForeground }, nls.localize('pickerForeground', 'Quick picker foreground color. The quick picker widget is the container for pickers like the command palette.'))
export const quickInputTitleBackground = registerColor('quickInputTitle.background', { dark: new Color(new RGBA(255, 255, 255, 0.105)), light: new Color(new RGBA(0, 0, 0, 0.06)), hc: '#000000' }, nls.localize('pickerTitleBackground', 'Quick picker title background color. The quick picker widget is the container for pickers like the command palette.'))
export const pickerGroupForeground = registerColor('pickerGroup.foreground', { dark: '#3794FF', light: '#0066BF', hc: Color.white }, nls.localize('pickerGroupForeground', 'Quick picker color for grouping labels.'))
export const pickerGroupBorder = registerColor('pickerGroup.border', { dark: '#3F3F46', light: '#CCCEDB', hc: Color.white }, nls.localize('pickerGroupBorder', 'Quick picker color for grouping borders.'))

/**
 * Keybinding label
 */
export const keybindingLabelBackground = registerColor('keybindingLabel.background', { dark: new Color(new RGBA(128, 128, 128, 0.17)), light: new Color(new RGBA(221, 221, 221, 0.4)), hc: Color.transparent }, nls.localize('keybindingLabelBackground', 'Keybinding label background color. The keybinding label is used to represent a keyboard shortcut.'))
export const keybindingLabelForeground = registerColor('keybindingLabel.foreground', { dark: Color.fromHex('#CCCCCC'), light: Color.fromHex('#555555'), hc: Color.white }, nls.localize('keybindingLabelForeground', 'Keybinding label foreground color. The keybinding label is used to represent a keyboard shortcut.'))
export const keybindingLabelBorder = registerColor('keybindingLabel.border', { dark: new Color(new RGBA(51, 51, 51, 0.6)), light: new Color(new RGBA(204, 204, 204, 0.4)), hc: new Color(new RGBA(111, 195, 223)) }, nls.localize('keybindingLabelBorder', 'Keybinding label border color. The keybinding label is used to represent a keyboard shortcut.'))
export const keybindingLabelBottomBorder = registerColor('keybindingLabel.bottomBorder', { dark: new Color(new RGBA(68, 68, 68, 0.6)), light: new Color(new RGBA(187, 187, 187, 0.4)), hc: new Color(new RGBA(111, 195, 223)) }, nls.localize('keybindingLabelBottomBorder', 'Keybinding label border bottom color. The keybinding label is used to represent a keyboard shortcut.'))

/**
 * Editor selection colors.
 */
export const editorSelectionBackground = registerColor('editor.selectionBackground', { light: '#ADD6FF', dark: '#264F78', hc: '#f3f518' }, nls.localize('editorSelectionBackground', 'Color of the editor selection.'))
export const editorSelectionForeground = registerColor('editor.selectionForeground', { light: null, dark: null, hc: '#000000' }, nls.localize('editorSelectionForeground', 'Color of the selected text for high contrast.'))
export const editorInactiveSelection = registerColor('editor.inactiveSelectionBackground', { light: transparent(editorSelectionBackground, 0.5), dark: transparent(editorSelectionBackground, 0.5), hc: transparent(editorSelectionBackground, 0.5) }, nls.localize('editorInactiveSelection', 'Color of the selection in an inactive editor. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorSelectionHighlight = registerColor('editor.selectionHighlightBackground', { light: lessProminent(editorSelectionBackground, editorBackground, 0.3, 0.6), dark: lessProminent(editorSelectionBackground, editorBackground, 0.3, 0.6), hc: null }, nls.localize('editorSelectionHighlight', 'Color for regions with the same content as the selection. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorSelectionHighlightBorder = registerColor('editor.selectionHighlightBorder', { light: null, dark: null, hc: activeContrastBorder }, nls.localize('editorSelectionHighlightBorder', 'Border color for regions with the same content as the selection.'))

/**
 * Editor find match colors.
 */
export const editorFindMatch = registerColor('editor.findMatchBackground', { light: '#A8AC94', dark: '#515C6A', hc: null }, nls.localize('editorFindMatch', 'Color of the current search match.'))
export const editorFindMatchHighlight = registerColor('editor.findMatchHighlightBackground', { light: '#EA5C0055', dark: '#EA5C0055', hc: null }, nls.localize('findMatchHighlight', 'Color of the other search matches. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorFindRangeHighlight = registerColor('editor.findRangeHighlightBackground', { dark: '#3a3d4166', light: '#b4b4b44d', hc: null }, nls.localize('findRangeHighlight', 'Color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorFindMatchBorder = registerColor('editor.findMatchBorder', { light: null, dark: null, hc: activeContrastBorder }, nls.localize('editorFindMatchBorder', 'Border color of the current search match.'))
export const editorFindMatchHighlightBorder = registerColor('editor.findMatchHighlightBorder', { light: null, dark: null, hc: activeContrastBorder }, nls.localize('findMatchHighlightBorder', 'Border color of the other search matches.'))
export const editorFindRangeHighlightBorder = registerColor('editor.findRangeHighlightBorder', { dark: null, light: null, hc: transparent(activeContrastBorder, 0.4) }, nls.localize('findRangeHighlightBorder', 'Border color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations.'), true)

/**
 * Search Editor query match colors.
 *
 * Distinct from normal editor find match to allow for better differentiation
 */
export const searchEditorFindMatch = registerColor('searchEditor.findMatchBackground', { light: transparent(editorFindMatchHighlight, 0.66), dark: transparent(editorFindMatchHighlight, 0.66), hc: editorFindMatchHighlight }, nls.localize('searchEditor.queryMatch', 'Color of the Search Editor query matches.'))
export const searchEditorFindMatchBorder = registerColor('searchEditor.findMatchBorder', { light: transparent(editorFindMatchHighlightBorder, 0.66), dark: transparent(editorFindMatchHighlightBorder, 0.66), hc: editorFindMatchHighlightBorder }, nls.localize('searchEditor.editorFindMatchBorder', 'Border color of the Search Editor query matches.'))

/**
 * Editor hover
 */
export const editorHoverHighlight = registerColor('editor.hoverHighlightBackground', { light: '#ADD6FF26', dark: '#264f7840', hc: '#ADD6FF26' }, nls.localize('hoverHighlight', 'Highlight below the word for which a hover is shown. The color must not be opaque so as not to hide underlying decorations.'), true)
export const editorHoverBackground = registerColor('editorHoverWidget.background', { light: editorWidgetBackground, dark: editorWidgetBackground, hc: editorWidgetBackground }, nls.localize('hoverBackground', 'Background color of the editor hover.'))
export const editorHoverForeground = registerColor('editorHoverWidget.foreground', { light: editorWidgetForeground, dark: editorWidgetForeground, hc: editorWidgetForeground }, nls.localize('hoverForeground', 'Foreground color of the editor hover.'))
export const editorHoverBorder = registerColor('editorHoverWidget.border', { light: editorWidgetBorder, dark: editorWidgetBorder, hc: editorWidgetBorder }, nls.localize('hoverBorder', 'Border color of the editor hover.'))
export const editorHoverStatusBarBackground = registerColor('editorHoverWidget.statusBarBackground', { dark: lighten(editorHoverBackground, 0.2), light: darken(editorHoverBackground, 0.05), hc: editorWidgetBackground }, nls.localize('statusBarBackground', 'Background color of the editor hover status bar.'))
/**
 * Editor link colors
 */
export const editorActiveLinkForeground = registerColor('editorLink.activeForeground', { dark: '#4E94CE', light: Color.blue, hc: Color.cyan }, nls.localize('activeLinkForeground', 'Color of active links.'))

/**
 * Inline hints
 */
export const editorInlayHintForeground = registerColor('editorInlayHint.foreground', { dark: transparent(badgeForeground, 0.8), light: transparent(badgeForeground, 0.8), hc: badgeForeground }, nls.localize('editorInlayHintForeground', 'Foreground color of inline hints'))
export const editorInlayHintBackground = registerColor('editorInlayHint.background', { dark: transparent(badgeBackground, 0.6), light: transparent(badgeBackground, 0.3), hc: badgeBackground }, nls.localize('editorInlayHintBackground', 'Background color of inline hints'))

/**
 * Editor lighbulb icon colors
 */
export const editorLightBulbForeground = registerColor('editorLightBulb.foreground', { dark: '#FFCC00', light: '#DDB100', hc: '#FFCC00' }, nls.localize('editorLightBulbForeground', 'The color used for the lightbulb actions icon.'))
export const editorLightBulbAutoFixForeground = registerColor('editorLightBulbAutoFix.foreground', { dark: '#75BEFF', light: '#007ACC', hc: '#75BEFF' }, nls.localize('editorLightBulbAutoFixForeground', 'The color used for the lightbulb auto fix actions icon.'))

/**
 * Diff Editor Colors
 */
export const defaultInsertColor = new Color(new RGBA(155, 185, 85, 0.2))
export const defaultRemoveColor = new Color(new RGBA(255, 0, 0, 0.2))

export const diffInserted = registerColor('diffEditor.insertedTextBackground', { dark: defaultInsertColor, light: defaultInsertColor, hc: null }, nls.localize('diffEditorInserted', 'Background color for text that got inserted. The color must not be opaque so as not to hide underlying decorations.'), true)
export const diffRemoved = registerColor('diffEditor.removedTextBackground', { dark: defaultRemoveColor, light: defaultRemoveColor, hc: null }, nls.localize('diffEditorRemoved', 'Background color for text that got removed. The color must not be opaque so as not to hide underlying decorations.'), true)

export const diffInsertedOutline = registerColor('diffEditor.insertedTextBorder', { dark: null, light: null, hc: '#33ff2eff' }, nls.localize('diffEditorInsertedOutline', 'Outline color for the text that got inserted.'))
export const diffRemovedOutline = registerColor('diffEditor.removedTextBorder', { dark: null, light: null, hc: '#FF008F' }, nls.localize('diffEditorRemovedOutline', 'Outline color for text that got removed.'))

export const diffBorder = registerColor('diffEditor.border', { dark: null, light: null, hc: contrastBorder }, nls.localize('diffEditorBorder', 'Border color between the two text editors.'))
export const diffDiagonalFill = registerColor('diffEditor.diagonalFill', { dark: '#cccccc33', light: '#22222233', hc: null }, nls.localize('diffDiagonalFill', "Color of the diff editor's diagonal fill. The diagonal fill is used in side-by-side diff views."))

/**
 * List and tree colors
 */
export const listFocusBackground = registerColor('list.focusBackground', { dark: null, light: null, hc: null }, nls.localize('listFocusBackground', 'List/Tree background color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.'))
export const listFocusForeground = registerColor('list.focusForeground', { dark: null, light: null, hc: null }, nls.localize('listFocusForeground', 'List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.'))
export const listFocusOutline = registerColor('list.focusOutline', { dark: focusBorder, light: focusBorder, hc: activeContrastBorder }, nls.localize('listFocusOutline', 'List/Tree outline color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.'))
export const listActiveSelectionBackground = registerColor('list.activeSelectionBackground', { dark: '#094771', light: '#0060C0', hc: null }, nls.localize('listActiveSelectionBackground', 'List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.'))
export const listActiveSelectionForeground = registerColor('list.activeSelectionForeground', { dark: Color.white, light: Color.white, hc: null }, nls.localize('listActiveSelectionForeground', 'List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.'))
export const listActiveSelectionIconForeground = registerColor('list.activeSelectionIconForeground', { dark: null, light: null, hc: null }, nls.localize('listActiveSelectionIconForeground', 'List/Tree icon foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.'))
export const listInactiveSelectionBackground = registerColor('list.inactiveSelectionBackground', { dark: '#37373D', light: '#E4E6F1', hc: null }, nls.localize('listInactiveSelectionBackground', 'List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.'))
export const listInactiveSelectionForeground = registerColor('list.inactiveSelectionForeground', { dark: null, light: null, hc: null }, nls.localize('listInactiveSelectionForeground', 'List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.'))
export const listInactiveSelectionIconForeground = registerColor('list.inactiveSelectionIconForeground', { dark: null, light: null, hc: null }, nls.localize('listInactiveSelectionIconForeground', 'List/Tree icon foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.'))
export const listInactiveFocusBackground = registerColor('list.inactiveFocusBackground', { dark: null, light: null, hc: null }, nls.localize('listInactiveFocusBackground', 'List/Tree background color for the focused item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.'))
export const listInactiveFocusOutline = registerColor('list.inactiveFocusOutline', { dark: null, light: null, hc: null }, nls.localize('listInactiveFocusOutline', 'List/Tree outline color for the focused item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.'))
export const listHoverBackground = registerColor('list.hoverBackground', { dark: '#2A2D2E', light: '#F0F0F0', hc: null }, nls.localize('listHoverBackground', 'List/Tree background when hovering over items using the mouse.'))
export const listHoverForeground = registerColor('list.hoverForeground', { dark: null, light: null, hc: null }, nls.localize('listHoverForeground', 'List/Tree foreground when hovering over items using the mouse.'))
export const listDropBackground = registerColor('list.dropBackground', { dark: '#062F4A', light: '#D6EBFF', hc: null }, nls.localize('listDropBackground', 'List/Tree drag and drop background when moving items around using the mouse.'))
export const listHighlightForeground = registerColor('list.highlightForeground', { dark: '#18A3FF', light: '#0066BF', hc: focusBorder }, nls.localize('highlight', 'List/Tree foreground color of the match highlights when searching inside the list/tree.'))
export const listFocusHighlightForeground = registerColor('list.focusHighlightForeground', { dark: listHighlightForeground, light: ifDefinedThenElse(listActiveSelectionBackground, listHighlightForeground, '#9DDDFF'), hc: listHighlightForeground }, nls.localize('listFocusHighlightForeground', 'List/Tree foreground color of the match highlights on actively focused items when searching inside the list/tree.'))
export const listInvalidItemForeground = registerColor('list.invalidItemForeground', { dark: '#B89500', light: '#B89500', hc: '#B89500' }, nls.localize('invalidItemForeground', 'List/Tree foreground color for invalid items, for example an unresolved root in explorer.'))
export const listErrorForeground = registerColor('list.errorForeground', { dark: '#F88070', light: '#B01011', hc: null }, nls.localize('listErrorForeground', 'Foreground color of list items containing errors.'))
export const listWarningForeground = registerColor('list.warningForeground', { dark: '#CCA700', light: '#855F00', hc: null }, nls.localize('listWarningForeground', 'Foreground color of list items containing warnings.'))
export const listFilterWidgetBackground = registerColor('listFilterWidget.background', { light: '#efc1ad', dark: '#653723', hc: Color.black }, nls.localize('listFilterWidgetBackground', 'Background color of the type filter widget in lists and trees.'))
export const listFilterWidgetOutline = registerColor('listFilterWidget.outline', { dark: Color.transparent, light: Color.transparent, hc: '#f38518' }, nls.localize('listFilterWidgetOutline', 'Outline color of the type filter widget in lists and trees.'))
export const listFilterWidgetNoMatchesOutline = registerColor('listFilterWidget.noMatchesOutline', { dark: '#BE1100', light: '#BE1100', hc: contrastBorder }, nls.localize('listFilterWidgetNoMatchesOutline', 'Outline color of the type filter widget in lists and trees, when there are no matches.'))
export const listFilterMatchHighlight = registerColor('list.filterMatchBackground', { dark: editorFindMatchHighlight, light: editorFindMatchHighlight, hc: null }, nls.localize('listFilterMatchHighlight', 'Background color of the filtered match.'))
export const listFilterMatchHighlightBorder = registerColor('list.filterMatchBorder', { dark: editorFindMatchHighlightBorder, light: editorFindMatchHighlightBorder, hc: contrastBorder }, nls.localize('listFilterMatchHighlightBorder', 'Border color of the filtered match.'))
export const treeIndentGuidesStroke = registerColor('tree.indentGuidesStroke', { dark: '#585858', light: '#a9a9a9', hc: '#a9a9a9' }, nls.localize('treeIndentGuidesStroke', 'Tree stroke color for the indentation guides.'))
export const tableColumnsBorder = registerColor('tree.tableColumnsBorder', { dark: '#CCCCCC20', light: '#61616120', hc: null }, nls.localize('treeIndentGuidesStroke', 'Tree stroke color for the indentation guides.'))
export const listDeemphasizedForeground = registerColor('list.deemphasizedForeground', { dark: '#8C8C8C', light: '#8E8E90', hc: '#A7A8A9' }, nls.localize('listDeemphasizedForeground', 'List/Tree foreground color for items that are deemphasized. '))

/**
 * Quick pick widget (dependent on List and tree colors)
 */
export const _deprecatedQuickInputListFocusBackground = registerColor('quickInput.list.focusBackground', { dark: null, light: null, hc: null }, '', undefined, nls.localize('quickInput.list.focusBackground deprecation', 'Please use quickInputList.focusBackground instead'))
export const quickInputListFocusForeground = registerColor('quickInputList.focusForeground', { dark: listActiveSelectionForeground, light: listActiveSelectionForeground, hc: listActiveSelectionForeground }, nls.localize('quickInput.listFocusForeground', 'Quick picker foreground color for the focused item.'))
export const quickInputListFocusIconForeground = registerColor('quickInputList.focusIconForeground', { dark: listActiveSelectionIconForeground, light: listActiveSelectionIconForeground, hc: listActiveSelectionIconForeground }, nls.localize('quickInput.listFocusIconForeground', 'Quick picker icon foreground color for the focused item.'))
export const quickInputListFocusBackground = registerColor('quickInputList.focusBackground', { dark: oneOf(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground), light: oneOf(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground), hc: null }, nls.localize('quickInput.listFocusBackground', 'Quick picker background color for the focused item.'))

/**
 * Menu colors
 */
export const menuBorder = registerColor('menu.border', { dark: null, light: null, hc: contrastBorder }, nls.localize('menuBorder', 'Border color of menus.'))
export const menuForeground = registerColor('menu.foreground', { dark: selectForeground, light: foreground, hc: selectForeground }, nls.localize('menuForeground', 'Foreground color of menu items.'))
export const menuBackground = registerColor('menu.background', { dark: selectBackground, light: selectBackground, hc: selectBackground }, nls.localize('menuBackground', 'Background color of menu items.'))
export const menuSelectionForeground = registerColor('menu.selectionForeground', { dark: listActiveSelectionForeground, light: listActiveSelectionForeground, hc: listActiveSelectionForeground }, nls.localize('menuSelectionForeground', 'Foreground color of the selected menu item in menus.'))
export const menuSelectionBackground = registerColor('menu.selectionBackground', { dark: listActiveSelectionBackground, light: listActiveSelectionBackground, hc: listActiveSelectionBackground }, nls.localize('menuSelectionBackground', 'Background color of the selected menu item in menus.'))
export const menuSelectionBorder = registerColor('menu.selectionBorder', { dark: null, light: null, hc: activeContrastBorder }, nls.localize('menuSelectionBorder', 'Border color of the selected menu item in menus.'))
export const menuSeparatorBackground = registerColor('menu.separatorBackground', { dark: '#BBBBBB', light: '#888888', hc: contrastBorder }, nls.localize('menuSeparatorBackground', 'Color of a separator menu item in menus.'))

/**
 * Toolbar colors
 */
export const toolbarHoverBackground = registerColor('toolbar.hoverBackground', { dark: '#5a5d5e50', light: '#b8b8b850', hc: null }, nls.localize('toolbarHoverBackground', 'Toolbar background when hovering over actions using the mouse'))
export const toolbarHoverOutline = registerColor('toolbar.hoverOutline', { dark: null, light: null, hc: activeContrastBorder }, nls.localize('toolbarHoverOutline', 'Toolbar outline when hovering over actions using the mouse'))
export const toolbarActiveBackground = registerColor('toolbar.activeBackground', { dark: lighten(toolbarHoverBackground, 0.1), light: darken(toolbarHoverBackground, 0.1), hc: null }, nls.localize('toolbarActiveBackground', 'Toolbar background when holding the mouse over actions'))

/**
 * Snippet placeholder colors
 */
export const snippetTabstopHighlightBackground = registerColor('editor.snippetTabstopHighlightBackground', { dark: new Color(new RGBA(124, 124, 124, 0.3)), light: new Color(new RGBA(10, 50, 100, 0.2)), hc: new Color(new RGBA(124, 124, 124, 0.3)) }, nls.localize('snippetTabstopHighlightBackground', 'Highlight background color of a snippet tabstop.'))
export const snippetTabstopHighlightBorder = registerColor('editor.snippetTabstopHighlightBorder', { dark: null, light: null, hc: null }, nls.localize('snippetTabstopHighlightBorder', 'Highlight border color of a snippet tabstop.'))
export const snippetFinalTabstopHighlightBackground = registerColor('editor.snippetFinalTabstopHighlightBackground', { dark: null, light: null, hc: null }, nls.localize('snippetFinalTabstopHighlightBackground', 'Highlight background color of the final tabstop of a snippet.'))
export const snippetFinalTabstopHighlightBorder = registerColor('editor.snippetFinalTabstopHighlightBorder', { dark: '#525252', light: new Color(new RGBA(10, 50, 100, 0.5)), hc: '#525252' }, nls.localize('snippetFinalTabstopHighlightBorder', 'Highlight border color of the final tabstop of a snippet.'))

/**
 * Breadcrumb colors
 */
export const breadcrumbsForeground = registerColor('breadcrumb.foreground', { light: transparent(foreground, 0.8), dark: transparent(foreground, 0.8), hc: transparent(foreground, 0.8) }, nls.localize('breadcrumbsFocusForeground', 'Color of focused breadcrumb items.'))
export const breadcrumbsBackground = registerColor('breadcrumb.background', { light: editorBackground, dark: editorBackground, hc: editorBackground }, nls.localize('breadcrumbsBackground', 'Background color of breadcrumb items.'))
export const breadcrumbsFocusForeground = registerColor('breadcrumb.focusForeground', { light: darken(foreground, 0.2), dark: lighten(foreground, 0.1), hc: lighten(foreground, 0.1) }, nls.localize('breadcrumbsFocusForeground', 'Color of focused breadcrumb items.'))
export const breadcrumbsActiveSelectionForeground = registerColor('breadcrumb.activeSelectionForeground', { light: darken(foreground, 0.2), dark: lighten(foreground, 0.1), hc: lighten(foreground, 0.1) }, nls.localize('breadcrumbsSelectedForegound', 'Color of selected breadcrumb items.'))
export const breadcrumbsPickerBackground = registerColor('breadcrumbPicker.background', { light: editorWidgetBackground, dark: editorWidgetBackground, hc: editorWidgetBackground }, nls.localize('breadcrumbsSelectedBackground', 'Background color of breadcrumb item picker.'))

/**
 * Merge-conflict colors
 */

const headerTransparency = 0.5
const currentBaseColor = Color.fromHex('#40C8AE').transparent(headerTransparency)
const incomingBaseColor = Color.fromHex('#40A6FF').transparent(headerTransparency)
const commonBaseColor = Color.fromHex('#606060').transparent(0.4)
const contentTransparency = 0.4
const rulerTransparency = 1

export const mergeCurrentHeaderBackground = registerColor('merge.currentHeaderBackground', { dark: currentBaseColor, light: currentBaseColor, hc: null }, nls.localize('mergeCurrentHeaderBackground', 'Current header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true)
export const mergeCurrentContentBackground = registerColor('merge.currentContentBackground', { dark: transparent(mergeCurrentHeaderBackground, contentTransparency), light: transparent(mergeCurrentHeaderBackground, contentTransparency), hc: transparent(mergeCurrentHeaderBackground, contentTransparency) }, nls.localize('mergeCurrentContentBackground', 'Current content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true)
export const mergeIncomingHeaderBackground = registerColor('merge.incomingHeaderBackground', { dark: incomingBaseColor, light: incomingBaseColor, hc: null }, nls.localize('mergeIncomingHeaderBackground', 'Incoming header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true)
export const mergeIncomingContentBackground = registerColor('merge.incomingContentBackground', { dark: transparent(mergeIncomingHeaderBackground, contentTransparency), light: transparent(mergeIncomingHeaderBackground, contentTransparency), hc: transparent(mergeIncomingHeaderBackground, contentTransparency) }, nls.localize('mergeIncomingContentBackground', 'Incoming content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true)
export const mergeCommonHeaderBackground = registerColor('merge.commonHeaderBackground', { dark: commonBaseColor, light: commonBaseColor, hc: null }, nls.localize('mergeCommonHeaderBackground', 'Common ancestor header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true)
export const mergeCommonContentBackground = registerColor('merge.commonContentBackground', { dark: transparent(mergeCommonHeaderBackground, contentTransparency), light: transparent(mergeCommonHeaderBackground, contentTransparency), hc: transparent(mergeCommonHeaderBackground, contentTransparency) }, nls.localize('mergeCommonContentBackground', 'Common ancestor content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true)

export const mergeBorder = registerColor('merge.border', { dark: null, light: null, hc: '#C3DF6F' }, nls.localize('mergeBorder', 'Border color on headers and the splitter in inline merge-conflicts.'))

export const overviewRulerCurrentContentForeground = registerColor('editorOverviewRuler.currentContentForeground', { dark: transparent(mergeCurrentHeaderBackground, rulerTransparency), light: transparent(mergeCurrentHeaderBackground, rulerTransparency), hc: mergeBorder }, nls.localize('overviewRulerCurrentContentForeground', 'Current overview ruler foreground for inline merge-conflicts.'))
export const overviewRulerIncomingContentForeground = registerColor('editorOverviewRuler.incomingContentForeground', { dark: transparent(mergeIncomingHeaderBackground, rulerTransparency), light: transparent(mergeIncomingHeaderBackground, rulerTransparency), hc: mergeBorder }, nls.localize('overviewRulerIncomingContentForeground', 'Incoming overview ruler foreground for inline merge-conflicts.'))
export const overviewRulerCommonContentForeground = registerColor('editorOverviewRuler.commonContentForeground', { dark: transparent(mergeCommonHeaderBackground, rulerTransparency), light: transparent(mergeCommonHeaderBackground, rulerTransparency), hc: mergeBorder }, nls.localize('overviewRulerCommonContentForeground', 'Common ancestor overview ruler foreground for inline merge-conflicts.'))

export const overviewRulerFindMatchForeground = registerColor('editorOverviewRuler.findMatchForeground', { dark: '#d186167e', light: '#d186167e', hc: '#AB5A00' }, nls.localize('overviewRulerFindMatchForeground', 'Overview ruler marker color for find matches. The color must not be opaque so as not to hide underlying decorations.'), true)

export const overviewRulerSelectionHighlightForeground = registerColor('editorOverviewRuler.selectionHighlightForeground', { dark: '#A0A0A0CC', light: '#A0A0A0CC', hc: '#A0A0A0CC' }, nls.localize('overviewRulerSelectionHighlightForeground', 'Overview ruler marker color for selection highlights. The color must not be opaque so as not to hide underlying decorations.'), true)

export const minimapFindMatch = registerColor('minimap.findMatchHighlight', { light: '#d18616', dark: '#d18616', hc: '#AB5A00' }, nls.localize('minimapFindMatchHighlight', 'Minimap marker color for find matches.'), true)
export const minimapSelection = registerColor('minimap.selectionHighlight', { light: '#ADD6FF', dark: '#264F78', hc: '#ffffff' }, nls.localize('minimapSelectionHighlight', 'Minimap marker color for the editor selection.'), true)
export const minimapError = registerColor('minimap.errorHighlight', { dark: new Color(new RGBA(255, 18, 18, 0.7)), light: new Color(new RGBA(255, 18, 18, 0.7)), hc: new Color(new RGBA(255, 50, 50, 1)) }, nls.localize('minimapError', 'Minimap marker color for errors.'))
export const minimapWarning = registerColor('minimap.warningHighlight', { dark: editorWarningForeground, light: editorWarningForeground, hc: editorWarningBorder }, nls.localize('overviewRuleWarning', 'Minimap marker color for warnings.'))
export const minimapBackground = registerColor('minimap.background', { dark: null, light: null, hc: null }, nls.localize('minimapBackground', 'Minimap background color.'))

export const minimapSliderBackground = registerColor('minimapSlider.background', { light: transparent(scrollbarSliderBackground, 0.5), dark: transparent(scrollbarSliderBackground, 0.5), hc: transparent(scrollbarSliderBackground, 0.5) }, nls.localize('minimapSliderBackground', 'Minimap slider background color.'))
export const minimapSliderHoverBackground = registerColor('minimapSlider.hoverBackground', { light: transparent(scrollbarSliderHoverBackground, 0.5), dark: transparent(scrollbarSliderHoverBackground, 0.5), hc: transparent(scrollbarSliderHoverBackground, 0.5) }, nls.localize('minimapSliderHoverBackground', 'Minimap slider background color when hovering.'))
export const minimapSliderActiveBackground = registerColor('minimapSlider.activeBackground', { light: transparent(scrollbarSliderActiveBackground, 0.5), dark: transparent(scrollbarSliderActiveBackground, 0.5), hc: transparent(scrollbarSliderActiveBackground, 0.5) }, nls.localize('minimapSliderActiveBackground', 'Minimap slider background color when clicked on.'))

export const problemsErrorIconForeground = registerColor('problemsErrorIcon.foreground', { dark: editorErrorForeground, light: editorErrorForeground, hc: editorErrorForeground }, nls.localize('problemsErrorIconForeground', 'The color used for the problems error icon.'))
export const problemsWarningIconForeground = registerColor('problemsWarningIcon.foreground', { dark: editorWarningForeground, light: editorWarningForeground, hc: editorWarningForeground }, nls.localize('problemsWarningIconForeground', 'The color used for the problems warning icon.'))
export const problemsInfoIconForeground = registerColor('problemsInfoIcon.foreground', { dark: editorInfoForeground, light: editorInfoForeground, hc: editorInfoForeground }, nls.localize('problemsInfoIconForeground', 'The color used for the problems info icon.'))

/**
 * Chart colors
 */
export const chartsForeground = registerColor('charts.foreground', { dark: foreground, light: foreground, hc: foreground }, nls.localize('chartsForeground', 'The foreground color used in charts.'))
export const chartsLines = registerColor('charts.lines', { dark: transparent(foreground, 0.5), light: transparent(foreground, 0.5), hc: transparent(foreground, 0.5) }, nls.localize('chartsLines', 'The color used for horizontal lines in charts.'))
export const chartsRed = registerColor('charts.red', { dark: editorErrorForeground, light: editorErrorForeground, hc: editorErrorForeground }, nls.localize('chartsRed', 'The red color used in chart visualizations.'))
export const chartsBlue = registerColor('charts.blue', { dark: editorInfoForeground, light: editorInfoForeground, hc: editorInfoForeground }, nls.localize('chartsBlue', 'The blue color used in chart visualizations.'))
export const chartsYellow = registerColor('charts.yellow', { dark: editorWarningForeground, light: editorWarningForeground, hc: editorWarningForeground }, nls.localize('chartsYellow', 'The yellow color used in chart visualizations.'))
export const chartsOrange = registerColor('charts.orange', { dark: minimapFindMatch, light: minimapFindMatch, hc: minimapFindMatch }, nls.localize('chartsOrange', 'The orange color used in chart visualizations.'))
export const chartsGreen = registerColor('charts.green', { dark: '#89D185', light: '#388A34', hc: '#89D185' }, nls.localize('chartsGreen', 'The green color used in chart visualizations.'))
export const chartsPurple = registerColor('charts.purple', { dark: '#B180D7', light: '#652D90', hc: '#B180D7' }, nls.localize('chartsPurple', 'The purple color used in chart visualizations.'))

// < --- Tabs --- >

// #region Tab Background

export const TAB_ACTIVE_BACKGROUND = registerColor('tab.activeBackground', {
  dark: editorBackground,
  light: editorBackground,
  hc: editorBackground
}, localize('tabActiveBackground', 'Active tab background color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_ACTIVE_BACKGROUND = registerColor('tab.unfocusedActiveBackground', {
  dark: TAB_ACTIVE_BACKGROUND,
  light: TAB_ACTIVE_BACKGROUND,
  hc: TAB_ACTIVE_BACKGROUND
}, localize('tabUnfocusedActiveBackground', 'Active tab background color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_INACTIVE_BACKGROUND = registerColor('tab.inactiveBackground', {
  dark: '#2D2D2D',
  light: '#ECECEC',
  hc: null
}, localize('tabInactiveBackground', 'Inactive tab background color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_INACTIVE_BACKGROUND = registerColor('tab.unfocusedInactiveBackground', {
  dark: TAB_INACTIVE_BACKGROUND,
  light: TAB_INACTIVE_BACKGROUND,
  hc: TAB_INACTIVE_BACKGROUND
}, localize('tabUnfocusedInactiveBackground', 'Inactive tab background color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

// #endregion

// #region Tab Foreground

export const TAB_ACTIVE_FOREGROUND = registerColor('tab.activeForeground', {
  dark: Color.white,
  light: '#333333',
  hc: Color.white
}, localize('tabActiveForeground', 'Active tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_INACTIVE_FOREGROUND = registerColor('tab.inactiveForeground', {
  dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
  light: transparent(TAB_ACTIVE_FOREGROUND, 0.7),
  hc: Color.white
}, localize('tabInactiveForeground', 'Inactive tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_ACTIVE_FOREGROUND = registerColor('tab.unfocusedActiveForeground', {
  dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
  light: transparent(TAB_ACTIVE_FOREGROUND, 0.7),
  hc: Color.white
}, localize('tabUnfocusedActiveForeground', 'Active tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_INACTIVE_FOREGROUND = registerColor('tab.unfocusedInactiveForeground', {
  dark: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
  light: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
  hc: Color.white
}, localize('tabUnfocusedInactiveForeground', 'Inactive tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

// #endregion

// #region Tab Hover Foreground/Background

export const TAB_HOVER_BACKGROUND = registerColor('tab.hoverBackground', {
  dark: null,
  light: null,
  hc: null
}, localize('tabHoverBackground', 'Tab background color when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_HOVER_BACKGROUND = registerColor('tab.unfocusedHoverBackground', {
  dark: transparent(TAB_HOVER_BACKGROUND, 0.5),
  light: transparent(TAB_HOVER_BACKGROUND, 0.7),
  hc: null
}, localize('tabUnfocusedHoverBackground', 'Tab background color in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_HOVER_FOREGROUND = registerColor('tab.hoverForeground', {
  dark: null,
  light: null,
  hc: null
}, localize('tabHoverForeground', 'Tab foreground color when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_HOVER_FOREGROUND = registerColor('tab.unfocusedHoverForeground', {
  dark: transparent(TAB_HOVER_FOREGROUND, 0.5),
  light: transparent(TAB_HOVER_FOREGROUND, 0.5),
  hc: null
}, localize('tabUnfocusedHoverForeground', 'Tab foreground color in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

// #endregion

// #region Tab Borders

export const TAB_BORDER = registerColor('tab.border', {
  dark: '#252526',
  light: '#F3F3F3',
  hc: contrastBorder
}, localize('tabBorder', 'Border to separate tabs from each other. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_LAST_PINNED_BORDER = registerColor('tab.lastPinnedBorder', {
  dark: treeIndentGuidesStroke,
  light: treeIndentGuidesStroke,
  hc: contrastBorder
}, localize('lastPinnedTabBorder', 'Border to separate pinned tabs from other tabs. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_ACTIVE_BORDER = registerColor('tab.activeBorder', {
  dark: null,
  light: null,
  hc: null
}, localize('tabActiveBorder', 'Border on the bottom of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_ACTIVE_BORDER = registerColor('tab.unfocusedActiveBorder', {
  dark: transparent(TAB_ACTIVE_BORDER, 0.5),
  light: transparent(TAB_ACTIVE_BORDER, 0.7),
  hc: null
}, localize('tabActiveUnfocusedBorder', 'Border on the bottom of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_ACTIVE_BORDER_TOP = registerColor('tab.activeBorderTop', {
  dark: null,
  light: null,
  hc: null
}, localize('tabActiveBorderTop', 'Border to the top of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_ACTIVE_BORDER_TOP = registerColor('tab.unfocusedActiveBorderTop', {
  dark: transparent(TAB_ACTIVE_BORDER_TOP, 0.5),
  light: transparent(TAB_ACTIVE_BORDER_TOP, 0.7),
  hc: null
}, localize('tabActiveUnfocusedBorderTop', 'Border to the top of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_HOVER_BORDER = registerColor('tab.hoverBorder', {
  dark: null,
  light: null,
  hc: null
}, localize('tabHoverBorder', 'Border to highlight tabs when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_HOVER_BORDER = registerColor('tab.unfocusedHoverBorder', {
  dark: transparent(TAB_HOVER_BORDER, 0.5),
  light: transparent(TAB_HOVER_BORDER, 0.7),
  hc: null
}, localize('tabUnfocusedHoverBorder', 'Border to highlight tabs in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

// #endregion

// #region Tab Modified Border

export const TAB_ACTIVE_MODIFIED_BORDER = registerColor('tab.activeModifiedBorder', {
  dark: '#3399CC',
  light: '#33AAEE',
  hc: null
}, localize('tabActiveModifiedBorder', 'Border on the top of modified (dirty) active tabs in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_INACTIVE_MODIFIED_BORDER = registerColor('tab.inactiveModifiedBorder', {
  dark: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
  light: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
  hc: Color.white
}, localize('tabInactiveModifiedBorder', 'Border on the top of modified (dirty) inactive tabs in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_ACTIVE_MODIFIED_BORDER = registerColor('tab.unfocusedActiveModifiedBorder', {
  dark: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
  light: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.7),
  hc: Color.white
}, localize('unfocusedActiveModifiedBorder', 'Border on the top of modified (dirty) active tabs in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

export const TAB_UNFOCUSED_INACTIVE_MODIFIED_BORDER = registerColor('tab.unfocusedInactiveModifiedBorder', {
  dark: transparent(TAB_INACTIVE_MODIFIED_BORDER, 0.5),
  light: transparent(TAB_INACTIVE_MODIFIED_BORDER, 0.5),
  hc: Color.white
}, localize('unfocusedINactiveModifiedBorder', 'Border on the top of modified (dirty) inactive tabs in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'))

// #endregion

// < --- Editors --- >

export const EDITOR_PANE_BACKGROUND = registerColor('editorPane.background', {
  dark: editorBackground,
  light: editorBackground,
  hc: editorBackground
}, localize('editorPaneBackground', 'Background color of the editor pane visible on the left and right side of the centered editor layout.'))

registerColor('editorGroup.background', {
  dark: null,
  light: null,
  hc: null
}, localize('editorGroupBackground', 'Deprecated background color of an editor group.'), false, localize('deprecatedEditorGroupBackground', 'Deprecated: Background color of an editor group is no longer being supported with the introduction of the grid editor layout. You can use editorGroup.emptyBackground to set the background color of empty editor groups.'))

export const EDITOR_GROUP_EMPTY_BACKGROUND = registerColor('editorGroup.emptyBackground', {
  dark: null,
  light: null,
  hc: null
}, localize('editorGroupEmptyBackground', 'Background color of an empty editor group. Editor groups are the containers of editors.'))

export const EDITOR_GROUP_FOCUSED_EMPTY_BORDER = registerColor('editorGroup.focusedEmptyBorder', {
  dark: null,
  light: null,
  hc: focusBorder
}, localize('editorGroupFocusedEmptyBorder', 'Border color of an empty editor group that is focused. Editor groups are the containers of editors.'))

export const EDITOR_GROUP_HEADER_TABS_BACKGROUND = registerColor('editorGroupHeader.tabsBackground', {
  dark: '#252526',
  light: '#F3F3F3',
  hc: null
}, localize('tabsContainerBackground', 'Background color of the editor group title header when tabs are enabled. Editor groups are the containers of editors.'))

export const EDITOR_GROUP_HEADER_TABS_BORDER = registerColor('editorGroupHeader.tabsBorder', {
  dark: null,
  light: null,
  hc: null
}, localize('tabsContainerBorder', 'Border color of the editor group title header when tabs are enabled. Editor groups are the containers of editors.'))

export const EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND = registerColor('editorGroupHeader.noTabsBackground', {
  dark: editorBackground,
  light: editorBackground,
  hc: editorBackground
}, localize('editorGroupHeaderBackground', 'Background color of the editor group title header when tabs are disabled (`"workbench.editor.showTabs": false`). Editor groups are the containers of editors.'))

export const EDITOR_GROUP_HEADER_BORDER = registerColor('editorGroupHeader.border', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('editorTitleContainerBorder', 'Border color of the editor group title header. Editor groups are the containers of editors.'))

export const EDITOR_GROUP_BORDER = registerColor('editorGroup.border', {
  dark: '#444444',
  light: '#E7E7E7',
  hc: contrastBorder
}, localize('editorGroupBorder', 'Color to separate multiple editor groups from each other. Editor groups are the containers of editors.'))

export const EDITOR_DRAG_AND_DROP_BACKGROUND = registerColor('editorGroup.dropBackground', {
  dark: Color.fromHex('#53595D').transparent(0.5),
  light: Color.fromHex('#2677CB').transparent(0.18),
  hc: null
}, localize('editorDragAndDropBackground', 'Background color when dragging editors around. The color should have transparency so that the editor contents can still shine through.'))

// < --- Panels --- >

export const PANEL_BACKGROUND = registerColor('panel.background', {
  dark: editorBackground,
  light: editorBackground,
  hc: editorBackground
}, localize('panelBackground', 'Panel background color. Panels are shown below the editor area and contain views like output and integrated terminal.'))

export const PANEL_BORDER = registerColor('panel.border', {
  dark: Color.fromHex('#808080').transparent(0.35),
  light: Color.fromHex('#808080').transparent(0.35),
  hc: contrastBorder
}, localize('panelBorder', 'Panel border color to separate the panel from the editor. Panels are shown below the editor area and contain views like output and integrated terminal.'))

export const PANEL_ACTIVE_TITLE_FOREGROUND = registerColor('panelTitle.activeForeground', {
  dark: '#E7E7E7',
  light: '#424242',
  hc: Color.white
}, localize('panelActiveTitleForeground', 'Title color for the active panel. Panels are shown below the editor area and contain views like output and integrated terminal.'))

export const PANEL_INACTIVE_TITLE_FOREGROUND = registerColor('panelTitle.inactiveForeground', {
  dark: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.6),
  light: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.75),
  hc: Color.white
}, localize('panelInactiveTitleForeground', 'Title color for the inactive panel. Panels are shown below the editor area and contain views like output and integrated terminal.'))

export const PANEL_ACTIVE_TITLE_BORDER = registerColor('panelTitle.activeBorder', {
  dark: PANEL_ACTIVE_TITLE_FOREGROUND,
  light: PANEL_ACTIVE_TITLE_FOREGROUND,
  hc: contrastBorder
}, localize('panelActiveTitleBorder', 'Border color for the active panel title. Panels are shown below the editor area and contain views like output and integrated terminal.'))

export const PANEL_INPUT_BORDER = registerColor('panelInput.border', {
  dark: null,
  light: Color.fromHex('#ddd'),
  hc: null
}, localize('panelInputBorder', 'Input box border for inputs in the panel.'))

export const PANEL_DRAG_AND_DROP_BORDER = registerColor('panel.dropBorder', {
  dark: PANEL_ACTIVE_TITLE_FOREGROUND,
  light: PANEL_ACTIVE_TITLE_FOREGROUND,
  hc: PANEL_ACTIVE_TITLE_FOREGROUND
}, localize('panelDragAndDropBorder', 'Drag and drop feedback color for the panel titles. Panels are shown below the editor area and contain views like output and integrated terminal.'))

export const PANEL_SECTION_DRAG_AND_DROP_BACKGROUND = registerColor('panelSection.dropBackground', {
  dark: EDITOR_DRAG_AND_DROP_BACKGROUND,
  light: EDITOR_DRAG_AND_DROP_BACKGROUND,
  hc: EDITOR_DRAG_AND_DROP_BACKGROUND
}, localize('panelSectionDragAndDropBackground', 'Drag and drop feedback color for the panel sections. The color should have transparency so that the panel sections can still shine through. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels.'))

export const PANEL_SECTION_HEADER_BACKGROUND = registerColor('panelSectionHeader.background', {
  dark: Color.fromHex('#808080').transparent(0.2),
  light: Color.fromHex('#808080').transparent(0.2),
  hc: null
}, localize('panelSectionHeaderBackground', 'Panel section header background color. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels.'))

export const PANEL_SECTION_HEADER_FOREGROUND = registerColor('panelSectionHeader.foreground', {
  dark: null,
  light: null,
  hc: null
}, localize('panelSectionHeaderForeground', 'Panel section header foreground color. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels.'))

export const PANEL_SECTION_HEADER_BORDER = registerColor('panelSectionHeader.border', {
  dark: contrastBorder,
  light: contrastBorder,
  hc: contrastBorder
}, localize('panelSectionHeaderBorder', 'Panel section header border color used when multiple views are stacked vertically in the panel. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels.'))

export const PANEL_SECTION_BORDER = registerColor('panelSection.border', {
  dark: PANEL_BORDER,
  light: PANEL_BORDER,
  hc: PANEL_BORDER
}, localize('panelSectionBorder', 'Panel section border color used when multiple views are stacked horizontally in the panel. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels.'))

// < --- Banner --- >

export const BANNER_BACKGROUND = registerColor('banner.background', {
  dark: listActiveSelectionBackground,
  light: listActiveSelectionBackground,
  hc: listActiveSelectionBackground
}, localize('banner.background', 'Banner background color. The banner is shown under the title bar of the window.'))

export const BANNER_FOREGROUND = registerColor('banner.foreground', {
  dark: listActiveSelectionForeground,
  light: listActiveSelectionForeground,
  hc: listActiveSelectionForeground
}, localize('banner.foreground', 'Banner foreground color. The banner is shown under the title bar of the window.'))

export const BANNER_ICON_FOREGROUND = registerColor('banner.iconForeground', {
  dark: editorInfoForeground,
  light: editorInfoForeground,
  hc: editorInfoForeground
}, localize('banner.iconForeground', 'Banner icon color. The banner is shown under the title bar of the window.'))

// < --- Status --- >

export const STATUS_BAR_FOREGROUND = registerColor('statusBar.foreground', {
  dark: '#FFFFFF',
  light: '#FFFFFF',
  hc: '#FFFFFF'
}, localize('statusBarForeground', 'Status bar foreground color when a workspace or folder is opened. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_NO_FOLDER_FOREGROUND = registerColor('statusBar.noFolderForeground', {
  dark: STATUS_BAR_FOREGROUND,
  light: STATUS_BAR_FOREGROUND,
  hc: STATUS_BAR_FOREGROUND
}, localize('statusBarNoFolderForeground', 'Status bar foreground color when no folder is opened. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_BACKGROUND = registerColor('statusBar.background', {
  dark: '#007ACC',
  light: '#007ACC',
  hc: null
}, localize('statusBarBackground', 'Status bar background color when a workspace or folder is opened. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_NO_FOLDER_BACKGROUND = registerColor('statusBar.noFolderBackground', {
  dark: '#68217A',
  light: '#68217A',
  hc: null
}, localize('statusBarNoFolderBackground', 'Status bar background color when no folder is opened. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_BORDER = registerColor('statusBar.border', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('statusBarBorder', 'Status bar border color separating to the sidebar and editor. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_NO_FOLDER_BORDER = registerColor('statusBar.noFolderBorder', {
  dark: STATUS_BAR_BORDER,
  light: STATUS_BAR_BORDER,
  hc: STATUS_BAR_BORDER
}, localize('statusBarNoFolderBorder', 'Status bar border color separating to the sidebar and editor when no folder is opened. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_ITEM_ACTIVE_BACKGROUND = registerColor('statusBarItem.activeBackground', {
  dark: Color.white.transparent(0.18),
  light: Color.white.transparent(0.18),
  hc: Color.white.transparent(0.18)
}, localize('statusBarItemActiveBackground', 'Status bar item background color when clicking. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.hoverBackground', {
  dark: Color.white.transparent(0.12),
  light: Color.white.transparent(0.12),
  hc: Color.white.transparent(0.12)
}, localize('statusBarItemHoverBackground', 'Status bar item background color when hovering. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_PROMINENT_ITEM_FOREGROUND = registerColor('statusBarItem.prominentForeground', {
  dark: STATUS_BAR_FOREGROUND,
  light: STATUS_BAR_FOREGROUND,
  hc: STATUS_BAR_FOREGROUND
}, localize('statusBarProminentItemForeground', 'Status bar prominent items foreground color. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_PROMINENT_ITEM_BACKGROUND = registerColor('statusBarItem.prominentBackground', {
  dark: Color.black.transparent(0.5),
  light: Color.black.transparent(0.5),
  hc: Color.black.transparent(0.5)
}, localize('statusBarProminentItemBackground', 'Status bar prominent items background color. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_PROMINENT_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.prominentHoverBackground', {
  dark: Color.black.transparent(0.3),
  light: Color.black.transparent(0.3),
  hc: Color.black.transparent(0.3)
}, localize('statusBarProminentItemHoverBackground', 'Status bar prominent items background color when hovering. Prominent items stand out from other status bar entries to indicate importance. Change mode `Toggle Tab Key Moves Focus` from command palette to see an example. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_ERROR_ITEM_BACKGROUND = registerColor('statusBarItem.errorBackground', {
  dark: darken(errorForeground, 0.4),
  light: darken(errorForeground, 0.4),
  hc: null
}, localize('statusBarErrorItemBackground', 'Status bar error items background color. Error items stand out from other status bar entries to indicate error conditions. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_ERROR_ITEM_FOREGROUND = registerColor('statusBarItem.errorForeground', {
  dark: Color.white,
  light: Color.white,
  hc: Color.white
}, localize('statusBarErrorItemForeground', 'Status bar error items foreground color. Error items stand out from other status bar entries to indicate error conditions. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_WARNING_ITEM_BACKGROUND = registerColor('statusBarItem.warningBackground', {
  dark: darken(editorWarningForeground, 0.4),
  light: darken(editorWarningForeground, 0.4),
  hc: null
}, localize('statusBarWarningItemBackground', 'Status bar warning items background color. Warning items stand out from other status bar entries to indicate warning conditions. The status bar is shown in the bottom of the window.'))

export const STATUS_BAR_WARNING_ITEM_FOREGROUND = registerColor('statusBarItem.warningForeground', {
  dark: Color.white,
  light: Color.white,
  hc: Color.white
}, localize('statusBarWarningItemForeground', 'Status bar warning items foreground color. Warning items stand out from other status bar entries to indicate warning conditions. The status bar is shown in the bottom of the window.'))

// < --- Activity Bar --- >

export const ACTIVITY_BAR_BACKGROUND = registerColor('activityBar.background', {
  dark: '#333333',
  light: '#2C2C2C',
  hc: '#000000'
}, localize('activityBarBackground', 'Activity bar background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_FOREGROUND = registerColor('activityBar.foreground', {
  dark: Color.white,
  light: Color.white,
  hc: Color.white
}, localize('activityBarForeground', 'Activity bar item foreground color when it is active. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_INACTIVE_FOREGROUND = registerColor('activityBar.inactiveForeground', {
  dark: transparent(ACTIVITY_BAR_FOREGROUND, 0.4),
  light: transparent(ACTIVITY_BAR_FOREGROUND, 0.4),
  hc: Color.white
}, localize('activityBarInActiveForeground', 'Activity bar item foreground color when it is inactive. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_BORDER = registerColor('activityBar.border', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('activityBarBorder', 'Activity bar border color separating to the side bar. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_ACTIVE_BORDER = registerColor('activityBar.activeBorder', {
  dark: ACTIVITY_BAR_FOREGROUND,
  light: ACTIVITY_BAR_FOREGROUND,
  hc: null
}, localize('activityBarActiveBorder', 'Activity bar border color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_ACTIVE_FOCUS_BORDER = registerColor('activityBar.activeFocusBorder', {
  dark: null,
  light: null,
  hc: null
}, localize('activityBarActiveFocusBorder', 'Activity bar focus border color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_ACTIVE_BACKGROUND = registerColor('activityBar.activeBackground', {
  dark: null,
  light: null,
  hc: null
}, localize('activityBarActiveBackground', 'Activity bar background color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_DRAG_AND_DROP_BORDER = registerColor('activityBar.dropBorder', {
  dark: ACTIVITY_BAR_FOREGROUND,
  light: ACTIVITY_BAR_FOREGROUND,
  hc: ACTIVITY_BAR_FOREGROUND
}, localize('activityBarDragAndDropBorder', 'Drag and drop feedback color for the activity bar items. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_BADGE_BACKGROUND = registerColor('activityBarBadge.background', {
  dark: '#007ACC',
  light: '#007ACC',
  hc: '#000000'
}, localize('activityBarBadgeBackground', 'Activity notification badge background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

export const ACTIVITY_BAR_BADGE_FOREGROUND = registerColor('activityBarBadge.foreground', {
  dark: Color.white,
  light: Color.white,
  hc: Color.white
}, localize('activityBarBadgeForeground', 'Activity notification badge foreground color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'))

// < --- Remote --- >

export const STATUS_BAR_HOST_NAME_BACKGROUND = registerColor('statusBarItem.remoteBackground', {
  dark: ACTIVITY_BAR_BADGE_BACKGROUND,
  light: ACTIVITY_BAR_BADGE_BACKGROUND,
  hc: ACTIVITY_BAR_BADGE_BACKGROUND
}, localize('statusBarItemHostBackground', 'Background color for the remote indicator on the status bar.'))

export const STATUS_BAR_HOST_NAME_FOREGROUND = registerColor('statusBarItem.remoteForeground', {
  dark: ACTIVITY_BAR_BADGE_FOREGROUND,
  light: ACTIVITY_BAR_BADGE_FOREGROUND,
  hc: ACTIVITY_BAR_BADGE_FOREGROUND
}, localize('statusBarItemHostForeground', 'Foreground color for the remote indicator on the status bar.'))

export const EXTENSION_BADGE_REMOTE_BACKGROUND = registerColor('extensionBadge.remoteBackground', {
  dark: ACTIVITY_BAR_BADGE_BACKGROUND,
  light: ACTIVITY_BAR_BADGE_BACKGROUND,
  hc: ACTIVITY_BAR_BADGE_BACKGROUND
}, localize('extensionBadge.remoteBackground', 'Background color for the remote badge in the extensions view.'))

export const EXTENSION_BADGE_REMOTE_FOREGROUND = registerColor('extensionBadge.remoteForeground', {
  dark: ACTIVITY_BAR_BADGE_FOREGROUND,
  light: ACTIVITY_BAR_BADGE_FOREGROUND,
  hc: ACTIVITY_BAR_BADGE_FOREGROUND
}, localize('extensionBadge.remoteForeground', 'Foreground color for the remote badge in the extensions view.'))

// < --- Side Bar --- >

export const SIDE_BAR_BACKGROUND = registerColor('sideBar.background', {
  dark: '#252526',
  light: '#F3F3F3',
  hc: '#000000'
}, localize('sideBarBackground', 'Side bar background color. The side bar is the container for views like explorer and search.'))

export const SIDE_BAR_FOREGROUND = registerColor('sideBar.foreground', {
  dark: null,
  light: null,
  hc: null
}, localize('sideBarForeground', 'Side bar foreground color. The side bar is the container for views like explorer and search.'))

export const SIDE_BAR_BORDER = registerColor('sideBar.border', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('sideBarBorder', 'Side bar border color on the side separating to the editor. The side bar is the container for views like explorer and search.'))

export const SIDE_BAR_TITLE_FOREGROUND = registerColor('sideBarTitle.foreground', {
  dark: SIDE_BAR_FOREGROUND,
  light: SIDE_BAR_FOREGROUND,
  hc: SIDE_BAR_FOREGROUND
}, localize('sideBarTitleForeground', 'Side bar title foreground color. The side bar is the container for views like explorer and search.'))

export const SIDE_BAR_DRAG_AND_DROP_BACKGROUND = registerColor('sideBar.dropBackground', {
  dark: EDITOR_DRAG_AND_DROP_BACKGROUND,
  light: EDITOR_DRAG_AND_DROP_BACKGROUND,
  hc: EDITOR_DRAG_AND_DROP_BACKGROUND
}, localize('sideBarDragAndDropBackground', 'Drag and drop feedback color for the side bar sections. The color should have transparency so that the side bar sections can still shine through. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar.'))

export const SIDE_BAR_SECTION_HEADER_BACKGROUND = registerColor('sideBarSectionHeader.background', {
  dark: Color.fromHex('#808080').transparent(0.2),
  light: Color.fromHex('#808080').transparent(0.2),
  hc: null
}, localize('sideBarSectionHeaderBackground', 'Side bar section header background color. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar.'))

export const SIDE_BAR_SECTION_HEADER_FOREGROUND = registerColor('sideBarSectionHeader.foreground', {
  dark: SIDE_BAR_FOREGROUND,
  light: SIDE_BAR_FOREGROUND,
  hc: SIDE_BAR_FOREGROUND
}, localize('sideBarSectionHeaderForeground', 'Side bar section header foreground color. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar.'))

export const SIDE_BAR_SECTION_HEADER_BORDER = registerColor('sideBarSectionHeader.border', {
  dark: contrastBorder,
  light: contrastBorder,
  hc: contrastBorder
}, localize('sideBarSectionHeaderBorder', 'Side bar section header border color. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar.'))

// < --- Title Bar --- >

export const TITLE_BAR_ACTIVE_FOREGROUND = registerColor('titleBar.activeForeground', {
  dark: '#CCCCCC',
  light: '#333333',
  hc: '#FFFFFF'
}, localize('titleBarActiveForeground', 'Title bar foreground when the window is active.'))

export const TITLE_BAR_INACTIVE_FOREGROUND = registerColor('titleBar.inactiveForeground', {
  dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
  light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
  hc: null
}, localize('titleBarInactiveForeground', 'Title bar foreground when the window is inactive.'))

export const TITLE_BAR_ACTIVE_BACKGROUND = registerColor('titleBar.activeBackground', {
  dark: '#3C3C3C',
  light: '#DDDDDD',
  hc: '#000000'
}, localize('titleBarActiveBackground', 'Title bar background when the window is active.'))

export const TITLE_BAR_INACTIVE_BACKGROUND = registerColor('titleBar.inactiveBackground', {
  dark: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
  light: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
  hc: null
}, localize('titleBarInactiveBackground', 'Title bar background when the window is inactive.'))

export const TITLE_BAR_BORDER = registerColor('titleBar.border', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('titleBarBorder', 'Title bar border color.'))

// < --- Menubar --- >

export const MENUBAR_SELECTION_FOREGROUND = registerColor('menubar.selectionForeground', {
  dark: TITLE_BAR_ACTIVE_FOREGROUND,
  light: TITLE_BAR_ACTIVE_FOREGROUND,
  hc: TITLE_BAR_ACTIVE_FOREGROUND
}, localize('menubarSelectionForeground', 'Foreground color of the selected menu item in the menubar.'))

export const MENUBAR_SELECTION_BACKGROUND = registerColor('menubar.selectionBackground', {
  dark: transparent(Color.white, 0.1),
  light: transparent(Color.black, 0.1),
  hc: null
}, localize('menubarSelectionBackground', 'Background color of the selected menu item in the menubar.'))

export const MENUBAR_SELECTION_BORDER = registerColor('menubar.selectionBorder', {
  dark: null,
  light: null,
  hc: activeContrastBorder
}, localize('menubarSelectionBorder', 'Border color of the selected menu item in the menubar.'))

// < --- Notifications --- >

export const NOTIFICATIONS_CENTER_BORDER = registerColor('notificationCenter.border', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('notificationCenterBorder', 'Notifications center border color. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_TOAST_BORDER = registerColor('notificationToast.border', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('notificationToastBorder', 'Notification toast border color. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_FOREGROUND = registerColor('notifications.foreground', {
  dark: editorWidgetForeground,
  light: editorWidgetForeground,
  hc: editorWidgetForeground
}, localize('notificationsForeground', 'Notifications foreground color. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_BACKGROUND = registerColor('notifications.background', {
  dark: editorWidgetBackground,
  light: editorWidgetBackground,
  hc: editorWidgetBackground
}, localize('notificationsBackground', 'Notifications background color. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_LINKS = registerColor('notificationLink.foreground', {
  dark: textLinkForeground,
  light: textLinkForeground,
  hc: textLinkForeground
}, localize('notificationsLink', 'Notification links foreground color. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_CENTER_HEADER_FOREGROUND = registerColor('notificationCenterHeader.foreground', {
  dark: null,
  light: null,
  hc: null
}, localize('notificationCenterHeaderForeground', 'Notifications center header foreground color. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_CENTER_HEADER_BACKGROUND = registerColor('notificationCenterHeader.background', {
  dark: lighten(NOTIFICATIONS_BACKGROUND, 0.3),
  light: darken(NOTIFICATIONS_BACKGROUND, 0.05),
  hc: NOTIFICATIONS_BACKGROUND
}, localize('notificationCenterHeaderBackground', 'Notifications center header background color. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_BORDER = registerColor('notifications.border', {
  dark: NOTIFICATIONS_CENTER_HEADER_BACKGROUND,
  light: NOTIFICATIONS_CENTER_HEADER_BACKGROUND,
  hc: NOTIFICATIONS_CENTER_HEADER_BACKGROUND
}, localize('notificationsBorder', 'Notifications border color separating from other notifications in the notifications center. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_ERROR_ICON_FOREGROUND = registerColor('notificationsErrorIcon.foreground', {
  dark: editorErrorForeground,
  light: editorErrorForeground,
  hc: editorErrorForeground
}, localize('notificationsErrorIconForeground', 'The color used for the icon of error notifications. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_WARNING_ICON_FOREGROUND = registerColor('notificationsWarningIcon.foreground', {
  dark: editorWarningForeground,
  light: editorWarningForeground,
  hc: editorWarningForeground
}, localize('notificationsWarningIconForeground', 'The color used for the icon of warning notifications. Notifications slide in from the bottom right of the window.'))

export const NOTIFICATIONS_INFO_ICON_FOREGROUND = registerColor('notificationsInfoIcon.foreground', {
  dark: editorInfoForeground,
  light: editorInfoForeground,
  hc: editorInfoForeground
}, localize('notificationsInfoIconForeground', 'The color used for the icon of info notifications. Notifications slide in from the bottom right of the window.'))

export const WINDOW_ACTIVE_BORDER = registerColor('window.activeBorder', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('windowActiveBorder', 'The color used for the border of the window when it is active. Only supported in the desktop client when using the custom title bar.'))

export const WINDOW_INACTIVE_BORDER = registerColor('window.inactiveBorder', {
  dark: null,
  light: null,
  hc: contrastBorder
}, localize('windowInactiveBorder', 'The color used for the border of the window when it is inactive. Only supported in the desktop client when using the custom title bar.'))

export {
  Color, nls, colorRegistry
}
