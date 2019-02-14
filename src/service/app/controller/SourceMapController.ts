import { Controller } from 'egg';
import sendToWormhole from 'stream-wormhole';
import ResponseBody from '../interface/response.body';
/**
 * write folder
 * 写入到工程上一级目录
 */
const fs = require('fs');
const path = require('path');
const basePath = path.join(__dirname, '../../../uploads/sourceMap');

// const basePath = 'uploads/sourceMap';

export default class SourceMapController extends Controller {
  /**
   * 创建目录
   * fs.access(folder, (err) => {
   *   console.log(err ? '目录/文件不存在' : '文件存在,可以进行读写');
   *   if (err) {
   *     fs.mkdir(folder, (err) => { if (err) console.log(err) })
   *   }
   * });
   * @param base 
   * @param folders 
   */
  createFolders(base, folders) {
    let folder = `${base}/${folders.folderName}`;
    try {
      fs.accessSync(folder, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.mkdirSync(folder)
    }
    if (folders.child) {
      this.createFolders(folder, folders.child)
    }
  }

  /**
   * 写入文件流
   * @param file 
   * @param stream 
   */
  async writeStream(file: string, stream: any) {
    // 创建/覆盖文件
    fs.writeFileSync(file, '', 'utf8');
    // 写入流
    const writeStream = fs.createWriteStream(file);
    try {
      // 写入文件
      stream.pipe(writeStream);
    } catch (err) {
      // 将上传的文件流消费掉
      // await sendToWormhole(stream);
      throw err;
    }

  }
  /**
   * upload api
   * 批量上传
   * Post
   */
  async upload() {
    const ctx = this.ctx;
    const res: ResponseBody = {
      status: 200
    }
    // 校验appkey和version
    // let msg = this.ctx.service.
    if (!ctx.query.appkey) {
      res.status = 412;
      res.errorMessage = 'params error!';
      return ctx.body = res;
    }
    // 查询是否上传过map
    let mapList = await this.ctx.service.sourceMapService.queryMap(ctx.query.appkey);
    if (mapList && mapList.length === 0) {
      // 递归创建写入目录
      try {
        // this.createFolders(basePath, { folderName: ctx.query.appkey, child: { folderName: ctx.query.version } })
        this.createFolders(basePath, { folderName: ctx.query.appkey })

      } catch (err) {
        res.status = 400;
        res.errorMessage = err.message;
        return ctx.body = res;
      }
    }

    const parts = ctx.multipart(),
      writePath = `${basePath}/${ctx.query.appkey}`;
    // writePath = `${basePath}/${ctx.query.appkey}/${ctx.query.version}`;
    // console.log('====================================');
    // console.log('write path:', writePath);
    // console.log('====================================');
    let part;
    // parts() 返回 promise 对象
    while ((part = await parts()) != null) {
      if (part.length) {
        // 这是 busboy 的字段
        // console.log('field: ' + part[0]);
        // console.log('value: ' + part[1]);
        // console.log('valueTruncated: ' + part[2]);
        // console.log('fieldnameTruncated: ' + part[3]);
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        // part 是上传的文件流
        // console.log('field: ' + part.fieldname);
        // console.log('filename: ' + part.filename);
        // console.log('encoding: ' + part.encoding);
        // console.log('mime: ' + part.mime);
        // 校验格式
        if (!/[.](map)$/.test(part.filename)) {
          await sendToWormhole(part);
          continue;
        }
        // 文件处理，存储
        // @ts-ignore
        let result, sameMap, filePath = `${writePath}/${part.filename}`;
        try {
          // 校验是否已经上传
          if (mapList.some((item) => {
            if (item.fileName === part.filename) {
              sameMap = item
              return true
            } else {
              return false
            }
          })) {
            // 更新上传时间
            result = await this.ctx.service.sourceMapService.updateMapById(sameMap._id, { fileName: part.filename, updateAt: Date.now() });
          } else {
            let _map = {
              appkey: ctx.query.appkey,
              // version: ctx.query.version,
              fileName: part.filename,
              filePath: filePath
            }
            result = await this.ctx.service.sourceMapService.insertMap(_map);
          }
          await this.writeStream(filePath, part)
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          res.status = 400;
          res.errorMessage = err.message;
          return ctx.body = res;
        }
        // console.log(result);
      }
    }
    // 查询上传列表
    res.result = await this.ctx.service.sourceMapService.queryMap(ctx.query.appkey);
    ctx.body = res
  }

  /**
   * 查询列表
   * Get
   */
  async index() {
    const { ctx } = this;
    const res: ResponseBody = {
      status: 200
    }
    // 校验appkey和version
    if (!ctx.query.appkey) {
      res.status = 412;
      res.errorMessage = 'params error!';
      return ctx.body = res;
    }
    res.result = await this.ctx.service.sourceMapService.queryMap(ctx.query.appkey);
    ctx.body = res;
  }

  /**
   * 删除原始文件
   * @param ids 
   */
  async delMapFiles(ids: Array<string>) {
    for (let i = 0; i < ids.length; i++) {
      const map = await this.ctx.service.sourceMapService.queryMapById(ids[i]);
      if (!map) throw new Error('No map found!');
      const posPath = `${basePath}/${map.appkey}`;
      fs.unlinkSync(`${posPath}/${map.fileName}`);

    }
  }

  /**
   * 批量删除
   * Delete
   */
  async destroy() {
    const { ctx } = this;
    const res: ResponseBody = {
      status: 200
    }
    const ids = ctx.params.id.split(',');
    try {
      await this.delMapFiles(ids);
      res.result = await this.ctx.service.sourceMapService.deleteMapByIds(ids);
    } catch (error) {
      res.status = 400;
      res.errorMessage = error.message;
      return ctx.body = res;
    }
    ctx.body = res;
  }

}
