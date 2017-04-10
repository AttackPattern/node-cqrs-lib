"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.COMMAND=void 0;var _regenerator=require("babel-runtime/regenerator"),_regenerator2=_interopRequireDefault(_regenerator),_asyncToGenerator2=require("babel-runtime/helpers/asyncToGenerator"),_asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2),_classCallCheck2=require("babel-runtime/helpers/classCallCheck"),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_symbol=require("babel-runtime/core-js/symbol"),_symbol2=_interopRequireDefault(_symbol),COMMAND=exports.COMMAND=(0,_symbol2.default)("reference to command class"),AggregateCommandHandler=function e(r){var t=this;(0,_classCallCheck3.default)(this,e),this.handle=function(){var e=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function e(r,a){var n,u;return _regenerator2.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=new t[COMMAND](r),e.next=3,n.validate();case 3:return a.validate(n),e.next=6,t.execute(n,a);case 6:if(e.t0=e.sent,e.t0){e.next=9;break}e.t0=[];case 9:return u=e.t0,Array.isArray(u)||(u=[u]),e.abrupt("return",a.applyEvents(u));case 12:case"end":return e.stop()}},e,t)}));return function(r,t){return e.apply(this,arguments)}}(),this.execute=function(){var e=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function e(r,a){return _regenerator2.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,t)}));return function(r,t){return e.apply(this,arguments)}}(),this[COMMAND]=r};exports.default=AggregateCommandHandler;
//# sourceMappingURL=maps/aggregateCommandHandler.js.map