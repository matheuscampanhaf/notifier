"use strict"
var logger = require('@dojot/dojot-module-logger').logger;


class FilterManager {

    constructor(){
        //arg1: arg that came on notification
        //arg2: arg on the filter
        this.operationsMap = {
            ">": (arg1, arg2) => {
                logger.debug("> operation", {fileName: "FilterManager"});
                return arg1 > arg2 ? 1 : 0;
            },
            "<": (arg1, arg2) => {
                logger.debug("< operation", {fileName: "FilterManager"});
                return arg1 < arg2 ? 1 : 0;
            },
            "=": (arg1, arg2) => {
                logger.debug("= operation", {fileName: "FilterManager"});
                return arg1 == arg2 ? 1 : 0;
            },
            "!=": (arg1,arg2) => {
                logger.debug("!= operation", {fileName: "FilterManager"});
                return arg1 != arg2 ? 1 : 0;
            }
        }
    }

    applyOperation(operation, arg1, arg2){
        logger.debug("Gonna apply operation", {fileName: "FilterManager"});
        return this.operationsMap[operation](arg1,arg2);
    }

}

module.exports = { FilterManager }