import { HttpParams } from '@angular/common/http';

/**
 * Preparation of query parameters.
 *
 * @param req
 */
export const prepareRequestParams = (req?: any): HttpParams => {
  let params: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).map((key) => {
      if (req[key] === null || req[key].toString().length < 1) {
        return;
      }
      params = params.set(key, req[key]);
    });
  }
  return params;
};
