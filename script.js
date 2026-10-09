
// Custom app alert: always visible and tappable in light or dark mode.
(function(){
  function installAlert(){
    if(document.getElementById('appAlertOverlay')) return;
    const wrap=document.createElement('div');
    wrap.id='appAlertOverlay';
    wrap.innerHTML=`<div class="app-alert-box" role="alertdialog" aria-modal="true" aria-labelledby="appAlertMessage"><div class="app-alert-title">Notice</div><div id="appAlertMessage" class="app-alert-message"></div><button type="button" id="appAlertOk">OK</button></div>`;
    document.body.appendChild(wrap);
    const close=()=>{wrap.classList.remove('show');};
    document.getElementById('appAlertOk').addEventListener('click',close);
    wrap.addEventListener('click',e=>{if(e.target===wrap) close();});
  }
  window.addEventListener('DOMContentLoaded',installAlert);
  window.alert=function(message){
    installAlert();
    const wrap=document.getElementById('appAlertOverlay');
    document.getElementById('appAlertMessage').textContent=String(message ?? '');
    wrap.classList.add('show');
    setTimeout(()=>document.getElementById('appAlertOk')?.focus(),0);
  };
})();

const NETWORKS=["GLOBE","TM","DITO","SMART","TNT","GOMO","GFIBER","GLOBE AT HOME","PLDT","CIGNAL","GTM RETAILER BALANCE","SMART LOAD WALLET RETAILER BALANCE"];

const promos={

SMART:[
["POWER ALL 50 (formely 59)","5GB + 3GB 5G Data + Unli Calls & Texts (3 Days)",57,false],
["POWER ALL KHAN ACADEMY 99","Unli Khan Academy Access + 10GB + Unli Calls & Texts (7 Days)",96,false],
["NEW POWER ALL GRIND 99","7GB Google Drive, Google Meet & more + 10GB Shareable Data + 4GB 5G Data + Unli Calls & Texts (7 Days)",96,true],
["NEW POWER ALL GAME 99","7GB MLBB, COD & more + 10GB Shareable Data + 4GB 5G Data + Unli Calls & Texts (7 Days)",96,true],
["NEW POWER ALL BINGE 99","7GB YouTube, Viu & more + 10GB Shareable Data + 4GB 5G Data + Unli Calls & Texts (7 Days)",96,true],
["NEW POWER ALL SHARE 99","7GB FB, TikTok, Viber & more + 10GB Shareable Data + 4GB 5G Data + Unli Calls & Texts (7 Days)",96,true],
["NEW POWER ALL GRIND 99","7GB Google Drive, Google Meet & more + 10GB Shareable Data + 4GB 5G Data + Unli Calls & Texts (7 Days)",96,true],
["NEW POWER ALL TIKTOK + BINGE 109","UNLI TikTok + 5 GB YouTube, Viu and more + 10 GB Shareable Data + 4 GB 5G DATA + Unli Calls & Texts Best for personal use (7 Days)",106,true],
["NEW POWER ALL TIKTOK + SHARE 109","UNLI TikTok + 5 GB FB, IG, Viber and more + 10 GB Shareable Data + 4 GB 5G DATA + Unli Calls & Texts Best for personal use (7 Days)",106,true],
["NEW POWER ALL TIKTOK + GAME 109","UNLI TikTok + 5 GB MLBB, COD and more + 10 GB Shareable Data + 4 GB 5G DATA + Unli Calls & Texts Best for personal use (7 Days)",106,true],
["NEW POWER ALL TIKTOK + GRIND 109","UNLI TikTok + 5 GB Google Drive, Google Meet and more + 10 GB Shareable Data + 4 GB 5G DATA + Unli Calls & Texts Best for personal use. (7 Days)",106,true],
["NEW POWER ALL SHARE w/CPLAY 109","7 GB FB, Tik Tok, Viber and more + 10 GB Shareable Data + 4 GB 5G DATA + Unli Calls & Texts with CPlay Lite subscription Best for personal use. (7 Days)",106,true],
["NEW POWER ALL GAME w/CPLAY 109","7 GB MLBB, COD and more + 10 GB Shareable Data + 4 GB 5G DATA + Unli Calls & Texts with CPlay Lite subscription Best for personal use. (7 Days)",106,true],
["NEW POWER ALL TIKTOK + GRIND 149","UNLI TikTok + 5 GB Google Drive, Meet and more + 16 GB Shareable Data + 5 GB 5G DATA + Unli Calls & Texts Best for personal use. (7 Days)",145,true],
["NEW POWER ALL TIKTOK + BINGE 149","UNLI TikTok + 5 GB YouTube, Viu and more + 16 GB Shareable Data + 5 GB 5G DATA + Unli Calls & Texts for Best for personal use. (7 Days)",145,true],
["NEW POWER ALL FB + GRIND 149","UNLI FB + 5 GB Google Drive, Google Meet and more + 16 GB Shareable Data + 5 GB 5G DATA + Unli Calls & Texts Best for personal use. (7 Days)",145,true],
["NEW POWER ALL FB + GAME 149","UNLI FB + 5 GB MLBB, COD and more + 16 GB Shareable Data + 5 GB 5G DATA + Unli Calls & Texts Best for personal use. (7 Days)",145,true],
["NEW POWER ALL FB + SHARE 149","UNLI FB + 5 GB TikTok, IG, Viber and more + 16 GB Shareable Data + 5 GB 5G DATA + Unli Calls & Texts Best for personal use. (7 Days)",145,true],
["NEW POWER ALL FB + BINGE 149","UNLI FB + 5 GB YouTube, Viu and more + 16 GB Shareable Data + 5 GB 5G DATA + Unli Calls & Texts Best for personal use. (7 Days)",145,true],
["POWER ALL YOUTUBE 109","7GB YouTube + 10GB + 5GB 5G Data + Unli Calls & Texts (7 Days)",106,false],
["NEW POWER ALL FB + GRIND 449","Unli FB + 20GB Google Drive, Google Meet & more + 30GB Shareable Data + 15GB 5G Data + Unli Calls & Texts (28 Days)",436,true],
["NEW POWER ALL TIKTOK + GAME 449","Unli TikTok + 20GB MLBB, COD & more + 30GB Shareable Data + 15GB 5G Data + Unli Calls & Texts (28 Days)",436,true],

["UNLI 5G w/ NSD 35","UNLI 5G + NON-STOP 4G DATA Best for personal use (1 Day)",34,false],
["UNLI 5G w/ NSD 90","UNLI 5G + NON-STOP 4G DATA Best for personal use. (3 Days)",87,false],
["UNLI 5G w/ NSD 195","UNLI 5G + NON-STOP 4G DATA Best for personal use. (7 Days)",189,false],
["UNLI 5G w/ NSD 399","UNLI 5G + NON-STOP 4G DATA Best for personal use. (15 Days)",387,false],
["UNLI 5G w/ NSD 749","UNLI 5G + NON-STOP 4G DATA Best for personal use. (28 Days)",727,false],

["MAGIC DATA 149","3 GB NO EXPIRY DATA",145,false],
["MAGIC DATA+ 199","TOTAL 4 GB NO EXPIRY DATA: 3 GB + 1 GB 5G DATA for all sites w/ 50 Mins CALLS to ANY mobile and landline + 50 TEXTS",193,false],
["MAGIC DATA 249","8 GB NO EXPIRY DATA",242,false],
["MAGIC DATA+299","TOTAL 10 GB NO EXPIRY DATA: NOW 8 GB + 2 GB 5G DATA for all sites w/ 100 Mins CALLS to ANY mobile and landline + 100 TEXTS",290,false],
["MAGIC DATA 349","16 GB NO EXPIRY DATA",339,false],
["MAGIC DATA+ 399","TOTAL 19 GB NO EXPIRY DATA: 16 GB + 3 GB 5G DATA for all sites w/ 150 Mins CALLS to ANY mobile and landline + 150 TEXTS",387,false],
["MAGIC DATA 449","26 GB NO EXPIRY DATA",436,false],
["MAGIC DATA+ 499","TOTAL 30 GB NO EXPIRY DATA: 26 GB + 4 GB 5G for all sites w/ 200 Mins CALLS to ANY mobile and landline + 200 TEXTS",484,false],
["MAGIC DATA 549","38 GB NO EXPIRY DATA",533,false],
["MAGIC DATA 649","50 GB NO EXPIRY DATA",630,false],
["MAGIC DATA+ 699","TOTAL 50 GB NO EXPIRY DATA: 44 GB + 6 GB 5G DATA for all sites w/ 300 Mins CALLS to ANY mobile and landline + 300 TEXTS",678,false],
["MAGIC DATA 749","65 GB NO EXPIRY DATA",727,false],
["MAGIC DATA+ 799","TOTAL 64 GB NO EXPIRY DATA: 56 GB + 8 GB 5G DATA for all sites w/ 600 Mins CALLS to ANY mobile and landline + 600 TEXTS",775,false],
["MAGIC DATA+ 899","TOTAL 85 GB NO EXPIRY DATA: 75 GB + 10 GB 5G DATA for all sites w/ 900 Mins CALLS to ANY mobile and landline + 900 TEXTS",872,false],
["New! MAGIC DATA 988","88 GB NO EXPIRY DATA for all sites. Maintain at least P1 load to keep your SIM active.",958,false],

["DOUBLE GIGA VIDEO+75","TOTAL 9 GB: 2 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (6 GB) + 3 GB + UNLI CALLS & TEXTS (3 Days)",73,false],
["DOUBLE GIGA STORIES+75","TOTAL 9 GB-NOW 3 GB + 2 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (6 GB) + FREE UNLI CALLS & TEXTS (3 Days)",73,false],
["DOUBLE GIGA VIDEO+149","TOTAL 20 GB: 2 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (14 GB) + 6 GB + UNLI CALLS & TEXTS (7 Days)",145,false],
["DOUBLE GIGA STORIES+ 149","TOTAL 20 GB 6GB + 2 GB STORIES EVERY DAY for Tik Tok, IG, FB, X, Kumu (14 GB) + UNLI CALLS & TEXTS (7 Days)",145,false],
["GIGA POWER 75","2 GB POWER EVERYDAY FOR ALL SITES & APPS + 2 GB SHAREABLE DATA. Valid for Also available for Smart FLP (Fixed Load Plan) (3 Days)",73,false],
["GIGA POWER 499","TOTAL 85 GB: NOW 29 GB + 2GB POWER EVERY DAY FOR ALL SITES & APPS (56 GB) (28 Days)",484,false],

["TRIPLE DATA STORIES+ 75","With 3X MORE Shareable Data, TOTAL 7 GB - NOW 4 GB + 1 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (3 GB) + FREE UNLI CALLS & TEXTS (3 Days)",73,false],
["TRIPLE DATA VIDEO+ 75","TOTAL 7 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (3 GB) + 4 GB + UNLI CALLS & TEXTS (3 Days)",73,false],
["TRIPLE DATA STORIES+ 149","With 3X MORE Shareable Data. TOTAL 15 GB-8 GB+1 GB STORIES EVERY DAY for Tik Tok, IG, FB, X, Kumu (7 GB) + UNLI CALLS & TEXTS (7 Days)",145,false],
["GIGA VIDEO 60","TOTAL 6 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (3 GB) + 3 GB + UNLI Texts (3 Days)",58,false],
["GIGA VIDEO 99","TOTAL 9 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (7 GB) + 2 GB (7 Days)",96,false],
["GIGA VIDEO 120","TOTAL 13 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (7 GB) + 6 GB (7 Days)",116,false],
["GIGA VIDEO 349","TOTAL 40 GB: NOW 12 GB + 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (28 GB) (28 Days)",339,false],
["GIGA GAMES 60","TOTAL 5 GB 2GB + 1 GB GAMES EVERY DAY for ML, PUBG Mobile, Call of Duty, Wild Rift, CoC, AoV, Clash Royale, FB Gaming, Giga Arena (3 Days)",58,false],
["GIGA GAMES 120","TOTAL 13 GB6GB + 1 GB GAMES EVERY DAY for ML, PUBG Mobile, Call of Duty, Wild Rift, CoC, AoV, Clash Royale, FB Gaming, Giga Arena (7 GB) (7 Days)",116,false],
["GIGA STORIES 60","TOTAL 6 GB NOW 3 GB + 1 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (3 GB) (3 Days)",58,false],
["GIGA STORIES 120","TOTAL 13 GB-6 GB + 1 GB STORIES EVERY DAY for Tik Tok, IG, FB, X, Kumu (7 GB) (7 Days)",116,false],
["GIGA STORIES 349","TOTAL 40 GB: NOW 12 GB + 1 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (28 GB) (28 Days)",339,false],

["PROMO LOAD P100 + FREE P5","PROMO LOAD and FREE LOAD valid for 30 days.Use to register to promos with up to 30 days validity and without expiry. Cannot be used as Pasaload, for Value Added Services, as Payment and for buying Roaming & International Servic...(30 Days)",97,false],

["REGULAR LOAD 30","P30 Regular Load. Valid for (1 Year)",29,false],
["REGULAR LOAD 50","P50 Regular Load. Valid for (1 Year)",49,false],
["REGULAR LOAD 100","P100 Regular Load valid for (1 Year)",97,false],
["REGULAR LOAD 125","P125 Regular Load valid for (1 Year)",121,false],
["REGULAR LOAD 150","P150 Regular Load valid for (1 Year)",146,false],
["REGULAR LOAD 200","P200 Regular Load valid for (1 Year)",194,false],
["REGULAR LOAD 300","P300 Regular Load valid for (1 Year)",291,false],
["REGULAR LOAD 500","P500 Regular Load valid for (1 Year)",485,false],
["REGULAR LOAD 1000","P1000 Regular Load valid for (1 Year)",970,false],

],
TNT:[
["TIKTOK SAYA 50 w/ 5G DATA","Unli Tik Tok + 3 GB + 2GB 5G Data + Unli Calls & Texts for (3 Days)",49,false],
["SAYA ALL 50","Total 9 GB: 3 GB Tik Tok + 3 GB FB + 3 GB + Unli Calls & Texts Best for personal use. (3 days)",49,false],
["New! SAYA ALL 99 with FREE 1 GB","10 GB Tik Tok, FB & MLBB + 3 GB 5G DATA + 7 GB Shareable Data + FREE 1 GB + Unli Calls & Texts for (7 days)",96,true],
["New! SAYA ALL 109","UNLI TikTok, FB and MLBB + 3 GB 5G DATA + 7 GB Shareable Data + Unli Calls & Texts Best for personal use. (7 days)",106,true],
["New! SAYA ALL 109 with CPlay Lite","10 GB Tik Tok, FB & MLBB + 3 GB 5G DATA + 7 GB Shareable Data + Unli Calls & Texts with CPlay Lite subscription for (7 days)",106,true],
["New! SAYA ALL 149","UNLI TikTok, FB and MLBB + 7 GB 5G DATA + 12 GB Shareable Data + Unli Calls & Texts Best for personal use. (7 days)",145,true],
["New! SAYA ALL 449","UNLI Tik Tok, FB and MLBB + 15 GB 5G DATA + 20 GB Shareable Data + Unli Calls & Texts Best for personal use. (28 days)",436,true],


["UNLI 5G w/ NSD 35","UNLI 5G + NON-STOP 4G DATA Best for personal use (1 Day)",34,false],
["UNLI 5G w/ NSD 90","UNLI 5G + NON-STOP 4G DATA Best for personal use. (3 Days)",87,false],
["UNLI 5G w/ NSD 195","UNLI 5G + NON-STOP 4G DATA Best for personal use. (7 Days)",189,false],
["UNLI 5G w/ NSD 399","UNLI 5G + NON-STOP 4G DATA Best for personal use. (15 Days)",387,false],
["UNLI 5G w/ NSD 749","UNLI 5G + NON-STOP 4G DATA Best for personal use. (28 Days)",727,false],

["SURFSAYA 20","TOTAL 600 MB. 150 MB ARAW-ARAW for Tik Tok and MORE (300 MB) + 300 MB + Unli Calls & Texts for (2 days)",20,false],
["SURFSAYA 25","TOTAL 900 MB. 250 MB ARAW-ARAW for TikTok and MORE (500 MB) + 400 MB + Unli Calls & Texts for (2 days)",25,false],
["SURFSAYA 30","TOTAL 1.35 GB. 250 MB ARAW-ARAW for TikTok and MORE (750 MB) + NOW 600 MB + Unli Calls & Texts for (3 days)",29,false],
["SURFSAYA 35","TOTAL 2.4 GB. 500 MB ARAW-ARAW for Tik Tok and MORE (1.5 GB) + 900 MB + Unli Calls & Texts for (3 days)",34,false],
["SURFSAYA 49","TOTAL 1.2 GB. 100 MB ARAW-ARAW for Tik Tok and MORE (700 MB) + 500 MB + Unli Calls & Texts for (7 days)",48,false],
["SURFSAYA 99","TOTAL 2.2 GB. 100 MB ARAW-ARAW for Tik Tok and MORE (700 MB) + 1.5 GB + Unli Calls & Texts for (7 days)",96,false],
["SURFSAYA 199","TOTAL 8 GB. 200 MB ARAW-ARAW for Tik Tok and MORE (6 GB) + 2 GB + Unli Calls & Texts for (30 days)",193,false],

["PANALO 10","300 MB + 60 Mins Calls + 60 Texts for (1 day)",10,false],
["PANALO 15","600 MB + 120 Mins Calls + 120 Texts for (1 day)",15,false],
["PANALO 20","1 GB + NOW with 250 Mins Calls to Mobile + 250 Texts valid for (1 day)",20,false],
["PANALO 30","2 GB + 500 Mins Calls + 500 Texts for (2 days)",29,false],

["DOUBLE GIGA VIDEO+75","TOTAL 9 GB: 2 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (6 GB) + 3 GB + UNLI CALLS & TEXTS (3 Days)",73,false],
["DOUBLE GIGA STORIES+75","TOTAL 9 GB-NOW 3 GB + 2 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (6 GB) + FREE UNLI CALLS & TEXTS (3 Days)",73,false],
["DOUBLE GIGA VIDEO+149","TOTAL 20 GB: 2 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (14 GB) + 6 GB + UNLI CALLS & TEXTS (7 Days)",145,false],
["DOUBLE GIGA STORIES+ 149","TOTAL 20 GB 6GB + 2 GB STORIES EVERY DAY for Tik Tok, IG, FB, X, Kumu (14 GB) + UNLI CALLS & TEXTS (7 Days)",145,false],
["GIGA POWER 75","2 GB POWER EVERYDAY FOR ALL SITES & APPS + 2 GB SHAREABLE DATA. Valid for Also available for Smart FLP (Fixed Load Plan) (3 Days)",73,false],

["TRIPLE DATA STORIES+ 75","With 3X MORE Shareable Data, TOTAL 7 GB - NOW 4 GB + 1 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (3 GB) + FREE UNLI CALLS & TEXTS (3 Days)",73,false],
["TRIPLE DATA VIDEO+ 75","TOTAL 7 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (3 GB) + 4 GB + UNLI CALLS & TEXTS (3 Days)",73,false],
["TRIPLE DATA STORIES+ 149","With 3X MORE Shareable Data. TOTAL 15 GB-8 GB+1 GB STORIES EVERY DAY for Tik Tok, IG, FB, X, Kumu (7 GB) + UNLI CALLS & TEXTS (7 Days)",145,false],

["GIGA VIDEO 60","TOTAL 6 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (3 GB) + 3 GB + UNLI Texts (3 Days)",58,false],
["GIGA VIDEO 99","TOTAL 9 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (7 GB) + 2 GB (7 Days)",96,false],
["GIGA VIDEO 120","TOTAL 13 GB: 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (7 GB) + 6 GB (7 Days)",116,false],
["GIGA VIDEO 349","TOTAL 40 GB: NOW 12 GB + 1 GB VIDEO EVERY DAY for YouTube, Netflix, iWantTFC (28 GB) (28 Days)",339,false],
["GIGA GAMES 60","TOTAL 5 GB 2GB + 1 GB GAMES EVERY DAY for ML, PUBG Mobile, Call of Duty, Wild Rift, CoC, AoV, Clash Royale, FB Gaming, Giga Arena (3 Days)",58,false],
["GIGA GAMES 120","TOTAL 13 GB6GB + 1 GB GAMES EVERY DAY for ML, PUBG Mobile, Call of Duty, Wild Rift, CoC, AoV, Clash Royale, FB Gaming, Giga Arena (7 GB) (7 Days)",116,false],
["GIGA STORIES 60","TOTAL 6 GB NOW 3 GB + 1 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (3 GB) (3 Days)",58,false],
["GIGA STORIES 120","TOTAL 13 GB-6 GB + 1 GB STORIES EVERY DAY for Tik Tok, IG, FB, X, Kumu (7 GB) (7 Days)",116,false],
["GIGA STORIES 349","TOTAL 40 GB: NOW 12 GB + 1 GB STORIES EVERY DAY for TikTok, IG, FB, X, Kumu (28 GB) (28 Days)",339,false],

["REGULAR LOAD 30","P30 Regular Load. Valid for (1 Year)",29,false],
["REGULAR LOAD 50","P50 Regular Load. Valid for (1 Year)",49,false],
["REGULAR LOAD 100","P100 Regular Load valid for (1 Year)",97,false],
["REGULAR LOAD 125","P125 Regular Load valid for (1 Year)",121,false],
["REGULAR LOAD 150","P150 Regular Load valid for (1 Year)",146,false],
["REGULAR LOAD 200","P200 Regular Load valid for (1 Year)",194,false],
["REGULAR LOAD 300","P300 Regular Load valid for (1 Year)",291,false],
["REGULAR LOAD 500","P500 Regular Load valid for (1 Year)",485,false],
["REGULAR LOAD 1000","P1000 Regular Load valid for (1 Year)",970,false],

],
DITO:[
["DITO Level-Up 99 (15 days)","9GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 150 Mins Calls to Other Networks (15 days)",95,false],
["DITO Level-Up 99 (30 days)","7GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks (30 days)",95,false],
["DITO Level-Up 109","10GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks (30 days)",104,false],
["DITO Level-Up 129","12GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks + Prime Video Access (30 days)",124,false],
["DITO Level-Up 169","16GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks + Prime Video Access (30 days)",162,false],
["DITO Level-Up 199","20GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks + Prime Video Access (30 days)",190,false],
["DITO Level-Up 299","32GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks + Prime Video Access (30 days)",286,false],
["DITO Level-Up 499","62GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks + Prime Video Access (30 days)",477,false],
["DITO Level-Up 999","130GB All-Access Data + Unlimited Texts to All Networks + Unlimited DITO-to-DITO Calls + Unlimited DITO-to-DITO Video Calls + 300 Mins Calls to Other Networks + Prime Video Access (30 days)",955,false],

["Data Maxx 50","7GB All-Access Data + UNLI Calls & Texts to All Networks + UNLI DITO-to-DITO Video Calls with no data charge (5 days)",48,true],
["Data Maxx 70","10GB All-Access Data + UNLI Calls & Texts to All Networks + UNLI DITO-to-DITO Video Calls with no data charge (7 days)",67,true],
["Data Maxx 129","15GB All-Access Data + UNLI Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + UNLI Calls & Texts to All Networks + UNLI DITO-to-DITO Video Calls (15 days)",123,true],
["Data Maxx 149","20GB All-Access Data + UNLI Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + UNLI Calls & Texts to All Networks + UNLI DITO-to-DITO Video Calls (15 days)",142,true],
["Data Maxx 299","30GB All-Access Data + UNLI Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + UNLI Calls & Texts to All Networks + UNLI DITO-to-DITO Video Calls (30 days)",286,true],

["Level-Up Gaming 29","3GB Data for Gaming Apps (2 days)",28,true],
["Level-Up Gaming 39","5GB Data for Gaming Apps + UNLI 5G for supported gaming apps (5 days)",37,true],
["Level-Up Gaming 59","8GB Data for Gaming Apps + UNLI 5G for supported gaming apps (7 days)",56,true],

["Level-Up YouTube 99","12GB Total Data: 10GB YouTube Data + 2GB All-Access Data + UNLI 5G for YouTube + FREE YouTube from 4:00AM-8:00AM (15 days)",95,false],
["Level-Up YouTube 199","26GB Total Data: 22GB YouTube Data + 4GB All-Access Data + UNLI 5G for YouTube + FREE YouTube from 4:00AM-8:00AM (30 days)",190,false],
["Level-Up YouTube 299","40GB Total Data: 30GB YouTube Data + 10GB All-Access Data + UNLI 5G for YouTube + FREE YouTube from 4:00AM-8:00AM + Unlimited Texts to All Networks + Unlimited Calls DITO-to-DITO + 300 Mins Calls to Other Networks (30 days)",286,false],

["StreamZone99","5GB All-Access Data + 5GB Streaming Data + Unlimited Mobile Calls and Texts to All Networks + Free iWant and BlastTV Vouchers (15 days)",95,false],
["StreamZone199","11GB All-Access Data + 11GB Streaming Data + Unlimited Mobile Calls and Texts to All Networks + Free Prime Video Mobile Access for 30 days + Free iWant and BlastTV Vouchers (30 days)",190,false],

["5G Maxx 50","15GB 5G Data + 3GB All-Access Data + Unlimited Calls & Texts to All Mobile Networks + Unlimited DITO-to-DITO Video Calls with no data charge (3 days)",48,true],
["Unli 5G Maxx 99","Unlimited 5G Data + 5GB All-Access Data + Unlimited Calls & Texts to All Mobile Networks + Unlimited DITO-to-DITO Video Calls with no data charge (3 days)",95,true],
["Unli 5G Maxx 149","Unlimited 5G Data + 15GB All-Access Data + Unlimited Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + Unlimited Calls & Texts to All Networks + Unlimited DITO-to-DITO Video Calls with no data charge (7 days)",142,true],
["Unli 5G Maxx 249","Unlimited 5G Data + 20GB All-Access Data + Unlimited Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + Unlimited Calls & Texts to all networks (Mobile) + Unlimited Video Calls DITO-to-DITO with no data charge (15 days)",238,true],
["Unli 5G Maxx 449","Unlimited 5G Data + 30GB All-Access Data + Unlimited Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + Unlimited Calls & Texts to all networks (Mobile) + Unlimited Video Calls DITO-to-DITO with no data charge (30 days)",429,true],

["Level-Up Socials 20","2GB Data for Facebook, Messenger, Instagram, WhatsApp & Threads + 500MB All-Access Data (1 day)",19,false],
["Level-Up Socials 50","3.5GB Data for Facebook, Messenger, Instagram, WhatsApp & Threads + 3.5GB All-Access Data (3 days)",48,false],
["Level-Up Socials 70","Unli Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + 5GB All-Access Data (7 days)",67,false],
["Level-Up Socials 299","Unli Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + 5GB All-Access Data (30 days)",286,false],
["Level-Up Socials 399","Unli Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + 10GB All-Access Data (30 days)",381,false],
["Level-Up Socials 499","Unli Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + 15GB All-Access Data (30 days)",477,false],
["Level-Up Socials 599","Unli Data for Facebook, Messenger, Instagram, WhatsApp, Threads & TikTok + 20GB All-Access Data (30 days)",573,false],

["Live It!","7GB Data for selected social, messaging, video, shopping & productivity apps + 1GB All-Access Data (7 days)",48,false],
["Play It!","7GB Data for selected gaming, social, messaging, video & streaming apps + 1GB All-Access Data (7 days)",48,false],
["Work It!","7GB Data for selected communication, productivity, navigation & work apps + 1GB All-Access Data (7 days)",48,false],

["DITO Data 50","5GB All-Access Data (7 days)",48,false],
["DITO Data Sachet 30","3GB All-Access Data (3 days)",29,false],
["DITO Data Sachet 20","2GB All-Access Data (1 day)",19,false],
["DITO Data Sachet 10","500MB All-Access Data (1 day)",10,false],

["DITO REGULAR LOAD 5","P5 Regular Load.",5,false],
["DITO REGULAR LOAD 10","P10 Regular Load.",10,false],
["DITO REGULAR LOAD 20","P20 Regular Load.",20,false],
["DITO REGULAR LOAD 30","P29 Regular Load.",29,false],
["DITO REGULAR LOAD 50","P49 Regular Load.",49,false],
["DITO REGULAR LOAD 100","P97 Regular Load.",97,false],
["DITO REGULAR LOAD 200","P194 Regular Load.",194,false],
["DITO REGULAR LOAD 300","P291 Regular Load.",291,false],
["DITO REGULAR LOAD 500","P485 Regular Load.",485,false],
["DITO REGULAR LOAD 1000","P970 Regular Load.",970,false],

],
GLOBE:[
["GoWATCH10","1GB GoWATCH Data; 1 day",9,false],
["GoSHARE10","1GB GoSHARE Data; 1 day",9,false],
["GoPLAY10","1GB GoPLAY Data; 1 day",9,false],
["GoCALL10","Unli All-Net Calls; 1 day",9,false],
["GoBOOST15","1GB All Sites Data; 1 day",14,false],
["GoUNLI20","50MB All Sites + Unli All-Net Calls + Texts; 1 day",18,false],
["GoUNLI30","100MB All Sites + Unli All-Net Calls + Texts; 2 days",27,false],
["GoUNLI50","500MB All Sites + Unli All-Net Calls + Texts; 3 days",45,false],
["GoUNLI350","3GB All-Sites Data + Unli Allnet Calls + Unli Allnet Texts (30 days)",315,false],

["Go59","5GB All Sites + Free 1GB 5G + Unli All-Net Texts; 3 days",53,false],
["Go59 for Students","5GB All Sites + 1GB Apps + Free 1GB 5G + Unli Texts; 3 days",53,false],

["UNLI 5G 59","Unli 5G + 2GB All-Sites Data (2 days)",53,false],

["Go+99","20GB Total Data + Unli Allnet Texts (7 days)",89,false],
["Go+99 with GoWATCH","20GB Total Data + GoWATCH + Unli Allnet Texts (7 days)",89,false],
["Go+99 with GoPLAY","20GB Total Data + GoPLAY + Unli Allnet Texts (7 days)",89,false],
["Go+99 with GoLEARN","20GB Total Data + GoLEARN + Unli Allnet Texts (7 days)",89,false],
["Go+99 with GoSHARE","20GB Total Data + GoSHARE + Unli Allnet Texts (7 days)",89,false],
["Go+109","22GB Total Data + Unli Allnet Texts + Discount Voucher (7 days)",98,false],
["Go+129","27GB Total Data + Unli Allnet Texts + Discount Voucher (7 days)",116,false],
["Go+149","29GB Total Data (13GB Data + 8GB Apps + 8GB 5G) + Unli Allnet Texts + Discount Voucher (7 days)",134,false],
["Go+179","24GB Total Data (8GB Data + 8GB 5G + 8GB Apps) + Unli Allnet Texts + Discount Voucher (15 days)",161,false],
["Go+250","15GB Data + 8GB 5G Data + 15GB Apps Data + Discount Voucher (15 days)",225,false],
["Go+400","48GB Total Data (25GB Data + 8GB 5G + 15GB Apps) + Discount Voucher (15 days)",360,false],

["UnliGo99 Facebook","5GB All-Sites Data + Unli Allnet Texts (7 days)",89,false],
["UnliGo99 TikTok","5GB All-Sites Data + Unli Allnet Texts (7 days)",89,false],
["UnliGo99 Instagram","5GB All-Sites Data + Unli Allnet Texts (7 days)",89,false],

["GoEXTRA59","5GB Data + Unli All-Net Calls + Unli Texts; 3 days",53,false],
["GoEXTRA99","11GB Total Data + Unli Allnet Calls + Unli Allnet Texts (7 days)",89,false],
["GoEXTRA109","14GB Total Data + Unli Allnet Calls + Unli Allnet Texts (7 days)",98,false],
["GoEXTRA199","16GB Total Data + Unli Allnet Calls (15 days)",179,false],
["GoEXTRA149","21GB Total Data (13GB Data + 8GB 5G) + Unli Allnet Calls + Unli Allnet Texts (7 days)",134,false],
["GoEXTRA179","13GB Total Data (5GB Data + 8GB 5G) + Unli Allnet Calls + Unli Allnet Texts (15 days)",161,false],
["GoEXTRA199","16GB Total Data (8GB Data + 8GB 5G) + Unli Allnet Calls + Unli Allnet Texts (15 days)",179,false],

["SURF4ALL99","9GB Shareable All-Sites Data (7 days)",89,false],
["SURF4ALL249","20GB Shareable All-Sites Data (7 days)",209,false],

["GLOBE REGULAR LOAD 10","P10 Regular Load.",9,false],
["GLOBE REGULAR LOAD 20","P19 Regular Load.",18,false],
["GLOBE REGULAR LOAD 30","P28 Regular Load.",27,false],
["GLOBE REGULAR LOAD 50","P47 Regular Load.",45,false],
["GLOBE REGULAR LOAD 100","P93 Regular Load.",90,false],
["GLOBE REGULAR LOAD 200","P186 Regular Load.",180,false],
["GLOBE REGULAR LOAD 300","P279 Regular Load.",270,false],
["GLOBE REGULAR LOAD 500","P465 Regular Load.",450,false],
["GLOBE REGULAR LOAD 1000","P930 Regular Load.",900,false],

],
TM:[

["All-Net SURF 10","200MB: 100MB + 100MB FB/ML + 200 mins Allnet Calls + 200 Allnet Texts (1 day)",9,false],
["FBML15","1GB FB and ML (3 days)",14,false],
["COMBO15","120 mins Globe/TM + Unli Allnet Texts (2 days)",14,false],
["Unli iTxt20","Unli International SMS to select countries (1 day)",18,false],
["AN20","600MB: 300MB + 150MB/Day FunALIW + Unli Allnet Calls + Unli Allnet Texts (2 days)",18,false],
["PowerSURF20","1GB Data + 250 Mins Allnet Calls + 250 Allnet Texts (1 day)",18,false],
["All-Net SURF 20","600MB: 300MB + 150MB/Day FunALIW + Unli Allnet Calls + Unli Allnet Texts (2 days)",18,false],
["COMBO20","120 mins Globe/TM + Unli Allnet Texts (3 days)",18,false],
["COMBOALL20","Unli Globe/TM Calls + Unli Globe/TM + 50 Allnet Texts (3 days)",18,false],
["BIG BENTE","1.5GB FB, ML and TikTok (3 days)",18,false],
["GoCallIDD30","PHP 30 worth of IDD Credits (7 days)",27,false],
["PowerSURF30","2GB: 1GB Data + 1GB FunALIW + Unli Allnet Calls + Unli Allnet Texts (2 days)",27,false],
["All-Net SURF 30","1.2GB: 750MB + 150MB/Day FunALIW + Unli Allnet Calls + Unli Allnet Texts (3 days)",27,false],
["GoCallIDD50","PHP 50 worth of IDD Credits (15 days)",45,false],
["EZ50 5G FunALIW","9GB: 3GB + 3GB 5G + 1GB/Day FunALIW + Unli Allnet Texts (3 days)",45,false],
["EZ50 5G FunACHIEVE","9GB: 4GB + 2GB 5G + 1GB/Day FunACHIEVE + Unli Allnet Texts (3 days)",45,false],
["All-Net SURF 70","1.2GB: 1GB + 200MB FunALIW + Unli Allnet Calls + Unli Allnet Texts (7 days)",63,false],
["EZ75 FunALIW","8GB: 2GB + 2GB/Day FunALIW + Unli Allnet Calls + Unli Allnet Texts (3 days)",68,false],
["EZ75 FunACHIEVE","8GB: 2GB + 2GB/Day FunACHIEVE + Unli Allnet Calls + Unli Allnet Texts (3 days)",68,false],
["EZ99 5G","17GB: 3GB + 2GB/Day 5G + Unli Allnet Texts (7 days)",89,false],
["EZ99 FunALIW","17GB: 3GB + 2GB/Day FunALIW + Unli Allnet Texts (7 days)",89,false],
["EZ99 FunACHIEVE","17GB: 3GB + 2GB/Day FunACHIEVE + Unli Allnet Texts (7 days)",89,false],
["PowerSURF99","10GB: 3GB Data + 6GB FunALIW + 1GB 5G + Unli Allnet Calls + Unli Allnet Texts (7 days)",89,false],
["ALLSURF99","18GB: 7GB + 1GB/Day FunALIW + 4GB 5G + Unli Allnet Texts (7 days)",89,false],
["SURF4ALL99","9GB Shareable All-Sites Data (7 days)",89,false],
["GoCallIDD99","PHP 99 worth of IDD Credits (30 days)",89,false],
["EZ110 FunALIW","18GB: 4GB + 2GB/Day FunALIW + Unli Allnet Texts (7 days)",99,false],
["EZ110 5G","18GB: 4GB + 2GB/Day 5G + Unli Allnet Texts (7 days)",99,false],
["ALLSURF110","19GB: 8GB + 1GB/Day FunALIW + 4GB 5G + Unli Allnet Texts (7 days)",99,false],
["EZ140 FunALIW","18GB: 4GB + 2GB/Day FunALIW + Unli Allnet Calls + Unli Allnet Texts (7 days)",126,false],
["EZ140 FunACHIEVE","18GB: 4GB + 2GB/Day FunACHIEVE + Unli Allnet Calls + Unli Allnet Texts (7 days)",126,false],
["EZ140 5G","18GB: 4GB + 2GB/Day 5G + Unli Allnet Calls + Unli Allnet Texts (7 days)",126,false],
["ALLSURF149","19GB + 8GB 5G: 12GB + 1GB/Day FunALIW + 8GB 5G + Unli Allnet Calls + Unli Allnet Texts (7 days)",134,false],
["TM EasyPlan159","34GB: 2GB Data + 2GB/Day Apps + 2GB 5G + Unli Allnet Calls + Unli Allnet Texts (15 days)",143,false],
["GoCallIDD199","PHP 200 worth of IDD Credits (30 days)",179,false],
["SURF4ALL249","20GB Shareable All-Sites Data (7 days)",224,false],
["EZ299","12GB: 2GB + 10GB FunALIW or FunACHIEVE (30 days)",269,false],
["TM EasyPlan300","64GB: 2GB Data + 2GB/Day Apps + 2GB 5G + Unli Allnet Calls + Unli Allnet Texts (30 days)",270,false],

["TM REGULAR LOAD 10","P10 Regular Load.",9,false],
["TM REGULAR LOAD 20","P19 Regular Load.",18,false],
["TM REGULAR LOAD 30","P28 Regular Load.",27,false],
["TM REGULAR LOAD 50","P47 Regular Load.",45,false],
["TM REGULAR LOAD 100","P93 Regular Load.",90,false],
["TM REGULAR LOAD 200","P186 Regular Load.",180,false],
["TM REGULAR LOAD 300","P279 Regular Load.",270,false],
["TM REGULAR LOAD 500","P465 Regular Load.",450,false],
["TM REGULAR LOAD 1000","P930 Regular Load.",900,false],
],
GOMO:[
["GOMO7GB149","7GB No Expiry Data + UNLI Calls & Texts (7 days)",134,false],
["GOMO15GB249","15GB No Expiry Data + UNLI Calls & Texts (7 days)",224,false],
["GOMO30GB449","30GB No Expiry Data + UNLI Calls & Texts (7 days)",404,false],

["GOMO_UNLI7_199","UNLI Data up to 10 Mbps (7 days)",179,false],
["GOMO_UNLI7_249","UNLI Data up to 10 Mbps + UNLI Calls & Texts (7 days)",224,false],
["GOMO_UNLI30_799","UNLI Data up to 10 Mbps (30 days)",719,false],
["GOMO_UNLI30_999","UNLI Data up to 10 Mbps + UNLI Calls & Texts (30 days)",899,false],

["GOMO_F50_299","UNLI Fiber up to 50 Mbps + 7GB No Expiry Data (7 days)",269,false],
["GOMO_F50_349","UNLI Fiber up to 50 Mbps + Mobile Data up to 10 Mbps (7 days)",314,false],
["GOMO_F50_399","UNLI Fiber up to 50 Mbps + Mobile Data up to 10 Mbps + UNLI Calls & Texts (7 days)",359,false],
["GOMO_F50_899","UNLI Fiber up to 50 Mbps + 15GB No Expiry Data (30 days)",809,false],
["GOMO_F50_1299","UNLI Fiber up to 50 Mbps + Mobile Data up to 10 Mbps (30 days)",1169,false],
["GOMO_F50_1499","UNLI Fiber up to 50 Mbps + Mobile Data up to 10 Mbps + UNLI Calls & Texts (30 days)",1349,false],

["GOMO_F100_399","UNLI Fiber up to 100 Mbps + 7GB No Expiry Data (7 days)",359,false],
["GOMO_F100_449","UNLI Fiber up to 100 Mbps + Mobile Data up to 10 Mbps (7 days)",404,false],
["GOMO_F100_499","UNLI Fiber up to 100 Mbps + Mobile Data up to 10 Mbps + UNLI Calls & Texts (7 days)",449,false],
["GOMO_F100_1199","UNLI Fiber up to 100 Mbps + 15GB No Expiry Data (30 days)",1079,false],
["GOMO_F100_1599","UNLI Fiber up to 100 Mbps + Mobile Data up to 10 Mbps (30 days)",1439,false],
["GOMO_F100_1799","UNLI Fiber up to 100 Mbps + Mobile Data up to 10 Mbps + UNLI Calls & Texts (30 days)",1619,false],

["GOMO_F300_599","UNLI Fiber up to 300 Mbps + 7GB No Expiry Data (7 days)",539,false],
["GOMO_F300_649","UNLI Fiber up to 300 Mbps + Mobile Data up to 10 Mbps (7 days)",584,false],
["GOMO_F300_699","UNLI Fiber up to 300 Mbps + Mobile Data up to 10 Mbps + UNLI Calls & Texts (7 days)",629,false],
["GOMO_F300_1699","UNLI Data up to 300 Mbps + 15GB No Expiry Data (30 days)",1529,false],
["GOMO_F300_2099","UNLI Fiber up to 300 Mbps + Mobile Data up to 10 Mbps (30 days)",1889,false],
["GOMO_F300_2299","UNLI Fiber up to 300 Mbps + Mobile Data up to 10 Mbps + UNLI Calls & Texts (30 days)",2069,false]
],
"GLOBE AT HOME":[
["FamSURF50","5GB Shareable Open Access Data (3 days)",45,false],
["FamSURF Extra 199","50GB Shareable Open Access Data (7 days)",179,false], 
["FamSURF Extra 299","75GB Shareable Open Access Data (7 days)",269,false], 
["FamSURF Unli 399","Unli All-Access Data (7 days)",359,false], 
["FamSURF No Expiry 399","30GB All-Access Data (No Expiry)",359,false], 
["FamSURF Extra 499","120GB Shareable Open Access Data (15 days)",449,false], 
["FamSURF No Expiry 699","60GB All-Access Data (No Expiry)",629,false], 
["FamSURF Unli 999","Unli All-Access Data (30 days)",899,false], 
["FamSURF Extra 999","250GB Shareable Open Access Data (30 days)",899,false],

["HomeSurf50","5GB Shareable Open Access Data (3 days)",45,false], 
["HomeSurf1499","120GB Shareable Open Access Data (30 days)",1349,false],
],
GFIBER:[
["UNLISurf249","50Mbps UNLI Surf (7 days)",224,false], 
["UNLISurf399","100Mbps UNLI Surf (7 days)",359,false], 
["UNLISurf749","50Mbps UNLI Surf (30 days)",674,false], 
["UNLISurf999","100Mbps UNLI Surf (30 days)",899,false], 
["UNLISurf1499","300Mbps UNLI Surf (30 days)",1349,false], 
["UNLISurf1999","500Mbps UNLI Surf (30 days)",1799,false], 
["UNLISurf2499","100Mbps UNLI Surf (90 days)",2249,false], 
["UNLISurf3749","300Mbps UNLI Surf (90 days)",3374,false], 
["UNLISurf4999","100Mbps UNLI Surf (180 days)",4499,false], 
["UNLISurf4999","500Mbps UNLI Surf (90 days)",4499,false], 
["UNLISurf6999","50Mbps UNLI Surf (365 days)",6299,false], 
["UNLISurf7499","300Mbps UNLI Surf (180 days)",6749,false], 
["UNLISurf9999","100Mbps UNLI Surf (365 days)",8999,false], 
["UNLISurf9999","500Mbps UNLI Surf (180 days)",8999,false], 
["UNLISurf14999","300Mbps UNLI Surf (365 days)",13499,false], 
["UNLISurf19999","500Mbps UNLI Surf (365 days)",17999,false],
],

PLDT:[
  ["Landline Plus 30", "Convert your Landline Plus load into Landline Plus Plan 150 or 300 or just top-up for more outgoing calls. Valid for 1 year.", 30, false],
  ["Landline Plus 50", "Convert your Landline Plus load into Landline Plus Plan 150 or 300 or just top-up for more outgoing calls. Valid for 1 year.", 49, false],
  ["Landline Plus 100", "Convert your Landline Plus load into Landline Plus Plan 150 or 300 or just top-up for more outgoing calls. Valid for 1 year.", 98, true],
  ["Landline Plus 200", "Convert your Landline Plus load into Landline Plus Plan 150 or 300 or just top-up for more outgoing calls. Valid for 1 year.", 196, false],
  ["Landline Plus 300", "Convert your Landline Plus load into Landline Plus Plan 150 or 300 or just top-up for more outgoing calls. Valid for 1 year.", ,294, false],
  ["Landline Plus 1000", "Convert your Landline Plus load into Landline Plus Plan 150 or 300 or just top-up for more outgoing calls. Valid for 1 year.", 980, false],

  ["UNLI Fiber Prepaid 50Mbps 1 Day", "Valid for 1 Day", 49, false],
  ["UNLI Fiber Prepaid 50Mbps 7 Days", "Valid for 7 Days", 195, false],
  ["UNLI Fiber Prepaid 50Mbps 15 Days", "Valid for 15 Days", 371, false],
  ["UNLI Fiber Prepaid 50Mbps 30 Days", "Valid for 30 Days", 685, true],
  ["UNLI Fiber Prepaid 50Mbps 365 Days", "Valid for 365 Days", 6859, false],

  ["UNLI Fiber Prepaid 100Mbps 1 Day", "Valid for 1 Day", 97, false],
  ["UNLI Fiber Prepaid 100Mbps 7 Days", "Valid for 7 Days", 371, false],
  ["UNLI Fiber Prepaid 100Mbps 15 Days", "Valid for 15 Days", 538, false],
  ["UNLI Fiber Prepaid 100Mbps 30 Days", "Valid for 30 Days", 979, false],
  ["UNLI Fiber Prepaid 100Mbps 365 Days", "Valid for 365 Days", 9799, false],

  ["UNLI Fiber Prepaid 300Mbps 1 Day", "Valid for 1 Day", 195, false],
  ["UNLI Fiber Prepaid 300Mbps 7 Days", "Valid for 7 Days", 685, false],
  ["UNLI Fiber Prepaid 300Mbps 15 Days", "Valid for 15 Days", 979, false],
  ["UNLI Fiber Prepaid 300Mbps 30 Days", "Valid for 30 Days", 1469, false],
  ["UNLI Fiber Prepaid 300Mbps 365 Days", "Valid for 365 Days", 14699, false]
],

CIGNAL:[
  ["Cignal Sports Action 300", "Intense LIVE sports and action movies! Watch up to 69 channels.", 294, false],

  ["Cignal Family Time 300", "Complete bonding experience with all your family faves! Watch up to 79 channels.", 294, false],

  ["Cignal Ultimate Entertainment 300", "Your must-watch entertainment and news updates! Watch up to 78 channels.", 294, false],

  ["Cignal Asian & Pinoy 300", "Feel all kinds of kilig with Asian & local shows! Watch up to 68 channels.", 294, false],

  ["Cignal Ultimate Entertainment 600", "Ultimate Entertainment 300 + more channels. With HBO GO streaming access!", 588, false],

  ["Cignal Plan 175", "Load 175. Valid for 30 days.", 172, false],
  ["Cignal Plan 200", "Load 200. Valid for 30 days.", 196, false],
  ["Cignal Plan 300", "Load 300. Valid for 30 days.", 294, false],
  ["Cignal Plan 450", "Load 450. Valid for 30 days.", 441, false],
  ["Cignal Plan 500", "Load 500. Valid for 30 days.", 490, false],
  ["Cignal Plan 600", "Load 600. Valid for 30 days.", 588, false],
  ["Cignal Plan 800", "Load 800. Valid for 30 days.", 784, false],
  ["Cignal Plan 1000", "Load 1000. Valid for 30 days.", 980, false],

  ["SatLite 10", "Tingi Load 10 - Watch up to 24 channels. Valid for 3 days.", 10, false],
  ["SatLite 15", "Tingi Load 15 - Watch up to 39 channels. Valid for 3 days.", 15, false],
  ["SatLite 25", "Tingi Load 25 - Watch up to 46 channels. Valid for 3 days.", 25, false],

  ["SatLite 49", "Load 49 - Watch up to 24 channels. Valid for 30 days.", 48, false],
  ["SatLite 99", "Load 99 - Watch up to 39 channels. Valid for 30 days.", 97, false],
  ["SatLite 199", "Load 199 - Watch up to 46 channels. Valid for 30 days.", 195, false],
  ["SatLite 299", "Load 299 - Watch up to 51 channels. Valid for 30 days.", 293, false]
],

"GTM RETAILER BALANCE":[
["GTM RETAILER BALANCE 5000(20DC)"," DAYS PROCESS! NO CANCELLATION PLSS WAIT",4000,true],

["GTM RETAILER BALANCE 10,000(22DC)"," DAYS PROCESS! NO CANCELLATION PLSS WAIT",7800,true],

["GTM RETAILER BALANCE 25,000(24DC)"," DAYS PROCESS! NO CANCELLATION PLSS WAIT.. LIMITED TIME OFFER!",19000,true],

["GTM RETAILER BALANCE 30,000(25DC)"," DAYS PROCESS! NO CANCELLATION PLSS WAIT.. LIMITED TIME OFFER!",22500,true],

],

"SMART LOAD WALLET RETAILER BALANCE":[

["SMART LOAD WALLET RETAILER BALANCE 101","1% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",100,true],

["SMART LOAD WALLET RETAILER BALANCE 202","1% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",200,true],

["SMART LOAD WALLET RETAILER BALANCE 303","1% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",300,true],

["SMART LOAD WALLET RETAILER BALANCE 507","1.5% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",500,true],

["SMART LOAD WALLET RETAILER BALANCE 812","1.5% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",800,true],

["SMART LOAD WALLET RETAILER BALANCE 812","1.5% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",800,true],

["SMART LOAD WALLET RETAILER BALANCE 1,020","2% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",1000,true],

["SMART LOAD WALLET RETAILER BALANCE 1,530","2% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",1500,true],

["SMART LOAD WALLET RETAILER BALANCE 3,060","2% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",3000,true],

["SMART LOAD WALLET RETAILER BALANCE 5,125","2.5% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",5000,true],

["SMART LOAD WALLET RETAILER BALANCE 10,250","2.5% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",10000,true],

["SMART LOAD WALLET RETAILER BALANCE 15,405","2.7% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",15000,true],

["SMART LOAD WALLET RETAILER BALANCE 20,560","2.8% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",20000,true],

["SMART LOAD WALLET RETAILER BALANCE 30,870","2.9% REBATES MINUTES/HOURS PROCESS. PLSS WAIT! ",30000,true],


],};

const paymentDetails={
"GCash":{details:"Ronald P.\n09919018849",qr:"assets/qr/gcash.jpg"},
"Maya":{details:"Ronald P.\n09917019078",qr:"assets/qr/maya.jpg"},
"GoTyme Bank":{details:"Ronald P.\nAccount No. 014261416464",qr:"assets/qr/gotyme.jpg"},
"MariBank":{details:"Ronald P.\nAccount No. 16065980076",qr:"assets/qr/maribank.jpg"},
"QR PH":{details:"For other e-wallets and bank accounts",qr:"assets/qr/qrph.png"}
};

function paymentBoxHTML(method){
  if(!method)return "<b>Payment details</b><p>Choose a payment method to display the account details.</p>";
  const d=paymentDetails[method];
  const lines=d.details.split("\n");
  const copyNumber=(d.details.match(/(?:\d[\d\s-]{5,})/g)||[]).pop()?.replace(/\D/g,"") || "";
  const detailText=lines[0] || "";
  const numberText=lines.slice(1).join(" ");
  const copyButton=copyNumber ? `<div class="mop-row"><span class="mop-number">${numberText}</span><button type="button" class="copy-mop-btn" data-copy="${copyNumber}" onclick="copyMOP(this)">📋 COPY</button></div>` : `<p>${d.details}</p>`;
  return `<b>${method}</b>${copyNumber ? `<p class="mop-name">${detailText}</p>${copyButton}` : ""}<button type="button" class="qr-btn" onclick="toggleQR(this)">Show QR Code</button><div class="qr-preview" hidden><img src="${d.qr}" alt="${method} QR Code"><a class="qr-download-btn" href="${d.qr}" download="${method.replace(/\s+/g,"-").toLowerCase()}-qr-code.jpg" onclick="downloadQR(event,this)">Download QR Code</a></div>`;
}

async function copyMOP(button){
  const number=button.dataset.copy || "";
  if(!number)return;
  const original=button.textContent;
  try{
    await navigator.clipboard.writeText(number);
  }catch(error){
    const temp=document.createElement("textarea");
    temp.value=number;
    temp.style.position="fixed";
    temp.style.opacity="0";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    document.execCommand("copy");
    temp.remove();
  }
  button.textContent="Copied!";
  setTimeout(()=>button.textContent=original,1500);
}

function toggleQR(button){
  const preview=button.nextElementSibling;
  const isHidden=preview.hasAttribute("hidden");
  if(isHidden){preview.removeAttribute("hidden");button.textContent="Hide QR Code";}
  else{preview.setAttribute("hidden","");button.textContent="Show QR Code";}
}

async function downloadQR(event, link){
  event.preventDefault();
  const url=link.getAttribute("href");
  const filename=link.getAttribute("download") || "qr-code.jpg";
  try{
    const response=await fetch(url,{cache:"no-store"});
    if(!response.ok) throw new Error("Download failed");
    const blob=await response.blob();
    const blobUrl=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=blobUrl;
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(blobUrl),1000);
  }catch(error){
    window.open(url,"_blank","noopener");
  }
}

const $=id=>document.getElementById(id);
let activeNetwork="";

function money(n){return "₱"+Number(n).toLocaleString("en-PH")}
function orderNumber(){const d=new Date();return `REL-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(1000+Math.random()*9000)}`}
function fillNetworks(){
  const displayNames={
    GLOBE:"Globe",
    TM:"TM",
    DITO:"DITO",
    SMART:"Smart",
    TNT:"TNT",
    GOMO:"GOMO",
    GFIBER:"GFIBER Prepaid",
    "GLOBE AT HOME":"Globe At Home",
    PLDT:"PLDT",
    CIGNAL:"CIGNAL",
    "GTM RETAILER BALANCE":"GTM Retailer Balance",
    "SMART LOAD WALLET RETAILER BALANCE":"Smart Load Wallet"
  };
  const colorClass={
    GLOBE:"net-globe", TM:"net-tm", DITO:"net-dito", SMART:"net-smart", TNT:"net-tnt",
    GOMO:"net-gomo", GFIBER:"net-gfiber", "GLOBE AT HOME":"net-globe-home", PLDT:"net-pldt",
    CIGNAL:"net-cignal", "GTM RETAILER BALANCE":"net-gtm",
    "SMART LOAD WALLET RETAILER BALANCE":"net-smart-wallet"
  };
  $("network").innerHTML='<option value="">Select network</option>'+NETWORKS.map(n=>`<option value="${n}">${displayNames[n]||n}</option>`).join("");
  $("networkGrid").innerHTML=NETWORKS.map(n=>`<button class="network-card ${colorClass[n]||""} ${activeNetwork===n?"active":""}" data-net="${n}"><span class="network-name">${displayNames[n]||n}</span></button>`).join("");
  document.querySelectorAll(".network-card").forEach(b=>b.onclick=()=>{activeNetwork=b.dataset.net;$("network").value=activeNetwork;$("search").value="";renderPromos();$("promoGrid").scrollIntoView({behavior:"smooth",block:"start"});});
  const logos={
SMART:"assets/networks/smart.png",
TNT:"assets/networks/tnt.png",
DITO:"assets/networks/dito.png",
GLOBE:"assets/networks/globe.png",
TM:"assets/networks/tm.png",
GOMO:"assets/networks/gomo.png",
GFIBER:"assets/networks/gfiber.png",
PLDT:"assets/networks/pldt.png",
CIGNAL:"assets/networks/cignal.png",
"GLOBE AT HOME":"assets/networks/globeathome.png",
"GTM RETAILER BALANCE":"assets/networks/gtmretbal.png",
"SMART LOAD WALLET RETAILER BALANCE":"assets/networks/smartretbal.png"
};

document.querySelectorAll(".network-card").forEach(b=>{
  const logo=logos[b.dataset.net];
  if(logo){
    b.insertAdjacentHTML("afterbegin",`<img class="network-logo-img" src="${logo}" alt="${b.dataset.net}">`);
  }
});
}
function promoMeta(p){
  const text=String(p[1]||"");
  const valid=(text.match(/\((\d+\s*(?:day|days|month|months|year|years))\)/i)||[])[1]||"";
  const clean=text.replace(/\s*\([^)]*(?:day|days|month|months|year|years)[^)]*\)\s*$/i,"").trim();
  const parts=clean.split(/\s*;\s*|\s+\+\s+/).map(x=>x.trim()).filter(Boolean);
  let data="";
  const m=clean.match(/(?:TOTAL\s+)?(\d+(?:\.\d+)?)\s*GB/i);
  if(m) data=m[1]+"GB";
  else if(/unli/i.test(clean)) data="UNLI";
  else if(/regular load/i.test(p[0])) data="LOAD";
  else data="PROMO";
  return {valid,features:parts.slice(0,3),data};
}
const colorClassForPromo={
  GLOBE:"globe", TM:"tm", DITO:"dito", SMART:"smart", TNT:"tnt",
  GOMO:"gomo", GFIBER:"gfiber", "GLOBE AT HOME":"globe-home", PLDT:"pldt",
  CIGNAL:"cignal", "GTM RETAILER BALANCE":"gtm",
  "SMART LOAD WALLET RETAILER BALANCE":"smart-wallet"
};
function renderPromos(){
  const net=activeNetwork||$("network").value||"";
  const q=$("search").value.toLowerCase().trim();
  const list=(promos[net]||[]).filter(p=>(p[0]+" "+p[1]).toLowerCase().includes(q));
  const title=$("networkTitle");
  if(title) title.textContent=net ? `${net === "GLOBE" ? "Globe Prepaid" : net} Promos (${list.length})` : "Choose Network";
  $("promoGrid").innerHTML=list.length?list.map(p=>{
    const meta=promoMeta(p);
    const features=meta.features.length?meta.features.map((f,i)=>`<li><span class="feature-dot">${i===0?'⌁':i===1?'▤':'◇'}</span><span>${f}</span></li>`).join(""):`<li><span class="feature-dot">◇</span><span>Promo details available</span></li>`;
    return `<article class="promo globe-promo promo-net-${(colorClassForPromo[net]||"globe")}">
      <div class="promo-top"><strong>${meta.data}</strong><b>${money(p[2])}</b></div>
      <div class="promo-info">
        <h3>${p[0]} ${p[3]?'<span class="new">NEW!</span>':""}</h3>
        ${meta.valid?`<div class="promo-valid">Valid for ${meta.valid}</div>`:""}
      </div>
      <div class="promo-features"><ul>${features}</ul></div>
      <div class="promo-bottom"><div class="price">${money(p[2])}</div><button class="select-btn" data-promo="${encodeURIComponent(p[0])}" data-price="${p[2]}">Select Promo</button></div>
    </article>`;
  }).join(""):"<p>No promo found for this network.</p>";
  document.querySelectorAll("#promoGrid .select-btn").forEach(b=>b.onclick=()=>selectPromo(decodeURIComponent(b.dataset.promo),Number(b.dataset.price),net));
  const opts=(promos[net]||[]).map(p=>`<option value="${encodeURIComponent(p[0])}" data-price="${p[2]}">${p[0]} — ${money(p[2])}</option>`).join("");
  $("promo").innerHTML='<option value="">Select promo</option>'+opts;
}
function selectPromo(name,price,net){
  activeNetwork=net;$("network").value=net;
  [...$("promo").options].forEach(o=>{if(decodeURIComponent(o.value)===name)o.selected=true});
  updateSummary(name,price,net);$("order").scrollIntoView({behavior:"smooth"});
}
function updateSummary(name,price,net){
  $("promoField").value=name;$("amountField").value=money(price);$("networkField").value=net;
  $("summary").innerHTML=`<b>Order Summary</b><p>Network: ${net}\nPromo: ${name}\nAmount: ${money(price)}\nOrder No.: ${$("orderNo").value}</p>`;
}
$("network").onchange=()=>{activeNetwork=$("network").value;renderPromos()};
$("promo").onchange=()=>{
  const o=$("promo").selectedOptions[0];if(!o||!o.value)return;
  updateSummary(decodeURIComponent(o.value),Number(o.dataset.price),$("network").value);
};
$("payment").onchange=()=>{$("paymentBox").innerHTML=paymentBoxHTML($("payment").value)};
$("search").oninput=renderPromos;
$("orderNo").value=orderNumber();

$("screenshot").addEventListener("change",e=>{
  const file=e.target.files[0];
  if(!file)return;
  const allowed=["image/jpeg","image/png"];
  if(!allowed.includes(file.type)){
    e.target.value="";
    alert("Payment screenshot must be JPG, JPEG, or PNG only. MP3/audio files are not allowed.");
    return;
  }
  if(file.size>10*1024*1024){
    e.target.value="";
    alert("Payment screenshot is too large. Please choose an image up to 10MB.");
    return;
  }
});

$("orderForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const mobile=$("mobile").value.trim();
  if(!/^09\d{9}$/.test(mobile)){alert("Please enter a valid 11-digit Philippine mobile number (09xxxxxxxxx).");return}
  if(!$("network").value||!$("promo").value){alert("Please select network and promo.");return}
  $("orderNo").value ||= orderNumber();
  const o=$("promo").selectedOptions[0];
  updateSummary(decodeURIComponent(o.value),Number(o.dataset.price),$("network").value);
  if(!confirm(`Submit order ${$("orderNo").value}?\n\nYour order details and payment screenshot will be sent to the business.`)) return;

  const status=$("submitStatus");
  const btn=document.querySelector(".submit-btn");
  const fd=new FormData($("orderForm"));
  status.textContent="Sending order…";
  btn.disabled=true;
  try{
    const res=await fetch("https://online-loading-website.onrender.com/api/orders",{method:"POST",body:fd});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(data.error||"Unable to submit the order.");
    status.textContent="Order submitted successfully! Your order is processing. Thank you, come again!";
    const successModal=$("successModal");
    if(successModal){
      $("successOrderNumber").textContent=$("orderNo").value;
      $("successModalTitle").textContent="Order submitted successfully!";
      successModal.hidden=false;
      successModal.setAttribute("aria-hidden","false");
      successModal.style.display="flex";
      document.body.classList.add("modal-open");
      requestAnimationFrame(()=>{$("successModalOk")?.focus();});
    }
    
    $("orderForm").reset();
    $("orderNo").value=orderNumber();
    activeNetwork=""; fillNetworks(); renderPromos();
    $("paymentBox").innerHTML="<b>Payment details</b><p>Choose a payment method to display the account details.</p>";
    $("summary").innerHTML="<b>Order Summary</b><p>No promo selected yet.</p>";
  }catch(err){
    status.textContent=err.message;
    alert(err.message);
  }finally{
    btn.disabled=false;
  }
});

$("clearBtn").onclick=()=>{ $("orderForm").reset();$("orderNo").value=orderNumber();activeNetwork="";fillNetworks();renderPromos();$("paymentBox").innerHTML="<b>Payment details</b><p>Choose a payment method to display the account details.</p>";$("summary").innerHTML="<b>Order Summary</b><p>No promo selected yet.</p>"};
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("rel-dark",document.body.classList.contains("dark"))};
if(localStorage.getItem("rel-dark")==="true")document.body.classList.add("dark");
fillNetworks();renderPromos();





window.addEventListener("DOMContentLoaded",()=>{
  const copyBtn=$("copyOrderNumber");
  if(copyBtn){
    copyBtn.addEventListener("click",async()=>{
      const no=$("successOrderNumber").textContent.trim();
      if(!no || no==="—") return;
      try{ await navigator.clipboard.writeText(no); copyBtn.textContent="✅ COPIED"; setTimeout(()=>copyBtn.textContent="📋 COPY ORDER NUMBER",1500); }
      catch(e){ alert("Order Number: " + no); }
    });
  }
  const successModal=$("successModal");
  const successModalOk=$("successModalOk");
  if(!successModal || !successModalOk) return;
  successModalOk.addEventListener("click",()=>{
    successModal.hidden=true;
    successModal.setAttribute("aria-hidden","true");
    successModal.style.display="none";
    document.body.classList.remove("modal-open");
    $("orderForm").reset();
    $("orderNo").value=orderNumber();
    activeNetwork="";
    fillNetworks();
    renderPromos();
    $("paymentBox").innerHTML="<b>Payment details</b><p>Choose a payment method to display the account details.</p>";
    $("summary").innerHTML="<b>Order Summary</b><p>No promo selected yet.</p>";
    $("submitStatus").textContent="";
    window.location.hash="home";
    window.scrollTo({top:0,behavior:"smooth"});
  });
});















// ===============================
// MLBB TOP UP
// ===============================
const mlbbLauncher = $("mlbbLauncher");
const mlbbForm = $("mlbbForm");
if (mlbbLauncher && mlbbForm) {
  mlbbLauncher.addEventListener("click", () => {
    const open = mlbbForm.classList.toggle("mlbb-form-hidden");
    mlbbLauncher.setAttribute("aria-expanded", String(!open));
    mlbbLauncher.classList.toggle("is-open", !open);
    if (!open) setTimeout(() => mlbbForm.scrollIntoView({behavior:"smooth", block:"start"}), 80);
  });
}
const mlPaymentDetails=paymentDetails;
function mlOrderNumber(){const d=new Date();return `MLT-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(1000+Math.random()*9000)}`}
function updateMlSummary(name,price){
  $("mlPromoField").value=name;
  $("mlAmountField").value=money(price);
  $("mlSummary").innerHTML=`<b>MLBB Order Summary</b><p>Customer: ${$("mlCustomerName").value.trim() || "—"}\nUser ID: ${$("mlUserId").value.trim() || "—"}\nZone ID: ${$("mlZoneId").value.trim() || "—"}\nPackage: ${name}\nAmount: ${money(price)}\nOrder No.: ${$("mlOrderNo").value}</p>`;
}

document.querySelectorAll(".ml-select-btn").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.mlName;
  const price=Number(btn.dataset.mlPrice);
  document.querySelectorAll(".ml-select-btn").forEach(b=>b.classList.remove("ml-selected"));
  btn.classList.add("ml-selected");
  updateMlSummary(name,price);
  $("mlSummary").scrollIntoView({behavior:"smooth",block:"center"});
}));

if($("mlOrderNo")){
  $("mlOrderNo").value=mlOrderNumber();
  $("mlPayment").onchange=()=>{$("mlPaymentBox").innerHTML=paymentBoxHTML($("mlPayment").value)};
  $("mlUserId").addEventListener("input",()=>{if($("mlPromoField").value) updateMlSummary($("mlPromoField").value,Number($("mlAmountField").value.replace(/[^0-9.]/g,"")))});
  $("mlZoneId").addEventListener("input",()=>{if($("mlPromoField").value) updateMlSummary($("mlPromoField").value,Number($("mlAmountField").value.replace(/[^0-9.]/g,"")))});
  $("mlCustomerName").addEventListener("input",()=>{if($("mlPromoField").value) updateMlSummary($("mlPromoField").value,Number($("mlAmountField").value.replace(/[^0-9.]/g,"")))});
  $("mlScreenshot").addEventListener("change",e=>{
    const file=e.target.files[0]; if(!file)return;
    if(!["image/jpeg","image/png"].includes(file.type)){e.target.value="";alert("Payment screenshot must be JPG, JPEG, or PNG only.");return;}
    if(file.size>10*1024*1024){e.target.value="";alert("Payment screenshot is too large. Please choose an image up to 10MB.");}
  });
  $("mlbbForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const uid=$("mlUserId").value.trim(), zid=$("mlZoneId").value.trim();
    if(!/^\d+$/.test(uid)){alert("Please enter a valid MLBB User ID.");return}
    if(!/^\d+$/.test(zid)){alert("Please enter a valid MLBB Zone ID.");return}
    if(!$("mlPromoField").value){alert("Please select a Weekly Pass or Diamond package.");return}
    $("mlOrderNo").value ||= mlOrderNumber();
    updateMlSummary($("mlPromoField").value,Number($("mlAmountField").value.replace(/[^0-9.]/g,"")));
    if(!confirm(`Send MLBB order ${$("mlOrderNo").value}?\n\nYour Name, User ID, Zone ID, package, payment details and screenshot will be sent to the business via Telegram.`))return;
    const status=$("mlSubmitStatus"),btn=$("mlSubmitBtn");
    status.textContent="Sending MLBB order…";btn.disabled=true;
    try{
      const fd=new FormData($("mlbbForm"));
      const res=await fetch("https://online-loading-website.onrender.com/api/orders",{method:"POST",body:fd});
      const data=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(data.error||"Unable to submit the MLBB order.");
      status.textContent="Order submitted successfully! Your order is processing. Please wait.";
      const successModal=$("successModal");
      if(successModal){
        $("successModalTitle").textContent="Order submitted successfully!";
        $("successOrderNumber").textContent=$("mlOrderNo").value;
        successModal.hidden=false;
        successModal.setAttribute("aria-hidden","false");
      }
      $("mlbbForm").reset();$("mlOrderNo").value=mlOrderNumber();$("mlPromoField").value="";$("mlAmountField").value="";
      $("mlSummary").innerHTML="<b>MLBB Order Summary</b><p>No package selected yet.</p>";
      $("mlPaymentBox").innerHTML="<b>Payment details</b><p>Choose a payment method to display the account details.</p>";
      document.querySelectorAll(".ml-select-btn").forEach(b=>b.classList.remove("ml-selected"));
    }catch(err){status.textContent=err.message;alert(err.message)}finally{btn.disabled=false}
  });
}


// ===============================
// ORDER STATUS / TRACKING
// ===============================
const trackBtn = $("trackBtn");
if (trackBtn) {
  trackBtn.addEventListener("click", async () => {
    const no = $("trackOrderNo").value.trim();
    const result = $("trackResult");
    if (!no) { alert("Please enter your Order Number."); return; }
    result.hidden = false;
    result.innerHTML = "Checking order status…";
    try {
      const res = await fetch(`https://online-loading-website.onrender.com/api/orders/${encodeURIComponent(no)}`);
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Order not found.");
      window.currentReceiptData = d;
      const isML = String(d.orderType || "").toLowerCase().includes("mlbb") || String(d.network || "").toLowerCase() === "mlbb";
      const completed = String(d.status || "").toUpperCase() === "COMPLETED";
      const receiptCustomer = String(d.customer ?? "").trim() || "Customer";
      const orderTypeLabel = isML ? "ML" : "Loading";
      const mobile = String(d.mobile ?? d.mobileNumber ?? "").trim() || "—";
      result.innerHTML = `<div class="order-result-card receipt-card ${completed ? "completed" : "processing"}">
        <div class="receipt-brand">RONALD E-LOADING BUSINESS STATION<small>OFFICIAL ORDER RECEIPT</small></div>
        <div class="receipt-status ${completed ? "done" : "pending"}">${completed ? "🟢 ORDER COMPLETED" : "🟡 ORDER PROCESSING"}</div>
        ${completed ? `<div class="success-proof">✅ SUCCESSFUL LOAD PROOF<small>Verified by Ronald E-Loading Business Station</small></div>` : ""}
        <div class="receipt-meta"><span>Order No.</span><b>${escapeTrack(d.orderNumber)}</b></div>
        <div class="receipt-divider"></div>
        <div class="receipt-details">
          <div><span>Customer</span><b>${escapeTrack(receiptCustomer)}</b></div>
          <div><span>Order Type</span><b>${orderTypeLabel}</b></div>
          <div><span>Network</span><b>${escapeTrack(d.network)}</b></div>
          ${isML ? `<div><span>User ID</span><b>${escapeTrack(d.userId)}</b></div><div><span>Zone ID</span><b>${escapeTrack(d.zoneId)}</b></div>` : `<div><span>Mobile</span><b>${escapeTrack(mobile)}</b></div>`}
          <div><span>Promo</span><b>${escapeTrack(d.promo)}</b></div>
          <div><span>Amount</span><b>${escapeTrack(d.amount)}</b></div>
          <div><span>Payment</span><b>${escapeTrack(d.payment || "Paid")}</b></div>
          <div><span>Order Time</span><b>${escapeTrack(d.orderTime)}</b></div>
          <div><span>Status</span><b>${escapeTrack(d.status)}</b></div>
          ${d.successfulTime ? `<div><span>Successful Time</span><b>${escapeTrack(d.successfulTime)}</b></div>` : ""}
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-note">Official customer/reseller proof of successful loading. Keep this receipt together with your Order Number.</div>
        ${completed ? `<div class="receipt-actions"><button type="button" class="primary-btn receipt-print-btn" onclick="downloadReceiptImage()">🧾 SAVE RECEIPT TO PHONE</button><button type="button" class="secondary-btn receipt-print-btn" onclick="window.print()">🖨 PRINT RECEIPT</button></div>` : ""}
      </div>`;
    } catch (err) { result.innerHTML = `<b>Order Status</b><p>${escapeTrack(err.message)}</p>`; }
  });
}

function downloadReceiptImage(){
  const d = window.currentReceiptData || {};
  if (!d.orderNumber) { alert("Please track your Order Number first."); return; }
  const isML = String(d.orderType || "").toLowerCase().includes("mlbb") || String(d.network || "").toLowerCase() === "mlbb";
  const esc = (v) => String(v ?? "—").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rows = [
    ["Customer", d.customer || "Customer"],
    ["Order Type", isML ? "ML" : "Loading"],
    ["Network", d.network || "—"],
    ...(isML ? [["User ID", d.userId || "—"], ["Zone ID", d.zoneId || "—"]] : [["Mobile", d.mobile || d.mobileNumber || "—"]]),
    ["Promo", d.promo || "—"], ["Amount", d.amount || "—"], ["Payment", d.payment || "Paid"],
    ["Order Time", d.orderTime || "—"], ["Status", d.status || "—"],
    ...(d.successfulTime ? [["Successful Time", d.successfulTime]] : [])
  ];
  const width = 900, rowH = 58, height = 250 + rows.length * rowH;
  const rowSvg = rows.map((r,i) => { const y=245+i*rowH; return `<text x="70" y="${y}" font-family="Arial,sans-serif" font-size="25" fill="#667085">${esc(r[0])}</text><text x="830" y="${y}" text-anchor="end" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#101828">${esc(r[1])}</text>`; }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#ffffff"/><text x="70" y="65" font-family="Arial,sans-serif" font-size="31" font-weight="800" fill="#101828">RONALD E-LOADING BUSINESS STATION</text><text x="70" y="105" font-family="Arial,sans-serif" font-size="20" fill="#667085">OFFICIAL ORDER RECEIPT</text><rect x="55" y="130" width="790" height="65" rx="12" fill="#f2f4f7"/><text x="75" y="172" font-family="Arial,sans-serif" font-size="24" fill="#667085">ORDER NO.</text><text x="825" y="172" text-anchor="end" font-family="Arial,sans-serif" font-size="27" font-weight="800" fill="#101828">${esc(d.orderNumber)}</text>${rowSvg}<text x="70" y="${height-30}" font-family="Arial,sans-serif" font-size="17" fill="#667085">Keep this receipt together with your Order Number.</text></svg>`;
  const blob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(blob); const img = new Image();
  img.onload = () => {
    const canvas=document.createElement("canvas"); canvas.width=width*2; canvas.height=height*2;
    const ctx=canvas.getContext("2d"); ctx.fillStyle="#ffffff"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0,canvas.width,canvas.height); URL.revokeObjectURL(url);
    canvas.toBlob(async (png) => {
      if (!png) { alert("Unable to create receipt image."); return; }
      const filename=`${d.orderNumber}-receipt.png`;
      const file = new File([png], filename, {type:"image/png"});
      // Keep the normal Chrome download behavior first.
      const a=document.createElement("a"); const downloadUrl=URL.createObjectURL(png); a.href=downloadUrl; a.download=filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(downloadUrl),3000);
      // Facebook/Facebook Lite may ignore the download attribute. If sharing is supported, offer the phone share/save sheet.
      setTimeout(async()=>{
        if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
          try { await navigator.share({files:[file], title:"Receipt", text:"RONALD E-LOADING BUSINESS STATION receipt"}); return; } catch(e) {}
        }
        // Final fallback: show the actual PNG in a new page so it can be long-pressed and saved.
        const imageUrl=URL.createObjectURL(png);
        const w=window.open(imageUrl,"_blank");
        if (!w) { window.location.href=imageUrl; }
        alert("Kung hindi na-download sa Facebook, buksan ang receipt at i-long press ang image, pagkatapos piliin ang Save/Download image.");
      },700);
    },"image/png");
  };
  img.onerror=()=>{URL.revokeObjectURL(url); alert("Unable to create receipt image.");}; img.src=url;
}

function escapeTrack(v){return String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
