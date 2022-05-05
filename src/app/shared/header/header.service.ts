import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../core/http.service';
import { Params } from '../../core/http.models';
import { MultiFetchResponse } from './header.models';
import { accessKey } from 'src/app/app.config';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    constructor(
        private http: HttpService,
    ) { }

    getCurrentExchangeRate(endpoint: string, { from, to }: Params): Observable<MultiFetchResponse> {
        return this.http.get(
            `https://api.fastforex.io/${endpoint}?api_key=${accessKey}&from=${from}&to=${to}`
        );
    }
}
