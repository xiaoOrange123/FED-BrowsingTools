'use strict';Registry.require("promise helper xmlhttprequest uri convert tools".split(" "),function(){var w=rea.FEATURES,f=Registry.get("promise"),x=Registry.get("xmlhttprequest").run,k=Registry.get("uri"),C=Registry.get("helper"),r=Registry.get("convert"),u=Registry.get("tools"),D,H=u.createQueue(1),J=function(d){var b=f();r.blob2str(d,function(a,c){c?b.reject(c):b.resolve(a)});return b.promise()},q=function(d,b){var a=(d?d.split("/"):[]).concat(b?[b]:[]).join("/");return a?("/"==a.substr(0,1)?"":
"/")+a:""},I=function(d,b){b=b(d);Object.keys(d).forEach(function(a){var c=Object.getOwnPropertyDescriptor(d,a);c.get?(b.__defineGetter__(a,c.get),c.set&&b.__defineSetter__(a,c.set)):b[a]=b[a]||d[a]});return b},v=function(d){var b=[],a=null,c,e={extend:function(a){return e=I(e,a)},config:{},changes:function(){var a;return{listen:function(){a||(a=f(),e.watch&&e.watch.start());return a.promise()},notify:function(e){a.notify(e)}}}(),oauth:function(){var a,b={run:function(){if(c)return c;var l=f(),g=
c=l.promise();a="!!"+d+"-"+C.createUUID();var n=D({type:d,url:b.getAuthUrl()});n.promise.progress(function(a){var h;l&&(h=b.onUrl(a.url))&&(e.credentials=h,l.resolve(),l=null,n.close())}).always(function(){c=null;l&&l.reject("auth_failed")});return g},getAuthUrl:function(){return e.config.request_uri+"?"+k.hash2params({response_type:e.config.response_type,client_id:e.config.client_id,redirect_uri:e.config.redirect_uri,state:a,scope:e.config.scope})},onUrl:function(b){var c,n;if(b&&0===b.indexOf(e.config.redirect_uri)&&
(n=k.parse(b))&&(c=k.params2hash(n))&&c.access_token&&c.state===a)return{uid:c.uid,access_token:c.access_token}}};return b}(),request:function(a){var b=function(){var b=f(),e=function(a){console.debug("cloud: request failed",a);b.reject(a)};x(a,{onload:function(a){-1==[200,201,204].indexOf(a.status)?e(a):b.resolve(a.response)},onerror:e,ontimeout:e,onprogress:b.notify});return b.promise()};return a.no_queue?b():H.add(b)},wait:function(a){return function(){if(e.credentials.access_token)return a.apply(this,
arguments);var c=arguments,m=f();b.push(function(){m.consume(a.apply(this,c))});e.oauth.run().done(function(){b.forEach(function(a){a()});b=[]}).fail(function(a){m.reject(a)});return m.promise()}}},m=w.HTML5.LOCALSTORAGE;e.__defineGetter__("credentials",function(){if(null===a){if(m)try{var b=JSON.parse(m.getItem(e.config.storage_key));a={uid:b.uid,access_token:b.access_token}}catch(c){}a=a||{}}return a});e.__defineSetter__("credentials",function(b){if(m)try{m.setItem(e.config.storage_key,JSON.stringify({uid:b.uid,
access_token:b.access_token}))}catch(c){}a=b});return e},K=function(){var d=null,b={extend:function(a){return b=I(b,a)},config:{},changes:function(){var a;return{listen:function(){a||(a=f(),b.watch&&b.watch.start());return a.promise()},notify:function(b){a.notify(b)}}}(),request:function(a){var b=function(){var b=f(),c=function(a){console.debug("webdav: request failed",a);b.reject(a)},h="xml"===a.responseType,d="headers"===a.responseType;(h||d)&&delete a.responseType;x(a,{onload:function(a){if(-1==
[200,201,204,207].indexOf(a.status))c(a);else if(h)b.resolve(a.responseXML);else if(d){var g={};a.responseHeaders&&a.responseHeaders.split("\n").forEach(function(a){(a=a.match(/^([^:]+): ?(.*)/))&&3===a.length&&(g[a[1].toLowerCase()]=a[2])});b.resolve(g)}else b.resolve(a.response)},onerror:c,ontimeout:c,onprogress:b.notify});return b.promise()};return a.no_queue?b():H.add(b)},wait:function(a){return function(){return a.apply(this,arguments)}}};b.__defineGetter__("credentials",function(){null===d&&
(d={basic_auth:b.config.basic_auth});return d});b.__defineSetter__("credentials",function(a){d=a});return b};Registry.register("cloud","5883",{init:function(d){D=d},drive:function(){return(new v("drive")).extend(function(d){var b,a,c={config:{redirect_uri:"https://tampermonkey.net/oauth.php",request_uri:"https://accounts.google.com/o/oauth2/v2/auth",client_id:"408438522028-3cgn3t3jas3fak7isbnfod1q4h15g2fv.apps.googleusercontent.com",storage_key:"gd_config",scope:"https://www.googleapis.com/auth/drive.appdata",
response_type:"token"},request:function(a){a.headers=a.headers||{};a.headers.Authorization="Bearer "+c.credentials.access_token;return d.request.apply(this,arguments).then(function(a){return a},function(b){if(!b||-1!=[403,500].indexOf(b.status))return a.backoff=2*(a.backoff||1E3),u.sleep(a.backoff).then(function(){return c.request(a)});if(-1!=[400,401].indexOf(b.status)){if(console.warn("Google Drive: authentication error",b),c.credentials={},!a.retry_auth)return a.retry_auth=!0,c.oauth.run().then(function(){return c.request(a)})}else if(404==
b.status)return f.Pledge(null);return f.Breach(b.statusText||b.responseText)})},list:d.wait(function(a){var b=[],h=f(),d=function(a){return"https://www.googleapis.com/drive/v3/files?"+k.hash2params({spaces:"appDataFolder",pageToken:a,orderBy:"modifiedTime desc",fields:"nextPageToken, files(id, size, name, modifiedTime, md5Checksum)",pageSize:500})},l=function(a){return c.request({method:"GET",url:a,headers:{"Content-Type":"application/json"}}).then(function(a){a=a?JSON.parse(a):{files:[]};b=b.concat(a.files);
if(a.nextPageToken)return l(d(a.nextPageToken));h.resolve(b)})};l(d());return h.promise().then(function(b){var c={};return b.map(function(b){if(!a){if(c[b.name])return;c[b.name]=!0}return{name:b.name,size:b.size||0,id:b.id,md5:b.md5Checksum,modified:(new Date(b.modifiedTime)).getTime()}}).filter(function(a){return a})})}),get:d.wait(function(a){return c.request({method:"GET",url:"https://www.googleapis.com/drive/v3/files/"+(a.id||a)+"?"+k.hash2params({spaces:"appDataFolder",alt:"media"}),responseType:"arraybuffer"}).then(function(a){return new Blob([a])})}),
put:d.wait(function(a,b,h){var d=a.name||a,l=a.id,g=C.createUUID();return f.Pledge().then(function(){if(b)return J(b)}).then(function(a){var b=h&&h.lastModified?(new Date(h.lastModified)).toISOString():void 0,e=[];e.push("--"+g);e.push("Content-Type: application/json");e.push("");e.push(JSON.stringify({name:d,parents:l?void 0:["appDataFolder"],modifiedTime:b}));e.push("--"+g);a&&(e.push("Content-Type: application/octet-stream"),e.push("Content-Transfer-Encoding: base64"),e.push(""),e.push(r.Base64.encode(a)),
e.push("--"+g+"--"));e.push("");return c.request({method:l||!a?"PATCH":"POST",url:"https://www.googleapis.com/"+(a?"upload/":"")+"drive/v3/files"+(l?"/"+l:"")+"?"+k.hash2params({uploadType:"multipart"}),headers:{"Content-Type":"multipart/related; boundary="+g},data:e.join("\r\n")})})}),delete:d.wait(function(a){return c.request({method:"DELETE",url:"https://www.googleapis.com/drive/v3/files/"+(a.id||a)+"?"+k.hash2params({spaces:"appDataFolder"}),headers:{"Content-Type":" application/json"}})}),compare:function(a,
b){var c=f(),d;(d=a.md5)&&d==r.MD5(b,"utf-8")?c.resolve(!0):c.resolve(!1);return c.promise()},watch:{start:function(){if(!b){b=!0;var e,m=function(){a=null;b&&c.request({method:"GET",url:"https://www.googleapis.com/drive/v3/changes/?"+k.hash2params({pageToken:e,spaces:"appDataFolder",pageSize:1E3,includeRemoved:!0}),headers:{"Content-Type":" application/json"}}).then(function(a){if(!b)return f.Breach();var m=a?JSON.parse(a):{};if(!(e=m.newStartPageToken))return console.warn("Google Drive: watch token error",
a),c.watch.stop();m.nextPageToken&&console.warn("Google Drive: too much changes",a);(m.changes||[]).forEach(function(a){var b,c;"file"===a.type&&(c=a.file)&&(b=Date.parse(a.time),isNaN(b)&&(b=Date.now()),d.changes.notify({id:c.id,time:b,name:c.name,removed:a.removed}))})}).fail(function(a){console.warn("Google Drive: file changes check failed",a)}).always(function(){a=window.setTimeout(m,18E5)})};d.wait(function(){return b?c.request({method:"GET",url:"https://www.googleapis.com/drive/v3/changes/startPageToken",
headers:{"Content-Type":" application/json"}}).then(function(a){if(!(e=(a?JSON.parse(a):{}).startPageToken))return console.warn("Google Drive: watch token error",a),c.watch.stop();m()}):f.Breach()})()}},stop:function(){b=!1;a&&(window.clearTimeout(a),a=null)}}};return c})},dropbox:function(d){var b=d.path||"";return(new v("dropbox")).extend(function(a){var c,e,d,h,k=!0,l=function(a){var c=[],d=f(),e=function(a){return g.request({method:"POST",url:"https://api.dropboxapi.com/2/files/list_folder"+(a?
"/continue":""),headers:{"Content-Type":" application/json"},data:{path:a?void 0:q(b),cursor:a}}).then(function(a){a=a?JSON.parse(a):{entries:[]};c=c.concat(a.entries);if(a.has_more&&a.cursor)return e(a.cursor);d.resolve({list:c,cursor:a.cursor})}).fail(d.reject)};k?(k=!1,g.put(".version",new Blob([rea.extension.manifest.version])).then(function(){e(a)}).fail(d.reject)):e(a);return d.promise()},g={config:{redirect_uri:"https://tampermonkey.net/oauth.php",request_uri:"https://www.dropbox.com/oauth2/authorize",
client_id:"gq3auc9yym0e21y",storage_key:"db_config",response_type:"token"},request:function(b){b.no_auth||(b.headers=b.headers||{},b.headers.Authorization="Bearer "+g.credentials.access_token);return a.request.apply(this,arguments).then(function(a){return a},function(a){return a&&-1==[500,429].indexOf(a.status)?-1==[401].indexOf(a.status)||(console.warn("Dropbox: authentication error",a),g.credentials={},b.retry_auth)?f.Breach(a.responseText||a.statusText):(b.retry_auth=!0,g.oauth.run().then(function(){return g.request(b)})):
(b.backoff=2*(b.backoff||1E3),u.sleep(b.backoff).then(function(){return g.request(b)}))})},list:a.wait(function(a){return l().then(function(b){var c={};h=b.cursor;return b.list.map(function(b){if(!a){if(c[b.name])return;c[b.name]=!0}return{name:b.name,size:b.size,dropbox_hash:b.content_hash,modified:(new Date(b.client_modified)).getTime(),precision:1E3}}).filter(function(a){return a})}).always(function(){d&&h&&(d(),d=null)})}),get:a.wait(function(a){return g.request({method:"POST",url:"https://content.dropboxapi.com/2/files/download",
headers:{"Dropbox-API-Arg":JSON.stringify({path:q(b,a.name||a)})},responseType:"arraybuffer"}).then(function(a){return new Blob([a])})}),put:a.wait(function(a,c,d){a=a.name||a;d=d&&d.lastModified?(new Date(d.lastModified)).toISOString().match(/[^:]*:[^:]*:[^:.a-zA_Z]*/)[0]+"Z":void 0;return g.request({method:"POST",url:"https://content.dropboxapi.com/2/files/upload",headers:{"Dropbox-API-Arg":JSON.stringify({path:q(b,a),client_modified:d,mode:"overwrite"}),"Content-Type":"application/octet-stream"},
data_type:"typified",data:{type:"raw",value:c}})}),delete:a.wait(function(a){return g.request({method:"POST",url:"https://api.dropboxapi.com/2/files/delete",headers:{"Content-Type":" application/json"},data:{path:q(b,a.name||a)}})}),compare:function(a,b){var c=f();if(window.crypto&&window.ArrayBuffer){for(var d=r.str2arrbuf(b,"utf-8"),e=[],h=d.byteLength,g=1,m=function(){if(0===--g){var b=new window.ArrayBuffer;e.forEach(function(a){var c=b,d=new Uint8Array(c.byteLength+a.byteLength);d.set(new Uint8Array(c),
0);d.set(new Uint8Array(a),c.byteLength);b=d.buffer});window.crypto.subtle.digest("SHA-256",b).then(function(b){b=Array.from(new Uint8Array(b)).map(function(a){return("00"+a.toString(16)).slice(-2)}).join("");c.resolve(b==a.dropbox_hash)})}},l=0,k=0;k<h;k+=4194304,l++)(function(a){e.push(null);g++;window.crypto.subtle.digest("SHA-256",d.slice(k,k+Math.min(4194304,h-k))).then(function(b){e[a]=b;m()},function(){console.warn("Dropbox: unable to calculate SHA-256 hashes");c.reject()})})(l);m()}else console.warn("Dropbox: unable to calculate SHA-256 hashes"),
c.reject();return c.promise()},watch:{start:function(){if(!c){c=!0;var b=0,k=function(){e=null;b=0;if(c){if(!h)return console.warn("Dropbox: watch token error",h),g.watch.stop();g.request({method:"POST",url:"https://notify.dropboxapi.com/2/files/list_folder/longpoll",headers:{"Content-Type":" application/json"},no_auth:!0,no_queue:!0,data:{cursor:h,timeout:180}}).then(function(a){if(!c)return f.Breach();var d=a?JSON.parse(a):{};d.backoff&&(b=1E3*d.backoff);return d.changes?u.sleep(6E4).then(function(){return l(h)}).then(function(b){return(h=
b.cursor)?b.list:(console.warn("Dropbox: watch token error",a),g.watch.stop())}):null}).then(function(b){b&&b.forEach(function(b){var c,d=b[".tag"];-1!=["file","deleted"].indexOf(d)&&(c=Date.parse(b.server_modified),a.changes.notify({id:b.id,time:c,name:b.name,removed:"deleted"==d}))})}).fail(function(a){console.warn("Dropbox: file changes check failed",a)}).always(function(){e=window.setTimeout(k,b+18E5)})}};a.wait(function(){if(!c)return f.Breach();h?k():d=k;return f.Pledge()})()}},stop:function(){c=
!1;e&&(window.clearTimeout(e),e=null)}},getRemoteDomains:function(){return["dropbox.com","dropboxapi.com"]}};return g})},onedrive:function(){return(new v("onedrive")).extend(function(d){var b={config:{redirect_uri:"https://tampermonkey.net/oauth.php",request_uri:"https://login.live.com/oauth20_authorize.srf",client_id:"000000004C1A3122",storage_key:"od_config",response_type:"token",scope:"onedrive.appfolder"},request:function(a){a.headers=a.headers||{};a.headers.Authorization="Bearer "+b.credentials.access_token;
return d.request.apply(this,arguments).then(function(a){return a},function(c){return c?-1==[401].indexOf(c.status)||(console.warn("OneDrive: authentication error",c),b.credentials={},a.retry_auth)?f.Breach(c.statusText||c.responseText):(a.retry_auth=!0,b.oauth.run().then(function(){return b.request(a)})):(console.warn("OneDrive: timeout"),f.Breach("Timeout"))})},list:d.wait(function(){return b.request({method:"GET",url:"https://api.onedrive.com/v1.0/drive/special/approot/children",headers:{"Content-Type":" application/json"}}).then(function(a){var b=
JSON.parse(a);b["@odata.nextLink"]&&console.warn("OneDrive: too much files",a);return b.value.map(function(a){return{name:a.name,size:a.size,modified:(new Date(a.lastModifiedDateTime)).getTime()}})})}),get:d.wait(function(a){return b.request({method:"GET",url:"https://api.onedrive.com/v1.0/drive/special/approot:/"+encodeURIComponent(a.name||a)+":/content",responseType:"arraybuffer"}).then(function(a){return new Blob([a])})}),put:d.wait(function(a,c){return b.request({method:"PUT",url:"https://api.onedrive.com/v1.0/drive/special/approot:/"+
encodeURIComponent((a.name||a).replace(/[#%<>:"|\?\*\/\\]/g,"-"))+":/content",headers:{"Content-Type":"application/octet-stream"},data_type:"typified",data:{type:"raw",value:c}})}),delete:d.wait(function(a){return b.request({method:"DELETE",url:"https://api.onedrive.com/v1.0/drive/special/approot:/"+encodeURIComponent(a.name||a)})})};return b})},webdav:function(d){var b=d.url||"";"/"==b.slice(-1)&&(b=b.slice(0,-1));var a=k.parse(b).pathname;"/"==a.slice(-1)&&(a=a.slice(0,-1));var c,e;(c=w.HTML5.LOCALSTORAGE)&&
(e=c.getItem("webdav_poll_interval"))||(e=18E5);return(new K).extend(function(c){var h=q("Tampermonkey",d.path),r,l=null,g=null,n,E,y,z,v,w=function(a){var b;a&&(b=a.firstChild.nextSibling?a.firstChild.nextSibling:a.firstChild);return b},A=function(a){return c.wait(function(){var b=arguments;return p.init().then(function(){return a.apply(this,b)})})},B=function(a,b){var c,d;if((c=a.getElementsByTagNameNS("*",b)[0])&&(d=c.firstChild))return d.nodeValue},x=function(c){var d=[];c=c.getElementsByTagNameNS("*",
"response");for(var e=0;e<c.length;e++){var F=c[e],t=B(F,"href"),t=t.replace(/\/$/,""),f=F.getElementsByTagNameNS("*","propstat")[0].getElementsByTagNameNS("*","prop")[0],F=B(f,"getlastmodified"),g=B(f,"getcontentlength"),f=f.getElementsByTagNameNS("*","resourcetype")[0].getElementsByTagNameNS("*","collection")[0],t=t.replace(new RegExp("^("+[C.escapeForRegExpURL(b+h)+"/?",C.escapeForRegExpURL(a+h)+"/?"].join("|")+")"),"");f||(t={name:t,modifiedTime:(new Date(F)).getTime(),size:0<=g?g:void 0,removed:-1==
g},d.push(t))}return d},G=function(a,b){b=b||{};b.set_current_list&&(n={});return p.request({method:"PROPFIND",url:a,headers:{"Content-Type":"text/xml; charset=UTF-8",Depth:void 0!==b.depth?b.depth:1},responseType:"xml"}).then(function(a){var c;if(null===a||!(c=w(a))||!c.childNodes)return f.Breach();a=x(c);b.set_current_list&&((c=B(c,"td:cursor"))&&(E=c),a.forEach(function(a){n[a.name]=a}));return a})},D=function(a,b){var c={"Content-Type":"text/xml; charset=UTF-8",Depth:1,Timeout:90};b&&(c.Cursor=
b);return p.request({method:"SUBSCRIBE",url:a,headers:c,responseType:"xml",no_queue:!0}).then(function(a){var b;if(null===a)return f.Pledge({changes:[],cursor:E});if(!(b=w(a))||!b.childNodes)return f.Breach();a=x(b);b=B(b,"td:cursor");return{changes:a,cursor:b}})},p={config:{basic_auth:d.basic_auth},request:function(a){if(!p.credentials.basic_auth)return f.Breach("Authentication failed");a.headers=a.headers||{};a.headers.Authorization="Basic "+p.credentials.basic_auth;return c.request.apply(this,
arguments).then(function(a){return a},function(b){if(!b||-1!=[403,500].indexOf(b.status))return a.backoff=2*(a.backoff||1E3),u.sleep(a.backoff).then(function(){return p.request(a)});if(-1!=[401].indexOf(b.status))console.warn("WebDAV: authentication error",b),p.credentials={};else if(404==b.status)return f.Pledge(null);return f.Breach(b.statusText||b.responseText)})},init:function(){if(r)return r;var a=f();r=a.promise();var c=b+h;p.request({method:"OPTIONS",url:b,responseType:"headers"}).done(function(a){var b;
a&&(b=a["access-control-allow-methods"])&&-1!=b.indexOf("EDITOR")&&(v=!0)}).always(function(){G(c,{depth:0}).done(a.resolve).fail(function(){var c=[];f.onebyone(h.split("/").filter(function(a){return a}).map(function(a){c.push(a);var d=c.join("/");return function(){return p.request({method:"MKCOL",url:b+"/"+d,headers:{"Content-Type":"text/xml; charset=UTF-8"},responseType:"xml"})}})).done(a.resolve).fail(a.reject)})});return r},list:A(function(a){return G(b+h,{set_current_list:!0}).then(function(b){var c=
{};return b.map(function(b){if(!a){if(c[b.name])return;c[b.name]=!0}return{name:b.name,size:b.size||0,id:b.id,md5:b.md5Checksum,modified:(new Date(b.modifiedTime)).getTime(),precision:1E3,removed:b.removed}}).filter(function(a){return a})})}),get:A(function(a){return p.request({method:"GET",url:b+q(h,a.name||a),headers:{"Content-Type":"text/xml; charset=UTF-8"},responseType:"arraybuffer"}).then(function(a){return new Blob([a])})}),put:A(function(a,c,d){var e=a.name||a,f,k,m;a={"Content-Type":"application/octet-stream"};
var n=null===g;d&&d.lastModified&&(f=d.lastModified,m=(new Date(d.lastModified)).toISOString(),k=d.lastModified/1E3,g||n)&&(a["X-OC-Mtime"]=k);return p.request({method:"PUT",url:b+q(h,e),headers:a,data_type:"typified",data:{type:"raw",value:c},responseType:"headers"}).then(function(a){if(a&&n){var c;g="accepted"==a["x-oc-mtime"]||a.date&&(c=(new Date(a.date)).getTime())&&(c==f||c==Math.floor(k))?!0:!1}if(!g&&!l&&m)return p.request({method:"PROPPATCH",url:b+q(h,e),headers:{"Content-Type":"text/xml; charset=UTF-8"},
responseType:"xml",data:['<?xml version="1.0"?><d:propertyupdate xmlns:d="DAV:"><d:set><d:prop>',"<d:getlastmodified>"+m+"</d:getlastmodified>","</d:prop></d:set></d:propertyupdate>"].join("")}).then(function(a){var b,c,d;a&&(b=a.childNodes[0])&&(c=b.getElementsByTagNameNS("*","status")[0])&&(d=c.firstChild.nodeValue)&&-1!=d.search(/HTTP\/[0-9\.]+ 403/)&&(console.warn("WebDAV: no way to set file modification date! This might cause redundant up and downloads."),l=!0)})})}),delete:A(function(a){return p.request({method:"DELETE",
url:b+q(h,a.name||a),headers:{"Content-Type":"text/xml; charset=UTF-8"}})}),watch:{start:function(){if(!y){y=!0;var a=null,d=function(){z=null;if(y)if(!1===a){var f=n;G(b+h,{set_current_list:!0}).then(function(){f&&(Object.keys(f).forEach(function(a){var b=n[a];a=f[a];b?a.modifiedTime!=b.modifiedTime&&c.changes.notify({time:b.modifiedTime,name:b.name}):c.changes.notify({time:Date.now(),name:a.name,removed:!0})}),Object.keys(n).forEach(function(a){f[a]||(a=n[a],c.changes.notify({time:a.modifiedTime,
name:a.name}))}))}).fail(function(a){console.warn("WebDAV: file changes check failed",a)}).always(function(){z=window.setTimeout(d,e)})}else{var g=100;D(b+h,E).then(function(a){var b=a.changes;E=a.cursor;g=1;b.forEach(function(a){c.changes.notify({time:a.modifiedTime,name:a.name,removed:a.removed})})},function(){if(null===a)a=!1;else return g*=2,u.sleep(g)}).always(d)}};A(function(){if(!y)return f.Breach();d();return f.Pledge()})()}},stop:function(){y=!1;z&&(window.clearTimeout(z),z=null)}},getRemoteUrl:function(a){if(v)return b+
q(h,a)+"?method=editor#bypass=true"},getRemoteDomains:function(){return[k.parse(b).origin.replace(/^.*:\/\//,"")]}};return p})}})});