type World = string

export interface Greetings {
  hello: World
  ahoy?: string
}

/**
 * A round plane figure whose boundary consists of points equidistant from a fixed point.
 */
export interface Circle extends Shape {
  kind: 'circle'
  /**
   * @default 10
   */
  radius?: number
}

export type Point = {
  /**
   * @description In pixels.
   */
  readonly x: number
  /**
   * @description In pixels.
   */
  readonly y: number
}

export interface DataProps {
  [key: `data-${string}`]: string
}

interface Shape {
  kind: string
}
