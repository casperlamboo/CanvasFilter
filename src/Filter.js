/* */
export default class Filter {
  constructor(canvas = document.createElement('canvas')) {
    this.setCanvas(canvas);
  }
  setCanvas(canvas) {
    this.setContext(canvas.getContext('2d'));

    return this;
  }
  setContext(context) {
    this.canvas = context.canvas;

    this.context = context;
    this.width = context.canvas.width;
    this.height = context.canvas.height;

    this._updateImageData();

    return this;
  }
  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;

    this._updateImageData();

    return this;
  }
  _updateImageData() {
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);
  }
  grayScale(r = 0.2126, g = 0.7152, b = 0.0722) {
    const data = this.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const color = data[i] * r + data[i + 1] * g + data[i + 2] * b;

      data[i] = color;
      data[i + 1] = color;
      data[i + 2] = color;
    }

    return this;
  }
  highPass(threshold) {
    const data = this.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const pass = brightness > threshold;

      if (!pass) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }

    return this;
  }
  lowPass(threshold) {
    const data = this.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const pass = brightness < threshold;

      if (!pass) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }

    return this;
  }
  lowHighPass(minThreshold, maxTreshold) {
    const data = this.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const pass = brightness < maxTreshold && brightness > minThreshold;

      if (!pass) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }

    return this;
  }
  floodfill(x, y, tolerance, { fillColor, edgeColor, backgroundColor } = {}, timeout = 0) {
    tolerance *= 3;

    const compairIndex = this.getIndex(x, y);
    const compairPixel = this.getPixelIndex(compairIndex);
    if (!compairPixel) return this; // out of bounds
    const compairBrightness = compairPixel.r + compairPixel.g + compairPixel.b;

    const stack = [compairIndex];
    const done = { [compairIndex]: true };

    const edge = [];
    const fill = [];

    const startTime = Date.now();
    while (stack.length > 0) {
      if (timeout && Date.now() - startTime > timeout) {
        return this;
      }

      const index = stack.pop();

      const pixel = this.getPixelIndex(index);
      if (!pixel) continue;
      const brightness = pixel.r + pixel.g + pixel.b;

      const pass = Math.abs(compairBrightness - brightness) < tolerance;

      if (!pass) {
        edge.push(index);
        continue;
      }

      fill.push(index);

      const neighbours = [];
      if (index % this.width !== 0) neighbours.push(index - 1); // left
      if (index % this.width !== this.width - 1) neighbours.push(index + 1); // right
      if (Math.floor(index / this.width) !== 0) neighbours.push(index - this.width); // top
      if (Math.floor(index / this.width) !== this.height - 1) neighbours.push(index + this.width); // bottom

      for (let i = 0; i < neighbours.length; i ++) {
        const neighbourIndex = neighbours[i];

        if (!done[neighbourIndex]) {
          stack.push(neighbourIndex);
        }
        done[neighbourIndex] = true;
      }
    }

    const data = this.imageData.data;

    if (backgroundColor !== undefined) {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = backgroundColor.r;
        data[i + 1] = backgroundColor.g;
        data[i + 2] = backgroundColor.b;
        if (backgroundColor.a !== undefined) {
          data[i + 3] = backgroundColor.a;
        }
      }
    }
    if (edgeColor !== undefined) {
      for (let edgeIndex = 0; edgeIndex < edge.length; edgeIndex ++) {
        const index = edge[edgeIndex];
        const i = index * 4;

        data[i] = edgeColor.r;
        data[i + 1] = edgeColor.g;
        data[i + 2] = edgeColor.b;
        if (edgeColor.a !== undefined) {
          data[i + 3] = edgeColor.a;
        }
      }
    }
    if (fillColor !== undefined) {
      for (let fillIndex = 0; fillIndex < fill.length; fillIndex ++) {
        const index = fill[fillIndex];
        const i = index * 4;

        data[i] = fillColor.r;
        data[i + 1] = fillColor.g;
        data[i + 2] = fillColor.b;
        if (fillColor.a !== undefined) {
          data[i + 3] = fillColor.a;
        }
      }
    }

    return this;
  }
  threshold(threshold) {
    const data = this.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const color = brightness > threshold ? 255 : 0;

      data[i] = color;
      data[i + 1] = color;
      data[i + 2] = color;
    }

    return this;
  }
  getIndex(x, y) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) return null;

    return y * this.width + x;
  }
  getPixel() {
    if (arguments.length === 1) {
      const [index] = arguments;
      return this.getPixelIndex(index);
    } else if (arguments.length === 2) {
      const [x, y] = arguments;
      return this.getPixelCoord(x, y);
    }
  }
  getPixelCoord(x, y) {
    const index = this.getIndex(x, y);
    if (index === undefined) return null;

    return this.getPixelIndex(index);
  }
  getPixelIndex(index) {
    const data = this.imageData.data;

    const i = index * 4;

    if (i > data.length) return null;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    return { r, g, b, a };
  }
  apply() {
    this.context.putImageData(this.imageData, 0, 0);

    return this;
  }
  copy(filter) {
    this.width = filter.width;
    this.height = filter.height;

    this.canvas.width = filter.width;
    this.canvas.height = filter.height;

    this._updateImageData();

    const data = this.imageData.data;
    const copyData = filter.imageData.data;
    for (let i = 0; i < data.length; i ++) {
      data[i] = copyData[i];
    }

    return this;
  }
  clone() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const context = canvas.getContext('2d');

    context.putImageData(this.imageData, 0, 0);

    return new Filter(canvas);
  }
}
