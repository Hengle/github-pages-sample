$(function () {
  $('.cont > div').hide();
  $('.cont > div:first').show();
  $('.side ul li:first').addClass('active');
  $('.side ul li').click(function () {
    $('.side ul li').removeClass('active');
    $(this).addClass('active');
    $('.cont > div').hide();
    $($(this).find('a').attr('href')).fadeIn();
    //    cancelTick();
    callId = "tick" + String($(this).index());
    //    tickObj[callId]();
    return false;
  });
});
