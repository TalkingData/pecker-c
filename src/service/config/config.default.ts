import { EggAppInfo } from 'egg'
// import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
	// const config = {} as PowerPartial<EggAppConfig>;
	const config: any = {}

	config.proxy = true

	config.warningTime = 1800000

	// override config from framework / plugin
	// use for cookie sign key, should change to your own and keep security
	// config.keys = appInfo.name + '_1542597647087_1827';
	config.keys = 'hello Kylen'

	config.session = {
		key: 'EGG_SESS_FA',
		maxAge: 24 * 3600 * 1000, // 1 天
		httpOnly: true,
		secure: false,
		encrypt: true
		// domain: 'localhost',
	}

	// add your egg config in here
	config.middleware = ['userRequired', 'errorHandler']
	config.whiteRouter = [
		'/api/login',
		'/api/logout',
		'/api/signFail',
		'/api/signSuccess',
		'/sdk/commit',
		'/public/testio',
		'/api/user'
	]
	// config.middleware = [];
	// config.middleware = ['errorHandler'];

	// upload conf
	config.multipart = {
		mode: 'stream',
		fileExtensions: ['.map'] // 增加对 map 扩展名的文件支持
	}

	config.bodyParser = {
		jsonLimit: '10mb',
		formLimit: '100mb'
	}

	config.security = {
		csrf: {
			enable: false,
			ignoreJSON: true
			// ignore: '/api/*/*',
		},
		domainWhiteList: ['*', 'localhost', 'localhost:8080']
	}

	config.cors = {
		// origin: 'http://localhost:8036',
		origin: ctx => ctx.get('origin'),
		// origin: '*',
		allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
		credentials: true
	}

	config.mongoose = {
		clients: {
			// clientId, access the client instance by app.mongooseDB.get('clientId')
			orginDB: {
				url: 'mongodb://127.0.0.1/femonitor',
				options: {}
			}
		}
	}

	config.passportLocal = {
		usernameField: 'name',
		passwordField: 'password'
	}

	config.site_salt = 'KOGDHPOMWD' // 静态文件存储域名，添加用户时使用

	config.auth_cookie_name = 'fa_monitor' // 前端Cookie字段
	config.auth_cookie_salt = 'AMMKBMGPLD' // 前端Cookie字段值salt

	config.onerror = {
		all(err, ctx) {
			// 在此处定义针对所有响应类型的错误处理方法
			// 注意，定义了 config.all 之后，其他错误处理方法不会再生效
			ctx.body = 'error'
			ctx.status = 500
			console.error(err)
		},
		html(err, ctx) {
			// html hander
			ctx.body = '<h3>error</h3>'
			ctx.status = 500
			console.error(err)
		},
		json(err, ctx) {
			// json hander
			ctx.body = { message: 'error' }
			ctx.status = 500
			console.error(err)
		}
	}

	// add your special config in here
	const bizConfig = {
		sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`
	}

	config.io = {
		init: {}, // passed to engine.io
		namespace: {
			'/io': {
				connectionMiddleware: ['Connection'],
				packetMiddleware: ['Packet']
			}
		}
	}

	// the return config will combines to EggAppConfig
	return {
		...config,
		...bizConfig
	}
}
