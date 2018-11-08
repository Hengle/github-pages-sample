function cancelTick() {
  cancelAnimationFrame(callbackId);
}

$(function () {
  $('.cont > div').hide();
  $('.cont > div:first').show();
  $('.sideWebgl li:first').addClass('active');
  $('.sideWebgl li').click(function () {
    if (callId.slice(4) != String($(this).index())) {
      $('.sideWebgl li').removeClass('active');
      $(this).addClass('active');
      $('.cont > div').hide();
      $($(this).find('a').attr('href')).fadeIn();
      cancelTick();
      callId = "tick" + String($(this).index());
      if ($(this).index() != 2) {
        tickObj[callId]();
      }
      return false;
    } else {
      var explainId = "canvas" + String($(this).index() + 1);
      if (flg == false) {
        $('.explain').css({
          'display': 'block'
        });
        flg = true;
      } else {
        $('.explain').css({
          'display': 'none'
        });
        flg = false;
      }
    }
  });
});

//  $('.aside').click(function () {
//    if (flg == false) {
//      $('.cont > div canvas, .cont > div > div:not(.explain)').css({
//        //        'display': 'none'
//        'opacity': 0.2
//      });
//      $('.cont > div .explain').css({
//        'display': 'block'
//      });
//      $(this).text('戻る');
//      flg = true;
//    } else {
//      $('.cont > div canvas, .cont > div > div:not(.explain)').css({
//        //        'display': 'block'
//        'opacity': 1.0
//      });
//      $('.cont > div .explain').css({
//        'display': 'none'
//      });
//      $(this).text('この作品の説明');
//      flg = false;
//    }
//  });
