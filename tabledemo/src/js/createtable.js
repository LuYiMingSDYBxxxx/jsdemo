/**
 * 构造函数 MixiTable 
 * @param { Object } options 符合规范 的表格数据参数
 * @param { String } options.el Table Element 挂载的dom元素
 * @param { Array } options.tbData 表格数据
 * @param { Array } options.tbHead 表格 head 数据
 */
;(function (global, factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.MixiTable = factory());
})(this, function(){
    'use strict' //严格模式启用

    /**
     * 处理表格样式的主函数
     * @param {*} style 
     */
    function style_fun(style){ //

    }

    
    /**
     * 创建表格类 CreateTable
     * @param { Array } thd 表格头 数据
     * @param { Array } tbd 表格体数据
     * @return { Element } 返回生成完成的table元素
     */
    function CreateTable(thd, tbd){
        this.$thd = thd;
        this.$tbd = tbd;
        this.cols = this.getColNumber( this.$tbd );
        this.$tbRules = this.tableDataRules( tbd );
        //表格元素
        this.createEle()
        //表格头 thead > tr + td
        this.tableHeadTag.appendChild(this.tableHeadContent())
        //表格体 tbody > tr + td
        var _this = this;
        _this.tableBodyContent( _this.$tbRules ).forEach( function(itemTrTag) {
            _this.tableBodyTag.appendChild(itemTrTag)
        })
        //表格生成完成
        return this.tableTag
    }
    /**
     * 表格类 CreateTable
     * 创建表格元素
     */
    CreateTable.prototype.createEle = function(){
        this.tableTag = document.createElement('table'),
        this.tableHeadTag = document.createElement('thead'),
        this.tableBodyTag = document.createElement('tbody'),
        this.tableFootTag = document.createElement('tfoot');
        this.addClass(this.tableTag,'el_lym_tbwrap')
        this.addClass(this.tableHeadTag,'el_lym_tbhead')
        this.addClass(this.tableBodyTag,'el_lym_tbbody')
        this.addClass(this.tableFootTag,'el_lym_tbfoot')
        this.tableTag.appendChild(this.tableHeadTag);
        this.tableTag.appendChild(this.tableBodyTag);
        this.tableTag.appendChild(this.tableFootTag);
    }
    /**
     * 表格类 CreateTable
     * 给元素添加class类名
     * @param { arguments } 不定参 第一个参数为要添加class的element,后续参数为类名
     */
    CreateTable.prototype.addClass = function(){
        var dom = arguments[0];
        dom.className = dom.className.split(' ').concat( Array.prototype.slice.call(arguments, 1) ).join(' ')
    }
    /**
     * 表格类 CreateTable
     * 生成表格 thead 中的元素
     * @return { Element } 返回创建好的 th 下的内容 tr 标签 
     */
    CreateTable.prototype.tableHeadContent = function(){
        var tdList, _this = this, cols;
        tdList = this.$thd.map( function( ite, ind ) {
            if( ind === 0 ){
                return _this.createTdTag( ite.label, [ite.key, 'el_lym_td'], _this.cols)
            }
            return _this.createTdTag( ite.label, [ite.key, 'el_lym_td'])
        })
        return _this.createTrTag(tdList, ['el_lym_tr'])

    }
    /**
     * 表格类 CreateTable
     * 根据表格数据判断 children 的层数
     * @param { Array } data 需要判断的数据
     * @param { Number Default } num 每一层child的计数
     * @param { Array Default } childMath 所有child计数的集合
     * @return { Number } 返回计数中最大层
     */
    CreateTable.prototype.getColNumber = function(data, num, childMath){
        num = num || 1;
        childMath = childMath || [];
        childMath.push(num)
        var _this = this;
        data.map( function(item) {
            if( item.children && item.children.constructor == Array ){
                _this.getColNumber(item.children, num + 1, childMath)
            }
        })
        return Math.max.apply(null, childMath)
    }
    /**
     * 表格类 CreateTable
     * 根据表格数据判断 children 数据需要的行数
     * @param { Array } data 需要判断的数据
     * @param { Array Default } childMath 所有child计数的集合,每多一行则 在数组中增加一项
     * @return { Number } 返回计数的总和
     */
    CreateTable.prototype.getRowNumber = function(data, childMath){
        childMath = childMath || [];
        var _this = this;
        data.map( function(item) {
            if( item.children && item.children.constructor == Array ){
                _this.getRowNumber(item.children, childMath)
            }else{
                childMath.push(1)
            }
        })
        return childMath.length
    }
    /**
     * 表格类 CreateTable
     * 结合 @tableDataBodyByRules @tableDataBodyByRules 规范
     * 生成 新的表格数据
     * @return { Object } 新的表格数据
     */
    CreateTable.prototype.tableDataRules = function(){
        var rowData, titleRowData
        rowData = this.tableDataBodyByRules( this.$tbd )
        titleRowData = this.tableDataTitleByRules( this.$tbd )
        return { 
            rowData : rowData,
            titleRowData : titleRowData 
        }
    }
    /**
     * 表格类 CreateTable
     * 递归最深处 获得所有当前行的列标题
     * @param { Array } data 总数据
     * @param { Array Default } ary 用于存放每次递归出来的项
     * @param { Array Default } parent 当前列的所属父级列
     * @param { Number Default } colnum 剩余的列数
     * @return { Array } 所有的行数据
     */
    CreateTable.prototype.tableDataTitleByRules = function( data, ary, parent, colnum ){
        ary = ary || [];
        var _this = this, obj, colnums, rownums;
        data.map( function(item) {
            obj = {};
            if( item.children && item.children.constructor == Array ){
                colnums = _this.getColNumber( item.children );
                rownums = _this.getRowNumber( item.children );
                obj['title'] = item['title']
                obj['rowspan'] = rownums;
                obj['colspan'] = !colnum ? _this.cols - colnums : colnum - colnums;
                obj['parent'] = !parent ? '' : parent
                ary.push( obj )
                _this.tableDataTitleByRules(item.children, ary, item['title'], colnums)
            }
            if( !item.children || item.children.constructor != Array ){
                obj['title'] = item['title'];
                obj['rowspan'] = 1;
                obj['colspan'] = colnum ||  _this.cols;
                obj['parent'] = !parent ? '' : parent
                ary.push( obj )
            }
        })
        return ary
    }
    /**
     * 表格类 CreateTable
     * 递归最深处 获得本行数据
     * @param { Array } data 总数据
     * @param { Array Default } ary 用于存放每次递归出来的项
     * @return { Array } 单行的数据数组
     */
    CreateTable.prototype.tableDataBodyByRules = function( data, ary ){
        ary = ary || [];
        var _this = this;
        data.map( function(item) {
            if( item.children && item.children.constructor == Array ){
                _this.tableDataBodyByRules(item.children, ary)
            }else{
                item.children ? (item.children.parent = item.title || '') : (item.parent = item.title || '');
                ary.push( item.children || item )
            }
        })
        return ary
        
    }
    /**
     * 表格类 CreateTable
     * 生成 表格 col 的 td 元素
     * @param { Array } titRulData 数据
     * @param { String } tbheadArrFirst key
     * @return { Array } 返回的是根据 titRulData 生成的 td 的数组
     */
    CreateTable.prototype.tableTitBodyContent = function(titRulData, tbheadArrFirst){
        var _this = this;
        return titRulData.map( function(titItem, titIndex) {
            return { tag : _this.createTdTag(titItem[tbheadArrFirst], ['el_lym_td'],titItem.colspan , titItem.rowspan), mnode:titItem[tbheadArrFirst], parent: titItem['parent'] }
        })
    }
    /**
     * 表格类 CreateTable
     * 生成 表格 主体 td 元素
     * @param { Array } tdRulData 数据
     * @param { Array } tbheadArr keys
     * @return { Array } 返回的是根据 tdRulData 生成的 td 的二维数组, 数组第一层是行, 第二层是列 
     */
    CreateTable.prototype.tableLsBodyContent = function(tdRulData, tbheadArr){
        var _this = this;
        return tdRulData.map( function(item, index){
            return tbheadArr.map( function(tbhItem, tbhInd){
                return {tag: _this.createTdTag( item[tbhItem], [tbhItem, 'el_lym_td']),  parent: item['parent']}
            } )
        })
    }
    /**
     * 表格类 CreateTable
     * 将 col 的 td 元素合并到 主体 td 元素中;
     * 合并策略 递归
     * @return { Array } 返回 td 的二维数组, 数组第一层是行, 第二层是列 
     */
    CreateTable.prototype.pushTitToBodyData = function(tdNowEleArr, tdTitEleArr){
        var _this = this;
        return tdNowEleArr.map( function(item) {
            var obj = tdTitEleArr.find( function(titItem){ return titItem.mnode === item[0].parent} )
            
            if( obj && !obj.pushTime){
                item.unshift( obj )
                obj.pushTime = true;
                _this.pushTitToBodyData(tdNowEleArr, tdTitEleArr)
            }
            return item
        })
    }
    /**
     * 表格类 CreateTable
     * 生成表格 tbody 中的元素
     * @return { Array } 生成的 tr 标签数组
     */
    CreateTable.prototype.tableBodyContent = function(){
        var _this = this,
            tdRulData = this.$tbRules.rowData,
            titRulData = this.$tbRules.titleRowData,
            
            tbheadArr = _this.$thd.map( function (ite){ return ite.key } ),
            tbheadArrFirst = tbheadArr.shift(),

            tdNowEleArr = _this.tableLsBodyContent(tdRulData, tbheadArr),
            tdTitEleArr = _this.tableTitBodyContent(titRulData, tbheadArrFirst);

            return _this.pushTitToBodyData(tdNowEleArr, tdTitEleArr).map( function( item ){
               return _this.createTrTag(item.map(function(itemTd){ return itemTd.tag}), ['el_lym_tr'])
            } )
    }
    /**
     * 表格类 CreateTable
     * 生成td标签
     * @param { String } html 标签td中的内容,可以为html的字符串
     * @param { Array } classList 需要给td添加的class数组 es5 不支持rest参数，否则可以使用 ...rest
     * @param { Number } colspan td 要合并的列数
     * @param { Number } rowspan td 要合并的行数
     * @return { Element } 返回创建好的 td 标签
     */
    CreateTable.prototype.createTdTag = function(html, classList, colspan, rowspan ){
        var tag = document.createElement( 'td' );
        this.addClass(tag, classList.join(' '))
        if( colspan ) tag.colSpan = colspan;
        if( rowspan ) tag.rowSpan = rowspan;
        tag.innerHTML = html
        return tag
    }
    /**
     * 表格类 CreateTable
     * 生成tr标签
     * @param { Array } tdList 标签tr中的内容,只能是 td数组
     * @param { Array } classList 需要给tr添加的class数组 es5 不支持rest参数，否则可以使用 ...rest
     * @return { Element } 返回创建好的 tr 标签
     */
    CreateTable.prototype.createTrTag = function(tdList, classList){
        var tag = document.createElement( 'tr' );
        this.addClass(tag, classList.join(' '))
        tdList.forEach( function(item) {
            tag.appendChild(item)
        })
        return tag
    }


    /**
     * MixiTable 对外暴露 生成表格的接口
     * 
     * @param { Object } options 
     */
    function MixiTable(options){
        this.$el = options.el || 'body';
        this.$tbData = options.tbData || {};
        this.$tbHead = options.tbHead || [];
        this.$tableDom = new CreateTable( this.$tbHead, this.$tbData ) //创建表单元素

        this.initTable(this.$el, this.$tableDom)
    }
    MixiTable.prototype = {
        initTable : function(){
            var elTag = document.querySelector(this.$el) || document.querySelector('body')
            console.log(elTag, this.$tableDom)
            elTag.appendChild(this.$tableDom)
        }
    }

    return MixiTable
});
