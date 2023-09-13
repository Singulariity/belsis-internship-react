import { Control } from 'ol/control';

export class CustomControl extends Control {
	constructor(
		onClick: () => void,
		inner: string,
		className: string,
		id?: string
	) {
		const button = document.createElement('button');
		button.innerHTML = inner;

		const element = document.createElement('div');
		if (id) {
			element.id = id;
		}
		element.className = className + ' ol-unselectable ol-control';
		element.appendChild(button);

		super({
			element: element,
		});

		button.addEventListener('click', onClick, false);
	}
}
