'use strict'
import ResponseBody from '../interface/response.body'

export default () => {
	return async function(ctx, next) {
		try {
			await next()
		} catch (err) {
      // console.log(err)
      ctx.logger.error('errorHandler', err);
			const status = err.status || 500
			const res: ResponseBody = {
				status,
				errorMessage: err.errors
			}
			ctx.status = status
			ctx.body = res
		}
	}
}
