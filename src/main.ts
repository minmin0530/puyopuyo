const canvas = document.querySelector<HTMLCanvasElement>('#app')!
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Block {
  x: number;
  y: number;
  size: number;
  speedX: number = 0;
  speedY: number = 10;
  isHit: boolean = false;
  color: string;
  isCheck: boolean = false;
  sameCount: number = 1;

  constructor(x: number, y: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }
  hit(block: Block) {
    if (this.x <  block.x + this.size && block.x <  this.x + block.size  &&
        this.y <= block.y             && block.y <= this.y + block.size) {
        this.isHit = true;
        if (this.isCheck == false && block.isCheck == false && this.color == block.color) {
          block.isCheck = true;
          this.isCheck = true;
          block.sameCount += 1;
          this.sameCount += 1;
        }
    } else {
      this.isHit = false;
    }
    if (this.isHit == true &&
        this.x <=  block.x              && block.x <=  this.x + block.size  &&
        this.y < block.y  + this.size && block.y < this.y + block.size) {
          if (this.isCheck == false && block.isCheck == false && this.color == block.color) {
            block.isCheck = true;
            this.isCheck = true;
            block.sameCount += 1;
            this.sameCount += 1;
          }
    }
  }

  delete() {
    this.x = 0;
    this.y = window.innerHeight;
    this.speedY = 0;
  }

  update() {
    if (this.isHit == false && this.y <= window.innerHeight - this.size) {
      this.x += this.speedX;
      this.y += this.speedY;        
    } else {
      this.isHit = true;
    }
  }
}
const INIT_X = 300;
let blocks: Block[] = [];
let colors: string[] = [];

for (let i = 0; i < 6; i++) {
  colors.push("rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")");
}

let time: number = 0;
function loop() {
  time += 1;
  requestAnimationFrame(loop);

  if (time % 50 == 0) {
    for (let i: number = 0; i < Math.random() * 20; i++) {
      blocks.push(new Block(INIT_X + i * 200, 0, 200, colors[Math.floor(Math.random() * colors.length)]));
    }
  }

  if (ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();

    for (const block of blocks) {
      ctx.beginPath();
      ctx.rect(block.x, block.y, block.size, block.size);
      ctx.closePath();
      ctx.fillStyle = block.color;
      ctx.fill();
      for (const block2 of blocks) {
        if (block != block2) {
          block.hit(block2);
        }
      }
      block.update();        
    }


    for (const block of blocks) {
      if (block.sameCount >= 2) {
        block.delete();
      }
    }



  }
}
loop();