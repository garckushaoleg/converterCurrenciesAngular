import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeaderService } from './header.service';
import { ExchangeRates } from './header.models';
import { Params } from '../../core/http.models';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    endpoint: string = 'fetch-multi';
    params: Params = {
        from: 'UAH',
        to: 'USD,EUR'
    };
    exchangeRates: ExchangeRates = {};
    private destroyed$: Subject<void> = new Subject();

    constructor(
        private headerService: HeaderService,
    ) { }

    ngOnInit(): void {
        this.headerService.getCurrentExchangeRate(this.endpoint, this.params)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
            this.exchangeRates = {
                usd: response.results.USD ? (1 / response.results.USD).toFixed(2) : '',
                eur: response?.results?.EUR ? (1 / response?.results?.EUR).toFixed(2) : '',
            }
        })
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
