import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConversionsForm, Currencies, Option, ResultOfConversionsResponse } from './conversion.models';
import { ConversionService } from './conversion.service';
import { Params } from 'src/app/core/http.models';

@Component({
    selector: 'app-conversion',
    templateUrl: './conversion.component.html',
    styleUrls: ['./conversion.component.css']
})
export class ConversionComponent implements OnDestroy {
    currencies: Option[] = [
        {value: 'UAH', selected: false, direction: ''},
        {value: 'USD', selected: false, direction: ''},
        {value: 'EUR', selected: false, direction: ''},
    ];

    form: FormGroup = this.fb.group({
        from: this.fb.group({
            currency: [''],
            value: ['', [ Validators.min(0.01) ]],
        }),
        to: this.fb.group({
            currency: [''],
            value: ['', [ Validators.min(0.01) ]],
        })
    });
    endpoint: string = 'convert';
    isPreloaderShowed: boolean = false;

    private destroyed$: Subject<void> = new Subject();

    constructor(
        private fb: FormBuilder,
        private conversionService: ConversionService,
    ) { }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    onInput(direction: string): void {
        this.activateValidation(direction);
        
        if (this.isControlEmpty(direction)) {
            this.setEmptyOfOppositeControl(direction);
            this.enableControls(direction);
            return;
        }

        if (!this.isPositiveNumber(direction)) {
            this.disableControls(direction);
            return;
        }

        this.enableControls(direction);
        this.getConvertedValue(direction);
    }

    onSelectionChange(direction: string, $event: MatSelectChange): void {
        this.setRelevantStateOfOptions(direction, $event);
        this.getConvertedValue(direction);
    }

    disableControls(direction: string): void {
        this.form?.get(direction)?.get('currency')?.disable();
        const oppositeDirection = this.getOppositeDirection(direction);
        this.form?.get(oppositeDirection)?.get('value')?.disable();
        this.form?.get(oppositeDirection)?.get('currency')?.disable();
    }

    enableControls(direction: string): void {
        this.form?.get(direction)?.get('currency')?.enable();
        const oppositeDirection = this.getOppositeDirection(direction);
        this.form?.get(oppositeDirection)?.get('value')?.enable();
        this.form?.get(oppositeDirection)?.get('currency')?.enable();
    }

    getOppositeDirection(direction: string): string {
        return direction === 'from' ? 'to' : 'from';
    }

    setRelevantStateOfOptions(direction: string, $event: MatSelectChange): void {
        this.currencies.forEach(currency => {
            if (currency.value === $event.value) {
                currency.selected = true;
                currency.direction = direction;
            }

            if (currency.value !== $event.value && currency.direction === direction) {
                currency.selected = false;
            }
        });
    }

    setEmptyOfOppositeControl(direction: string): void {
        const oppositeDirection = this.getOppositeDirection(direction);
        this.form?.get(oppositeDirection)?.get('value')?.setValue(null);
    }

    getParams(from: string, to: string, amount: string): Params {
        return {
            from: from,
            to: to,
            amount: amount,
        }
    }

    getParamsDependedOnDirection(direction: string): Params | null {
        const rawValue = this.form.getRawValue();
        const startValues = rawValue[direction];
        const finishValues = direction === 'from' ? rawValue.to : rawValue.from;

        if (!this.areSelectedCurrencies(startValues, finishValues)) return null;

        if (!!startValues.value) {
            return this.getParams(startValues.currency, finishValues.currency, startValues.value);
        }

        if (!!finishValues.value) {
            return this.getParams(finishValues.currency, startValues.currency, finishValues.value);
        }

        return null;
    }

    areSelectedCurrencies(startValues: Currencies, finishValues: Currencies): boolean {
        return !!startValues.currency && !!finishValues.currency;
    }

    getConvertedValue(direction: string): void {
        const params = this.getParamsDependedOnDirection(direction);
        if (!params) return;
        this.isPreloaderShowed = true;

        this.conversionService.convert(this.endpoint, params)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
            const result: ResultOfConversionsResponse = response.result;
            const keysFromResponse = Object.keys(result);
            const rawValue: ConversionsForm = this.form.getRawValue();
            this.setConvertedValueInControl(keysFromResponse, rawValue, result);
            this.isPreloaderShowed = false;
        });
    }

    setConvertedValueInControl(
        keysFromResponse: string[], 
        rawValue: ConversionsForm, 
        result: ResultOfConversionsResponse
    ): void {
        keysFromResponse.forEach(keyFromResponse => {
            for (const key in rawValue) {
                if (rawValue.hasOwnProperty(key) && 
                    rawValue[key as keyof ConversionsForm]?.currency === keyFromResponse) {
                    this.form?.get(key)?.get('value')?.setValue(result[keyFromResponse as keyof ResultOfConversionsResponse]);
                    this.activateValidation(key);
                }
            }
        })
    }

    activateValidation(key: string): void {
        this.form?.get(key)?.get('value')?.markAsTouched();
        this.form?.get(key)?.get('value')?.markAsDirty();
    }

    getStyleForOption(selected: boolean): string {
        return selected ? 'display: none;' : '';
    }

    isControlEmpty(direction: string): boolean {
        return typeof this.form?.get(direction)?.get('value')?.value === 'object';
    }

    isPositiveNumber(direction: string): boolean {
        return this.form?.get(direction)?.get('value')?.value > 0;
    }

    isNumbersError(direction: string): boolean | undefined {
        return this.form?.get(direction)?.get('value')?.hasError('min');
    }
}
