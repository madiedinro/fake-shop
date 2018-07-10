import qs from 'qs';


/*
 * Unishop | Universal E-Commerce Template
 * Copyright 2017 rokaux
 * Theme Custom Scripts
 */

jQuery(document).ready(function ($) {
  'use strict';

  // Coupon

  $('.coupon-form').submit(function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    window.fetch('/coupon', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData
    }).then(() => {
      window.openDataLayer.push([
        'event',
        'Coupon Applied',
        {'cart': {'coupon': formData.get('code')} }
      ]);
      $(this).find('button')
        .attr('disabled', 'disabled')
        .removeClass('btn-outline-primary')
        .addClass('btn-outline-success');

    });
  });


  // Форма на странице товара, а также в товарных листингах

  $('.form-add-to-cart').submit(function (event) {

    event.preventDefault();

    const formData = new FormData(event.target);

    window.fetch('/cart', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData
    }).then((result) => {

      const quantity = formData.get('quantity');

      window.openDataLayer.push([
        'event',
        'Product Added',
        {
          product: {
            id: formData.get('slug'),
          },
          quantity: quantity
        }
      ]);


      $(this).find('button')
        .attr('disabled', 'disabled')
        .removeClass('btn-outline-primary')
        .addClass('btn-outline-success');
    })
  });

  // Форма на странице корзины
  $('.form-update-quantity').submit(function (event) {

    event.preventDefault();

    const formData = new FormData(event.target);

    window.fetch('/cart', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData
    }).then((result) => {

      // Обрабатываем удаление

      if (!formData.get('quantity')) {

        window.openDataLayer.push([
          'event',
          'Product Removed',
          {
            product: {
              id: formData.get('slug')
            }
          }
        ]);

        $(this).closest('tr').remove();
      } else {

        window.openDataLayer.push([
          'event',
          'Product Set Quantity',
          {
            quantity: formData.get('quantity'),
            product: {
              id: formData.get('slug'),
            }
          }
        ]);
      }
    })

  });


  $('.cart-line select').on("change", function (event) {
    $(this).closest('form').submit();
  });


  // Check if Page Scrollbar is visible
  //------------------------------------------------------------------------------
  var hasScrollbar = function () {
    // The Modern solution
    if (typeof window.innerWidth === 'number') {
      return window.innerWidth > document.documentElement.clientWidth;
    }

    // rootElem for quirksmode
    var rootElem = document.documentElement || document.body;

    // Check overflow style property on body for fauxscrollbars
    var overflowStyle;

    if (typeof rootElem.currentStyle !== 'undefined') {
      overflowStyle = rootElem.currentStyle.overflow;
    }

    overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;

    // Also need to check the Y axis overflow
    var overflowYStyle;

    if (typeof rootElem.currentStyle !== 'undefined') {
      overflowYStyle = rootElem.currentStyle.overflowY;
    }

    overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;

    var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
    var overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
    var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

    return (contentOverflows && overflowShown) || (alwaysShowScroll);
  };
  if (hasScrollbar()) {
    $('body').addClass('hasScrollbar');
  }


  // Disable default link behavior for dummy links that have href='#'
  //------------------------------------------------------------------------------
  var $emptyLink = $('a[href="#"]');
  $emptyLink.on('click', function (e) {
    e.preventDefault();
  });


  // Sticky Navbar
  //------------------------------------------------------------------------------
  function stickyHeader() {
    var $body = $('body');
    var $navbar = $('.navbar-sticky');
    var $topbarH = $('.topbar').outerHeight();
    var $navbarH = $navbar.outerHeight();
    if ($navbar.length) {
      $(window).on('scroll', function () {
        if ($(this).scrollTop() > $topbarH) {
          $navbar.addClass('navbar-stuck');
          if (!$navbar.hasClass('navbar-ghost')) {
            $body.css('padding-top', $navbarH);
          }
        } else {
          $navbar.removeClass('navbar-stuck');
          $body.css('padding-top', 0);
        }
      });
    }
  }

  stickyHeader();


  // Site Search
  //---------------------------------------------------------
  function searchActions(openTrigger, closeTrigger, clearTrigger, target) {
    $(openTrigger).on('click', function () {
      $(target).addClass('search-visible');
      setTimeout(function () {
        $(target + ' > input').focus();
      }, 200);
    });
    $(closeTrigger).on('click', function () {
      $(target).removeClass('search-visible');
    });
    $(clearTrigger).on('click', function () {
      $(target + ' > input').val('');
      setTimeout(function () {
        $(target + ' > input').focus();
      }, 200);
    });
  }

  searchActions('.toolbar .tools .search', '.close-search', '.clear-search', '.site-search');


  // Language / Currency Switcher
  //---------------------------------------------------------
  $('.lang-currency-switcher').on('click', function () {
    $(this).parent().addClass('show');
    $(this).parent().find('.dropdown-menu').addClass('show');
  });
  $(document).on('click', function (event) {
    if (!$(event.target).closest('.lang-currency-switcher-wrap').length) {
      $('.lang-currency-switcher-wrap').removeClass('show');
      $('.lang-currency-switcher-wrap .dropdown-menu').removeClass('show');
    }
  });


  // Off-Canvas Container
  //---------------------------------------------------------
  function offcanvasOpen(e) {
    var $body = $('body');
    var targetEl = $(e.target).attr('href');
    $(targetEl).addClass('active');
    console.log(targetEl);
    $body.css('overflow', 'hidden');
    $body.addClass('offcanvas-open');
    e.preventDefault();
  }

  function offcanvasClose() {
    var $body = $('body');
    $body.removeClass('offcanvas-open');
    setTimeout(function () {
      $body.css('overflow', 'visible');
      $('.offcanvas-container').removeClass('active');
    }, 450);
  }

  $('[data-toggle="offcanvas"]').on('click', offcanvasOpen);
  $('.site-backdrop').on('click', offcanvasClose);


  // Off-Canvas Menu
  //---------------------------------------------------------
  var menuInitHeight = $('.offcanvas-menu .menu').height(),
    backBtnText = 'Back',
    subMenu = $('.offcanvas-menu .offcanvas-submenu');

  subMenu.each(function () {
    $(this).prepend('<li class="back-btn"><a href="#">' + backBtnText + '</a></li>');
  });

  var hasChildLink = $('.has-children .sub-menu-toggle'),
    backBtn = $('.offcanvas-menu .offcanvas-submenu .back-btn');

  backBtn.on('click', function (e) {
    var self = this,
      parent = $(self).parent(),
      siblingParent = $(self).parent().parent().siblings().parent(),
      menu = $(self).parents('.menu');

    parent.removeClass('in-view');
    siblingParent.removeClass('off-view');
    if (siblingParent.attr("class") === "menu") {
      menu.css('height', menuInitHeight);
    } else {
      menu.css('height', siblingParent.height());
    }

    e.preventDefault();
  });

  hasChildLink.on('click', function (e) {
    var self = this,
      parent = $(self).parent().parent().parent(),
      menu = $(self).parents('.menu');

    parent.addClass('off-view');
    $(self).parent().parent().find('> .offcanvas-submenu').addClass('in-view');
    menu.css('height', $(self).parent().parent().find('> .offcanvas-submenu').height());

    e.preventDefault();
    return false;
  });


  // Animated Scroll to Top Button
  //------------------------------------------------------------------------------
  var $scrollTop = $('.scroll-to-top-btn');
  if ($scrollTop.length > 0) {
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 600) {
        $scrollTop.addClass('visible');
      } else {
        $scrollTop.removeClass('visible');
      }
    });
    $scrollTop.on('click', function (e) {
      e.preventDefault();
      $('html').velocity("scroll", {
        offset: 0,
        duration: 1200,
        easing: 'easeOutExpo',
        mobileHA: false
      });
    });
  }


  // Smooth scroll to element
  //---------------------------------------------------------
  $(document).on('click', '.scroll-to', function (event) {
    var target = $(this).attr('href');
    if ('#' === target) {
      return false;
    }

    var $target = $(target);
    if ($target.length > 0) {
      var $elemOffsetTop = $target.data('offset-top') || 70;
      $('html').velocity("scroll", {
        offset: $(this.hash).offset().top - $elemOffsetTop,
        duration: 1000,
        easing: 'easeOutExpo',
        mobileHA: false
      });
    }
    event.preventDefault();
  });


  // Filter List Groups
  //---------------------------------------------------------
  // var targetList = $();
  function filterList(trigger) {
    trigger.each(function () {
      var self = $(this),
        target = self.data('filter-list'),
        search = self.find('input[type=text]'),
        filters = self.find('input[type=radio]'),
        list = $(target).find('.list-group-item');

      // Search
      search.keyup(function () {
        var searchQuery = search.val();
        list.each(function () {
          var text = $(this).text().toLowerCase();
          (text.indexOf(searchQuery.toLowerCase()) == 0) ? $(this).show() : $(this).hide();
        });
      });

      // Filters
      filters.on('click', function (e) {
        var targetItem = $(this).val();
        if (targetItem !== 'all') {
          list.hide();
          $('[data-filter-item=' + targetItem + ']').show();
        } else {
          list.show();
        }

      });
    });
  }

  filterList($('[data-filter-list]'));


  // Countdown Function
  //------------------------------------------------------------------------------
  // function countDownFunc( items, trigger ) {
  // 	items.each( function() {
  // 		var countDown = $(this),
  // 				dateTime = $(this).data('date-time');
  //
  // 		var countDownTrigger = ( trigger ) ? trigger : countDown;
  // 		countDownTrigger.downCount({
  // 	      date: dateTime,
  // 	      offset: +10
  // 	  });
  // 	});
  // }
  // countDownFunc( $('.countdown') );


  // Toast Notifications
  //------------------------------------------------------------------------------
  $('[data-toast]').on('click', function () {

    var self = $(this),
      $type = self.data('toast-type'),
      $icon = self.data('toast-icon'),
      $position = self.data('toast-position'),
      $title = self.data('toast-title'),
      $message = self.data('toast-message'),
      toastOptions = '';

    switch ($position) {
      case 'topRight':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topRight',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInLeft',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'bottomRight':
        toastOptions = {
          class: 'iziToast-' + $type,
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'bottomRight',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInLeft',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'topLeft':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topLeft',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInRight',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'bottomLeft':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'bottomLeft',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInRight',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'topCenter':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topCenter',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInDown',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      case 'bottomCenter':
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'bottomCenter',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInUp',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
        break;
      default:
        toastOptions = {
          class: 'iziToast-' + $type || '',
          title: $title || 'Title',
          message: $message || 'toast message',
          animateInside: false,
          position: 'topRight',
          progressBar: false,
          icon: $icon,
          timeout: 3200,
          transitionIn: 'fadeInLeft',
          transitionOut: 'fadeOut',
          transitionInMobile: 'fadeIn',
          transitionOutMobile: 'fadeOut'
        };
    }

    iziToast.show(toastOptions);
  });


  // Wishlist Button
  //------------------------------------------------------------------------------
  $('.btn-wishlist').on('click', function () {
    var iteration = $(this).data('iteration') || 1,
      toastOptions = {
        title: 'Product',
        animateInside: false,
        position: 'topRight',
        progressBar: false,
        timeout: 3200,
        transitionIn: 'fadeInLeft',
        transitionOut: 'fadeOut',
        transitionInMobile: 'fadeIn',
        transitionOutMobile: 'fadeOut'
      };

    switch (iteration) {
      case 1:
        $(this).addClass('active');
        toastOptions.class = 'iziToast-info';
        toastOptions.message = 'added to your wishlist!';
        toastOptions.icon = 'icon-bell';
        break;

      case 2:
        $(this).removeClass('active');
        toastOptions.class = 'iziToast-danger';
        toastOptions.message = 'removed from your wishlist!';
        toastOptions.icon = 'icon-ban';
        break;
    }

    iziToast.show(toastOptions);

    iteration++;
    if (iteration > 2) iteration = 1;
    $(this).data('iteration', iteration);
  });


  // Isotope Grid / Filters (Gallery)
  //------------------------------------------------------------------------------

  // Isotope Grid
  if ($('.isotope-grid').length) {
    var $grid = $('.isotope-grid').imagesLoaded(function () {
      // var $grid = $('.isotope-grid');
      $grid.isotope({
        itemSelector: '.grid-item',
        transitionDuration: '0.7s',
        masonry: {
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer'
        }
      });
    });
  }

  // Filtering
  if ($('.filter-grid').length > 0) {
    var $filterGrid = $('.filter-grid');
    $('.nav-pills').on('click', 'a', function (e) {
      e.preventDefault();
      $('.nav-pills a').removeClass('active');
      $(this).addClass('active');
      var $filterValue = $(this).attr('data-filter');
      $filterGrid.isotope({filter: $filterValue});
    });
  }


  // Shop Categories Widget
  //------------------------------------------------------------------------------
  var categoryToggle = $('.widget-categories .has-children > a');

  function closeCategorySubmenu() {
    categoryToggle.parent().removeClass('expanded');
  }

  categoryToggle.on('click', function (e) {
    if ($(e.target).parent().is('.expanded')) {
      closeCategorySubmenu();
    } else {
      closeCategorySubmenu();
      $(this).parent().addClass('expanded');
    }
  });



});
