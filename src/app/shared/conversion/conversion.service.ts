import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../core/http.service';
import { Params } from '../../core/http.models';
import { ConversionsResponse } from './conversion.models';
import { accessKey } from 'src/app/app.config';

@Injectable({
    providedIn: 'root'
})
export class ConversionService {
    constructor(
        private http: HttpService,
    ) { }

    convert(endpoint: string, { from, to, amount }: Params): Observable<ConversionsResponse> {
        return this.http.get(
            `https://api.fastforex.io/${endpoint}?from=${from}&to=${to}&amount=${amount}&api_key=${accessKey}`
        );
    }
}
