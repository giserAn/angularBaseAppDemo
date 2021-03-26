import { Component, OnInit } from '@angular/core';
import { EsriMapService } from 'src/app/shared/components/esri-map/esri-map.service';
import { loadModules } from 'esri-loader';
import { PlotDraw } from 'src/app/shared/custom-draw/plot-draw';

@Component({
  selector: 'map-draw-tool',
  templateUrl: './draw-tool.component.html',
  styleUrls: ['./draw-tool.component.less']
})
export class DrawToolComponent implements OnInit {

  constructor(private esrimapServie: EsriMapService) { }

  ngOnInit() {
  }

  activeType: any;
  drawtool: PlotDraw = null;
  plotDrawGraphicsLayer: any;
  plotDrawGraphicsLayerId = 'plot-draw-graphicsLayer-id';

  async draw(type) {
    const view = await this.esrimapServie.getView();
    const [GraphicsLayer] = await loadModules([
      'esri/layers/GraphicsLayer',
    ]);

    if (!this.plotDrawGraphicsLayer) {
      this.plotDrawGraphicsLayer = new GraphicsLayer({
        id: this.plotDrawGraphicsLayerId,
        title: '自定义绘制图层',
        spatialReference: view.spatialReference,
        elevationInfo: {
          // mode: "absolute-height" // default value
          // mode: 'relative-to-scene',
          mode:'on-the-ground'
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

}
