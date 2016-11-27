//---- Custom JS functionalities ----//
'use strict';

//---- Module - Trigger ----//
/*
  * Usage *
    If you want to use this module:
    1. Add class js-trigger to button
    2. To the same button add data-trigger-element=".box-to-show"
    3. Add class is-inactive to button and ".box-to-show" element
    Now script will add class is-active on first click, on second click
    class will be removed and replaced with is-inactive class, both on button
    and target element.

    You may want to trigger only closest element in case you have multiple
    targets, just add data-trigger-closest="true" to each button.
*/

var trigger = {

    // Some defaults
    triggerElement: $('.js-trigger'),
    triggerDataName: 'trigger-element',
    triggerActiveClass: 'is-active',
    triggerInActiveClass: 'is-inactive',

    init: function() {

        // We want every button to work on their own
        trigger.triggerElement.each(function(i, element) {

            // Add class if not exists
            trigger.checkClass(element);

            // Button on click
            trigger.clickEvent(element);

        });

    },

    action: function(target) {

        // Get element to trigger
        var triggered = $(target).data(trigger.triggerDataName);
        var closest = $(target).next(triggered);


        // If target is not active
        if ($(target).hasClass(trigger.triggerInActiveClass)) {

            // Remove is-inactive class and add is-active class on button
            $(target).removeClass(trigger.triggerInActiveClass);
            $(target).addClass(trigger.triggerActiveClass);

            // Check if we should look only for closest element
            if ($(target).data('trigger-closest')) {
                // Remove is-inactive class and add is-active class on element from data attr
                $(closest).removeClass(trigger.triggerInActiveClass);
                $(closest).addClass(trigger.triggerActiveClass);
            } else {
                // Remove is-inactive class and add is-active class on element from data attr
                $(triggered).removeClass(trigger.triggerInActiveClass);
                $(triggered).addClass(trigger.triggerActiveClass);
            }

        } else {

            // Remove is-active class and add is-inactive class on button
            $(target).addClass(trigger.triggerInActiveClass);
            $(target).removeClass(trigger.triggerActiveClass);

            // Check if we should look only for closest element
            if ($(target).data('trigger-closest')) {
                // Remove is-active class and add is-inactive class on element from data attr
                $(closest).addClass(trigger.triggerInActiveClass);
                $(closest).removeClass(trigger.triggerActiveClass);
            } else {
                // Remove is-active class and add is-inactive class on element from data attr
                $(triggered).addClass(trigger.triggerInActiveClass);
                $(triggered).removeClass(trigger.triggerActiveClass);
            }

        }

    },

    checkClass: function(target) {

        // Get element to trigger
        var triggered = $(target).data(trigger.triggerDataName);

        // If is-inactive isn't set, but we have init on element
        if (!$(target).hasClass(trigger.triggerInActiveClass)) {

            // Add is-inactive class to button
            $(target).addClass(trigger.triggerInActiveClass);

            // Add is-inactive class to trigger
            $(triggered).addClass(trigger.triggerInActiveClass);

        }

    },

    clickEvent: function(element) {

        // Click with element from init function
        $(element).on('click', function(e) {

            // Prevent default link behaviour
            e.preventDefault();

            // Call action with that element
            trigger.action(element);
        });

    }

};
//---- Module - End ----//

var font_sizer = {
    font_sizer_container: document.getElementById('js_font_sizer'),
    font_sizer_slider: document.getElementById('js_ui_slider'),
    font_sizer_minus: document.getElementById('js_font_sizer_minus'),
    font_sizer_value: document.getElementById('js_font_sizer_value'),
    font_sizer_plus: document.getElementById('js_font_sizer_plus'),

    init: function() {

        $(font_sizer.font_sizer_slider).slider({
            range: "min",
            value: 14,
            min:  14,
            max: 18,
            step: 1,
            slide: function( event, ui ) {
                font_sizer.calculate_slide(ui.value);
            }
        });

        font_sizer.plus_click();

        font_sizer.minus_click();

        font_sizer.set_size_on_load();

    },

    plus_click: function() {

        $(font_sizer.font_sizer_plus).click(function() {

            var value = $( font_sizer.font_sizer_slider ).slider("value"),
                step = $( font_sizer.font_sizer_slider ).slider("option", "step"),
                calculated = value + step;

            if(calculated <= 18) {
                font_sizer.calculate_slide(calculated);
            }

        });

    },

    minus_click: function() {

        $(font_sizer.font_sizer_minus).click(function() {

            var value = $( font_sizer.font_sizer_slider ).slider("value"),
                step = $( font_sizer.font_sizer_slider ).slider("option", "step"),
                calculated = value - step;

            if(calculated > 13) {

                font_sizer.calculate_slide(calculated);
            }

        });

    },

    set_size_on_load: function() {

        var cookie_data = Cookies.get('current-font-size'),
            font,
            value;

        switch (cookie_data) {

            case '62.5':
                font = '62.5';
                value = 14;
            break;

            case '68.5':
                font = '68.5';
                value = 15;
            break;

            case '78.5':
                font = '78.5';
                value = 16;
            break;

            case '88.5':
                font = '88.5';
                value = 17;
            break;

            case '98.5':
                font = '98.5';
                value = 18;
            break;


            default:
                font = '62.5';
                value = 14;

        };

        font_sizer.calculate_slide(value);

        $('html').css({'font-size': font + '%'});


    },

    calculate_slide: function(font_sizer_slider_value) {
        var font_sizer_slider_value = font_sizer_slider_value.toFixed(),
            font_sizer_slider_value_number = parseInt(font_sizer_slider_value),
            font_sizer_font;

        switch (font_sizer_slider_value_number) {
            case 14:
                font_sizer_font = '62.5';
            break;

            case 15:
                font_sizer_font = '68.5';
            break;

            case 16:
                font_sizer_font = '78.5';
            break;

            case 17:
                font_sizer_font = '88.5';
            break;

            case 18:
                font_sizer_font = '98.5';
            break;

            default:
                font_sizer_font = '62.5';
        };

        $( font_sizer.font_sizer_slider ).slider("value", font_sizer_slider_value);

        $( font_sizer.font_sizer_value ).text(font_sizer_slider_value);

        $('html').css({'font-size': font_sizer_font + '%'});

        Cookies.set('current-font-size', font_sizer_font, { expires: 365 });
    }

};

var theme_picker = {
    theme_picker_container: document.getElementById('js_theme_picker'),
    theme_picker_close_button: document.getElementById('js_modal_close'),
    theme_picker_enabled: document.getElementById('js_modal_versions_enabled'),
    theme_picker_close_text: $('.m-versions__modal .m-modal__close-text'),
    theme_picker_open_text: $('.m-versions__modal .m-modal__open-text'),

    init: function() {

        var default_size = $( theme_picker.theme_picker_close_button ).data('default-size'),
            default_theme = $( theme_picker.theme_picker_close_button ).data('default-theme'),
            default_state = $( theme_picker.theme_picker_close_button ).data('enabled');

        $( theme_picker.theme_picker_container ).find('.m-theme-picker__link').click(function(e){
            e.preventDefault();

            var get_data = $(this).data('theme');

                $('body').removeClass('t-white t-yellow t-yellow-black t-black').addClass(get_data);

                theme_picker.change_button('open');

                Cookies.set('current-theme', get_data, { expires: 365 });

        });


        $( theme_picker.theme_picker_close_button ).click(function(e){
            e.preventDefault();

            if ( theme_picker.theme_picker_close_text.hasClass('is-hidden') ) {

                $('body').removeClass('t-white t-yellow t-yellow-black t-black').addClass(default_theme);

                theme_picker.change_button('open');

                font_sizer.calculate_slide(default_size);

                Cookies.set('current-theme', default_theme, { expires: 365 });

            } else {

                    $('body').removeClass('t-white t-yellow t-yellow-black t-black');

                    theme_picker.change_button('close');

                    $( font_sizer.font_sizer_slider ).slider("value", 14);

                    font_sizer.calculate_slide(14);

                    $('html').css({'font-size':'62.5%'});

                    Cookies.remove('current-theme');

                    Cookies.remove('current-font-size');

            }


        });

        theme_picker.set_theme_on_load();

    },

    set_theme_on_load: function() {

        var cookie_data = Cookies.get('current-theme');

        switch (cookie_data) {

            case 't-yellow':
                $('body').addClass('t-yellow');
                theme_picker.change_button('open');
            break;

            case 't-yellow-black':
                $('body').addClass('t-yellow-black');
                theme_picker.change_button('open');
            break;

            case 't-black':
                $('body').addClass('t-black');
                theme_picker.change_button('open');
            break;

            case 't-white':
                $('body').addClass('t-white');
                theme_picker.change_button('open');
            break;

        };

    },

    change_button: function(type) {

        if(type == 'open') {

            $( theme_picker.theme_picker_close_text ).removeClass('is-hidden');
            $( theme_picker.theme_picker_open_text ).addClass('is-hidden');
            $( theme_picker.theme_picker_close_button ).attr('data-enabled', '1');
            $( theme_picker.theme_picker_enabled ).removeClass('is-inactive');
            theme_picker.change_images('open');
        }

        if(type == 'close') {

            $( theme_picker.theme_picker_close_text ).addClass('is-hidden');
            $( theme_picker.theme_picker_open_text ).removeClass('is-hidden');
            $( theme_picker.theme_picker_close_button ).attr('data-enabled', '0');
            $( theme_picker.theme_picker_enabled ).addClass('is-inactive');
            theme_picker.change_images('close');

        }
    },

    theme_list: function() {
        var themes_list = [];

        $( theme_picker.theme_picker_container ).find('.m-theme-picker__item').each(function(i,e){

            var link = $(this).find('.m-theme-picker__link'),
                data = $( link ).data('theme');

                themes_list.push(data);

        });

        return themes_list;
    },

    change_images: function(type) {
        var img = $('img[data-disability-image]');

        img.each(function(i,e){

            var data = $(this).data('disability-image'),
                data_old = $(this).data('normal-image');

            if(type == 'open') {
                $(this).attr('src', data);
            }

            if(type == 'close') {
                $(this).attr('src', data_old);
            }

        });
    }

};

var range_slider = {
    range_slider_instance: $('.m-slider--range'),

    init: function() {

        range_slider.range_slider_instance.each( function(i,e){

            var slider = $(this),
                element = $(this).find('.m-slider__element'),
                amount = $(this).find('.m-slider__current strong'),
                slider_max_option = slider.data('range-max'),
                slider_min_option = slider.data('range-min'),
                slider_current_option = slider.data('range-current'),
                slider_currency_option = slider.data('range-currency');



                $(element).slider({
                    range: true,
                    min: slider_min_option,
                    max: slider_max_option,
                    values: [ 0, 300 ],
                    slide: function( event, ui ) {
                        $( amount ).html( ui.values[ 0 ] + " " + slider_currency_option + " - " + ui.values[ 1 ] + " " + slider_currency_option);
                    }
                });

                $( amount  ).html( $( element ).slider( "values", 0 ) + " " + slider_currency_option + " - " +  $( element ).slider( "values", 1 )  + " " + slider_currency_option );

        });




    }

};

var sticky_kit = {
    sticky_kit_element: $('.js-sticky-element'),

    init: function() {

        sticky_kit.sticky_kit_element.stick_in_parent({
            offset_top: -500,
        });

        if(sticky_kit.sticky_kit_element.hasClass('l-header--hide-slide')) {

            sticky_kit.sticky_kit_element.on("sticky_kit:unstick", function(e) {
                sticky_kit.sticky_kit_element.animate('position', 'static');
            });

        }

    }
};

var main_nav = {
    main_nav_element: document.getElementById('js_main_menu'),

    init: function() {
        var menu_element = $( main_nav.main_nav_element ).find('.m-menu__item');

        $(menu_element).each( function(i,e){

            $(this).hover( function(){
                $(this).addClass('m-menu--open');
            }, function() {
                $(this).removeClass('m-menu--open');
            });

        });
    },

};

var back_to_top = {
    back_to_top_element: document.getElementById('js_back_to_top'),

    init: function() {
        back_to_top.show_button(window);
        back_to_top.on_scroll();
        back_to_top.on_click();
    },

    on_click: function() {

        $( back_to_top.back_to_top_element ).click(function(e){
            e.preventDefault();

            $('html, body').animate({scrollTop:0}, '1000');

        });

    },

    show_button: function(container) {
          if($(container).scrollTop() > 300){

            $( back_to_top.back_to_top_element ).fadeIn('2000');

          } else {

            $( back_to_top.back_to_top_element ).fadeOut('500');

          }

    },

    on_scroll: function() {

        $(window).scroll(function() {

            back_to_top.show_button(this);

        });
    },

};


var popup = {

    popup_wrapper: $('.popup__wrapper'),
    popup_close: $('.popup__close'),


    init: function() {

    },

    show_popup: function() {

    },

    check_cookies: function() {

    },

    positions: function() {

    },

    easings: function() {

    },

};


var cookie_info = {
    cookie_info_element: document.getElementById('js_cookie_info'),

    init: function() {

    },

    show_info: function() {

    },

    hide_info: function() {

    },

    check_cookie: function() {

    },

};





// Dynamic behaviour of the page implemented as an Immediately-Invoked Function Expression
(function($, window, document) {
    // $ is locally scoped

    $(function() {
        // Here codes the code that needs the DOM to be ready



        font_sizer.init();

        trigger.init();

        theme_picker.init();

        range_slider.init();

        sticky_kit.init();

        main_nav.init();

        back_to_top.init();


        $('.m-menu--submenu').first().addClass('first');


        $('select').selectric();

        var js_turncate = $('.js-turncate');

        js_turncate.each(function() {
          var size_bb = $(this).data('turncate-length');

          $(this).dotdotdot({
        		watch: true,
            wrap: 'letter',
        	});

        })




        var input = $('input[type="text"]');

        input.each( function(i,e){

            // Remove/add placeholder on focus to all inputs
            if($(this).attr('placeholder')) {

                $(this).data('holder',$(this).attr('placeholder'));

                $(this).focusin(function(){

                    $(this).attr('placeholder','');

                });

                $(this).focusout(function(){

                    $(this).attr('placeholder',$(this).data('holder'));

                });

            };

        });



        var tabs = $( '.m-tabs' );

        tabs.each( function(i,e){

            var element = $( this ).find( 'li' ),
                tab = $( this ).find('.m-tabs__content');

                element.click( function(e){

                    var tab_id = $(this).attr('data-tab');

                    element.removeClass('is-active');
                    tab.removeClass('is-active');

                    $(this).addClass('is-active');
                    $("#"+tab_id).addClass('is-active');

                });

        });

        // $('ul.tabs li').click(function(){
        // 	var tab_id = $(this).attr('data-tab');
        //
        // 	$('ul.tabs li').removeClass('current');
        // 	$('.tab-content').removeClass('current');
        //
        // 	$(this).addClass('current');
        // 	$("#"+tab_id).addClass('current');
        // });




        var menu = $('.m-menu');

        menu.each( function(i,e){

            var menu_element = $(this).find('.m-menu__item');

            menu_element.on('click', function(){
                menu_element.removeClass('m-menu__item--current');
                $(this).addClass('m-menu__item--current');
            })

        });

    });


    //
    // Here goes the code that does not need to wait for the DOM
    //

}(window.jQuery, window, document));
