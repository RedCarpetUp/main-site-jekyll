//= require jquery.min
//= require bootstrap.min
//= require ie-emulation-modes-warning
//= require moment
//= require jquery.slideControl
//= require highchart/highmaps
//= require highchart/exporting
//= require highchart/in-all
//= require jquery.fitvids

$(function () {
  $('[data-toggle="popover"]').popover()

  var map;
  var currentVideoId = undefined;
  var player = undefined;
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Initiate the chart
  $('#mapdiv').highcharts('Map', {

    title : {
      text : ''
    },

    subtitle : {
      text : ''
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },

    colorAxis: {
      min: 0
    },

    legend: {
      enabled: false
    },

    series : [{
      data : [
        {
          "hc-key": "in-dl",
          "value": 17
        }
      ],
      mapData: Highcharts.maps['countries/in/in-all'],
      joinBy: 'hc-key',
      name: '',
      states: {
        hover: {
          color: '#BADA55'
        }
      },
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        formatter: function () {
          if (this.point.value) {
            return this.point.name;
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.name}'
      }
    }]
  });

  var $slides = $('.slide-control');
  $slides.each(function(i) {
    var $this = $($slides[i]);
    $this.slideControl({
      lowerBound: $this.attr('min'),
      upperBound: $this.attr('max'),
      increment: $this.data('increment')
    });
  });

  var amount = 200;
  var days = 14;
  var interest = 0;
  var repayment = 0;
  var base = 10.7;
  var now = new Date();

  window.updateLoan = function() {
    amount = parseInt($('#amount').val());
    days = parseInt($('#days').val());
    payDate = now.setDate(now.getDate() + days + 3);

    $('.loan-amount').html(amount);
    $('.loan-days').html(days);

    base = 10.7 + (amount - 100) * 0.176;
    interest = Math.round(((base + (days - 7) * 0.3)) * 100) / 100;
    var interestInt = Math.floor(interest);
    var interestDeciml = Math.round((interest - interestInt) * 100);
    $('.loan-interest .int').html(interestInt);
    $('.loan-interest .decimal').html(interestDeciml);

    repayment = Math.round((amount + interest) * 100) / 100;
    var repaymentInt = Math.floor(repayment);
    var repaymentDeciml = Math.round((repayment - repaymentInt) * 100);
    $('.loan-repayment .int').html(repaymentInt);
    $('.loan-repayment .decimal').html(repaymentDeciml);

    $('.loan-date').html(moment(payDate).format('ll'));
  }

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId: '',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    event.target.playVideo();
  }

  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
  }

  function stopVideo() {
    player.stopVideo();
  }

  function playVideo($el) {
    var videoId = $el.data('video-id');
    currentVideoId = videoId;
    $('#modal .modal-title').html($el.data('title'));
    player.loadVideoById({ videoId: videoId });
  }

  updateLoan();

  $('[data-target="#modal"]').bind('click touchstart', function(e) {
    e.preventDefault();
    playVideo($(this));
  });

  $('.video-control').bind('click touchstart', function(e) {
    var $this = $(this);
    var $el = $('[data-video-id="' + currentVideoId + '"]').parent();
    var $target = undefined;

    if ($this.hasClass('left')) {
      $target = $el.prev();
      if (!$target.hasClass('video')) {
        $target = $('.video:last');
      }
    } else {
      $target = $el.next();
      if (!$target.hasClass('video')) {
        $target = $('.video:first');
      }
    }
    playVideo($target.find('a'));
  });

  $('#modal').on('hidden.bs.modal', stopVideo);

  var scrollToTarget = function(target) {
    $('html, body').animate({scrollTop: $(target).offset().top}, 500);
  };

  /* Main Menu Switch */
  var topPosition;
  $(document).on('scroll', function() {
    topPosition = $(document).scrollTop();

    if(topPosition >= 83)
      $('.navbar-wrapper').addClass('fixed');
    else
      $('.navbar-wrapper').removeClass('fixed');
  });
    /**/

  $(document).ready(function() {

    $('body').fitVids();

    var target = window.location.hash;
    var $target = $(target);

    $('.loading').removeClass('loading');

    $('[data-toggle="tab"]').bind('click touchstart', function() {
      var href = $(this).attr('href');
      if (history.pushState && window.location.href != href)
        history.pushState({}, '', href);
    });

    if ($target.length > 0) {
      $('a[href="' + target + '"]').trigger('click');
      scrollToTarget(target);
    } else {
      var $selectedJob = $('#jobs li[role="presentation"]:first');
      if ($selectedJob.length > 0) {
        $selectedJob.addClass('active');
        $($selectedJob.find('a').attr('href')).addClass('active');
      }
    }
  });
});