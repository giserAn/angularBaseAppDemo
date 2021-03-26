import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponseBase, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private modalService: NzModalService
    ) { }

    // (1)基本数据
    isShowModal = false;

    /**(2)拦截 http 请求 */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newReq = req.clone();
        return next.handle(newReq).pipe(
            mergeMap((event: any) => event instanceof HttpResponseBase ? this.handleResponse(event) : of(event)),
            catchError((err: HttpErrorResponse) => this.handleResponse(err))
        );
    }

    /**(3)处理 http 响应 */
    handleResponse(event) {
        this.checkStatus(event);
        const errorStatus = [403, 404, 500];
        if (errorStatus.includes(event.status)) {
            return throwError(event);
        }
        if (event instanceof HttpErrorResponse) {
            console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起', event);
            return throwError(event);
        }
        if (event.status === 200) { // 业务逻辑判断
            if (event instanceof HttpResponse) {
                const body: any = event.body;
                if (body.code && body.code !== '20000') {
                    return throwError(event);
                }
            }
        }
        return of(event);
    }

    /**(4)检测 http 状态码 */
    checkStatus(event: HttpResponseBase) {
        if (event.status >= 200 && event.status < 300) return;
        if (event.status === 401) { // 无权限
            if (!this.isShowModal) {
                this.isShowModal = true;
                this.modalService.closeAll();
                this.modalService.info({
                    nzTitle: '登录提示',
                    nzContent: '未登录或登录已过期，请重新登录！',
                    nzOnOk: () => {
                        this.isShowModal = false;
                        this.injector.get(Router).navigate(['/login']);
                    }
                });
            }
        }
        const statusMsg = {
            400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
            401: '用户没有权限（令牌、用户名、密码错误）。',
            403: '用户得到授权，但是访问是被禁止的。',
            404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
            406: '请求的格式不可得。',
            410: '请求的资源被永久删除，且不会再得到的。',
            422: '当创建一个对象时，发生一个验证错误。',
            500: '服务器发生错误，请检查服务器。',
            502: '网关错误。',
            503: '服务不可用，服务器暂时过载或维护。',
            504: '网关超时。',
        };
        const msg = statusMsg[event.status] || event.statusText;
        this.injector.get(NzNotificationService).error(`请求错误 ${event.status}: ${event.url}`, msg);
    }

}
