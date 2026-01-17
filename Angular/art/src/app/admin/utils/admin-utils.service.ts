import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminUtilsService {

  // Regex patterns for HTML sanitization
  private static readonly REGEX_PATTERNS = {
    // Remove background-color: rgb(255, 255, 255) (white)
    REMOVE_WHITE_BACKGROUND: /background-color:\s*rgb\(255,\s*255,\s*255\);?\s*/gi,
    // Remove color: rgb(0, 0, 0) (black)
    REMOVE_BLACK_COLOR: /color:\s*rgb\(0,\s*0,\s*0\);?\s*/gi,
    // Remove color: rgb(33, 43, 49) (dark-gray - default color)
    REMOVE_DARK_GRAY_COLOR: /color:\s*rgb\(33,\s*43,\s*49\);?\s*/gi,
    // Remove empty style attributes or with only spaces/semicolons
    REMOVE_EMPTY_STYLE: /\s*style="\s*;?\s*"/gi,
    // Remove span without attributes: <span>text</span> -> text
    REMOVE_EMPTY_SPAN: /<span>(.*?)<\/span>/gi,
    // Remove formatting tags without attributes: keep tag but remove empty attributes
    REMOVE_EMPTY_FORMAT_TAGS: /<(strong|em|u|i|b)\s+>([^<]*)<\/\1>/gi
  };

  /**
   * Sanitizes HTML content by removing redundant inline styles from Quill editor output
   * @param html The HTML string to sanitize
   * @returns The sanitized HTML string
   */
  static sanitizeHtml(html: string): string {
    if (!html) return html;

    html = html.replace(this.REGEX_PATTERNS.REMOVE_WHITE_BACKGROUND, '');
    html = html.replace(this.REGEX_PATTERNS.REMOVE_BLACK_COLOR, '');
    html = html.replace(this.REGEX_PATTERNS.REMOVE_DARK_GRAY_COLOR, '');
    html = html.replace(this.REGEX_PATTERNS.REMOVE_EMPTY_STYLE, '');
    html = html.replace(this.REGEX_PATTERNS.REMOVE_EMPTY_SPAN, '$1');
    html = html.replace(this.REGEX_PATTERNS.REMOVE_EMPTY_FORMAT_TAGS, '<$1>$2</$1>');

    return html;
  }
}
