# CanvasFilter
Canvas filters using imageData

Very simply API to apply filters on a HTML5 canvas element

## Usage

**Using JSPM (ECMAScript / ES6 Module)**

install
```
jspm install github:casperlamboo/CanvasFilter
```

include in your project
```javascript
import Shape from 'Doodle3D/ClipperJS';
```

**Using NPM (CommonJS module)**

install
```
npm install canvas-filter
```

include in your project
```javascript
var Shape = require('canvas-filter');
```
## API

**Filter**

Filter accepts one optional argument, `canvas`. This is the canvas the filter is applied on.
```javascript
filter = new Filter([ canvas ]);

canvas = HTML5Canvas;
```

**setCanvas**

```javascript
Filter = filter.setCanvas(canvas);

canvas = HTML5Canvas;
```

**setSize**

```javascript
Filter = filter.setSize(width, height);

width = Int;
height = Int;
```

**grayScale**

```javascript
Filter = filter.grayScale(r = 0.2126, g = 0.7152, b = 0.0722);

width = Int;
height = Int;
```

**highPass**

```javascript
Filter = filter.highPass(threshold);

threshold = Int;
```

**lowPass**

```javascript
Filter = filter.lowPass(threshold);

threshold = Int;
```

**lowHighPass**

```javascript
Filter = filter.lowHighPass(minThreshold, maxTreshold);

minThreshold = Int;
maxTreshold = Int;
```

**floodFill**

```javascript
Filter = filter.floodfill(x, y, tolerance, [ { fillColor, edgeColor, backgroundColor } ]);

x = Int;
y = Int;
tolerance = Int;
fillColor = Color;
edgeColor = Color;
backgroundColor = Color;

Color = { r: Int, g: Int, b: Int, a: Int };
```

**threshold**

```javascript
Filter = filter.threshold(threshold);

threshold = Int;
```

**getPixel**

```javascript
Color = filter.getPixel(x, y);

x = Int;
y = Int;
Color = { r: Int, g: Int, b: Int, a: Int };
```

**apply**

```javascript
Filter = filter.apply();
```

**copy**

```javascript
Filter = filter.copy(Filter);
```

**clone**

```javascript
Filter = filter.clone();
```
