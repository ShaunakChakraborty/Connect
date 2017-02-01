var PageTransitions = (function () {

    var $main = $('#pt-main'),
		$pages = $main.children('div.pt-page'),
		$iterate = $('.iterateEffects'),
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
		    'WebkitAnimation': 'webkitAnimationEnd',
		    'OAnimation': 'oAnimationEnd',
		    'msAnimation': 'MSAnimationEnd',
		    'animation': 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
		// support css animations
		support = Modernizr.cssanimations;

    function init() {

        $pages.each(function () {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });

        $pages.eq(current).addClass('pt-page-current');

        $iterate.on('click', function () {
            if (isAnimating) {
                return false;
            }
            nextPage($(this).attr("data-link"));
        });

    }

    function nextPage(options) {
        if (isAnimating) {
            return false;
        }
        isAnimating = true;
        var $currPage = $pages.eq(current);
        current = options;

        var $nextPage = $pages.eq(options).addClass('pt-page-current'),
			outClass = '', inClass = '';

        outClass = 'pt-page-flipOutTop';
        inClass = 'pt-page-flipInBottom pt-page-delay500';


        $currPage.addClass(outClass).on(animEndEventName, function () {
            $currPage.off(animEndEventName);
            endCurrPage = true;
            if (endNextPage) {
                onEndAnimation($currPage, $nextPage);
            }
        });

        $nextPage.addClass(inClass).on(animEndEventName, function () {
            $nextPage.off(animEndEventName);
            endNextPage = true;
            if (endCurrPage) {
                onEndAnimation($currPage, $nextPage);
            }
        });

        if (!support) {
            onEndAnimation($currPage, $nextPage);
        }

    }

    function onEndAnimation($outpage, $inpage) {
        endCurrPage = false;
        endNextPage = false;
        resetPage($outpage, $inpage);
        isAnimating = false;
        if ($inpage.hasClass("pt-page-2"))
            setTimeout(function () { window.location.assign("https://j99.in"); }, 200);
        if ($inpage.hasClass("pt-page-3"))
            setTimeout(function () { window.location.assign("https://facebook.com/boomboxninjas.in"); }, 200);
    }

    function resetPage($outpage, $inpage) {
        $outpage.attr('class', $outpage.data('originalClassList'));
        $inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
    }

    init();

    return {
        init: init,
        nextPage: nextPage,
    };

})();