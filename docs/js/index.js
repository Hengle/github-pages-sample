function cancelTick() {
  cancelAnimationFrame(callbackId);
  if (callId == "tick2") {
    changeGui();
  }
}
$(function () {
  $('.cont > div').hide();
  $('.cont > div:first').show();
  $('.sideWebgl li:first').addClass('active');
  $('.sideWebgl li').click(function () {
    $('.sideWebgl li').removeClass('active');
    //    $('.side ul li').removeClass('active');
    $(this).addClass('active');
    $('.cont > div').hide();
    $($(this).find('a').attr('href')).fadeIn();
    cancelTick();
    callId = "tick" + String($(this).index());
    if (callId == "tick2") {
      changeGui();
    }
    tickObj[callId]();
    return false;
  });

  $('.aside2').click(function () {
    callId = "tick" + String($(this).index());
    tickObj[callId]();
  });

  var flg = false;
  $('.aside').click(function () {
    if (flg == false) {
      $('.cont > div canvas, .cont > div > div:not(.explain)').css({
        //        'display': 'none'
        'opacity': 0.2
      });
      $('.cont > div .explain').css({
        'display': 'block'
      });
      $(this).text('戻る');
      flg = true;
    } else {
      $('.cont > div canvas, .cont > div > div:not(.explain)').css({
        //        'display': 'block'
        'opacity': 1.0
      });
      $('.cont > div .explain').css({
        'display': 'none'
      });
      $(this).text('この作品の説明');
      flg = false;
    }
  });
});
