import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
	selector: 'ss-modal',
	templateUrl: 'modal.component.html',
	styleUrls: ['modal.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {
	@Input() public id: string | undefined;
	private readonly element: any;
	public constructor(
		private readonly modalService: ModalService,
		private readonly el: ElementRef,
	) {
		this.element = el.nativeElement;
	}

	public ngOnInit(): void {
		// ensure id attribute exists
		if (!this.id) {
			console.error('modal must have an id');

			return;
		}

		// move element to bottom of page (just before </body>) so it can be displayed above everything else
		document.body.appendChild(this.element); // close modal on background click
		this.element.addEventListener('click', (el: { target: { className: string } }) => {
			if (el.target.className === 'ss-modal') {
				this.close();
			}
		});

		// add self (this modal instance) to the modal service so it's accessible from controllers
		this.modalService.add(this);
	}

	// remove self from modal service when component is destroyed
	public ngOnDestroy(): void {
		if (typeof this.id === 'string') {
			this.modalService.remove(this.id);
		}

		this.element.remove();
	}

	// open modal
	public open(): void {
		this.element.style.display = 'block';
		document.body.classList.add('ss-modal-open');
	}

	// close modal
	public close(): void {
		this.element.style.display = 'none';
		document.body.classList.remove('ss-modal-open');
	}
}
