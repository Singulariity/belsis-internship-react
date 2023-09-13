import BaseLayer from 'ol/layer/Base';

export class LayerData {
	private name: string;
	private layer: BaseLayer;

	public constructor(name: string, layer: BaseLayer) {
		this.name = name;
		this.layer = layer;
	}

	public getName() {
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public getLayer() {
		return this.layer;
	}
}
