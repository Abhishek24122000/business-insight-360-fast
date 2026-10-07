(function(g){
var T={};
T.en={
brand:"Business Insight",caption:"Interactive Sales & Profitability Dashboard",
orig:"Original Streamlit app ↗",src:"Source ↗",
filters:"Filters",howto:"How to read these filters",reset:"Reset filters",all:"All",
fDate:"Order Date",fRegion:"Region",fCategory:"Category",fSub:"Sub-Category",fState:"State",fCity:"City",
subtitle:"Sales · Profitability · Customers · Products · Geography",
intro:"Explore sales performance across time, geography, product categories and customers. Use the filters on the left to slice the data. Every chart, KPI and table updates instantly.",
showingAll:"Showing all available data.",active:"Active filters",
empty:"No transactions match the selected filters. Try a broader combination of filters.",
kRev:"Revenue",kProfit:"Profit",kMargin:"Profit Margin",kOrders:"Orders",kUnits:"Units Sold",
cRevTrend:"Revenue Trend",cProfitTrend:"Profit Trend",cRegion:"Revenue by Region",cCat:"Revenue by Category",cProfCat:"Profit by Category",
cSub:"Revenue by Sub-Category (Top 10)",cProd:"Top 10 Products by Revenue",cCust:"Top 10 Customers by Revenue",
cState:"Revenue by State (Top 15)",cCity:"Revenue by City (Top 15)",cScatter:"Unit Price vs Profit",
month:"Month",revenue:"Revenue",profit:"Profit",product:"Product",customer:"Customer",unitPrice:"Unit Price",qty:"Quantity",
snap:"Executive Snapshot",sRegion:"Top Region",sCat:"Top Category",sProd:"Top Product",sProfCat:"Most Profitable Category",
tbl:"Filtered Transaction Data",match:function(n){return n+" transactions match the current filters.";},
page:"Page",of:"of",prev:"Prev",next:"Next",
cols:{id:"Order_ID",date:"Order_Date",cust:"Customer_Name",city:"City",state:"State",region:"Region",cat:"Category",sub:"Sub_Category",prod:"Product_Name",qty:"Quantity",price:"Unit_Price",rev:"Revenue",profit:"Profit"},
footer:"Business Insight | Interactive Sales & Profitability Dashboard",
loading:function(n){return "Loading "+n+" transaction records…";},loadErr:"Failed to load data. Please reload.",
gTitle:"How to read these filters",
gloss:[["Region","East / West / South / Centre = Eastern / Western / Southern / Central United States."],["Category","The broad product group (e.g. Electronics)."],["Sub-Category","A narrower product type inside a category (e.g. Laptops)."],["Product","The specific item sold."],["Customer","The buyer who placed the order."],["Location","State and city where the order was delivered."],["Revenue","Quantity × Unit Price: total sales value."],["Profit","Revenue minus costs: what the business keeps."],["Quantity","Number of units in the order."]],
langBtn:"日本語",langTitle:"Switch to Japanese"
};
T.ja={
brand:"Business Insight",caption:"売上・収益性インタラクティブ ダッシュボード",
orig:"元の Streamlit アプリ ↗",src:"ソースコード ↗",
filters:"フィルター",howto:"フィルターの見方",reset:"フィルターをリセット",all:"すべて",
fDate:"注文日",fRegion:"地域",fCategory:"カテゴリ",fSub:"サブカテゴリ",fState:"州",fCity:"都市",
subtitle:"売上 · 収益性 · 顧客 · 商品 · 地域",
intro:"時系列・地域・商品カテゴリ・顧客別に販売実績を分析できます。左のフィルターでデータを絞り込むと、すべてのグラフ・KPI・表が即座に更新されます。",
showingAll:"すべてのデータを表示しています。",active:"適用中のフィルター",
empty:"条件に一致する取引がありません。フィルターの条件を広げてください。",
kRev:"売上高",kProfit:"利益",kMargin:"利益率",kOrders:"注文数",kUnits:"販売数量",
cRevTrend:"売上推移",cProfitTrend:"利益推移",cRegion:"地域別売上高",cCat:"カテゴリ別売上高",cProfCat:"カテゴリ別利益",
cSub:"サブカテゴリ別売上高（上位10）",cProd:"商品別売上高 上位10",cCust:"顧客別売上高 上位10",
cState:"州別売上高（上位15）",cCity:"都市別売上高（上位15）",cScatter:"単価と利益の関係",
month:"月",revenue:"売上高",profit:"利益",product:"商品",customer:"顧客",unitPrice:"単価",qty:"数量",
snap:"エグゼクティブ・サマリー",sRegion:"売上トップの地域",sCat:"売上トップのカテゴリ",sProd:"売上トップの商品",sProfCat:"最も利益の大きいカテゴリ",
tbl:"取引データ（フィルター適用後）",match:function(n){return "現在のフィルターに一致する取引："+n+"件";},
page:"ページ",of:"/",prev:"前へ",next:"次へ",
cols:{id:"注文ID",date:"注文日",cust:"顧客名",city:"都市",state:"州",region:"地域",cat:"カテゴリ",sub:"サブカテゴリ",prod:"商品名",qty:"数量",price:"単価",rev:"売上高",profit:"利益"},
footer:"Business Insight | 売上・収益性インタラクティブ ダッシュボード",
loading:function(n){return n+"件の取引データを読み込み中…";},loadErr:"データの読み込みに失敗しました。再読み込みしてください。",
gTitle:"フィルターの見方",
gloss:[["地域","East / West / South / Centre ＝ 米国の東部・西部・南部・中央部。"],["カテゴリ","大分類の商品グループ（例：電子機器）。"],["サブカテゴリ","カテゴリ内のより細かい商品種別（例：ノートPC）。"],["商品","販売された個別の商品。"],["顧客","注文を行った購入者。"],["所在地","注文の配送先の州・都市。"],["売上高","数量 × 単価 ＝ 販売総額。"],["利益","売上高から費用を差し引いた、事業に残る金額。"],["数量","注文に含まれる個数。"]],
langBtn:"English",langTitle:"英語に切り替え"
};
var D={ja:{
region:{"Centre":"中央部","East":"東部","South":"南部","West":"西部"},
category:{"Accessories":"アクセサリー","Clothing & Apparel":"衣料品・アパレル","Electronics":"電子機器・家電","Home & Furniture":"住まい・家具"},
sub:{"Bags":"バッグ","Bedding":"寝具","Footwear":"シューズ・履物","Furniture":"家具","Home Appliances":"生活家電","Home Decor":"インテリア雑貨","Kids Wear":"子供服","Kitchenware":"キッチン用品","Laptops":"ノートPC","Men's Wear":"メンズウェア","Small Electronics":"小型電子機器","Smartphones":"スマートフォン","Sportswear":"スポーツウェア","Storage":"収納","TVs & Audio":"テレビ・オーディオ","Tablets":"タブレット","Wearable Accessories":"ウェアラブルアクセサリー","Wearables":"ウェアラブル端末","Women's Wear":"レディースウェア"},
product:{"Adidas Tracksuit":"アディダス トラックスーツ","Apple Watch":"Apple Watch","Apple iPhone 14":"Apple iPhone 14","Ashley Recliner":"アシュリー リクライニングチェア","Backpack":"バックパック","Belt":"ベルト","Bose Soundbar":"ボーズ サウンドバー","Brooklinen Sheets":"ブルックリネン シーツ","Carter's Onesie":"カーターズ ロンパース","Charging Cable":"充電ケーブル","Children's Hoodie":"子供用パーカー","Closet Organizer":"クローゼット収納","Cookware Set":"調理器具セット","Crocs":"クロックス","Dell XPS 13":"Dell XPS 13","Dining Table Set":"ダイニングテーブルセット","Dyson Vacuum":"ダイソン 掃除機","Fitbit Charge":"Fitbit Charge","GAP Hoodie":"GAP パーカー","Google Pixel 7":"Google Pixel 7","IKEA Sofa":"IKEA ソファ","Instant Pot":"インスタントポット","KitchenAid Mixer":"キッチンエイド ミキサー","LG OLED TV":"LG 有機ELテレビ","Lenovo ThinkPad":"Lenovo ThinkPad","Levi's Jeans":"リーバイス ジーンズ","MacBook Air":"MacBook Air","Nike Air Force 1":"ナイキ エア フォース 1","Nike Running Shoes":"ナイキ ランニングシューズ","Office Chair":"オフィスチェア","Old Navy Dress":"オールドネイビー ワンピース","Phone Case":"スマホケース","Power Bank":"モバイルバッテリー","Samsung Galaxy S23":"Samsung Galaxy S23","Samsung Galaxy Tab":"Samsung Galaxy Tab","Sony Bravia TV":"ソニー ブラビア テレビ","Storage Rack":"収納ラック","Sunglasses":"サングラス","Tempur-Pedic Mattress":"テンピュール マットレス","Throw Pillows":"クッション","Timberland Boots":"ティンバーランド ブーツ","Tote Bag":"トートバッグ","Under Armour T-Shirt":"アンダーアーマー Tシャツ","Vase":"花瓶","Wall Art":"ウォールアート","Wallet":"財布","Watch Strap":"腕時計ベルト","Zara Blouse":"ザラ ブラウス","iPad Pro":"iPad Pro"},
state:{"Alabama":"アラバマ","Arizona":"アリゾナ","Arkansas":"アーカンソー","California":"カリフォルニア","Colorado":"コロラド","Connecticut":"コネチカット","Delaware":"デラウェア","Florida":"フロリダ","Georgia":"ジョージア","Idaho":"アイダホ","Illinois":"イリノイ","Indiana":"インディアナ","Iowa":"アイオワ","Kansas":"カンザス","Kentucky":"ケンタッキー","Louisiana":"ルイジアナ","Maine":"メイン","Maryland":"メリーランド","Massachusetts":"マサチューセッツ","Michigan":"ミシガン","Minnesota":"ミネソタ","Mississippi":"ミシシッピ","Missouri":"ミズーリ","Montana":"モンタナ","Nebraska":"ネブラスカ","Nevada":"ネバダ","New Hampshire":"ニューハンプシャー","New Jersey":"ニュージャージー","New Mexico":"ニューメキシコ","New York":"ニューヨーク","North Dakota":"ノースダコタ","Ohio":"オハイオ","Oklahoma":"オクラホマ","Oregon":"オレゴン","Pennsylvania":"ペンシルベニア","Rhode Island":"ロードアイランド","South Carolina":"サウスカロライナ","South Dakota":"サウスダコタ","Tennessee":"テネシー","Texas":"テキサス","Utah":"ユタ","Vermont":"バーモント","Virginia":"バージニア","Washington":"ワシントン","West Virginia":"ウェストバージニア","Wisconsin":"ウィスコンシン","Wyoming":"ワイオミング"},
city:{"Albuquerque":"アルバカーキ","Annapolis":"アナポリス","Atlanta":"アトランタ","Augusta":"オーガスタ","Aurora":"オーロラ","Austin":"オースティン","Baltimore":"ボルチモア","Baton Rouge":"バトンルージュ","Billings":"ビリングス","Birmingham":"バーミングハム","Bismarck":"ビスマーク","Boise":"ボイジー","Boston":"ボストン","Burlington":"バーリントン","Casper":"キャスパー","Cedar Rapids":"シダーラピッズ","Chandler":"チャンドラー","Charleston":"チャールストン","Cheyenne":"シャイアン","Chicago":"シカゴ","Cincinnati":"シンシナティ","Cleveland":"クリーブランド","Colorado Springs":"コロラドスプリングス","Columbia":"コロンビア","Columbus":"コロンバス","Dallas":"ダラス","Denver":"デンバー","Des Moines":"デモイン","Detroit":"デトロイト","Dover":"ドーバー","Fargo":"ファーゴ","Fayetteville":"フェイエットビル","Fort Smith":"フォートスミス","Fort Wayne":"フォートウェイン","Glendale":"グレンデール","Grand Rapids":"グランドラピッズ","Gulfport":"ガルフポート","Hartford":"ハートフォード","Houston":"ヒューストン","Huntington":"ハンティントン","Huntsville":"ハンツビル","Indianapolis":"インディアナポリス","Jackson":"ジャクソン","Jacksonville":"ジャクソンビル","Jersey City":"ジャージーシティ","Kansas City":"カンザスシティ","Knoxville":"ノックスビル","Las Vegas":"ラスベガス","Lexington":"レキシントン","Lincoln":"リンカーン","Little Rock":"リトルロック","Los Angeles":"ロサンゼルス","Louisville":"ルイビル","Madison":"マディソン","Manchester":"マンチェスター","Memphis":"メンフィス","Mesa":"メサ","Miami":"マイアミ","Milwaukee":"ミルウォーキー","Minneapolis":"ミネアポリス","Missoula":"ミズーラ","Mobile":"モービル","Montgomery":"モンゴメリー","Montpelier":"モンペリエ","Nashua":"ナシュア","Nashville":"ナッシュビル","New Haven":"ニューヘイブン","New Orleans":"ニューオーリンズ","New York City":"ニューヨーク市","Newark":"ニューアーク","Oklahoma City":"オクラホマシティ","Omaha":"オマハ","Orlando":"オーランド","Philadelphia":"フィラデルフィア","Phoenix":"フェニックス","Pittsburgh":"ピッツバーグ","Portland":"ポートランド","Providence":"プロビデンス","Provo":"プロボ","Rapid City":"ラピッドシティ","Reno":"リノ","Richmond":"リッチモンド","Rochester":"ロチェスター","Sacramento":"サクラメント","Salem":"セイラム","Salt Lake City":"ソルトレイクシティ","San Antonio":"サンアントニオ","San Diego":"サンディエゴ","San Francisco":"サンフランシスコ","San Jose":"サンノゼ","Santa Fe":"サンタフェ","Savannah":"サバンナ","Seattle":"シアトル","Sioux Falls":"スーフォールズ","Spokane":"スポケーン","Springfield":"スプリングフィールド","St. Louis":"セントルイス","St. Paul":"セントポール","Tallahassee":"タラハシー","Tampa":"タンパ","Topeka":"トピーカ","Tucson":"ツーソン","Tulsa":"タルサ","Tuscaloosa":"タスカルーサ","Virginia Beach":"バージニアビーチ","Wichita":"ウィチタ","Wilmington":"ウィルミントン","Worcester":"ウースター"}
}};
g.I18N={T:T,D:D,dim:function(lang,dim,v){if(lang!=="ja")return v;var m=D.ja[dim];return (m&&m[v])||v;}};
})(typeof window!=="undefined"?window:globalThis);
