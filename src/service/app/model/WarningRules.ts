/**
 * 预警规则
 */
import { Connection } from 'mongoose'
import { Typegoose, prop, pre } from 'typegoose'
// import { Project } from "./Project";

@pre<WarningRules>('save', function(next) {
	if (this.isNew) {
		this.createAt = this.updateAt = Date.now()
	} else {
		this.updateAt = Date.now()
	}

	next()
})
export class WarningRules extends Typegoose {
	@prop()
	appkey: string
	@prop({ default: Date.now() })
	createAt: number
	@prop({ default: Date.now() })
	updateAt: number
	@prop({ default: 1800000 })
	interval: number // 间隔
	@prop()
	errorsCount: number // 错误数量
	// @prop({ ref: Project, required: true })
	// project: Ref<Project>;
}

export default app => {
	const conn: Connection = app.mongooseDB.get('orginDB')
	return new WarningRules().getModelForClass(WarningRules, {
		existingConnection: conn,
		schemaOptions: { collection: 'warning_rules' }
	})
}
