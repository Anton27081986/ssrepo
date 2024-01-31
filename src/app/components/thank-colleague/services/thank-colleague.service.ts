import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {IThanksColleagueItem} from '@app/components/thank-colleague/models/thanks-colleague-item';
import {ApiService} from '@app/shared/services/api/api.service';
import {ICreateThanksColleagueRequest} from '@app/components/thank-colleague/models/create-thanks-colleague-request';
import {catchError} from 'rxjs/operators';
import {IResponse} from '@app/components/address-book/models/response';

@Injectable({
    providedIn: 'root',
})
export class ThankColleagueService {
    // P.S на поток могут подписываться только умные компоненты
    // Создаём поток для спасибо коллегам
    private readonly thanksForColleagues = new BehaviorSubject<IThanksColleagueItem[]>([]);
    public thanksForColleagues$: Observable<IThanksColleagueItem[]> =
        this.thanksForColleagues.asObservable();

    public constructor(private readonly apiService: ApiService) {}

    public loadThanksForColleagues() {
        return this.apiService.getThanksColleagueList().pipe(
            tap(response => this.thanksForColleagues.next(response.items)),
            catchError(this.handleError<IResponse<IThanksColleagueItem>>('загрузка спасибо')),
        );
    }

    // TODO: post запрос должен возвращать модель IThanksColleagueItem
    public addThanksForColleague(createThanksRequest: ICreateThanksColleagueRequest) {
        return this.apiService.addThanksColleague(createThanksRequest).pipe(
            tap(newThanks => this.updateThanksForStream(newThanks)),
            catchError(this.handleError<ICreateThanksColleagueRequest>('добавление спасибо')),
        );
    }

    public deleteThanksForColleague(thanksId: number) {
        return this.apiService.deleteThanksColleague(thanksId).pipe(
            tap(() => this.deleteThanksFromStream(thanksId)),
            catchError(this.handleError('удаление спасибо')),
        );
    }

    // Работа с комментариями, перенести в сервис комментариев
    public addComment(thanksId: number) {
        const thanks = this.thanksForColleagues.getValue();
        const selectedThanks = thanks.find(x => x.id === thanksId);

        if (selectedThanks) {
            // Отправляем запрос в сервис, которые работает с комментариями, подписываемся, отслеживаем количество
            // комментариев и возвращаем число комментариев
            selectedThanks.commentsCount = 0; // for test
            this.thanksForColleagues.next(thanks);
        }
    }

    // Сделать обобощение методов и вынести в отдельный сервис
    private updateThanksForStream(newThanks: IThanksColleagueItem) {
        const existThanks = this.thanksForColleagues.getValue();

        this.thanksForColleagues.next([...existThanks, newThanks]);
    }

    private deleteThanksFromStream(thanksId: number) {
        const thanks = this.thanksForColleagues.getValue().filter(thank => thank.id !== thanksId);

        this.thanksForColleagues.next(thanks);
    }

    private handleError<T>(operation: string, result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${operation} провалена: ${error.message}`);

            return of(result as T);
        };
    }
}
