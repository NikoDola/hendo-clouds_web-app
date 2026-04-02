export class Box {
  constructor(x, y, src) {
    this.x = x;
    this.y = y;
    this.src = src;

    this.img = new Image();
    this.img.src = src;

    this.loaded = false;
    this.width = 0;
    this.height = 0;

    this.img.onload = () => {
      this.width = this.img.width;
      this.height = this.img.height;
      this.loaded = true;
    };
  }

  draw(ctx, dx = this.x, dy = this.y) {
    if (!this.loaded) return;

    ctx.drawImage(this.img, dx, dy);

    ctx.globalCompositeOperation = "source-in";

    const gradient = ctx.createLinearGradient(
      dx,
      dy + this.height,
      dx,
      dy
    );

    gradient.addColorStop(0, "#efff0fff");
    gradient.addColorStop(0.5, "#2b2b91ff");
    gradient.addColorStop(1, "#ea2d88ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(dx, dy, this.width, this.height);

    ctx.globalCompositeOperation = "source-over";
  }
}
