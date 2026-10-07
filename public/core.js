(function(root,f){if(typeof module==="object"&&module.exports)module.exports=f();else root.Core=f();})(typeof self!=="undefined"?self:this,function(){
var TA={uint8:Uint8Array,uint16:Uint16Array,uint32:Uint32Array,int32:Int32Array};
var DAY=86400000;
function baseMs(meta){var p=meta.baseDate.split("-");return Date.UTC(+p[0],+p[1]-1,+p[2]);}
function buildData(meta,buf,customers){
  var D={n:meta.rows,meta:meta,dims:meta.dims,customers:customers,base:baseMs(meta)};
  meta.layout.forEach(function(l){D[l.name]=new TA[l.type](buf,l.offset,l.length);});
  var maxDay=0,i;for(i=0;i<D.n;i++)if(D.date[i]>maxDay)maxDay=D.date[i];
  D.maxDay=maxDay;
  var b=new Date(D.base),by=b.getUTCFullYear(),bm=b.getUTCMonth();
  D.d2m=new Uint16Array(maxDay+1);D.mLabels=[];
  for(i=0;i<=maxDay;i++){var d=new Date(D.base+i*DAY);D.d2m[i]=(d.getUTCFullYear()-by)*12+d.getUTCMonth()-bm;}
  D.nMonths=D.d2m[maxDay]+1;
  for(i=0;i<D.nMonths;i++){var y=by+Math.floor((bm+i)/12),m=(bm+i)%12;D.mLabels.push([y,m+1]);}
  return D;
}
function dayToStr(D,day){return new Date(D.base+day*DAY).toISOString().slice(0,10);}
function strToDay(D,s){var p=s.split("-");return Math.round((Date.UTC(+p[0],+p[1]-1,+p[2])-D.base)/DAY);}
function select(D,f){
  var n=D.n,out=new Int32Array(n),c=0,i;
  var d0=f.d0,d1=f.d1,rg=f.region,ct=f.category,sb=f.sub,st=f.state,cy=f.city;
  var dt=D.date,R=D.region,C=D.category,S=D.sub,ST=D.state,CY=D.city;
  for(i=0;i<n;i++){
    var d=dt[i];if(d<d0||d>d1)continue;
    if(rg>=0&&R[i]!==rg)continue;if(ct>=0&&C[i]!==ct)continue;if(sb>=0&&S[i]!==sb)continue;
    if(st>=0&&ST[i]!==st)continue;if(cy>=0&&CY[i]!==cy)continue;
    out[c++]=i;
  }
  return out.subarray(0,c);
}
function topK(arr,k,labelsFn){
  var idx=[],i;for(i=0;i<arr.length;i++)if(arr[i]!==0)idx.push(i);
  idx.sort(function(a,b){return arr[b]-arr[a]||a-b;});
  return idx.slice(0,k).map(function(j){return {i:j,v:arr[j]};});
}
function argmax(arr){var b=-1,bv=-Infinity;for(var i=0;i<arr.length;i++)if(arr[i]>bv){bv=arr[i];b=i;}return b;}
function aggregate(D,sel){
  var n=sel.length,i,A={n:n};
  var dm=D.dims;
  var rev=new Float64Array(dm.region.length),revC=new Float64Array(dm.category.length),proC=new Float64Array(dm.category.length),
      revS=new Float64Array(dm.sub.length),revP=new Float64Array(dm.product.length),revST=new Float64Array(dm.state.length),
      revCY=new Float64Array(dm.city.length),revCU=new Float64Array(D.customers.length),
      mRev=new Float64Array(D.nMonths),mPro=new Float64Array(D.nMonths),mHas=new Uint8Array(D.nMonths);
  var seen=new Uint8Array(200001+1),orders=0,units=0,tr=0,tp=0;
  for(var k=0;k<n;k++){
    i=sel[k];var r=D.revenue[i],p=D.profit[i];
    tr+=r;tp+=p;units+=D.qty[i];
    var oid=D.order_id[i];if(oid>=seen.length){var s2=new Uint8Array(oid+1024);s2.set(seen);seen=s2;}
    if(!seen[oid]){seen[oid]=1;orders++;}
    rev[D.region[i]]+=r;revC[D.category[i]]+=r;proC[D.category[i]]+=p;revS[D.sub[i]]+=r;revP[D.product[i]]+=r;
    revST[D.state[i]]+=r;revCY[D.city[i]]+=r;revCU[D.customer[i]]+=r;
    var m=D.d2m[D.date[i]];mRev[m]+=r;mPro[m]+=p;mHas[m]=1;
  }
  A.revenue=tr/100;A.profit=tp/100;A.margin=tr?tp/tr*100:0;A.orders=orders;A.units=units;
  var c=function(a){var o=new Float64Array(a.length);for(var j=0;j<a.length;j++)o[j]=a[j]/100;return o;};
  A.region=c(rev);A.cat=c(revC);A.catProfit=c(proC);
  A.subTop=topK(c(revS),10);A.prodTop=topK(c(revP),10);A.custTop=topK(c(revCU),10);
  A.stateTop=topK(c(revST),15);A.cityTop=topK(c(revCY),15);
  // monthly with gap fill
  var first=-1,last=-1;for(i=0;i<D.nMonths;i++)if(mHas[i]){if(first<0)first=i;last=i;}
  A.months=[];A.mRev=[];A.mPro=[];
  if(first>=0)for(i=first;i<=last;i++){A.months.push(D.mLabels[i]);A.mRev.push(mRev[i]/100);A.mPro.push(mPro[i]/100);}
  A.topRegion=argmax(A.region);A.topCat=argmax(A.cat);A.topProd=A.prodTop.length?A.prodTop[0].i:-1;A.topProfCat=argmax(A.catProfit);
  return A;
}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function sample(sel,k,seed){
  if(sel.length<=k)return Array.prototype.slice.call(sel);
  var rnd=mulberry32(seed||42),a=Int32Array.from(sel),n=a.length,i;
  for(i=0;i<k;i++){var j=i+Math.floor(rnd()*(n-i));var t=a[i];a[i]=a[j];a[j]=t;}
  return Array.prototype.slice.call(a.subarray(0,k));
}
function sortSel(D,sel,key,dir){
  var a=Int32Array.from(sel),arr;
  var map={id:"order_id",date:"date",qty:"qty",price:"price",rev:"revenue",profit:"profit"};
  if(map[key]){arr=D[map[key]];a.sort(function(x,y){return (arr[x]-arr[y])*dir||x-y;});}
  else{
    var nm={cust:function(i){return D.customers[D.customer[i]];},city:function(i){return D.dims.city[D.city[i]];},state:function(i){return D.dims.state[D.state[i]];},region:function(i){return D.dims.region[D.region[i]];},cat:function(i){return D.dims.category[D.category[i]];},sub:function(i){return D.dims.sub[D.sub[i]];},prod:function(i){return D.dims.product[D.product[i]];}}[key];
    var arr2=Array.prototype.slice.call(a);var keyed=new Map();arr2.forEach(function(i){keyed.set(i,nm(i));});
    arr2.sort(function(x,y){var u=keyed.get(x),v=keyed.get(y);return (u<v?-1:u>v?1:0)*dir||x-y;});
    return Int32Array.from(arr2);
  }
  return a;
}
return {buildData:buildData,select:select,aggregate:aggregate,sample:sample,sortSel:sortSel,dayToStr:dayToStr,strToDay:strToDay};
});
