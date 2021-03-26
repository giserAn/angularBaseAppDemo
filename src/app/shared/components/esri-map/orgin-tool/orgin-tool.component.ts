import { Component, OnInit } from '@angular/core';
import { EsriMapService } from 'src/app/shared/components/esri-map/esri-map.service';
import { loadModules } from 'esri-loader';
import { MathStuff } from '../../../custom-draw/mathstuff.js';
import { PlotDraw } from 'src/app/shared/orgin-draw/plot-draw';

// 工具字典（字母大小写转换必须对应）
const plot = {
  POINT: 'point',
  POLYLINE: 'polyline',
  POLYGON: 'polygon',
  CIRCLE: 'circle',
  THINARROW: 'thinarrow',
  WIDEARROW: 'widearrow',
  FREEPOLYGON: 'freepolygon',
  // FREELINE: 'freeline'，
  RECTANGLE: 'rectangle',
  TRIANGLEFLAG: 'triangleflag',
  BEZIERLINE: 'bezierline',
  FREEHANDARROW: 'freehandarrow'
}

@Component({
  selector: 'app-orgin-tool',
  templateUrl: './orgin-tool.component.html',
  styleUrls: ['./orgin-tool.component.scss']
})
export class OrginToolComponent implements OnInit {

  constructor(private esrimapServie: EsriMapService) { }

  ngOnInit() {
  }


  activeType: any;
  plotDrawGraphicsLayer: any;
  plotDrawGraphicsLayerId = 'plot-draw-graphicsLayer-id';
  coordinates = [];
  vertexAaddPoints = []; // 添加点数组
  vertexAUpdatePoints = []; // 移动点数组
  drawtool = null;

  async draw(type) {
    const view = await this.esrimapServie.getView();
    const [GraphicsLayer, SketchViewModel, Graphic] = await loadModules([
      'esri/layers/GraphicsLayer', 'esri/widgets/Sketch/SketchViewModel', "esri/Graphic"
    ]);

    if (!this.plotDrawGraphicsLayer) {
      this.plotDrawGraphicsLayer = new GraphicsLayer({
        id: this.plotDrawGraphicsLayerId,
        title: '自定义绘制图层',
        spatialReference: view.spatialReference,
        elevationInfo: {
          mode: "on-the-ground" // default value
          // mode: 'relative-to-scene',
          // mode:'relative-to-ground',
          // mode:'absolute-height'
        }
      });
      view.map.add(this.plotDrawGraphicsLayer)
    }

    !this.drawtool && (this.drawtool = new PlotDraw({ view, graphicsLayer: this.plotDrawGraphicsLayer }));

    this.activeType = type;
    switch (type) {
      case this.drawtool.plot.POINT:
        this.drawtool.drawActivate(this.drawtool.plot.POINT)
        break;
      case this.drawtool.plot.POLYLINE:
        this.drawtool.drawActivate(this.drawtool.plot.POLYLINE)
        break;
      case this.drawtool.plot.POLYGON:
        this.drawtool.drawActivate(this.drawtool.plot.POLYGON)
        break;
      case this.drawtool.plot.CIRCLE:
        this.drawtool.drawActivate(this.drawtool.plot.CIRCLE)
        break;
      case this.drawtool.plot.RECTANGLE:
        this.drawtool.drawActivate(this.drawtool.plot.RECTANGLE)
        break;
      case this.drawtool.plot.TRIANGLEFLAG:
        this.drawtool.drawActivate(this.drawtool.plot.TRIANGLEFLAG)
        break;
      case this.drawtool.plot.THINARROW:
        this.drawtool.drawActivate(this.drawtool.plot.THINARROW)
        break;
      case this.drawtool.plot.WIDEARROW:
        this.drawtool.drawActivate(this.drawtool.plot.WIDEARROW)
        break;
      case this.drawtool.plot.BEZIERLINE:
        this.drawtool.drawActivate(this.drawtool.plot.BEZIERLINE)
        break;
      case this.drawtool.plot.FREEPOLYGON:
        this.drawtool.drawActivate(this.drawtool.plot.FREEPOLYGON)
        break;
      case this.drawtool.plot.FREEHANDARROW:
        this.drawtool.drawActivate(this.drawtool.plot.FREEHANDARROW)
        break;
      // case this.drawtool.plot.FREELINE:
      //   this.drawtool.drawActivate(this.drawtool.plot.FREELINE)
      //   break;

      case 'remove':
        this.drawtool.drawRemoveAll();
        break;
      case 'redo':
        this.activeType = this.drawtool.drawRedo();
        break;
      case 'delete':
        this.activeType = this.drawtool.drawDelete();
        break;

    }
  }


  /**
   * 监听各种绘制工具，并处理坐标
   * @param drawAction 可能的值： point | multipoint | polyline | polygon | rectangle | circle | ellipse
   * @param drawOptions {mode:'click'} 可能的值：hybrid | freehand | click
   */
  private plotType = {
    POINT: { // 点
      drawAction: 'point', drawOptions: { mode: "click", hasZ: true }, geometryType: 'point', graphics: [], symbol: {
        type: "simple-marker", // autocasts as SimpleMarkerSymbol
        style: "square",
        color: "red",
        size: "16px",
        outline: { // autocasts as SimpleLineSymbol
          color: [255, 255, 0],
          width: 3
        },
      },
      on: {
        vertexAdd: (evt) => { },
        cursorUpdate: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.coordinates);
        },
        drawComplete: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.coordinates);
        },
        vertexRemove: (evt) => { },
      }
    },
    POLYLINE: { // 线
      drawAction: 'polyline', drawOptions: { mode: "click", hasZ: true }, geometryType: 'polyline', graphics: [], symbol: {
        type: "simple-line", // autocasts as SimpleLineSymbol
        color: [4, 90, 141],
        width: 3,
        cap: "round",
        join: "round"
      },
      on: {
        vertexAdd: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
        cursorUpdate: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
        drawComplete: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
        vertexRemove: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
      },
    },
    POLYGON: { // 面
      drawAction: 'polygon', drawOptions: { mode: "click" }, geometryType: 'polygon', graphics: [], symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "solid",
        outline: {  // autocasts as SimpleLineSymbol
          color: "white",
          width: 1
        }
      },
      on: {
        vertexAdd: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
        cursorUpdate: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
        drawComplete: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
        vertexRemove: (evt) => {
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, evt.vertices);
        },
      },
    },
    CIRCLE: { // 圆
      drawAction: 'polygon', drawOptions: { mode: "click" }, geometryType: 'polygon', graphics: [], symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "solid",
        outline: {  // autocasts as SimpleLineSymbol
          color: "white",
          width: 1
        }
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.CIRCLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.CIRCLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.CIRCLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.CIRCLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },
      handleVertices: (vertices) => {
        if (vertices.length < 2) return null;
        const [pnt1, pnt2] = [vertices[0], vertices[vertices.length - 1]];
        const newVertices = MathStuff.getCircle(pnt1, pnt2)

        return newVertices
      }
    },
    RECTANGLE: { // 矩形
      drawAction: 'polygon', drawOptions: { mode: "click" }, geometryType: 'polygon', graphics: [], symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "solid",
        outline: {  // autocasts as SimpleLineSymbol
          color: "white",
          width: 1
        }
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.RECTANGLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.RECTANGLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.RECTANGLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.RECTANGLE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },
      handleVertices: (vertices) => {
        if (vertices.length < 2) return null;

        const [pnt1, pnt2] = [vertices[0], vertices[vertices.length - 1]];
        const pnt_RT = [pnt2[0], pnt1[1]];
        const pnt_LB = [pnt1[0], pnt2[1]];
        const newVertices = [pnt1, pnt_RT, pnt2, pnt_LB, pnt1];

        return newVertices
      }
    },
    TRIANGLEFLAG: { // 三角旗
      drawAction: 'polygon', drawOptions: { mode: "click" }, geometryType: 'polygon', graphics: [], symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "solid",
        outline: {  // autocasts as SimpleLineSymbol
          color: "white",
          width: 1
        }
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.TRIANGLEFLAG.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.TRIANGLEFLAG.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.TRIANGLEFLAG.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.TRIANGLEFLAG.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },
      handleVertices: (vertices) => {
        if (vertices.length < 2) return null;

        const [pnt1, pnt2] = [vertices[0], vertices[vertices.length - 1]];
        const pnt_RT = [pnt2[0], pnt1[1]];
        const pnt_RM = [pnt2[0], (pnt1[1] + pnt2[1]) / 2];
        const pnt_LB = [pnt1[0], pnt2[1]];
        const pnt_LM = [pnt1[0], (pnt1[1] + pnt2[1]) / 2];

        const width = Math.abs(pnt2[0] - pnt1[0]) / 50;
        const pnt_LTW = [pnt1[0] + width, pnt1[1]]
        const pnt_LBW = [pnt1[0] + width, pnt2[1]]

        const newVertices = [[pnt1, pnt_RM, pnt_LM, pnt_LB, pnt1], [pnt1, pnt_LTW, pnt_LBW, pnt_LB, pnt1]];

        return newVertices
      }
    },
    THINARROW: { // 细直箭头
      drawAction: 'polyline', drawOptions: { mode: "click" }, geometryType: 'polyline', graphics: [], symbol: {
        type: "simple-line", // autocasts as SimpleLineSymbol
        color: [4, 90, 141],
        width: 3,
        cap: "round",
        join: "round"
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.THINARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.THINARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.THINARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.THINARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },

      // 箭头参数
      params: {
        arrowLengthScale: 5,
        maxArrowLength: 3000000,
      },
      handleVertices: (vertices) => {
        if (vertices.length < 2) return null;

        const [pnt1, pnt2] = [vertices[0], vertices[vertices.length - 1]];
        const distance = MathStuff.MathDistance(pnt1, pnt2);
        let len = distance / this.plotType.THINARROW.params.arrowLengthScale;
        len = len > this.plotType.THINARROW.params.maxArrowLength ? this.plotType.THINARROW.params.maxArrowLength : len;
        const leftPnt = MathStuff.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false);
        const rightPnt = MathStuff.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true);
        const newVertices = [[pnt1, pnt2], [leftPnt, pnt2, rightPnt]]

        return newVertices
      }
    },
    WIDEARROW: { // 宽直箭头
      drawAction: 'polygon', drawOptions: { mode: "click" }, geometryType: 'polygon', graphics: [], symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "solid",
        outline: {  // autocasts as SimpleLineSymbol
          color: "white",
          width: 1
        }
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.WIDEARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.WIDEARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.WIDEARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.WIDEARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },

      // 箭头参数
      params: {
        tailWidthFactor: 0.05,
        neckWidthFactor: 0.1,
        headWidthFactor: 0.15,
        headAngle: Math.PI / 4,
        neckAngle: Math.PI * 0.17741,
      },
      handleVertices: (vertices) => {
        if (vertices.length < 2) return null;

        const [pnt1, pnt2] = [vertices[0], vertices[vertices.length - 1]];
        const len = MathStuff.getBaseLength([pnt1, pnt2]);
        const tailWidth = len * this.plotType.WIDEARROW.params.tailWidthFactor;
        const neckWidth = len * this.plotType.WIDEARROW.params.neckWidthFactor;
        const headWidth = len * this.plotType.WIDEARROW.params.headWidthFactor;
        const tailLeft = MathStuff.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, true);
        const tailRight = MathStuff.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, false);
        const headLeft = MathStuff.getThirdPoint(pnt1, pnt2, this.plotType.WIDEARROW.params.headAngle, headWidth, false);
        const headRight = MathStuff.getThirdPoint(pnt1, pnt2, this.plotType.WIDEARROW.params.headAngle, headWidth, true);
        const neckLeft = MathStuff.getThirdPoint(pnt1, pnt2, this.plotType.WIDEARROW.params.neckAngle, neckWidth, false);
        const neckRight = MathStuff.getThirdPoint(pnt1, pnt2, this.plotType.WIDEARROW.params.neckAngle, neckWidth, true);
        const newVertices = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];

        return newVertices

      }
    },
    FREEPOLYGON: { // 聚集地
      drawAction: 'polygon', drawOptions: { mode: "click" }, geometryType: 'polygon', graphics: [], symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "solid",
        outline: {  // autocasts as SimpleLineSymbol
          color: "white",
          width: 1
        }
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.FREEPOLYGON.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.FREEPOLYGON.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.FREEPOLYGON.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.FREEPOLYGON.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },
      handleVertices: (vertices: any[]) => {
        if (vertices.length <= 1) return null;

        let newVertices = null;
        if (vertices.length == 2) {
          return newVertices = vertices
        } else {
          const vertices2 = [];
          vertices.forEach((item) => { // 转一次坐标格式，便于计算
            vertices2.push({
              x: item[0],
              y: item[1],
              z: item[2]
            })
          })
          newVertices = [MathStuff.bezierPoly(vertices2)];
          return newVertices
        }
      }
    },
    BEZIERLINE: { // 曲线
      drawAction: 'polyline', drawOptions: { mode: "click" }, geometryType: 'polyline', graphics: [], symbol: {
        type: "simple-line", // autocasts as SimpleLineSymbol
        color: [4, 90, 141],
        width: 3,
        cap: "round",
        join: "round"
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.BEZIERLINE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.BEZIERLINE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.BEZIERLINE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.BEZIERLINE.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },
      handleVertices: (vertices: any[]) => {
        if (vertices.length <= 1) return null;

        const vertices2 = [];
        vertices.forEach((item) => { // 转一次坐标格式，便于计算
          vertices2.push({
            x: item[0],
            y: item[1],
            z: item[2]
          })
        })
        const newVertices = [MathStuff.bezierLine(vertices2)];
        return newVertices
      }
    },
    FREEHANDARROW: { // 单嵌箭头
      drawAction: 'polygon', drawOptions: { mode: "click" }, geometryType: 'polygon', graphics: [], symbol: {
        type: "simple-fill", // autocasts as SimpleFillSymbol
        color: "purple",
        style: "solid",
        outline: {  // autocasts as SimpleLineSymbol
          color: "white",
          width: 1
        }
      },
      on: {
        vertexAdd: (evt) => {
          const vertices = this.plotType.FREEHANDARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        cursorUpdate: (evt) => {
          const vertices = this.plotType.FREEHANDARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        drawComplete: (evt) => {
          const vertices = this.plotType.FREEHANDARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
        vertexRemove: (evt) => {
          const vertices = this.plotType.FREEHANDARROW.handleVertices(evt.vertices)
          this.createGraphicToMap(this.plotType[this.activeType].geometryType, vertices);
        },
      },
      handleVertices: (vertices: any[]) => {
        if (vertices.length <= 1) return null;

        const vertices2 = [];
        vertices.forEach((item) => { // 转一次坐标格式，便于计算
          vertices2.push({
            x: item[0],
            y: item[1],
            z: item[2]
          })
        })
        let newVertices = null;
        if (vertices2.length == 2) {
          const [pnt1, pnt2] = [vertices2[0], vertices2[vertices2.length - 1]];
          newVertices = [MathStuff.arrow2(pnt1, pnt2)];
          return newVertices
        } else if (vertices2.length > 2) {
          newVertices = [MathStuff.arrow3(vertices2)];
          return newVertices
        }
      }
    },
  }

  // 创建Graphic到地图上
  private async createGraphicToMap(geometryType, vertices) {
    // if (!vertices) return;

    // const [Graphic] = await loadModules(["esri/Graphic"]);
    // this.graphicsLayer.graphics.removeMany(this.plotType[this.activeType].graphics);
    // const geometry = this.getGeometry(geometryType, vertices);
    // const graphic = new Graphic({
    //   geometry: geometry,
    //   symbol: this.plotType[this.activeType].symbol
    // });
    // this.graphicsLayer.graphics.add(graphic);
    // this.plotType[this.activeType].graphics = [graphic];
  }

  // 根据点坐标，获取点、线、面的Geometry
  private getGeometry(geometryType, vertices) {
    // let geometry = null;
    // switch (geometryType) {
    //   case 'point':
    //     geometry = {
    //       type: "point", // autocasts as /Point
    //       x: vertices[0],
    //       y: vertices[1],
    //       z: vertices[2],
    //       hasZ: true,
    //       spatialReference: this.view.spatialReference
    //     };
    //     break;
    //   case 'polyline':
    //     geometry = {
    //       type: "polyline", // autocasts as Polyline
    //       paths: vertices,
    //       hasZ: true,
    //       spatialReference: this.view.spatialReference
    //     };
    //     break;
    //   case 'polygon':
    //     geometry = {
    //       type: "polygon", // autocasts as Polygon
    //       rings: vertices,
    //       hasZ: true,
    //       spatialReference: this.view.spatialReference
    //     };
    //     break;
    // }
    // return geometry;
  }


}

