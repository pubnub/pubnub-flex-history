var pubnub_flex_history=function(e,t){function n(e){return e.toString().length<12?1e7*parseInt(e):parseInt(e)}function r(e,t){e.callback=function(e){t({start:parseInt(e[1]),end:parseInt(e[2]),count:e[0].length,messages:e[0]})},e.error=function(e){t({error:!0,errorObject:e,errorMessage:e.toString()})},i.history(e)}function s(){p.count=e.last-c.count>=100?100:e.last-c.count,r(p,function(n){c.count+=n.count,Array.prototype.push.apply(c.messages,n.messages),(n.start<c.start||0===c.start)&&(c.start=n.start),n.end>c.end&&(c.end=n.end),c.count<e.last?(p.end=n.start,s()):t(c)})}function a(){r(p,function(e){c.count+=e.count,Array.prototype.push.apply(c.messages,e.messages),(e.start<c.start||0===c.start)&&(c.start=e.start),e.end>c.end&&(c.end=e.end),100===e.count?(p.start=e.end,a()):t(c)})}function o(){r(p,function(e){c.count+=e.count,Array.prototype.push.apply(c.messages,e.messages),(e.start<c.start||0===c.start)&&(c.start=e.start),e.end>c.end&&(c.end=e.end),100===e.count?(p.start=e.end,o()):t(c)})}var i=this,c={count:0,start:0,end:0,channel:e.channel,messages:[],operation:"undefined"};if(c.operation=e.hasOwnProperty("last")?"last":c.operation,c.operation=e.hasOwnProperty("since")?"since":c.operation,c.operation=e.hasOwnProperty("between")?"between":c.operation,c.operation=e.hasOwnProperty("at")?"at":c.operation,c.operation=e.hasOwnProperty("getrange")?"getrange":c.operation,!e.hasOwnProperty("channel"))return console.error("ERROR: pubnub_flex_history requires a channel specified in options object"),c.channel=null,c.error=!0,c.errorMessage="channel not specified",void t(c);var p={channel:e.channel,include_token:!0};if(e.hasOwnProperty("last"))parseInt(e.last)<=100&&(p.count=e.last,r(p,function(e){for(var n in e)c[n]=e[n];t(c)})),parseInt(e.last)>100&&s();else if(e.hasOwnProperty("since"))p.start=n(e.since),p.reverse=!0,a();else if(e.hasOwnProperty("getrange"))p.count=1,c.messages={},r(p,function(e){if(c.messages.last=e.messages[0],e.end>c.end){c.end=e.end;var n=e.end/1e7|0,r=new Date(0);r.setUTCSeconds(n),c.endE=n,c.endD=r.toString()}c.start>0&&c.end>0&&t(c)}),p.reverse=!0,r(p,function(e){if(c.messages.first=e.messages[0],e.start<c.start||0===c.start){c.start=e.start;var n=e.start/1e7|0,r=new Date(0);r.setUTCSeconds(n),c.startE=n,c.startD=r.toString()}c.start>0&&c.end>0&&t(c)});else if(e.hasOwnProperty("between")){var u=n(e.between[0]),d=n(e.between[1]);u>d&&(u=d,d=n(e.between[0])),p.start=u,p.end=d,p.reverse=!0,o()}else e.hasOwnProperty("at")?(p.start=n(e.at)-1,p.count=1,r(p,function(e){c.count+=e.count,Array.prototype.push.apply(c.messages,e.messages),e.count>0&&(e.start<c.start||0===c.start)&&(c.start=e.start),e.count>0&&e.end>c.end&&(c.end=e.end),t(c)})):(console.error("ERROR: pubnub_flex_history operation required, one of [last, since, getrange, between, at]"),c.error=!0,c.errorMessage="operation required, one of [last, since, getrange, between, at]",t(c))};