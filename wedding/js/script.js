
// Flickr widget
function flickIt(jQuerySelector, displayType, photosetId, opt_cbk){
    jQuerySelector.html('loading...');
    jQuerySelector.flickr({
        api_key: "7b5f9448ae4547ff02d6ce3db22e482d",
        type: 'photoset',
        photoset_id: photosetId,
        size: 'o',
        thumb_size: 'n',
        displayType: displayType,
        callback: function(){
            // lightbox
            if (displayType === 'fancybox'){
              $('a').fancybox();
            }
            // callback
            if (opt_cbk){
                opt_cbk(jQuerySelector);
            }
        },
        error: function(e){
            jQuerySelector.html('Error loading flickr gallery. ' + e);
        }
    });
}

function slideIt(jQuerySelector){
    $(jQuerySelector).find('ul > li:gt(0)').css('opacity', '0');
    setInterval(function() {
      $(jQuerySelector).find('ul > li:first')
        .fadeOut(1000)
        .next()
        .css('opacity', '1')
        .fadeIn(1000)
        .end()
        .appendTo($(jQuerySelector).find('ul'));
    },  10000);
}
function getPhotosetId(pageName){
    return pageName;
    //return albums[pageName] || albums['default'];
}
function onPageChange(newUrl){
    var currentPage = newUrl.substr(newUrl.indexOf('#!page-') + 7);
    window.jQuerySelector = $(".gallery");
    flickIt(jQuerySelector, 'fancybox', getPhotosetId(currentPage));
}
$(function(){
    window.jQuerySelector = $(".slideshow .silex-element-content");
    //flickIt(jQuerySelector, 'slideshow', albums.home, slideIt);
    var currentPage = $('body').pageable().data()['silexlabs-pageable'].options.currentPage;
    currentPage = currentPage.substr(currentPage.indexOf('page-') + 5);
    flickIt(jQuerySelector, 'slideshow', currentPage, slideIt);
    onPageChange(window.location.href);
})
$(window).bind( 'hashchange', function (e){
    onPageChange(window.location.href);
});
// end of flickr widget
        /*
         * active menu widget for Silex
         * create an element which links to an anchor, e.g. an element with a link to #anchor1
         * add the css class "anchor-link" to this element
         * create an element which is the anchor, e.g. an element with the css class "anchor1"
         * when the user clicks on the link, the scroll slides until the element is visible
         * when the user slides and the element is visible, the link gets a css class "active-menu"
         */
        $(function() {
            // Cache selectors
            var lastId,
            // All list items
            menuItems = $(".anchor-link a");
            $(menuItems[0]).addClass("active-menu");
            // Anchors corresponding to menu items
            // find the name of the elements which are anchors
            var scrollItems = menuItems.map(function(){
                // the names are in the href attribute of the anchor links
                var attr = $(this).attr("data-silex-href") || $(this).attr("href");
                // case of a link in text field or an external link after publish
                $(this).find("[href]").each(function() {
                    attr = $(this).attr("href");
                });
                // case of an "external link" before publish
                $(this).find("[data-silex-href]").each(function() {
                    attr = $(this).attr("href");
                });
                // the links to anchors are expected to start with #
                if(attr && attr.indexOf("#") === 0) {
                    var name = attr.substring(1);
                    var item = $("." + name);
                    // check if there is a hash in the URL to scroll to the anchor at start
                    if(window.location.hash.indexOf(name) === 1) {
                        var offsetTop = item.offset().top;
                        $('html, body').stop().animate({
                            scrollTop: offsetTop - 85
                        }, 300);
                    }
                    // now find the element itself, which has the name as a css class
                    if (item.length) { return {
                            "link": this,
                            "item": item.get(0)
                        };
                    }
                }
            });
            // Bind click handler to menu items
            // so we can get a fancy scroll animation
            scrollItems.each(function() {
                var link = this.link;
                var item = this.item;
                var offsetTop = $(item).offset().top;
                $(link).click(function(e){
                  $('html, body').stop().animate({
                      scrollTop: offsetTop - 85
                  }, 300);
                  e.preventDefault();
                });
            })
        
            // Bind to scroll
            $(window).scroll(function(){
               // Get container scroll position
               var fromTop = $(this).scrollTop();
               // Get id of current scroll item
               var cur = scrollItems.map(function(){
                 if ($(this.item).offset().top  - 85 <= fromTop)
                   return this;
               });
               // add the css class on the current menu item
               $(".active-menu").removeClass("active-menu");
               if(cur.length > 0) {
                   cur = cur[cur.length-1];
                   $(cur.link).addClass("active-menu");
               }
            });
        });
    