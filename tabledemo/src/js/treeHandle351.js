;(function (global, factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.CanvasAnno = factory());
})(this, function(){

    /**
    * recursiveTreeForChilds
    * 递归给最下级childs添加leaf属性
    * @param { Array } nodeList 总的节点数组
    * @param { Default Array } newArray 默认数组，用于返回，无需传值
    * @return {  } 无返回值
    */
    function recursiveTreeForChilds(nodeList, newArray = []){
        if( !Array.isArray(nodeList) ) return;
        nodeList.forEach( item => {
            if( !Array.isArray(item.childs) || item.childs.length === 0) {
                return item.leaf = true;
            }
            recursiveTreeForChilds(item.childs, newArray)
        })
    }

    /**
    * getParentNodes
    * 递归给最下级childs添加leaf属性
    * @param { Array } nodeList 总的节点数组
    * @param { Object } node 选中的节点
    * @param { Default Object } obj 默认对象，用于存放最大父级到当前节点的字符串，无需传值
    * @param { Default Array } right 默认数组，用于返回，无需传值
    * @return { Array } [{idpath, labelPath}] 返回从最大父级到目前节点所需属性的字符串拼接， 以 __ 隔开
    */
    function getParentNodes(nodeList, node, obj = {idpath: '',labelPath: ''}, right = []){
        if( !Array.isArray(nodeList) || nodeList === 0 ) return;
        for(let v of nodeList){
            var objpath = {
                idpath: obj.idpath + ('__' + v.id),
                labelPath: obj.labelPath + ('__' + v.name)
            }
            if( v.id === node.id ) {
                right.push(objpath);
                return right
            }
            if( Array.isArray(v.childs) && v.childs.length > 0 ){
                getParentNodes( v.childs, node, objpath, right )
            }
        }
        return right
    }

    /**
    * sumForNodeValue
    * 递归给节点进行求和
    * @param { Array } nodeList 总的节点数组
    * @param { Object } node 选中的节点
    * @param { Default Array } value 默认数组，用于返回，无需传值
    * @return { Array } [Number] 返回存放和的数组
    */
    function sumForNodeValue(nodeList, node, value = []){
        if( !Array.isArray(nodeList) || nodeList === 0 ) return;
        for(let v of nodeList){
            if( v.id === node.id ) {
                let sumArr = recursiveForSum(v),
                    Exp = sumArr.length == 1 ? sumArr[0] : sumArr.join('+');
                return value.push(eval( Exp )) 
            };
            if( Array.isArray(v.childs) && v.childs.length > 0 ){
                sumForNodeValue( v.childs, node, value )
            }
        }
        return value
    }
    /**
    * recursiveForSum
    * 递归给节点进行求和
    * @param { Object } node 要求和的节点
    * @param { Default Array } Arr 默认数组，用于返回，无需传值
    * @return { Array } [Number] 返回存放和的数组
    */
    function recursiveForSum(node, Arr = []){
        if( !Array.isArray(node.childs) || node.childs.length === 0 ) return [node.v];
        for(let v of node.childs){
            console.log(v)
            if( !Array.isArray(v.childs) || v.childs.length === 0 ){
                Arr.push( v.v )
            }
            if( Array.isArray(v.childs) && v.childs.length > 0 ){
                recursiveForSum( v, Arr )
            }
        }
        return Arr
    }
    /**
    * recursiveTreePush
    * 递归寻找对应的节点，给节点添加data子集
    * @param { Array } data 添加的内容
    * @param { Object } node 对应节点
    * @param { Array } nodeList 总的树数据的数组
    */
    function recursiveTreePush(data, node, nodeList) {
        if( !Array.isArray(nodeList) ) return;
        nodeList.forEach( item => {
            if(item.id == node.id) {
                return item.childs = data
            } else {
                recursiveTreePush(data, node, item.childs)
            }
        })
    }

    /**
    * recursiveTreePush
    * 递归寻找对应的节点，给节点添加data子集
    * @param { } data 添加的内容
    * @param { } node 对应节点
    * @param { Array } nodeList 总的树数据的数组
    */
    function recursiveGetChildNode(node, nodeList) {
        
    }
    return {
        recursiveTreeForChilds, // 递归生成树，给树最底层树叶添加 leaf = true
        getParentNodes, // 递归获取某个子节点的所有父节点
        sumForNodeValue, // 递归给某个子节点求和
        recursiveForSum, // 递归求和 
        recursiveTreePush //递归给某个节点添加 请求来的子节点，使数据完整
    }
});