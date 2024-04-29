import {
  Application,
  Assets,
  BlurFilter,
  Color,
  Container,
  FillGradient,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'pixi.js'

export class SlotMachine {
  constructor() {
    this.app = new Application()
    this.reelWidth = 160
    this.symbolSize = 140
    this.running = false
    this.tweening = []
    this.reels = []
    this.slotTextures = []
  }

  async init() {
    await this.app.init({ background: '#1099bb', resizeTo: window })
    document.body.appendChild(this.app.canvas)
    await Assets.load([
      './images/M00_000.jpg',
      './images/M01_000.jpg',
      './images/M03_000.jpg',
      './images/M04_000.jpg',
      './images/M05_000.jpg',
      './images/M06_000.jpg',
      './images/M07_000.jpg',
      './images/M08_000.jpg',
      './images/M09_000.jpg',
      './images/M10_000.jpg',
      './images/M11_000.jpg',
      './images/M12_000.jpg',
    ])
    this.slotTextures = [
      Texture.from('./images/M00_000.jpg'),
      Texture.from('./images/M01_000.jpg'),
      Texture.from('./images/M03_000.jpg'),
      Texture.from('./images/M04_000.jpg'),
      Texture.from('./images/M05_000.jpg'),
      Texture.from('./images/M06_000.jpg'),
      Texture.from('./images/M07_000.jpg'),
      Texture.from('./images/M08_000.jpg'),
      Texture.from('./images/M09_000.jpg'),
      Texture.from('./images/M10_000.jpg'),
      Texture.from('./images/M11_000.jpg'),
      Texture.from('./images/M12_000.jpg'),
    ]
    this.createReels()
    this.createGraphics()
    this.app.ticker.add(() => this.update())
  }

  createReels() {
    const reelContainer = new Container()
    const margin = (this.app.screen.height - this.symbolSize * 3) / 2
    for (let i = 0; i < 5; i++) {
      const rc = new Container()
      rc.x = i * this.reelWidth
      reelContainer.addChild(rc)
      const reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      }
      reel.blur.blurX = 0
      reel.blur.blurY = 0
      rc.filters = [reel.blur]
      for (let j = 0; j < 4; j++) {
        const symbol = new Sprite(
          this.slotTextures[
            Math.floor(Math.random() * this.slotTextures.length)
          ]
        )
        symbol.y = j * this.symbolSize
        symbol.scale.x = symbol.scale.y = Math.min(
          this.symbolSize / symbol.width,
          this.symbolSize / symbol.height
        )
        symbol.x = Math.round((this.symbolSize - symbol.width) / 2)
        reel.symbols.push(symbol)
        rc.addChild(symbol)
      }
      this.reels.push(reel)
    }
    reelContainer.x = (this.app.screen.width - reelContainer.width) / 2
    reelContainer.y = margin
    this.app.stage.addChild(reelContainer)
  }

  createGraphics() {
    const margin = (this.app.screen.height - this.symbolSize * 3) / 2
    const top = new Graphics()
      .rect(0, 0, this.app.screen.width, margin)
      .fill({ color: 0x0 })
    const bottom = new Graphics()
      .rect(0, this.symbolSize * 3 + margin, this.app.screen.width, margin)
      .fill({ color: 0x0 })
    const fill = new FillGradient(0, 0, 0, 36 * 1.7)
    const colors = [0xffffff, 0x00ff99].map((color) =>
      Color.shared.setValue(color).toNumber()
    )
    colors.forEach((number, index) => {
      const ratio = index / colors.length
      fill.addColorStop(ratio, number)
    })
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: { fill },
      stroke: { color: 0x4a1850, width: 5 },
      dropShadow: {
        color: 0x000000,
        angle: Math.PI / 6,
        blur: 4,
        distance: 6,
      },
      wordWrap: true,
      wordWrapWidth: 440,
    })
    const playText = new Text('Spin!!!', style)
    playText.x = Math.round((bottom.width - playText.width) / 2)
    playText.y =
      this.app.screen.height -
      margin +
      Math.round((margin - playText.height) / 2)
    bottom.addChild(playText)
    this.app.stage.addChild(top)
    this.app.stage.addChild(bottom)
    bottom.eventMode = 'static'
    bottom.cursor = 'pointer'
    bottom.addListener('pointerdown', () => {
      this.startPlay()
    })
  }

  startPlay = () => {
    if (this.running) return
    this.running = true
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i]
      const extra = Math.floor(Math.random() * 3)
      const target = r.position + 10 + i * 5 + extra
      const time = 2500 + i * 600 + extra * 600
      this.tweenTo(
        r,
        'position',
        target,
        time,
        this.backout(0.5),
        null,
        i === this.reels.length - 1 ? this.reelsComplete : null
      )
    }
  }

  reelsComplete = () => {
    this.running = false
  }

  update() {
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i]
      r.blur.blurY = (r.position - r.previousPosition) * 8
      r.previousPosition = r.position
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j]
        const prevy = s.y
        s.y =
          ((r.position + j) % r.symbols.length) * this.symbolSize -
          this.symbolSize
        if (s.y < 0 && prevy > this.symbolSize) {
          s.texture =
            this.slotTextures[
              Math.floor(Math.random() * this.slotTextures.length)
            ]
          s.scale.x = s.scale.y = Math.min(
            this.symbolSize / s.texture.width,
            this.symbolSize / s.texture.height
          )
          s.x = Math.round((this.symbolSize - s.width) / 2)
        }
      }
    }
    const now = Date.now()
    const remove = []
    for (let i = 0; i < this.tweening.length; i++) {
      const t = this.tweening[i]
      const phase = Math.min(1, (now - t.start) / t.time)
      t.object[t.property] = this.lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      )
      if (t.change) t.change(t)
      if (phase === 1) {
        t.object[t.property] = t.target
        if (t.complete) t.complete(t)
        remove.push(t)
      }
    }
    for (let i = 0; i < remove.length; i++) {
      this.tweening.splice(this.tweening.indexOf(remove[i]), 1)
    }
  }

  tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    }
    this.tweening.push(tween)
    return tween
  }

  lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t
  }

  backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1
  }
}
