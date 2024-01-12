import {TestBed} from '@angular/core/testing';

import {SsnabUiService} from './ssnab-ui.service';

describe('SsnabUiService', () => {
    let service: SsnabUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SsnabUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
