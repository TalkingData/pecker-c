import { Application } from 'egg'

// import { Application } from 'egg';

export default (app: Application) => {
	// const { controller, router } = app;
	const { controller, router } = app
	const middleware: any = app.middleware
	const roleRequired = middleware.roleRequired()
	// console.log(roleRequired)

	const localStrategy = app['passport'].authenticate('local', {
		successRedirect: '/api/signSuccess',
		failureRedirect: '/api/signFail'
	})
	router.post('/api/login', localStrategy)
	router.get('/api/signSuccess', controller.sign.success) // 进入登录页面
	router.get('/api/signFail', controller.sign.fail)

	router.post('/api/upload/map', controller.sourceMapController.upload)
	app.resources('commit', '/sdk/commit', app.controller.commitController)
	app.resources('errors', '/api/errors', app.controller.errorController)
	app.resources('errorrecords', '/api/errorrecords', app.controller.errorRecordController)
	app.resources(
		'errorrecords',
		'/api/errorrecords/aggregate/time',
		app.controller.errorRecordOccurTimeStatisticController
	)
	app.resources('sourceMap', '/api/operate/map', roleRequired, controller.sourceMapController)

  app.resources('user', '/api/user', controller.user)
	app.resources('project', '/api/project', roleRequired, controller.project)
	router.get('/api/project/view/overview', controller.project.projectOverview)
	app.resources('rolemap', '/api/rolemap', roleRequired, controller.roleMap)
	app.resources('mail', '/api/mail', controller.mailController)

	// 预警规则
	app.resources('warning', '/api/warning/rules', controller.warningRulesController)

	// 登出
	router.all('/api/logout', controller.user.logout)

	app.io.of('/io').route('filter', app.io.controller.home.filter)
}
