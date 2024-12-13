!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("@rgba-image/lanczos")):"function"==typeof define&&define.amd?define(["exports","@rgba-image/lanczos"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).stego={},e.lanczos)}(this,function(e,t){"use strict";let r,n;var o,l,a,f=((o={}).V1="V1",o.V2="V2",o);function i(e,t,r=!1){let n=Array(e.length/3).fill(0).map((e,t)=>t);!function(e,t,r=!1){let n=(t,r)=>{[e[t],e[r]]=[e[r],e[t]]};for(let o=r?e.length-1:0;r&&o>=0||!r&&o<e.length;o+=r?-1:1)n(t[o%t.length]%e.length,o)}(n,t,r);let o=Array(e.length).fill(0).map((t,r)=>e[3*n[Math.floor(r/3)]+r%3]);e.forEach((t,r)=>{e[r]=o[r]})}function c(e){return e&&!(e.length<3)&&255===e[0]&&216===e[1]&&255===e[2]?"image/jpeg":e&&!(e.length<8)&&137===e[0]&&80===e[1]&&78===e[2]&&71===e[3]&&13===e[4]&&10===e[5]&&26===e[6]&&10===e[7]?"image/png":void 0}function u(e,t){let r=[],n=Math.min(Math.ceil(t/8),65536);for(let t of e(new Uint8Array(n)))r.push(t>>0&1,t>>1&1,t>>2&1,t>>3&1,t>>4&1,t>>5&1,t>>6&1,t>>7&1);return(r.length>t&&(r.length=t),8*n<t)?r.concat(u(e,t-8*n)):r}function s(e,t,r){return Math.floor(new Uint32Array(e(new Uint8Array(4)).buffer)[0]/0x100000000*(r-t+1)+t)}var h=((l={}).NONE="NONE",l.AVERAGE="AVG",l.LUMINANCE="LUMA",l.LUMINANCE_II="LUMA_II",l.DESATURATION="DESATURATION",l.MAX_DECOMPOSITION="MAX_DE",l.MIN_DECOMPOSITION="MIN_DE",l.MID_DECOMPOSITION="MID_DE",l.SIGNLE_R="R",l.SIGNLE_G="G",l.SIGNLE_B="B",l);function d(e,t,r,n){switch(n){case"AVG":return(e+t+r)/3;case"LUMA":return .3*e+.59*t+.11*r;case"LUMA_II":return .2126*e+.7152*t+.0722*r;case"DESATURATION":return(Math.max(e,t,r)+Math.min(e,t,r))/2;case"MAX_DE":return Math.max(e,t,r);case"MIN_DE":return Math.min(e,t,r);case"MID_DE":return[e,t,r].sort()[1];case"R":return e;case"G":return t;case"B":return r;default:return 0}}function g(e,t){var r,n;return r=Math.round(e),n=255-t,r<t?t:r>n?n:r}let p=0;function w(e){if(0!==e&&(e&e-1)==0)r=new Uint8Array(p=e),n=new Float64Array(1.25*p),function(){let e=0,t=0,n=0;for(r[0]=0;(e+=1)<p;){for(n=p>>1;n<=t;)t-=n,n>>=1;t+=n,r[e]=t}}(),function(){let e=p>>1,t=p>>2,r=p>>3,o=e+t,l=Math.sin(Math.PI/p),a=2*l*l,f=Math.sqrt(a*(2-a)),i=n[t]=1,c=n[0]=0;l=2*a;for(let e=1;e<r;e+=1)i-=a,a+=l*i,c+=f,f-=l*c,n[e]=c,n[t-e]=i;0!==r&&(n[r]=Math.sqrt(.5));for(let r=0;r<t;r+=1)n[e-r]=n[r];for(let t=0;t<o;t+=1)n[t+e]=-n[t]}();else throw Error("init: radix-2 required")}function m(e,t){let r=1/p;M(e,t,-1);for(let n=0;n<p;n+=1)e[n]*=r,t[n]*=r}function M(e,t,o){let l,a,f,i,c,u,s,h,d;let g=p>>2;for(let n=0;n<p;n+=1)i=r[n],n<i&&(c=e[n],e[n]=e[i],e[i]=c,c=t[n],t[n]=t[i],t[i]=c);for(let r=1;r<p;r<<=1){a=0,l=p/(r<<1);for(let i=0;i<r;i+=1){u=n[a+g],s=o*n[a];for(let n=i;n<p;n+=r<<1)h=u*e[f=n+r]+s*t[f],d=u*t[f]-s*e[f],e[f]=e[n]-h,e[n]+=h,t[f]=t[n]-d,t[n]+=d;a+=l}}}let b=1/Math.sqrt(2);var A=((a={}).FFT1D="FFT1D",a.FFT2D="FFT2D",a.DCT="DCT",a.FastDCT="fastDCT",a);function E(e,t,r,{size:n}){switch(r){case"FFT1D":w(n),M(e,t,1);break;case"FFT2D":w(n),function(e,t){let r=[],n=[],o=0;for(let l=0;l<p;l+=1){o=l*p;for(let l=0;l<p;l+=1)r[l]=e[l+o],n[l]=t[l+o];M(r,n,1);for(let l=0;l<p;l+=1)e[l+o]=r[l],t[l+o]=n[l]}for(let l=0;l<p;l+=1){for(let a=0;a<p;a+=1)o=l+a*p,r[a]=e[o],n[a]=t[o];M(r,n,1);for(let a=0;a<p;a+=1)e[o=l+a*p]=r[a],t[o]=n[a]}}(e,t);break;case"DCT":!function(e,t=8){let r=[];for(let n=0;n<t;n+=1)for(let o=0;o<t;o+=1){let l=0===o?b:1,a=0===n?b:1,f=0;for(let r=0;r<t;r+=1)for(let l=0;l<t;l+=1)f+=e[r*t+l]*Math.cos((2*l+1)*o*Math.PI/16)*Math.cos((2*r+1)*n*Math.PI/16);r.push(f*l*a/4)}for(let t=0;t<r.length;t+=1)e[t]=r[t]}(e,n);break;case"fastDCT":!function(e){let t=e.length;if(t<=0||(t&t-1)!=0)throw"Length must be power of 2";!function e(t,r,n,o){if(1===n)return;let l=Math.floor(n/2);for(let e=0;e<l;e+=1){let a=t[r+e],f=t[r+n-1-e];o[r+e]=a+f,o[r+e+l]=(a-f)/(2*Math.cos((e+.5)*Math.PI/n))}e(o,r,l,t),e(o,r+l,l,t);for(let e=0;e<l-1;e+=1)t[r+2*e+0]=o[r+e],t[r+2*e+1]=o[r+e+l]+o[r+e+l+1];t[r+n-2]=o[r+l-1],t[r+n-1]=o[r+n-1]}(e,0,t,new Float64Array(t))}(e);break;default:throw Error(`unknown algorithm in transform: ${r}`)}}function T(e,t,r,{size:n}){switch(r){case"FFT1D":w(n),m(e,t);break;case"FFT2D":w(n),function(e,t){let r=[],n=[],o=0;for(let l=0;l<p;l+=1){o=l*p;for(let l=0;l<p;l+=1)r[l]=e[l+o],n[l]=t[l+o];m(r,n);for(let l=0;l<p;l+=1)e[l+o]=r[l],t[l+o]=n[l]}for(let l=0;l<p;l+=1){for(let a=0;a<p;a+=1)o=l+a*p,r[a]=e[o],n[a]=t[o];m(r,n);for(let a=0;a<p;a+=1)e[o=l+a*p]=r[a],t[o]=n[a]}}(e,t);break;case"DCT":!function(e,t=8){let r=[];for(let n=0;n<t;n+=1)for(let o=0;o<t;o+=1){let l=0;for(let r=0;r<t;r+=1)for(let a=0;a<t;a+=1)l+=(0===a?b:1)*(0===r?b:1)*e[r*t+a]*Math.cos((2*o+1)*a*Math.PI/16)*Math.cos((2*n+1)*r*Math.PI/16);r.push(l/4)}for(let t=0;t<r.length;t+=1)e[t]=r[t]}(e,n);break;case"fastDCT":!function(e){let t=e.length;if(t<=0||(t&t-1)!=0)throw"Length must be power of 2";e[0]/=2,function e(t,r,n,o){if(1===n)return;let l=Math.floor(n/2);o[r+0]=t[r+0],o[r+l]=t[r+1];for(let e=1;e<l;e+=1)o[r+e]=t[r+2*e],o[r+e+l]=t[r+2*e-1]+t[r+2*e+1];e(o,r,l,t),e(o,r+l,l,t);for(let e=0;e<l;e+=1){let a=o[r+e],f=o[r+e+l]/(2*Math.cos((e+.5)*Math.PI/n));t[r+e]=a+f,t[r+n-1-e]=a-f}}(e,0,t,new Float64Array(t));for(var r=0;r<e.length;r+=1)e[r]/=e.length/2}(e);break;default:throw Error(`unknown algorithm in inverseTransform: ${r}`)}}function D({p:e,w:t},{size:r}){return[e%Math.floor(t/r)*r,Math.floor(e/Math.floor(t/r))*r]}function I({w:e,c:t},{size:r},n,o,l){return((o+Math.floor(l/r))*e+n+l%r)*4+t}let F=Object.freeze({[f.V1]:{[A.DCT]:100,[A.FastDCT]:500,[A.FFT1D]:128,[A.FFT2D]:500},[f.V2]:{[A.DCT]:10,[A.FastDCT]:100,[A.FFT1D]:30,[A.FFT2D]:150}}),y=Object.freeze({[A.DCT]:5e3,[A.FastDCT]:5e3,[A.FFT1D]:5e3,[A.FFT2D]:5e4}),v=f.V2,O=Object.freeze([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,1,3,0,0,0,37,219,86,202,0,0,0,1,115,82,71,66,1,217,201,44,127,0,0,0,9,112,72,89,115,0,0,11,19,0,0,11,19,1,0,154,156,24,0,0,0,3,80,76,84,69,255,255,255,167,196,27,200,0,0,0,10,73,68,65,84,120,156,99,96,0,0,0,2,0,1,72,175,164,113,0,0,0,0,73,69,78,68,174,66,96,130]),_=Object.freeze([76221,13388,20800,80672,15974,87005,71203,84444,16928,51335,94092,83586,37656,2240,26283,1887,93419,96857,20866,21797,42065,39781,50192,24399,98969,54274,38815,45159,36824]);function C({width:e,height:t},{size:r}){return[Math.floor(e/r)*r,Math.floor(t/r)*r]}function N(e,t,r){let{width:n,height:o}=e,l=0,a=0,f=0;for(let i of function*({width:e,height:t,data:r},{size:n,verbose:o}){for(let l=0;l<t;l+=n)for(let a=0;a<e;a+=n)if(l+n<=t&&a+n<=e)for(let t=0;t<3;t+=1){let f=[];for(let o=0;o<n;o+=1)for(let i=0;i<n;i+=1)f[o*n+i]=r[((l+o)*e+a+i)*4+t];o&&console.warn("height: "+l+" width: "+a),yield f}}(e,t))r(i,{c:l,p:a,b:f,w:n,h:o},e)&&(f+=1),3===(l+=1)&&(a+=1,l=0)}function U(e,t){!function(e,t){let{width:r,height:n,data:o}=e;for(let l=0;l<r*n;l+=1){let r=4*l;t([o[r],o[r+1],o[r+2],o[r+3]],r,e)}}(e,(r,n)=>P(e.data,t(r,n),n))}function L(e,t,r){N(e,t,(n,o)=>{let l=r(n,o,e);return l&&(function(e,t,r,n){let{size:o}=t,[l,a]=D(n,t);for(let i=0;i<o*o;i+=1){var f;r[i]=(f=Math.round(r[i]))<0?0:f>255?255:f,e[I(n,t,l,a,i)]=r[i]}}(e.data,t,n,o),t.verbose&&(console.warn("inversed block: "+n),E(n,Array(t.size*t.size).fill(0),t.transformAlgorithm,t),console.warn(n[25],n[18]))),l})}function P(e,t,r){e[r+0]=t[0],e[r+1]=t[1],e[r+2]=t[2],e[r+3]=t[3]}function R({size:e,transformAlgorithm:t}){return t===A.FFT1D?{prevPos:-1,prevCode:"",indices:function(e,t){let r=(e+1)/2-1;return function(e,t){let r=[];for(let n=0;n<e*e;n+=1)t(n)&&r.push(n);return r}(e,t=>3>=Math.sqrt(Math.pow(r-Math.floor(t/e),2)+Math.pow(r-t%e,2)))}(e,0)}:{prevPos:-1,prevCode:"",indices:[]}}function x(e,t,r){let{pass:n,size:o,transformAlgorithm:l}=r;switch(l){case A.FFT1D:return n?function(e,{c:t},{pass:r}){let{prevCode:n,prevPos:o,indices:l}=e;if(0!==t)return o;let[a,f]=function(e,t,r){let n=1,o=function(e){let t=0;if(0===e.length)return t;for(let r=0;r<e.length;r+=1)t=(t<<5)-t+e.charCodeAt(r),t&=t;return t}(e),l=Math.abs(o)%t;for(;r[l];)l=(l+n*n)%t,n=n>t/2?1:n+1;return r[l]=1,[l,String(o)]}(`${r}_${n}`,l.length,[]);return e.prevCode=f,e.prevPos=l[a],l[a]}(e,t,r):(o*o+o)/2;case A.FFT2D:case A.DCT:case A.FastDCT:return 0;default:throw Error(`unknown algorithm: ${l}`)}}function S(e,t,r){let{size:n}=r,o={...t,c:0},[l,a]=D(o,r);for(let t=0;t<n*n;t+=1){let n=e[I(o,r,l,a,t)];if(void 0!==n&&n<127)return!1}return!0}function k(e,t){return void 0===e[t]||e[t]>127}async function V(e,t,r,n){let{text:o,size:l,narrow:a,copies:f,grayscaleAlgorithm:i,transformAlgorithm:c,exhaustPixels:p}=r,[w,m]=C(e,r),M=w*m*3,b=function(e,t){let r=Array.from(e),n=[],o=(e,t)=>{for(let r=0;r<8;r+=1){let o=0;for(;o<t;)n.push(e[r]),o+=1}};for(let e=0;e<r.length;e+=1){let n=Array.from(encodeURI(r[e]));for(let e=0;e<n.length;e+=1){let r=[],l=0,a=n[e].charCodeAt(0);do r.push(l=a%2),a=a-Math.floor(a/2)-l;while(a>1);for(r.push(a);r.length<8;)r.push(0);o(r.reverse(),t)}}return n}(o,f),A=r.randomSource||n,F=function(e,...t){let r=0;for(let n=0;n<t.length;n+=1){let o=t[n];for(let t=0;t<o.length&&r<e.length;t+=1,r+=1)e[r]=o[t]}return e}(u(A,p?M:b.length+8*f),b,Array(8*f).fill(1));b.length+8*f>M&&console.error("bits overflow! try to shrink text or reduce copies."),(i!==h.NONE||a>0)&&U(e,([e,r,n,o],l)=>{if(!k(t,l))return[e,r,n,o];if(i!==h.NONE){let t=d(e,r,n,i);e=t,r=t,n=t}return a>0&&(e=g(e,a),r=g(r,a),n=g(n,a)),[e,r,n,o]});let y=R(r),v=Array(l*l);return L(e,r,(n,o)=>{if(!p&&o.b>=F.length)return!1;if(!S(t,o,r)){if(r.fakeMaskPixels&&0===o.c){let[t,n]=D(o,r),l=s(A,10,127);P(e.data,[l,l,l,255],I(o,r,t,n,s(A,0,64)))}return!1}return E(n,v.fill(0),c,r),function(e,t,r,n,o){let l=x(r,n,o),{tolerance:a}=o,f=Math.floor(e[l]/a);t[n.b]?e[l]=f%2==1?f*a:(f+1)*a:e[l]=f%2==1?(f-1)*a:f*a}(n,F,y,o,r),T(n,v,c,r),!0}),e}var G=Object.freeze({__proto__:null,decode:async function(e,t,r){let{size:n,copies:o,transformAlgorithm:l}=r,a=[],f=R(r),i=Array(n*n);return N(e,r,(e,n)=>!!S(t,n,r)&&(E(e,i.fill(0),l,r),a.push(function(e,t,r,n){let o=x(t,r,n),{tolerance:l}=n;return Math.abs(Math.round(e[o]/l)%2)}(e,f,n,r)),!0)),function(e,t){let r=128,n=0,o=[],l=[],a=()=>l.filter(e=>1===e).length>=t/2?1:0;for(let f=0;f<e.length;f+=1)if(l.push(e[f]),l.length===t){if(n+=a()*r,r/=2,l.length=0,255===n)break;r<1&&(o.push(String.fromCharCode(n)),n=0,r=128)}try{return decodeURI(o.join(""))}catch(e){return""}}(a,o)},encode:async function(e,t,r,n){let{width:o,height:l}=e,[a,f]=C(e,r);return{data:await V(e,t,r,n),width:r.cropEdgePixels?a:o,height:r.cropEdgePixels?f:l}}});function j(e){let{size:t,transformAlgorithm:r}=e;switch(r){case A.FFT1D:case A.FFT2D:case A.DCT:case A.FastDCT:return[3*t+1,2*t+2];default:throw Error(`unknown algorithm in getPos: ${r}`)}}let z=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","J","H","I","G","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","-",".","_","!","~","*","'","(",")",";",",","/","?",":","@","&","=","+","$","%"],B=z.map((e,t)=>{var r;return(r=2*t)^r>>1});function X(e){return -1!==z.indexOf(e)?B[z.indexOf(e)]:255}function q(e){return -1!==B.indexOf(e)?z[B.indexOf(e)]:""}function $(e,t){let[r,n]=j(t);t.verbose&&console.warn("decoded value: ",e[r],e[n]);let o=e[r]-e[n];return{bit:o>0?1:0,diff:o}}async function H(e,t,r,n){let{text:o,size:l,narrow:a,copies:f,grayscaleAlgorithm:c,transformAlgorithm:p,exhaustPixels:w}=r,[m,M]=C(e,r),b=m*M*3/(l*l),F=function(e,t){let r=[],n=(e,t)=>{for(let n=0;n<8;n+=1){let o=0;for(;o<t;)r.push(e[n]),o+=1}};return e.map(e=>{let r=[],o=0;do r.push(o=e%2),e=e-Math.floor(e/2)-o;while(e>1);for(r.push(e);r.length<8;)r.push(0);n(r.reverse(),3*Math.ceil(t/3))}),r}(function(e){let t=[];return Array.from(e).map(e=>{Array.from(encodeURI(e)).map(e=>t.push(B[z.indexOf(e)]))}),t}(o),f),y=function(e,t){let r=Array.from(e.toString(2)).reverse().map(e=>Number(e));for(;r.length<4;)r.push(0);let n=[];for(let e=0;e<r.length;e+=1)for(let t=0;t<9;t+=1)n.push(r[e]);return n}((r.copies-1)/2,0),v=r.randomSource||n,O=function(e,...t){let r=0;for(let n=0;n<t.length;n+=1){let o=t[n];for(let t=0;t<o.length&&r<e.length;t+=1,r+=1)e[r]=o[t]}return e}(u(v,b),y,F,Array(8*f).fill(1)),N=F.length+8*f;N>b&&console.error("bits overflow! try to shrink text or reduce copies."),(c!==h.NONE||a>0)&&U(e,([e,r,n,o],l)=>{if(!k(t,l))return[e,r,n,o];if(c!==h.NONE){let t=d(e,r,n,c);e=t,r=t,n=t}return a>0&&(e=g(e,a),r=g(r,a),n=g(n,a)),[e,r,n,o]});let R=Array(l*l),x=-1,V=Array(b).fill(0).map((e,t)=>t);i(V,_);let G=V.map((e,t)=>{if(t<N)return e});return L(e,r,(n,a)=>{if(0===a.c){let[t,n]=D(a,r);for(let o=0;o<l*l;o+=1)!function(e,t,r,n){let{data:o}=e;o[t+3]=255}(e,I(a,r,t,n,o),0,0)}if(x+=1,!w&&!(x in G))return!1;if(!S(t,a,r)){if(r.fakeMaskPixels&&0===a.c){let[t,n]=D(a,r),o=s(v,10,127);P(e.data,[o,o,o,255],I(a,r,t,n,s(v,0,64)))}return!1}r.verbose&&console.warn("Encode on image block (blockId: "+x+"): "+n),E(n,R.fill(0),p,r);let i=(()=>{let e=x*l/3%a.w,t=Math.floor(x*l/3/a.w)*l,n=r.tolerance;return(e<=8||e>a.w-2*l||t<=l||t>a.h-2*l)&&(n*=1.5),r.verbose&&console.warn("Encode with tolerance: "+n+" (Image size is width: "+a.w+" height:"+a.h+")"),n})(),c=0,u=5;for(;;){!function(e,t,r,n){let[o,l]=j(r),a=e[o],f=e[l],i=Math.abs(a-f),c=i>1.5*n?.5*n:i<.3*n?1.5*n:i<.5*n?1.2*n:n;[a,f]=a<f?[a-c/2,f+c/2]:[a+c/2,f-c/2],r.verbose&&console.warn("encoded value: ",a,f),t?([e[o],e[l]]=a<f?[f,a]:[a,f],r.transformAlgorithm===A.FFT2D&&([e[72-o],e[72-l]]=a<f?[f,a]:[a,f])):([e[o],e[l]]=a<f?[a,f]:[f,a],r.transformAlgorithm===A.FFT2D&&([e[72-o],e[72-l]]=a<f?[a,f]:[f,a]))}(n,O[V[a.b]],r,i);let[e,t]=j(r);if(c=0===c?n[e]-n[t]:c,r.verbose){let e=V[a.b]<y.length?"PARAM_BITS":function(e,t,r){let n=Math.floor(e/(8*t)),o=Array.from(encodeURI(r));return n>o.length?"OUT_OF_BOUND(charId: "+n+")":o[n]+"(charId: "+n+", bitId: "+e%(8*t)+")"}(V[a.b]-y.length,f,o);console.warn("Encode bit: "+O[V[a.b]]+" From char: "+e),console.warn(n)}T(n,R,p,r);let s=n.map(e=>e<0?0:e>255?255:Math.round(e));E(s,R.fill(0),p,r);let h=s[e]-s[t];if(r.verbose&&console.warn("After encode, the params diff is: "+h+" ("+s[e]+"-"+s[t]+") diff1: "+c),Math.abs(h)<Math.abs(.8*c)){if(r.verbose&&console.warn("Repeat set bit with tolerance: "+i+" (max repeat times: "+u+")"),0==(u-=1))break;for(let e=0;e<l*l;e+=1)n[e]=s[e];continue}break}return!0}),e}var K=Object.freeze({__proto__:null,decode:async function(e,t,r){let{size:n,transformAlgorithm:o}=r,l=[],a=Array(n*n),[f,c]=C(e,r),u=Array(f*c*3/(n*n)).fill(0).map((e,t)=>t);i(u,_);let s=0;N(e,r,(e,n)=>{if(!S(t,n,r))return!1;if(E(e,a.fill(0),o,r),r.verbose&&s>=36){let t=s-36;console.warn("charId: "+Math.floor(u[t]/(8*r.copies))+", bitId: "+u[t]%(8*r.copies)),console.warn("bit: "+$(e,r).bit,e)}return l.push($(e,r)),s+=1,!0}),i(l,_,!0);let h=1+2*function(e,t){let r=1,n=0;for(let t=0;t<e.length/9;t+=1){let o=[];for(let r=0;r<9;r+=1)o.push(e[9*t+r]);n+=r*(o.filter(e=>1===e).length>=4.5?1:0),r<<=1}return n}(l.slice(0,36).map(e=>e.bit));return r.verbose&&console.warn("copies is "+h),function(e,t,r){let n=128,o=0,l=[],a=[],f=[];for(let i=0;i<e.length;i+=1)if(f.push(e[i]),r&&(console.warn("bit: "+e[i].bit),console.warn("charId: "+Math.floor(i/(8*t))+", bitId: "+i%(8*t))),f.length===t){if(l.push(f.slice()),n/=2,f.length=0,n<1){if(255===(o=function(e,t,r){r&&console.warn("[debug][rawcode] bits: "+e.map(e=>e.map(e=>e.bit))+"\n"+e.map(e=>e.map(e=>e.diff)));let n=e.slice().reverse().reduce((e,t,n)=>{let o=t.length,l=t.filter(e=>1===e.bit).length;if(0===l)return e;if(l!==o){let a=(e,t)=>e.reduce((e,r)=>r.bit===t?e+r.diff:e,0),f=Math.abs(a(t,1))/l,i=Math.abs(a(t,0))/(o-l);r&&console.warn("diff1: "+f+" diff0: "+f),(f>2*i||l>o/2)&&(e+=1<<n)}else e+=1<<n;return e},0);if(255!==n&&-1===B.indexOf(n)){let o=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"].map(e=>X(e)),l=t.length,a=!1;(l>1&&t[l-1]===X("%")||l>2&&t[l-2]===X("%"))&&(a=!0);let f=e=>{let t=0;for(;e;)t+=1&e,e>>=1;return t};n=B.reduce((t,l)=>{if(a){if(-1===o.indexOf(l))return t;if(-1===o.indexOf(t))return l}let i=e=>{let t=Array.from(e.toString(2));for(;t.length<8;)t.splice(0,0,"0");return t.map(e=>Number(e))},c=(e,t)=>{let n=i(t),o=0,l=0,a=[.45,.35,.2];for(let t=0;t<e.length;t+=1)o+=Math.abs(e[t].filter(e=>1===e.bit).length-n[t]*e[t].length),l+=e[t].reduce((e,r,o)=>r.bit!==n[t]?Math.abs(r.diff)*a[o%3]+e:e,0);return r&&console.warn(t+" "+q(t)+" "+n+" bit difference: "+o+" param difference: "+l+"\n"),[o,l]};if(f(n^t)<f(n^l))return t;{if(f(n^t)>f(n^l))return l;let[r,o]=[c(e,t),c(e,l)];return r[1]<o[1]?t:r[1]>o[1]?l:r[0]<o[0]?t:l}},255)}if(r){let t=e.map(e=>e.map(e=>e.bit)),r=e.map(e=>e.map(e=>e.diff));console.warn("elected "+n+" ("+q(n)+") with bits: "+t+"\n"+r)}return n}(l,a,r)))break;r&&console.warn("bit index: "+i+" char: "+q(o)+" temp: "+o+"\n"),a.push(o),o=0,l.length=0,n=128}t%3!=0&&(i+=3-t%3)}r&&console.warn("Before correctURI: "+a);let i=a.map(e=>q(e));try{return decodeURI(i.join(""))}catch(e){return console.warn("Error when decoding:  "+e),""}}(l.slice(36),h,r.verbose)},encode:async function(e,t,r,n){let{width:o,height:l}=e,[a,f]=C(e,r);return{data:await H(e,t,r,n),width:r.cropEdgePixels?a:o,height:r.cropEdgePixels?f:l}}});let W={[f.V1]:G,[f.V2]:K},{encode:Z,decode:J}=function(e){let{preprocessImage:t,toPNG:r,toImageData:n,defaultRandomSource:o}=e;return{async encode(e,l,a){let{data:f,height:i,width:c}=await W[a.version].encode(t(await n(e)),t(await n(l)).data,a,o);return r(f,i,c)},decode:async(e,t,r)=>W[r.version].decode(await n(e),(await n(t)).data,r)}}({toImageData:e=>new Promise(t=>{let r=new Uint8Array(e),n=c(r);t(ee(new Blob([r],{type:n})))}),async toPNG(e,t=e.height,r=e.width){let n=Y(r,t);return(n.getContext("2d").putImageData(e,0,0,0,0,r,t),"function"==typeof OffscreenCanvas&&n instanceof OffscreenCanvas)?n.convertToBlob({type:"image/png"}).then(Q):new Promise((e,t)=>{n.toBlob(r=>{r?e(Q(r)):t(Error("fail to convert to png"))},"image/png")})},preprocessImage:e=>(function(e,r){if(e.width<=1960&&e.height<=1960)return e;let n=1960/Math.max(e.width,e.height),[o,l]=[e.width*n,e.height*n],a=r(Math.round(o),Math.round(l));return a?(t.lanczos(e,a),a):e})(e,(e,t)=>Y(e,t).getContext("2d")?.createImageData(e,t)??null),defaultRandomSource:e=>crypto.getRandomValues(e)});async function Q(e){return new Uint8Array(await e.arrayBuffer())}function Y(e,t){let r;return"function"==typeof OffscreenCanvas?r=new OffscreenCanvas(e,t):((r=document.createElement("canvas")).width=e,r.height=t),r}async function ee(e){let t,r,n;if("function"==typeof createImageBitmap)t=(n=await createImageBitmap(e)).width,r=n.height;else{let o=URL.createObjectURL(e);n=await new Promise((e,n)=>{let l=new Image;l.addEventListener("load",()=>{t=l.width,r=l.height,e(l)}),l.addEventListener("error",n),l.src=o}).finally(()=>URL.revokeObjectURL(o))}let o=Y(t,r).getContext("2d");return o.drawImage(n,0,0),o.getImageData(0,0,t,r)}e.AlgorithmVersion=f,e.CLI_NAME="stego-js",e.DEFAULT_ALGORITHM_VERSION=v,e.DEFAULT_COPIES=3,e.DEFAULT_CROP_EDGE_PIXELS=!0,e.DEFAULT_EXHAUST_PIXELS=!0,e.DEFAULT_FAKE_MASK_PIXELS=!1,e.DEFAULT_MASK=O,e.DEFAULT_NARROW=0,e.DEFAULT_PARAM_COPIES=9,e.DEFAULT_SIZE=8,e.DEFAULT_TOLERANCE=F,e.GrayscaleAlgorithm=h,e.MAX_TOLERANCE=y,e.MAX_WIDTH=1960,e.SEED=_,e.TOLERANCE_NOT_SET=-1,e.TransformAlgorithm=A,e.decode=J,e.encode=Z,e.getImageType=c});
