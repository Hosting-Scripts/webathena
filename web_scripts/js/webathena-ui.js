/*
 WinChan is Copyright (c) 2012 Lloyd Hilaiel
 https://github.com/lloyd/winchan */
'use strict';var WinChan=function(){function d(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}function e(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}function b(){try{var a=navigator.userAgent;return-1!=a.indexOf("Fennec/")||-1!=a.indexOf("Firefox/")&&-1!=a.indexOf("Android")}catch(b){}return!1}function g(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);
return b?b[1]:a}function c(){for(var a=window.location,b=window.opener.frames,a=a.protocol+"//"+a.host,c=b.length-1;0<=c;c--)try{if(0===b[c].location.href.indexOf(a)&&b[c].name===f)return b[c]}catch(h){}}var f="__winchan_relay_frame",a="die",h=function(){var a=-1;"Microsoft Internet Explorer"===navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(a=parseFloat(RegExp.$1));return 8<=a}();return window.JSON&&window.JSON.stringify&&window.JSON.parse&&window.postMessage?{open:function(c,
k){function n(){l&&document.body.removeChild(l);l=void 0;if(r)try{r.close()}catch(c){p.postMessage(a,t)}r=p=void 0}function s(a){try{var c=JSON.parse(a.data);"ready"===c.a?p.postMessage(u,t):"error"===c.a?k&&(k(c.d),k=null):"response"===c.a&&(e(window,"message",s),e(window,"unload",n),n(),k&&(k(null,c.d),k=null))}catch(b){}}if(!k)throw"missing required callback argument";var q;c.url||(q="missing required 'url' parameter");c.relay_url||(q="missing required 'relay_url' parameter");q&&setTimeout(function(){k(q)},
0);c.window_name||(c.window_name=null);if(!c.window_features||b())c.window_features=void 0;var l,t=g(c.url);if(t!==g(c.relay_url))return setTimeout(function(){k("invalid arguments: origin of url and relay_url must match")},0);var p;h&&(l=document.createElement("iframe"),l.setAttribute("src",c.relay_url),l.style.display="none",l.setAttribute("name",f),document.body.appendChild(l),p=l.contentWindow);var r=window.open(c.url,c.window_name,c.window_features);p||(p=r);var u=JSON.stringify({a:"request",
d:c.params});d(window,"unload",n);d(window,"message",s);return{close:n,focus:function(){if(r)try{r.focus()}catch(a){}}}},onOpen:function(b){function f(a){a=JSON.stringify(a);h?l.doPost(a,q):l.postMessage(a,q)}function g(a){var c;try{c=JSON.parse(a.data)}catch(h){}c&&"request"===c.a&&(e(window,"message",g),q=a.origin,b&&setTimeout(function(){b(q,c.d,function(a){b=void 0;f({a:"response",d:a})})},0))}function s(c){if(c.data===a)try{window.close()}catch(b){}}var q="*",l=h?c():window.opener;if(!l)throw"can't find relay frame";
d(h?l:window,"message",g);d(h?l:window,"message",s);try{f({a:"ready"})}catch(t){d(l,"load",function(a){f({a:"ready"})})}var p=function(){try{e(h?l:window,"message",s)}catch(a){}b&&f({a:"error",d:"client closed window"});b=void 0;try{window.close()}catch(c){}};d(window,"unload",p);return{detach:function(){e(window,"unload",p)}}}}:{open:function(a,c,b,f){setTimeout(function(){f("unsupported browser")},0)},onOpen:function(a){setTimeout(function(){a("unsupported browser")},0)}}}();/*
 Copyright (c) 2013 David Benjamin and Alan Huang
 Use of this source code is governed by an MIT-style license that
 can be found at
 https://github.com/davidben/webathena
*/
var Err=function(d,e,b){this.ctx=d;this.code=e;this.msg=b};Err.Context={};Err.Context.KEY=2;Err.Context.NET=3;Err.Context.UNK=15;
var Crypto={randomNonce:function(){var d=sjcl.random.randomWords(1)[0];0>d&&(d+=2147483648);return d},retryForEntropy:function(d){var e=Q.defer(),b=function(){sjcl.random.removeEventListener("seeded",b);try{e.resolve(d())}catch(g){g instanceof sjcl.exception.notReady?sjcl.random.addEventListener("seeded",b):e.reject(g)}};b();return e.promise}},KDC=function(){function d(c){for(var b=0;b<c.length;b++)if(c[b].padataType==krb.PA_ETYPE_INFO2)return c=krb.ETYPE_INFO2.decodeDER(c[b].padataValue),void 0!==
c.salt&&(c.salt=arrayutils.fromUTF16(c.salt)),c;for(b=0;b<c.length;b++)if(c[b].padataType==krb.PA_ETYPE_INFO)return krb.ETYPE_INFO.decodeDER(c[b].padataValue);for(b=0;b<c.length;b++)if(c[b].padataType==krb.PA_PW_SALT)return[{salt:c[b].padataValue}];return[]}function e(b,f,a){f="salt"in b?b.salt:arrayutils.fromUTF16(f.realm+f.principalName.nameString.join(""));return krb.Key.fromPassword(b.etype,a,f,b.s2kparams)}var b={urlBase:"/kdc/v1/",Error:function(b,f){this.code=b;this.message=f}};b.Error.prototype.toString=
function(){return"KDC Error "+this.code+": "+this.message};b.NetworkError=function(b){this.message=b};b.NetworkError.prototype.toString=function(){return this.message};b.xhrRequest=function(c,f){var a=Q.defer(),h=new XMLHttpRequest;h.open("POST",b.urlBase+f);h.onreadystatechange=function(c){4==this.readyState&&(200==this.status?a.resolve(this.responseText):this.status?a.reject(new b.NetworkError("HTTP error "+this.status+": "+this.statusText)):a.reject(new b.NetworkError("Network error")))};h.setRequestHeader("X-WebKDC-Request",
"OK");c?(h.setRequestHeader("Content-Type","text/plain"),h.send(arrayutils.toBase64(c))):h.send();return a.promise};b.kdcProxyRequest=function(c,f,a){return b.xhrRequest(c,f).then(function(c){c=JSON.parse(c);switch(c.status){case "ERROR":throw new b.NetworkError(c.msg);case "TIMEOUT":throw new b.NetworkError("KDC connection timed out");case "OK":return c=arrayutils.fromBase64(c.reply),a.decodeDER(c)[1]}})};b.asReq=function(c,f){return Crypto.retryForEntropy(function(){var a={};a.pvno=krb.pvno;a.msgType=
krb.KRB_MT_AS_REQ;void 0!==f&&(a.padata=f);a.reqBody={};a.reqBody.kdcOptions=krb.KDCOptions.make(krb.KDCOptions.forwardable,krb.KDCOptions.proxiable,krb.KDCOptions.renewable_ok);if(c.realm!=krb.realm)throw"Cross-realm not supported!";a.reqBody.principalName=c.principalName;a.reqBody.realm=krb.realm;a.reqBody.sname={};a.reqBody.sname.nameType=krb.KRB_NT_SRV_INST;a.reqBody.sname.nameString=["krbtgt",krb.realm];a.reqBody.till=new Date(0);a.reqBody.nonce=Crypto.randomNonce();a.reqBody.etype=krb.supportedEnctypes;
return b.kdcProxyRequest(krb.AS_REQ.encodeDER(a),"AS_REQ",krb.AS_REP_OR_ERROR).then(function(b){return{asReq:a,asRep:b}})})};var g={};g[krb.PA_ENC_TIMESTAMP]=function(b,f,a,h,g,k){b=d(a);f=null;for(a=0;a<b.length;a++)if(b[a].etype in kcrypto.encProfiles){f=b[a];break}if(null===f)throw new Err(Err.Context.KEY,3,"No supported enctypes");var n=e(f,g,k);return Crypto.retryForEntropy(function(){var a={};a.patimestamp=new Date;a.pausec=1E3*a.patimestamp.getUTCMilliseconds();a.patimestamp.setUTCMilliseconds(0);
a=n.encryptAs(krb.ENC_TS_ENC,krb.KU_AS_REQ_PA_ENC_TIMESTAMP,a);return{padataType:krb.PA_ENC_TIMESTAMP,padataValue:krb.ENC_TIMESTAMP.encodeDER(a)}})};b.getTGTSession=function(c,f){return b.asReq(c).then(function(a){var d=a.asReq,e=a.asRep;if(e.msgType==krb.KRB_MT_ERROR&&e.errorCode==krb.KDC_ERR_PREAUTH_REQUIRED)for(var k=krb.METHOD_DATA.decodeDER(e.eData),n=0;n<k.length;n++)if(k[n].padataType in g)return g[k[n].padataType](d,e,k,k[n],c,f).then(function(a){return b.asReq(c,[a])});return a}).then(function(a){var g=
a.asReq;a=a.asRep;if(a.msgType==krb.KRB_MT_ERROR)throw new b.Error(a.errorCode,a.eText);var m={};if(a.padata){var k=d(a.padata);if(k){if(1!=k.length)throw"Bad pre-auth hint";m=k[0];if("etype"in m&&m.etype!=a.encPart.etype)throw"Bad pre-auth hint";}}m.etype=a.encPart.etype;m=e(m,c,f);return b.sessionFromKDCRep(m,krb.KU_AS_REQ_ENC_PART,g,a)})};b.sessionFromKDCRep=function(b,e,a,d){if(a.reqBody.principalName){if(d.crealm!=a.reqBody.realm)throw new Err(Err.Context.KEY,16,"crealm does not match");if(!krb.principalNamesEqual(a.reqBody.principalName,
d.cname))throw new Err(Err.Context.KEY,17,"cname does not match");}b=b.decryptAs(krb.EncASorTGSRepPart,e,d.encPart)[1];if(a.reqBody.nonce!=b.nonce)throw new Err(Err.Context.KEY,18,"nonce does not match");if(!krb.principalNamesEqual(a.reqBody.sname,b.sname))throw new Err(Err.Context.KEY,19,"sname does not match");return new krb.Session(d,b)};b.getServiceSession=function(c,d){return Crypto.retryForEntropy(function(){var a={};a.pvno=krb.pvno;a.msgType=krb.KRB_MT_TGS_REQ;a.reqBody={};a.reqBody.kdcOptions=
krb.KDCOptions.make();a.reqBody.sname=d.principalName;a.reqBody.realm=d.realm;a.reqBody.till=new Date(0);a.reqBody.nonce=Crypto.randomNonce();a.reqBody.etype=krb.supportedEnctypes;var e=c.key.checksum(krb.KU_TGS_REQ_PA_TGS_REQ_CKSUM,krb.KDC_REQ_BODY.encodeDER(a.reqBody)),e=c.makeAPReq(krb.KU_TGS_REQ_PA_TGS_REQ,e).apReq;a.padata=[{padataType:krb.PA_TGS_REQ,padataValue:krb.AP_REQ.encodeDER(e)}];return b.kdcProxyRequest(krb.TGS_REQ.encodeDER(a),"TGS_REQ",krb.TGS_REP_OR_ERROR).then(function(d){if(d.msgType==
krb.KRB_MT_ERROR)throw new b.Error(d.errorCode,d.eText);return b.sessionFromKDCRep(c.key,krb.KU_TGS_REQ_ENC_PART,a,d)})})};return b}();function registerTicketAPI(){WinChan.onOpen(function(d,e,b){function g(){b({status:"DENIED",code:"NOT_ALLOWED"})}if(!e.realm||!e.principal)b({status:"ERROR",code:"BAD_REQUEST"});else if("https://"!=d.substring(0,8)&&"http://localhost:"!=d.substring(0,17))g();else{var c=new krb.Principal({nameType:krb.KRB_NT_UNKNOWN,nameString:e.principal},e.realm);getTGTSession().then(function(e){var a=e[0];e=e[1];var h=$("#request-ticket-template").children().clone();h.appendTo(document.body);e&&h.fadeIn();h.find(".client-principal").text(a.client.toString());
h.find(".foreign-origin").text(d);h.find(".service-principal").text(c.toString());h.find(".request-ticket-deny").click(g);h.find(".request-ticket-allow").click(function(d){localStorage.getItem("tgtSession")?a.isExpired()?(log("Ticket expired"),g()):KDC.getServiceSession(a,c).then(function(a){b({status:"OK",session:a.toDict()})},function(a){log(a);g()}).done():(log("No ticket"),g())})}).done()}})};sjcl.random.startCollectors();KDC.xhrRequest(null,"urandom").then(function(d){d=arrayutils.fromBase64(d);d=new Uint32Array(d.buffer,d.byteOffset,d.byteLength/4);for(var e=[],b=0;b<d.length;b++)e.push(d[b]);sjcl.random.addEntropy(e,32*e.length,"server")}).done();
function showLoginPrompt(){var d=Q.defer(),e=$("#login-template").children().clone();e.appendTo(document.body);e.find(".username").focus();e.submit(function(b){b.preventDefault();$("#alert").slideUp(100);var g=$(this).find(".username")[0];b=$(this).find(".password")[0];var c=g.value,g=b.value,f=!1;c?$(this).find(".username + .error").fadeOut():($(this).find(".username + .error").fadeIn(),f=!0);g?$(this).find(".password + .error").fadeOut():($(this).find(".password + .error").fadeIn(),f=!0);if(!f){b.value=
"";var a=$(this).find(".submit"),h=a.text();a.attr("disabled","disabled").text(".");var m=setInterval(function(){a.text((a.text()+".").replace(".....","."))},500),k=function(){clearInterval(m);a.attr("disabled",null).text(h)};b=krb.Principal.fromString(c);KDC.getTGTSession(b,g).then(function(a){k();e.fadeOut(function(){$(this).remove()});d.resolve(a)},function(a){a=a instanceof kcrypto.DecryptionError?"Incorrect password!":a instanceof KDC.Error?a.code==krb.KDC_ERR_C_PRINCIPAL_UNKNOWN?"User does not exist!":
a.code==krb.KDC_ERR_PREAUTH_FAILED||a.code==krb.KRB_AP_ERR_BAD_INTEGRITY?"Incorrect password!":a.message:String(a);$("#alert-title").text("Error logging in:");$("#alert-text").text(a);$("#alert").slideDown(100);k()}).done()}});return d.promise}
function showRenewPrompt(d){var e=Q.defer(),b=$("#renew-template").children().clone();b.find(".client-principal").text(d.client.toString());b.find(".logout-link").click(function(d){d.preventDefault();b.remove();e.resolve(showLoginPrompt())});b.appendTo(document.body);b.find(".password").focus();b.submit(function(g){g.preventDefault();$("#alert").slideUp(100);g=$(this).find(".password")[0];var c=g.value;if(c){$(this).find(".password + .error").fadeOut();g.value="";var f=$(this).find(".submit"),a=f.text();
f.attr("disabled","disabled").text(".");var h=setInterval(function(){f.text((f.text()+".").replace(".....","."))},500),m=function(){clearInterval(h);f.attr("disabled",null).text(a)};KDC.getTGTSession(d.client,c).then(function(a){m();b.fadeOut(function(){$(this).remove()});e.resolve(a)},function(a){a=a instanceof kcrypto.DecryptionError?"Incorrect password!":a instanceof KDC.Error?a.code==krb.KDC_ERR_C_PRINCIPAL_UNKNOWN?"User does not exist!":a.code==krb.KDC_ERR_PREAUTH_FAILED||a.code==krb.KRB_AP_ERR_BAD_INTEGRITY?
"Incorrect password!":a.message:a instanceof KDC.NetworkError?a.message:String(a);$("#alert-title").text("Error logging in:");$("#alert-text").text(a);$("#alert").slideDown(100);m()}).done()}else $(this).find(".password + .error").fadeIn()});return e.promise}
function getTGTSession(){"1"!==localStorage.getItem("version")&&(localStorage.clear(),localStorage.setItem("version","1"));var d=localStorage.getItem("tgtSession");return d?(d=krb.Session.fromDict(JSON.parse(d)),d.isExpired()?showRenewPrompt(d).then(function(d){localStorage.setItem("tgtSession",JSON.stringify(d.toDict()));return[d,!0]}):Q.resolve([d,!1])):showLoginPrompt().then(function(d){localStorage.setItem("tgtSession",JSON.stringify(d.toDict()));return[d,!0]})}
$(function(){function d(){getTGTSession().then(function(e){var b=e[0];e=e[1];log(b);var g=$("#authed-template").children().clone();g.appendTo(document.body);e&&g.fadeIn();g.find(".client-principal").text(b.client.toString());g.find("button.logout").click(function(){localStorage.removeItem("tgtSession");g.remove();d()})}).done()}$('<img src="eye-small.png">').css({left:78,top:12}).appendTo("#logo");$('<img src="eye-large.png">').css({left:87,top:16}).appendTo("#logo");$('<img src="eye-large.png">').css({left:105,
top:16}).appendTo("#logo");$('<img src="eye-small.png">').css({left:121,top:12}).appendTo("#logo");$(document).mousemove(function(d){$("#logo img").each(function(){var b=d.pageX-$(this).offset().left-$(this).width()/2,g=d.pageY-$(this).offset().top-$(this).height()/2,b="rotate("+Math.atan2(b,-g)+"rad)";$(this).css({transform:b,"-moz-transform":b,"-webkit-transform":b,"-ms-transform":b,"-o-transform":b})})});$("#whatis a").click(function(){$("#info").slideToggle(0).css("height",$("#info").height()).slideToggle(0).slideToggle();
return!1});"#!request_ticket_v1"==location.hash?registerTicketAPI():d()});
//@ sourceMappingURL=webathena-ui.js.map
