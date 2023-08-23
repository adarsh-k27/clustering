export class Overlay extends window.google.maps.OverlayView {
  // container: HTMLElement
  // pane: keyof google.maps.MapPanes
  // position: google.maps.LatLng | google.maps.LatLngLiteral

  constructor(container, pane, position) {
    super();
    this.container = container;
    this.pane = pane;
    this.position = position;
    this.clickable= false;
  }

  onAdd() {
    const pane = this.getPanes()?.[this.pane];
    pane?.appendChild(this.container);
  }

  draw() {
    const projection = this.getProjection();
    const point = projection.fromLatLngToDivPixel(this.position);

    if (point === null) {
      return;
    }

    this.container.style.transform = `translate(${point.x}px, ${point.y}px)`;
  }

  onRemove() {
    if (this.container.parentNode !== null) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
