import { mathstuffextend } from './mathstuff-extend.js';

const calculate = {
  _tailFactor: 0.05,
  _headPercentage: 0.07,
  determinant: function (a, n) {
    var i, j, j1, j2;
    var d = 0;
    var m = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    if (n == 2)                                // terminate recursion
    {
      d = a[0][0] * a[1][1] - a[1][0] * a[0][1];
    }
    else {
      d = 0;
      for (j1 = 0; j1 < n; j1++)            // do each column
      {
        for (i = 1; i < n; i++)            // create minor
        {
          j2 = 0;
          for (j = 0; j < n; j++) {
            if (j == j1) continue;
            m[i - 1][j2] = a[i][j];
            j2++;
          }
        }

        // sum (+/-)cofactor * minor
        d = d + Math.pow(-1.0, j1) * a[0][j1] * MathStuff.determinant(m, n - 1);
      }
    }

    return d;
  },
  calculateCircle: function (pt1, pt2, pt3) {
    var i;
    var r, m11, m12, m13, m14;
    var a = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    var P = [
      [pt1[0], pt1[1]],
      [pt2[0], pt2[1]],
      [pt3[0], pt3[1]]
    ];
    for (i = 0; i < 3; i++)                    // find minor 11
    {
      a[i][0] = P[i][0];
      a[i][1] = P[i][1];
      a[i][2] = 1;
    }
    m11 = MathStuff.determinant(a, 3);

    for (i = 0; i < 3; i++)                    // find minor 12
    {
      a[i][0] = P[i][0] * P[i][0] + P[i][1] * P[i][1];
      a[i][1] = P[i][1];
      a[i][2] = 1;
    }
    m12 = MathStuff.determinant(a, 3);

    for (i = 0; i < 3; i++)                    // find minor 13
    {
      a[i][0] = P[i][0] * P[i][0] + P[i][1] * P[i][1];
      a[i][1] = P[i][0];
      a[i][2] = 1;
    }
    m13 = MathStuff.determinant(a, 3);

    for (i = 0; i < 3; i++)                    // find minor 14
    {
      a[i][0] = P[i][0] * P[i][0] + P[i][1] * P[i][1];
      a[i][1] = P[i][0];
      a[i][2] = P[i][1];
    }
    m14 = MathStuff.determinant(a, 3);

    if (m11 == 0) {
      r = 0;                                 // not a circle
    }
    else {
      var Xo = 0.5 * m12 / m11;                 // center of circle
      var Yo = -0.5 * m13 / m11;
      r = Math.sqrt(Xo * Xo + Yo * Yo + m14 / m11);
    }

    return { radius: r, center: { x: Xo, y: Yo } };                                  // the radius
  },
  createCurveFromCircle: function (circle, pt1, pt2, pt3, numberOfPts) {
    var center = circle.center, radius = circle.radius, path = [];
    pt1[0] -= center.x;
    pt1[1] -= center.y;
    pt2[0] -= center.x;
    pt2[1] -= center.y;
    pt3[0] -= center.x;
    pt3[1] -= center.y;
    var anglePt1 = Math.atan2(pt1[1], pt1[0]), anglePt2 = Math.atan2(pt2[1], pt2[0]), anglePt3 = Math.atan2(pt3[1], pt3[0]);
    anglePt1 = anglePt1 < 0 ? 2 * Math.PI + anglePt1 : anglePt1;
    anglePt2 = anglePt2 < 0 ? 2 * Math.PI + anglePt2 : anglePt2;
    anglePt3 = anglePt3 < 0 ? 2 * Math.PI + anglePt3 : anglePt3;
    var startAngle = Math.min(anglePt1, anglePt2);
    var endAngle = Math.max(anglePt1, anglePt2);
    var swipeAngle = endAngle - startAngle;
    if (anglePt3 < startAngle || anglePt3 > endAngle) {
      swipeAngle -= (2 * Math.PI);
    }
    var angle = swipeAngle / numberOfPts, pt;
    for (var i = 0; i <= numberOfPts; i++) {
      pt = [radius * Math.cos(startAngle + i * angle) + center.x, radius * Math.sin(startAngle + i * angle) + center.y]
      path.push(pt);
    }
    return path;

  },
  curve: function (pt1, pt2, pt3) {
    var circle = MathStuff.calculateCircle(pt1, pt2, pt3)
    return MathStuff.createCurveFromCircle(circle, pt1, pt2, pt3, 30)
  },
  circle: function (pt1, pt2) {
    var w = Math.abs(pt1.x - pt2.x)
    var h = Math.abs(pt1.y - pt2.y)
    var r = Math.sqrt(w * w + h * h)
    var path = []
    for (var i = 0; i < 60; i++) {
      var angle = 2 * Math.PI / 60 * i
      path.push([pt1.x + r * Math.sin(angle), pt1.y + r * Math.cos(angle)])
    }
    path.push(path[0])
    return path
  },
  bezierPoly: function (path) {
    path = JSON.parse(JSON.stringify(path));
    path.push(path[0])
    return this.bezierLine(path)
  },
  bezierLine: function (path) {
    var NUM = 100
    path = JSON.parse(JSON.stringify(path));
    var b = []
    for (var i = 0; i < path.length; i++) {
      var obj = path[i];
      b.push({ x: obj.x, y: obj.y })
    }
    var position = { x: path[0].x, y: path[0].y };
    var tween = MathStuff.TweenMax.to(position, NUM, { bezier: b, ease: MathStuff.Linear.easeNone });
    //ease:Power1.easeInOut  ease: Linear.easeNone
    var result = [];
    for (i = 0; i <= NUM; i++) {
      tween.time(i);
      result.push([position.x, position.y]);
    }
    return result
  },
  arrow2: function (inputPt1, inputPt2) {
    var len = MathStuff.distance(inputPt1, inputPt2);
    var k = Math.atan((inputPt1.y - inputPt2.y) / (inputPt1.x - inputPt2.x));
    switch (MathStuff.orientation(inputPt1, inputPt2)) {
      case "ne":
      case "se":
        k += Math.PI / 2;
        break;
      case "nw":
      case "sw":
        k += Math.PI * 3 / 2;
        break;

    }
    //tail two points
    var pt1 = {
      x: MathStuff._tailFactor * len * Math.cos(k) + inputPt1.x,
      y: MathStuff._tailFactor * len * Math.sin(k) + inputPt1.y
    };
    var pt2 = {
      x: -1 * MathStuff._tailFactor * len * Math.cos(k) + inputPt1.x,
      y: -1 * MathStuff._tailFactor * len * Math.sin(k) + inputPt1.y
    };
    var partialLen = (1 - MathStuff._headPercentage) * len;
    var p1 = {
      x: MathStuff._tailFactor * partialLen * Math.cos(k) + inputPt1.x,
      y: MathStuff._tailFactor * partialLen * Math.sin(k) + inputPt1.y
    };
    var p2 = {
      x: -1 * MathStuff._tailFactor * partialLen * Math.cos(k) + inputPt1.x,
      y: -1 * MathStuff._tailFactor * partialLen * Math.sin(k) + inputPt1.y
    };
    var ring = []
    ring.push([pt1.x, pt1.y]);
    ring.push([p1.x, p1.y]);
    ring = ring.concat(MathStuff.arrowHeader(p1, inputPt2, p2, len, MathStuff._headPercentage, 15));
    //ring.push(candidatePoint);
    ring.push([p2.x, p2.y]);
    ring.push([pt2.x, pt2.y]);

    ring.push([pt1.x, pt1.y]);
    return ring
  },
  arrow3: function (pointArray) {
    var ring = []
    var r = JSON.parse(JSON.stringify(pointArray));
    var candidatePoint = r.pop()
    var tempArray = JSON.parse(JSON.stringify(r));
    var leftArray = [], rightArray = [];
    tempArray.push({ x: candidatePoint.x, y: candidatePoint.y });
    var angleArray = MathStuff.angleArray(tempArray);
    var totalL = MathStuff.pathLength(tempArray, 0);
    for (var i = 0; i < tempArray.length - 1; i++) {
      var partialLen = MathStuff.pathLength(tempArray, i);
      partialLen += totalL / 2.4;
      //console.log(partialLen);

      var pt1 = [(MathStuff._tailFactor) * partialLen * Math.cos(angleArray[i]) + tempArray[i].x,
      (MathStuff._tailFactor) * partialLen * Math.sin(angleArray[i]) + tempArray[i].y];
      var pt2 = [-1 * (MathStuff._tailFactor) * partialLen * Math.cos(angleArray[i]) + tempArray[i].x,
      -1 * (MathStuff._tailFactor) * partialLen * Math.sin(angleArray[i]) + tempArray[i].y]
      leftArray.push(pt1);
      rightArray.push(pt2);
    }
    leftArray.push([candidatePoint.x, candidatePoint.y]);
    rightArray.push([candidatePoint.x, candidatePoint.y]);

    leftArray = MathStuff.bezierPath(leftArray, 70);
    leftArray.splice(Math.floor((1 - MathStuff._headPercentage) * 70), Number.MAX_VALUE);

    rightArray = MathStuff.bezierPath(rightArray, 70);
    rightArray.splice(Math.floor((1 - MathStuff._headPercentage) * 70), Number.MAX_VALUE);
    var leftpt = leftArray[leftArray.length - 1];
    leftpt = { x: leftpt[0], y: leftpt[1] }
    var rightpt = rightArray[rightArray.length - 1]
    rightpt = { x: rightpt[0], y: rightpt[1] }
    var headPath = MathStuff.arrowHeader(leftpt, candidatePoint, rightpt, MathStuff.pathLength(tempArray, 0), MathStuff._headPercentage, 15);
    ring = ring.concat(leftArray);
    ring = ring.concat(headPath);
    ring = ring.concat(rightArray.reverse());
    ring.push(ring[0]);
    return ring

  },
  distance: function (pt1, pt2) {
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
  },
  orientation: function (pt1, pt2) {
    if (pt2.x > pt1.x && pt2.y >= pt1.y) return "ne";
    else if (pt2.x <= pt1.x && pt2.y > pt1.y) return "nw";
    else if (pt2.x < pt1.x && pt2.y <= pt1.y) return "sw";
    else return "se";
  },
  angle: function (pt1, pt2) {
    var angle = Math.acos((pt2.x - pt1.x) / MathStuff.distance(pt1, pt2));
    if (pt2.y < pt1.y) {
      angle = 2 * Math.PI - angle;
    }
    return angle;
  },
  arrowHeader: function (pt1, candidatePt, pt2, totalLen, headPercentage, headAngle) {
    var headSizeBaseRatio = 1.7;
    var headBaseLen = totalLen * headPercentage;
    var headSideLen = headBaseLen * headSizeBaseRatio;
    var angle1 = MathStuff.angle(candidatePt, pt1);
    var angle2 = MathStuff.angle(candidatePt, pt2);
    var midAngle = (Math.abs(angle1 - angle2)) / 2;
    if (Math.abs(angle1 - angle2) > Math.PI * 1.88) midAngle += Math.PI;
    var len = Math.sqrt(headBaseLen * headBaseLen + headSideLen * headSideLen - 2 * headSideLen * headBaseLen * Math.cos(midAngle + headAngle / 180 * Math.PI));
    var upAngle = Math.asin(headBaseLen * Math.sin(midAngle + headAngle / 180 * Math.PI) / len);
    var centAngle = upAngle + headAngle / 180 * Math.PI;
    var result = headBaseLen * Math.sin(Math.PI - centAngle - midAngle) / Math.sin(centAngle);
    var path = [];

    path.push([candidatePt.x + result * Math.cos(angle1), candidatePt.y + result * Math.sin(angle1)]);
    path.push([candidatePt.x + headSideLen * Math.cos(angle1 - headAngle / 180 * Math.PI),
    candidatePt.y + headSideLen * Math.sin(angle1 - headAngle / 180 * Math.PI)
    ]);
    path.push([candidatePt.x, candidatePt.y]);
    path.push([candidatePt.x + headSideLen * Math.cos(angle2 + headAngle / 180 * Math.PI),
    candidatePt.y + headSideLen * Math.sin(angle2 + headAngle / 180 * Math.PI)
    ]);
    path.push([candidatePt.x + result * Math.cos(angle2), candidatePt.y + result * Math.sin(angle2)]);
    return path;
  },
  angleArray: function (path) {
    var segmentAngle = [], vertexAngle = [], left = [];
    for (var i = 0, len = path.length - 1; i < len; i++) {
      var x = MathStuff.angle(path[i], path[i + 1]);
      segmentAngle.push(x);
    }
    x = MathStuff.angle(path[0], path[1]);
    vertexAngle.push(x += Math.PI / 2);
    for (i = 1; i < len; i++) {
      x = (segmentAngle[i - 1] + segmentAngle[i]) / 2;
      if (segmentAngle[i - 1] < Math.PI && segmentAngle[i] - Math.PI > segmentAngle[i - 1]) {
        x += Math.PI;
      }
      else if (segmentAngle[i - 1] > Math.PI && segmentAngle[i] < segmentAngle[i - 1] - Math.PI) {
        x += Math.PI;
      }
      x += Math.PI / 2;
      vertexAngle.push(x);
    }
    return vertexAngle;
  },
  pathLength: function (path, startIndex) {
    var len = 0;
    for (var i = startIndex, pathLen = path.length - 1; i < pathLen; i++) {
      len += MathStuff.distance(path[i], path[i + 1]);
    }
    return len;
  },
  bezierPath: function (pointCollection, numberOfPts) {
    var position = { x: pointCollection[0][0], y: pointCollection[0][1] };
    if (pointCollection[pointCollection.length - 1][0] === pointCollection[pointCollection.length - 2][0] && pointCollection[pointCollection.length - 1][1] === pointCollection[pointCollection.length - 2][1]) {
      pointCollection.pop();
    }
    if (pointCollection[pointCollection.length - 1][0] === pointCollection[pointCollection.length - 2][0] && pointCollection[pointCollection.length - 1][1] === pointCollection[pointCollection.length - 2][1]) {
      pointCollection.pop();
    }
    //pointCollection.push(pt);
    var tween = MathStuff.TweenMax.to(position, numberOfPts, {
      bezier: MathStuff.ptArray2Obj(pointCollection),
      ease: MathStuff.Linear.easeNone
    });
    //ease:Power1.easeInOut  ease: Linear.easeNone
    var path = [];
    for (var i = 0; i <= numberOfPts; i++) {
      tween.time(i);
      path.push([position.x, position.y]);
    }

    return path;

  },
  ptArray2Obj: function (arr) {
    var result = []
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      result.push({ x: obj[0], y: obj[1] })

    }
    return result;
  },
  obj2PtArray: function (arr) {
    var result = []
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      result.push([obj.x, obj.y])

    }
    return result;
  },

  //扩展
  MathDistance: function (pnt1, pnt2) {
    return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2));
  },
  getThirdPoint: function (startPnt, endPnt, angle, distance, clockWise) {
    var azimuth = MathStuff.getAzimuth(startPnt, endPnt);
    var alpha = clockWise ? (azimuth + angle) : (azimuth - angle);
    var dx = distance * Math.cos(alpha);
    var dy = distance * Math.sin(alpha);
    return [endPnt[0] + dx, endPnt[1] + dy];
  },
  getAzimuth: function (startPoint, endPoint) {
    var azimuth;
    var angle = Math.asin(Math.abs(endPoint[1] - startPoint[1]) / MathStuff.MathDistance(startPoint, endPoint));

    if (endPoint[1] >= startPoint[1] && endPoint[0] >= startPoint[0]) {
      azimuth = angle + Math.PI;
    } else if (endPoint[1] >= startPoint[1] && endPoint[0] < startPoint[0]) {
      azimuth = Math.PI * 2 - angle;
    } else if (endPoint[1] < startPoint[1] && endPoint[0] < startPoint[0]) {
      azimuth = angle;
    } else if (endPoint[1] < startPoint[1] && endPoint[0] >= startPoint[0]) {
      azimuth = Math.PI - angle;
    }

    return azimuth;
  },
  Mid: function (point1, point2) {
    return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
  },
  getCircle: function (pt1, pt2) {
    var w = Math.abs(pt1[0] - pt2[0])
    var h = Math.abs(pt1[1] - pt2[1])
    var r = Math.sqrt(w * w + h * h)
    var path = []
    for (var i = 0; i < 60; i++) {
      var angle = 2 * Math.PI / 60 * i
      path.push([pt1[0] + r * Math.sin(angle), pt1[1] + r * Math.cos(angle)])
    }
    path.push(path[0])
    return path
  },
  isClockWise: function (pnt1, pnt2, pnt3) {
    return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0]);
  },
  getBezierPoints: function (points) {
    if (points.length <= 2) {
      return points;
    } else {
      var bezierPoints = [];
      var n = points.length - 1;

      for (var t = 0; t <= 1; t += 0.01) {
        var x = 0,
          y = 0;

        for (var index = 0; index <= n; index++) {
          var factor = MathStuff.getBinomialFactor(n, index);
          var a = Math.pow(t, index);
          var b = Math.pow(1 - t, n - index);
          x += factor * a * b * points[index][0];
          y += factor * a * b * points[index][1];
        }

        bezierPoints.push([x, y]);
      }

      bezierPoints.push(points[n]);
      return bezierPoints;
    }
  },
  getBinomialFactor: function (n, index) {
    return MathStuff.getFactorial(n) / (MathStuff.getFactorial(index) * MathStuff.getFactorial(n - index));
  },
  getFactorial: function (n) {
    var result = 1;

    switch (n) {
      case n <= 1:
        result = 1;
        break;

      case n === 2:
        result = 2;
        break;

      case n === 3:
        result = 6;
        break;

      case n === 24:
        result = 24;
        break;

      case n === 5:
        result = 120;
        break;

      default:
        for (var i = 1; i <= n; i++) {
          result *= i;
        }

        break;
    }

    return result;
  },
  getBaseLength: function (points) {
    return Math.pow(MathStuff.wholeDistance(points), 0.99);
  },
  wholeDistance: function (points) {
    var distance = 0;

    if (points && Array.isArray(points) && points.length > 0) {
      points.forEach(function (item, index) {
        if (index < points.length - 1) {
          distance += MathStuff.MathDistance(item, points[index + 1]);
        }
      });
    }

    return distance;
  },
  getAngleOfThreePoints: function (pntA, pntB, pntC) {
    var angle = MathStuff.getAzimuth(pntB, pntA) - MathStuff.getAzimuth(pntB, pntC);
    return angle < 0 ? angle + Math.PI * 2 : angle;
  }
}

const MathStuff = {};

Object.assign(MathStuff, calculate, mathstuffextend);


export { MathStuff };