"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.EVENT=exports.COMMAND=void 0;var _regenerator=require("babel-runtime/regenerator"),_regenerator2=_interopRequireDefault(_regenerator),_extends2=require("babel-runtime/helpers/extends"),_extends3=_interopRequireDefault(_extends2),_asyncToGenerator2=require("babel-runtime/helpers/asyncToGenerator"),_asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2),_getPrototypeOf=require("babel-runtime/core-js/object/get-prototype-of"),_getPrototypeOf2=_interopRequireDefault(_getPrototypeOf),_classCallCheck2=require("babel-runtime/helpers/classCallCheck"),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_possibleConstructorReturn2=require("babel-runtime/helpers/possibleConstructorReturn"),_possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2),_inherits2=require("babel-runtime/helpers/inherits"),_inherits3=_interopRequireDefault(_inherits2),_symbol=require("babel-runtime/core-js/symbol"),_symbol2=_interopRequireDefault(_symbol),_commandHandler=require("./commandHandler"),_commandHandler2=_interopRequireDefault(_commandHandler),COMMAND=exports.COMMAND=(0,_symbol2.default)("reference to command class"),EVENT=exports.EVENT=(0,_symbol2.default)("reference to event class"),EventGeneratingCommandHandler=function(e){function r(e,t){var n=this;(0,_classCallCheck3.default)(this,r);var o=(0,_possibleConstructorReturn3.default)(this,(r.__proto__||(0,_getPrototypeOf2.default)(r)).call(this,e));return o.execute=function(){var e=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function e(r,t){return _regenerator2.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new o[EVENT]((0,_extends3.default)({aggregateId:t.id,sequenceNumber:t.version+1},r)));case 1:case"end":return e.stop()}},e,n)}));return function(r,t){return e.apply(this,arguments)}}(),o[EVENT]=t,o}return(0,_inherits3.default)(r,e),r}(_commandHandler2.default);exports.default=EventGeneratingCommandHandler;
//# sourceMappingURL=maps/eventGeneratingCommandHandler.js.map