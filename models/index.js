
const {query} = require('../mysql')
class Sheet {
    constructor(prop){
        this.index= ''
        this.value= []
        this.sheet = prop
    }
    //列表查询
    list() {
        return query(`SELECT * from ${this.sheet};` )
    }
    //按需增加
    insert(args) {
        this.index = '';
        this.value = [];
        for (let key in args) {
            this.index = `${this.index}${key}=?,`
            this.value.push(args[key])
        }
        this.index = this.index.substr(0, this.index.length - 1);
        return query(`INSERT INTO ${this.sheet} SET ${this.index};`, this.value)
    } 
    //按需查询
    select(index, value) {
        return query(`SELECT * from ${this.sheet} where ${index}=${value};` )
    }
     //按需删除
    delete(index, value) {
        return query(`DELETE from ${this.sheet} where ${index}=${value};`)
    }
    //提交修改
    update(index,value, args) { 
        this.index = '';
        this.value = [];
        for (let key in args) {
            this.index = `${this.index}${key}=?,`
            this.value.push(args[key])
        }
        this.value = this.value.substr(0, this.value.length - 1)
        return query(`UPDATE ${this.sheet} SET ${this.index} WHERE ${index}=${value};`,this.value )
    }
}

module.exports = Sheet;