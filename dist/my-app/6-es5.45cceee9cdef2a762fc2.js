function _classCallCheck(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(n,e){for(var t=0;t<e.length;t++){var i=e[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}function _createClass(n,e,t){return e&&_defineProperties(n.prototype,e),t&&_defineProperties(n,t),n}(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"82nU":function(n,e,t){"use strict";t.r(e),t.d(e,"MainModule",(function(){return P}));var i,o,c,l=t("ofXK"),a=t("PCNd"),s=t("tyNb"),r=t("fXoL"),u=t("yW9e"),d=t("C2AL"),p=t("FwiY"),b=t("Q8cG"),f=function(n){return{width:n}},h=((i=function(){function n(){_classCallCheck(this,n),this.isCollapsed=!1,this.foldEvent=new r.n}return _createClass(n,[{key:"ngOnInit",value:function(){}},{key:"foldClick",value:function(){this.isCollapsed=!this.isCollapsed,this.foldEvent.emit(this.isCollapsed)}}]),n}()).\u0275fac=function(n){return new(n||i)},i.\u0275cmp=r.Nb({type:i,selectors:[["main-header-component"]],outputs:{foldEvent:"foldEvent"},decls:12,vars:4,consts:[[1,"logo",3,"ngStyle"],[1,"btn","fold"],["nz-icon","",1,"trigger",3,"nzType","click"],[1,"menu"],["nz-menu","","nzTheme","dark","nzMode","horizontal"],["nz-menu-item",""]],template:function(n,e){1&n&&(r.Zb(0,"nz-header"),r.Ub(1,"div",0),r.Zb(2,"div",1),r.Zb(3,"i",2),r.hc("click",(function(){return e.foldClick()})),r.Yb(),r.Yb(),r.Zb(4,"div",3),r.Zb(5,"ul",4),r.Zb(6,"li",5),r.Kc(7,"nav 1"),r.Yb(),r.Zb(8,"li",5),r.Kc(9,"nav 2"),r.Yb(),r.Zb(10,"li",5),r.Kc(11,"nav 3"),r.Yb(),r.Yb(),r.Yb(),r.Yb()),2&n&&(r.Db(1),r.sc("ngStyle",r.vc(2,f,e.isCollapsed?"60px":"180px")),r.Db(2),r.sc("nzType",e.isCollapsed?"menu-unfold":"menu-fold"))},directives:[u.b,l.m,d.a,p.a,b.c,b.d],styles:["[_nghost-%COMP%]   .ant-layout-header[_ngcontent-%COMP%]{padding:0 10px}nz-header[_ngcontent-%COMP%]{position:fixed;width:100%}nz-header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{float:left;width:180px;height:31px;background:hsla(0,0%,100%,.2);margin:16px 10px 16px 0;transition:all .2s}nz-header[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{float:left;color:#fff}nz-header[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]   .trigger[_ngcontent-%COMP%]{font-size:18px;line-height:64px;padding:0 24px;cursor:pointer;transition:color .3s}nz-header[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]   .trigger[_ngcontent-%COMP%]:hover{color:#1890ff}nz-header[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]{float:right;color:#fff}nz-header[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]{float:right}nz-header[_ngcontent-%COMP%]   .menu[_ngcontent-%COMP%]   [nz-menu][_ngcontent-%COMP%]{line-height:64px}"]}),i),C=t("ZE2D"),g=((o=function(){function n(){_classCallCheck(this,n),this.isCollapsed=!0}return _createClass(n,[{key:"ngOnInit",value:function(){}}]),n}()).\u0275fac=function(n){return new(n||o)},o.\u0275cmp=r.Nb({type:o,selectors:[["main-sider-component"]],inputs:{isCollapsed:"isCollapsed"},decls:27,vars:3,consts:[["nzCollapsible","",3,"nzCollapsed","nzTrigger","nzCollapsedChange"],[1,"user"],["nzIcon","user"],[1,"user-desc",3,"hidden"],["nz-menu","","nzTheme","dark","nzMode","inline"],["nz-submenu","","nzTitle","User","nzIcon","user"],["nz-menu-item",""],["nz-submenu","","nzTitle","Team","nzIcon","team"],["nz-icon","","nzType","file"]],template:function(n,e){1&n&&(r.Zb(0,"nz-sider",0),r.hc("nzCollapsedChange",(function(n){return e.isCollapsed=n})),r.Zb(1,"div",1),r.Ub(2,"nz-avatar",2),r.Zb(3,"div",3),r.Zb(4,"strong"),r.Kc(5,"Admin"),r.Yb(),r.Zb(6,"div"),r.Kc(7,"1263346056@qq.com"),r.Yb(),r.Yb(),r.Yb(),r.Zb(8,"ul",4),r.Zb(9,"li",5),r.Zb(10,"ul"),r.Zb(11,"li",6),r.Kc(12,"Tom"),r.Yb(),r.Zb(13,"li",6),r.Kc(14,"Bill"),r.Yb(),r.Zb(15,"li",6),r.Kc(16,"Alex"),r.Yb(),r.Yb(),r.Yb(),r.Zb(17,"li",7),r.Zb(18,"ul"),r.Zb(19,"li",6),r.Kc(20,"Team 1"),r.Yb(),r.Zb(21,"li",6),r.Kc(22,"Team 2"),r.Yb(),r.Yb(),r.Yb(),r.Zb(23,"li",6),r.Ub(24,"i",8),r.Zb(25,"span"),r.Kc(26,"File"),r.Yb(),r.Yb(),r.Yb(),r.Yb()),2&n&&(r.sc("nzCollapsed",e.isCollapsed)("nzTrigger",null),r.Db(3),r.sc("hidden",e.isCollapsed))},directives:[u.e,C.a,b.c,d.a,b.f,b.d,p.a],styles:["nz-sider[_ngcontent-%COMP%]{position:fixed;height:calc(100vh - 64px)}nz-sider[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]{color:#fff;background:#000c17;display:flex;align-items:center;padding:20px 4px 20px 16px}nz-sider[_ngcontent-%COMP%]   .user[_ngcontent-%COMP%]   .user-desc[_ngcontent-%COMP%]{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.logo[_ngcontent-%COMP%]{height:32px;background:hsla(0,0%,100%,.2);margin:16px}"]}),o),m=function(n){return{"margin-left":n}},z=((c=function(){function n(){_classCallCheck(this,n),this.isCollapsed=!1,this.marginLeftWidth="200px"}return _createClass(n,[{key:"ngOnInit",value:function(){}},{key:"foldEventBack",value:function(n){this.isCollapsed=n,this.marginLeftWidth=this.isCollapsed?"80px":"200px"}}]),n}()).\u0275fac=function(n){return new(n||c)},c.\u0275cmp=r.Nb({type:c,selectors:[["app-main"]],decls:8,vars:4,consts:[[1,"layout"],[3,"foldEvent"],[1,"content"],[3,"isCollapsed"],[1,"sub-content",3,"ngStyle"]],template:function(n,e){1&n&&(r.Zb(0,"nz-layout",0),r.Zb(1,"main-header-component",1),r.hc("foldEvent",(function(n){return e.foldEventBack(n)})),r.Yb(),r.Zb(2,"nz-content",2),r.Zb(3,"nz-layout"),r.Ub(4,"main-sider-component",3),r.Zb(5,"nz-layout",4),r.Zb(6,"nz-content"),r.Ub(7,"router-outlet"),r.Yb(),r.Yb(),r.Yb(),r.Yb(),r.Yb()),2&n&&(r.Db(4),r.sc("isCollapsed",e.isCollapsed),r.Db(1),r.sc("ngStyle",r.vc(2,m,e.marginLeftWidth)))},directives:[u.c,h,u.a,g,l.m,s.i],styles:[".layout[_ngcontent-%COMP%]{min-height:100vh}.content[_ngcontent-%COMP%]{margin-top:64px}.sub-content[_ngcontent-%COMP%]{margin-left:200px;transition:all .2s;height:calc(100vh - 64px)}"]}),c),v=t("JA5x"),_=function(){return["/main/project/test"]};function y(n,e){1&n&&(r.Zb(0,"a",2),r.Kc(1,"\u67e5\u770b"),r.Yb()),2&n&&r.sc("routerLink",r.uc(1,_))}var M,Y,Z,x=[{path:"",component:z,children:[{path:"",redirectTo:"list",pathMatch:"full"},{path:"list",component:(M=function(){function n(){_classCallCheck(this,n)}return _createClass(n,[{key:"ngOnInit",value:function(){}}]),n}(),M.\u0275fac=function(n){return new(n||M)},M.\u0275cmp=r.Nb({type:M,selectors:[["content-menu-list"]],decls:9,vars:1,consts:[["nzTitle","Card title",2,"width","300px",3,"nzExtra"],["extraTemplate",""],["routerLinkActive","active",3,"routerLink"]],template:function(n,e){if(1&n&&(r.Zb(0,"nz-card",0),r.Zb(1,"p"),r.Kc(2,"Card content"),r.Yb(),r.Zb(3,"p"),r.Kc(4,"Card content"),r.Yb(),r.Zb(5,"p"),r.Kc(6,"Card content"),r.Yb(),r.Yb(),r.Ic(7,y,2,2,"ng-template",null,1,r.Jc)),2&n){var t=r.Ac(8);r.sc("nzExtra",t)}},directives:[v.a,s.g,s.f],styles:[""]}),M)},{path:"project",loadChildren:function(){return t.e(5).then(t.bind(null,"3dWs")).then((function(n){return n.MainContentModule}))},data:{},canLoad:[]}]}],O=((Z=function n(){_classCallCheck(this,n)}).\u0275mod=r.Rb({type:Z}),Z.\u0275inj=r.Qb({factory:function(n){return new(n||Z)},imports:[[s.h.forChild(x)],s.h]}),Z),P=((Y=function n(){_classCallCheck(this,n)}).\u0275mod=r.Rb({type:Y}),Y.\u0275inj=r.Qb({factory:function(n){return new(n||Y)},imports:[[l.c,a.a,O]]}),Y)}}]);