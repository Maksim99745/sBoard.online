import { Container, Graphics, Sprite, Texture } from 'pixi.js-legacy';

export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;

function createSampleTexture(): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 120;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#d4e4f7';
  ctx.fillRect(0, 0, 160, 120);
  ctx.fillStyle = '#6b8cae';
  ctx.fillRect(16, 32, 128, 72);
  ctx.fillStyle = '#f4a261';
  ctx.fillRect(56, 64, 48, 40);
  ctx.fillStyle = '#2a9d8f';
  ctx.fillRect(24, 40, 24, 48);

  return Texture.from(canvas);
}

function enablePointerEvents(target: Graphics | Sprite, label: string): void {
  target.eventMode = 'static';
  target.cursor = 'pointer';
  target.on('pointerdown', () => {
    console.log(`${label} pointerdown!`);
  });
  target.on('pointerup', () => {
    console.log(`${label} pointerup!`);
  });
}

export function createDemoScene(): Container {
  const mainContainer = new Container();
  const subContainer = new Container();

  const g1 = new Graphics();
  const g2 = new Graphics();
  const g3 = new Graphics();
  const g4 = new Graphics();

  g1.beginFill(0xff0000).drawEllipse(0, 0, 200, 100).endFill();
  g1.position.set(200, 100);
  g1.angle = 30;
  enablePointerEvents(g1, 'g1');

  g2.beginFill(0x0000ff).drawRect(-50, -75, 100, 150).endFill();
  g2.position.set(120, 60);
  g2.angle = 15;
  g2.scale.set(1.5, 1.7);
  enablePointerEvents(g2, 'g2');

  g3.lineStyle(10, 0xffffff, 1).moveTo(0, 0).lineTo(150, 100);
  g3.angle = -20;

  g4.lineStyle(10, 0xffff00, 1).moveTo(0, 70).lineTo(150, -30);
  g4.angle = 20;

  subContainer.position.set(75, 50);
  subContainer.addChild(g3, g4);

  const sprite = new Sprite(createSampleTexture());
  sprite.position.set(80, 280);
  sprite.angle = -12;
  sprite.scale.set(0.9);
  enablePointerEvents(sprite, 'sprite');

  mainContainer.addChild(subContainer, g1, g2, sprite);

  return mainContainer;
}

export function addRandomShape(container: Container): Graphics {
  const g = new Graphics();
  const colors = [0xe63946, 0x2a9d8f, 0xf4a261, 0x457b9d, 0x8338ec];
  const color = colors[Math.floor(Math.random() * colors.length)]!;

  if (Math.random() > 0.5) {
    const w = 40 + Math.random() * 80;
    const h = 40 + Math.random() * 80;
    g.beginFill(color).drawRect(-w / 2, -h / 2, w, h).endFill();
  } else {
    const len = 60 + Math.random() * 120;
    const angle = Math.random() * Math.PI;
    g.lineStyle(6 + Math.random() * 6, color, 1)
      .moveTo(0, 0)
      .lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
  }

  g.position.set(80 + Math.random() * 480, 60 + Math.random() * 360);
  g.angle = Math.random() * 60 - 30;
  g.scale.set(0.8 + Math.random() * 0.6);

  const id = container.children.length;
  enablePointerEvents(g, `random-${id}`);
  container.addChild(g);

  return g;
}
