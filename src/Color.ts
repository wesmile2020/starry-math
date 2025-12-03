import { colors, type ColorName } from './ColorName'

export type ColorString = ColorName | 'transparent' | ({} & string);

/**
 * Color Class for color manipulation and conversion
 * @public
 */
class Color {
  /**
   * Red component (0-1)
   */
  r: number = 0;
  /**
   * Green component (0-1)
   */
  g: number = 0;
  /**
   * Blue component (0-1)
   */
  b: number = 0;
  /**
   * Alpha/opacity component (0-1)
   */
  a: number = 1;

  /**
   * Initializes a Color instance with optional color value
   * @param color - Optional color value
   *                - String format: Supports CSS color formats (e.g., `rgba(255,0,0,0.5)`, `#FF0000`, `transparent`)
   *                - Number format: Supports hexadecimal color value (e.g., `0xFF0000` for red)
   *                - No parameter: Defaults to opaque black (r=0, g=0, b=0, a=1)
   */
  constructor(color?: ColorString | number) {
    if (typeof color === 'string') {
      this.setStyle(color);
    }
    if (typeof color === 'number') {
      this.setHex(color);
    }
  }

  /**
   * Sets the RGBA values of the color
   * @param r - Red component (range: 0-1)
   * @param g - Green component (range: 0-1)
   * @param b - Blue component (range: 0-1)
   * @param a - Alpha/opacity component (range: 0-1)
   * @returns Current Color instance for chaining
   */
  set(r: number, g: number, b: number, a: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  /**
   * Sets color from a hexadecimal number
   * @param hex - Hexadecimal color value (e.g., 0xFF0000 for red)
   * @returns Current Color instance for chaining
   */
  setHex(hex: number): this {
    this.r = (hex >> 16 & 255) / 255;
    this.g = (hex >> 8 & 255) / 255;
    this.b = (hex >> 0 & 255) / 255;
    return this;
  }

  /**
   * Gets the color as a hexadecimal number
   * @returns Hexadecimal representation of the color
   */
  getHex(): number {
    return (this.r * 255 << 16) + (this.g * 255 << 8) + (this.b * 255 << 0);
  }

  /**
   * Gets the color as a hexadecimal string without the hash prefix
   * @returns Hexadecimal string representation of the color (e.g., "FF0000" for red)
   */
  getHexString(): string {
    const r = (this.r * 255 + 0x100).toString(16).slice(1);
    const g = (this.g * 255 + 0x100).toString(16).slice(1);
    const b = (this.b * 255 + 0x100).toString(16).slice(1);

    return `${r.toUpperCase()}${g.toUpperCase()}${b.toUpperCase()}`;
  }

  /**
   * Sets color from a CSS color string
   * @param color - CSS color string in formats like 'red' 'yellow' and so on,
   * 'rgb()', 'rgba()', '#RRGGBB', '#RGB', or 'transparent'
   * @returns Current Color instance for chaining
   */
  setStyle(color: ColorString): this {
    const colorValue = colors[color as ColorName];
    if (colorValue) {
      this.r = colorValue[0] / 255;
      this.g = colorValue[1] / 255;
      this.b = colorValue[2] / 255;
      this.a = 1;
    } else if (color === 'transparent') {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
    } else if (color[0] === '#') {
      let value = color.slice(1);
      if (value.length === 3) {
        value = value[0].repeat(2) + value[1].repeat(2) + value[2].repeat(2);
      }
      if (value.length === 6) {
        const hex = parseInt(value, 16);
        this.setHex(hex);
      }
    } else {
      const rgbaMatch = /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+\.?\d*?)\s*)?\)\s*$/.exec(color);
      if (rgbaMatch) {
        this.r = Number(rgbaMatch[1]) / 255 || 0;
        this.g = Number(rgbaMatch[2]) / 255 || 0;
        this.b = Number(rgbaMatch[3]) / 255 || 0;
        this.a = rgbaMatch[4] ? Number(rgbaMatch[4]) : 1;
      }
    }

    return this;
  }

  /**
   * Gets the color as an RGBA CSS string
   * @returns CSS rgba() string representation of the color
   */
  getStyle(): string {
    return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})`;
  }

  /**
   * Converts the color to an array of RGBA values
   * @returns Array containing [r, g, b, a] components
   */
  toArray(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }

  /**
   * Checks if this color equals another color
   * @param color - Color instance to compare with
   * @returns True if colors are identical, false otherwise
   */
  equal(color: Color): boolean {
    return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
  }

  /**
   * Copies RGBA values from another color
   * @param source - Color instance to copy values from
   * @returns Current Color instance for chaining
   */
  copy(source: Color): this {
    return this.set(source.r, source.g, source.b, source.a);
  }

  /**
   * Creates a new Color instance with the same RGBA values
   * @returns New Color instance with identical values
   */
  clone(): Color {
    const color = new Color();
    color.set(this.r, this.g, this.b, this.a);
    return color;
  }
}

export { Color };
