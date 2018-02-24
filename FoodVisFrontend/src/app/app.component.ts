import {Component, NgZone, ElementRef, OnDestroy, OnInit} from '@angular/core';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from "d3-ng2-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private blocks: any[] = [];

  constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnDestroy(){
    if (this.d3Svg.empty && !this.d3Svg.empty()) {
      this.d3Svg.selectAll('*').remove();
    }
  }

  ngOnInit() {
    let d3 = this.d3;
    let svg: Selection<any, any, any, any>;

    if (this.parentNativeElement !== null) {

      svg = d3.select(this.parentNativeElement).select("svg"); // <-- use the D3 select method

      this.blocks.push(this.drawRectangle(svg, 75, 100, 10, 10, "Text"));

      this.blocks.push(this.drawRectangle(svg, 75, 100, 500, 10, "Text"));

      let pos1 = this.getPositionRect(this.blocks[0]);
      let pos2 = this.getPositionRect(this.blocks[1]);

      this.drawLine(svg, pos1.x+75, pos1.y+50, pos2.x, pos2.y+50, 20);

    }
  }

  drawRectangle = (parent: Selection<any, any, any, any>, width, height, x, y, text) => {
    let rect = parent.append("rect").attr("x", x).attr("y", y).attr("width", width).attr("height", height);
    parent.append("text").text(text).attr("x", function(d) {return x+(this.getComputedTextLength()/2);}).attr("y", function(d){return y+(height/2)+6}).attr("fill", "white").style("width", width).style("font-size", 25);
    return rect;
  };

  drawLine = (parent, x1, y1, x2, y2, stroke) => {
    parent.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke-width", stroke).attr("stroke", "red");
  };

  getPositionRect = (rect: Selection): {x:number, y:number} => {
    console.log(rect);
    return {"x":rect._groups[0][0].x.baseVal.value, "y": rect._groups[0][0].y.baseVal.value}
  }

}
