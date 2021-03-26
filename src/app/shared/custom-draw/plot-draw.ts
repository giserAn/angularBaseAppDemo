import { loadModules } from 'esri-loader';
import { MathStuff } from './MathStuff.js';

export class PlotDraw {
    private view: any; // 视图
    private graphicsLayer: any; // 图层
    private draw: any; // Draw类实例
    private sketchVM: any; // 编辑模型
    private activeType: any; // 当前激活工具类型 
    private enableEdit: boolean; // 是否允许编辑

    constructor(options) {
        this.view = options.view;
        this.graphicsLayer = options.graphicsLayer;
        this.enableEdit = options.enableEdit || true;
        this.graphicsLayer.removeAll();

    }

    // 工具字典（字母大小写转换必须对应）
    public plot = {
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


    /**
     * 激活绘制工具
     * @param type  plotType
     */
    public async drawActivate(type: string, symbol?: any) {
        const [Draw, SketchViewModel] = await loadModules(['esri/views/draw/Draw', 'esri/widgets/Sketch/SketchViewModel']);
        try {
            const upType = type.toUpperCase();
            if (!this.plotType[upType]) { return };

            this.draw && this.draw.activeAction && this.drawReset(); // 每次绘制，如果draw处于激活中...,则重置

            this.activeType = upType; // 当前激活工具类型
            symbol && (this.plotType[this.activeType].symbol = symbol); // 自定义symbol

            // 初始化绘制工具实例
            !this.draw && (this.draw = new Draw({ view: this.view }));
            !this.sketchVM && (this.sketchVM = new SketchViewModel({
                layer: this.graphicsLayer,
                view: this.view,
                updateOnGraphicClick: this.enableEdit,//是否使用默认的点击选择图形进行更新
                defaultUpdateOptions: {
                    toggleToolOnClick: true // 是否开启reshape状态
                },
                defaultCreateOptions: {
                    hasZ: true, // 控制创建的几何图形是否具有z值。
                    // defaultZ: 0 // 新创建的几何图形的默认z值。当hasZ为false或图层的高程模式设置为绝对高度时，将被忽略。
                }
            }));

            // 激活绘制工具，并监听
            const action = this.draw.create(this.plotType[this.activeType].drawAction, this.plotType[this.activeType].drawOptions);
            this.view.cursor = 'crosshair';

            // fires when a vertex is added
            action.on("vertex-add", (evt) => {
                this.plotType[this.activeType].on.vertexAdd(evt);
            });

            // fires when the pointer moves
            action.on("cursor-update", (evt) => {
                this.plotType[this.activeType].on.cursorUpdate(evt);
            });

            // fires when the drawing is completed
            action.on("draw-complete", (evt) => {
                console.log(evt)
                this.plotType[this.activeType].on.drawComplete(evt);
                this.view.cursor = 'default';
                this.draw.reset(); // 重置action
            });

            // fires when a vertex is removed
            action.on("vertex-remove", (evt) => {
                this.plotType[this.activeType].on.vertexRemove(evt);
            });

        } catch (error) {
            console.log('error', error)
        }

    }

    /**
     * 清除全部（清除全部图形，并重置绘制工具）
     */
    public drawRemoveAll() {
        if (this.graphicsLayer) {
            for (const key in this.plotType) {
                this.graphicsLayer.removeMany(this.plotType[key].graphics)
            }
        }
        this.drawReset();
    }

    /**
    * 重做（清除当前图形，依旧激活当前绘制）
    */
    public drawRedo() {
        if (!this.plotType[this.activeType]) return;
        this.graphicsLayer && this.graphicsLayer.removeMany(this.plotType[this.activeType].graphics)
        this.drawActivate(this.activeType, this.plotType[this.activeType].symbol)
        return this.activeType.toLowerCase();
    }

    /**
    * 删除（删除选中图形）
    */
    public drawDelete() {
        if (!this.sketchVM) return;
        this.graphicsLayer && this.graphicsLayer.removeMany(this.sketchVM.updateGraphics)
    }


    /**
     * 绘制工具重置
     */
    private drawReset() {
        if (!this.plotType[this.activeType]) return;
        this.view.cursor = "default";
        this.graphicsLayer && this.graphicsLayer.removeMany(this.plotType[this.activeType].graphics)
        this.draw && this.draw.reset();
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
            drawAction: 'polyline', drawOptions: { mode: "click" ,hasZ: true }, geometryType: 'polyline', graphics: [], symbol: {
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
        if (!vertices) return;

        const [Graphic] = await loadModules(["esri/Graphic"]);
        this.graphicsLayer.graphics.removeMany(this.plotType[this.activeType].graphics);
        const geometry = this.getGeometry(geometryType, vertices);
        const graphic = new Graphic({
            geometry: geometry,
            symbol: this.plotType[this.activeType].symbol
        });
        this.graphicsLayer.graphics.add(graphic);
        this.plotType[this.activeType].graphics = [graphic];
    }

    // 根据点坐标，获取点、线、面的Geometry
    private getGeometry(geometryType, vertices) {
        let geometry = null;
        switch (geometryType) {
            case 'point':
                geometry = {
                    type: "point", // autocasts as /Point
                    x: vertices[0],
                    y: vertices[1],
                    z: vertices[2],
                    hasZ: true,
                    spatialReference: this.view.spatialReference
                };
                break;
            case 'polyline':
                geometry = {
                    type: "polyline", // autocasts as Polyline
                    paths: vertices,
                    hasZ: true,
                    spatialReference: this.view.spatialReference
                };
                break;
            case 'polygon':
                geometry = {
                    type: "polygon", // autocasts as Polygon
                    rings: vertices,
                    hasZ: true,
                    spatialReference: this.view.spatialReference
                };
                break;
        }
        return geometry;
    }

}
