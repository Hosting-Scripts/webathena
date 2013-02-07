/*
 WinChan is Copyright (c) 2012 Lloyd Hilaiel
 https://github.com/lloyd/winchan */
'use strict';var WinChan=function(){function e(a,b,f){a.attachEvent?a.attachEvent("on"+b,f):a.addEventListener&&a.addEventListener(b,f,!1)}function d(a,b,f){a.detachEvent?a.detachEvent("on"+b,f):a.removeEventListener&&a.removeEventListener(b,f,!1)}function b(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}var g="die",f,c=-1;"Microsoft Internet Explorer"===navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&
(c=parseFloat(RegExp.$1));f=8<=c;return window.JSON&&window.JSON.stringify&&window.JSON.parse&&window.postMessage?{open:function(a,c){function h(){k&&document.body.removeChild(k);k=void 0;if(q)try{q.close()}catch(a){l.postMessage(g,s)}q=l=void 0}function j(a){try{var b=JSON.parse(a.data);"ready"===b.a?l.postMessage(t,s):"error"===b.a?c&&(c(b.d),c=null):"response"===b.a&&(d(window,"message",j),d(window,"unload",h),h(),c&&(c(null,b.d),c=null))}catch(f){}}if(!c)throw"missing required callback argument";
var m;a.url||(m="missing required 'url' parameter");a.relay_url||(m="missing required 'relay_url' parameter");m&&setTimeout(function(){c(m)},0);a.window_name||(a.window_name=null);var n;if(!(n=!a.window_features))a:{try{var p=navigator.userAgent;n=-1!=p.indexOf("Fennec/")||-1!=p.indexOf("Firefox/")&&-1!=p.indexOf("Android");break a}catch(r){}n=!1}n&&(a.window_features=void 0);var k,s=b(a.url);if(s!==b(a.relay_url))return setTimeout(function(){c("invalid arguments: origin of url and relay_url must match")},
0);var l;f&&(k=document.createElement("iframe"),k.setAttribute("src",a.relay_url),k.style.display="none",k.setAttribute("name","__winchan_relay_frame"),document.body.appendChild(k),l=k.contentWindow);var q=window.open(a.url,a.window_name,a.window_features);l||(l=q);var t=JSON.stringify({a:"request",d:a.params});e(window,"unload",h);e(window,"message",j);return{close:h,focus:function(){if(q)try{q.focus()}catch(a){}}}},onOpen:function(a){function b(a){a=JSON.stringify(a);f?l.doPost(a,m):l.postMessage(a,
m)}function c(f){var j;try{j=JSON.parse(f.data)}catch(e){}j&&"request"===j.a&&(d(window,"message",c),m=f.origin,a&&setTimeout(function(){a(m,j.d,function(f){a=void 0;b({a:"response",d:f})})},0))}function j(a){if(a.data===g)try{window.close()}catch(b){}}var m="*",n;if(f)a:{for(var p=window.location,r=window.opener.frames,p=p.protocol+"//"+p.host,k=r.length-1;0<=k;k--)try{if(0===r[k].location.href.indexOf(p)&&"__winchan_relay_frame"===r[k].name){n=r[k];break a}}catch(s){}n=void 0}else n=window.opener;
var l=n;if(!l)throw"can't find relay frame";e(f?l:window,"message",c);e(f?l:window,"message",j);try{b({a:"ready"})}catch(q){e(l,"load",function(){b({a:"ready"})})}var t=function(){try{d(f?l:window,"message",j)}catch(c){}a&&b({a:"error",d:"client closed window"});a=void 0;try{window.close()}catch(h){}};e(window,"unload",t);return{detach:function(){d(window,"unload",t)}}}}:{open:function(a,b,f,c){setTimeout(function(){c("unsupported browser")},0)},onOpen:function(a){setTimeout(function(){a("unsupported browser")},
0)}}}();/*
 Copyright (c) 2013 David Benjamin and Alan Huang
 Use of this source code is governed by an MIT-style license that
 can be found at
 https://github.com/davidben/webathena
*/
var Err=function(e,d,b){this.ctx=e;this.code=d;this.msg=b};Err.Context={};Err.Context.KEY=2;Err.Context.NET=3;Err.Context.UNK=15;
var Crypto={randomNonce:function(){var e=sjcl.random.randomWords(1)[0];0>e&&(e+=2147483648);return e},retryForEntropy:function(e){var d=Q.defer(),b=function(){sjcl.random.removeEventListener("seeded",b);try{d.resolve(e())}catch(g){g instanceof sjcl.exception.notReady?(alert("Not enough entropy! Please jiggle the mouse a bunch."),sjcl.random.addEventListener("seeded",b)):d.reject(g)}};b();return d.promise}},KDC=function(){function e(b){for(var c=0;c<b.length;c++)if(b[c].padataType==krb.PA_ETYPE_INFO2)return b=
krb.ETYPE_INFO2.decodeDER(b[c].padataValue),void 0!==b.salt&&(b.salt=arrayutils.fromUTF16(b.salt)),b;for(c=0;c<b.length;c++)if(b[c].padataType==krb.PA_ETYPE_INFO)return krb.ETYPE_INFO.decodeDER(b[c].padataValue);for(c=0;c<b.length;c++)if(b[c].padataType==krb.PA_PW_SALT)return[{salt:b[c].padataValue}];return[]}function d(b,c,a){c="salt"in b?b.salt:arrayutils.fromUTF16(c.realm+c.principalName.nameString.join(""));return krb.Key.fromPassword(b.etype,a,c,b.s2kparams)}var b={urlBase:"/kdc/v1/"};b.supportedEnctypes=
[kcrypto.enctype.aes256_cts_hmac_sha1_96,kcrypto.enctype.aes128_cts_hmac_sha1_96,kcrypto.enctype.des_cbc_crc,kcrypto.enctype.des_cbc_md5];b.Error=function(b,c){this.code=b;this.message=c};b.Error.prototype.toString=function(){return"KDC Error "+this.code+": "+this.message};b.NetworkError=function(b){this.message=b};b.NetworkError.prototype.toString=function(){return this.message};b.kdcProxyRequest=function(f,c,a){var d=Q.defer(),h=new XMLHttpRequest;h.open("POST",b.urlBase+c);h.setRequestHeader("X-WebKDC-Request",
"OK");h.setRequestHeader("Content-Type","text/plain");h.onreadystatechange=function(){if(4==this.readyState)if(200==this.status){var c=JSON.parse(this.responseText);switch(c.status){case "ERROR":d.reject(new b.NetworkError(c.msg));break;case "TIMEOUT":d.reject(new b.NetworkError("KDC connection timed out"));break;case "OK":c=arrayutils.fromByteString(atob(c.reply)),c=a.decodeDER(c)[1],d.resolve(c)}}else this.status?d.reject(new b.NetworkError("HTTP error "+this.status+": "+this.statusText)):d.reject(new b.NetworkError("Network error"))};
h.send(btoa(arrayutils.toByteString(f)));return d.promise};b.asReq=function(f,c){return Crypto.retryForEntropy(function(){var a={};a.pvno=krb.pvno;a.msgType=krb.KRB_MT_AS_REQ;void 0!==c&&(a.padata=c);a.reqBody={};a.reqBody.kdcOptions=krb.KDCOptions.make(krb.KDCOptions.forwardable,krb.KDCOptions.proxiable,krb.KDCOptions.renewable_ok);if(f.realm!=krb.realm)throw"Cross-realm not supported!";a.reqBody.principalName=f.principalName;a.reqBody.realm=krb.realm;a.reqBody.sname={};a.reqBody.sname.nameType=
krb.KRB_NT_SRV_INST;a.reqBody.sname.nameString=["krbtgt",krb.realm];a.reqBody.till=new Date(0);a.reqBody.nonce=Crypto.randomNonce();a.reqBody.etype=b.supportedEnctypes;return b.kdcProxyRequest(krb.AS_REQ.encodeDER(a),"AS_REQ",krb.AS_REP_OR_ERROR).then(function(b){return{asReq:a,asRep:b}})})};var g={};g[krb.PA_ENC_TIMESTAMP]=function(b,c,a,g,h,j){b=e(a);c=null;for(a=0;a<b.length;a++)if(b[a].etype in kcrypto.encProfiles){c=b[a];break}if(null===c)throw new Err(Err.Context.KEY,3,"No supported enctypes");
var m=d(c,h,j);return Crypto.retryForEntropy(function(){var a={};a.patimestamp=new Date;a.pausec=1E3*a.patimestamp.getUTCMilliseconds();a.patimestamp.setUTCMilliseconds(0);a=m.encryptAs(krb.ENC_TS_ENC,krb.KU_AS_REQ_PA_ENC_TIMESTAMP,a);return{padataType:krb.PA_ENC_TIMESTAMP,padataValue:krb.ENC_TIMESTAMP.encodeDER(a)}})};b.getTGTSession=function(f,c){return b.asReq(f).then(function(a){var d=a.asReq,h=a.asRep;if(h.msgType==krb.KRB_MT_ERROR&&h.errorCode==krb.KDC_ERR_PREAUTH_REQUIRED)for(var j=krb.METHOD_DATA.decodeDER(h.eData),
e=0;e<j.length;e++)if(j[e].padataType in g)return g[j[e].padataType](d,h,j,j[e],f,c).then(function(a){return b.asReq(f,[a])});return a}).then(function(a){var g=a.asReq;a=a.asRep;if(a.msgType==krb.KRB_MT_ERROR)throw new b.Error(a.errorCode,a.eText);var h={};if(a.padata){var j=e(a.padata);if(j){if(1!=j.length)throw"Bad pre-auth hint";h=j[0];if("etype"in h&&h.etype!=a.encPart.etype)throw"Bad pre-auth hint";}}h.etype=a.encPart.etype;h=d(h,f,c);return b.sessionFromKDCRep(h,krb.KU_AS_REQ_ENC_PART,g,a)})};
b.sessionFromKDCRep=function(b,c,a,d){if(a.reqBody.principalName){if(d.crealm!=a.reqBody.realm)throw new Err(Err.Context.KEY,16,"crealm does not match");if(!krb.principalNamesEqual(a.reqBody.principalName,d.cname))throw new Err(Err.Context.KEY,17,"cname does not match");}b=b.decryptAs(krb.EncASorTGSRepPart,c,d.encPart)[1];if(a.reqBody.nonce!=b.nonce)throw new Err(Err.Context.KEY,18,"nonce does not match");if(!krb.principalNamesEqual(a.reqBody.sname,b.sname))throw new Err(Err.Context.KEY,19,"sname does not match");
return new krb.Session(d,b)};b.getServiceSession=function(d,c){return Crypto.retryForEntropy(function(){var a={};a.pvno=krb.pvno;a.msgType=krb.KRB_MT_TGS_REQ;a.reqBody={};a.reqBody.kdcOptions=krb.KDCOptions.make();a.reqBody.sname=c.principalName;a.reqBody.realm=c.realm;a.reqBody.till=new Date(0);a.reqBody.nonce=Crypto.randomNonce();a.reqBody.etype=b.supportedEnctypes;var e=d.key.checksum(krb.KU_TGS_REQ_PA_TGS_REQ_CKSUM,krb.KDC_REQ_BODY.encodeDER(a.reqBody)),e=d.makeAPReq(krb.KU_TGS_REQ_PA_TGS_REQ,
e).apReq;a.padata=[{padataType:krb.PA_TGS_REQ,padataValue:krb.AP_REQ.encodeDER(e)}];return b.kdcProxyRequest(krb.TGS_REQ.encodeDER(a),"TGS_REQ",krb.TGS_REP_OR_ERROR).then(function(c){if(c.msgType==krb.KRB_MT_ERROR)throw new b.Error(c.errorCode,c.eText);return b.sessionFromKDCRep(d.key,krb.KU_TGS_REQ_ENC_PART,a,c)})})};return b}();function registerTicketAPI(){WinChan.onOpen(function(e,d,b){function g(){b({status:"DENIED",code:"NOT_ALLOWED"})}if(!d.realm||!d.principal)b({status:"ERROR",code:"BAD_REQUEST"});else if("https://"!=e.substring(0,8))g();else{var f=new krb.Principal({nameType:krb.KRB_NT_UNKNOWN,nameString:d.principal},d.realm);getTGTSession().then(function(c){var a=c[0];c=c[1];var d=$("#request-ticket-template").children().clone();d.appendTo(document.body);c&&d.fadeIn();d.find(".client-principal").text(a.client.toString());
d.find(".foreign-origin").text(e);d.find(".service-principal").text(f.toString());d.find(".request-ticket-deny").click(g);d.find(".request-ticket-allow").click(function(){localStorage.getItem("tgtSession")?a.isExpired()?(log("Ticket expired"),g()):KDC.getServiceSession(a,f).then(function(a){b({status:"OK",session:a.toDict()})},function(a){log(a);g()}).done():(log("No ticket"),g())})}).done()}})};sjcl.random.startCollectors();
function showLoginPrompt(){var e=Q.defer(),d=$("#login-template").children().clone();d.appendTo(document.body);d.find(".username").focus();d.submit(function(b){b.preventDefault();$("#alert").slideUp(100);var g=$(this).find(".username")[0];b=$(this).find(".password")[0];var f=g.value,g=b.value,c=!1;f?$(this).find(".username + .error").fadeOut():($(this).find(".username + .error").fadeIn(),c=!0);g?$(this).find(".password + .error").fadeOut():($(this).find(".password + .error").fadeIn(),c=!0);if(!c){b.value=
"";var a=$(this).find(".submit"),u=a.text();a.attr("disabled","disabled").text(".");var h=setInterval(function(){a.text((a.text()+".").replace(".....","."))},500),j=function(){clearInterval(h);a.attr("disabled",null).text(u)};b=krb.Principal.fromString(f);KDC.getTGTSession(b,g).then(function(a){j();d.fadeOut(function(){$(this).remove()});e.resolve(a)},function(a){a=a instanceof kcrypto.DecryptionError?"Incorrect password!":a instanceof KDC.Error?a.code==krb.KDC_ERR_C_PRINCIPAL_UNKNOWN?"User does not exist!":
a.code==krb.KDC_ERR_PREAUTH_FAILED||a.code==krb.KRB_AP_ERR_BAD_INTEGRITY?"Incorrect password!":a.message:String(a);$("#alert-title").text("Error logging in:");$("#alert-text").text(a);$("#alert").slideDown(100);j()}).done()}});return e.promise}
function showRenewPrompt(e){var d=Q.defer(),b=$("#renew-template").children().clone();b.find(".client-principal").text(e.client.toString());b.find(".logout-link").click(function(e){e.preventDefault();b.remove();d.resolve(showLoginPrompt())});b.appendTo(document.body);b.find(".password").focus();b.submit(function(g){g.preventDefault();$("#alert").slideUp(100);g=$(this).find(".password")[0];var f=g.value;if(f){$(this).find(".password + .error").fadeOut();g.value="";var c=$(this).find(".submit"),a=c.text();
c.attr("disabled","disabled").text(".");var u=setInterval(function(){c.text((c.text()+".").replace(".....","."))},500),h=function(){clearInterval(u);c.attr("disabled",null).text(a)};KDC.getTGTSession(e.client,f).then(function(a){h();b.fadeOut(function(){$(this).remove()});d.resolve(a)},function(a){a=a instanceof kcrypto.DecryptionError?"Incorrect password!":a instanceof KDC.Error?a.code==krb.KDC_ERR_C_PRINCIPAL_UNKNOWN?"User does not exist!":a.code==krb.KDC_ERR_PREAUTH_FAILED||a.code==krb.KRB_AP_ERR_BAD_INTEGRITY?
"Incorrect password!":a.message:a instanceof KDC.NetworkError?a.message:String(a);$("#alert-title").text("Error logging in:");$("#alert-text").text(a);$("#alert").slideDown(100);h()}).done()}else $(this).find(".password + .error").fadeIn()});return d.promise}
function getTGTSession(){var e=localStorage.getItem("tgtSession");return e?(e=krb.Session.fromDict(JSON.parse(e)),e.isExpired()?showRenewPrompt(e).then(function(d){localStorage.setItem("tgtSession",JSON.stringify(d.toDict()));return[d,!0]}):Q.resolve([e,!1])):showLoginPrompt().then(function(d){localStorage.setItem("tgtSession",JSON.stringify(d.toDict()));return[d,!0]})}
$(function(){function e(){getTGTSession().then(function(d){var b=d[0];d=d[1];log(b);var g=$("#authed-template").children().clone();g.appendTo(document.body);d&&g.fadeIn();g.find(".client-principal").text(b.client.toString());g.find("button.logout").click(function(){localStorage.removeItem("tgtSession");g.remove();e()})}).done()}$('<img src="eye-small.png">').css({left:78,top:12}).appendTo("#logo");$('<img src="eye-large.png">').css({left:87,top:16}).appendTo("#logo");$('<img src="eye-large.png">').css({left:105,
top:16}).appendTo("#logo");$('<img src="eye-small.png">').css({left:121,top:12}).appendTo("#logo");$(document).mousemove(function(d){$("#logo img").each(function(){var b=d.pageX-$(this).offset().left-$(this).width()/2,e=d.pageY-$(this).offset().top-$(this).height()/2,b="rotate("+Math.atan2(b,-e)+"rad)";$(this).css({transform:b,"-moz-transform":b,"-webkit-transform":b,"-ms-transform":b,"-o-transform":b})})});$("#whatis a").click(function(){$("#info").slideToggle(0).css("height",$("#info").height()).slideToggle(0).slideToggle();
return!1});"#!request_ticket_v1"==location.hash?registerTicketAPI():e()});
//@ sourceMappingURL=webathena-ui.js.map
