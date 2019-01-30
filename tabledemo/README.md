 ### createtable 1.0 


 *  createtable.Js 暴露了 MixiTable 类，支持生成 普通表格 & 第一列为竖向表格头的 特殊表格 
 *  
 *  @param options.tbHead 格式规约
 *          [{
 *              label: '检查情况', 
 *              key: 'title' 
 *          },{
 *              label: '设计建造',    @rules // 表格头内容
 *              key: 'sjjz'          @rules // 表格头对应的表格数据项的key
 *          }]
 *  @param options.tbData 格式规约
 *          [{
 *              'title': '管理制度',                           @rules // 如果需要第一列生成多列竖向表格头，则存在 children 字段 ，title 存放 每一列的内容
 *              'children': [{
 *                  'title' : '探伤装置的领取、归还和登记制度',
 *                  'sjjz' : '12',
 *                  'yxzt' : '123',
 *                  'bz' : '1234'
 *              },{
 *                  'title' : '放射源台帐和定期清点检查制度（明确每枚放射源与探伤装置的对应关系）',
 *                  'sjjz' : '12',
 *                  'yxzt' : '123',
 *                  'bz' : '1234'
 *              }]
 *              
 *          },{
 *              'title': '辐射安全防护设施与运行',               @rules //如果第一列不存在多列竖向表格头 则为正常的单层对象
 *              'sjjz' : '12',
 *              'yxzt' : '123',
 *              'bz' : '1234'
 *          }]
 
 ###近期需要完成的扩展 
    1.生成表格数据的api
    2.生成表格横向竖向二级三级表格头的api
