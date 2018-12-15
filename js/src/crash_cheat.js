<!--崩溃欺骗-->
 var OriginTitle = document.title;
 var titleTime;
 document.addEventListener('visibilitychange', function () {
     if (document.hidden) {
         $('[rel="icon"]').attr('href', "https://q2.qlogo.cn/headimg_dl?bs=870321017&dst_uin=870321017&dst_uin=870321017&;dst_uin=870321017&spec=100&url_enc=0&referer=bu_interface&term_type=PC");
         document.title = '╭(°A°`)╮ 页面崩溃啦 ~';
         clearTimeout(titleTime);
     }
     else {
         $('[rel="icon"]').attr('href', "https://q2.qlogo.cn/headimg_dl?bs=870321017&dst_uin=870321017&dst_uin=870321017&;dst_uin=870321017&spec=100&url_enc=0&referer=bu_interface&term_type=PC");
         document.title = '(ฅ>ω<*ฅ) 噫又好了~' + OriginTitle;
         titleTime = setTimeout(function () {
             document.title = OriginTitle;
         }, 2000);
     }
 });
